import { sdlc } from "@/content/sdlc";
import { cx } from "@/lib/cx";

/**
 * The central architectural decision, drawn literally: a solid-bordered
 * deterministic plane and a dashed-bordered probabilistic one.
 */
export function Planes() {
  return (
    <div className="relative grid gap-4 md:grid-cols-2 md:gap-0">
      {sdlc.planes.map((plane, i) => {
        const deterministic = i === 0;
        return (
          <div
            key={plane.title}
            className={cx(
              "rounded-xl p-5 sm:p-6",
              deterministic ? "border border-line-strong bg-panel md:rounded-r-none" : "border border-dashed border-line-strong md:rounded-l-none md:border-l-0",
            )}
          >
            <p className={cx("font-mono text-[11px] uppercase tracking-[0.16em]", deterministic ? "text-accent" : "text-muted")}>
              {plane.kind}
            </p>
            <h3 className="mt-3 text-xl font-medium tracking-[-0.02em]">{plane.title}</h3>
            <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-muted">{plane.text}</p>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {plane.items.map((item) => (
                <li
                  key={item}
                  className={cx(
                    "rounded-md px-2 py-0.5 font-mono text-[11px] leading-5",
                    deterministic ? "border border-line-strong bg-raised text-fg" : "border border-dashed border-line-strong text-muted",
                  )}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
      <span
        aria-hidden
        className="absolute bottom-0 left-1/2 hidden -translate-x-1/2 translate-y-1/2 rounded-full border border-line-strong bg-canvas px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle md:block"
      >
        separated
      </span>
    </div>
  );
}
