import { ArrowUpRight } from "lucide-react";
import Section, { Reveal } from "./Section";
import { InkBleed } from "./fx";

const COURSES = [
  "Big Data Systems", "Machine Learning", "Natural Language Processing",
  "Data Mining", "Database Administration", "Software Engineering",
  "Data Science for Big Data Analytics",
];

const paperHref = `${import.meta.env.BASE_URL}ALDM-Salman-paper.pdf`;

export default function EducationSection() {
  return (
    <Section id="education" index="01" title="Education">
      {/* Waterloo — featured */}
      <Reveal>
        <div className="pb-10">
          <p className="eyebrow mb-4" style={{ color: "var(--accent)" }}>
            Incoming — Fall 2026
          </p>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-3">
            <h3 className="display text-[1.75rem] md:text-[2.1rem]">
              Master of Mathematics
            </h3>
            <span className="font-mono text-[11.5px]" style={{ color: "var(--text-3)" }}>
              Sept 2026
            </span>
          </div>
          <p className="font-serif italic text-[1.15rem] mb-4" style={{ color: "var(--text-2)" }}>
            University of Waterloo
          </p>
          <p className="text-[14px] leading-[1.8] max-w-[36rem]" style={{ color: "var(--text-2)" }}>
            Graduate research at the intersection of AI, data systems, and machine
            learning — the next chapter, built on four years of engineering and
            research experience.
          </p>
        </div>
      </Reveal>

      {/* UNB */}
      <Reveal delay={0.05}>
        <div className="py-10" style={{ borderTop: "1px solid var(--border-soft)" }}>
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 mb-3">
            <h3 className="display text-[1.4rem] md:text-[1.6rem]">
              B.CS (Honours), Minor in Mathematics
            </h3>
            <span className="font-mono text-[11.5px]" style={{ color: "var(--text-3)" }}>
              Apr 2026
            </span>
          </div>
          <p className="font-serif italic text-[1.05rem] mb-4" style={{ color: "var(--text-2)" }}>
            University of New Brunswick
          </p>
          <p className="font-mono text-[12px] leading-[2]" style={{ color: "var(--text-3)" }}>
            Dean's List 2022–2024 · GPA 3.8 · 16 months co-op · Data &amp; AI focus
          </p>
          <p className="mt-4 text-[13px] leading-[1.9] max-w-[38rem]" style={{ color: "var(--text-3)" }}>
            <span className="eyebrow mr-3" style={{ letterSpacing: "0.15em" }}>Coursework</span>
            {COURSES.join(" · ")}
          </p>
        </div>
      </Reveal>

      {/* Honours thesis */}
      <Reveal delay={0.1}>
        <InkBleed
          className="p-7 md:p-9"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="eyebrow mb-5" style={{ color: "var(--accent)" }}>
            Honours Thesis
          </p>
          <h3 className="display text-[1.35rem] md:text-[1.6rem] !leading-[1.2] mb-4">
            Few-Shot / Zero-Shot Cross-Domain Image Generation for Data-Scarce
            Domains — <em>a medical imaging case study on diffuse glioma</em>
          </h3>
          <p className="text-[14px] leading-[1.8] max-w-[38rem] mb-8" style={{ color: "var(--text-2)" }}>
            Investigating whether generative AI (cGANs and Latent Diffusion Models) can
            synthesize realistic, anatomically coherent diffuse glioma MRI images by
            transferring knowledge from a data-rich glioblastoma source domain —
            overcoming data scarcity in rare pediatric brain tumors.
          </p>

          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Data", text: "TCIA GBM + Diffuse Glioma (T1, T2, FLAIR)" },
              { label: "Methods", text: "cGANs, LDMs, GLIP conditioning, few/zero-shot" },
              { label: "Evaluation", text: "FID, KID, precision-recall, CNN classifier" },
            ].map(({ label, text }) => (
              <div key={label} className="pt-3" style={{ borderTop: "1px solid var(--border-soft)" }}>
                <p className="eyebrow mb-2" style={{ letterSpacing: "0.15em" }}>{label}</p>
                <p className="text-[12.5px] leading-[1.7]" style={{ color: "var(--text-2)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-3)" }}>
              In progress — dataset preprocessing &amp; baseline GAN training.
              Supervised by{" "}
              <a
                href="https://www.hungcao.me/"
                target="_blank"
                rel="noreferrer"
                className="u-link"
              >
                Dr. Hung Cao
              </a>
            </p>
            <a
              href={paperHref}
              download="ALDM-Salman-paper.pdf"
              className="u-link inline-flex items-center gap-1 text-[13px]"
            >
              Read the paper (PDF)
              <ArrowUpRight size={12} strokeWidth={1.75} />
            </a>
          </div>
        </InkBleed>
      </Reveal>
    </Section>
  );
}
