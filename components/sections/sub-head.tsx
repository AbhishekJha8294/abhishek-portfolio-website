import { cx } from "@/lib/cx";

/** Heading inside a section — smaller than a SectionHeader, same rhythm. */
export function SubHead({ label, title, text, className }: { label: string; title?: string; text?: string; className?: string }) {
  return (
    <div className={cx("mb-8 max-w-2xl", className)}>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-subtle">{label}</p>
      {title && <h3 className="mt-3 text-balance text-[clamp(1.5rem,2.8vw,2rem)] font-medium leading-tight tracking-[-0.03em]">{title}</h3>}
      {text && <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted">{text}</p>}
    </div>
  );
}
