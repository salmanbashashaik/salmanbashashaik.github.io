import { motion } from "framer-motion";
import { FlaskConical, BookOpen, ExternalLink } from "lucide-react";
import SectionHeader from "./SectionHeader";

const COURSES = [
  "Big Data Systems", "Machine Learning", "Natural Language Processing",
  "Data Mining", "Database Administration", "Software Engineering",
  "Data Science for Big Data Analytics",
];

const paperHref = `${import.meta.env.BASE_URL}ALDM-Salman-paper.pdf`;

export default function EducationSection() {
  return (
    <section id="education" className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <SectionHeader label="// academic background" title="Education" />
        </motion.div>

        {/* ── MMath Waterloo — FEATURED ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-2xl p-6 mb-5 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 12%, var(--bg-2)) 0%, var(--bg-2) 100%)",
            border: "1px solid color-mix(in srgb, var(--accent) 35%, transparent)",
          }}
        >
          {/* Glow */}
          <div
            aria-hidden
            className="absolute -top-16 -right-16 h-48 w-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
              filter: "blur(30px)",
            }}
          />

          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div>
              {/* Incoming badge */}
              <span
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-3"
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.05em",
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse-ring" />
                INCOMING · FALL 2026
              </span>

              <h3
                className="text-xl font-extrabold leading-snug mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
              >
                MMath — Master of Mathematics
              </h3>
              <p
                className="text-[14px] font-medium mb-3"
                style={{ color: "var(--accent-2)" }}
              >
                University of Waterloo
              </p>
              <p className="text-[13px] leading-relaxed max-w-lg" style={{ color: "var(--text-2)" }}>
                Pursuing graduate research at the intersection of{" "}
                <span style={{ color: "var(--text)" }} className="font-medium">AI, data systems, and machine learning</span>.
                The next chapter — building on 4 years of engineering and research experience.
              </p>
            </div>
            <div className="text-right shrink-0">
              <span
                className="font-mono text-[12px]"
                style={{ color: "var(--text-3)" }}
              >
                Sept 2026
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── UNB Undergrad ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="surface rounded-2xl p-6 mb-5 grad-border"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3
                className="text-[17px] font-bold mb-1"
                style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
              >
                B.CS (Honours) + Math Minor
              </h3>
              <p className="text-[13px] mb-3" style={{ color: "var(--text-2)" }}>
                University of New Brunswick
              </p>
              <div className="flex flex-wrap gap-2">
                {["Dean's List 2022–2024", "GPA 3.8", "16 months Co-op", "Data & AI Focus"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-2)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <span className="font-mono text-[12px] shrink-0" style={{ color: "var(--text-3)" }}>
              Apr 2026
            </span>
          </div>
        </motion.div>

        {/* ── Coursework ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="surface rounded-2xl p-5 mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4" style={{ color: "var(--accent)" }} />
            <h3
              className="text-[12px] font-semibold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-heading)", color: "var(--text-2)" }}
            >
              Relevant Coursework
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {COURSES.map((c) => (
              <span
                key={c}
                className="text-[12px] px-2.5 py-1 rounded-lg font-mono"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-2)",
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Honours Thesis ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl p-6 relative overflow-hidden"
          style={{
            background: "var(--bg-2)",
            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
          }}
        >
          <div
            aria-hidden
            className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, var(--accent-glow), transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="p-1.5 rounded-lg"
                style={{ background: "var(--accent-subtle)", border: "1px solid color-mix(in srgb, var(--accent) 25%, transparent)" }}
              >
                <FlaskConical className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />
              </div>
              <span
                className="text-[11px] font-semibold uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)", color: "var(--accent)" }}
              >
                Honours Thesis
              </span>
            </div>

            <h3
              className="text-[16px] font-bold leading-snug mb-3"
              style={{ fontFamily: "var(--font-heading)", color: "var(--text)" }}
            >
              Few-Shot/Zero-Shot Cross-Domain Image Generation for Data-Scarce Domains:{" "}
              <span style={{ color: "var(--accent-2)" }}>
                A Medical Imaging Case Study on Diffuse Glioma
              </span>
            </h3>

            <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--text-2)" }}>
              Investigating whether generative AI (cGANs + Latent Diffusion Models) can synthesize
              realistic, anatomically coherent diffuse glioma MRI images by transferring knowledge
              from a data-rich glioblastoma source domain — overcoming data scarcity in rare
              pediatric brain tumors.
            </p>

            <div className="grid md:grid-cols-3 gap-3 mb-4">
              {[
                { label: "Data", text: "TCIA GBM + Diffuse Glioma (T1, T2, FLAIR)" },
                { label: "Methods", text: "cGANs, LDMs, GLIP conditioning, few/zero-shot" },
                { label: "Evaluation", text: "FID, KID, precision-recall, CNN classifier" },
              ].map(({ label, text }) => (
                <div
                  key={label}
                  className="rounded-xl p-3"
                  style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <p
                    className="text-[11px] font-semibold mb-1 uppercase tracking-wider"
                    style={{ color: "var(--accent)", fontFamily: "var(--font-heading)" }}
                  >
                    {label}
                  </p>
                  <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-2)" }}>
                    {text}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="flex flex-wrap items-center gap-3 text-[12px] mb-4"
              style={{ color: "var(--text-3)" }}
            >
              <span>
                Status:{" "}
                <span style={{ color: "#f59e0b" }}>
                  Dataset preprocessing + baseline GAN training in progress
                </span>
              </span>
              <span>·</span>
              <span>
                Supervisor:{" "}
                <a
                  href="https://www.hungcao.me/"
                  target="_blank"
                  rel="noreferrer"
                  className="transition-opacity hover:opacity-70"
                  style={{ color: "var(--accent-2)" }}
                >
                  Dr. Hung Cao
                </a>
              </span>
            </div>

            <a
              href={paperHref}
              download="ALDM-Salman-paper.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
              style={{
                background: "var(--accent-subtle)",
                border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                color: "var(--accent-2)",
                fontFamily: "var(--font-heading)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 15%, transparent)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent-subtle)")}
            >
              Read Paper (PDF) <ExternalLink size={12} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
