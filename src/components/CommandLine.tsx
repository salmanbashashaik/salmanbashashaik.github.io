import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../theme";
import { EASE } from "./Section";

const SECTIONS = ["home", "education", "experience", "projects", "skills", "contact"];

type Line = { kind: "in" | "out"; text: string };

const BANNER: Line[] = [
  { kind: "out", text: "salman.sh — interactive shell" },
  { kind: "out", text: "type `help` to see available commands." },
];

const HELP = [
  "help              this list",
  "whoami            who is salman?",
  "ls                list sections",
  "open <section>    jump to a section",
  "resume            download my résumé",
  "theme             flip light / dark",
  "stack             tools I reach for",
  "date              local + Fredericton time",
  "github · linkedin · kaggle · email",
  "sudo hire-me      (try it)",
  "clear · exit",
];

/*
 * Terminal easter egg. Opens with ⌘K / Ctrl+K or the backtick key, or a
 * window "open-terminal" event (fired by the header button).
 */
export default function CommandLine() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { toggle } = useTheme();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      const typing = (e.target as HTMLElement | null)?.tagName === "INPUT";
      if (e.key === "`" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-terminal", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-terminal", onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const run = (raw: string) => {
    const input = raw.trim();
    if (!input) return;
    const echo: Line = { kind: "in", text: input };
    const [cmd, ...args] = input.toLowerCase().split(/\s+/);
    const say = (...texts: string[]) =>
      setLines((p) => [...p, echo, ...texts.map((text) => ({ kind: "out" as const, text }))]);

    switch (cmd) {
      case "help":
        say(...HELP);
        break;
      case "whoami":
        say(
          "Shaik Salman Basha — data engineer & ML person.",
          "CS Honours @ UNB · incoming MMath @ Waterloo (Fall 2026)."
        );
        break;
      case "ls":
        say(SECTIONS.join("   "));
        break;
      case "open":
      case "cd": {
        const target = args[0]?.replace(/^#/, "");
        if (target && SECTIONS.includes(target)) {
          document.getElementById(target)?.scrollIntoView({ behavior: "smooth" });
          say(`→ #${target}`);
        } else {
          say(`usage: open <${SECTIONS.join(" | ")}>`);
        }
        break;
      }
      case "resume": {
        const a = document.createElement("a");
        a.href = "/resume-g.pdf";
        a.download = "Shaik_Salman_Basha_Resume.pdf";
        a.click();
        say("fetching resume-g.pdf … saved.");
        break;
      }
      case "theme":
        toggle();
        say("theme flipped.");
        break;
      case "stack":
        say("Python · SQL · PyTorch · scikit-learn · Elasticsearch · PostgreSQL · Docker · .NET · scispaCy");
        break;
      case "date": {
        const fmt = (tz?: string) =>
          new Intl.DateTimeFormat("en-CA", {
            timeZone: tz,
            dateStyle: "medium",
            timeStyle: "medium",
          }).format(new Date());
        say(`you:         ${fmt()}`, `fredericton: ${fmt("America/Moncton")}`);
        break;
      }
      case "github":
        window.open("https://github.com/salmanbashashaik", "_blank");
        say("→ github.com/salmanbashashaik");
        break;
      case "linkedin":
        window.open("https://www.linkedin.com/in/salman-shaik-798727225", "_blank");
        say("→ linkedin.com/in/salman-shaik");
        break;
      case "kaggle":
        window.open("https://www.kaggle.com/shaiksalman28", "_blank");
        say("→ kaggle.com/shaiksalman28");
        break;
      case "email":
        say("salmanbasha.shaik@unb.ca — inbox is open.");
        break;
      case "sudo":
        if (args.join(" ") === "hire-me") {
          say(
            "[sudo] password for recruiter: ********",
            "access granted ✓ — let's talk: salmanbasha.shaik@unb.ca"
          );
        } else {
          say("permission denied. (unless you're hiring — try `sudo hire-me`)");
        }
        break;
      case "coffee":
        say("brewing… ☕ done. back to the pipelines.");
        break;
      case "clear":
        setLines([]);
        break;
      case "exit":
        setOpen(false);
        break;
      default:
        say(`command not found: ${cmd} — try \`help\``);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[130] flex items-start justify-center px-4 pt-[12vh]"
        >
          <div
            className="absolute inset-0"
            onClick={() => setOpen(false)}
            style={{
              background: "color-mix(in srgb, var(--text) 22%, transparent)",
              backdropFilter: "blur(3px)",
              WebkitBackdropFilter: "blur(3px)",
            }}
          />
          <motion.div
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-[620px] overflow-hidden"
            style={{
              background: "var(--bg)",
              border: "1px solid var(--border)",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
            }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* title bar */}
            <div
              className="flex items-center gap-2 px-4 py-2.5"
              style={{ borderBottom: "1px solid var(--border-soft)", background: "var(--bg-2)" }}
            >
              {["#e5615a", "#e0a63f", "#67ad5b"].map((c) => (
                <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c, opacity: 0.85 }} />
              ))}
              <span className="ml-2 font-mono text-[11px]" style={{ color: "var(--text-3)" }}>
                salman@portfolio: ~
              </span>
              <span className="ml-auto font-mono text-[10px]" style={{ color: "var(--text-3)" }}>
                esc to close
              </span>
            </div>

            {/* history */}
            <div ref={bodyRef} className="h-[320px] overflow-y-auto px-4 py-3 font-mono text-[12px] leading-[1.75]">
              {lines.map((l, i) =>
                l.kind === "in" ? (
                  <p key={i} style={{ color: "var(--text)" }}>
                    <span style={{ color: "var(--accent)" }}>❯ </span>
                    {l.text}
                  </p>
                ) : (
                  <p key={i} className="whitespace-pre-wrap" style={{ color: "var(--text-2)" }}>
                    {l.text}
                  </p>
                )
              )}
              {/* prompt */}
              <div className="flex items-center gap-2">
                <span style={{ color: "var(--accent)" }}>❯</span>
                <input
                  ref={inputRef}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      run(value);
                      setValue("");
                    }
                  }}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="flex-1 bg-transparent font-mono text-[12px] outline-none"
                  style={{ color: "var(--text)", caretColor: "var(--accent)" }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
