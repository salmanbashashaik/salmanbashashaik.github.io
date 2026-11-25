import { useCallback, useEffect, useRef, useState } from "react";
import { animate, motion } from "framer-motion";
import { ArrowDown, RotateCcw } from "lucide-react";
import { METRICS, PROFILE } from "../data/resume";
import DiffusionField from "./DiffusionField";
import { CountUp, Magnetic, RotatingWord } from "../lib/motion";
import { EASE } from "../lib/anim";

export default function Hero() {
  const tRef = useRef(1000);
  const [t, setT] = useState(1000);
  const [scrubbing, setScrubbing] = useState(false);
  const anim = useRef<{ stop: () => void } | null>(null);

  const denoise = useCallback((from = 1000) => {
    anim.current?.stop();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tRef.current = 0;
      setT(0);
      return;
    }
    anim.current = animate(from, 0, {
      duration: 2.9 * (from / 1000),
      ease: EASE,
      onUpdate: (v) => {
        tRef.current = v;
        setT(v);
      },
    });
  }, []);

  const restart = useCallback(() => {
    anim.current?.stop();
    tRef.current = 1000;
    setT(1000);
    window.setTimeout(() => denoise(1000), 280);
  }, [denoise]);

  // The page opens mid-diffusion and resolves. That first three seconds is the pitch.
  useEffect(() => {
    const id = window.setTimeout(() => denoise(1000), 400);
    window.addEventListener("hero:renoise", restart);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("hero:renoise", restart);
      anim.current?.stop();
    };
  }, [denoise, restart]);

  const scrub = (v: number) => {
    anim.current?.stop();
    tRef.current = 1000 - v;
    setT(1000 - v);
  };

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex flex-col justify-center pt-28 pb-20"
    >
      <div className="mx-auto w-full max-w-[1120px] px-6 md:px-10">
        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-9"
        >
          <span className="eyebrow inline-flex items-center gap-2.5">
            <span
              className="ping inline-block h-[5px] w-[5px] rounded-full"
              style={{ background: "var(--red)" }}
            />
            Incoming MMath · University of Waterloo
          </span>
          <span className="eyebrow hidden sm:inline">{PROFILE.locations}</span>
        </motion.div>

        {/* Wordmark, sampled out of noise */}
        <h1 className="sr-only">
          {PROFILE.name} — machine learning researcher working on generative AI for health.
        </h1>
        <DiffusionField
          text="Salman Basha"
          tRef={tRef}
          className="h-[24vw] min-h-[124px] max-h-[218px]"
        />

        {/* Timestep scrubber */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="mt-3 max-w-[540px]"
        >
          <div className="flex items-center gap-4">
            <span
              className="mono text-[10.5px] tabular-nums whitespace-nowrap transition-colors"
              style={{ color: scrubbing ? "var(--red)" : "var(--ink-3)" }}
            >
              t={String(Math.round(t)).padStart(4, "0")}
            </span>
            <input
              type="range"
              min={0}
              max={1000}
              value={1000 - t}
              onChange={(e) => scrub(Number(e.target.value))}
              onPointerDown={() => setScrubbing(true)}
              onPointerUp={() => setScrubbing(false)}
              onBlur={() => setScrubbing(false)}
              aria-label="Diffusion timestep — drag to add noise back to the wordmark"
              className="scrub flex-1"
            />
            <button
              onClick={restart}
              className="quiet p-1"
              title="Re-noise, then resolve"
              aria-label="Restart the denoising process"
            >
              <RotateCcw size={13} />
            </button>
          </div>
          <p className="meta mt-2">
            reverse diffusion · drag to put the noise back, or push the field with your cursor
          </p>
        </motion.div>

        {/* Positioning + metrics */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
          className="mt-14 grid lg:grid-cols-[1.12fr_0.88fr] gap-12 lg:gap-20 items-start"
        >
          <div>
            <p className="lede">
              I build generative models that hold up where the data runs out.
            </p>
            <p className="lede" style={{ color: "var(--red)" }}>
              <RotatingWord words={PROFILE.roles} />
            </p>
            <p className="mt-6 max-w-[56ch] text-[0.94rem]" style={{ color: "var(--ink-2)" }}>
              Co-author of DELBERT-2 and first author of Gut4Heart, a microbiome foundation
              model whose pretraining prior is a biological knowledge graph. Heading to
              Waterloo for an MMath in Generative AI for Health.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.3}>
                <a href="#research" className="btn">
                  Read the research
                </a>
              </Magnetic>
              <a
                href={PROFILE.resumePath}
                download="Shaik_Salman_Basha_CV.pdf"
                className="mono text-[11px] uppercase tracking-[0.14em] quiet"
              >
                Curriculum vitae ↓
              </a>
              <button
                onClick={() => window.dispatchEvent(new Event("palette:open"))}
                className="mono text-[11px] uppercase tracking-[0.14em] quiet"
              >
                ⌘K
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-8">
            {METRICS.map((m) => (
              <div key={m.label}>
                <dt className="serif text-[1.9rem] leading-none tabular-nums">
                  <CountUp
                    to={m.value}
                    decimals={m.decimals}
                    prefix={m.prefix}
                    suffix={m.suffix}
                  />
                </dt>
                <dd className="meta mt-2.5 leading-snug">{m.label}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      <motion.a
        href="#research"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 quiet"
        aria-label="Scroll to research"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="block"
        >
          <ArrowDown size={15} />
        </motion.span>
      </motion.a>
    </section>
  );
}
