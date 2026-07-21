import { useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { Magnetic } from "./fx";

/* Floating return-to-top button whose ring fills with reading progress. */
export default function BackToTop() {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setVisible(v > 0.06));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35 }}
          className="fixed bottom-6 right-6 z-40 hidden md:block"
        >
          <Magnetic strength={0.35}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="relative grid h-12 w-12 place-items-center rounded-full backdrop-blur-sm transition-colors duration-300 hover:text-[var(--accent)]"
              style={{
                color: "var(--text-2)",
                background: "color-mix(in srgb, var(--bg) 75%, transparent)",
              }}
            >
              <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22.5" stroke="var(--border-soft)" strokeWidth="1" />
                <motion.circle
                  cx="24"
                  cy="24"
                  r="22.5"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ pathLength }}
                />
              </svg>
              <ArrowUp size={15} strokeWidth={1.5} />
            </button>
          </Magnetic>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
