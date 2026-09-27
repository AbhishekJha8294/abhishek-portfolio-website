/**
 * Agentic SDLC Platform — the flagship case study.
 * Shared by the home-page section and the /systems/agentic-sdlc deep dive.
 */

export type ModuleId = "runtime" | "governance" | "aiops";

export type Primitive = { name: string; text: string };

export type SdlcModule = {
  id: ModuleId;
  index: string;
  title: string;
  kicker: string;
  description: string;
  primitives: Primitive[];
};

export const sdlc = {
  slug: "agentic-sdlc",
  name: "Agentic SDLC Platform",
  org: "Sudo Programmer Inc.",
  role: "Founder & Senior Software / AI Platform Engineer",
  period: "2025 – Present",
  positioning: "AI agents that can ship software — without giving up human control.",
  summary:
    "A governed software-delivery platform. Agents take work from requirements through planning, implementation and testing to a GitHub pull request, while approval gates, guardrails, traceability and an audit trail keep humans in charge of what ships.",
  metrics: [
    { value: "~190", label: "REST endpoints" },
    { value: "700+", label: "automated tests" },
    { value: "~25", label: "Mission Control views" },
  ],
  lifecycle: [
    { label: "Requirement", plane: "record" },
    { label: "Plan", plane: "model" },
    { label: "Tasks", plane: "runtime" },
    { label: "Implement", plane: "model" },
    { label: "Test", plane: "runtime" },
    { label: "Approve", plane: "human" },
    { label: "Pull request", plane: "runtime" },
  ] as const,
  planes: [
    {
      kind: "Deterministic",
      title: "Execution plane",
      text: "Owns run state, ordering, leases, retries and recovery — in plain, testable code.",
      items: ["Scheduler", "Lease-based workers", "DAG orchestration", "Checkpoints", "Pause · Resume · Replay · Fork"],
    },
    {
      kind: "Probabilistic",
      title: "Intelligence plane",
      text: "Models plan and implement inside steps the execution plane schedules, meters and records.",
      items: ["Planning", "Implementation", "Tiered model routing", "Ranked repository context", "OpenAI API"],
    },
  ],
  modules: [
    {
      id: "runtime",
      index: "01",
      title: "Execution runtime",
      kicker: "Work that survives failure.",
      description:
        "A scheduler releases tasks from the DAG to workers that hold time-bound leases. Workers checkpoint as they go — so when one disappears, its lease expires and the task resumes elsewhere from the last checkpoint instead of starting over.",
      primitives: [
        { name: "Scheduler", text: "Releases tasks as their dependencies in the DAG are satisfied." },
        { name: "Leases", text: "Workers hold time-bound leases; expired leases return work to the queue." },
        { name: "DAG orchestration", text: "Independent tasks run in parallel; dependent tasks wait." },
        { name: "Checkpoints", text: "Progress is persisted, so recovery resumes rather than restarts." },
        { name: "Run control", text: "Pause, resume, replay and fork runs." },
      ],
    },
    {
      id: "governance",
      index: "02",
      title: "Governance",
      kicker: "Autonomy with boundaries.",
      description:
        "Every change an agent proposes passes deterministic guardrails before a person sees it, and a person approves before a pull request is opened. Each decision is written to the activity ledger.",
      primitives: [
        { name: "File scope", text: "Agents may only modify the files a task is scoped to." },
        { name: "Secret detection", text: "Credential-like literals are caught before they leave the run." },
        { name: "Raw DB credentials", text: "Inline database connection credentials are flagged." },
        { name: "Architecture contracts", text: "Project contracts are enforced; architecture drift is detected." },
        { name: "Approval gates & audit", text: "Approval records and an activity ledger for every decision." },
      ],
    },
    {
      id: "aiops",
      index: "03",
      title: "AI Ops",
      kicker: "Models are a budgeted dependency.",
      description:
        "Each step is routed to a model tier suited to the work, retried under explicit policies and metered against a per-run spend limit. Costs are estimated before a step runs — and a run that would cross its limit pauses automatically.",
      primitives: [
        { name: "Tiered routing", text: "Model tier chosen per step, not per platform." },
        { name: "Retry policies", text: "Transient failures retried under explicit, bounded policies." },
        { name: "Spend limits", text: "Per-run ceilings with cost estimation and automatic pause." },
        { name: "Telemetry", text: "AI Ops telemetry across calls, retries, tiers and spend." },
        { name: "Compare & replay", text: "Runs can be compared side by side and replayed." },
      ],
    },
  ] satisfies SdlcModule[],
  traceability: [
    { label: "Requirement", text: "Versioned document" },
    { label: "Task", text: "Planned from the requirement" },
    { label: "Artifact", text: "What the agent produced" },
    { label: "Test", text: "Linked to the artifact it verifies" },
  ],
  records: ["Versioned documents", "Approval records", "Activity ledger", "Tenant isolation"],
  repoIntelligence: {
    text: "Before an agent touches code, the platform maps the repository — then ranks what's relevant, so a model sees the right context rather than the whole tree.",
    steps: ["Symbol indexing", "Dependency indexing", "File ownership", "Test linking", "Ranked repository context"],
  },
  github: {
    text: "Repositories, branches and pull requests are driven through the GitHub App API — the last step of every approved run.",
    steps: ["Repositories", "Branches", "Pull requests"],
  },
  stack: [
    { layer: "API & runtime", items: ["Python", "FastAPI", "SQLAlchemy 2 (async)", "Alembic", "PostgreSQL"] },
    { layer: "Intelligence", items: ["OpenAI API"] },
    { layer: "Mission Control", items: ["Vue 3", "TypeScript", "Tailwind", "Element Plus", "Vite"] },
    { layer: "Identity", items: ["Firebase Auth"] },
    { layer: "Integrations", items: ["GitHub App API"] },
    { layer: "Infrastructure", items: ["Docker", "AWS ECS Fargate", "ALB", "ECR", "RDS", "GitHub Actions"] },
    { layer: "Testing", items: ["Pytest", "Vitest", "Playwright"] },
  ],
} as const;
