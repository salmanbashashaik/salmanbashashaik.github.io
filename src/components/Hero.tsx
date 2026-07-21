import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { EASE } from "./Section";
import { CountUp, Magnetic } from "./fx";

const FIGURES = [
  { to: 23, suffix: "×", label: "Ingest speedup, AAFC ETL" },
  { to: 260, suffix: "/s", label: "Files processed per second" },
  { to: 1000, suffix: "+", label: "Records catalogued" },
  { to: 94.2, suffix: "%", decimals: 1, label: "Language-model accuracy" },
];

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } },
  item: {
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  },
};

const letter = {
  initial: { opacity: 0, y: "0.5em", rotate: 3 },
  animate: { opacity: 1, y: "0em", rotate: 0, transition: { duration: 0.7, ease: EASE } },
};

const nameContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.035 } },
};

/*
 * Kinetic type: each letter rises in on load, then scatters away from the
 * cursor like ink repelled by water, easing back when the cursor leaves.
 */
function Letters({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  const scatter = (e: React.MouseEvent) => {
    ref.current?.querySelectorAll<HTMLElement>("[data-kinetic]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy);
      const radius = 150;
      if (d < radius) {
        const f = (1 - d / radius) ** 2;
        el.style.transform = `translate(${-dx * f * 0.4}px, ${-dy * f * 0.4}px) rotate(${-dx * f * 0.05}deg)`;
      } else {
        el.style.transform = "";
      }
    });
  };

  const settle = () => {
    ref.current
      ?.querySelectorAll<HTMLElement>("[data-kinetic]")
      .forEach((el) => (el.style.transform = ""));
  };

  return (
    <span ref={ref} className="inline-block whitespace-pre" onMouseMove={scatter} onMouseLeave={settle}>
      {[...text].map((ch, i) => (
        <motion.span key={i} variants={letter} className="inline-block">
          <span
            data-kinetic
            className="inline-block transition-transform duration-300"
            style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
          >
            {ch}
          </span>
        </motion.span>
      ))}
    </span>
  );
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 5) return "Up late";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

