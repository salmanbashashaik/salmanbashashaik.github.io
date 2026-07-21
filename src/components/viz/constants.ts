/** Constants shared between the instruments and the panels that frame them. */

/* ── MRI few-shot ablation ────────────────────────────────── */

export type Regime = {
  shots: number;
  auc: number;
  fid: number;
  ssim: number;
  /** 0..1 — how cleanly the volume renders in this regime */
  fidelity: number;
};

export const REGIMES: Regime[] = [
  { shots: 8, auc: 0.87, fid: 41.2, ssim: 0.71, fidelity: 0.42 },
  { shots: 10, auc: 0.94, fid: 28.6, ssim: 0.82, fidelity: 0.72 },
  { shots: 16, auc: 0.96, fid: 22.4, ssim: 0.88, fidelity: 1.0 },
];

/* ── Insulin dosing policies ──────────────────────────────── */

export type Policy = "none" | "ppo" | "grpo";

export const POLICY_LABEL: Record<Policy, string> = {
  none: "No agent",
  ppo: "PPO",
  grpo: "GRPO",
};

/* ── Ingestion throughput ─────────────────────────────────── */

export type PipelineMode = "serial" | "parallel";

export const RATE: Record<PipelineMode, number> = { serial: 11, parallel: 260 };
export const LANES: Record<PipelineMode, number> = { serial: 1, parallel: 8 };
