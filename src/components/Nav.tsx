import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Command, FileText, Moon, Sun } from "lucide-react";
import { useThemeMode } from "../lib/theme";
import { Magnetic, Scramble } from "../lib/motion";
import { PROFILE } from "../data/resume";

const LINKS = [
  { id: "research", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "beyond", label: "Beyond" },
  { id: "contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  const { mode, toggle } = useThemeMode();

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 150, damping: 32, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const ids = ["top", ...LINKS.map((l) => l.id)];
      const current = [...ids]
        .reverse()
        .find((id) => {
          const el = document.getElementById(id);
          return el && el.getBoundingClientRect().top <= 130;
        });
      if (current) setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 z-[120] transition-[background,border-color,backdrop-filter] duration-500"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--paper) 82%, transparent)" : "transparent",
        borderBottom: `1px solid ${scrolled ? "var(--rule-soft)" : "transparent"}`,
        backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
      }}
    >
      <div className="mx-auto max-w-[1120px] px-6 md:px-10">
        <div className="flex items-center justify-between" style={{ height: "var(--nav-h)" }}>
          <button onClick={() => go("top")} className="shrink-0 mr-6">
            <span className="serif text-[1.2rem] leading-none whitespace-nowrap">Salman Basha</span>
          </button>

          <nav className="hidden lg:flex items-center gap-5">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="relative mono text-[10.5px] uppercase tracking-[0.11em] whitespace-nowrap transition-colors duration-300"
                style={{ color: active === l.id ? "var(--red)" : "var(--ink-2)" }}
              >
                <Scramble text={l.label} />
                {active === l.id && (
                  <motion.span
                    layoutId="nav-mark"
                    className="absolute -bottom-1.5 left-0 right-0 h-px"
                    style={{ background: "var(--red)" }}
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
              </button>
            ))}

            <span className="h-4 w-px" style={{ background: "var(--rule)" }} />

            <button
              onClick={() => window.dispatchEvent(new Event("paper:open"))}
              className="quiet inline-flex items-center gap-1.5 mono text-[10.5px] uppercase tracking-[0.11em] whitespace-nowrap"
              title="Read this portfolio typeset as a paper"
            >
              <FileText size={14} /> Paper
            </button>

            <button
              onClick={() => window.dispatchEvent(new Event("palette:open"))}
              className="quiet p-1"
              title="Command palette (⌘K)"
              aria-label="Open command palette"
            >
              <Command size={15} />
            </button>
            <button
              onClick={(e) => toggle(e)}
              className="quiet p-1"
              aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}
            >
              {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Magnetic strength={0.3}>
              <a
                href={PROFILE.resumePath}
                download="Shaik_Salman_Basha_CV.pdf"
                className="btn !py-[0.42rem] !px-3.5 !text-[10.5px]"
              >
                CV
              </a>
            </Magnetic>
          </nav>

          <div className="lg:hidden flex items-center gap-3">
            <button
              onClick={(e) => toggle(e)}
              className="quiet p-1.5"
              aria-label="Toggle colour mode"
            >
              {mode === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="p-1.5"
            >
              <span className="block w-6 space-y-[6px]">
                <span
                  className="block h-px bg-current origin-center transition-transform duration-300"
                  style={{ transform: open ? "rotate(45deg) translateY(6.5px)" : "none" }}
                />
                <span
                  className="block h-px bg-current transition-opacity duration-300"
                  style={{ opacity: open ? 0 : 1 }}
                />
                <span
                  className="block h-px bg-current origin-center transition-transform duration-300"
                  style={{ transform: open ? "rotate(-45deg) translateY(-6.5px)" : "none" }}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* reading progress */}
      <motion.div
        aria-hidden
        className="h-[2px] origin-left"
        style={{ scaleX, background: "var(--red)" }}
      />

      {open && (
        <div
          className="lg:hidden"
          style={{
            background: "color-mix(in srgb, var(--paper) 97%, transparent)",
            borderTop: "1px solid var(--rule-soft)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div className="px-6 py-7 flex flex-col gap-5">
            {LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => go(l.id)}
                className="serif text-left text-[1.5rem]"
                style={{ color: active === l.id ? "var(--red)" : "var(--ink)" }}
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                window.dispatchEvent(new Event("paper:open"));
              }}
              className="serif text-left text-[1.5rem]"
              style={{ color: "var(--ink)" }}
            >
              Paper mode
            </button>
            <a
              href={PROFILE.resumePath}
              download="Shaik_Salman_Basha_CV.pdf"
              className="btn self-start mt-2"
            >
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
