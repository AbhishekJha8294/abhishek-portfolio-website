import { cx } from "@/lib/cx";

export type LogLine = { text: string; tone?: "accent" | "warn" | "danger" };

const toneClass = { accent: "text-accent", warn: "text-warn", danger: "text-danger" } as const;

/**
 * The last few lines of an event stream up to `index`.
 * Keys are frame indexes, so only the newest line animates in.
 */
export function LogTail({ lines, index, count = 3, className }: { lines: readonly LogLine[]; index: number; count?: number; className?: string }) {
  return (
    <ol aria-hidden className={cx("list-none font-mono text-[11px] leading-[18px]", className)} style={{ minHeight: count * 18 }}>
      {lines.map((line, i) =>
        i > index || i <= index - count ? null : (
          <li key={i} className={cx("flex gap-3 whitespace-pre", i === index ? "animate-rise text-fg" : "text-subtle")}>
            <span className="text-subtle/60">{String(i + 1).padStart(2, "0")}</span>
            <span className={cx("overflow-hidden text-ellipsis", i === index && line.tone && toneClass[line.tone])}>{line.text}</span>
          </li>
        ),
      )}
    </ol>
  );
}
