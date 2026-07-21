import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/*
 * Trailing ink cursor: a small accent dot glued to the pointer and a lagging
 * ring that swells over anything clickable. Pointer-fine devices only; the
 * native cursor stays visible.
 */
export default function InkCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [overLink, setOverLink] = useState(false);
  const [pressed, setPressed] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 900, damping: 60 });
  const dotY = useSpring(y, { stiffness: 900, damping: 60 });
  const ringX = useSpring(x, { stiffness: 200, damping: 22 });
  const ringY = useSpring(y, { stiffness: 200, damping: 22 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;
    setEnabled(true);

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setOverLink(
        !!(e.target as Element | null)?.closest?.("a, button, [role='button'], summary")
      );
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[120] h-[5px] w-[5px] rounded-full"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%", background: "var(--accent)" }}
        animate={{ opacity: visible ? 1 : 0, scale: pressed ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[120] h-8 w-8 rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          border: "1px solid var(--accent)",
        }}
        animate={{
          opacity: visible ? (overLink ? 0.9 : 0.45) : 0,
          scale: pressed ? 0.7 : overLink ? 1.6 : 1,
        }}
        transition={{ duration: 0.25 }}
      />
    </>
  );
}
