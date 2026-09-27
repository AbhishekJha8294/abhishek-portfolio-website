import { sdlc } from "@/content/sdlc";
import { cx } from "@/lib/cx";

const planeLabel = {
  record: "versioned",
  model: "model",
  runtime: "runtime",
  human: "human gate",
} as const;

/** Requirement → pull request, annotated with which plane owns each step. */
export function Lifecycle() {
  return (
    <ol aria-label="Delivery lifecycle" className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-7">
      {sdlc.lifecycle.map((step, i) => (
        <li key={step.label} className="relative bg-canvas px-4 py-4 last:col-span-2 md:last:col-span-1">
          <span className="font-mono text-[10.5px] text-subtle">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-2 text-[15px] font-medium tracking-[-0.01em] text-fg">{step.label}</p>
          <p
            className={cx(
              "mt-1 font-mono text-[10.5px]",
              step.plane === "human" && "text-warn",
              step.plane === "model" && "text-muted",
              (step.plane === "runtime" || step.plane === "record") && "text-subtle",
            )}
          >
            {planeLabel[step.plane]}
          </p>
          {i < sdlc.lifecycle.length - 1 && (
            <span aria-hidden className="absolute right-0 top-1/2 hidden h-px w-3 translate-x-1/2 bg-line-strong md:block" />
          )}
        </li>
      ))}
    </ol>
  );
}
