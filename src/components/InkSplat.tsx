import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE } from "./Section";

type Splat = { id: number; x: number; y: number; rot: number; scale: number };

let nextId = 0;

/* Every click leaves a small ink blot that soaks into the paper and fades. */
export default function InkSplat() {
  const [splats, setSplats] = useState<Splat[]>([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;
    setEnabled(true);

    const onClick = (e: MouseEvent) => {
      const s: Splat = {
        id: nextId++,
        x: e.clientX,
        y: e.clientY,
        rot: Math.random() * 360,
        scale: 0.6 + Math.random() * 0.7,
      };
      setSplats((p) => [...p.slice(-5), s]);
      window.setTimeout(() => setSplats((p) => p.filter((v) => v.id !== s.id)), 900);
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  if (!enabled) return null;

  return (
    <AnimatePresence>
      {splats.map((s) => (
        <motion.svg
          key={s.id}
          aria-hidden
          width="90"
          height="90"
          viewBox="0 0 100 100"
          initial={{ scale: 0.2, opacity: 0.5 }}
          animate={{ scale: s.scale, opacity: 0.3 }}
          exit={{ opacity: 0, scale: s.scale * 1.08 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="pointer-events-none fixed z-[115]"
          style={{
            left: s.x,
            top: s.y,
            translateX: "-50%",
            translateY: "-50%",
            rotate: s.rot,
            fill: "var(--accent)",
          }}
        >
          <path d="M50 18 C68 12 84 28 81 46 C90 52 90 62 83 66 C86 78 72 88 59 83 C50 92 33 88 29 76 C15 74 10 58 20 50 C13 36 25 20 40 24 C43 18 47 19 50 18 Z" />
          <circle cx="87" cy="27" r="3" />
          <circle cx="16" cy="79" r="2.5" />
          <circle cx="80" cy="83" r="2" />
          <circle cx="23" cy="15" r="2" />
        </motion.svg>
      ))}
    </AnimatePresence>
  );
}
