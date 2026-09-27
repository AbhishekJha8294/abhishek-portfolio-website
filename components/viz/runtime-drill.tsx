"use client";

import { usePlayback } from "@/hooks/use-playback";
import { Panel } from "@/components/ui/panel";
import { PlaybackControls, Scrubber } from "@/components/ui/playback";
import { StatusDot, stateText, type RunState } from "@/components/ui/status-dot";
import { cx } from "@/lib/cx";
import { LogTail, type LogLine } from "./log-tail";

/*
 * Failure drill: a four-task DAG, three leased workers, one worker lost
 * mid-task. The lease expires and the task resumes on another worker from
 * its last checkpoint. Task names are illustrative.
 */

type TaskId = "migrate" | "api" | "ui" | "e2e";
type WorkerId = "w-01" | "w-02" | "w-03";
type TaskView = { state: RunState; note: string };
type WorkerView = { state: "idle" | "leased" | "lost"; task?: TaskId };
type Frame = LogLine & {
  label: string;
  ms: number;
  tasks: Record<TaskId, TaskView>;
  workers: Record<WorkerId, WorkerView>;
};

const TASKS: { id: TaskId; name: string; x: number; y: number }[] = [
  { id: "migrate", name: "migrate-schema", x: 160, y: 34 },
  { id: "api", name: "api-endpoints", x: 82, y: 122 },
  { id: "ui", name: "ui-views", x: 238, y: 122 },
  { id: "e2e", name: "e2e-tests", x: 160, y: 210 },
];
const DEPS: [TaskId, TaskId][] = [
  ["migrate", "api"],
  ["migrate", "ui"],
  ["api", "e2e"],
  ["ui", "e2e"],
];
const VW = 320;
const VH = 244;
const NODE_W = 146;

const queued: TaskView = { state: "idle", note: "queued" };
const passed: TaskView = { state: "passed", note: "passed" };
const idle: WorkerView = { state: "idle" };
const lost: WorkerView = { state: "lost" };

const FRAMES: Frame[] = [
  {
    label: "Run started",
    text: "scheduler     4 tasks queued · 1 ready",
    ms: 1600,
    tasks: { migrate: { state: "idle", note: "ready" }, api: queued, ui: queued, e2e: queued },
    workers: { "w-01": idle, "w-02": idle, "w-03": idle },
  },
  {
    label: "Lease granted",
    text: "lease.grant   migrate-schema → w-01",
    ms: 1700,
    tasks: { migrate: { state: "running", note: "running · w-01" }, api: queued, ui: queued, e2e: queued },
    workers: { "w-01": { state: "leased", task: "migrate" }, "w-02": idle, "w-03": idle },
  },
  {
    label: "Parallel tasks released",
    text: "dag.release   api-endpoints, ui-views",
    ms: 1900,
    tasks: {
      migrate: passed,
      api: { state: "running", note: "running · w-01" },
      ui: { state: "running", note: "running · w-02" },
      e2e: queued,
    },
    workers: { "w-01": { state: "leased", task: "api" }, "w-02": { state: "leased", task: "ui" }, "w-03": idle },
  },
  {
    label: "Checkpoint saved",
    text: "checkpoint    ui-views step 2/3 persisted",
    ms: 1700,
    tasks: {
      migrate: passed,
      api: { state: "running", note: "running · w-01" },
      ui: { state: "checkpoint", note: "checkpoint 2/3 · w-02" },
      e2e: queued,
    },
    workers: { "w-01": { state: "leased", task: "api" }, "w-02": { state: "leased", task: "ui" }, "w-03": idle },
  },
  {
    label: "Worker lost",
    text: "heartbeat     w-02 missed · lease expired",
    tone: "warn",
    ms: 2100,
    tasks: {
      migrate: passed,
      api: { state: "running", note: "running · w-01" },
      ui: { state: "waiting", note: "lease expired · requeued" },
      e2e: queued,
    },
    workers: { "w-01": { state: "leased", task: "api" }, "w-02": lost, "w-03": idle },
  },
  {
    label: "Recovered from checkpoint",
    text: "lease.grant   ui-views → w-03 · resume @ 2/3",
    tone: "accent",
    ms: 2100,
    tasks: { migrate: passed, api: passed, ui: { state: "running", note: "resumed @ 2/3 · w-03" }, e2e: queued },
    workers: { "w-01": idle, "w-02": lost, "w-03": { state: "leased", task: "ui" } },
  },
  {
    label: "Dependents released",
    text: "dag.release   e2e-tests → w-01",
    ms: 1800,
    tasks: { migrate: passed, api: passed, ui: passed, e2e: { state: "running", note: "running · w-01" } },
    workers: { "w-01": { state: "leased", task: "e2e" }, "w-02": lost, "w-03": idle },
  },
  {
    label: "Run complete",
    text: "run.complete  4/4 passed · 1 recovery",
    tone: "accent",
    ms: 3800,
    tasks: { migrate: passed, api: passed, ui: passed, e2e: passed },
    workers: { "w-01": idle, "w-02": lost, "w-03": idle },
  },
];

