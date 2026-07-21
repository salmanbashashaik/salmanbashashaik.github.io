import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Two-part cursor: a dot that tracks exactly, and a ring that lags and swells
 * over anything interactive. Hidden entirely on touch pointers.
 */
export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 34, mass: 0.42 });
  const ry = useSpring(y, { stiffness: 380, damping: 34, mass: 0.42 });
  const [hot, setHot] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHot(
        !!el?.closest(
          'a, button, input, [role="button"], canvas, summary, [data-cursor="hot"]'
        )
      );
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.span
        aria-hidden
        className="cursor-dot"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.span
        aria-hidden
        className="cursor-ring"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: hot ? 1.75 : 1, opacity: hot ? 0.9 : 0.45 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      />
    </>
  );
}
