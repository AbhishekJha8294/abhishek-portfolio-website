import type { SdlcModule } from "@/content/sdlc";
import { drills } from "./drills";
import { ModuleText } from "./module-text";

/** All modules stacked — used on the case-study page. */
export function ModuleStack({ modules }: { modules: readonly SdlcModule[] }) {
  return (
    <div className="space-y-24">
      {modules.map((mod) => {
        const Drill = drills[mod.id];
        return (
          <article key={mod.id} aria-labelledby={`module-${mod.id}`} className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
            <div>
              <p className="font-mono text-[11px] text-accent">{mod.index}</p>
              <h3 id={`module-${mod.id}`} className="mt-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-subtle">
                {mod.title}
              </h3>
              <div className="mt-5">
                <ModuleText module={mod} />
              </div>
            </div>
            <Drill />
          </article>
        );
      })}
    </div>
  );
}
