"use client";

import { useState } from "react";
import { usePlayback } from "@/hooks/use-playback";
import { Panel } from "@/components/ui/panel";
import { PlaybackControls, Scrubber } from "@/components/ui/playback";
import { StatusDot, stateText, type RunState } from "@/components/ui/status-dot";
import { cx } from "@/lib/cx";
import { LogTail, type LogLine } from "./log-tail";

/*
 * One metered run: steps routed to model tiers, one transient failure retried,
 * spend tracked against a per-run limit. Cost is estimated *before* each step;
 * the run pauses itself rather than cross the limit. Figures are illustrative
 * and expressed as a percentage of the run's limit.
 */

type Step = { name: string; tier: "T1" | "T2" | "T3"; est: number; actual?: number; tries: number };

const TIER_NAME = { T1: "light", T2: "standard", T3: "deep" } as const;

const STEPS: Step[] = [
  { name: "plan", tier: "T3", est: 17, actual: 18, tries: 1 },
  { name: "rank-context", tier: "T1", est: 3, actual: 4, tries: 1 },
  { name: "implement-api", tier: "T2", est: 20, actual: 31, tries: 2 },
  { name: "implement-ui", tier: "T2", est: 19, actual: 20, tries: 1 },
  { name: "write-tests", tier: "T2", est: 14, actual: 15, tries: 1 },
  { name: "fix-failing-test", tier: "T2", est: 16, tries: 0 },
];

/** A previous run of the same requirement, for comparison. */
const PREVIOUS = { id: "r-0409", spend: [18, 4, 21, 22, 14, 12] };

type Frame = LogLine & {
  label: string;
  ms: number;
  done: number;
  run?: { row: number; attempt: number };
  estimating?: number;
  paused?: boolean;
};

const FRAMES: Frame[] = [
  { label: "Routing plan → T3", text: "route          plan → T3 · est 17%", ms: 1400, done: 0, run: { row: 0, attempt: 1 } },
  { label: "Routing context → T1", text: "route          rank-context → T1 · est 3%", ms: 1300, done: 1, run: { row: 1, attempt: 1 } },
  { label: "Implementing", text: "route          implement-api → T2 · est 20%", ms: 1300, done: 2, run: { row: 2, attempt: 1 } },
  { label: "Retrying", text: "retry.policy   implement-api timeout · attempt 2/3", tone: "warn", ms: 1600, done: 2, run: { row: 2, attempt: 2 } },
  { label: "Implementing", text: "route          implement-ui → T2 · est 19%", ms: 1300, done: 3, run: { row: 3, attempt: 1 } },
  { label: "Writing tests", text: "route          write-tests → T2 · est 14%", ms: 1300, done: 4, run: { row: 4, attempt: 1 } },
  { label: "Estimating next step", text: "estimate       fix-failing-test · 16% → 104%", tone: "warn", ms: 1600, done: 5, estimating: 5 },
  { label: "Auto-paused · spend limit", text: "budget.guard   projected 104% > 100% · paused", tone: "warn", ms: 4200, done: 5, paused: true },
];

const DURATIONS = FRAMES.map((f) => f.ms);
const LABELS = FRAMES.map((f) => f.label);
const SCALE = 120;
const LIMIT = 100;

function telemetry(frame: Frame) {
  const finished = STEPS.slice(0, frame.done);
  const spent = finished.reduce((sum, s) => sum + (s.actual ?? 0), 0);
  const calls = finished.reduce((sum, s) => sum + s.tries, 0) + (frame.run?.attempt ?? 0);
  const retries = finished.reduce((sum, s) => sum + s.tries - 1, 0) + (frame.run ? frame.run.attempt - 1 : 0);
  const pendingRow = frame.run?.row ?? frame.estimating ?? (frame.paused ? frame.done : undefined);
  const pending = pendingRow === undefined ? 0 : STEPS[pendingRow].est;
  return { spent, calls, retries, pending };
}

function rowState(frame: Frame, i: number): { state: RunState; note?: string } {
  if (i < frame.done) return { state: "passed" };
  if (frame.run?.row === i) return { state: frame.run.attempt > 1 ? "waiting" : "running", note: frame.run.attempt > 1 ? "retry" : "running" };
  if (frame.estimating === i) return { state: "running", note: "estimating" };
  if (frame.paused && i === frame.done) return { state: "waiting", note: "paused" };
  return { state: "idle" };
}

