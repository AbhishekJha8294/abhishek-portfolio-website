"use client";

import { useState } from "react";
import { usePlayback } from "@/hooks/use-playback";
import { Panel } from "@/components/ui/panel";
import { PlaybackControls, Scrubber } from "@/components/ui/playback";
import { StatusDot, stateText, type RunState } from "@/components/ui/status-dot";
import { cx } from "@/lib/cx";
import { LogTail, type LogLine } from "./log-tail";

/*
 * A proposed change set runs through deterministic guardrails, then waits on
 * a human. The viewer *is* the human: nothing proceeds until they approve.
 * File names and findings are illustrative.
 */

type Scenario = "compliant" | "violating";
type CheckId = "scope" | "secrets" | "creds" | "contract";

const CHECKS: { id: CheckId; name: string }[] = [
  { id: "scope", name: "File scope" },
  { id: "secrets", name: "Secret detection" },
  { id: "creds", name: "Raw DB credentials" },
  { id: "contract", name: "Architecture contract" },
];

type DiffLine = { text: string; file?: boolean; flag?: CheckId };

type Script = {
  verdicts: Record<CheckId, string>;
  diff: DiffLine[];
  steps: (LogLine & { label: string; ms: number })[];
};

const SCRIPTS: Record<Scenario, Script> = {
  compliant: {
    verdicts: {
      scope: "3 files · all within scope",
      secrets: "no findings",
      creds: "no findings",
      contract: "layering respected",
    },
    diff: [
      { text: "services/billing/invoice.py", file: true },
      { text: "def apply_credit(invoice, amount):" },
      { text: "    return invoices.apply_credit(invoice, amount)" },
      { text: "services/billing/repository.py", file: true },
      { text: "class InvoiceRepository: ..." },
      { text: "tests/billing/test_invoice.py", file: true },
      { text: "def test_credit_cannot_exceed_total(): ..." },
    ],
    steps: [
      { label: "Guardrails running", text: "run.guardrails         4 checks queued", ms: 900 },
      { label: "File scope passed", text: "guardrail.file_scope   passed", ms: 1000 },
      { label: "No secrets found", text: "guardrail.secrets      passed", ms: 1000 },
      { label: "No raw credentials", text: "guardrail.db_creds     passed", ms: 1000 },
      { label: "Contract respected", text: "contract.architecture  passed", ms: 1300 },
      { label: "Awaiting human approval", text: "approval.requested     reviewer", tone: "warn", ms: 1000 },
      { label: "Approved", text: "approval.granted       by you", tone: "accent", ms: 1300 },
      { label: "Pull request opened", text: "github.pull_request    opened", tone: "accent", ms: 4000 },
    ],
  },
  violating: {
    verdicts: {
      scope: "infra/terraform/rds.tf is out of scope",
      secrets: "credential literal · config.py:2",
      creds: "inline password · config.py:3",
      contract: "drift · api imports db layer",
    },
    diff: [
      { text: "services/billing/api.py", file: true },
      { text: "from db.session import engine", flag: "contract" },
      { text: "services/billing/config.py", file: true },
      { text: 'API_KEY = "sk-live-7f2c9a…"', flag: "secrets" },
      { text: 'DB_URL = "postgres://admin:s3cret@prod/app"', flag: "creds" },
      { text: "infra/terraform/rds.tf", file: true, flag: "scope" },
      { text: "deletion_protection = false", flag: "scope" },
    ],
    steps: [
      { label: "Guardrails running", text: "run.guardrails         4 checks queued", ms: 900 },
      { label: "Out-of-scope file", text: "guardrail.file_scope   blocked · rds.tf", tone: "danger", ms: 1300 },
      { label: "Secret detected", text: "guardrail.secrets      blocked · config.py:2", tone: "danger", ms: 1300 },
      { label: "Raw DB credential", text: "guardrail.db_creds     blocked · config.py:3", tone: "danger", ms: 1300 },
      { label: "Architecture drift", text: "contract.architecture  drift · api → db", tone: "danger", ms: 1300 },
      { label: "Blocked · returned to agent", text: "run.returned           4 findings → agent", tone: "warn", ms: 4000 },
    ],
  },
};

const APPROVAL_STEP = 5;

function checkState(scenario: Scenario, checkIndex: number, step: number): RunState {
  if (step < checkIndex) return "idle";
  if (step === checkIndex) return "running";
  return scenario === "compliant" ? "passed" : "blocked";
}

export function GovernanceDrill() {
  const [scenario, setScenario] = useState<Scenario>("compliant");
  return <GovernanceRun key={scenario} scenario={scenario} onScenario={setScenario} />;
}

