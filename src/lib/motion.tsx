import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { EASE } from "./anim";

/* ── Reveal: rises into place on first sight ─────────────── */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const C = motion[as];
  return (
    <C
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </C>
  );
}

/* ── Lines of type that mask up word by word ─────────────── */

export function MaskLines({
  lines,
  className,
  delay = 0,
}: {
  lines: string[];
  className?: string;
  delay?: number;
}) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "108%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.85, delay: delay + i * 0.075, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ── Magnetic: pulled toward the cursor while hovered ────── */

export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.6 });

  return (
    <motion.span
      ref={ref}
      className={className ?? "inline-block"}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/* ── CountUp: number ticks up on first sight ─────────────── */

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.7,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!seen || !ref.current) return;
    const format = (v: number) =>
      prefix +
      v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }) +
      suffix;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [seen, to, decimals, prefix, suffix, duration]);

  return <span ref={ref}>{prefix + (0).toFixed(decimals) + suffix}</span>;
}

/* ── Scramble: decodes through glyph noise on hover ──────── */

const GLYPHS = "▚▞░▒│┤╡╢╖╕╣║╗╝┐└┴┬├─┼╞╟╚╔╩╦╠═╬";

export function Scramble({
  text,
  className,
  trigger = "hover",
}: {
  text: string;
  className?: string;
  trigger?: "hover" | "view";
}) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });

  const run = () => {
    cancelAnimationFrame(raf.current);
    const total = 16;
    let frame = 0;
    const tick = () => {
      frame++;
      const settled = Math.floor((text.length * frame) / total);
      let s = text.slice(0, settled);
      for (let i = settled; i < text.length; i++) {
        s += text[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOut(s);
      if (frame < total) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (trigger === "view" && seen) run();
    return () => cancelAnimationFrame(raf.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, trigger]);

  return (
    <span
      ref={ref}
      className={className}
      onPointerEnter={trigger === "hover" ? run : undefined}
    >
      {out}
    </span>
  );
}

/* ── RotatingWord: split-flap through a list ─────────────── */

export function RotatingWord({
  words,
  interval = 2800,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words.length, interval]);

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b));

  // The invisible longest word holds the line box, so the baseline matches the
  // surrounding text; the animating words ride on top of it, absolutely placed.
  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className ?? ""}`}>
      <span aria-hidden className="invisible whitespace-nowrap">
        {longest}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={words[i]}
          initial={{ y: "104%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-104%" }}
          transition={{ duration: 0.6, ease: EASE }}
          className="absolute left-0 top-0 whitespace-nowrap"
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Bloom: warm tint follows the cursor across a surface ── */

export function Bloom({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "article" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const Component = Tag as React.ElementType;
  return (
    <Component
      ref={ref}
      className={`bloom ${className ?? ""}`}
      onPointerMove={(e: React.PointerEvent) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </Component>
  );
}
