import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  AtSign,
  Beaker,
  Download,
  FlaskConical,
  Github,
  Linkedin,
  Moon,
  Sun,
  Waypoints,
  FileText,
} from "lucide-react";
import { PROFILE } from "../data/resume";
import { useThemeMode } from "../lib/theme";
import { EASE } from "../lib/anim";

type Item = {
  id: string;
  label: string;
  hint: string;
  group: "Navigate" | "Open" | "Actions";
  icon: React.ReactNode;
  run: () => void;
};

/** Subsequence match — "lat dif" finds "Latent diffusion". */
function matches(q: string, text: string) {
  if (!q) return true;
  const t = text.toLowerCase();
  let i = 0;
  for (const ch of q.toLowerCase()) {
    if (ch === " ") continue;
    i = t.indexOf(ch, i);
    if (i === -1) return false;
    i++;
  }
  return true;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { mode, toggle } = useThemeMode();

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setCursor(0);
  }, []);

  const goto = useCallback(
    (id: string) => {
      close();
      window.setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        90
      );
    },
    [close]
  );

  const items: Item[] = useMemo(
    () => [
      {
        id: "research",
        label: "Research",
        hint: "ChemFLM, thesis",
        group: "Navigate",
        icon: <FlaskConical size={14} />,
        run: () => goto("research"),
      },
      {
        id: "projects",
        label: "Projects",
        hint: "MRI synthesis, RL dosing, ingestion",
        group: "Navigate",
        icon: <Beaker size={14} />,
        run: () => goto("projects"),
      },
      {
        id: "experience",
        label: "Experience",
        hint: "AAFC, NB Power, education",
        group: "Navigate",
        icon: <ArrowRight size={14} />,
        run: () => goto("experience"),
      },
      {
        id: "skills",
        label: "Toolkit",
        hint: "the skill molecule",
        group: "Navigate",
        icon: <Waypoints size={14} />,
        run: () => goto("skills"),
      },
      {
        id: "distribution",
        label: "Distribution",
        hint: "drag a sample out of the training data",
        group: "Navigate",
        icon: <Waypoints size={14} />,
        run: () => goto("distribution"),
      },
      {
        id: "contact",
        label: "Contact",
        hint: PROFILE.email,
        group: "Navigate",
        icon: <AtSign size={14} />,
        run: () => goto("contact"),
      },
      {
        id: "paper",
        label: "Read as a paper",
        hint: "typeset the whole site as a preprint",
        group: "Actions",
        icon: <FileText size={14} />,
        run: () => {
          close();
          window.setTimeout(() => window.dispatchEvent(new Event("paper:open")), 80);
        },
      },
      {
        id: "cv",
        label: "Download CV",
        hint: "PDF",
        group: "Open",
        icon: <Download size={14} />,
        run: () => {
          close();
          const a = document.createElement("a");
          a.href = PROFILE.resumePath;
          a.download = "Shaik_Salman_Basha_CV.pdf";
          a.click();
        },
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        hint: "profile",
        group: "Open",
        icon: <Linkedin size={14} />,
        run: () => {
          close();
          window.open(PROFILE.linkedin, "_blank", "noopener");
        },
      },
      {
        id: "github",
        label: "GitHub",
        hint: "code",
        group: "Open",
        icon: <Github size={14} />,
        run: () => {
          close();
          window.open(PROFILE.github, "_blank", "noopener");
        },
      },
      {
        id: "email",
        label: "Copy email address",
        hint: PROFILE.email,
        group: "Actions",
        icon: <AtSign size={14} />,
        run: () => {
          navigator.clipboard?.writeText(PROFILE.email).catch(() => {});
          close();
        },
      },
      {
        id: "theme",
        label: mode === "dark" ? "Switch to light paper" : "Switch to dark ink",
        hint: "colour mode",
        group: "Actions",
        icon: mode === "dark" ? <Sun size={14} /> : <Moon size={14} />,
        run: () => {
          close();
          window.setTimeout(() => toggle(), 60);
        },
      },
      {
        id: "renoise",
        label: "Re-noise the wordmark",
        hint: "run the diffusion again",
        group: "Actions",
        icon: <Waypoints size={14} />,
        run: () => {
          close();
          window.setTimeout(() => {
            document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
            window.dispatchEvent(new Event("hero:renoise"));
          }, 120);
        },
      },
    ],
    [goto, close, mode, toggle]
  );

  const filtered = useMemo(
    () => items.filter((i) => matches(q, `${i.label} ${i.hint} ${i.group}`)),
    [items, q]
  );

  useEffect(() => setCursor(0), [q]);

  useEffect(() => {
    const openEvent = () => setOpen(true);
    window.addEventListener("palette:open", openEvent);

    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => (c + 1) % Math.max(filtered.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => (c - 1 + filtered.length) % Math.max(filtered.length, 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        filtered[cursor]?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("palette:open", openEvent);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, filtered, cursor, close]);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  // keep the highlighted row in view
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${cursor}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[250] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: "color-mix(in srgb, var(--paper) 55%, transparent)",
              backdropFilter: "blur(6px)",
            }}
            onClick={close}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="relative w-full max-w-[560px] rounded-[4px] overflow-hidden"
            style={{
              background: "var(--paper)",
              border: "1px solid var(--rule)",
              boxShadow: "var(--shadow)",
            }}
          >
            <div
              className="flex items-center gap-3 px-4"
              style={{ borderBottom: "1px solid var(--rule-soft)" }}
            >
              <span className="mono text-[11px]" style={{ color: "var(--red)" }}>
                ›
              </span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Jump to a section, or run something…"
                aria-label="Search commands"
                className="flex-1 bg-transparent py-3.5 text-[0.9rem] outline-none placeholder:opacity-45"
                style={{ color: "var(--ink)" }}
              />
              <kbd className="meta">esc</kbd>
            </div>

            <div ref={listRef} className="max-h-[46vh] overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 meta">Nothing matches “{q}”.</p>
              )}
              {filtered.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                const on = i === cursor;
                return (
                  <div key={item.id}>
                    {header && (
                      <p className="eyebrow px-4 pt-3 pb-1.5">{header}</p>
                    )}
                    <button
                      data-idx={i}
                      onMouseEnter={() => setCursor(i)}
                      onClick={item.run}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150"
                      style={{
                        background: on
                          ? "color-mix(in srgb, var(--red) 10%, transparent)"
                          : "transparent",
                        color: on ? "var(--red)" : "var(--ink)",
                      }}
                    >
                      <span className="shrink-0 opacity-80">{item.icon}</span>
                      <span className="text-[0.88rem]">{item.label}</span>
                      <span className="meta ml-auto truncate max-w-[45%]">{item.hint}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div
              className="flex items-center justify-between px-4 py-2.5"
              style={{ borderTop: "1px solid var(--rule-soft)" }}
            >
              <span className="meta">↑↓ move · ⏎ select</span>
              <span className="meta">{filtered.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
