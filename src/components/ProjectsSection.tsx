import { ArrowUpRight } from "lucide-react";
import Section, { Reveal } from "./Section";
import { InkBleed } from "./fx";

const PROJECTS = [
  {
    name: "Science Data Inventory",
    blurb: "Centralized searchable metadata portal for multi-TB genomics research outputs.",
    badge: "AAFC · Internal",
    metrics: "260 files/sec · 23× speedup · 1,000+ records",
    tags: "Python · scispaCy · Elasticsearch · PostgreSQL · Docker · CKAN",
  },
  {
    name: "Language Detection ML",
    blurb: "ML pipeline classifying text into multiple languages using TF-IDF + ensemble classifiers.",
    badge: "Open source",
    metrics: "94.2% accuracy · 17 languages · 50k features",
    tags: "Python · scikit-learn · TF-IDF · NLP · SVM · Jupyter",
    link: "https://github.com/salmanbashashaik/Language-Detection",
  },
  {
    name: "Cancer Image Detection",
    blurb: "Transfer learning pipeline for histopathology cancer vs. non-cancer classification.",
    badge: "In progress",
    metrics: "87.1% val accuracy · ResNet50 backbone",
    tags: "Python · PyTorch · Albumentations · scikit-learn · CNN",
    link: "https://github.com/salmanbashashaik/my-app",
  },
  {
    name: "Family Financial Tracker",
    blurb: "Desktop expense tracker built through a full Agile/Scrum development cycle.",
    badge: "Course project",
    metrics: "JUnit tested · CSV/XLS export",
    tags: "Java · JavaFX · Apache POI · JUnit · Agile/Scrum",
  },
];

export default function ProjectsSection() {
  return (
    <Section id="projects" index="03" title="Projects">
      <div>
        {PROJECTS.map((p, i) => {
          const inner = (
            <div className="grid grid-cols-[3rem_1fr_auto] gap-x-4 md:gap-x-6 items-baseline">
              <span className="font-mono text-[11.5px]" style={{ color: "var(--text-3)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-2">
                  <h3
                    className="display text-[1.3rem] md:text-[1.5rem] !leading-[1.15] transition-colors duration-300 group-hover:!text-[var(--accent)]"
                  >
                    {p.name}
                  </h3>
                  <span className="eyebrow" style={{ letterSpacing: "0.15em" }}>
                    {p.badge}
                  </span>
                </div>
                <p className="text-[13.5px] leading-[1.7] max-w-[34rem] mb-3" style={{ color: "var(--text-2)" }}>
                  {p.blurb}
                </p>
                <p className="font-mono text-[11px] mb-1.5" style={{ color: "var(--accent)" }}>
                  {p.metrics}
                </p>
                <p className="font-mono text-[11px]" style={{ color: "var(--text-3)" }}>
                  {p.tags}
                </p>
              </div>
              <span
                className="self-start transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: p.link ? "var(--text-2)" : "transparent" }}
              >
                <ArrowUpRight size={16} strokeWidth={1.5} />
              </span>
            </div>
          );

          return (
            <Reveal key={p.name} delay={i * 0.04}>
              <div
                className={i > 0 ? "pt-8 mt-8" : undefined}
                style={i > 0 ? { borderTop: "1px solid var(--border-soft)" } : undefined}
              >
                <InkBleed className="-mx-4 px-4 py-2 -my-2">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noreferrer" className="group block">
                      {inner}
                    </a>
                  ) : (
                    <div className="group">{inner}</div>
                  )}
                </InkBleed>
              </div>
            </Reveal>
          );
        })}

        <Reveal delay={0.1}>
          <div className="pt-8 mt-8" style={{ borderTop: "1px solid var(--border-soft)" }}>
            <a
              href="https://www.kaggle.com/shaiksalman28/code"
              target="_blank"
              rel="noreferrer"
              className="u-link inline-flex items-center gap-1 text-[13px]"
            >
              More notebooks on Kaggle
              <ArrowUpRight size={12} strokeWidth={1.75} />
            </a>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
