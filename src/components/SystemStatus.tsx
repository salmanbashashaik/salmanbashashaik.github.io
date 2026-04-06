import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const METRICS = [
  { label: "Pipeline Uptime", value: "99.8%", accent: true },
  { label: "Models Trained", value: "12", accent: false },
  { label: "Records Processed", value: "1,000+", accent: true },
  { label: "Ingest Speed", value: "260/s", accent: false },
];

const LOGS = [
  "[ETL] Genomics pipeline — 260 files/sec ✓",
  "[NLP] scispaCy NER extraction — complete ✓",
  "[SEARCH] Elasticsearch index refreshed ✓",
  "[ML] Language classifier — 94.2% accuracy ✓",
  "[DB] PostgreSQL schema migration — done ✓",
  "[DOCKER] Container health check — passing ✓",
  "[CKAN] Metadata published to dashboard ✓",
  "[MODEL] Transfer learning checkpoint saved ✓",
];

export default function SystemStatus() {
  const [logLines, setLogLines] = useState<string[]>([]);
  const [logIdx, setLogIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setLogLines((prev) => [...prev, LOGS[logIdx % LOGS.length]].slice(-5));
      setLogIdx((i) => i + 1);
    }, 1800);
    return () => clearInterval(t);
  }, [logIdx]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="surface rounded-2xl p-5 mt-16"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full animate-pulse-ring"
            style={{ background: "#4ade80" }}
          />
          <span
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ fontFamily: "var(--font-mono)", color: "var(--text-2)" }}
          >
            System Status — Live
          </span>
        </div>
        <span
          className="text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}
        >
          salman@pipeline:~$
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {METRICS.map((m) => (
          <div
            key={m.label}
            className="rounded-xl p-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div
              className="font-mono text-lg font-bold mb-0.5"
              style={{ color: m.accent ? "var(--accent-2)" : "var(--text)" }}
            >
              {m.value}
            </div>
            <div className="text-[11px]" style={{ color: "var(--text-3)" }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>

      <div
        className="rounded-xl p-3 min-h-[90px] space-y-1"
        style={{ background: "color-mix(in srgb, var(--bg) 80%, transparent)", border: "1px solid var(--border)" }}
      >
        {logLines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-[11px]"
            style={{ fontFamily: "var(--font-mono)", color: "#4ade80", opacity: 0.75 }}
          >
            <span style={{ color: "var(--text-3)" }}>{">"} </span>
            {line}
          </motion.div>
        ))}
        <span
          className="cursor-blink text-[11px]"
          style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
        >
          █
        </span>
      </div>
    </motion.div>
  );
}
