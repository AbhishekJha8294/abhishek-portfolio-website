import { cx } from "@/lib/cx";

export type RunState = "idle" | "running" | "checkpoint" | "waiting" | "passed" | "blocked";

const fill: Record<RunState, string> = {
  idle: "bg-transparent ring-1 ring-inset ring-subtle/70",
  running: "bg-accent",
  checkpoint: "bg-accent ring-[3px] ring-accent/25",
  waiting: "bg-warn",
  passed: "bg-accent/75",
  blocked: "bg-danger",
};

const pulse: Partial<Record<RunState, string>> = {
  running: "bg-accent",
  waiting: "bg-warn",
};

/** Text colour that pairs with each state. */
export const stateText: Record<RunState, string> = {
  idle: "text-subtle",
  running: "text-accent",
  checkpoint: "text-accent",
  waiting: "text-warn",
  passed: "text-muted",
  blocked: "text-danger",
};

export function StatusDot({ state, className }: { state: RunState; className?: string }) {
  const ring = pulse[state];
  return (
    <span aria-hidden className={cx("relative inline-flex size-1.5 shrink-0", className)}>
      {ring && <span className={cx("absolute inset-0 rounded-full animate-signal", ring)} />}
      <span className={cx("relative inline-flex size-full rounded-full transition-colors duration-300", fill[state])} />
    </span>
  );
}
