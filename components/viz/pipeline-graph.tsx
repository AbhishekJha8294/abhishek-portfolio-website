"use client";

import { useState } from "react";
import { usePlayback } from "@/hooks/use-playback";
import { Panel } from "@/components/ui/panel";
import { PlaybackControls, Scrubber } from "@/components/ui/playback";
import { StatusDot, stateText, type RunState } from "@/components/ui/status-dot";
import { cx } from "@/lib/cx";

/*
 * Hero visualization: one agent run moving through a governed pipeline.
 * Geometry lives in a fixed 460×540 coordinate space; the container keeps the
 * same aspect ratio, so HTML nodes (positioned in %) and SVG edges (viewBox)
 * scale together and text stays at a readable pixel size on every screen.
 */

type NodeId = "req" | "plan" | "orch" | "w1" | "w2" | "tools" | "tests" | "approval" | "pr";

type GraphNode = {
  id: NodeId;
  label: string;
  x: number;
  y: number;
  w: number;
  active: string;
  done: string;
  detail: string;
};

const W = 460;
const H = 500;
const WIDE = 216;
const NARROW = 190;
const X = { left: 118, center: 230, right: 342 };
const Y = [32, 104, 176, 250, 324, 396, 468];

const NODES: GraphNode[] = [
  { id: "req", label: "Requirement", x: X.center, y: Y[0], w: WIDE, active: "received", done: "stored · v1", detail: "Work enters as a versioned requirement — the root of the traceability chain." },
  { id: "plan", label: "Planner", x: X.center, y: Y[1], w: WIDE, active: "planning", done: "task graph ready", detail: "The intelligence plane decomposes the requirement into a graph of tasks." },
  { id: "orch", label: "DAG Orchestrator", x: X.center, y: Y[2], w: WIDE, active: "scheduling", done: "run complete", detail: "The deterministic plane releases ready tasks and issues leases to workers." },
  { id: "w1", label: "Worker w-01", x: X.left, y: Y[3], w: NARROW, active: "lease held", done: "released", detail: "Holds a time-bound lease and checkpoints progress, so work can resume elsewhere." },
  { id: "w2", label: "Worker w-02", x: X.right, y: Y[3], w: NARROW, active: "lease held", done: "released", detail: "Holds a time-bound lease and checkpoints progress, so work can resume elsewhere." },
  { id: "tools", label: "Tools", x: X.left, y: Y[4], w: NARROW, active: "scoped calls", done: "passed", detail: "Tool calls stay inside the task's declared file scope and guardrails." },
  { id: "tests", label: "Tests", x: X.right, y: Y[4], w: NARROW, active: "running", done: "passed", detail: "Automated tests gate the change before it reaches a person." },
  { id: "approval", label: "Human approval", x: X.center, y: Y[5], w: WIDE, active: "awaiting review", done: "approved", detail: "A recorded human decision is required before anything is opened." },
  { id: "pr", label: "GitHub PR", x: X.center, y: Y[6], w: WIDE, active: "opening", done: "opened", detail: "Branch and pull request created through the GitHub App API." },
];

const EDGES: [NodeId, NodeId][] = [
  ["req", "plan"],
  ["plan", "orch"],
  ["orch", "w1"],
  ["orch", "w2"],
  ["w1", "tools"],
  ["w2", "tests"],
  ["tools", "approval"],
  ["tests", "approval"],
  ["approval", "pr"],
];

type Phase = { label: string; log: string; ms: number; set: Partial<Record<NodeId, RunState>> };

const PHASES: Phase[] = [
  { label: "Requirement received", log: "requirement.received   document v1 stored", ms: 1400, set: { req: "running" } },
  { label: "Planning", log: "planner.run            decomposing into tasks", ms: 1800, set: { req: "passed", plan: "running" } },
  { label: "Tasks scheduled", log: "dag.schedule           2 tasks ready", ms: 1500, set: { plan: "passed", orch: "running" } },
  { label: "Workers executing", log: "lease.granted          w-01 · w-02", ms: 1800, set: { w1: "running", w2: "running" } },
  { label: "Checkpoint saved", log: "checkpoint.saved       run state persisted", ms: 1500, set: { w1: "checkpoint", w2: "checkpoint" } },
  { label: "Tests running", log: "tools.call · tests.run  within file scope", ms: 2000, set: { w1: "passed", w2: "passed", tools: "running", tests: "running" } },
  { label: "Awaiting human approval", log: "gate.approval          waiting on reviewer", ms: 2600, set: { tools: "passed", tests: "passed", orch: "passed", approval: "waiting" } },
  { label: "Approved", log: "approval.recorded      ledger entry written", ms: 1200, set: { approval: "passed" } },
  { label: "Pull request created", log: "github.pull_request    opened via GitHub App", ms: 3800, set: { pr: "passed" } },
];

const INITIAL = Object.fromEntries(NODES.map((n) => [n.id, "idle"])) as Record<NodeId, RunState>;

const STATES = PHASES.reduce<Record<NodeId, RunState>[]>((acc, phase) => {
  acc.push({ ...(acc.at(-1) ?? INITIAL), ...phase.set });
  return acc;
}, []);

