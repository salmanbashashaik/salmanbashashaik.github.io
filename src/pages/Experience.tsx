import { useState } from "react";
import Container from "../components/Container";
import SectionGlow from "../components/SectionGlow";
import Card from "../components/Card";
import { motion, type Variants } from "framer-motion";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Gauge,
  Zap,
  Boxes,
} from "lucide-react";

/* ---------- data ---------- */
type Exp = {
  role: string;
  company: string;
  period: string;
  oneLiner: string;
  kpis: { icon: "zap" | "gauge" | "boxes"; label: string }[];
  stack: string[];
  case: { problem: string; approach: string; impact: string };
  details: string[];
};

// const fadeUp = {
//   hidden: { opacity: 0, y: 12 },
//   show: (i = 0) => ({
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.35, ease: "easeOut", delay: i * 0.06 },
//   }),
// } satisfies Variants;

const EXP: Exp[] = [
  {
    role: "Data Engineer Intern — Bioinformatics",
    company: "Agriculture and Agri-Food Canada (AAFC)",
    period: "Jan 2025 – Present",
    oneLiner:
      "Built fast, searchable data plumbing for multi-TB genomics and research metadata.",
    kpis: [
      { icon: "zap", label: "23× faster ingest" },
      { icon: "gauge", label: "260 files/sec" },
      { icon: "boxes", label: "1,000+ records migrated" },
    ],
    stack: [
      "Python",
      "Ruby",
      "Elasticstack",
      "Docker",
      "PostgreSQL",
      "SciSpaCy (NER)",
      "Regex",
      "Git",
    ],
    case: {
      problem:
        "Research scientists across AAFC generate lots of datasets, but important info was scattered and hard for other scientists to find or reuse.",
      approach:
        "Helped build an app to centralize key metadata from outputs across labs. Extracted fields with NER (scispaCy), regex rules, and lightweight validation; discarded noise. Indexed everything for search and published summary fields to CKAN with dashboards.",
      impact:
        "Unified, searchable metadata catalog; 23× ingest boost (to 260 files/sec), >1k records normalized; key fields visible to the org via CKAN dashboards.",
    },
    details: [
      "Parallelized ETL (Python) with asyncio/multiprocessing; containerized with Docker.",
      "Metadata extraction via scispaCy (NER) and regex patterns; schema validation and deduping.",
      "Elasticsearch for indexing/search, PostgreSQL for curated relational storage.",
      "Automated primer/sequence routines (FASTQ/BAM) and taxonomy/metadata hooks.",
      "Published curated fields to CKAN and built dashboards highlighting important attributes.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "New Brunswick Power Corporation",
    period: "Sep 2023 – Apr 2024",
    oneLiner:
      "Built an internal Email Lookup tool and shipped SAP-integrated .NET features plus low-code apps.",
    kpis: [
      { icon: "zap", label: "Company-wide lookup" },
      { icon: "gauge", label: "Multi-field filters" },
      { icon: "boxes", label: "CSV export" },
    ],
    stack: [
      ".NET",
      "C#",
      "Blazor",
      "Telerik UI",
      "SQL Server",
      "Entity Framework",
      "SAP",
      "Power Apps",
      "Power BI",
      "Tableau",
      "Source Anywhere",
    ],
    case: {
      problem:
        "Teams needed a fast, consistent way to find people across departments/units/floors and export contacts; legacy lookups were slow and inconsistent.",
      approach:
        "Built a Blazor app with Telerik DataGrid over a normalized SQL Server directory. Implemented server-side filtering (dept, unit, floor, role), SAP-linked data fields, and one-click CSV export.",
      impact:
        "People-search became instant and self-serve across the org; CSV export streamlined workflows and reduced ad-hoc requests to IT.",
    },
    details: [
      "Developed Blazor components with Telerik UI (server-side paging/sorting/filtering) via EF to SQL Server.",
      "Added CSV export (RFC-compatible) with email, department, unit, floor, and role fields.",
      "Enhanced .NET/C# apps integrated with SAP modules; improved data flow and reliability.",
      "Delivered a low-code app prototype with Microsoft Power Platform (Power Apps + Power BI) to surface KPIs rapidly.",
    ],
  },
];

/* ---------- little UI bits ---------- */
function Kpi({ kind, label }: { kind: "zap" | "gauge" | "boxes"; label: string }) {
  const Icon = kind === "zap" ? Zap : kind === "gauge" ? Gauge : Boxes;
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100/70 dark:bg-neutral-800/70 px-3 py-1 text-xs">
      <Icon className="h-4 w-4" /> {label}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
      {children}
    </span>
  );
}

