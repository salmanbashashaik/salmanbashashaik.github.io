import { ArrowUpRight } from "lucide-react";
import Section, { Reveal } from "./Section";

const GROUPS = [
  {
    label: "Data Engineering",
    skills: ["Python", "SQL", "ETL", "Elasticsearch", "PostgreSQL", "Docker", "asyncio", "CKAN"],
  },
  {
    label: "AI / Machine Learning",
    skills: ["PyTorch", "scikit-learn", "TF-IDF", "scispaCy", "Transfer Learning", "CNNs", "GANs"],
  },
  {
    label: "Software",
    skills: [".NET", "C#", "Blazor", "Java", "JavaFX", "Entity Framework", "SAP"],
  },
  {
    label: "Tools",
    skills: ["Git", "Power BI", "Tableau", "SQL Server", "Jupyter", "Linux", "GitHub Actions"],
  },
];

const CERTS = [
  { label: "HackerRank SQL (Advanced)", href: "https://www.hackerrank.com/certificates/2ec610f1e9e8" },
  { label: "Top 6% Kaggle Notebooks", href: "https://www.kaggle.com/shaiksalman28" },
];

export default function SkillsSection() {
  return (
    <Section id="skills" index="04" title="Skills">
      <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10">
        {GROUPS.map((g, i) => (
          <Reveal key={g.label} delay={i * 0.05}>
            <div className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="eyebrow mb-4">{g.label}</p>
              <p className="font-serif text-[1.1rem] leading-[1.9]" style={{ color: "var(--text-2)" }}>
                {g.skills.map((s, si) => (
                  <span key={s}>
                    {s}
                    {si < g.skills.length - 1 && (
                      <span style={{ color: "var(--text-3)" }}> · </span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-14 pt-6" style={{ borderTop: "1px solid var(--border-soft)" }}>
          <p className="eyebrow mb-4">Recognition</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {CERTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noreferrer"
                className="u-link inline-flex items-center gap-1 text-[13px]"
              >
                {c.label}
                <ArrowUpRight size={12} strokeWidth={1.75} />
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
