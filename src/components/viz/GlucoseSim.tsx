import { useEffect, useRef, useState } from "react";
import { POLICY_LABEL, type Policy } from "./constants";

/**
 * A running glucose trace with an agent dosing insulin against it.
 *
 * The dynamics are a toy two-compartment model (carbs on board, insulin on
 * board), not the OhioT1DM simulator — but the policies are shaped the way
 * the real ones behaved: PPO learned a conservative policy that protects the
 * hypo bound, GRPO corrects harder and buys a tighter mean at the cost of
 * occasional excursions below 70 mg/dL.
 */

const LOW = 70;
const HIGH = 180;
const HISTORY = 300;

type State = { g: number; cob: number; iob: number; tick: number };

function step(s: State, policy: Policy): State {
  let { g, cob, iob, tick } = s;
  tick++;

  // A meal roughly every ~3 simulated hours, with variable carb load.
  if (tick % 190 === 0) cob += 55 + Math.random() * 65;

  // carbs absorb into blood glucose; insulin clears it
  const absorbed = cob * 0.021;
  cob -= absorbed;
  const cleared = iob * 0.055;
  iob -= cleared;

  g += absorbed * 1.55 - cleared * 26 - 0.14 * (g - 105) * 0.06;
  g += (Math.random() - 0.5) * 1.5; // sensor + physiological noise

  // ── policies ──
  if (policy === "ppo") {
    // Conservative: acts on predicted trajectory, backs off hard near the
    // hypo bound because the reward penalized sub-70 excursions heavily.
    const predicted = g + absorbed * 3.1 - iob * 12;
    if (predicted > 155 && iob < 3.4) iob += Math.min(0.5, (predicted - 155) / 150);
    if (predicted < 95) iob *= 0.7;
  } else if (policy === "grpo") {
    // Aggressive: corrects toward a tighter setpoint, tolerates more risk.
    const predicted = g + absorbed * 3.1 - iob * 10;
    if (predicted > 132 && iob < 5) iob += Math.min(0.82, (predicted - 132) / 105);
    if (predicted < 78) iob *= 0.84;
  }

  g = Math.max(38, Math.min(360, g));
  return { g, cob, iob, tick };
}

export default function GlucoseSim({
  policy,
  className,
  onStats,
}: {
  policy: Policy;
  className?: string;
  onStats?: (s: { tir: number; hypo: number; mean: number }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(true);
  const policyRef = useRef(policy);
  policyRef.current = policy;

  // Reset the trace whenever the policy changes so the comparison is honest.
  const seriesRef = useRef<number[]>([]);
  useEffect(() => {
    seriesRef.current = [];
  }, [policy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    let state: State = { g: 128, cob: 40, iob: 0.8, tick: 0 };
    const colors = { ink: "#16130f", ink3: "#8d8578", red: "#b85a3a", cyan: "#5f7a5a", rule: "rgba(0,0,0,.1)" };

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      colors.ink = cs.getPropertyValue("--ink").trim() || colors.ink;
      colors.ink3 = cs.getPropertyValue("--ink-3").trim() || colors.ink3;
      colors.red = cs.getPropertyValue("--red").trim() || colors.red;
      colors.cyan = cs.getPropertyValue("--cyan").trim() || colors.cyan;
      colors.rule = cs.getPropertyValue("--rule").trim() || colors.rule;
    };
    readColors();
    const mo = new MutationObserver(readColors);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const MIN = 40;
    const MAX = 300;
    const yOf = (g: number) => h - ((g - MIN) / (MAX - MIN)) * h;

    let frame = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      frame++;

      if (live && !reduced && frame % 2 === 0) {
        // advance a few sim steps per painted frame so the trace moves
        for (let i = 0; i < 3; i++) state = step(state, policyRef.current);
        const s = seriesRef.current;
        s.push(state.g);
        if (s.length > HISTORY) s.shift();

        if (frame % 30 === 0 && onStats && s.length > 20) {
          const inRange = s.filter((v) => v >= LOW && v <= HIGH).length;
          const below = s.filter((v) => v < LOW).length;
          onStats({
            tir: (inRange / s.length) * 100,
            hypo: (below / s.length) * 100,
            mean: s.reduce((a, b) => a + b, 0) / s.length,
          });
        }
      }

      ctx.clearRect(0, 0, w, h);

      // target band — canvas has no color-mix(), so tint with alpha instead
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = colors.cyan;
      ctx.fillRect(0, yOf(HIGH), w, yOf(LOW) - yOf(HIGH));
      ctx.globalAlpha = 1;

      // bounds
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = 1;
      for (const [g, c] of [
        [HIGH, colors.cyan],
        [LOW, colors.red],
      ] as const) {
        ctx.strokeStyle = c;
        ctx.beginPath();
        ctx.moveTo(0, yOf(g));
        ctx.lineTo(w, yOf(g));
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = c;
        ctx.font = '400 9px "JetBrains Mono", monospace';
        ctx.fillText(String(g), 4, yOf(g) - 4);
        ctx.setLineDash([2, 4]);
      }
      ctx.setLineDash([]);

      // trace
      const s = seriesRef.current;
      if (s.length > 1) {
        const dx = w / (HISTORY - 1);
        ctx.lineWidth = 1.5;
        ctx.lineJoin = "round";
        ctx.beginPath();
        for (let i = 0; i < s.length; i++) {
          const x = i * dx;
          const y = yOf(s[i]);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = colors.ink;
        ctx.stroke();

        // hypoglycemic excursions get marked — the thing the reward punished
        for (let i = 0; i < s.length; i++) {
          if (s[i] < LOW) {
            ctx.fillStyle = colors.red;
            ctx.globalAlpha = 0.85;
            ctx.beginPath();
            ctx.arc(i * dx, yOf(s[i]), 1.7, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
          }
        }

        // leading head
        const lastX = (s.length - 1) * dx;
        const lastY = yOf(s[s.length - 1]);
        ctx.fillStyle = s[s.length - 1] < LOW ? colors.red : colors.ink;
        ctx.beginPath();
        ctx.arc(lastX, lastY, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '400 9px "JetBrains Mono", monospace';
        ctx.fillStyle = colors.ink3;
        ctx.fillText(`${Math.round(s[s.length - 1])} mg/dL`, Math.min(lastX + 7, w - 62), lastY - 6);
      }
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [live, onStats]);

  // Pause when scrolled out of view — no reason to burn frames offscreen.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(canvas);
    return () => io.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label={`Simulated glucose trace under the ${POLICY_LABEL[policy]} policy`}
      style={{ display: "block", width: "100%" }}
    />
  );
}
