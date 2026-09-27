import { principles, qualities } from "@/content/principles";
import { Section } from "@/components/ui/section";
import { StatusDot, stateText } from "@/components/ui/status-dot";
import { cx } from "@/lib/cx";

export function Principles() {
  return (
    <Section id="approach" index="03" label="Approach" title="How I engineer AI systems.">
      <ol className="mt-14 border-t border-line">
        {principles.map((p, i) => (
          <li
            key={p.tag}
            className="grid gap-4 border-b border-line py-8 md:grid-cols-[40px_minmax(0,1.25fr)_minmax(0,1fr)] md:items-baseline md:gap-8 md:py-10"
          >
            <span className="font-mono text-[11px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-balance text-[clamp(1.75rem,3.6vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.04em]">
              <span className="text-fg">{p.statement[0]}</span> <span className="text-subtle">{p.statement[1]}</span>
            </p>
            <div>
              <p className={cx("flex items-center gap-2 font-mono text-[11px]", stateText[p.state])}>
                <StatusDot state={p.state} />
                {p.tag}
              </p>
              <p className="mt-2.5 max-w-sm text-pretty text-[15px] leading-relaxed text-muted">{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
      <ul aria-label="What that looks like in practice" className="mt-10 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] text-subtle">
        {qualities.map((q) => (
          <li key={q} className="flex items-center gap-2">
            <span aria-hidden className="size-1 rounded-full bg-line-strong" />
            {q}
          </li>
        ))}
      </ul>
    </Section>
  );
}
