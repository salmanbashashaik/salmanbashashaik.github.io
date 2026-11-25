import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

type Mode = "light" | "dark";
type Origin = { clientX: number; clientY: number };

const Ctx = createContext<{ mode: Mode; toggle: (o?: Origin) => void }>({
  mode: "light",
  toggle: () => {},
});

function initial(): Mode {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("mode");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>(initial);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(mode);
    localStorage.setItem("mode", mode);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", mode === "dark" ? "#0e0d0c" : "#f5f1e8");
  }, [mode]);

  /* The new stock floods out in a circle from wherever the toggle was hit. */
  const toggle = useCallback(
    (origin?: Origin) => {
      const next: Mode = mode === "dark" ? "light" : "dark";
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => { ready: Promise<void> };
      };
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!doc.startViewTransition || reduced) {
        setMode(next);
        return;
      }

      const x = origin?.clientX ?? window.innerWidth - 48;
      const y = origin?.clientY ?? 40;
      const r = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const vt = doc.startViewTransition(() => {
        flushSync(() => setMode(next));
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(next);
      });

      vt.ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          {
            duration: 700,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [mode]
  );

  return <Ctx.Provider value={{ mode, toggle }}>{children}</Ctx.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useThemeMode = () => useContext(Ctx);
