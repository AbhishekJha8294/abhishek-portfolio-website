import Link from "next/link";
import { cx } from "@/lib/cx";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-fg text-canvas hover:bg-white",
  secondary: "border border-line-strong bg-panel/60 text-fg hover:border-subtle/60 hover:bg-raised",
  ghost: "text-muted hover:text-fg",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function ButtonLink({ href, children, variant = "secondary", external, className, ...rest }: Props) {
  const classes = cx(
    "inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors duration-200",
    variants[variant],
    className,
  );

  // In-page anchors and mailto links are plain anchors; client routing adds nothing.
  if (href.startsWith("#") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}