export function AiOpsDrill() {
  const [view, setView] = useState<"run" | "compare">("run");
  const { ref, index, active, go, restart, toggle } = usePlayback<HTMLDivElement>({ durations: DURATIONS, loop: false });
  const frame = FRAMES[index];
  const t = telemetry(frame);
  const over = t.spent + t.pending > LIMIT;

  return (
    <div ref={ref}>
      <Panel
        title={
          <>
            <StatusDot state={frame.paused ? "waiting" : frame.tone === "warn" ? "waiting" : "running"} />
            <span>ai-ops</span>
            <span aria-hidden className="text-line-strong">/</span>
            <span className={cx("truncate", frame.tone === "warn" ? "text-warn" : "text-fg")}>{frame.label}</span>
          </>
        }
        actions={<PlaybackControls active={active} onToggle={toggle} onRestart={restart} label="AI Ops drill" />}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-3.5 py-2.5">
          <div role="radiogroup" aria-label="View" className="inline-flex rounded-md border border-line bg-canvas p-0.5 font-mono text-[11px]">
            {(["run", "compare"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={view === v}
                onClick={() => setView(v)}
                className={cx("rounded px-2.5 py-1 transition-colors", view === v ? "bg-raised text-fg" : "text-subtle hover:text-fg")}
              >
                {v === "run" ? "run r-0412" : "compare runs"}
              </button>
            ))}
          </div>
          <p className="font-mono text-[10.5px] text-subtle">
            spend limit <span className="text-muted">per run</span> · figures in % of limit
          </p>
        </div>

        {view === "run" ? (
          <>
            <dl className="grid grid-cols-4 divide-x divide-line border-b border-line">
              {[
                { k: "calls", v: String(t.calls) },
                { k: "retries", v: String(t.retries), warn: t.retries > 0 },
                { k: "spent", v: `${t.spent}%` },
                { k: "status", v: frame.paused ? "paused" : "running", warn: frame.paused },
              ].map((m) => (
                <div key={m.k} className="px-3.5 py-2.5">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">{m.k}</dt>
                  <dd className={cx("mt-1 font-mono text-[15px] tabular-nums", m.warn ? "text-warn" : "text-fg")}>{m.v}</dd>
                </div>
              ))}
            </dl>

            <div className="border-b border-line px-3.5 pb-3.5 pt-7">
              <div className="relative h-2 rounded-full bg-raised" role="img" aria-label={`Spent ${t.spent}% of run limit; next step estimated at ${t.pending}%`}>
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-700 ease-out"
                  style={{ width: `${(t.spent / SCALE) * 100}%` }}
                />
                <div
                  className={cx("absolute inset-y-0 rounded-r-full opacity-70 transition-all duration-700 hatch", over ? "text-warn" : "text-accent/60")}
                  style={{ left: `${(t.spent / SCALE) * 100}%`, width: `${(t.pending / SCALE) * 100}%` }}
                />
                <div className="absolute -inset-y-1.5 w-px bg-fg/70" style={{ left: `${(LIMIT / SCALE) * 100}%` }} />
                <span
                  className="absolute -top-5 -translate-x-1/2 font-mono text-[10px] text-fg/80"
                  style={{ left: `${(LIMIT / SCALE) * 100}%` }}
                >
                  limit
                </span>
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-subtle">
                <span>0%</span>
                <span className="flex gap-3">
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-3 rounded-sm bg-accent" /> spent
                  </span>
                  <span className={cx("flex items-center gap-1.5", over && "text-warn")}>
                    <span className={cx("hatch inline-block h-1.5 w-3 rounded-sm", over ? "text-warn" : "text-accent/60")} /> estimate
                  </span>
                </span>
                <span>{SCALE}%</span>
              </div>
            </div>

            <table className="w-full font-mono text-[11px]">
              <caption className="sr-only">Run steps with model tier, attempts, estimated and actual spend</caption>
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-subtle">
                  <th scope="col" className="px-3.5 py-2 font-normal">step</th>
                  <th scope="col" className="px-2 py-2 font-normal">tier</th>
                  <th scope="col" className="px-2 py-2 text-right font-normal">tries</th>
                  <th scope="col" className="px-2 py-2 text-right font-normal">est</th>
                  <th scope="col" className="px-3.5 py-2 text-right font-normal">spend</th>
                </tr>
              </thead>
              <tbody>
                {STEPS.map((s, i) => {
                  const r = rowState(frame, i);
                  const tries = i < frame.done ? s.tries : frame.run?.row === i ? frame.run.attempt : 0;
                  return (
                    <tr key={s.name} className={cx("border-t border-line transition-colors duration-300", r.state === "idle" && "text-subtle/70")}>
                      <td className="px-3.5 py-[7px]">
                        <span className="flex items-center gap-2">
                          <StatusDot state={r.state} />
                          <span className={cx("truncate", r.state !== "idle" && "text-fg")}>{s.name}</span>
                          {r.note && <span className={cx("hidden sm:inline", stateText[r.state])}>{r.note}</span>}
                        </span>
                      </td>
                      <td className="px-2 py-[7px] text-muted">
                        {s.tier}
                        <span className="hidden text-subtle sm:inline"> · {TIER_NAME[s.tier]}</span>
                      </td>
                      <td className={cx("px-2 py-[7px] text-right tabular-nums", tries > 1 ? "text-warn" : "text-muted")}>{tries || "–"}</td>
                      <td className="px-2 py-[7px] text-right tabular-nums text-subtle">{s.est}%</td>
                      <td className={cx("px-3.5 py-[7px] text-right tabular-nums", r.state === "waiting" && frame.paused ? "text-warn" : "text-fg")}>
                        {i < frame.done ? `${s.actual}%` : frame.paused && i === frame.done ? "held" : "–"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <Compare />
        )}

        <div className="border-t border-line px-3.5 pb-3 pt-1.5">
          <Scrubber steps={LABELS} index={index} onSelect={go} />
          <LogTail lines={FRAMES} index={index} className="mt-1.5" />
        </div>
      </Panel>
    </div>
  );
}

function Compare() {
  const current = STEPS.map((s) => s.actual);
  const max = Math.max(...PREVIOUS.spend, ...current.map((v) => v ?? 0));
  const totalPrev = PREVIOUS.spend.reduce((a, b) => a + b, 0);
  const totalCur = current.reduce<number>((a, b) => a + (b ?? 0), 0);

  return (
    <div className="px-3.5 py-3">
      <div className="flex items-center gap-4 font-mono text-[10.5px] text-subtle">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-3 rounded-sm bg-subtle/50" /> {PREVIOUS.id} · completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-1.5 w-3 rounded-sm bg-accent" /> r-0412 · paused
        </span>
      </div>
      <table className="mt-3 w-full font-mono text-[11px]">
        <caption className="sr-only">Spend per step for two runs of the same requirement</caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">step</th>
            <th scope="col">spend comparison</th>
            <th scope="col">delta</th>
          </tr>
        </thead>
        <tbody>
          {STEPS.map((s, i) => {
            const prev = PREVIOUS.spend[i];
            const cur = s.actual;
            const delta = cur === undefined ? null : cur - prev;
            return (
              <tr key={s.name}>
                <td className="w-[38%] py-1.5 pr-3 align-middle text-muted">{s.name}</td>
                <td className="py-1.5 align-middle">
                  <div className="space-y-1">
                    <div className="h-1.5 rounded-sm bg-subtle/50" style={{ width: `${(prev / max) * 100}%` }} />
                    {cur === undefined ? (
                      <div className="h-1.5 w-full rounded-sm border border-dashed border-warn/50" />
                    ) : (
                      <div className="h-1.5 rounded-sm bg-accent" style={{ width: `${(cur / max) * 100}%` }} />
                    )}
                  </div>
                </td>
                <td
                  className={cx(
                    "w-14 py-1.5 pl-3 text-right tabular-nums",
                    delta === null ? "text-warn" : delta > 0 ? "text-warn" : "text-subtle",
                  )}
                >
                  {delta === null ? "held" : `${delta > 0 ? "+" : ""}${delta}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-3 border-t border-line pt-3 font-mono text-[10.5px] leading-relaxed text-subtle">
        <span className="text-muted">{PREVIOUS.id}</span> {totalPrev}% ·{" "}
        <span className="text-muted">r-0412</span> {totalCur}% before pause — the retry on{" "}
        <span className="text-warn">implement-api</span> accounts for most of the gap.
      </p>
    </div>
  );
}
