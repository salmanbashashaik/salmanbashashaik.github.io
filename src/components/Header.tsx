import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Terminal } from "lucide-react";
import { useTheme } from "../theme";
import { Magnetic, Scramble } from "./fx";

const NAV = [
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export default function Header() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const ids = ["home", ...NAV.map((n) => n.id)];
      const current = [...ids].reverse().find((id) => {
        const el = document.getElementById(id);
        return el && el.getBoundingClientRect().top <= 110;
      });
      if (current) setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "color-mix(in srgb, var(--bg) 88%, transparent)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border-soft)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
      }}
    >
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <div className="flex h-[68px] items-center justify-between">
          {/* Wordmark */}
          <button
            onClick={() => scrollTo("home")}
            className="font-serif italic text-[1.25rem] transition-opacity hover:opacity-60"
            style={{ color: "var(--text)" }}
          >
            Salman Basha
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="relative font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-250"
                style={{ color: active === n.id ? "var(--accent)" : "var(--text-2)" }}
              >
                <Scramble text={n.label} />
                {active === n.id && (
                  <motion.span
                    layoutId="nav-ink"
                    className="absolute -bottom-1.5 left-0 right-0 h-px"
                    style={{ background: "var(--accent)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            ))}

            <button
              onClick={() => window.dispatchEvent(new Event("open-terminal"))}
              aria-label="Open terminal"
              title="Terminal (⌘K)"
              className="quiet-link p-1.5"
            >
              <Terminal size={15} />
            </button>

            <button
              onClick={(e) => toggle(e)}
              aria-label="Toggle theme"
              className="quiet-link p-1.5"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Magnetic strength={0.35}>
              <a
                href="/resume-g.pdf"
                download="Shaik_Salman_Basha_Resume.pdf"
                className="btn-ink !py-2 !px-4 text-[12px]"
              >
                Résumé
              </a>
            </Magnetic>
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={(e) => toggle(e)} aria-label="Toggle theme" className="quiet-link p-1.5">
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="p-1.5"
              style={{ color: "var(--text)" }}
            >
              <div className="space-y-[6px] w-6">
                <span
                  className="block h-px bg-current transition-all duration-300 origin-center"
                  style={{ transform: menuOpen ? "rotate(45deg) translateY(6.5px)" : "none" }}
                />
                <span
                  className="block h-px bg-current transition-all duration-300"
                  style={{ opacity: menuOpen ? 0 : 1 }}
                />
                <span
                  className="block h-px bg-current transition-all duration-300 origin-center"
                  style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6.5px)" : "none" }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            background: "color-mix(in srgb, var(--bg) 96%, transparent)",
            borderTop: "1px solid var(--border-soft)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div className="mx-auto max-w-[1100px] px-6 py-6 flex flex-col gap-5">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-left font-serif text-[1.5rem] transition-colors"
                style={{ color: active === n.id ? "var(--accent)" : "var(--text)" }}
              >
                {n.label}
              </button>
            ))}
            <a
              href="/resume-g.pdf"
              download="Shaik_Salman_Basha_Resume.pdf"
              className="btn-ink self-start mt-2"
            >
              Download résumé
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
