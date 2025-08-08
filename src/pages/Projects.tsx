import Container from "../components/Container";
import Card from "../components/Card";
import SectionGlow from "../components/SectionGlow";

type Project = {
  name: string;
  blurb: string;
  bullets: string[];
  tags: string[];
  skills: string[];
  link?: string;
  badge?: string; // e.g., "In Progress"
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
      {children}
    </span>
  );
}

const skillsCore = [
  "Python", "Java", "SQL", "Docker", "Elasticsearch", "Logstash",
  "PyTorch", "scikit-learn", "Tableau", "Power BI"
];

const projects: Project[] = [
  {
    name: "Family Financial Tracker (Course Project)",
    blurb: "Desktop expense tracker built with JavaFX; full Agile/Scrum dev cycle with team of peers.",
    bullets: [
      "Designed GUI using JavaFX for intuitive transaction entry, categorization, and reporting.",
      "Implemented CSV/Excel import-export using Apache POI to fit users transitioning from spreadsheets.",
      "Applied Agile: wrote user stories, sprint planning, stand-ups, retrospectives; coordinated Git flow and pull requests.",
      "Added reporting features for monthly/yearly totals per user and category; implemented simple charting.",
    ],
    tags: ["JavaFX", "Apache POI", "Java", "JUnit", "Git"],
    skills: ["Agile/Scrum teamwork", "Desktop UI", "File parsing", "Unit testing", "Version control"],
    badge: "Internal (School)"
  },
  {
    name: "Language Detection",
    blurb:
      "Built a machine learning pipeline to classify text into multiple languages, enabling automated multilingual content tagging and analysis.",
    bullets: [
      "Preprocessed multilingual datasets with normalization, stopword removal, and tokenization.",
      "Engineered features using TF-IDF vectorization to represent linguistic patterns.",
      "Trained and compared multiple classifiers (Naive Bayes, Logistic Regression, SVM) for accuracy and generalization.",
      "Packaged the solution with a simple CLI for fast batch classification."
    ],
    tags: ["Python", "naive bayes", "NLP", "TF-IDF", "Text Classification"],
    skills: ["Jupyter NoteBooks", "Data Transfomration", "Data Preprocessing", "Evaluation"]
  },
  {
    name: "Science Data Inventory (AAFC)",
    blurb: "Centralized searchable metadata portal for multi-TB genomics outputs.",
    bullets: [
      "Automated metadata extraction using scispaCy (NER) and regex; normalized & indexed in Elasticsearch.",
      "Published curated fields to CKAN dashboards for research visibility.",
    ],
    tags: ["Python","scispaCy","Regex","Elasticsearch","PostgreSQL","Logstash","CKAN","Docker"],
    skills: ["Extraction pipelines","Search design","Data validation","Dashboard integration"],
    badge: "Internal (AAFC)",
  },
  {
    name: "Cancer Image Detection (In Progress)",
    blurb: "Transfer learning pipeline exploring cancer vs. non-cancer image classification (compute pending).",
    bullets: [
      "Curated dataset and exploratory analysis for histopathology patches.",
      "Built augmentation + transfer learning pipeline; designed evaluation metrics and experiment tracking.",
    ],
    tags: ["Python","PyTorch","Albumentations","scikit-learn"],
    skills: ["Transfer learning","Data augmentation","Model evaluation","Experiment setup"],
    link: "https://github.com/salmanbashashaik/my-app",
    badge: "In Progress",
  },
];

export default function SkillsProjects() {
  return (
    <Container>
      <section className="relative py-12">
        <SectionGlow />
        <h2 className="relative text-2xl font-semibold tracking-tight">
          Skills, Projects & Certifications
        </h2>

        {/* Projects */}
        <div className="relative mt-6 grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Card key={p.name}>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <div className="flex items-center gap-2">
                    {p.badge && (
                      <span className="text-[10px] uppercase tracking-wide rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
                        {p.badge}
                      </span>
                    )}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-indigo-500 hover:underline"
                      >
                        Repo
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-sm text-neutral-600 dark:text-neutral-300">{p.blurb}</p>

                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>

                <div className="flex flex-wrap gap-2 pt-1">
                  {p.tags.map((t) => <Pill key={t}>{t}</Pill>)}
                </div>

                <div className="pt-1">
                  <p className="font-medium text-xs text-indigo-500 mb-1">Skills Gained:</p>
                  <div className="flex flex-wrap gap-2">
                    {p.skills.map((s) => <Pill key={s}>{s}</Pill>)}
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* More button */}
          <div className="flex justify-center mt-6 md:col-span-2">
            <a
              href="https://www.kaggle.com/shaiksalman28/code"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors"
            >
              More →
            </a>
          </div>
        </div>

        {/* Core Skills */}
        <div className="relative mt-6">
          <Card>
            <div className="p-5">
              <h3 className="font-semibold mb-3">Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skillsCore.map((s) => <Pill key={s}>{s}</Pill>)}
              </div>
            </div>
          </Card>
        </div>

        {/* Certifications */}
        <div className="relative mt-6">
          <Card>
            <div className="p-5 space-y-2">
              <h3 className="font-semibold mb-3">Certifications</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  <a
                    href="https://www.hackerrank.com/certificates/2ec610f1e9e8"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-500 hover:underline"
                  >
                    HackerRank Problem Solving (Intermediate)
                  </a>
                </li>
                <li>
                  Top 6% on{" "}
                  <a
                    href="https://www.kaggle.com/shaiksalman28"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-500 hover:underline"
                  >
                    Kaggle Notebooks
                  </a>
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </section>
    </Container>
  );
}
