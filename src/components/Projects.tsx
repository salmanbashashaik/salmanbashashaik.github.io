import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { PROJECTS, type Project } from "../data/resume";
import Section from "./Section";
import { Bloom, Reveal } from "../lib/motion";
import MRIVolume from "./viz/MRIVolume";
import GlucoseSim from "./viz/GlucoseSim";
import PipelineFlow from "./viz/PipelineFlow";
import KnowledgeCascade from "./viz/KnowledgeCascade";
import TransferMatrix from "./viz/TransferMatrix";
import { POLICY_LABEL, RATE, REGIMES, type Policy } from "./viz/constants";

/* ── Toggle row shared by the instruments ─────────────────── */

function Toggle<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-[2px] overflow-hidden"
      style={{ border: "1px solid var(--rule)" }}>
      {options.map((o, i) => {
        const on = o.value === value;
        return (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            aria-pressed={on}
            className="mono text-[10px] uppercase tracking-[0.1em] px-2.5 py-1.5 transition-colors duration-300"
            style={{
              background: on ? "var(--ink)" : "transparent",
              color: on ? "var(--paper)" : "var(--ink-2)",
              borderLeft: i > 0 ? "1px solid var(--rule)" : "none",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mono text-[0.98rem] tabular-nums" style={{ color: "var(--ink)" }}>
        {value}
      </div>
      <div className="meta mt-0.5 leading-tight">{label}</div>
    </div>
  );
}

/* ── MRI: scrub the volume, switch the few-shot regime ────── */

function MRIPanel() {
  const [slice, setSlice] = useState(56);
  const [regime, setRegime] = useState(1);
  const [playing, setPlaying] = useState(true);
  const dir = useRef(1);

  useEffect(() => {
    if (!playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setSlice((s) => {
        // sweep the informative middle of the stack, then reverse
        if (s >= 78) dir.current = -1;
        if (s <= 30) dir.current = 1;
        return s + dir.current;
      });
    }, 90);
    return () => window.clearInterval(id);
  }, [playing]);

  const r = REGIMES[regime];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Toggle
          label="Few-shot regime"
          value={regime}
          onChange={setRegime}
          options={REGIMES.map((x, i) => ({ value: i, label: `${x.shots}` }))}
        />
        <span className="meta">shots</span>
        <button
          onClick={() => setPlaying((p) => !p)}
          className="quiet p-1 ml-auto"
          aria-label={playing ? "Pause slice sweep" : "Play slice sweep"}
        >
          {playing ? <Pause size={13} /> : <Play size={13} />}
        </button>
      </div>

      <div
        className="mt-5 rounded-[3px] overflow-hidden flex justify-center"
        style={{ border: "1px solid var(--rule-soft)", background: "#000" }}
      >
        <MRIVolume regimeIndex={regime} slice={slice} className="max-w-[190px]" />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="meta whitespace-nowrap">z={String(slice).padStart(3, "0")}</span>
        <input
          type="range"
          min={8}
          max={104}
          value={slice}
          onChange={(e) => {
            setPlaying(false);
            setSlice(Number(e.target.value));
          }}
          aria-label="Axial slice index"
          className="scrub flex-1"
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <Readout label="AUC" value={r.auc.toFixed(2)} />
        <Readout label="FID" value={r.fid.toFixed(1)} />
        <Readout label="SSIM" value={r.ssim.toFixed(2)} />
      </div>

      <p className="annotation mt-6 text-[0.83rem] leading-relaxed">
        Generated in the browser, not patient data — but the fidelity tracks the
        real ablation: at eight shots the structure blurs and the classifier
        loses seven points of AUC.
      </p>
    </div>
  );
}

/* ── Insulin: run a policy against a simulated patient ────── */

function GlucosePanel() {
  const [policy, setPolicy] = useState<Policy>("ppo");
  const [stats, setStats] = useState({ tir: 0, hypo: 0, mean: 0 });
  const onStats = useCallback((s: typeof stats) => setStats(s), []);

  return (
    <div>
      <Toggle
        label="Dosing policy"
        value={policy}
        onChange={setPolicy}
        options={(["none", "ppo", "grpo"] as Policy[]).map((p) => ({
          value: p,
          label: POLICY_LABEL[p],
        }))}
      />

      <div
        className="mt-5 rounded-[3px] overflow-hidden"
        style={{ border: "1px solid var(--rule-soft)", background: "var(--paper-3)" }}
      >
        <GlucoseSim policy={policy} onStats={onStats} className="h-[168px]" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Readout label="time in range" value={`${stats.tir.toFixed(0)}%`} />
        <Readout label="below 70 mg/dL" value={`${stats.hypo.toFixed(1)}%`} />
        <Readout label="mean glucose" value={`${stats.mean.toFixed(0)}`} />
      </div>

      <p className="annotation mt-6 text-[0.83rem] leading-relaxed">
        Toy dynamics, real behaviour: GRPO holds a tighter mean, PPO gives that
        up to stay off the hypo bound. Which one is “better” is a question about
        the reward, not the algorithm.
      </p>
    </div>
  );
}

/* ── Ingestion: serial against multiprocessing ────────────── */

function PipelinePanel() {
  const [mode, setMode] = useState<"serial" | "parallel">("parallel");

  return (
    <div>
      <Toggle
        label="Ingestion mode"
        value={mode}
        onChange={setMode}
        options={[
          { value: "serial", label: "Serial" },
          { value: "parallel", label: "Multiprocess" },
        ]}
      />

      <div
        className="mt-5 rounded-[3px] overflow-hidden"
        style={{ border: "1px solid var(--rule-soft)", background: "var(--paper-3)" }}
      >
        <PipelineFlow mode={mode} className="h-[168px]" />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Readout label="throughput" value={`${RATE[mode]}/s`} />
        <Readout label="workers" value={mode === "parallel" ? "8" : "1"} />
        <Readout label="speed-up" value={mode === "parallel" ? "24×" : "1×"} />
      </div>

      <p className="annotation mt-6 text-[0.83rem] leading-relaxed">
        Both lanes are drawn at the same scale. The gap is the whole result —
        eleven files a second to two hundred and sixty.
      </p>
    </div>
  );
}

function Gut4HeartPanel() {
  return (
    <div className="space-y-10">
      <KnowledgeCascade />
      <TransferMatrix />
    </div>
  );
}

const PANEL: Record<NonNullable<Project["viz"]>, () => React.ReactElement> = {
  gut4heart: Gut4HeartPanel,
  mri: MRIPanel,
  glucose: GlucosePanel,
  pipeline: PipelinePanel,
};

/* ── Section ──────────────────────────────────────────────── */

export default function Projects() {
  return (
    <Section
      id="projects"
      index="02"
      title="Projects"
    >
      <div className="space-y-16">
        {PROJECTS.map((p, i) => {
          const Panel = p.viz ? PANEL[p.viz] : null;
          return (
            <Reveal key={p.id} delay={i * 0.05}>
              <Bloom as="article" className="card p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="serif text-[1.5rem] leading-tight max-w-[30ch]">{p.title}</h3>
                  <span className="meta">{p.dates}</span>
                </div>
                {p.org && (
                  <p className="mt-1.5 meta" style={{ color: "var(--ink-3)" }}>
                    {p.org}
                  </p>
                )}

                <p className="mt-5 max-w-[58ch] text-[0.95rem]" style={{ color: "var(--ink-2)" }}>
                  {p.blurb}
                </p>

                <details className="more mt-6"><summary>{Panel ? "Details and interactive demo" : "Details"}</summary>
                <div className={`mt-2 grid gap-8 lg:gap-10 items-start ${Panel ? "lg:grid-cols-2" : ""}`}>
                  <ul className="space-y-3.5">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex gap-3.5 text-[0.88rem] leading-relaxed">
                        <span
                          aria-hidden
                          className="mt-[0.62em] h-px w-4 shrink-0"
                          style={{ background: "var(--red)" }}
                        />
                        <span style={{ color: "var(--ink-2)" }}>{pt}</span>
                      </li>
                    ))}
                  </ul>

                  {Panel && (
                  <div
                    className="lg:pl-10"
                    style={{ borderLeft: "1px solid var(--rule-soft)" }}
                  >
                    <Panel />
                  </div>
                  )}
                </div>
                </details>

                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                  {p.link && (
                    <a
                      href={p.link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="link mono text-[11px] uppercase tracking-[0.13em] ml-2"
                    >
                      {p.link.label} ↗
                    </a>
                  )}
                </div>
              </Bloom>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
