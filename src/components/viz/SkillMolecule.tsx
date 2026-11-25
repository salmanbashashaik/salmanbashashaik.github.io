import { useEffect, useRef, useState } from "react";
import { SKILLS } from "../../data/resume";

/**
 * Skills as a molecule: each cluster is a hub, each skill an atom bonded to it.
 *
 * Verlet-ish force layout — springs along bonds, inverse-square repulsion
 * between every pair, weak centering. Hover an atom to light its cluster;
 * drag any atom and the rest of the structure reorganizes around it.
 */

type Node = {
  id: string;
  label: string;
  cluster: number;
  hub: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pinned: boolean;
};

type Edge = { a: number; b: number; len: number };

export default function SkillMolecule({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

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

    const colors = {
      ink: "#16130f",
      ink2: "#56504a",
      ink3: "#8d8578",
      paper: "#f5f1e8",
      red: "#b85a3a",
      cyan: "#5f7a5a",
      amber: "#a06a12",
      rule: "rgba(0,0,0,.12)",
    };
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      for (const k of ["ink", "ink-2", "ink-3", "paper", "red", "cyan", "amber", "rule"] as const) {
        const v = cs.getPropertyValue(`--${k}`).trim();
        if (!v) continue;
        const key = k.replace("-", "") as keyof typeof colors;
        colors[key] = v;
      }
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const clusterColor = (i: number) =>
      [colors.red, colors.cyan, colors.amber, colors.ink2][i % 4];

    /* ── build the graph ── */
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    SKILLS.forEach((cluster, ci) => {
      const hubIndex = nodes.length;
      nodes.push({
        id: cluster.id,
        label: cluster.label,
        cluster: ci,
        hub: true,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        r: 7,
        pinned: false,
      });
      cluster.items.forEach((item) => {
        const idx = nodes.length;
        nodes.push({
          id: `${cluster.id}:${item}`,
          label: item,
          cluster: ci,
          hub: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          r: 3.6,
          pinned: false,
        });
        edges.push({ a: hubIndex, b: idx, len: 74 });
      });
      // hubs form a backbone so the clusters stay one connected structure
      if (ci > 0) {
        const prevHub = nodes.findIndex((n) => n.hub && n.cluster === ci - 1);
        edges.push({ a: prevHub, b: hubIndex, len: 190 });
      }
    });

    const seed = () => {
      const cx = w / 2;
      const cy = h / 2;
      // Seed on an ellipse matching the box, so the graph opens across the
      // full width rather than settling into one corner.
      const rx = w * 0.3;
      const ry = h * 0.3;
      nodes.forEach((n, i) => {
        if (n.hub) {
          const a = (n.cluster / SKILLS.length) * Math.PI * 2 - Math.PI / 2;
          n.x = cx + Math.cos(a) * rx;
          n.y = cy + Math.sin(a) * ry;
        } else {
          const a = (i * 2.399) % (Math.PI * 2); // golden-angle scatter
          n.x = cx + Math.cos(a) * rx * 1.4;
          n.y = cy + Math.sin(a) * ry * 1.2;
        }
        n.vx = 0;
        n.vy = 0;
      });
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const first = w === 0;
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (first) seed();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* ── interaction ── */
    const pointer = { x: -9999, y: -9999, down: false };
    let dragging: Node | null = null;
    let hovered: Node | null = null;

    const at = (px: number, py: number) => {
      let best: Node | null = null;
      let bestD = 26 * 26;
      for (const n of nodes) {
        const d = (n.x - px) ** 2 + (n.y - py) ** 2;
        if (d < bestD) {
          bestD = d;
          best = n;
        }
      }
      return best;
    };

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      if (dragging) {
        dragging.x = pointer.x;
        dragging.y = pointer.y;
        dragging.vx = 0;
        dragging.vy = 0;
        return;
      }
      const n = at(pointer.x, pointer.y);
      hovered = n;
      canvas.style.cursor = n ? "grab" : "default";
      const next = n ? n.cluster : null;
      if (next !== activeRef.current) setActive(next);
    };
    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const n = at(e.clientX - r.left, e.clientY - r.top);
      if (!n) return;
      dragging = n;
      n.pinned = true;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(e.pointerId);
    };
    const onUp = () => {
      if (dragging) dragging.pinned = false;
      dragging = null;
      canvas.style.cursor = hovered ? "grab" : "default";
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
      hovered = null;
      setActive(null);
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    /* ── simulation ── */
    const simulate = () => {
      const cx = w / 2;
      const cy = h / 2;

      // repulsion, all pairs — the graph is small enough for O(n²)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let d2 = dx * dx + dy * dy;
          if (d2 < 1) {
            dx = Math.random() - 0.5;
            dy = Math.random() - 0.5;
            d2 = 1;
          }
          if (d2 > 46000) continue;
          const d = Math.sqrt(d2);
          const f = (a.hub || b.hub ? 1500 : 620) / d2;
          const fx = (dx / d) * f;
          const fy = (dy / d) * f;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }

      // bond springs
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const d = Math.hypot(dx, dy) || 1;
        const f = (d - e.len) * 0.011;
        const fx = (dx / d) * f;
        const fy = (dy / d) * f;
        a.vx += fx;
        a.vy += fy;
        b.vx -= fx;
        b.vy -= fy;
      }

      for (const n of nodes) {
        // Pull to centre keeps the structure on the canvas. It is stronger
        // vertically because the box is much wider than it is tall — an equal
        // pull leaves the graph hugging one side.
        n.vx += (cx - n.x) * 0.0035;
        n.vy += (cy - n.y) * 0.0055;

        // cursor nudges nearby atoms without grabbing them
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 9000 && d2 > 1 && !dragging) {
          const d = Math.sqrt(d2);
          const f = (1 - d / 95) * 1.5;
          n.vx += (dx / d) * f;
          n.vy += (dy / d) * f;
        }

        if (n.pinned) continue;
        n.vx *= 0.86;
        n.vy *= 0.86;
        n.x += n.vx;
        n.y += n.vy;

        const pad = 14;
        n.x = Math.max(pad, Math.min(w - pad, n.x));
        n.y = Math.max(pad, Math.min(h - pad, n.y));
      }
    };

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!live) return;
      if (!reduced) simulate();
      ctx.clearRect(0, 0, w, h);
      const act = activeRef.current;

      // bonds
      for (const e of edges) {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const on = act === null || a.cluster === act || b.cluster === act;
        ctx.strokeStyle = on ? clusterColor(a.cluster) : colors.rule;
        ctx.globalAlpha = on ? (act === null ? 0.3 : 0.5) : 0.12;
        ctx.lineWidth = a.hub && b.hub ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // atoms
      for (const n of nodes) {
        const on = act === null || n.cluster === act;
        const c = clusterColor(n.cluster);
        ctx.globalAlpha = on ? 1 : 0.22;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.hub ? c : colors.paper;
        ctx.fill();
        if (!n.hub) {
          ctx.lineWidth = 1.2;
          ctx.strokeStyle = c;
          ctx.stroke();
        }

        // Every atom labelled at once is unreadable — hubs stay named, the
        // rest reveal only for the cluster under the cursor.
        const showLabel = n.hub || (act !== null && on);
        if (showLabel) {
          ctx.font = n.hub
            ? '400 10px "JetBrains Mono", monospace'
            : '400 9.5px "JetBrains Mono", monospace';
          ctx.fillStyle = n.hub ? colors.ink : colors.ink2;
          ctx.textAlign = "center";
          ctx.textBaseline = "top";
          ctx.globalAlpha = on ? (n.hub ? 1 : 0.9) : 0.15;
          ctx.fillText(n.label, n.x, n.y + n.r + 5);
        }
      }
      ctx.globalAlpha = 1;
    };

    raf = requestAnimationFrame(draw);
    const io = new IntersectionObserver(([e]) => (live = e.isIntersecting), { threshold: 0.02 });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="Interactive skills graph — clusters of languages, machine learning, research methods, and infrastructure"
      style={{ display: "block", width: "100%", touchAction: "none" }}
    />
  );
}
