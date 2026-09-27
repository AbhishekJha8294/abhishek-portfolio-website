import { systems, type System } from "@/content/systems";
import { Section } from "@/components/ui/section";
import { TagList } from "@/components/ui/tag";
import { cx } from "@/lib/cx";

function Improvement({ data }: { data: NonNullable<System["improvement"]> }) {
  const ratio = Math.max(data.afterHours / data.beforeHours, 0.006);
  return (
    <figure className="mt-6 rounded-lg border border-line bg-canvas/60 p-4">
      <figcaption className="font-mono text-[11px] text-subtle">{data.label}</figcaption>
      <div className="mt-3 space-y-2.5 font-mono text-[11.5px]">
        <div className="grid grid-cols-[48px_1fr_84px] items-center gap-3">
          <span className="text-subtle">before</span>
          <span className="h-1.5 rounded-full bg-subtle/40" />
          <span className="text-right text-muted">{data.before}</span>
        </div>
        <div className="grid grid-cols-[48px_1fr_84px] items-center gap-3">
          <span className="text-subtle">after</span>
          <span className="h-1.5">
            <span className="block h-full min-w-1.5 rounded-full bg-accent" style={{ width: `${ratio * 100}%` }} />
          </span>
          <span className="text-right text-accent">{data.after}</span>
        </div>
      </div>
    </figure>
  );
}

function SystemCard({ system }: { system: System }) {
  return (
    <article
      aria-labelledby={`sys-${system.id}`}
      className={cx(
        "flex flex-col rounded-xl border border-line bg-panel p-5 transition-colors duration-300 hover:border-line-strong sm:p-7",
        system.wide && "md:col-span-2 md:grid md:grid-cols-2 md:gap-x-12",
      )}
    >
      <div>
        <p className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-subtle">
          <span>
            {system.code} <span className="text-line-strong">·</span> {system.domain}
          </span>
          {system.org && <span className="text-muted">{system.org}</span>}
        </p>
        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 id={`sys-${system.id}`} className="text-[22px] font-medium leading-tight tracking-[-0.025em] sm:text-2xl">
              {system.name}
            </h3>
            {system.role && <p className="mt-1.5 text-[13px] text-subtle">{system.role}</p>}
          </div>
          {system.metric && (
            <p className="shrink-0 text-right">
              <span className="block text-[26px] font-medium leading-none tracking-[-0.03em] tabular-nums sm:text-[30px]">
                {system.metric.value}
              </span>
              <span className="mt-1.5 block font-mono text-[11px] text-subtle">{system.metric.label}</span>
            </p>
          )}
        </div>
        <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted">{system.summary}</p>
        {system.improvement && <Improvement data={system.improvement} />}
      </div>

      <dl className={cx("mt-auto space-y-3 pt-7", system.wide && "md:mt-0 md:pt-0")}>
        {system.groups.map((g) => (
          <div key={g.label} className="grid gap-2 sm:grid-cols-[88px_1fr] sm:gap-3">
            <dt className="pt-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">{g.label}</dt>
            <dd>
              <TagList items={g.items} />
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

export function Systems() {
  return (
    <Section
      id="systems"
      index="02"
      label="Systems"
      title="Shipped to real users."
      lede="Beyond the flagship — an AI product, a multi-tenant SaaS platform, healthcare data systems and enterprise microservices."
    >
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {systems.map((s) => (
          <SystemCard key={s.id} system={s} />
        ))}
      </div>
    </Section>
  );
}
