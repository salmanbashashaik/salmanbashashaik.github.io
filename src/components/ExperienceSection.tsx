import Section, { Reveal } from "./Section";

const EXP = [
  {
    role: "Data Engineer Intern — Bioinformatics",
    company: "Agriculture & Agri-Food Canada",
    period: "Jan 2025 — Present",
    kpis: "23× faster ingest · 260 files/sec · 1,000+ records",
    stack: "Python · Elasticsearch · Docker · PostgreSQL · scispaCy · CKAN · asyncio",
    story: [
      { label: "Problem", text: "Research datasets scattered across labs — scientists couldn't find or reuse each other's work." },
      { label: "Approach", text: "Built centralized ETL with NER (scispaCy) + regex extraction, parallelized with asyncio/multiprocessing, indexed in Elasticsearch, published to CKAN dashboards." },
      { label: "Impact", text: "23× ingest speedup to 260 files/sec. 1,000+ records normalized into a unified, searchable metadata catalog." },
    ],
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
    period: "Sep 2023 — Apr 2024",
    kpis: "Company-wide lookup · Multi-field filters · CSV export",
    stack: ".NET · C# · Blazor · Telerik UI · SQL Server · Entity Framework · SAP · Power BI",
    story: [
      { label: "Problem", text: "Teams needed fast, consistent people-search across departments — legacy lookups were slow and inconsistent." },
      { label: "Approach", text: "Built Blazor app with Telerik DataGrid over normalized SQL Server directory. Server-side filtering by dept/unit/floor/role, SAP-linked fields, one-click CSV export." },
      { label: "Impact", text: "People-search became instant and self-serve org-wide. CSV export eliminated ad-hoc IT requests." },
    ],
    details: [
      "Blazor components with Telerik UI — server-side paging, sorting, filtering via EF to SQL Server",
      "RFC-compatible CSV export with email, department, unit, floor, and role fields",
      "Enhanced .NET/C# apps integrated with SAP modules; improved data flow reliability",
      "Low-code Power Apps + Power BI prototype to surface KPIs rapidly",
    ],
  },
];

export default function ExperienceSection() {
  return (
    <Section id="experience" index="02" title="Experience">
      <div className="space-y-14">
        {EXP.map((e, i) => (
          <Reveal key={e.role} delay={i * 0.05}>
            <article
              className={i > 0 ? "pt-14" : undefined}
              style={i > 0 ? { borderTop: "1px solid var(--border-soft)" } : undefined}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-2">
                <h3 className="display text-[1.4rem] md:text-[1.6rem] !leading-[1.15]">
                  {e.role}
                </h3>
                <span className="font-mono text-[11.5px] shrink-0" style={{ color: "var(--text-3)" }}>
                  {e.period}
                </span>
              </div>
              <p className="font-serif italic text-[1.05rem] mb-3" style={{ color: "var(--text-2)" }}>
                {e.company}
              </p>
              <p className="font-mono text-[11.5px] tracking-[0.04em] mb-7" style={{ color: "var(--accent)" }}>
                {e.kpis}
              </p>

              <div className="space-y-4 max-w-[38rem] mb-7">
                {e.story.map(({ label, text }) => (
                  <p key={label} className="text-[14px] leading-[1.8]" style={{ color: "var(--text-2)" }}>
                    <span
                      className="eyebrow mr-3"
                      style={{ letterSpacing: "0.15em", color: "var(--text)" }}
                    >
                      {label}
                    </span>
                    {text}
                  </p>
                ))}
              </div>

              <details className="notes mb-6">
                <summary>Further notes</summary>
                <ul className="mt-5 space-y-3 max-w-[38rem]">
                  {e.details.map((d) => (
                    <li
                      key={d}
                      className="flex gap-4 text-[13.5px] leading-[1.7]"
                      style={{ color: "var(--text-2)" }}
                    >
                      <span className="font-mono text-[11px] mt-[3px]" style={{ color: "var(--text-3)" }}>
                        —
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
              </details>

              <p className="font-mono text-[11.5px]" style={{ color: "var(--text-3)" }}>
                {e.stack}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
