import Container from "../components/Container";
import Card from "../components/Card";
import SectionGlow from "../components/SectionGlow";

const skills = ["Python","Java","SQL","Docker","Elasticsearch","Logstash","PyTorch","scikit-learn","Tableau","Power BI"];

const projects = [
  {
    name: "Tennis Match Prediction",
    blurb:
      "End-to-end pipeline predicting match outcomes. Benchmarked NB, Logistic Regression, and small NN with proper preprocessing and metrics.",
    tags: ["Python", "scikit-learn", "Model Eval"],
    link: "#",
  },
  {
    name: "Science Data Inventory @ AAFC",
    blurb:
      "Automated metadata extraction from sequencing files; ingested into Elasticsearch via Logstash (Docker) for fast search on an ELK stack.",
    tags: ["ETL", "Elasticsearch", "Logstash", "Docker"],
    link: "#",
  },
];

const certs: { name: string; year: string }[] = [
  // add when ready:
  // { name: "AWS Certified Cloud Practitioner", year: "2025" },
];

export default function SkillsProjects() {
  return (
    <Container>
      <section className="relative py-12">
        <SectionGlow />
        <h2 className="relative text-2xl font-semibold tracking-tight">Skills, Projects & Certifications</h2>

        {/* Skills */}
        <div className="relative mt-6">
          <Card>
            <div className="p-5">
              <h3 className="font-semibold mb-3">Core Skills</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Projects */}
        <div className="relative mt-6 grid md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Card key={p.name}>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold">{p.name}</h3>
                  <a
                    href={p.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    Repo
                  </a>
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{p.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className="relative mt-6">
          <Card>
            <div className="p-5">
              <h3 className="font-semibold mb-3">Certifications</h3>
              {certs.length === 0 ? (
                <p className="text-sm text-neutral-500">Coming soon.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {certs.map((c) => (
                    <li key={c.name}>
                      {c.name} — {c.year}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </section>
    </Container>
  );
}
