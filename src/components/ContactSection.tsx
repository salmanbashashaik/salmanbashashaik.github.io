import { ArrowUpRight } from "lucide-react";
import Section, { Reveal } from "./Section";
import { RotatingWord } from "./fx";

export default function ContactSection() {
  return (
    <Section id="contact" index="05" title="Contact">
      <Reveal>
        <p className="text-[15px] leading-[1.85] max-w-[34rem] mb-12" style={{ color: "var(--text-2)" }}>
          I'm heading to Waterloo for my MMath in Fall 2026, and open to interesting
          conversations about{" "}
          <RotatingWord
            words={["research", "data engineering", "AI / ML", "NLP", "grad school"]}
            className="font-serif italic text-[1.05rem]"
            style={{ color: "var(--accent)" }}
          />{" "}
          — now and beyond.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <a
          href="mailto:salmanbasha.shaik@unb.ca"
          className="group block mb-12"
          style={{ color: "var(--text)" }}
        >
          <p className="eyebrow mb-3">Write to me</p>
          <span
            className="display inline-block text-[clamp(1.3rem,4.5vw,2.6rem)] transition-colors duration-300 group-hover:!text-[var(--accent)]"
            style={{
              borderBottom: "1px solid var(--border)",
              paddingBottom: "0.35rem",
            }}
          >
            salmanbasha.shaik@unb.ca
          </span>
        </a>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {[
              { label: "LinkedIn", href: "https://www.linkedin.com/in/salman-shaik-798727225" },
              { label: "GitHub", href: "https://github.com/salmanbashashaik" },
              { label: "Kaggle", href: "https://www.kaggle.com/shaiksalman28" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="u-link inline-flex items-center gap-1 text-[13px]"
              >
                {label}
                <ArrowUpRight size={12} strokeWidth={1.75} />
              </a>
            ))}
          </div>
          <p className="font-mono text-[11.5px]" style={{ color: "var(--text-3)" }}>
            New Brunswick, Canada · Open to remote
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
