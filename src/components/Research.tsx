import { PUBLICATIONS, RESEARCH } from "../data/resume";
import Section from "./Section";
import { Bloom, MaskLines, Reveal } from "../lib/motion";

export default function Research() {
  return (
    <Section
      id="research"
      index="01"
      title="Research"
      aside={
        <p className="annotation text-[0.85rem] leading-relaxed">
          One question underneath all of it: how do you make a generative model
          behave on data it was never shown enough of?
        </p>
      }
    >
      <Reveal>
        <p className="lede max-w-[62ch]">
          <MaskLines
            lines={[
              "Large-scale pretraining of biological foundation",
              "models, 3D latent diffusion for synthetic data,",
              "few-shot domain adaptation, and out-of-distribution",
              "generalization.",
            ]}
          />
        </p>
        <p className="mt-6 max-w-[62ch] text-[0.94rem]" style={{ color: "var(--ink-2)" }}>
          The applications differ — the gut microbiome, drug discovery, pediatric
          neuro-oncology — but the failure mode is shared. Models that look strong
          in-distribution fall apart the moment the cohort, the scanner, or the
          assay changes, and the scientific domains that need them most are the
          ones with the least data.
        </p>
      </Reveal>

      <div className="mt-14 space-y-14">
        {RESEARCH.map((role, i) => {
          const lead = i === 0 && false;
          return (
            <Reveal key={role.title} delay={i * 0.05}>
              <Bloom as="article" className="card p-6 md:p-8">
                {lead && (
                  <span
                    className="mono text-[9.5px] uppercase tracking-[0.16em] px-2 py-0.5 rounded-[2px] inline-block mb-4"
                    style={{
                      background: "color-mix(in srgb, var(--cyan) 16%, transparent)",
                      color: "var(--cyan)",
                    }}
                  >
                    Current focus
                  </span>
                )}

                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3
                    className={`serif leading-tight ${lead ? "text-[1.75rem] max-w-[24ch]" : "text-[1.4rem]"}`}
                  >
                    {role.title}
                  </h3>
                  <span className="meta">{role.dates}</span>
                </div>
                <p className="mt-1.5 text-[0.9rem]" style={{ color: "var(--ink-2)" }}>
                  {role.org}
                </p>

                <details className="more mt-6"><summary>Key details</summary><ul className="mt-6 space-y-3.5 max-w-[68ch]">
                  {role.points.map((p) => (
                    <li key={p} className="flex gap-3.5 text-[0.9rem] leading-relaxed">
                      <span
                        aria-hidden
                        className="mt-[0.62em] h-px w-4 shrink-0"
                        style={{ background: "var(--red)" }}
                      />
                      <span style={{ color: "var(--ink-2)" }}>{p}</span>
                    </li>
                  ))}
                </ul></details>

                </Bloom>
            </Reveal>
          );
        })}
      </div>

      {/* Publications */}
      <Reveal delay={0.05}>
        <div className="mt-16">
          <p className="eyebrow mb-5">Publications</p>
          <div className="space-y-5">
            {PUBLICATIONS.map((p) => {
              const accepted = p.tone === "accepted";
              return (
                <Bloom key={p.title} className="card p-6 md:p-7">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span
                      className="mono text-[10px] uppercase tracking-[0.13em] px-2 py-0.5 rounded-[2px]"
                      style={{
                        background: `color-mix(in srgb, var(--${accepted ? "cyan" : "amber"}) 16%, transparent)`,
                        color: `var(--${accepted ? "cyan" : "amber"})`,
                      }}
                    >
                      {p.status}
                    </span>
                    <span className="meta">{p.venue}</span>
                    {p.note && <span className="meta">· {p.note}</span>}
                  </div>

                  <p className="serif text-[1.18rem] leading-snug max-w-[54ch]">“{p.title}”</p>
                  <p className="meta mt-3">{p.authors}</p>

                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link mono text-[11px] uppercase tracking-[0.13em] inline-block mt-5"
                    >
                      Read the paper ↗
                    </a>
                  )}
                </Bloom>
              );
            })}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
