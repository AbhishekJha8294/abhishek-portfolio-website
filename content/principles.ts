import type { RunState } from "@/components/ui/status-dot";

/** Each principle borrows a state from the visual language used across the site. */
export const principles: { tag: string; state: RunState; statement: [string, string]; text: string }[] = [
  {
    tag: "deterministic",
    state: "passed",
    statement: ["Deterministic", "where possible."],
    text: "Scheduling, state, retries and recovery belong in code you can test — not in a prompt.",
  },
  {
    tag: "probabilistic",
    state: "running",
    statement: ["Probabilistic", "where useful."],
    text: "Models plan and implement inside bounded steps, with budgets and retry policies around them.",
  },
  {
    tag: "observable",
    state: "checkpoint",
    statement: ["Observable", "everywhere."],
    text: "Every run, decision, cost and artifact leaves a trace you can inspect, compare and replay.",
  },
  {
    tag: "governed",
    state: "waiting",
    statement: ["Humans", "stay in control."],
    text: "Approval gates, scoped permissions and audit trails. Autonomy is granted, not assumed.",
  },
];

export const qualities = [
  "Reliability",
  "Traceability",
  "Guardrails",
  "Recovery",
  "Cost control",
  "Human approval",
  "Evaluation",
  "Operational visibility",
];
