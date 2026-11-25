import { useEffect, useRef } from "react";

/**
 * Reverse-diffusion wordmark.
 *
 * Particles are sampled from the glyph mask of `text`. Each carries a fixed
 * random displacement; drawn position is target + displacement · sigma(t),
 * so t=1000 is pure noise and t=0 is the clean sample. Moving the pointer
 * through the field pushes particles off target — forward diffusion, locally.
 *
 * The timestep lives in a ref so the parent's slider can drive it at 60fps
 * without re-rendering React on every frame.
 */

type Particle = {
  tx: number;
  ty: number;
  nx: number;
  ny: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 0..1 — staggers when this particle resolves, and its size */
  w: number;
};

// Most of the visible change lands in the last stretch of the schedule,
// which is what makes the resolve read as a reveal rather than a fade.
const sigma = (t: number) => Math.pow(Math.max(0, Math.min(1000, t)) / 1000, 1.75);

export default function DiffusionField({
  text,
  tRef,
  className,
}: {
  text: string;
  tRef: React.MutableRefObject<number>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles: Particle[] = [];
    const pointer = { x: -9999, y: -9999, on: false };
    const color = { ink: "#16130f", red: "#b85a3a" };
    let raf = 0;
    let w = 0;
    let h = 0;
    let running = true;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      color.ink = cs.getPropertyValue("--ink").trim() || color.ink;
      color.red = cs.getPropertyValue("--red").trim() || color.red;
    };
    readColors();
    const themeWatch = new MutationObserver(readColors);
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    /** Rasterize the wordmark offscreen, keep every Nth lit pixel. */
    const sample = () => {
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.floor(w));
      off.height = Math.max(1, Math.floor(h));
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;

      octx.textAlign = "center";
      octx.textBaseline = "middle";
      const setFont = (px: number) =>
        (octx.font = `400 ${px}px "Instrument Serif", Georgia, serif`);

      let size = h * 0.88;
      setFont(size);
      const maxW = w * 0.95;
      const measured = octx.measureText(text).width;
      if (measured > maxW) {
        size *= maxW / measured;
        setFont(size);
      }
      octx.fillStyle = "#fff";
      octx.fillText(text, off.width / 2, off.height / 2);

      const data = octx.getImageData(0, 0, off.width, off.height).data;
      const step = w > 860 ? 3 : 4;
      const spread = Math.max(w, h) * 0.6;
      const next: Particle[] = [];
      // Seed at the position the current timestep implies, not always at full
      // noise — otherwise a resize (which re-samples) throws an already
      // resolved wordmark back into the noise it came from.
      const s0 = sigma(tRef.current);

      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] < 128) continue;
          const a = Math.random() * Math.PI * 2;
          // sqrt keeps the noise cloud area-uniform instead of centre-heavy
          const d = Math.sqrt(Math.random()) * spread;
          const nx = Math.cos(a) * d;
          const ny = Math.sin(a) * d * 0.6;
          const weight = Math.random();
          const local = Math.min(1, s0 * (0.72 + weight * 0.56));
          next.push({
            tx: x,
            ty: y,
            nx,
            ny,
            x: x + nx * local,
            y: y + ny * local,
            vx: 0,
            vy: 0,
            w: weight,
          });
        }
      }
      particles = next;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      // Sub-pixel jitter from scrollbars and layout settling would otherwise
      // re-sample the field continuously and it would never converge.
      if (Math.abs(rect.width - w) < 2 && Math.abs(rect.height - h) < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sample();
    };

    const RADIUS = 105;
    let lastFrame = 0;
    const draw = (now = 0) => {
      if (!running) return;
      raf = requestAnimationFrame(draw);

      // A backgrounded tab stops delivering frames. When it wakes, the spring
      // would resume from wherever it froze — which, if the timestep animation
      // finished meanwhile, strands the field mid-noise forever. Detect the
      // gap and settle straight onto the goal instead.
      const gap = lastFrame ? now - lastFrame : 0;
      const snap = gap > 400;
      lastFrame = now;

      const s = sigma(tRef.current);
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const q = particles[i];
        const local = Math.min(1, s * (0.72 + q.w * 0.56));
        let gx = q.tx + q.nx * local;
        let gy = q.ty + q.ny * local;

        if (pointer.on) {
          const dx = q.x - pointer.x;
          const dy = q.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < RADIUS * RADIUS && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = (1 - d / RADIUS) ** 2 * 52;
            gx += (dx / d) * push;
            gy += (dy / d) * push;
          }
        }

        if (reduced || snap) {
          q.x = gx;
          q.y = gy;
          q.vx = 0;
          q.vy = 0;
        } else {
          q.vx = (q.vx + (gx - q.x) * 0.085) * 0.83;
          q.vy = (q.vy + (gy - q.y) * 0.085) * 0.83;
          q.x += q.vx;
          q.y += q.vy;
        }

        // Scattered noise reads warm; resolved sample reads as solid ink.
        ctx.fillStyle = local > 0.5 ? color.red : color.ink;
        ctx.globalAlpha = 0.3 + (1 - local) * 0.7;
        ctx.beginPath();
        ctx.arc(q.x, q.y, 0.8 + (1 - local) * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    };
    const onLeave = () => {
      pointer.on = false;
    };

    let ro: ResizeObserver | undefined;
    const boot = () => {
      resize();
      ro = new ResizeObserver(resize);
      ro.observe(canvas);
      raf = requestAnimationFrame(draw);
    };

    // Sampling before Instrument Serif loads would rasterize the fallback face.
    if (document.fonts?.ready) document.fonts.ready.then(boot).catch(boot);
    else boot();

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      themeWatch.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text, tRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={className}
      style={{ display: "block", width: "100%", touchAction: "none" }}
    />
  );
}
