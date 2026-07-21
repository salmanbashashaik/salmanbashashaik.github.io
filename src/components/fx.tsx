import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
} from "framer-motion";
import { EASE } from "./Section";

/* Thin ink line at the very top that tracks reading progress. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] origin-left"
      style={{ scaleX, background: "var(--accent)" }}
    />
  );
}

/* Element is gently pulled toward the cursor while hovered. */
export function Magnetic({
  children,
  strength = 0.25,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  return (
    <motion.div
      ref={ref}
      className={className ?? "inline-block"}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* Number that counts up from zero the first time it scrolls into view. */
export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  duration = 1.6,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        if (!ref.current) return;
        ref.current.textContent =
          v.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, decimals, suffix, duration]);

  return <span ref={ref}>{(0).toFixed(decimals) + suffix}</span>;
}

/* Word that cycles through a list, rolling up like a split-flap board. */
export function RotatingWord({
  words,
  interval = 2600,
  className,
  style,
}: {
  words: string[];
  interval?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  return (
    <span className={`inline-grid overflow-hidden align-bottom ${className ?? ""}`} style={style}>
      {/* invisible longest word keeps the slot from reflowing */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap" aria-hidden>
        {words.reduce((a, b) => (a.length >= b.length ? a : b))}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
          className="col-start-1 row-start-1 whitespace-nowrap"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* Text decodes through glitch glyphs on hover, settling left to right. */
const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#";

export function Scramble({
  text,
  className,
  style,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [display, setDisplay] = useState(text);
  const raf = useRef<number>(0);
  const frame = useRef(0);

  const start = () => {
    cancelAnimationFrame(raf.current);
    frame.current = 0;
    const total = 14;
    const tick = () => {
      frame.current++;
      const settled = Math.floor((text.length * frame.current) / total);
      let out = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) {
        out +=
          text[i] === " "
            ? " "
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setDisplay(out);
      if (frame.current < total) raf.current = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return (
    <span className={className} style={style} onMouseEnter={start}>
      {display}
    </span>
  );
}

/* Warm ink tint that follows the cursor across a card. */
export function InkBleed({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className={`ink-bleed ${className ?? ""}`}
      style={style}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
