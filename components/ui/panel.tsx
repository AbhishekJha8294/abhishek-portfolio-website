import { cx } from "@/lib/cx";

type Props = {
  title: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

/** A framed instrument panel: mono title bar, optional controls, body. */
export function Panel({ title, actions, children, className, bodyClassName }: Props) {
  return (
    <div className={cx("overflow-hidden rounded-xl border border-line bg-panel", className)}>
      <div className="flex h-10 items-center gap-3 border-b border-line px-3.5 font-mono text-[11px] text-subtle">
        <div className="flex min-w-0 items-center gap-2 truncate">{title}</div>
        {actions && <div className="ml-auto flex shrink-0 items-center gap-0.5">{actions}</div>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
