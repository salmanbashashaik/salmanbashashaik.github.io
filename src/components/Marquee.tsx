import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";

const WORDS = [
  "latent diffusion",
  "few-shot adaptation",
  "molecular fingerprints",
  "out-of-distribution",
  "SPADE conditioning",
  "virtual screening",
  "3D cGAN",
  "domain shift",
];

/**
 * A ticker whose speed and direction are driven by scroll velocity — scroll
 * hard and the band runs with you; scroll back and it reverses.
 */
export default function Marquee() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1200, 0, 1200], [-4, 0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-25, -50, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    let move = direction.current * 1.6 * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    move += direction.current * move * f;
    baseX.set(baseX.get() + move);
  });

  return (
    <div
      aria-hidden
      className="relative overflow-hidden py-6 select-none"
      style={{
        borderTop: "1px solid var(--rule-soft)",
        borderBottom: "1px solid var(--rule-soft)",
        background: "color-mix(in srgb, var(--paper-2) 50%, transparent)",
      }}
    >
      <motion.div className="flex whitespace-nowrap" style={{ x }}>
        {Array.from({ length: 4 }).map((_, r) => (
          <span key={r} className="flex shrink-0">
            {WORDS.map((w) => (
              <span key={w} className="flex items-center">
                <span
                  className="serif text-[1.35rem] md:text-[1.6rem] px-6"
                  style={{ color: "var(--ink-2)" }}
                >
                  {w}
                </span>
                <span
                  className="h-[3px] w-[3px] rounded-full"
                  style={{ background: "var(--red)" }}
                />
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
