import { ArrowRight } from "lucide-react";
import { sdlc } from "@/content/sdlc";
import { GitHubIcon } from "@/components/ui/icons";
import { StatusDot } from "@/components/ui/status-dot";
import { Tag } from "@/components/ui/tag";

function Card({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <article className="flex flex-col rounded-xl border border-line bg-panel p-5 sm:p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</p>
      <h3 className="mt-3 text-lg font-medium tracking-[-0.02em]">{title}</h3>
      {children}
    </article>
  );
}

export function TraceabilityCard() {
  return (
    <Card label="Traceability" title="Every link is recorded.">
      <ol className="mb-5 mt-5">
        {sdlc.traceability.map((node, i) => (
          <li key={node.label} className="relative flex gap-3 pb-4 last:pb-0">
            {i < sdlc.traceability.length - 1 && <span aria-hidden className="absolute left-[2.5px] top-3 h-full w-px bg-line-strong" />}
            <StatusDot state="passed" className="mt-[7px]" />
            <div>
              <p className="text-[14px] text-fg">{node.label}</p>
              <p className="font-mono text-[11px] text-subtle">{node.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <ul className="mt-auto flex flex-wrap gap-1.5 border-t border-line pt-4">
        {sdlc.records.map((r) => (
          <li key={r}>
            <Tag>{r}</Tag>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export function RepoIntelCard() {
  const steps = sdlc.repoIntelligence.steps;
  return (
    <Card label="Repository intelligence" title="Context is engineered, not dumped.">
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{sdlc.repoIntelligence.text}</p>
      <ol className="mt-5 space-y-1.5 font-mono text-[12px]">
        {steps.map((step, i) => {
          const output = i === steps.length - 1;
          return (
            <li
              key={step}
              className={
                output
                  ? "flex items-center justify-between rounded-md border border-accent/30 bg-accent/[0.05] px-2.5 py-1.5 text-fg"
                  : "flex items-center justify-between rounded-md border border-line px-2.5 py-1.5 text-muted"
              }
            >
              <span>{step}</span>
              <span className={output ? "text-accent" : "text-subtle"}>{output ? "→ model" : String(i + 1).padStart(2, "0")}</span>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

export function GitHubCard() {
  return (
    <Card label="Delivery" title="Ends where engineers work.">
      <p className="mt-2 text-[14px] leading-relaxed text-muted">{sdlc.github.text}</p>
      <div className="mt-5 rounded-lg border border-line bg-canvas/60 p-4">
        <p className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <GitHubIcon className="size-3.5 text-fg" /> GitHub App API
        </p>
        <ol className="mt-3 flex flex-wrap items-center gap-1.5 font-mono text-[12px]">
          {sdlc.github.steps.map((step, i) => (
            <li key={step} className="flex items-center gap-1.5">
              <span className="rounded-md border border-line-strong bg-raised px-2 py-1 text-fg">{step}</span>
              {i < sdlc.github.steps.length - 1 && <ArrowRight aria-hidden className="size-3 text-subtle" />}
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}
