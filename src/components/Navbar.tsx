import { Link, NavLink } from "react-router-dom";
import Container from "./Container";

const links = [
  { to: "/", label: "Home" },
  { to: "/education", label: "Education" },
  { to: "/experience", label: "Experience" },
  { to: "/projects", label: "Projects and Skills" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200/70 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 backdrop-blur">
      <Container>
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="font-semibold">Shaik Salman Basha</Link>
          <nav className="hidden md:flex items-center gap-5">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm ${isActive ? "text-neutral-900 dark:text-white font-semibold" : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"}`
                }
                end
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </Container>
    </header>
  );
}
