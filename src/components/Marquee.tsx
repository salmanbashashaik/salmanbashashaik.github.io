import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

const TOKENS = [
  "Data Engineering",
  "ETL at 260 files/sec",
  "Elasticsearch",
  "Machine Learning",
  "PyTorch",
  "NLP",
  "scispaCy",
  "PostgreSQL",
  "Transfer Learning",
  "Waterloo, Fall 2026",
];

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return min + (((v - min) % range) + range) % range;
};

/*
 * Editorial ticker band. Drifts on its own, speeds up and reverses with your
 * scroll velocity, and eases to a stop while hovered.
 */
export default function Marquee() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [-1200, 1200], [-4, 4], { clamp: false });

  const direction = useRef(1);
  const hovered = useRef(false);
  const speed = useRef(1);

  useAnimationFrame((_, delta) => {
    const vf = velocityFactor.get();
    if (vf < -0.1) direction.current = -1;
    else if (vf > 0.1) direction.current = 1;

    // ease toward stopped while hovered, back to full speed after
    const target = hovered.current ? 0 : 1;
    speed.current += (target - speed.current) * Math.min(1, delta / 200);

    let moveBy = direction.current * 2.2 * (delta / 1000) * speed.current;
    moveBy += moveBy * Math.abs(vf);
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);
  const skewX = useTransform(smoothVelocity, [-1200, 1200], [3, -3]);

  const strip = (copy: number) => (
    <span key={copy} className="inline-flex items-baseline" aria-hidden={copy > 0}>
      {TOKENS.map((t, i) => (
        <span key={t} className="inline-flex items-baseline">
          {i % 2 === 0 ? (
            <em className="font-serif text-[1.35rem] md:text-[1.6rem]" style={{ color: "var(--text-2)" }}>
              {t}
            </em>
          ) : (
            <span
              className="font-mono text-[11px] uppercase tracking-[0.2em]"
              style={{ color: "var(--text-3)" }}
            >
              {t}
            </span>
          )}
          <span className="mx-6 md:mx-8 text-[0.8rem]" style={{ color: "var(--accent)" }}>
            ✱
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      className="overflow-hidden py-5 select-none"
      style={{
        borderTop: "1px solid var(--border-soft)",
        borderBottom: "1px solid var(--border-soft)",
      }}
      onMouseEnter={() => (hovered.current = true)}
      onMouseLeave={() => (hovered.current = false)}
    >
      <motion.div className="flex w-max whitespace-nowrap will-change-transform" style={{ x, skewX }}>
        {[0, 1, 2, 3].map(strip)}
      </motion.div>
    </div>
  );
}
