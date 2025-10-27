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
const proposalHref = `${import.meta.env.BASE_URL}proposal.pdf`;

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
              Few-Shot/Zero-Shot Cross-Domain Image Generation for Data-Scarce Domains: A Medical Imaging Case Study on Diffuse Glioma
            </p>

            <p className="text-neutral-700 dark:text-neutral-300">
            This exploratory project investigates whether generative AI models can synthesize realistic and anatomically coherent diffuse glioma MRI images using knowledge transferred from a data-rich glioblastoma source domain. 
            By leveraging Conditional GANs (cGANs) and Latent Diffusion Models (LDMs), 
            the study explores how generative transfer can overcome data scarcity and imbalance in rare pediatric brain tumors.
            Rather than replacing clinical data, the aim is to generate controlled, domain-faithful synthetic images that can support dataset balancing, model pretraining, and sensitivity analyses for early tumor detection and segmentation tasks.
            </p>

            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>Data:</strong> Publicly available MRI datasets from {" "}
                <a
                  href="https://www.cancerimagingarchive.net/browse-collections/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  The Cancer Imaging Archive (TCIA)
                </a> - specifically, the glioblastoma multiforme (GBM) dataset as the source domain and the diffuse glioma dataset as the target domain - comprising T1, T2, and FLAIR modalities.
              </li>
              <li>
                <strong>Methods:</strong> 
                  Compare Conditional GANs and other Gen AI pipelines for image fidelity and structural realism.
                  Explore few-shot and zero-shot scenarios to evaluate generative adaptability under extreme data scarcity.
                  Integrate GLIP-based semantic conditioning, enabling zero-shot alignment between source and target MRI domains using text–image embeddings.
              </li>
              <li>
                <strong>Evaluation:</strong> Assess synthetic data quality using Fréchet Inception Distance (FID), Kernel Inception Distance (KID), 
                and precision–recall metrics for diversity.
                Further evaluate functional utility through a CNN-based tumor classifier, measuring improvements in classification accuracy when augmented with synthetic images.
              </li>
              <li>
                <strong>Ethics:</strong> Follow dataset licenses, watermark outputs, avoid PHI, and keep results for research only.
              </li>
            </ul>

            <p className="text-neutral-700 dark:text-neutral-300">
              <strong>Status:</strong> Dataset pre-processing, and baseline GAN training are in progress.
            </p>

            <p className="text-neutral-700 dark:text-neutral-300">
              <strong>Supervisor:</strong>{" "}
              <a
                href="https://www.cs.unb.ca/~hcao3/"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Dr. Hung Cao
              </a>
            </p>
            
            {/* Read my proposal */}
            <div className="relative mt-8 flex flex-wrap items-center gap-3">
              <a
                href={proposalHref}
                download="Shaik_Salman_Basha_Proposal.pdf"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700"
              >
                Read My Proposal (PDF)
              </a>
            </div>

          </div>
        </Card>
      </div>

      </section>
    </Container>
  );
}
