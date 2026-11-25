import { PUBLICATIONS, RESEARCH } from "../data/resume";
import Section from "./Section";
import { Reveal } from "../lib/motion";

export default function Research() {
  return (
    <Section id="research" title="Research">
      <Reveal>
        <p className="lede max-w-[40ch]">
          How do you make a generative model behave on data it was never shown enough of?
        </p>

        <div className="mt-10">
          {RESEARCH.map((role) => (
            <details key={role.title} className="py-5" style={{ borderTop: "1px solid var(--rule-soft)" }}>
              <summary className="cursor-pointer list-none">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="serif text-[1.35rem] leading-tight">{role.title}</h3>
                  <span className="meta">{role.dates}</span>
                </div>
                <p className="meta mt-1">{role.org}</p>
                <p className="mt-3 max-w-[60ch] text-[0.93rem]" style={{ color: "var(--ink-2)" }}>
                  {role.summary}
                </p>
              </summary>
              <ul className="mt-4 space-y-2.5 max-w-[66ch] list-disc pl-5 text-[0.9rem]" style={{ color: "var(--ink-2)" }}>
                {role.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <p className="eyebrow mt-12 mb-2">Publications</p>
        <ul>
          {PUBLICATIONS.map((p) => (
            <li
              key={p.title}
              className="py-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1"
              style={{ borderTop: "1px solid var(--rule-soft)" }}
            >
              <div className="max-w-[56ch]">
                <p className="serif text-[1.1rem] leading-snug">
                  {p.href ? (
                    <a href={p.href} target="_blank" rel="noreferrer" className="link">
                      {p.title}
                    </a>
                  ) : (
                    p.title
                  )}
                </p>
                <p className="meta mt-1">{p.venue}</p>
              </div>
              <span
                className="mono text-[10px] uppercase tracking-[0.13em] px-2.5 py-1 rounded-full"
                style={{ background: "color-mix(in srgb, var(--cyan) 18%, transparent)", color: "var(--cyan)" }}
              >
                {p.status}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
