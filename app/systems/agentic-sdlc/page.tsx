import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { sdlc } from "@/content/sdlc";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section";
import { Architecture } from "@/components/sdlc/architecture";
import { GitHubCard, RepoIntelCard, TraceabilityCard } from "@/components/sdlc/capability-cards";
import { Lifecycle } from "@/components/sdlc/lifecycle";
import { ModuleStack } from "@/components/sdlc/module-stack";
import { Planes } from "@/components/sdlc/planes";
import { StackTable } from "@/components/sdlc/stack-table";
import { Contact } from "@/components/sections/contact";
import { FlagshipIntro } from "@/components/sections/flagship";

const path = `/systems/${sdlc.slug}`;

export const metadata: Metadata = {
  title: `${sdlc.name} — case study`,
  description: `${sdlc.positioning} ${sdlc.summary}`,
  alternates: { canonical: path },
  openGraph: { type: "article", url: path, title: `${sdlc.name} — case study`, description: sdlc.positioning },
};

function Block({ id, index, label, title, lede, children }: { id: string; index: string; label: string; title: string; lede?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line py-20 sm:py-28">
      <Container>
        <SectionHeader id={id} index={index} label={label} title={title} lede={lede} />
        <div className="mt-12">{children}</div>
      </Container>
    </section>
  );
}

export default function AgenticSdlcPage() {
  return (
    <>
      <section className="relative overflow-hidden pb-20 pt-28 sm:pb-28 sm:pt-32">
        <div aria-hidden className="bg-grid mask-fade-hero pointer-events-none absolute inset-0" />
        <Container className="relative">
          <Link href="/#agentic-sdlc" className="inline-flex items-center gap-2 font-mono text-[12px] text-subtle transition-colors hover:text-fg">
            <ArrowLeft aria-hidden className="size-3.5" />
            Back to overview
          </Link>
          <div className="mt-10">
            <FlagshipIntro as="h1" id="case-study-title" />
          </div>
        </Container>
      </section>

      <Block
        id="thesis"
        index="01"
        label="Thesis"
        title="Generating code is the easy part."
        lede="Shipping software needs what production systems have always needed — scheduling, recovery, permissions, cost ceilings, review and an audit trail. The platform treats agents as workers inside that system, not as the system."
      >
        <Planes />
        <div className="mt-4">
          <Lifecycle />
        </div>
      </Block>

      <Block
        id="architecture"
        index="02"
        label="Architecture"
        title="Layered so the model is never the control plane."
        lede="From Mission Control down to AWS. Solid boxes are deterministic; dashed boxes are probabilistic; the amber gate is where a person decides."
      >
        <Architecture />
      </Block>

      <Block id="modules" index="03" label="Modules" title="Runtime, governance, AI Ops." lede="Each drill below is a simulation of the behaviour — press play, step through it, or approve the change yourself.">
        <ModuleStack modules={sdlc.modules} />
      </Block>

      <Block id="context" index="04" label="Context & delivery" title="From repository map to pull request.">
        <div className="grid gap-4 lg:grid-cols-3">
          <RepoIntelCard />
          <TraceabilityCard />
          <GitHubCard />
        </div>
      </Block>

      <Block
        id="stack"
        index="05"
        label="Stack"
        title="Built end to end."
        lede="API, runtime, Mission Control UI, infrastructure and CI/CD — with 700+ automated tests across Pytest, Vitest and Playwright."
      >
        <StackTable />
      </Block>

      <Contact index="06" />
    </>
  );
}
