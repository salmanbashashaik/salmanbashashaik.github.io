import { PROFILE } from "../data/resume";
import Section from "./Section";
import { Reveal } from "../lib/motion";

export default function About() {
  return (
    <Section id="about" title="About">
      <Reveal>
        <div className="grid md:grid-cols-[260px_1fr] gap-10 md:gap-14 items-center">
          <div className="portrait">
            <img src="/salman.jpg" alt="Salman Basha in a UNB Reds shirt" />
          </div>
          <div>
            <p className="lede max-w-[40ch]">
              I'm Salman, a machine learning researcher who likes problems where the data runs out.
            </p>
            <p className="mt-6 max-w-[58ch] text-[0.96rem]" style={{ color: "var(--ink-2)" }}>
              {PROFILE.interests.replace(/\n/g, " ")}
            </p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
