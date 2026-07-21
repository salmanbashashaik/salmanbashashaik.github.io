import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

type Theme = "dark" | "light";
type ToggleOrigin = { clientX: number; clientY: number };

const ThemeCtx = createContext<{ theme: Theme; toggle: (origin?: ToggleOrigin) => void }>({
  theme: "dark",
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) ?? "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Ink-drop theme change: the new theme floods out in a circle from the
  // toggle button (View Transitions API, plain swap where unsupported).
  const toggle = (origin?: ToggleOrigin) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!doc.startViewTransition || reduced) {
      setTheme(next);
      return;
    }

    const x = origin?.clientX ?? window.innerWidth - 40;
    const y = origin?.clientY ?? 40;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const vt = doc.startViewTransition(() => {
      flushSync(() => setTheme(next));
      const root = document.documentElement;
      root.classList.remove("dark", "light");
      root.classList.add(next);
    });

    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeCtx);
