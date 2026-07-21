import { ArrowUp } from "lucide-react";
import { PROFILE } from "../data/resume";
import { Magnetic } from "../lib/motion";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--rule-soft)" }}>
      <div className="mx-auto max-w-[1120px] px-6 md:px-10 py-10 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
        <p className="meta">© {new Date().getFullYear()} {PROFILE.name}</p>

        <p className="annotation text-[0.82rem]">
          Set in Instrument Serif, Inter &amp; JetBrains Mono
        </p>

        <button
          onClick={() => window.dispatchEvent(new Event("paper:open"))}
          className="meta quiet"
        >
          Read as a paper
        </button>

        <button
          onClick={() => window.dispatchEvent(new Event("palette:open"))}
          className="meta quiet"
        >
          ⌘K — command palette
        </button>

        <Magnetic strength={0.35}>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="quiet inline-flex items-center gap-1.5 meta"
            aria-label="Back to top"
          >
            <ArrowUp size={12} /> top
          </button>
        </Magnetic>
      </div>
    </footer>
  );
}
