import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTION_LABELS: Record<string, string> = {
  home: "Home", experience: "Experience", projects: "Projects",
  skills: "Skills", education: "Education", contact: "Contact",
};
const SECTION_ACTIVITY: Record<string, string> = {
  home: "Idle", experience: "Loading work history...", projects: "Rendering projects...",
  skills: "Mapping skill matrix...", education: "Fetching records...", contact: "Opening comms...",
};
const SECTIONS = ["home", "education", "experience", "projects", "skills", "contact"];

export default function SystemPanel() {
  const [active, setActive] = useState("home");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 120);
      const current = [...SECTIONS].reverse().find((id) => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top <= 140;
      });
      if (current) setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.25 }}
          className="fixed bottom-5 right-4 z-40 hidden lg:block"
        >
          <div
            className="rounded-lg px-3 py-2 flex items-center gap-3"
            style={{
              background: "color-mix(in srgb, var(--bg) 90%, transparent)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(16px)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: "#4ade80", boxShadow: "0 0 4px #4ade80" }} />
            <AnimatePresence mode="wait">
              <motion.span
                key={active}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-[10px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}
              >
                {SECTION_LABELS[active]} · {SECTION_ACTIVITY[active]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
