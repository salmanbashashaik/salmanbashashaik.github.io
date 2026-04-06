import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeader from "./SectionHeader";

const EXP = [
  {
    id: 0,
    role: "Data Engineer Intern — Bioinformatics",
    company: "Agriculture & Agri-Food Canada (AAFC)",
    period: "Jan 2025 – Present",
    kpis: ["23× faster ingest", "260 files/sec", "1,000+ records"],
    stack: ["Python", "Elasticsearch", "Docker", "PostgreSQL", "scispaCy", "CKAN", "asyncio"],
    problem: "Research datasets scattered across labs — scientists couldn't find or reuse each other's work.",
    approach: "Built centralized ETL with NER (scispaCy) + regex extraction, parallelized with asyncio/multiprocessing, indexed in Elasticsearch, published to CKAN dashboards.",
    impact: "23× ingest speedup to 260 files/sec. 1,000+ records normalized into a unified, searchable metadata catalog.",
    details: [
      "Parallelized ETL with asyncio/multiprocessing; containerized with Docker",
      "Metadata extraction via scispaCy NER and regex; schema validation + deduplication",
      "Elasticsearch for full-text search, PostgreSQL for curated relational storage",
      "Automated FASTQ/BAM primer routines and taxonomy metadata hooks",
      "Published curated fields to CKAN with dashboards for org-wide visibility",
    ],
  },
  {
    id: 1,
    role: "Software Engineer Intern",
    company: "New Brunswick Power Corporation",
    period: "Sep 2023 – Apr 2024",
    kpis: ["Company-wide lookup", "Multi-field filters", "CSV export"],
    stack: [".NET", "C#", "Blazor", "Telerik UI", "SQL Server", "Entity Framework", "SAP", "Power BI"],
    problem: "Teams needed fast, consistent people-search across departments — legacy lookups were slow and inconsistent.",
    approach: "Built Blazor app with Telerik DataGrid over normalized SQL Server directory. Server-side filtering by dept/unit/floor/role, SAP-linked fields, one-click CSV export.",
    impact: "People-search became instant and self-serve org-wide. CSV export eliminated ad-hoc IT requests.",
    details: [
      "Blazor components with Telerik UI — server-side paging, sorting, filtering via EF to SQL Server",
      "RFC-compatible CSV export with email, department, unit, floor, and role fields",
      "Enhanced .NET/C# apps integrated with SAP modules; improved data flow reliability",
      "Low-code Power Apps + Power BI prototype to surface KPIs rapidly",
    ],
  },
];

export default function ExperienceSection() {
  const [activeId, setActiveId] = useState<number | null>(null);

  const toggle = (id: number) => setActiveId((prev) => (prev === id ? null : id));

  return (
    <section id="experience" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader label="// work history" title="Experience" />
        </motion.div>

        <div className="relative">
          {/* Timeline spine */}
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px"
            style={{
              background:
                "linear-gradient(to bottom, var(--accent), color-mix(in srgb, var(--accent) 10%, transparent))",
            }}
          />

          <div className="space-y-5 pl-8">
            {EXP.map((e, i) => {
              const isOpen = activeId === e.id;

              return (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <motion.div
                    whileInView={{ scale: [0.4, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="absolute -left-8 top-5 h-3.5 w-3.5 rounded-full border-2"
                    style={{
                      background: isOpen ? "var(--accent)" : "var(--bg)",
                      borderColor: "var(--accent)",
                      boxShadow: isOpen
                        ? "0 0 0 4px var(--accent-subtle), 0 0 12px var(--accent-glow)"
                        : "0 0 0 4px var(--accent-subtle)",
                      transition: "background 0.25s, box-shadow 0.25s",
                    }}
                  />

                  {/* Clickable card */}
                  <div
                    onClick={() => toggle(e.id)}
                    className="rounded-2xl cursor-pointer transition-all duration-250 select-none"
                    style={{
                      background: isOpen
                        ? "color-mix(in srgb, var(--accent) 6%, var(--surface))"
                        : "var(--surface)",
                      border: isOpen
                        ? "1px solid color-mix(in srgb, var(--accent) 35%, transparent)"
                        : "1px solid var(--border)",
                      boxShadow: isOpen ? "0 4px 24px color-mix(in srgb, var(--accent) 8%, transparent)" : "none",
                    }}
                  >
                    {/* Always-visible header */}
                    <div className="p-5 md:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3
                            className="text-[16px] font-bold leading-snug"
                            style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
                          >
                            {e.role}
                          </h3>
                          <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>
                            {e.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className="text-[11px] px-2.5 py-1 rounded-full font-mono"
                            style={{
                              background: "var(--accent-subtle)",
                              color: "var(--accent-2)",
                              border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
                            }}
                          >
                            {e.period}
                          </span>
                          <ChevronDown
                            size={14}
                            style={{
                              color: "var(--accent)",
                              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.25s ease",
                            }}
                          />
                        </div>
                      </div>

                      {/* KPIs */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {e.kpis.map((k) => (
                          <span
                            key={k}
                            className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                            style={{
                              background: "var(--accent-subtle)",
                              color: "var(--accent-2)",
                              border: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)",
                            }}
                          >
                            {k}
                          </span>
                        ))}
                      </div>

                      {/* Case study — always visible */}
                      <div className="space-y-1.5 mb-3">
                        {[
                          { label: "Problem", text: e.problem },
                          { label: "Approach", text: e.approach },
                          { label: "Impact", text: e.impact },
                        ].map(({ label, text }) => (
                          <p
                            key={label}
                            className="text-[13px] leading-relaxed"
                            style={{ color: "var(--text-2)" }}
                          >
                            <span
                              className="font-semibold"
                              style={{ color: "var(--accent-2)" }}
                            >
                              {label}:{" "}
                            </span>
                            {text}
                          </p>
                        ))}
                      </div>

                      {/* Stack — inline */}
                      <p
                        className="text-[12px]"
                        style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}
                      >
                        {e.stack.join(" · ")}
                      </p>
                    </div>

                    {/* Expandable details — opacity+translate only, no height animation */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.22, ease: "easeOut" }}
                          className="px-5 md:px-6 pb-5"
                          style={{ borderTop: "1px solid var(--border)" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ul className="space-y-2.5 pt-4">
                            {e.details.map((d, di) => (
                              <li
                                key={di}
                                className="flex gap-3 text-[13px] leading-relaxed"
                                style={{ color: "var(--text-2)" }}
                              >
                                <span
                                  className="mt-[7px] h-1 w-1 rounded-full flex-shrink-0"
                                  style={{ background: "var(--accent)" }}
                                />
                                {d}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
