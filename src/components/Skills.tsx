import { CERTS, SKILLS } from "../data/resume";
import Section from "./Section";
import { Reveal } from "../lib/motion";

export default function Skills() {
  return (
    <Section id="skills" index="04" title="Toolkit">
      <Reveal>
        <dl className="grid sm:grid-cols-2 gap-x-10 gap-y-7">
          {SKILLS.map((c) => (
            <div key={c.id}>
              <dt className="eyebrow">{c.label}</dt>
              <dd className="mt-3 flex flex-wrap gap-2">
                {c.items.map((i) => (
                  <span key={i} className="chip">
                    {i}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
        <p className="meta mt-10">{CERTS.join(" · ")}</p>
      </Reveal>
    </Section>
  );
}
