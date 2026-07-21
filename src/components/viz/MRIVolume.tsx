import { useEffect, useMemo, useRef } from "react";
import { REGIMES } from "./constants";

/**
 * A synthetic axial brain volume, rendered slice by slice.
 *
 * Nothing here is patient data — the volume is generated analytically
 * (skull, parenchyma, ventricles, a lesion) and then degraded according to
 * the selected few-shot regime, so the fidelity you see tracks the ablation
 * numbers reported alongside it. Scrub z to move through the stack.
 */

const N = 112; // matches the 112³ crops used in training

/* ── Value noise ─────────────────────────────────────────── */

function hash3(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
const smooth = (t: number) => t * t * (3 - 2 * t);

function valueNoise(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const zf = smooth(z - zi);
  let acc = 0;
  for (let dz = 0; dz <= 1; dz++) {
    for (let dy = 0; dy <= 1; dy++) {
      for (let dx = 0; dx <= 1; dx++) {
        const w =
          (dx ? xf : 1 - xf) * (dy ? yf : 1 - yf) * (dz ? zf : 1 - zf);
        acc += hash3(xi + dx, yi + dy, zi + dz) * w;
      }
    }
  }
  return acc;
}

function fbm(x: number, y: number, z: number, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += valueNoise(x * freq, y * freq, z * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.05;
  }
  return sum / norm;
}

/* ── Volume synthesis ────────────────────────────────────── */

/** Intensity of the clean volume at voxel (x,y,z), all in [0,1] space. */
function tissue(x: number, y: number, z: number) {
  // centred, normalized coordinates
  const cx = (x / N) * 2 - 1;
  const cy = (y / N) * 2 - 1;
  const cz = (z / N) * 2 - 1;

  // head is an ellipsoid; slices near the poles are naturally smaller
  const head = Math.sqrt((cx / 0.82) ** 2 + (cy / 0.94) ** 2 + (cz / 0.9) ** 2);
  if (head > 1) return 0;

  let v = 0;

  // skull + scalp: bright rind
  if (head > 0.9) v = 0.62 - (head - 0.9) * 2.2;
  else if (head > 0.85) v = 0.3;
  else {
    // parenchyma with gyral texture
    const g = fbm(x * 0.085, y * 0.085, z * 0.085, 4);
    const g2 = fbm(x * 0.22 + 11, y * 0.22, z * 0.22, 3);
    v = 0.44 + g * 0.3 + g2 * 0.12;

    // lateral ventricles: dark butterfly near the midline
    const vx = Math.abs(cx) - 0.13;
    const vent = Math.sqrt((vx / 0.14) ** 2 + (cy / 0.34) ** 2 + (cz / 0.3) ** 2);
    if (vent < 1) v *= 0.22 + vent * 0.5;

    // midline fissure
    if (Math.abs(cx) < 0.016 && head < 0.8) v *= 0.45;
  }

  // diffuse glioma: hyperintense core with an infiltrating margin,
  // deliberately off-midline in the left hemisphere
  const lx = cx + 0.3;
  const ly = cy - 0.14;
  const lz = cz + 0.05;
  const les = Math.sqrt((lx / 0.26) ** 2 + (ly / 0.22) ** 2 + (lz / 0.24) ** 2);
  const wobble = fbm(x * 0.11 + 40, y * 0.11 + 40, z * 0.11, 3) * 0.34;
  const edge = les + wobble - 0.34;
  if (edge < 1 && head < 0.86) {
    const core = Math.max(0, 1 - edge);
    v = v * (1 - core * 0.85) + (0.78 + fbm(x * 0.3, y * 0.3, z * 0.3, 2) * 0.22) * core * 0.85;
  }

  return Math.max(0, Math.min(1, v));
}

export default function MRIVolume({
  regimeIndex,
  slice,
  className,
}: {
  regimeIndex: number;
  slice: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const regime = REGIMES[regimeIndex] ?? REGIMES[1];

  // Slices are pure functions of (z, fidelity) — memoize the current one.
  const z = useMemo(() => Math.round(Math.max(0, Math.min(N - 1, slice))), [slice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = N;
    canvas.height = N;
    const img = ctx.createImageData(N, N);
    const data = img.data;

    const f = regime.fidelity;
    // Lower-shot regimes: blurrier structure, more residual sampling noise.
    const blurStrength = (1 - f) * 1.6;
    const grain = (1 - f) * 0.13;

    const raw = new Float32Array(N * N);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        raw[y * N + x] = tissue(x, y, z);
      }
    }

    // Cheap separable box blur, repeated to approximate the fidelity loss.
    const passes = Math.round(blurStrength * 2);
    let buf = raw;
    for (let p = 0; p < passes; p++) {
      const out = new Float32Array(N * N);
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          let s = 0;
          let c = 0;
          for (let d = -1; d <= 1; d++) {
            const xx = x + d;
            const yy = y + d;
            if (xx >= 0 && xx < N) {
              s += buf[y * N + xx];
              c++;
            }
            if (yy >= 0 && yy < N) {
              s += buf[yy * N + x];
              c++;
            }
          }
          out[y * N + x] = s / c;
        }
      }
      buf = out;
    }

    // Rendered white-on-black like an actual scanner console, in both themes —
    // inverting it to ink-on-paper hides the ventricles and the lesion margin.
    for (let i = 0; i < N * N; i++) {
      let v = buf[i];
      if (grain > 0 && v > 0.01) v += (Math.random() - 0.5) * grain;
      v = Math.max(0, Math.min(1, v));

      // window/level: stretch the tissue band across the full display range
      const win = Math.max(0, Math.min(1, (v - 0.12) / 0.72));
      const lum = 255 * Math.pow(win, 0.85);

      // hot voxels carry a warm cast so the lesion reads as a lesion
      const hot = Math.max(0, win - 0.72) / 0.28;
      const o = i * 4;
      data[o] = Math.min(255, lum + hot * 40);
      data[o + 1] = lum * (1 - hot * 0.42);
      data[o + 2] = lum * (1 - hot * 0.62);
      data[o + 3] = 255;
    }

    ctx.putImageData(img, 0, 0);
  }, [z, regime.fidelity]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={`Synthetic axial brain slice ${z} of ${N}, ${regime.shots}-shot regime`}
      style={{ imageRendering: "auto", width: "100%", display: "block" }}
    />
  );
}
