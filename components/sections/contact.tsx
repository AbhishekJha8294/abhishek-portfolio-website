import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { CopyEmail } from "@/components/ui/copy-email";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/icons";

export function Contact({ index = "05" }: { index?: string }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden border-t border-line py-28 sm:py-36">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_100%,#000_20%,transparent_100%)]" />
      <Container className="relative">
        <p className="flex items-center gap-3 font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-subtle">
          <span className="text-accent">{index}</span>
          <span aria-hidden className="h-px w-8 bg-line-strong" />
          <span>Contact</span>
        </p>
        <h2
          id="contact-title"
          className="mt-6 max-w-4xl text-balance text-[clamp(2.5rem,6.4vw,4.75rem)] font-medium leading-[0.98] tracking-[-0.045em]"
        >
          Have something difficult to build?
        </h2>
        <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-muted">
          I&apos;m most useful where AI meets production — agent runtimes, orchestration, guardrails, platform APIs and the
          infrastructure underneath. Email is the fastest way to reach me.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-2.5">
          <ButtonLink href={`mailto:${site.email}`} variant="primary">
            Start a conversation
            <ArrowUpRight aria-hidden className="size-4" />
          </ButtonLink>
          <ButtonLink href={site.linkedin.href} external>
            <LinkedInIcon className="size-[15px]" />
            LinkedIn
          </ButtonLink>
          <ButtonLink href={site.github.href} external>
            <GitHubIcon className="size-4" />
            GitHub
          </ButtonLink>
        </div>
        <CopyEmail email={site.email} className="mt-4" />
      </Container>
    </section>
  );
}
