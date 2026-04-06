import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const STAGES = ["Ingest", "Transform", "Model", "Index", "Serve"];

export default function PipelineViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf: number, t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);
      t += 0.006;

      const spacing = W / (STAGES.length + 1);
      const nodes = STAGES.map((_, i) => ({ x: spacing * (i + 1), y: H / 2 }));

      for (let i = 0; i < nodes.length - 1; i++) {
        const a = nodes[i], b = nodes[i + 1];
        ctx.beginPath();
        ctx.strokeStyle = "rgba(124,106,247,0.12)";
        ctx.lineWidth = 1;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // Single flow particle per segment
        const phase = ((t + i * 0.25) % 1);
        ctx.beginPath();
        ctx.arc(a.x + (b.x - a.x) * phase, a.y + (b.y - a.y) * phase, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(167,139,250,0.7)";
        ctx.fill();
      }

      nodes.forEach((node, i) => {
        const pulse = Math.sin(t * 1.5 + i) * 0.5 + 0.5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5 + pulse * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124,106,247,${0.4 + pulse * 0.3})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mx-auto max-w-5xl px-4 md:px-8 mt-12"
    >
      <div
        className="rounded-xl px-4 pt-3 pb-2"
        style={{ border: "1px solid var(--border)", background: "var(--surface)" }}
      >
        <p className="text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>
          data pipeline
        </p>
        <canvas ref={canvasRef} className="w-full" style={{ height: "60px", display: "block" }} />
        <div className="flex justify-around mt-1 pb-1">
          {STAGES.map((s) => (
            <span key={s} className="text-[10px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{s}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
