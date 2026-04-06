import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Terminal } from "lucide-react";
import SectionHeader from "./SectionHeader";

const PROJECTS = [
  {
    name: "Science Data Inventory",
    blurb: "Centralized searchable metadata portal for multi-TB genomics research outputs.",
    tags: ["Python", "scispaCy", "Elasticsearch", "PostgreSQL", "Docker", "CKAN"],
    badge: "AAFC · Internal",
    icon: "🔬",
    terminal: [
      "$ python etl_pipeline.py --source /genomics/raw --parallel 8",
      "> Scanning 1,247 files...",
      "> NER extraction: 98.3% field coverage",
      "> Indexed 1,000+ records → Elasticsearch",
      "> Throughput: 260 files/sec (23× baseline)",
      "> Publishing to CKAN dashboard... ✓",
      "Pipeline complete. 0 errors.",
    ],
    metrics: [
      { label: "Throughput", value: "260/s" },
      { label: "Speedup", value: "23×" },
      { label: "Records", value: "1,000+" },
    ],
  },
  {
    name: "Language Detection ML",
    blurb: "ML pipeline classifying text into multiple languages using TF-IDF + ensemble classifiers.",
    tags: ["Python", "scikit-learn", "TF-IDF", "NLP", "SVM", "Jupyter"],
    badge: "Open Source",
    icon: "🌐",
    link: "https://github.com/salmanbashashaik/Language-Detection",
    terminal: [
      "$ python train.py --model svm --vectorizer tfidf",
      "> Loading multilingual corpus...",
      "> Preprocessing: tokenize → normalize → stopwords",
      "> TF-IDF vectorization: 50,000 features",
      "> Training SVM classifier...",
      "> Accuracy: 94.2% | F1: 0.941",
      "Model saved → ./models/lang_detect_svm.pkl",
    ],
    metrics: [
      { label: "Accuracy", value: "94.2%" },
      { label: "Languages", value: "17" },
      { label: "Features", value: "50k" },
    ],
  },
  {
    name: "Cancer Image Detection",
    blurb: "Transfer learning pipeline for histopathology cancer vs. non-cancer classification.",
    tags: ["Python", "PyTorch", "Albumentations", "scikit-learn", "CNN"],
    badge: "In Progress",
    icon: "🧬",
    link: "https://github.com/salmanbashashaik/my-app",
    terminal: [
      "$ python train.py --backbone resnet50 --epochs 30",
      "> Loading histopathology patches...",
      "> Augmentation pipeline: flip, rotate, color jitter",
      "> Transfer learning from ImageNet weights",
      "> Epoch 30/30 — val_acc: 0.871",
      "> Saving checkpoint... ✓",
      "Status: Training in progress (compute pending)",
    ],
    metrics: [
      { label: "Val Acc", value: "87.1%" },
      { label: "Backbone", value: "ResNet50" },
      { label: "Status", value: "Active" },
    ],
  },
  {
    name: "Family Financial Tracker",
    blurb: "Desktop expense tracker with full Agile/Scrum dev cycle — JavaFX + Apache POI.",
    tags: ["Java", "JavaFX", "Apache POI", "JUnit", "Agile/Scrum"],
    badge: "Course Project",
    icon: "💰",
    terminal: [
      "$ java -jar FinancialTracker.jar",
      "> Loading transaction database...",
      "> Parsing CSV import (Apache POI)...",
      "> Rendering JavaFX dashboard...",
      "> Monthly report: Jan 2024 — $4,230 tracked",
      "> Category breakdown: Food 32%, Rent 45%, Other 23%",
      "Application ready.",
    ],
    metrics: [
      { label: "Sprint", value: "Agile" },
      { label: "Tests", value: "JUnit" },
      { label: "Export", value: "CSV/XLS" },
    ],
  },
];

function TerminalOutput({ lines }: { lines: string[] }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="overflow-hidden"
    >
      <div
        className="mx-5 mb-5 rounded-xl p-3 space-y-1"
        style={{
          background: "color-mix(in srgb, var(--bg) 80%, transparent)",
          border: "1px solid var(--border)",
          borderTop: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
        }}
      >
        {lines.map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="text-[11px] leading-relaxed"
            style={{
              fontFamily: "var(--font-mono)",
              color: line.startsWith("$")
                ? "var(--accent-2)"
                : line.startsWith(">")
                ? "#4ade80"
                : "var(--text-2)",
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="projects" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader label="// what i've built" title="Projects" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {PROJECTS.map((p, i) => {
            const isOpen = expanded === i;
            return (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="surface rounded-2xl grad-border transition-all duration-300"
                style={{
                  borderColor: isOpen
                    ? "color-mix(in srgb, var(--accent) 30%, transparent)"
                    : undefined,
                }}
              >
                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    <span
                      className="text-[11px] px-2 py-0.5 rounded-full font-mono"
                      style={{
                        background: "var(--accent-subtle)",
                        color: "var(--accent-2)",
                        border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                      }}
                    >
                      {p.badge}
                    </span>
                  </div>

                  <h3
                    className="text-[15px] font-bold mb-1.5 leading-snug"
                    style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
                  >
                    {p.name}
                  </h3>
                  <p className="text-[13px] leading-relaxed mb-3" style={{ color: "var(--text-2)" }}>
                    {p.blurb}
                  </p>

                  {/* Metrics row */}
                  <div className="flex gap-3 mb-3">
                    {p.metrics.map((m) => (
                      <div key={m.label} className="text-center">
                        <div
                          className="text-[13px] font-bold font-mono"
                          style={{ color: "var(--accent-2)" }}
                        >
                          {m.value}
                        </div>
                        <div className="text-[10px]" style={{ color: "var(--text-3)" }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {p.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-[11px] px-2 py-0.5 rounded-md font-mono"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-2)",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                    {p.tags.length > 4 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-mono" style={{ color: "var(--text-3)" }}>
                        +{p.tags.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpanded(isOpen ? null : i)}
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
                      style={{ color: "var(--accent)", fontFamily: "var(--font-heading)" }}
                    >
                      <Terminal size={12} />
                      {isOpen ? "Close terminal" : "Run simulation"}
                    </button>
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[12px] transition-opacity hover:opacity-70"
                        style={{ color: "var(--text-3)", fontFamily: "var(--font-heading)" }}
                      >
                        <Github size={12} /> Repo <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Terminal output */}
                <AnimatePresence>
                  {isOpen && <TerminalOutput lines={p.terminal} />}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <a
            href="https://www.kaggle.com/shaiksalman28/code"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: "var(--text-2)", fontFamily: "var(--font-heading)" }}
          >
            More notebooks on Kaggle <ExternalLink size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
