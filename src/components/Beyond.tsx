import { PERSONAL } from "../data/resume";
import Section from "./Section";
import { Reveal } from "../lib/motion";
import Spotify from "./Spotify";

export default function Beyond() {
  return (
    <Section
      id="beyond"
      index="05"
      title="Beyond the lab"
      aside={<p className="annotation text-[0.85rem] leading-relaxed">{PERSONAL.intro}</p>}
    >
      <Reveal>
        <div className="grid sm:grid-cols-2 gap-5">
          {PERSONAL.items.map((i) => (
            <article key={i.label} className="card p-6">
              <p className="eyebrow">{i.label}</p>
              <p className="mt-3 text-[0.94rem]" style={{ color: "var(--ink-2)" }}>{i.text}</p>
            </article>
          ))}
          <Spotify />
          <article className="card p-6 sm:col-span-2">
            <p className="eyebrow">Favourite genre: movies</p>
            <p className="mt-3 text-[0.94rem] max-w-[60ch]" style={{ color: "var(--ink-2)" }}>
              {PERSONAL.movieBlurb}
            </p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {PERSONAL.movies.map((m) => (
                <li key={m.title} className="chip">{m.title} <span style={{ opacity: 0.6 }}>· {m.note}</span></li>
              ))}
            </ul>
          </article>
        </div>
      </Reveal>
    </Section>
  );
}
