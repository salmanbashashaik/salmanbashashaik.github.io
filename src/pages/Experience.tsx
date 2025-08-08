import Container from "../components/Container";
import Card from "../components/Card";
import SectionGlow from "../components/SectionGlow";

const experience = [
  {
    role: "Data Engineer Intern — Bioinformatics",
    company: "Agriculture and Agri-Food Canada (AAFC)",
    period: "Jan 2025 – Present",
    highlights: [
      "23× ingestion speedup (11 → 260 files/sec) via parallel I/O and pipeline tuning.",
      "ETL: moved 1,000+ metadata records ES → PostgreSQL with integrity checks.",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "New Brunswick Power Corporation",
    period: "Sep 2023 – Apr 2024",
    highlights: [
      ".NET/C# apps integrated with SAP; delivered features in a large enterprise stack.",
      "Built internal tools and dashboards with Power Apps, Power BI, and Tableau.",
    ],
  },
];

export default function Experience() {
  return (
    <Container>
      <section className="relative py-12">
        <SectionGlow />
        <h2 className="relative text-2xl font-semibold tracking-tight">Experience</h2>
        <div className="relative mt-5 space-y-4">
          {experience.map((e) => (
            <Card key={e.company}>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{e.role}</h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">{e.company}</p>
                  </div>
                  <span className="text-xs opacity-80">{e.period}</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {e.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </Container>
  );
}
