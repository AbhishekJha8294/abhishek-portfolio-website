import { Pause, Play, RotateCcw } from "lucide-react";
import { cx } from "@/lib/cx";

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-7 place-items-center rounded-md text-subtle transition-colors hover:bg-raised hover:text-fg"
    >
      {children}
    </button>
  );
}

export function PlaybackControls({
  active,
  onToggle,
  onRestart,
  label,
}: {
  active: boolean;
  onToggle: () => void;
  onRestart: () => void;
  label: string;
}) {
  return (
    <>
      <IconButton label={active ? `Pause ${label}` : `Play ${label}`} onClick={onToggle}>
        {active ? <Pause aria-hidden className="size-3.5" /> : <Play aria-hidden className="size-3.5" />}
      </IconButton>
      <IconButton label={`Replay ${label}`} onClick={onRestart}>
        <RotateCcw aria-hidden className="size-3.5" />
      </IconButton>
    </>
  );
}

/** Segmented progress that doubles as a step selector. */
export function Scrubber({
  steps,
  index,
  onSelect,
  className,
}: {
  steps: readonly string[];
  index: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <ol className={cx("flex items-center gap-1", className)} aria-label="Steps">
      {steps.map((step, i) => (
        <li key={i} className="flex-1">
          <button
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Step ${i + 1}: ${step}`}
            aria-current={i === index ? "step" : undefined}
            className="group flex h-6 w-full items-center"
          >
            <span
              className={cx(
                "h-[3px] w-full rounded-full transition-colors duration-300",
                i < index && "bg-subtle/60",
                i === index && "bg-accent",
                i > index && "bg-line-strong group-hover:bg-subtle/40",
              )}
            />
          </button>
        </li>
      ))}
    </ol>
  );
}
