import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./lib/theme";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Research from "./components/Research";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Distribution from "./components/Distribution";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import CommandPalette from "./components/CommandPalette";
import PaperMode from "./components/PaperMode";

export default function App() {
  const [paper, setPaper] = useState(false);

  // The browser resolves a deep link before the display face loads and the
  // canvases take their final height, so it lands short. Re-anchor once
  // layout has actually settled.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    const settle = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
    };
    // Canvases and the display face each shift layout as they land, so
    // re-anchor a few times across the first second rather than guessing
    // a single moment when everything has settled.
    const timers = [120, 320, 700, 1100].map((ms) => window.setTimeout(settle, ms));
    document.fonts?.ready.then(settle).catch(() => {});
    return () => timers.forEach(window.clearTimeout);
  }, []);

  // Paper mode is reachable from the nav, the palette, and the footer.
  useEffect(() => {
    const open = () => setPaper(true);
    window.addEventListener("paper:open", open);
    return () => window.removeEventListener("paper:open", open);
  }, []);

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <div className="substrate min-h-screen">
          <a
            href="#research"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[300] focus:px-3 focus:py-2"
            style={{ background: "var(--paper)", border: "1px solid var(--rule)" }}
          >
            Skip to content
          </a>

          <Cursor />
          <CommandPalette />
          <PaperMode open={paper} onClose={() => setPaper(false)} />
          <Nav />

          <main className="relative z-[1]">
            <Hero />
            <Marquee />
            <Research />
            <Projects />
            <Experience />
            <Skills />
            <Distribution />
            <Contact />
          </main>

          <Footer />
        </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
