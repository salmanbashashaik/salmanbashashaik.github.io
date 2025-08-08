import Container from "../components/Container";
import Card from "../components/Card";
import SectionGlow from "../components/SectionGlow";
import { GraduationCap, BookOpen, FlaskConical } from "lucide-react";

const courses = [
  "Database Administrators",
  "Software Engineering",
  "Big Data Systems",
  "Artificial Intelligence",
  "Machine Learning",
  "Natural Language Processing",
];

export default function Education() {
  return (
    <Container>
      <section className="relative py-12">
        <SectionGlow />

        {/* Header */}
        <div className="relative mb-6 flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold tracking-tight">Education</h2>
        </div>

        {/* Degree */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-neutral-900/50 rounded-lg p-5">
        <div>
          
          <h4 className="font-semibold">B.CS — University of New Brunswick</h4>
          <p className="text-sm text-neutral-400">
            CompSci Honors along with Math Minor
          </p>
          <p className="text-sm text-neutral-400">
            Dean’s List (2022–2024) 
          </p>
          <p className="text-sm text-neutral-400">
            16 months of Co-op Experience
          </p>
          <p className="text-sm text-neutral-400">
            Data & Software Engineering Focused along with fundamentals of AI, ML, NLP
          </p>
        </div>
        <div className="mt-2 sm:mt-0 text-sm text-neutral-400">
          Apr 2026 (GPA 3.7)
        </div>
      </div>


        {/* Courses Done */}
        <div className="relative mt-6">
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold">Courses Done</h3>
          </div>
          <Card>
            <div className="p-5 flex flex-wrap gap-2">
              {courses.map((c) => (
                <span
                  key={c}
                  className="text-xs rounded-full bg-neutral-100 dark:bg-neutral-800 px-2 py-1"
                >
                  {c}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Research (Honours Thesis) */}
      <div className="relative mt-6">
        <div className="mb-2 flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold">Research (Honours Thesis)</h3>
        </div>
        <Card>
          <div className="p-5 space-y-3 text-sm leading-6">
            <p className="font-medium">
              <span className="text-indigo-600">Working title:</span>{" "}
              Generating Synthetic Early-Stage Hepatoblastoma Images with Generative AI
            </p>

            <p className="text-neutral-700 dark:text-neutral-300">
              Exploratory project to generate plausible early-stage Hepatoblastoma (a rare pediatric liver cancer) imagery (e.g., low-signal
              radiology or histopathology patches) using GANs and latent diffusion models.
              The intent is to produce controlled synthetic samples that can help with cancer detection, dataset
              balance, pretraining, and sensitivity studies—not to replace real clinical data. Supports my
              long-term goal of applying AI in the medical field.
            </p>

            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Data:</strong> Public research archives such as{" "}
                <a
                  href="https://www.cancerimagingarchive.net/browse-collections/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  The Cancer Imaging Archive (TCIA)
                </a>, focusing on relevant MRI/CT series.
              </li>
              <li>
                <strong>Methods:</strong> Compare StyleGAN-style models and latent-diffusion pipelines; test conditioning on metadata when available.
              </li>
              <li>
                <strong>Evaluation:</strong> FID/KID scores, precision–recall for diversity, and limited blinded human review.
              </li>
              <li>
                <strong>Ethics:</strong> Follow dataset licenses, watermark outputs, avoid PHI, and keep results for research only.
              </li>
            </ul>

            <p className="text-neutral-700 dark:text-neutral-300">
              <strong>Status:</strong> Literature review and dataset scouting in progress.
            </p>

            <p className="text-neutral-700 dark:text-neutral-300">
              <strong>Supervisor:</strong>{" "}
              <a
                href="https://www.cs.unb.ca/~pochec/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Pochec Przemysław
              </a>
            </p>
          </div>
        </Card>
      </div>

      </section>
    </Container>
  );
}
