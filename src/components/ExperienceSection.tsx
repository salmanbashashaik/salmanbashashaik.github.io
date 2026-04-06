import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeader from "./SectionHeader";

const EXP = [
  {
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

function ExpandableDetails({ details, open }: { details: string[]; open: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.35s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div
          ref={ref}
          className="pt-4 pb-1"
          style={{ borderTop: "1px solid var(--border)", marginTop: "16px" }}
        >
          <ul className="space-y-2.5">
            {details.map((d, i) => (
              <li key={i} className="flex gap-3 text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                <span className="mt-[7px] h-1 w-1 rounded-full flex-shrink-0" style={{ background: "var(--accent)" }} />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ExperienceSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="experience" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionHeader label="// work history" title="Experience" />
        </motion.div>

        <div className="relative">
          <div
            className="absolute left-[7px] top-2 bottom-2 w-px"
            style={{ background: "linear-gradient(to bottom, var(--accent), color-mix(in srgb, var(--accent) 10%, transparent))" }}
          />

          <div className="space-y-5 pl-8">
            {EXP.map((e, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="relative"
                >
                  <motion.div
                    whileInView={{ scale: [0.4, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="absolute -left-8 top-5 h-3.5 w-3.5 rounded-full border-2"
                    style={{ background: "var(--bg)", borderColor: "var(--accent)", boxShadow: "0 0 0 4px var(--accent-subtle)" }}
                  />

                  <div
                    className="surface rounded-2xl p-5 md:p-6 grad-border transition-colors duration-300"
                    style={{ borderColor: isOpen ? "color-mix(in srgb, var(--accent) 25%, transparent)" : undefined }}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-[16px] font-bold leading-snug" style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}>
                          {e.role}
                        </h3>
                        <p className="text-[13px] mt-0.5" style={{ color: "var(--text-2)" }}>{e.company}</p>
                      </div>
                      <span
                        className="text-[11px] px-2.5 py-1 rounded-full font-mono shrink-0"
                        style={{ background: "var(--accent-subtle)", color: "var(--accent-2)", border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)" }}
                      >
                        {e.period}
                      </span>
                    </div>

                    {/* KPIs */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {e.kpis.map((k) => (
                        <span key={k} className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                          style={{ background: "var(--accent-subtle)", color: "var(--accent-2)", border: "1px solid color-mix(in srgb, var(--accent) 15%, transparent)" }}>
                          {k}
                        </span>
                      ))}
                    </div>

                    {/* Case study */}
                    <div className="space-y-1.5 mb-3">
                      {[{ label: "Problem", text: e.problem }, { label: "Approach", text: e.approach }, { label: "Impact", text: e.impact }].map(({ label, text }) => (
                        <p key={label} className="text-[13px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                          <span className="font-semibold" style={{ color: "var(--accent-2)" }}>{label}: </span>{text}
                        </p>
                      ))}
                    </div>

                    {/* Stack — inline, no boxes */}
                    <p className="text-[12px] mb-3" style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
                      {e.stack.join(" · ")}
                    </p>

                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-opacity hover:opacity-70"
                      style={{ color: "var(--accent)", fontFamily: "var(--font-heading)" }}
                    >
                      <ChevronDown
                        size={13}
                        style={{ transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }}
                      />
                      {isOpen ? "Hide details" : "Show details"}
                    </button>

                    <ExpandableDetails details={e.details} open={isOpen} />
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
