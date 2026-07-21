import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import {
  CERTS,
  EDUCATION,
  PROFILE,
  PROJECTS,
  PUBLICATIONS,
  RESEARCH,
  SKILLS,
  WORK,
} from "../data/resume";
import { EASE } from "../lib/anim";

/**
 * The whole site, re-typeset as a preprint.
 *
 * Same content, different contract with the reader: two columns, numbered
 * sections, a proper abstract and reference list. It exists because the
 * audience for this page is largely people who read papers all day, and
 * because a portfolio that can render itself as one is making a point about
 * whose attention it is asking for.
 */

function Head({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="paper-h2">
      <span className="paper-num">{n}</span>
      {children}
    </h2>
  );
}

function Entry({
  title,
  meta,
  points,
}: {
  title: string;
  meta: string;
  points: string[];
}) {
  return (
    <div className="paper-entry">
      <p className="paper-entry-title">{title}</p>
      <p className="paper-entry-meta">{meta}</p>
      <ul className="paper-list">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

export default function PaperMode({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[240] overflow-y-auto paper-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio typeset as a paper"
        >
          <button
            onClick={onClose}
            className="fixed top-5 right-5 z-10 quiet inline-flex items-center gap-2 mono text-[10.5px] uppercase tracking-[0.14em] px-3 py-2"
            style={{ background: "var(--paper)", border: "1px solid var(--rule)" }}
          >
            <X size={12} /> close
          </button>

          <motion.article
            initial={{ y: 22 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="paper-sheet"
          >
            {/* ── Masthead ── */}
            <header className="paper-head">
              <p className="paper-venue">Research portfolio · {new Date().getFullYear()}</p>
              <h1 className="paper-title">
                Generative Models Where the Data Runs Out
              </h1>
              <p className="paper-authors">{PROFILE.name}</p>
              <p className="paper-affil">
                GenAI for Health Lab, University of Waterloo · University of New Brunswick
                <br />
                <span className="mono">{PROFILE.email}</span>
              </p>
            </header>

            <section className="paper-abstract">
              <p>
                <span className="paper-abstract-label">Abstract — </span>
                This portfolio collects work on a single problem: generative and
                representation models degrade sharply when the deployment
                distribution differs from the training one, and the scientific
                domains that most need such models are exactly those with too
                little data to close that gap by scale. Three lines of work are
                presented. First, a microbiome foundation model whose pretraining
                prior is a hierarchical biological knowledge graph, which wins
                nine of ten leave-one-cohort-out transfer pairs against random
                initialization while providing no in-distribution advantage.
                Second, few-shot cross-domain 3D MRI synthesis, in which latent
                diffusion pretrained on adult scans is adapted to pediatric
                glioma with as few as ten examples. Third, applied pipeline and
                evaluation work spanning reinforcement-learned insulin dosing and
                high-throughput genomic data engineering. A recurring theme is
                that the interesting result is usually the control, not the
                headline.
              </p>
            </section>

            {/* ── Body ── */}
            <div className="paper-body">
              <Head n="1">Research programme</Head>
              {RESEARCH.map((r) => (
                <Entry key={r.title} title={r.title} meta={`${r.org} · ${r.dates}`} points={r.points} />
              ))}

              <Head n="2">Selected projects</Head>
              {PROJECTS.map((p) => (
                <Entry
                  key={p.id}
                  title={p.title}
                  meta={[p.org, p.dates].filter(Boolean).join(" · ")}
                  points={[p.blurb, ...p.points]}
                />
              ))}

              <Head n="3">Applied experience</Head>
              {WORK.map((w) => (
                <Entry key={w.title} title={w.title} meta={`${w.org} · ${w.dates}`} points={w.points} />
              ))}

              <Head n="4">Education</Head>
              {EDUCATION.map((e) => (
                <Entry
                  key={e.school}
                  title={e.school}
                  meta={`${e.degree} · ${e.place} · ${e.dates}`}
                  points={e.points}
                />
              ))}

              <Head n="5">Methods and instrumentation</Head>
              <div className="paper-entry">
                <ul className="paper-list">
                  {SKILLS.map((c) => (
                    <li key={c.id}>
                      <em>{c.label}.</em> {c.items.join(", ")}.
                    </li>
                  ))}
                  <li>
                    <em>Certifications.</em> {CERTS.join("; ")}.
                  </li>
                </ul>
              </div>

              <Head n="6">References</Head>
              <ol className="paper-refs">
                {PUBLICATIONS.map((p, i) => (
                  <li key={p.title}>
                    <span className="paper-ref-n">[{i + 1}]</span> {p.authors}{" "}
                    <em>{p.title}.</em> {p.venue}. {p.status}.
                    {p.href && (
                      <>
                        {" "}
                        <a href={p.href} target="_blank" rel="noreferrer" className="link">
                          {p.href.replace(/^https?:\/\//, "")}
                        </a>
                      </>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            <footer className="paper-foot">
              <span>{PROFILE.name}</span>
              <span className="mono">{PROFILE.locations}</span>
              <span>1</span>
            </footer>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