const DURATIONS = PHASES.map((p) => p.ms);
const STEP_LABELS = PHASES.map((p) => p.label);
const byId = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<NodeId, GraphNode>;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function edgePath(a: GraphNode, b: GraphNode) {
  if (a.x === b.x) return `M${a.x} ${a.y}V${b.y}`;
  const my = (a.y + b.y) / 2;
  return `M${a.x} ${a.y}C${a.x} ${my} ${b.x} ${my} ${b.x} ${b.y}`;
}

function statusWord(node: GraphNode, state: RunState) {
  if (state === "idle") return "idle";
  if (state === "checkpoint") return "checkpoint saved";
  if (state === "passed") return node.done;
  return node.active;
}

const nodeFrame: Record<RunState, string> = {
  idle: "border-line",
  running: "border-accent/35",
  checkpoint: "border-accent/35",
  waiting: "border-warn/50 bg-[color-mix(in_oklab,var(--color-warn)_5%,var(--color-panel))]",
  passed: "border-line-strong",
  blocked: "border-danger/50",
};

export function PipelineGraph() {
  const { ref, index, active, go, restart, toggle } = usePlayback<HTMLDivElement>({ durations: DURATIONS });
  const [focus, setFocus] = useState<NodeId | null>(null);

  const states = STATES[index];
  const phase = PHASES[index];
  const last = index === PHASES.length - 1;
  const headState: RunState = last ? "passed" : states.approval === "waiting" ? "waiting" : "running";
  const focused = focus ? byId[focus] : null;

  return (
    <figure ref={ref} aria-label="Agent execution pipeline, simulated run" className="m-0">
      <Panel
        title={
          <>
            <StatusDot state={headState} />
            <span>agent.run</span>
            <span aria-hidden className="text-line-strong">/</span>
            <span className={cx("truncate", headState === "waiting" ? "text-warn" : "text-fg")}>{phase.label}</span>
          </>
        }
        actions={<PlaybackControls active={active} onToggle={toggle} onRestart={restart} label="pipeline animation" />}
      >
        <div className="relative bg-grid-fine">
          <ol className="relative mx-auto w-full max-w-[470px] list-none" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 size-full" aria-hidden fill="none">
              {EDGES.map(([from, to]) => {
                const d = edgePath(byId[from], byId[to]);
                const target = states[to];
                const flowing = target !== "idle" && target !== "passed";
                return (
                  <g key={`${from}-${to}`}>
                    <path
                      d={d}
                      strokeWidth={1.25}
                      strokeDasharray={target === "idle" ? "2 4" : undefined}
                      className={cx(
                        "transition-[stroke] duration-500",
                        target === "idle" && "stroke-line-strong",
                        target === "passed" && "stroke-subtle/45",
                        flowing && (target === "waiting" ? "stroke-warn/25" : "stroke-accent/25"),
                      )}
                    />
                    {flowing && (
                      <path
                        d={d}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        className={cx("edge-flow", target === "waiting" ? "stroke-warn" : "stroke-accent")}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {NODES.map((node) => {
              const state = states[node.id];
              const isPr = node.id === "pr" && state === "passed";
              return (
                <li
                  key={node.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: pct(node.x, W), top: pct(node.y, H), width: pct(node.w, W) }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setFocus(node.id)}
                    onMouseLeave={() => setFocus(null)}
                    onFocus={() => setFocus(node.id)}
                    onBlur={() => setFocus(null)}
                    className={cx(
                      "block w-full rounded-lg border bg-panel px-2.5 py-1.5 text-left transition-colors duration-300 hover:border-subtle/60 sm:px-3",
                      nodeFrame[state],
                      isPr && "border-accent/50 bg-[color-mix(in_oklab,var(--color-accent)_6%,var(--color-panel))]",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <StatusDot state={state} />
                      <span
                        className={cx(
                          "truncate text-[11.5px] font-medium leading-4 tracking-[-0.01em] sm:text-[13px]",
                          state === "idle" ? "text-muted" : "text-fg",
                        )}
                      >
                        {node.label}
                      </span>
                    </span>
                    <span className={cx("mt-0.5 block truncate pl-3.5 font-mono text-[10px] leading-[14px] sm:text-[10.5px]", stateText[state])}>
                      {statusWord(node, state)}
                    </span>
                    <span className="sr-only">. {node.detail}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="border-t border-line px-3.5 pb-3 pt-1.5">
          <Scrubber steps={STEP_LABELS} index={index} onSelect={go} />
          <div className="mt-1.5 h-[54px] font-mono text-[11px] leading-[18px]">
            {focused ? (
              <p key={focused.id} className="animate-rise text-pretty text-muted">
                <span className="text-fg">{focused.label}</span> — {focused.detail}
              </p>
            ) : (
              <ol aria-hidden className="list-none">
                {PHASES.map((p, i) =>
                  i > index || i < index - 2 ? null : (
                    <li key={i} className={cx("flex gap-3 whitespace-pre", i === index ? "animate-rise text-fg" : "text-subtle")}>
                      <span className="text-subtle/60">{String(i + 1).padStart(2, "0")}</span>
                      <span className="overflow-hidden text-ellipsis">{p.log}</span>
                    </li>
                  ),
                )}
              </ol>
            )}
          </div>
        </div>
      </Panel>
      <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-subtle">
        Simulated run — the orchestration pattern behind the Agentic SDLC platform. Select a node to inspect it.
      </figcaption>
    </figure>
  );
}
