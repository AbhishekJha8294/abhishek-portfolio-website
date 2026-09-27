import { cx } from "@/lib/cx";

/*
 * Layered architecture of the platform. Built from real HTML so it reflows
 * on narrow screens and stays readable to assistive technology.
 */

type Box = { title: string; items?: string[]; tone?: "solid" | "dashed" | "gate" | "accent"; note?: string };
type Layer = { label: string; boxes: Box[]; link?: string };

const LAYERS: Layer[] = [
  {
    label: "Interface",
    boxes: [
      { title: "Mission Control", items: ["Vue 3", "TypeScript", "Element Plus", "~25 views"], tone: "solid" },
      { title: "Identity", items: ["Firebase Auth"], tone: "solid" },
    ],
    link: "REST · ~190 endpoints",
  },
  {
    label: "API",
    boxes: [{ title: "Platform API", items: ["FastAPI", "SQLAlchemy 2 async", "Tenant isolation"], tone: "solid" }],
  },
  {
    label: "Orchestration",
    boxes: [
      { title: "Execution plane", note: "deterministic", items: ["Scheduler", "Leases", "DAG", "Checkpoints", "Pause · Resume · Replay · Fork"], tone: "solid" },
      { title: "Intelligence plane", note: "probabilistic", items: ["Planning", "Implementation", "Tiered routing", "Ranked repo context"], tone: "dashed" },
    ],
  },
  {
    label: "Governance",
    boxes: [
      { title: "Guardrails", items: ["File scope", "Secret detection", "DB credentials", "Architecture contracts", "Drift detection"], tone: "solid" },
      { title: "Approval gate", items: ["Approval records", "Activity ledger"], tone: "gate" },
    ],
  },
  {
    label: "State & integrations",
    boxes: [
      { title: "PostgreSQL", items: ["Versioned documents", "Run state", "Alembic migrations"], tone: "solid" },
      { title: "GitHub App API", items: ["Repositories", "Branches", "Pull requests"], tone: "accent" },
      { title: "OpenAI API", items: ["Model calls", "Spend telemetry"], tone: "dashed" },
    ],
  },
  {
    label: "Infrastructure",
    boxes: [
      { title: "AWS", items: ["Docker → ECR", "ECS Fargate", "ALB", "RDS"], tone: "solid" },
      { title: "CI/CD & testing", items: ["GitHub Actions", "Pytest", "Vitest", "Playwright"], tone: "solid" },
    ],
  },
];

const toneClass = {
  solid: "border border-line-strong bg-panel",
  dashed: "border border-dashed border-line-strong",
  gate: "border border-warn/40 bg-warn/[0.04]",
  accent: "border border-accent/30 bg-accent/[0.04]",
} as const;

export function Architecture() {
  return (
    <ol aria-label="Platform architecture, top to bottom" className="list-none">
      {LAYERS.map((layer, i) => (
        <li key={layer.label}>
          <div className="grid gap-3 md:grid-cols-[160px_1fr] md:gap-6">
            <p className="pt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle md:pt-4">
              <span className="text-accent/80">{String(i + 1).padStart(2, "0")}</span> {layer.label}
            </p>
            <div className={cx("grid gap-3", layer.boxes.length === 2 && "sm:grid-cols-2", layer.boxes.length === 3 && "sm:grid-cols-3")}>
              {layer.boxes.map((box) => (
                <div key={box.title} className={cx("rounded-lg px-4 py-3.5", toneClass[box.tone ?? "solid"])}>
                  <p className="flex items-baseline justify-between gap-3 text-[14px] font-medium text-fg">
                    {box.title}
                    {box.note && <span className="font-mono text-[10.5px] font-normal text-subtle">{box.note}</span>}
                  </p>
                  {box.items && (
                    <p className="mt-1.5 font-mono text-[11px] leading-5 text-muted">{box.items.join("  ·  ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
          {i < LAYERS.length - 1 && (
            <div aria-hidden className="grid md:grid-cols-[160px_1fr] md:gap-6">
              <span />
              <div className="flex h-8 items-center gap-3 pl-6">
                <span className="h-full w-px bg-line-strong" />
                {layer.link && <span className="font-mono text-[10.5px] text-subtle">{layer.link}</span>}
              </div>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
