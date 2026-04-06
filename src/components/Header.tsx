import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../theme";

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
      const current = [...ids]
        .reverse()
        .find((id) => {
          const el = document.getElementById(id);
          return el && el.getBoundingClientRect().top <= 100;
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
      style={{
        background: scrolled ? "color-mix(in srgb, var(--bg) 85%, transparent)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    >
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="flex h-[60px] items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="font-heading font-bold text-[15px] tracking-tight transition-opacity hover:opacity-70"
            style={{ color: "var(--text)" }}
          >
            Salman<span style={{ color: "var(--accent)" }}>.</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200"
                style={{
                  color: active === n.id ? "var(--accent)" : "var(--text-2)",
                  background: active === n.id ? "var(--accent-subtle)" : "transparent",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {n.label}
              </button>
            ))}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="ml-2 p-2 rounded-lg transition-all duration-200"
              style={{
                color: "var(--text-2)",
                border: "1px solid var(--border)",
                background: "var(--surface)",
              }}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <a
              href="/resume-g.pdf"
              download
              className="ml-2 px-3.5 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200"
              style={{
                background: "var(--accent)",
                color: "#fff",
                fontFamily: "var(--font-heading)",
              }}
            >
              Resume
            </a>
          </nav>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="p-2 rounded-lg"
              style={{ color: "var(--text-2)", border: "1px solid var(--border)" }}
            >
              {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="p-2 rounded-lg"
              style={{ color: "var(--text-2)" }}
            >
              <div className="space-y-[5px] w-5">
                <span
                  className="block h-px bg-current transition-all duration-300 origin-center"
                  style={{ transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }}
                />
                <span
                  className="block h-px bg-current transition-all duration-300"
                  style={{ opacity: menuOpen ? 0 : 1 }}
                />
                <span
                  className="block h-px bg-current transition-all duration-300 origin-center"
                  style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "color-mix(in srgb, var(--bg) 95%, transparent)",
            borderColor: "var(--border)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="mx-auto max-w-5xl px-4 py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-left px-3 py-2.5 text-sm rounded-lg font-medium transition-colors"
                style={{
                  color: active === n.id ? "var(--accent)" : "var(--text-2)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {n.label}
              </button>
            ))}
            <a
              href="/resume-g.pdf"
              download
              className="mt-1 px-3 py-2.5 text-sm font-semibold rounded-lg text-center"
              style={{ background: "var(--accent)", color: "#fff" }}
            >
              Download Resume
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
