import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

// ── data ──────────────────────────────────────────────────────────────────────
const GROUPS = [
  { label: "Data Eng",    color: "#7c6af7", skills: ["Python","SQL","ETL","Elasticsearch","PostgreSQL","Docker","asyncio","CKAN"] },
  { label: "AI / ML",     color: "#a78bfa", skills: ["PyTorch","scikit-learn","TF-IDF","scispaCy","Transfer Learning","CNNs","GANs"] },
  { label: "Software",    color: "#818cf8", skills: [".NET","C#","Blazor","Java","JavaFX","Entity Framework","SAP"] },
  { label: "Tools",       color: "#6366f1", skills: ["Git","Power BI","Tableau","SQL Server","Jupyter","Linux","GitHub Actions"] },
];

// edges between related skills
const EDGES: [string, string][] = [
  ["Python","ETL"],["Python","scikit-learn"],["Python","PyTorch"],["Python","scispaCy"],
  ["ETL","Elasticsearch"],["ETL","PostgreSQL"],["ETL","Docker"],
  ["Elasticsearch","CKAN"],["PostgreSQL","SQL"],
  ["PyTorch","CNNs"],["PyTorch","Transfer Learning"],["scikit-learn","TF-IDF"],
  ["Java","JavaFX"],["Java",".NET"],[".NET","C#"],["C#","Blazor"],
  ["SQL","SQL Server"],["Git","Docker"],["Jupyter","scikit-learn"],
];

const CERTS = [
  { label: "HackerRank SQL (Advanced)", href: "https://www.hackerrank.com/certificates/2ec610f1e9e8" },
  { label: "Top 6% Kaggle Notebooks",   href: "https://www.kaggle.com/shaiksalman28" },
];

// ── types ─────────────────────────────────────────────────────────────────────
interface Node {
  id: string; label: string; color: string; group: string;
  x: number; y: number; vx: number; vy: number;
  ox: number; oy: number; // orbit center
  angle: number; radius: number; orbitSpeed: number;
}

// ── canvas component ──────────────────────────────────────────────────────────
function SkillGraph({ onHover }: { onHover: (skill: string | null) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<Node[]>([]);
  const mouseRef  = useRef({ x: -999, y: -999 });
  const activeRef = useRef<string | null>(null);
  const rafRef    = useRef<number>(0);

  // build nodes once
  useEffect(() => {
    const canvas = canvasRef.current!;
    const W = canvas.offsetWidth, H = canvas.offsetHeight;
    const cx = W / 2, cy = H / 2;
    const nodes: Node[] = [];

    GROUPS.forEach((g, gi) => {
      const groupAngle = (gi / GROUPS.length) * Math.PI * 2;
      const groupR = Math.min(W, H) * 0.28;
      const gx = cx + Math.cos(groupAngle) * groupR;
      const gy = cy + Math.sin(groupAngle) * groupR;

      g.skills.forEach((skill, si) => {
        const a = (si / g.skills.length) * Math.PI * 2;
        const r = Math.min(W, H) * 0.1;
        nodes.push({
          id: skill, label: skill, color: g.color, group: g.label,
          x: gx + Math.cos(a) * r, y: gy + Math.sin(a) * r,
          vx: 0, vy: 0,
          ox: gx, oy: gy,
          angle: a, radius: r,
          orbitSpeed: 0.00015 + Math.random() * 0.0001,
        });
      });
    });
    nodesRef.current = nodes;
  }, []);

  // draw loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = canvas.offsetWidth  * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.offsetWidth, H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const active = activeRef.current;

      // update positions — gentle orbit + mouse repulsion
      nodes.forEach((n) => {
        n.angle += n.orbitSpeed * (active === n.id ? 3 : 1);
        const tx = n.ox + Math.cos(n.angle) * n.radius;
        const ty = n.oy + Math.sin(n.angle) * n.radius;

        // repel from mouse — only very close, weak force
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 30 && dist > 0) {
          const force = (30 - dist) / 30 * 0.6;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }

        n.vx += (tx - n.x) * 0.04;
        n.vy += (ty - n.y) * 0.04;
        n.vx *= 0.82; n.vy *= 0.82;
        n.x += n.vx; n.y += n.vy;
      });

      // draw edges
      EDGES.forEach(([a, b]) => {
        const na = nodes.find(n => n.id === a);
        const nb = nodes.find(n => n.id === b);
        if (!na || !nb) return;
        const isHighlighted = active === a || active === b;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.strokeStyle = isHighlighted
          ? `rgba(167,139,250,0.5)`
          : `rgba(124,106,247,0.08)`;
        ctx.lineWidth = isHighlighted ? 1.5 : 0.8;
        ctx.stroke();
      });

      // draw nodes
      nodes.forEach((n) => {
        const isActive = active === n.id;
        const isConnected = active
          ? EDGES.some(([a, b]) => (a === active && b === n.id) || (b === active && a === n.id))
          : false;
        const dimmed = active && !isActive && !isConnected;

        const r = isActive ? 7 : 4.5;

        if (isActive) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(124,106,247,0.15)`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = dimmed ? `rgba(124,106,247,0.15)` : n.color;
        ctx.globalAlpha = dimmed ? 0.3 : 1;
        ctx.fill();
        ctx.globalAlpha = 1;

        // label
        if (isActive || isConnected) {
          ctx.font = `${isActive ? "600 " : ""}11px "JetBrains Mono", monospace`;
          ctx.fillStyle = isActive ? "#f0eee9" : "rgba(167,139,250,0.9)";
          ctx.textAlign = "center";
          ctx.fillText(n.label, n.x, n.y - r - 5);
        }
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };

    // hit-test for hover
    const nodes = nodesRef.current;
    const hit = nodes.find((n) => {
      const dx = n.x - mouseRef.current.x, dy = n.y - mouseRef.current.y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });
    const id = hit?.id ?? null;
    if (id !== activeRef.current) {
      activeRef.current = id;
      onHover(id);
    }
  }, [onHover]);

  const onMouseLeave = useCallback(() => {
    mouseRef.current = { x: -999, y: -999 };
    activeRef.current = null;
    onHover(null);
  }, [onHover]);

  return (
    <canvas
      ref={canvasRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="w-full"
      style={{ height: "340px", cursor: "crosshair", display: "block" }}
    />
  );
}

// ── section ───────────────────────────────────────────────────────────────────
export default function SkillsSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div id="skills" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionHeader label="// tech stack" title="Skills" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface rounded-2xl overflow-hidden mb-4"
          style={{ border: "1px solid var(--border)" }}
        >
          {/* Legend */}
          <div className="flex flex-wrap gap-4 px-5 pt-4 pb-2">
            {GROUPS.map((g) => (
              <div key={g.label} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ background: g.color }} />
                <span className="text-[11px]" style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>
                  {g.label}
                </span>
              </div>
            ))}
            <span className="text-[11px] ml-auto" style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>
              {hovered ? `● ${hovered}` : "hover a node"}
            </span>
          </div>

          <SkillGraph onHover={setHovered} />
        </motion.div>

        {/* Certs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="surface rounded-2xl p-5"
        >
          <h3 className="text-[11px] font-semibold mb-3 uppercase tracking-wider"
            style={{ fontFamily: "var(--font-heading)", color: "var(--text-2)" }}>
            Certifications & Recognition
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {CERTS.map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 text-[12px] px-3 py-1.5 rounded-lg transition-all duration-150"
                style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)", fontFamily: "var(--font-heading)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--accent-2)"; e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 35%, transparent)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                🏆 {c.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
