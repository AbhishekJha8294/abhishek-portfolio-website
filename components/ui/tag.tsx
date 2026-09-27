import { cx } from "@/lib/cx";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md border border-line bg-raised/50 px-2 py-0.5 font-mono text-[11px] leading-5 text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cx("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <li key={item}>
          <Tag>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cx("font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-subtle", className)}>
      {children}
    </p>
  );
}
