import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { EDUCATION, WORK } from "../data/resume";
import Section from "./Section";
import { Bloom, Reveal } from "../lib/motion";

/** A spine that inks itself in as you read past each entry. */
function Spine({ target }: { target: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start 72%", "end 62%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return (
    <div
      aria-hidden
      className="absolute left-0 top-2 bottom-2 w-px"
      style={{ background: "var(--rule-soft)" }}
    >
      <motion.div
        className="absolute inset-x-0 top-0 h-full origin-top"
        style={{ scaleY, background: "var(--red)" }}
      />
    </div>
  );
}

function Entry({
  title,
  org,
  dates,
  points,
  badge,
}: {
  title: string;
  org: string;
  dates: string;
  points: string[];
  badge?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 45%"],
  });
  const dotScale = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
  const dotColor = useTransform(scrollYProgress, [0, 0.85], ["var(--rule)", "var(--red)"]);

  return (
    <div ref={ref} className="relative pl-8 md:pl-10">
      <motion.span
        aria-hidden
        className="absolute left-0 top-[0.55rem] h-[7px] w-[7px] rounded-full -translate-x-[3px]"
        style={{ scale: dotScale, background: dotColor }}
      />
      <Reveal>
        <Bloom className="rounded-[3px] -mx-3 px-3 py-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h3 className="serif text-[1.3rem] leading-tight">{title}</h3>
            <span className="meta whitespace-nowrap">{dates}</span>
          </div>
          <p className="mt-1 text-[0.88rem] flex flex-wrap items-center gap-2.5" style={{ color: "var(--ink-2)" }}>
            {org}
            {badge && (
              <span
                className="mono text-[9.5px] uppercase tracking-[0.13em] px-1.5 py-0.5 rounded-[2px]"
                style={{
                  background: "color-mix(in srgb, var(--cyan) 15%, transparent)",
                  color: "var(--cyan)",
                }}
              >
                {badge}
              </span>
            )}
          </p>
          <ul className="mt-4 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex gap-3.5 text-[0.88rem] leading-relaxed">
                <span
                  aria-hidden
                  className="mt-[0.62em] h-px w-3.5 shrink-0"
                  style={{ background: "var(--rule)" }}
                />
                <span style={{ color: "var(--ink-2)" }}>{p}</span>
              </li>
            ))}
          </ul>
        </Bloom>
      </Reveal>
    </div>
  );
}

export default function Experience() {
  const workRef = useRef<HTMLDivElement>(null);
  const eduRef = useRef<HTMLDivElement>(null);

  return (
    <Section
      id="experience"
      title="Experience"
      aside={
        <p className="annotation text-[0.85rem] leading-relaxed">
          Production pipelines and enterprise systems, before and alongside the
          research.
        </p>
      }
    >
      <div ref={workRef} className="relative space-y-12">
        <Spine target={workRef} />
        {WORK.map((r) => (
          <Entry
            key={r.title}
            title={r.title}
            org={r.org}
            dates={r.dates}
            points={r.points}
          />
        ))}
      </div>

      <div className="mt-20">
        <p className="eyebrow mb-8">Education</p>
        <div ref={eduRef} className="relative space-y-12">
          <Spine target={eduRef} />
          {EDUCATION.map((e) => (
            <Entry
              key={e.school}
              title={e.school}
              org={`${e.degree} · ${e.place}`}
              dates={e.dates}
              points={e.points}
              badge={e.status}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
