import { useState } from "react";

/**
 * The leave-one-cohort-out transfer result, as a grid.
 *
 * Rows are the training cohort, columns the held-out target. Only the ten
 * canonical directed pairs were evaluated; the rest of the grid is left empty
 * rather than filled in, because it was never run. Graph initialization wins
 * nine of the ten — the single loss is metacardis-cvd → acvd, which is the
 * same cohort that behaves badly elsewhere in the study, so it is marked
 * rather than hidden.
 */

type Cohort = {
  id: string;
  short: string;
  label: string;
  n: number;
  disease: "CVD" | "T2D";
  region: "China" | "Europe";
};

const COHORTS: Cohort[] = [
  { id: "acvd", short: "ACVD", label: "ACVD (Jie 2017)", n: 385, disease: "CVD", region: "China" },
  { id: "mc_cvd", short: "MC-CVD", label: "MetaCardis-CVD", n: 599, disease: "CVD", region: "Europe" },
  { id: "qin", short: "Qin", label: "Qin 2012 T2D", n: 344, disease: "T2D", region: "China" },
  { id: "karlsson", short: "Karls", label: "Karlsson 2013 T2D", n: 96, disease: "T2D", region: "Europe" },
  { id: "mc_t2d", short: "MC-T2D", label: "MetaCardis-T2D", n: 783, disease: "T2D", region: "Europe" },
];

/** source → target, and whether graph-init beat random-init. */
const PAIRS: Record<string, "win" | "loss"> = {
  "acvd>mc_t2d": "win",
  "mc_t2d>acvd": "win",
  "acvd>mc_cvd": "win",
  "mc_cvd>acvd": "loss",
  "karlsson>mc_t2d": "win",
  "mc_t2d>karlsson": "win",
  "qin>mc_t2d": "win",
  "mc_t2d>qin": "win",
  "qin>karlsson": "win",
  "karlsson>qin": "win",
};

export default function TransferMatrix() {
  const [hover, setHover] = useState<string | null>(null);

  const active = hover ? PAIRS[hover] : undefined;
  const [srcId, tgtId] = hover?.split(">") ?? [];
  const src = COHORTS.find((c) => c.id === srcId);
  const tgt = COHORTS.find((c) => c.id === tgtId);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <span className="eyebrow">Leave-one-cohort-out</span>
        <span className="meta">9 / 10 pairs</span>
      </div>

      <div className="overflow-x-auto -mx-1 px-1">
        <table className="border-collapse w-full">
          <thead>
            <tr>
              <th className="meta font-normal text-left pr-2 pb-2 align-bottom" style={{ width: 48 }}>
                <span className="opacity-60">↓ train</span>
              </th>
              {COHORTS.map((c) => (
                <th key={c.id} className="meta font-normal pb-2 px-0.5 whitespace-nowrap">
                  {c.short}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {COHORTS.map((row) => (
              <tr key={row.id}>
                <th className="meta font-normal text-left pr-2 py-1 whitespace-nowrap">
                  {row.short}
                </th>
                {COHORTS.map((col) => {
                  const key = `${row.id}>${col.id}`;
                  const result = PAIRS[key];
                  const self = row.id === col.id;
                  const on = hover === key;
                  return (
                    <td key={col.id} className="p-0.5">
                      <div
                        onMouseEnter={() => result && setHover(key)}
                        onMouseLeave={() => setHover(null)}
                        aria-label={
                          result
                            ? `${row.short} to ${col.short}: graph initialization ${result === "win" ? "wins" : "loses"}`
                            : undefined
                        }
                        className="h-7 w-full rounded-[2px] flex items-center justify-center transition-all duration-300"
                        style={{
                          minWidth: 30,
                          cursor: result ? "crosshair" : "default",
                          background: !result
                            ? "transparent"
                            : result === "win"
                              ? `color-mix(in srgb, var(--cyan) ${on ? 42 : 26}%, transparent)`
                              : `color-mix(in srgb, var(--red) ${on ? 46 : 30}%, transparent)`,
                          border: `1px solid ${
                            result
                              ? result === "win"
                                ? "color-mix(in srgb, var(--cyan) 45%, transparent)"
                                : "color-mix(in srgb, var(--red) 50%, transparent)"
                              : "var(--rule-soft)"
                          }`,
                          borderStyle: result ? "solid" : self ? "none" : "dashed",
                          transform: on ? "scale(1.08)" : "scale(1)",
                        }}
                      >
                        {result && (
                          <span
                            className="mono text-[10px]"
                            style={{
                              color: result === "win" ? "var(--cyan)" : "var(--red)",
                            }}
                          >
                            {result === "win" ? "+" : "−"}
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Readout for the hovered pair, with a stable height so nothing jumps. */}
      <div className="mt-4 min-h-[46px]">
        {src && tgt ? (
          <p className="text-[0.84rem] leading-snug" style={{ color: "var(--ink-2)" }}>
            <span className="mono text-[0.78rem]">
              {src.label} → {tgt.label}
            </span>
            <br />
            <span style={{ color: active === "win" ? "var(--cyan)" : "var(--red)" }}>
              {active === "win"
                ? "Graph initialization transfers better than random."
                : "The one pair random initialization wins — ACVD is the study's known weak cohort."}
            </span>{" "}
            <span className="meta">
              n={src.n} → {tgt.n} · {src.region} → {tgt.region}
            </span>
          </p>
        ) : (
          <p className="meta leading-snug">
            Hover a cell. Empty cells were never run — only the ten canonical
            directed pairs were evaluated.
          </p>
        )}
      </div>
    </div>
  );
}