/* ---------- motion variants ---------- */
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.06 },
  }),
} satisfies Variants;

const glowHover = {
  rest: { scale: 1, boxShadow: "0 0 0 0 rgba(0,0,0,0)" },
  hover: {
    scale: 1.01,
    boxShadow: "0 0 0 3px rgba(99,102,241,0.15)",
    transition: { duration: 0.2 },
  },
};

/* ---------- card ---------- */
function ExperienceCard({ e, i, isLast }: { e: Exp; i: number; isLast: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="relative pl-8"
      custom={i}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
    >
      {/* timeline spine + node */}
      <div className="absolute left-0 top-1.5 h-full w-px bg-neutral-300/40 dark:bg-neutral-700/40" />
      <motion.div
        className="absolute -left-1 top-1 h-3 w-3 rounded-full bg-indigo-500"
        initial={{ scale: 0.8, boxShadow: "0 0 0 0 rgba(99,102,241,0.0)" }}
        whileInView={{
          scale: 1,
          boxShadow: "0 0 0 6px rgba(99,102,241,0.20)",
          transition: { duration: 0.5 },
        }}
        viewport={{ once: true }}
      />
      <motion.div initial="rest" whileHover="hover" animate="rest" variants={glowHover}>
        <Card>
          <div className="p-5 space-y-4">
            {/* header */}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{e.role}</h3>
                <p className="mt-0.5 text-sm text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> {e.company}
                </p>
              </div>
              <div className="text-xs opacity-80 flex items-center gap-1">
                <CalendarDays className="h-4 w-4" /> {e.period}
              </div>
            </div>

            {/* one-liner */}
            <p className="text-sm text-neutral-200/90 dark:text-neutral-300/90">{e.oneLiner}</p>

            {/* KPIs */}
            <div className="flex flex-wrap gap-2">
              {e.kpis.map((k, idx) => (
                <Kpi key={idx} kind={k.icon} label={k.label} />
              ))}
            </div>

            {/* mini case */}
            <div className="grid gap-1.5 text-sm">
              <div>
                <span className="font-medium text-indigo-400">Problem:</span> {e.case.problem}
              </div>
              <div>
                <span className="font-medium text-indigo-400">Approach:</span> {e.case.approach}
              </div>
              <div>
                <span className="font-medium text-indigo-400">Impact:</span> {e.case.impact}
              </div>
            </div>

            {/* stack */}
            <div className="flex flex-wrap gap-2">
              {e.stack.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>

            {/* toggle details */}
            <div className="pt-1">
              <button
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300"
              >
                {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {open ? "Hide details" : "Show details"}
              </button>
              {open && (
                <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                  {e.details.map((d, idx) => (
                    <li key={idx}>{d}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {!isLast && <div className="h-6" />}
    </motion.div>
  );
}

/* ---------- page ---------- */
export default function Experience() {
  return (
    <Container>
      <section className="relative py-12">
        <SectionGlow />
        <h1 className="relative text-2xl font-semibold tracking-tight">Experience</h1>

        <div className="relative mt-6 space-y-6">
          {EXP.map((e, idx) => (
            <ExperienceCard key={e.company} e={e} i={idx} isLast={idx === EXP.length - 1} />
          ))}
        </div>
      </section>
    </Container>
  );
}
