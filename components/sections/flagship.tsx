import { ArrowUpRight } from "lucide-react";
import { sdlc } from "@/content/sdlc";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { StatusDot } from "@/components/ui/status-dot";
import { GitHubCard, RepoIntelCard, TraceabilityCard } from "@/components/sdlc/capability-cards";
import { Lifecycle } from "@/components/sdlc/lifecycle";
import { ModuleTabs } from "@/components/sdlc/module-tabs";
import { Planes } from "@/components/sdlc/planes";
import { SubHead } from "./sub-head";

export function FlagshipIntro({ as: Heading = "h2", id }: { as?: "h1" | "h2"; id: string }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end lg:gap-16">
      <header className="max-w-3xl">
        <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-subtle">
          <StatusDot state="running" />
          <span>Flagship system</span>
          <span aria-hidden className="text-line-strong">·</span>
          <span>{sdlc.org}</span>
        </p>
        <Heading id={id} className="mt-6 text-balance text-[clamp(2.25rem,5vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.04em]">
          {sdlc.name}
        </Heading>
        <p className="mt-5 text-balance text-[clamp(1.25rem,2.3vw,1.6rem)] leading-snug tracking-[-0.02em] text-fg/85">
          {sdlc.positioning}
        </p>
        <p className="mt-5 max-w-2xl text-pretty text-[16px] leading-relaxed text-muted">{sdlc.summary}</p>
        <p className="mt-6 font-mono text-[12px] text-subtle">
          {sdlc.role} <span className="text-line-strong">·</span> {sdlc.period}
        </p>
      </header>
      <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-1">
        {sdlc.metrics.map((m) => (
          <div key={m.label} className="bg-panel px-4 py-4 sm:px-5">
            <dt className="sr-only">{m.label}</dt>
            <dd className="text-[26px] font-medium leading-none tracking-[-0.03em] tabular-nums sm:text-[30px]">{m.value}</dd>
            <dd aria-hidden className="mt-2 font-mono text-[11px] leading-tight text-subtle">
              {m.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Flagship() {
  return (
    <section id="agentic-sdlc" aria-labelledby="agentic-sdlc-title" className="border-t border-line py-24 sm:py-32">
      <Container>
        <FlagshipIntro id="agentic-sdlc-title" />

        <div className="mt-20">
          <SubHead
            label="Architecture"
            title="The model proposes. The runtime decides."
            text="The deterministic execution plane is separated from the LLM intelligence plane — so ordering, state, retries and permissions don't depend on a model behaving."
          />
          <Planes />
          <div className="mt-4">
            <Lifecycle />
          </div>
        </div>

        <div className="mt-24">
          <SubHead label="Inside the platform" title="Three systems that make agents shippable." />
          <ModuleTabs modules={sdlc.modules} />
        </div>

        <div className="mt-24 grid gap-4 lg:grid-cols-3">
          <TraceabilityCard />
          <RepoIntelCard />
          <GitHubCard />
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[14px] leading-relaxed text-muted">
            Python · FastAPI · SQLAlchemy 2 async · PostgreSQL · Vue 3 · AWS ECS Fargate · GitHub Actions — full stack,
            architecture and infrastructure in the case study.
          </p>
          <ButtonLink href={`/systems/${sdlc.slug}`} variant="secondary" className="shrink-0 self-start sm:self-auto">
            Read the case study
            <ArrowUpRight aria-hidden className="size-4" />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
