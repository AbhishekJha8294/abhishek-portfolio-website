"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import { cx } from "@/lib/cx";

export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <div className={cx("inline-flex max-w-full items-stretch rounded-lg border border-line bg-panel", className)}>
      <a
        href={`mailto:${email}`}
        className="flex h-10 min-w-0 items-center gap-2.5 px-3.5 font-mono text-[13px] text-fg transition-colors hover:text-accent"
      >
        <Mail aria-hidden className="size-3.5 shrink-0 text-subtle" />
        <span className="truncate">{email}</span>
      </a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        className="grid w-10 shrink-0 place-items-center border-l border-line text-subtle transition-colors hover:text-fg"
      >
        {copied ? <Check aria-hidden className="size-3.5 text-accent" /> : <Copy aria-hidden className="size-3.5" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </div>
  );
}
