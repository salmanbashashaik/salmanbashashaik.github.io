import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Container from "./Container";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/education", label: "Education" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects & Skills" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (to: string) =>
    (to === "/" ? pathname === "/" : pathname.startsWith(to))
      ? "text-white"
      : "text-neutral-600 dark:text-neutral-300";

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="font-semibold">Shaik Salman Basha</Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className={`text-sm hover:text-neutral-900 dark:hover:text-white ${isActive(n.to)}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            aria-label="Open menu"
            className="md:hidden inline-flex items-center rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* Mobile panel */}
      {open && (
        <div className="md:hidden border-t border-neutral-200/70 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95">
          <Container>
            <nav className="py-3 flex flex-col">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`px-2 py-3 text-sm border-b last:border-b-0 border-neutral-200/60 dark:border-neutral-800/60 ${isActive(n.to)}`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
