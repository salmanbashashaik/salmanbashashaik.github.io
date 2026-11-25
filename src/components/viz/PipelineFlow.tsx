import { useEffect, useRef, useState } from "react";
import { LANES, RATE, type PipelineMode as Mode } from "./constants";

/**
 * Genomic metadata moving Elasticsearch → PostgreSQL.
 *
 * Single-lane serial ingestion ran at 11 files/sec; multiprocessing plus I/O
 * batching took it to 260. The two modes here are drawn at the same visual
 * scale, so the gap is the point — toggle and watch the lanes fill.
 */

type Packet = { x: number; lane: number; speed: number; life: number };

export default function PipelineFlow({
  mode,
  className,
}: {
  mode: Mode;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const [live, setLive] = useState(true);
  const doneRef = useRef(0);
  const [done, setDone] = useState(0);

  useEffect(() => {
    doneRef.current = 0;
    setDone(0);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let packets: Packet[] = [];
    let carry = 0;
    const colors = { ink: "#16130f", ink3: "#8d8578", red: "#b85a3a", cyan: "#5f7a5a", rule: "rgba(0,0,0,.12)" };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors.ink = cs.getPropertyValue("--ink").trim() || colors.ink;
      colors.ink3 = cs.getPropertyValue("--ink-3").trim() || colors.ink3;
      colors.red = cs.getPropertyValue("--red").trim() || colors.red;
      colors.cyan = cs.getPropertyValue("--cyan").trim() || colors.cyan;
      colors.rule = cs.getPropertyValue("--rule").trim() || colors.rule;
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
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

    const PAD = 60; // room for the endpoint labels
    let frame = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      frame++;
      const m = modeRef.current;
      const laneCount = LANES[m];
      const laneGap = h / (laneCount + 1);

      if (live && !reduced) {
        // spawn proportional to the real throughput, scaled to something watchable
        carry += RATE[m] / 60 / 3.2;
        while (carry >= 1) {
          carry -= 1;
          packets.push({
            x: PAD,
            lane: Math.floor(Math.random() * laneCount),
            speed: 0.9 + Math.random() * 0.5,
            life: 1,
          });
        }
      }

      ctx.clearRect(0, 0, w, h);

      // lanes
      ctx.strokeStyle = colors.rule;
      ctx.lineWidth = 1;
      for (let i = 0; i < laneCount; i++) {
        const y = laneGap * (i + 1);
        ctx.setLineDash([1, 5]);
        ctx.beginPath();
        ctx.moveTo(PAD, y);
        ctx.lineTo(w - PAD, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // endpoints
      ctx.font = '400 9px "JetBrains Mono", monospace';
      ctx.fillStyle = colors.ink3;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText("elastic", 0, h / 2 - 7);
      ctx.fillText("search", 0, h / 2 + 5);
      ctx.textAlign = "right";
      ctx.fillText("postgres", w, h / 2);
      ctx.textAlign = "left";

      ctx.strokeStyle = colors.rule;
      ctx.beginPath();
      ctx.moveTo(PAD - 8, 6);
      ctx.lineTo(PAD - 8, h - 6);
      ctx.moveTo(w - PAD + 8, 6);
      ctx.lineTo(w - PAD + 8, h - 6);
      ctx.stroke();

      // packets
      const span = w - PAD * 2;
      const next: Packet[] = [];
      for (const p of packets) {
        p.x += p.speed * (m === "parallel" ? 2.6 : 1.1);
        if (p.x >= w - PAD) {
          doneRef.current++;
          continue;
        }
        next.push(p);
        const y = laneGap * (p.lane + 1);
        const progress = (p.x - PAD) / span;
        ctx.globalAlpha = 0.35 + progress * 0.6;
        ctx.fillStyle = progress > 0.72 ? colors.cyan : colors.red;
        ctx.fillRect(p.x, y - 1.4, 5, 2.8);
      }
      ctx.globalAlpha = 1;
      packets = next.slice(-1200);

      if (frame % 12 === 0) setDone(doneRef.current);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [live]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  return (
    <div className={className}>
      <canvas
        ref={canvasRef}
        aria-label={`Ingestion pipeline running in ${mode} mode at ${RATE[mode]} files per second`}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      <span className="sr-only">{done} files ingested</span>
    </div>
  );
}