function GovernanceRun({ scenario, onScenario }: { scenario: Scenario; onScenario: (s: Scenario) => void }) {
  const script = SCRIPTS[scenario];
  const durations = DURATIONS[scenario];
  const { ref, index, active, held, go, restart, toggle } = usePlayback<HTMLDivElement>({
    durations,
    loop: false,
    holdAt: scenario === "compliant" ? [APPROVAL_STEP] : [],
  });
  const step = script.steps[index];
  const resolved = (id: CheckId) => index > CHECKS.findIndex((c) => c.id === id);

  const headState: RunState =
    index === script.steps.length - 1
      ? scenario === "compliant"
        ? "passed"
        : "blocked"
      : held
        ? "waiting"
        : "running";

  return (
    <div ref={ref}>
      <Panel
        title={
          <>
            <StatusDot state={headState} />
            <span>governance</span>
            <span aria-hidden className="text-line-strong">/</span>
            <span className={cx("truncate", headState === "waiting" ? "text-warn" : headState === "blocked" ? "text-danger" : "text-fg")}>
              {step.label}
            </span>
          </>
        }
        actions={<PlaybackControls active={active} onToggle={toggle} onRestart={restart} label="governance drill" />}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-3.5 py-2.5">
          <div role="radiogroup" aria-label="Change set" className="inline-flex rounded-md border border-line bg-canvas p-0.5 font-mono text-[11px]">
            {(["compliant", "violating"] as const).map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={scenario === s}
                onClick={() => onScenario(s)}
                className={cx(
                  "rounded px-2.5 py-1 transition-colors",
                  scenario === s ? "bg-raised text-fg" : "text-subtle hover:text-fg",
                )}
              >
                {s} change
              </button>
            ))}
          </div>
          <p className="font-mono text-[10.5px] text-subtle">
            task scope <span className="text-muted">services/billing/** · tests/billing/**</span>
          </p>
        </div>

        <div className="grid md:grid-cols-[1.1fr_1fr]">
          <div role="group" aria-label="Proposed diff" className="overflow-x-auto whitespace-pre bg-canvas/60 py-3 font-mono text-[11px] leading-[20px]">
            {script.diff.map((line, i) => {
              const flagged = line.flag && resolved(line.flag);
              return (
                <div
                  key={i}
                  className={cx(
                    "px-3.5 transition-colors duration-300",
                    line.file && "mt-1.5 first:mt-0",
                    flagged ? "bg-danger/[0.08] text-danger" : line.file ? "text-muted" : "text-subtle",
                  )}
                >
                  {line.file ? (
                    <span className={cx(flagged ? "text-danger" : "text-fg")}>{line.text}</span>
                  ) : (
                    <>
                      <span className={cx("mr-2", flagged ? "text-danger" : "text-accent/70")}>+</span>
                      {line.text}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-line md:border-l md:border-t-0">
            <ul className="divide-y divide-line">
              {CHECKS.map((check, i) => {
                const state = checkState(scenario, i, index);
                return (
                  <li key={check.id} className="flex items-start gap-2.5 px-3.5 py-2.5">
                    <StatusDot state={state} className="mt-[5px]" />
                    <div className="min-w-0">
                      <p className="text-[13px] leading-4 text-fg">{check.name}</p>
                      <p className={cx("mt-1 truncate font-mono text-[10.5px] leading-4", stateText[state])}>
                        {state === "idle" ? "queued" : state === "running" ? "checking…" : script.verdicts[check.id]}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <Gate scenario={scenario} index={index} onApprove={() => go(APPROVAL_STEP + 1)} />
          </div>
        </div>

        <div className="border-t border-line px-3.5 pb-3 pt-1.5">
          <div className="flex items-center gap-3">
            <p className="shrink-0 font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Audit trail</p>
            <Scrubber steps={script.steps.map((s) => s.label)} index={index} onSelect={go} className="flex-1" />
          </div>
          <LogTail lines={script.steps} index={index} className="mt-1.5" />
        </div>
      </Panel>
    </div>
  );
}

const DURATIONS: Record<Scenario, number[]> = {
  compliant: SCRIPTS.compliant.steps.map((s) => s.ms),
  violating: SCRIPTS.violating.steps.map((s) => s.ms),
};

function Gate({ scenario, index, onApprove }: { scenario: Scenario; index: number; onApprove: () => void }) {
  const base = "border-t border-line px-3.5 py-3";

  if (scenario === "violating") {
    const blocked = index >= APPROVAL_STEP;
    return (
      <div className={cx(base, blocked && "bg-danger/[0.05]")}>
        <p className="flex items-center gap-2 text-[13px] text-fg">
          <StatusDot state={blocked ? "blocked" : "idle"} />
          Approval gate
        </p>
        <p className={cx("mt-1 pl-3.5 text-[12.5px] leading-snug", blocked ? "text-danger" : "text-subtle")}>
          {blocked ? "Not requested — change returned to the agent with 4 findings." : "Opens only after every guardrail passes."}
        </p>
      </div>
    );
  }

  if (index < APPROVAL_STEP) {
    return (
      <div className={base}>
        <p className="flex items-center gap-2 text-[13px] text-fg">
          <StatusDot state="idle" />
          Approval gate
        </p>
        <p className="mt-1 pl-3.5 text-[12.5px] text-subtle">Opens only after every guardrail passes.</p>
      </div>
    );
  }

  if (index === APPROVAL_STEP) {
    return (
      <div className={cx(base, "bg-warn/[0.05]")}>
        <p className="flex items-center gap-2 text-[13px] text-warn">
          <StatusDot state="waiting" />
          Approval required
        </p>
        <p className="mt-1 pl-3.5 text-[12.5px] leading-snug text-muted">
          Guardrails passed. A person signs off before a pull request is opened — you, in this case.
        </p>
        <button
          type="button"
          onClick={onApprove}
          className="ml-3.5 mt-2.5 inline-flex h-8 items-center rounded-md bg-fg px-3 text-[12.5px] font-medium text-canvas transition-colors hover:bg-white"
        >
          Approve change
        </button>
      </div>
    );
  }

  const opened = index > APPROVAL_STEP + 1;
  return (
    <div className={base}>
      <p className="flex items-center gap-2 text-[13px] text-fg">
        <StatusDot state={opened ? "passed" : "running"} />
        {opened ? "Pull request opened" : "Approved"}
      </p>
      <p className="mt-1 pl-3.5 text-[12.5px] text-subtle">
        {opened ? "Branch pushed and PR created through the GitHub App." : "Approval record written to the activity ledger."}
      </p>
    </div>
  );
}