/* Perforated postage stamp — grab it, toss it, it keeps its momentum. */
function Stamp({ constraintsRef }: { constraintsRef: React.RefObject<HTMLElement | null> }) {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.18}
      dragMomentum
      initial={{ opacity: 0, rotate: 8, y: 12 }}
      animate={{ opacity: 1, rotate: 6, y: 0 }}
      transition={{ delay: 1.4, duration: 0.8, ease: EASE }}
      whileHover={{ scale: 1.04 }}
      whileDrag={{ scale: 1.08, rotate: 0 }}
      className="absolute right-[7%] top-[24%] z-10 hidden lg:block cursor-grab active:cursor-grabbing select-none"
      style={{ touchAction: "none" }}
    >
      <div className="p-[7px]" style={{ background: "var(--bg-2)", border: "1.5px dashed var(--border)" }}>
        <div className="px-6 py-7 text-center" style={{ border: "1px solid var(--border)" }}>
          <p className="eyebrow mb-3" style={{ color: "var(--accent)" }}>
            Par avion
          </p>
          <p className="font-serif text-[1.6rem] leading-none" style={{ color: "var(--text)" }}>
            YFC → YKF
          </p>
          <p className="font-mono text-[9.5px] tracking-[0.18em] mt-3" style={{ color: "var(--text-3)" }}>
            FALL 2026 · CANADA
          </p>
        </div>
      </div>
      <p className="mt-2 text-center font-mono text-[10px]" style={{ color: "var(--text-3)" }}>
        (drag me)
      </p>
    </motion.div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  // content drifts up and fades slightly as the hero scrolls away
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.1]);

  return (
    <section ref={ref} id="home" className="relative min-h-screen flex flex-col justify-between pt-[68px]">
      <Stamp constraintsRef={ref} />
      <motion.div
        style={{ y, opacity }}
        className="mx-auto max-w-[1100px] w-full px-6 md:px-10 flex-1 flex flex-col justify-center py-16"
      >
        <motion.div variants={stagger.container} initial="initial" animate="animate">
          {/* Eyebrow */}
          <motion.p variants={stagger.item} className="eyebrow mb-8 md:mb-10">
            {greeting()} — Data Engineering · AI / ML · NLP · Fredericton, Canada
          </motion.p>

          {/* Name */}
          <motion.h1
            variants={nameContainer}
            className="display mb-8 md:mb-10"
            style={{ fontSize: "clamp(3.25rem, 11vw, 8rem)" }}
          >
            <Letters text="Shaik Salman" />
            <br />
            <em className="relative inline-block" style={{ color: "var(--accent)" }}>
              <Letters text="Basha" />
              {/* hand-drawn underline, stroked in after the name lands */}
              <motion.svg
                viewBox="0 0 300 20"
                fill="none"
                aria-hidden
                className="absolute left-0 -bottom-[0.06em] w-full"
                preserveAspectRatio="none"
                style={{ height: "0.14em" }}
              >
                <motion.path
                  d="M6 14 C 70 7, 160 4, 294 10"
                  stroke="var(--accent)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ delay: 1.2, duration: 0.9, ease: EASE }}
                />
              </motion.svg>
            </em>
          </motion.h1>

          {/* Status */}
          <motion.div variants={stagger.item} className="flex items-center gap-3 mb-6">
            <span
              className="dot-ping h-1.5 w-1.5 rounded-full shrink-0"
              style={{ background: "var(--accent)" }}
            />
            <p className="font-mono text-[12px] tracking-[0.06em]" style={{ color: "var(--text-2)" }}>
              Incoming MMath, University of Waterloo — Fall 2026
            </p>
          </motion.div>

          {/* Summary */}
          <motion.p
            variants={stagger.item}
            className="max-w-[34rem] text-[15px] leading-[1.8] mb-10"
            style={{ color: "var(--text-2)" }}
          >
            CS Honours and Math Minor from the University of New Brunswick, with sixteen
            months of co-op spent building data pipelines, machine-learning systems, and
            NLP tools at scale.
          </motion.p>

          {/* Actions */}
          <motion.div variants={stagger.item} className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <Magnetic strength={0.3}>
              <a
                href="/resume-g.pdf"
                download="Shaik_Salman_Basha_Resume.pdf"
                className="btn-ink"
              >
                Download résumé
              </a>
            </Magnetic>
            {[
              { label: "GitHub", href: "https://github.com/salmanbashashaik" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/salman-shaik-798727225" },
              { label: "Email", href: "mailto:salmanbasha.shaik@unb.ca" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="u-link inline-flex items-center gap-1 text-[13px]"
              >
                {label}
                <ArrowUpRight size={12} strokeWidth={1.75} />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Selected figures — count up on first view */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="mx-auto max-w-[1100px] w-full px-6 md:px-10 pb-10"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6">
          {FIGURES.map((f) => (
            <div key={f.label} className="pt-4" style={{ borderTop: "1px solid var(--border)" }}>
              <p className="font-serif text-[1.75rem] leading-none mb-1.5" style={{ color: "var(--text)" }}>
                <CountUp to={f.to} suffix={f.suffix} decimals={f.decimals ?? 0} />
              </p>
              <p className="text-[11.5px] leading-snug" style={{ color: "var(--text-3)" }}>
                {f.label}
              </p>
            </div>
          ))}
        </div>
        <Magnetic strength={0.4} className="mx-auto mt-10 hidden md:block w-fit">
          <button
            onClick={() => document.getElementById("education")?.scrollIntoView({ behavior: "smooth" })}
            aria-label="Scroll down"
            className="quiet-link flex"
          >
            <ArrowDown size={16} strokeWidth={1.5} />
          </button>
        </Magnetic>
      </motion.div>
    </section>
  );
}
