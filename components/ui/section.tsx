import { cx } from "@/lib/cx";
import { Container } from "./container";

type HeaderProps = {
  id: string;
  index?: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ id, index, label, title, lede, className }: HeaderProps) {
  return (
    <header className={cx("max-w-3xl", className)}>
      <p className="flex items-center gap-3 font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-subtle">
        {index && <span className="text-accent">{index}</span>}
        {index && <span aria-hidden className="h-px w-8 bg-line-strong" />}
        <span>{label}</span>
      </p>
      <h2
        id={`${id}-title`}
        className="mt-6 text-balance text-[clamp(2rem,4.4vw,3.25rem)] font-medium leading-[1.04] tracking-[-0.035em]"
      >
        {title}
      </h2>
      {lede && <p className="mt-5 max-w-2xl text-pretty text-[17px] leading-relaxed text-muted">{lede}</p>}
    </header>
  );
}

type SectionProps = HeaderProps & { children: React.ReactNode };

export function Section({ children, className, ...header }: SectionProps) {
  return (
    <section id={header.id} aria-labelledby={`${header.id}-title`} className={cx("border-t border-line py-24 sm:py-32", className)}>
      <Container>
        <SectionHeader {...header} />
        {children}
      </Container>
    </section>
  );
}
