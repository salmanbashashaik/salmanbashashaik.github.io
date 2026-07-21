import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Drag a sample around a 2-D latent space and watch it leave the training
 * manifold.
 *
 * Five labelled clusters stand in for the cohorts a model was fit on. The
 * query point's score is a max over Gaussian kernels centred on each cluster —
 * high inside the support, collapsing as you move into the gaps between
 * cohorts. It is an illustration of the regime, not a trained detector, and it
 * is the regime every result on this page is actually evaluated in.
 */

type Cluster = {
  id: string;
  label: string;
  /** centre in normalized [0,1] space */
  cx: number;
  cy: number;
  spread: number;
  n: number;
  tone: "cyan" | "red" | "amber" | "ink";
};

const CLUSTERS: Cluster[] = [
  { id: "acvd", label: "ACVD", cx: 0.22, cy: 0.3, spread: 0.1, n: 60, tone: "red" },
  { id: "mc_cvd", label: "MetaCardis-CVD", cx: 0.44, cy: 0.17, spread: 0.11, n: 70, tone: "red" },
  { id: "qin", label: "Qin T2D", cx: 0.3, cy: 0.68, spread: 0.1, n: 58, tone: "cyan" },
  { id: "karlsson", label: "Karlsson T2D", cx: 0.58, cy: 0.78, spread: 0.085, n: 40, tone: "cyan" },
  { id: "mc_t2d", label: "MetaCardis-T2D", cx: 0.7, cy: 0.46, spread: 0.12, n: 80, tone: "cyan" },
];

type Dot = { x: number; y: number; c: number; r: number };

