import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { PROFILE } from "../data/resume";
import Section from "./Section";
import { Magnetic, Reveal } from "../lib/motion";

/** Fredericton wall clock, ticking. */
function Clock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Moncton",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  return <span className="tabular-nums">{time} AT</span>;
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  return (
    <Section
      id="contact"
      index="06"
      title="Contact"
      aside={
        <p className="annotation text-[0.85rem] leading-relaxed">
          Open to research collaborations, and to conversations about anything
          above.
        </p>
      }
    >
      <Reveal>
        <p className="lede max-w-[46ch]">
          If you are working on generative models for scientific data — or you
          think the RoPE observation is wrong — I would like to hear about it.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`mailto:${PROFILE.email}`}
            className="display text-[clamp(1.7rem,4.6vw,3rem)] link"
            style={{ lineHeight: 1.1 }}
          >
            {PROFILE.email}
          </a>
          <button
            onClick={copy}
            className="quiet inline-flex items-center gap-1.5 mono text-[10.5px] uppercase tracking-[0.13em]"
            aria-label="Copy email address"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "copied" : "copy"}
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="mt-12 pt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-8"
          style={{ borderTop: "1px solid var(--rule-soft)" }}
        >
          <div>
            <p className="eyebrow mb-2.5">Elsewhere</p>
            <ul className="space-y-1.5 text-[0.88rem]">
              <li>
                <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" className="link">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href={PROFILE.github} target="_blank" rel="noreferrer" className="link">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.resumePath}
                  download="Shaik_Salman_Basha_CV.pdf"
                  className="link"
                >
                  Curriculum vitae ↓
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-2.5">Also reachable</p>
            <ul className="space-y-1.5 text-[0.88rem]" style={{ color: "var(--ink-2)" }}>
              <li>
                <a href={`mailto:${PROFILE.altEmail}`} className="link">
                  {PROFILE.altEmail}
                </a>
              </li>
              <li>{PROFILE.phone}</li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-2.5">Based</p>
            <p className="text-[0.88rem]" style={{ color: "var(--ink-2)" }}>
              Fredericton, NB
              <br />
              moving to Waterloo, ON
            </p>
          </div>

          <div>
            <p className="eyebrow mb-2.5">Local time</p>
            <p className="mono text-[0.88rem]" style={{ color: "var(--ink-2)" }}>
              <Clock />
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-12">
          <Magnetic strength={0.25}>
            <a href={`mailto:${PROFILE.email}`} className="btn">
              Start a conversation
            </a>
          </Magnetic>
        </div>
      </Reveal>
    </Section>
  );
}
