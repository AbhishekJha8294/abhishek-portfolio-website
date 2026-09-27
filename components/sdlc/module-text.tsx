import type { SdlcModule } from "@/content/sdlc";

export function ModuleText({ module }: { module: SdlcModule }) {
  return (
    <div>
      <p className="text-balance text-2xl font-medium leading-tight tracking-[-0.025em] text-fg sm:text-[28px]">
        {module.kicker}
      </p>
      <p className="mt-4 text-pretty text-[15px] leading-relaxed text-muted">{module.description}</p>
      <dl className="mt-8 divide-y divide-line border-y border-line">
        {module.primitives.map((p) => (
          <div key={p.name} className="grid gap-1 py-3 sm:grid-cols-[150px_1fr] sm:gap-4">
            <dt className="font-mono text-[12px] leading-5 text-fg">{p.name}</dt>
            <dd className="text-[13.5px] leading-5 text-muted">{p.text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
