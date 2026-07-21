import { useEffect, useRef, useState } from "react";

/**
 * The pretraining prior, drawn as the path it actually takes.
 *
 * Six typed layers — taxon → enzyme → pathway → metabolite → receptor →
 * disease — with signal propagating down the edges. This is the structure a
 * flat co-occurrence graph does not have, and it is what the frozen R-GCN
 * compresses into the genus embedding table. Hover a layer to isolate it.
 */

const LAYERS = [
  { id: "taxon", label: "taxon", n: 7, note: "1,041 genera" },
  { id: "enzyme", label: "enzyme", n: 6, note: "encodes" },
  { id: "pathway", label: "pathway", n: 5, note: "participates in" },
  { id: "metabolite", label: "metabolite", n: 5, note: "produces" },
  { id: "receptor", label: "receptor", n: 4, note: "binds" },
  { id: "disease", label: "disease", n: 3, note: "associated with" },
];

type Node = { x: number; y: number; layer: number };
type Edge = { a: number; b: number };
type Pulse = { edge: number; t: number; speed: number };

export default function KnowledgeCascade({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const focusRef = useRef<number | null>(null);
  focusRef.current = focus;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let live = true;
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let pulses: Pulse[] = [];

    const colors = { ink: "#16130f", ink3: "#8d8578", red: "#9c2f18", cyan: "#1b6a72", rule: "rgba(0,0,0,.1)" };
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

    const LEFT = 78; // label gutter
    const build = () => {
      nodes = [];
      edges = [];
      const rowH = h / LAYERS.length;
      const span = w - LEFT - 18;

      LAYERS.forEach((layer, li) => {
        const y = rowH * li + rowH / 2;
        const start = nodes.length;
        for (let i = 0; i < layer.n; i++) {
          const x = LEFT + (span * (i + 0.5)) / layer.n;
          nodes.push({ x, y, layer: li });
        }
        // wire each node in this layer to one or two in the layer above
        if (li > 0) {
          const prevStart = start - LAYERS[li - 1].n;
          for (let i = 0; i < layer.n; i++) {
            const me = start + i;
            const prevCount = LAYERS[li - 1].n;
            const primary = prevStart + Math.floor((i * prevCount) / layer.n);
            edges.push({ a: primary, b: me });
            const alt = prevStart + ((primary - prevStart + 1 + (i % 2)) % prevCount);
            if (alt !== primary) edges.push({ a: alt, b: me });
          }
        }
      });
      pulses = [];
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      if (r.width < 1) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let frame = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!live) return;
      frame++;
      const f = focusRef.current;

      if (!reduced && frame % 7 === 0 && edges.length && pulses.length < 40) {
        pulses.push({
          edge: Math.floor(Math.random() * edges.length),
          t: 0,
          speed: 0.012 + Math.random() * 0.014,
        });
      }

      ctx.clearRect(0, 0, w, h);

      // edges
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        if (!a || !b) continue;
        const on = f === null || a.layer === f || b.layer === f;
        ctx.strokeStyle = colors.ink;
        ctx.globalAlpha = on ? 0.16 : 0.05;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // pulses travelling down the hierarchy
      pulses = pulses.filter((p) => p.t < 1);
      for (const p of pulses) {
        p.t += reduced ? 0 : p.speed;
        const e = edges[p.edge];
        const a = nodes[e?.a];
        const b = nodes[e?.b];
        if (!a || !b) continue;
        const on = f === null || a.layer === f || b.layer === f;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        ctx.globalAlpha = on ? (1 - Math.abs(p.t - 0.5) * 1.4) * 0.9 : 0.1;
        ctx.fillStyle = colors.cyan;
        ctx.beginPath();
        ctx.arc(x, y, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // nodes + layer labels
      const rowH = h / LAYERS.length;
      LAYERS.forEach((layer, li) => {
        const on = f === null || li === f;
        const y = rowH * li + rowH / 2;

        ctx.globalAlpha = on ? 1 : 0.28;
        ctx.font = '400 10px "JetBrains Mono", monospace';
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        ctx.fillStyle = li === f ? colors.red : colors.ink;
        ctx.fillText(layer.label, 0, y - 5);
        ctx.fillStyle = colors.ink3;
        ctx.font = '400 9px "JetBrains Mono", monospace';
        ctx.fillText(layer.note, 0, y + 7);
      });

      for (const n of nodes) {
        const on = f === null || n.layer === f;
        ctx.globalAlpha = on ? 1 : 0.22;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.layer === LAYERS.length - 1 ? 4.2 : 3, 0, Math.PI * 2);
        ctx.fillStyle =
          n.layer === LAYERS.length - 1
            ? colors.red
            : n.layer === 0
              ? colors.cyan
              : colors.ink;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => (live = e.isIntersecting), { threshold: 0.02 });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      const li = Math.floor((y / r.height) * LAYERS.length);
      setFocus(li >= 0 && li < LAYERS.length ? li : null);
    };
    const onLeave = () => setFocus(null);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <span className="eyebrow">Knowledge graph</span>
        <span className="meta">15 node types · 23 relations</span>
      </div>
      <canvas
        ref={canvasRef}
        aria-label="Hierarchical biological knowledge graph: taxon, enzyme, pathway, metabolite, receptor, disease"
        style={{ display: "block", width: "100%", height: "252px", touchAction: "none" }}
      />
    </div>
  );
}
