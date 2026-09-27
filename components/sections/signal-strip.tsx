import { coreStack, signals } from "@/content/site";
import { Container } from "@/components/ui/container";

/** The 20-second scan: verified numbers, then the languages and platforms. */
export function SignalStrip() {
  return (
    <section aria-label="At a glance" className="border-t border-line">
      <Container>
        <div className="border-x border-line">
          <dl className="grid grid-cols-2 gap-px bg-line sm:grid-cols-3 lg:grid-cols-6">
            {signals.map((s) => (
              <div key={s.label} className="bg-canvas px-4 py-6 sm:px-5">
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-[28px] font-medium leading-none tracking-[-0.03em] tabular-nums text-fg">{s.value}</dd>
                <dd aria-hidden className="mt-2 text-[13px] text-muted">
                  {s.label}
                </dd>
                <dd className="mt-0.5 font-mono text-[10.5px] text-subtle">{s.source}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-col gap-3 border-t border-line px-4 py-4 sm:flex-row sm:items-center sm:gap-6 sm:px-5">
            <p className="shrink-0 font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">Works across</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12.5px] text-muted">
              {coreStack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