const DURATIONS = FRAMES.map((f) => f.ms);
const LABELS = FRAMES.map((f) => f.label);
const taskName = Object.fromEntries(TASKS.map((t) => [t.id, t.name])) as Record<TaskId, string>;
const taskById = Object.fromEntries(TASKS.map((t) => [t.id, t])) as Record<TaskId, (typeof TASKS)[number]>;

function edgePath(a: (typeof TASKS)[number], b: (typeof TASKS)[number]) {
  const my = (a.y + b.y) / 2;
  return `M${a.x} ${a.y}C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;
}

const frameBorder: Record<RunState, string> = {
  idle: "border-line",
  running: "border-accent/35",
  checkpoint: "border-accent/35",
  waiting: "border-warn/50",
  passed: "border-line-strong",
  blocked: "border-danger/50",
};

export function RuntimeDrill() {
  const { ref, index, active, go, restart, toggle } = usePlayback<HTMLDivElement>({ durations: DURATIONS });
  const frame = FRAMES[index];

  return (
    <div ref={ref}>
      <Panel
        title={
          <>
            <StatusDot state={index === FRAMES.length - 1 ? "passed" : frame.tone === "warn" ? "waiting" : "running"} />
            <span>runtime</span>
            <span aria-hidden className="text-line-strong">/</span>
            <span className="truncate text-fg">{frame.label}</span>
          </>
        }
        actions={<PlaybackControls active={active} onToggle={toggle} onRestart={restart} label="runtime drill" />}
      >
        <div className="grid sm:grid-cols-[1fr_188px]">
          <div className="relative bg-grid-fine px-2 py-3">
            <ol className="relative mx-auto w-full max-w-[400px] list-none" style={{ aspectRatio: `${VW} / ${VH}` }}>
              <svg viewBox={`0 0 ${VW} ${VH}`} className="absolute inset-0 size-full" fill="none" aria-hidden>
                {DEPS.map(([a, b]) => {
                  const target = frame.tasks[b].state;
                  const live = target === "running" || target === "checkpoint";
                  return (
                    <path
                      key={`${a}-${b}`}
                      d={edgePath(taskById[a], taskById[b])}
                      strokeWidth={1.25}
                      strokeDasharray={target === "idle" ? "2 4" : undefined}
                      className={cx(
                        "transition-[stroke] duration-500",
                        target === "idle" && "stroke-line-strong",
                        target === "passed" && "stroke-subtle/45",
                        target === "waiting" && "stroke-warn/60",
                        live && "edge-flow stroke-accent",
                      )}
                    />
                  );
                })}
              </svg>
              {TASKS.map((t) => {
                const view = frame.tasks[t.id];
                return (
                  <li
                    key={t.id}
                    className={cx(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-panel px-2.5 py-1.5 transition-colors duration-300",
                      frameBorder[view.state],
                    )}
                    style={{ left: `${(t.x / VW) * 100}%`, top: `${(t.y / VH) * 100}%`, width: `${(NODE_W / VW) * 100}%` }}
                  >
                    <span className="flex items-center gap-2">
                      <StatusDot state={view.state} />
                      <span className={cx("truncate font-mono text-[11px] leading-4", view.state === "idle" ? "text-muted" : "text-fg")}>
                        {t.name}
                      </span>
                    </span>
                    <span className={cx("mt-0.5 block truncate pl-3.5 font-mono text-[10px] leading-[14px]", stateText[view.state])}>
                      {view.note}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="border-t border-line px-3.5 py-3 sm:border-l sm:border-t-0">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Workers</p>
            <ul className="mt-2.5 grid grid-cols-3 gap-2 sm:grid-cols-1">
              {(Object.keys(frame.workers) as WorkerId[]).map((id) => {
                const w = frame.workers[id];
                const state: RunState = w.state === "leased" ? "running" : w.state === "lost" ? "blocked" : "idle";
                return (
                  <li key={id} className="rounded-md border border-line bg-canvas/60 px-2.5 py-2 font-mono text-[10.5px] leading-4">
                    <span className="flex items-center gap-2">
                      <StatusDot state={state} />
                      <span className={cx(w.state === "lost" ? "text-subtle line-through" : "text-fg")}>{id}</span>
                    </span>
                    <span className={cx("mt-1 block truncate", w.state === "lost" ? "text-danger" : "text-subtle")}>
                      {w.state === "leased" && w.task ? `lease · ${taskName[w.task]}` : w.state === "lost" ? "heartbeat lost" : "idle"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="border-t border-line px-3.5 pb-3 pt-1.5">
          <Scrubber steps={LABELS} index={index} onSelect={go} />
          <LogTail lines={FRAMES} index={index} className="mt-1.5" />
        </div>
      </Panel>
    </div>
  );
}
