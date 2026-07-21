import { CERTS, SKILLS } from "../data/resume";
import Section from "./Section";
import { Reveal } from "../lib/motion";
import SkillMolecule from "./viz/SkillMolecule";

export default function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      title="Toolkit"
      aside={
        <p className="annotation text-[0.85rem] leading-relaxed">
          Drag an atom. The structure reorganizes around whatever you pull on.
        </p>
      }
    >
      <Reveal>
        <div
          className="card rounded-[3px] overflow-hidden"
          style={{ background: "color-mix(in srgb, var(--paper-2) 45%, transparent)" }}
        >
          <SkillMolecule className="h-[420px] md:h-[480px]" />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <dl className="mt-12 grid sm:grid-cols-2 gap-x-10 gap-y-9">
          {SKILLS.map((c) => (
            <div key={c.id}>
              <dt className="flex items-baseline justify-between gap-4 pb-2.5"
                style={{ borderBottom: "1px solid var(--rule-soft)" }}>
                <span className="mono text-[11px] uppercase tracking-[0.13em]">{c.label}</span>
                <span className="meta">{c.note}</span>
              </dt>
              <dd className="mt-3.5 flex flex-wrap gap-2">
                {c.items.map((i) => (
                  <span key={i} className="chip">
                    {i}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--rule-soft)" }}>
          <p className="eyebrow mb-4">Certifications</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2.5">
            {CERTS.map((c) => (
              <li key={c} className="text-[0.88rem]" style={{ color: "var(--ink-2)" }}>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </Section>
  );
}
