"use client";

import { useId, useRef, useState } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "motion/react";
import type { ModuleId, SdlcModule } from "@/content/sdlc";
import { cx } from "@/lib/cx";
import { drills } from "./drills";
import { ModuleText } from "./module-text";

/** Tabbed modules on the home page. Only the active drill is mounted. */
export function ModuleTabs({ modules }: { modules: readonly SdlcModule[] }) {
  const [active, setActive] = useState<ModuleId>(modules[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();
  const current = modules.find((mod) => mod.id === active) ?? modules[0];
  const Drill = drills[current.id];

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const last = modules.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(modules[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        <div role="tablist" aria-label="Platform modules" className="grid grid-cols-3 border-b border-line">
          {modules.map((mod, i) => {
            const selected = mod.id === active;
            return (
              <button
                key={mod.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`${uid}-tab-${mod.id}`}
                aria-selected={selected}
                aria-controls={`${uid}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(mod.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className="group relative pb-4 pr-3 text-left"
              >
                <span className={cx("font-mono text-[11px]", selected ? "text-accent" : "text-subtle")}>{mod.index}</span>
                <span
                  className={cx(
                    "mt-1.5 block text-[15px] font-medium leading-tight tracking-[-0.015em] transition-colors sm:text-lg",
                    selected ? "text-fg" : "text-subtle group-hover:text-muted",
                  )}
                >
                  {mod.title}
                </span>
                <span className="mt-1 hidden text-[13px] text-subtle md:block">{mod.kicker}</span>
                {selected && (
                  <m.span
                    layoutId={`${uid}-indicator`}
                    className="absolute inset-x-0 -bottom-px h-px bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.id}
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${current.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14"
          >
            <ModuleText module={current} />
            <Drill />
          </m.div>
        </AnimatePresence>
      </LazyMotion>
    </MotionConfig>
  );
}
