import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const GROUPS = [
  {
    label: "Data Engineering",
    skills: ["Python", "SQL", "ETL Pipelines", "Elasticsearch", "PostgreSQL", "Docker", "asyncio", "Logstash", "CKAN"],
  },
  {
    label: "AI / ML / NLP",
    skills: ["PyTorch", "scikit-learn", "TF-IDF", "scispaCy", "Transfer Learning", "CNNs", "GANs", "Diffusion Models"],
  },
  {
    label: "Software Engineering",
    skills: [".NET", "C#", "Blazor", "Java", "JavaFX", "Entity Framework", "SAP", "REST APIs"],
  },
  {
    label: "Tools & Platforms",
    skills: ["Git", "Power BI", "Tableau", "Power Apps", "SQL Server", "Jupyter", "Linux", "GitHub Actions"],
  },
];

const CERTS = [
  { label: "HackerRank SQL (Advanced)", href: "https://www.hackerrank.com/certificates/2ec610f1e9e8" },
  { label: "Top 6% Kaggle Notebooks", href: "https://www.kaggle.com/shaiksalman28" },
];

export default function SkillsSection() {
  return (
    <div id="skills" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <SectionHeader label="// tech stack" title="Skills" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          {GROUPS.map((g, gi) => (
            <motion.div
              key={g.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: gi * 0.06, duration: 0.5 }}
              className="surface rounded-2xl p-5"
            >
              <h3
                className="text-[11px] font-semibold mb-3 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-heading)", color: "var(--accent-2)" }}
              >
                {g.label}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <span
                    key={s}
                    className="text-[12px] px-2.5 py-1 rounded-lg font-mono cursor-default transition-all duration-150"
                    style={{ background: "var(--bg-2)", border: "1px solid var(--border)", color: "var(--text-2)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent-2)";
                      e.currentTarget.style.borderColor = "color-mix(in srgb, var(--accent) 35%, transparent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--text-2)";
                      e.currentTarget.style.borderColor = "var(--border)";
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="surface rounded-2xl p-5"
        >
          <h3 className="text-[11px] font-semibold mb-3 uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)", color: "var(--text-2)" }}>
            Certifications & Recognition
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {CERTS.map((c) => (
              <a
                key={c.label} href={c.href} target="_blank" rel="noreferrer"
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
