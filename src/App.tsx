import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./theme";
import Header from "./components/Header";
import Hero from "./components/Hero";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import ContactSection from "./components/ContactSection";
import InkCursor from "./components/InkCursor";
import InkSplat from "./components/InkSplat";
import CommandLine from "./components/CommandLine";
import Marquee from "./components/Marquee";
import BackToTop from "./components/BackToTop";
import { ScrollProgress } from "./components/fx";

/* Live Fredericton time, ticking each second. */
function LocalClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Moncton",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  return (
    <span className="font-mono not-italic text-[11.5px] tabular-nums">{time} AT</span>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <div className="grain min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>
          <ScrollProgress />
          <InkCursor />
          <InkSplat />
          <CommandLine />
          <Header />

          <main>
            <Hero />
            <Marquee />
            <EducationSection />
            <ExperienceSection />
            <ProjectsSection />
            <SkillsSection />
            <ContactSection />
          </main>

          <BackToTop />

          <footer style={{ borderTop: "1px solid var(--border-soft)" }}>
            <div className="mx-auto max-w-[1100px] px-6 md:px-10 py-10 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
              <p className="font-mono text-[11.5px]" style={{ color: "var(--text-3)" }}>
                © {new Date().getFullYear()} Shaik Salman Basha
              </p>
              <p className="font-serif italic text-[13px]" style={{ color: "var(--text-3)" }}>
                Fredericton → Waterloo · <LocalClock />
              </p>
              <button
                onClick={() => window.dispatchEvent(new Event("open-terminal"))}
                className="quiet-link font-mono text-[11.5px]"
                style={{ color: "var(--text-3)" }}
              >
                ⌘K — terminal
              </button>
              <p className="font-mono text-[11.5px]" style={{ color: "var(--text-3)" }}>
                Set in Instrument Serif &amp; Inter
              </p>
            </div>
          </footer>
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
