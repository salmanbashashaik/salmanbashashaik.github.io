import { useRef } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import SectionHeader from "./SectionHeader";

const PROJECTS = [
  {
    name: "Science Data Inventory",
    blurb: "Centralized searchable metadata portal for multi-TB genomics research outputs.",
    tags: ["Python", "scispaCy", "Elasticsearch", "PostgreSQL", "Docker", "CKAN"],
    badge: "AAFC · Internal",
    icon: "🔬",
    metrics: [{ label: "Throughput", value: "260/s" }, { label: "Speedup", value: "23×" }, { label: "Records", value: "1,000+" }],
  },
  {
    name: "Language Detection ML",
    blurb: "ML pipeline classifying text into multiple languages using TF-IDF + ensemble classifiers.",
    tags: ["Python", "scikit-learn", "TF-IDF", "NLP", "SVM", "Jupyter"],
    badge: "Open Source",
    icon: "🌐",
    link: "https://github.com/salmanbashashaik/Language-Detection",
    metrics: [{ label: "Accuracy", value: "94.2%" }, { label: "Languages", value: "17" }, { label: "Features", value: "50k" }],
  },
  {
    name: "Cancer Image Detection",
    blurb: "Transfer learning pipeline for histopathology cancer vs. non-cancer classification.",
    tags: ["Python", "PyTorch", "Albumentations", "scikit-learn", "CNN"],
    badge: "In Progress",
    icon: "🧬",
    link: "https://github.com/salmanbashashaik/my-app",
    metrics: [{ label: "Val Acc", value: "87.1%" }, { label: "Backbone", value: "ResNet50" }, { label: "Status", value: "Active" }],
  },
  {
    name: "Family Financial Tracker",
    blurb: "Desktop expense tracker with full Agile/Scrum dev cycle — JavaFX + Apache POI.",
    tags: ["Java", "JavaFX", "Apache POI", "JUnit", "Agile/Scrum"],
    badge: "Course Project",
    icon: "💰",
    metrics: [{ label: "Sprint", value: "Agile" }, { label: "Tests", value: "JUnit" }, { label: "Export", value: "CSV/XLS" }],
  },
];

function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    el.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(4px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: "transform 0.15s ease", willChange: "transform" }}
    >
      {children}
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionHeader label="// what i've built" title="Projects" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <TiltCard>
                <div
                  className="surface rounded-2xl p-5 h-full grad-border"
                  style={{ cursor: "default" }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-mono"
                      style={{ background: "var(--accent-subtle)", color: "var(--accent-2)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="text-[15px] font-bold mb-1.5 leading-snug" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                    {p.name}
                  </h3>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--text-2)" }}>{p.blurb}</p>

                  <div className="flex gap-4 mb-3">
                    {p.metrics.map((m) => (
                      <div key={m.label}>
                        <div className="text-[13px] font-bold font-mono" style={{ color: "var(--accent-2)" }}>{m.value}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-3)" }}>{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 rounded-md font-mono"
                        style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}>
                        {t}
                      </span>
                    ))}
                    {p.tags.length > 4 && <span className="text-[11px] px-2 py-0.5 font-mono" style={{ color: "var(--text-3)" }}>+{p.tags.length - 4}</span>}
                  </div>

                  {p.link ? (
                    <a
                      href={p.link} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
                      style={{ color: "var(--accent)", fontFamily: "var(--font-heading)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={13} /> View on GitHub <ExternalLink size={11} />
                    </a>
                  ) : (
                    <span className="text-[12px]" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                      Internal / not public
                    </span>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8 text-center">
          <a href="https://www.kaggle.com/shaiksalman28/code" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--text-2)", fontFamily: "var(--font-heading)" }}>
            More notebooks on Kaggle <ExternalLink size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