/** Deterministic jitter so the cloud is stable across renders. */
function seeded(i: number) {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function buildDots(): Dot[] {
  const out: Dot[] = [];
  let k = 1;
  CLUSTERS.forEach((c, ci) => {
    for (let i = 0; i < c.n; i++) {
      // Box–Muller from the deterministic sequence
      const u1 = Math.max(1e-6, seeded(k++));
      const u2 = seeded(k++);
      const mag = Math.sqrt(-2 * Math.log(u1)) * c.spread * 0.55;
      out.push({
        x: c.cx + mag * Math.cos(2 * Math.PI * u2),
        y: c.cy + mag * Math.sin(2 * Math.PI * u2),
        c: ci,
        r: 1.1 + seeded(k++) * 1.3,
      });
    }
  });
  return out;
}

const DOTS = buildDots();

/** Support score in [0,1]: max Gaussian kernel over the training clusters. */
function support(x: number, y: number) {
  let best = 0;
  let nearest = 0;
  CLUSTERS.forEach((c, i) => {
    const d2 = (x - c.cx) ** 2 + (y - c.cy) ** 2;
    const s = Math.exp(-d2 / (2 * c.spread * c.spread));
    if (s > best) {
      best = s;
      nearest = i;
    }
  });
  return { score: best, nearest };
}

export default function LatentMap({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [q, setQ] = useState({ x: 0.47, y: 0.47 });
  const qRef = useRef(q);
  qRef.current = q;
  const dragging = useRef(false);

  const { score, nearest } = support(q.x, q.y);
  const verdict =
    score > 0.6 ? "in distribution" : score > 0.22 ? "near the edge" : "out of distribution";

  const toNorm = useCallback((e: PointerEvent | React.PointerEvent, el: HTMLCanvasElement) => {
    const r = el.getBoundingClientRect();
    return {
      x: Math.max(0.02, Math.min(0.98, (e.clientX - r.left) / r.width)),
      y: Math.max(0.02, Math.min(0.98, (e.clientY - r.top) / r.height)),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let live = true;
    const colors = {
      ink: "#16130f",
      ink3: "#8d8578",
      paper: "#f4efe4",
      red: "#9c2f18",
      cyan: "#1b6a72",
      amber: "#a06a12",
      rule: "rgba(0,0,0,.12)",
    };
    const read = () => {
      const cs = getComputedStyle(document.documentElement);
      colors.ink = cs.getPropertyValue("--ink").trim() || colors.ink;
      colors.ink3 = cs.getPropertyValue("--ink-3").trim() || colors.ink3;
      colors.paper = cs.getPropertyValue("--paper").trim() || colors.paper;
      colors.red = cs.getPropertyValue("--red").trim() || colors.red;
      colors.cyan = cs.getPropertyValue("--cyan").trim() || colors.cyan;
      colors.amber = cs.getPropertyValue("--amber").trim() || colors.amber;
      colors.rule = cs.getPropertyValue("--rule").trim() || colors.rule;
    };
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const toneOf = (t: Cluster["tone"]) =>
      t === "cyan" ? colors.cyan : t === "red" ? colors.red : t === "amber" ? colors.amber : colors.ink;

    let pulse = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!live) return;
      pulse += 0.03;
      ctx.clearRect(0, 0, w, h);

      // support contours: one soft ring per cohort, marking where the model
      // still has training mass
      for (const c of CLUSTERS) {
        const g = ctx.createRadialGradient(
          c.cx * w,
          c.cy * h,
          0,
          c.cx * w,
          c.cy * h,
          c.spread * Math.min(w, h) * 2.1
        );
        g.addColorStop(0, toneOf(c.tone));
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(c.cx * w, c.cy * h, c.spread * Math.min(w, h) * 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // training samples
      for (const d of DOTS) {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = toneOf(CLUSTERS[d.c].tone);
        ctx.beginPath();
        ctx.arc(d.x * w, d.y * h, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // cohort labels
      ctx.font = '400 9.5px "JetBrains Mono", monospace';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const c of CLUSTERS) {
        ctx.fillStyle = colors.ink3;
        // Clamp inside the box — a cluster near the top edge would otherwise
        // have its label cropped off the canvas.
        const ly = Math.max(11, c.cy * h - c.spread * Math.min(w, h) * 1.55);
        ctx.fillText(c.label, Math.max(46, Math.min(w - 46, c.cx * w)), ly);
      }

      // the query point, plus a line to whichever cohort is nearest
      const { x, y } = qRef.current;
      const { score: s, nearest: ni } = support(x, y);
      const near = CLUSTERS[ni];
      const px = x * w;
      const py = y * h;

      ctx.setLineDash([2, 4]);
      ctx.strokeStyle = s > 0.22 ? colors.ink : colors.red;
      ctx.globalAlpha = 0.4;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(near.cx * w, near.cy * h);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // an alarm ring that grows and reddens as support falls away
      const alarm = 1 - s;
      ctx.strokeStyle = s > 0.6 ? colors.cyan : s > 0.22 ? colors.amber : colors.red;
      ctx.globalAlpha = 0.25 + 0.35 * alarm;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(px, py, 10 + alarm * 16 + Math.sin(pulse) * (2 + alarm * 4), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      ctx.beginPath();
      ctx.arc(px, py, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = colors.paper;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = s > 0.6 ? colors.cyan : s > 0.22 ? colors.amber : colors.red;
      ctx.stroke();
    };

    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => (live = e.isIntersecting), { threshold: 0.02 });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  // Pointer handling lives in React so the query point stays a controlled value.
  const onDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setQ(toNorm(e, e.currentTarget));
  };
  const onMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragging.current) return;
    setQ(toNorm(e, e.currentTarget));
  };
  const onUp = () => {
    dragging.current = false;
  };

  const nudge = (dx: number, dy: number) =>
    setQ((p) => ({
      x: Math.max(0.02, Math.min(0.98, p.x + dx)),
      y: Math.max(0.02, Math.min(0.98, p.y + dy)),
    }));

  const tone = score > 0.6 ? "cyan" : score > 0.22 ? "amber" : "red";

  return (
    <div className={className}>
      <div
        className="card rounded-[3px] overflow-hidden"
        style={{ background: "color-mix(in srgb, var(--paper-2) 45%, transparent)" }}
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onKeyDown={(e) => {
            const step = 0.03;
            if (e.key === "ArrowLeft") nudge(-step, 0);
            else if (e.key === "ArrowRight") nudge(step, 0);
            else if (e.key === "ArrowUp") nudge(0, -step);
            else if (e.key === "ArrowDown") nudge(0, step);
            else return;
            e.preventDefault();
          }}
          tabIndex={0}
          role="application"
          aria-label="Latent space map — drag the query sample, or use arrow keys, to move it in and out of the training distribution"
          className="h-[300px] md:h-[380px] w-full block"
          style={{ touchAction: "none", cursor: "grab" }}
        />
      </div>

      {/* Live readout */}
      <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-6 items-end">
        <div>
          <div className="flex items-baseline gap-3">
            <span
              className="serif text-[1.6rem] leading-none"
              style={{ color: `var(--${tone})` }}
            >
              {verdict}
            </span>
            <span className="meta">nearest: {CLUSTERS[nearest].label}</span>
          </div>

          <div
            className="mt-3 h-[3px] w-full rounded-full overflow-hidden"
            style={{ background: "var(--rule-soft)" }}
          >
            <div
              className="h-full rounded-full transition-[width,background] duration-200"
              style={{
                width: `${Math.max(2, score * 100)}%`,
                background: `var(--${tone})`,
              }}
            />
          </div>
          <p className="meta mt-2">
            support {(score * 100).toFixed(0)}% · drag the point, or focus the map and use
            the arrow keys
          </p>
        </div>

        <button
          onClick={() => setQ({ x: 0.9, y: 0.06 })}
          className="btn-ghost btn whitespace-nowrap"
        >
          Push it out
        </button>
      </div>
    </div>
  );
}
