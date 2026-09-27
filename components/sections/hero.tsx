import { ArrowDown, FileText } from "lucide-react";
import { site } from "@/content/site";
import { hasResume } from "@/lib/resume";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CopyEmail } from "@/components/ui/copy-email";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";
import { PipelineGraph } from "@/components/viz/pipeline-graph";

export function Hero() {
  const resume = hasResume();

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div aria-hidden className="bg-grid mask-fade-hero pointer-events-none absolute inset-0" />
      <Container className="relative grid items-center gap-14 pb-20 pt-28 sm:pt-32 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] lg:gap-16 lg:pb-24 lg:pt-32">
        <div>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
            <span className="font-medium text-fg">{site.name}</span>
            <span aria-hidden className="h-3.5 w-px bg-line-strong" />
            <span className="text-muted">{site.role}</span>
          </p>

          <h1
            id="hero-title"
            className="mt-7 text-balance text-[clamp(2.6rem,6.2vw,4.6rem)] font-medium leading-[0.98] tracking-[-0.045em]"
          >
            {site.headline}
          </h1>

          <ul aria-label="Focus areas" className="mt-7 flex flex-wrap gap-x-2.5 gap-y-1.5 font-mono text-[12px] text-muted">
            {site.focusAreas.map((area, i) => (
              <li key={area} className="flex items-center gap-2.5">
                {i > 0 && <span aria-hidden className="text-line-strong">/</span>}
                {area}
              </li>
            ))}
          </ul>

          <p className="mt-7 max-w-xl text-pretty text-[17px] leading-relaxed text-muted">{site.lede}</p>

          <div className="mt-9 flex flex-wrap items-center gap-2.5">
            <ButtonLink href="#agentic-sdlc" variant="primary">
              Explore systems
              <ArrowDown aria-hidden className="size-4" />
            </ButtonLink>
            <ButtonLink href={site.github.href} external>
              <GitHubIcon className="size-4" />
              GitHub
            </ButtonLink>
            <ButtonLink href={site.linkedin.href} external>
              <LinkedInIcon className="size-[15px]" />
              LinkedIn
            </ButtonLink>
            {resume && (
              <ButtonLink href={site.resume.href} external>
                <FileText aria-hidden className="size-4" />
                Resume
              </ButtonLink>
            )}
          </div>

          <CopyEmail email={site.email} className="mt-4" />
        </div>

        <PipelineGraph />
      </Container>
    </section>
  );
}
