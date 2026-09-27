"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navItems, site } from "@/content/site";
import { Container } from "@/components/ui/container";
import { Mark } from "@/components/ui/icons";
import { cx } from "@/lib/cx";

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Highlight the section currently in the middle of the viewport.
  useEffect(() => {
    if (!onHome) return;
    const targets = navItems.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setSectionId(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [onHome]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const current = onHome ? sectionId : pathname.startsWith("/systems/") ? "agentic-sdlc" : null;

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open ? "border-line bg-canvas/85 backdrop-blur-md" : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-14 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 text-[14px] font-medium tracking-[-0.01em] text-fg" onClick={() => setOpen(false)}>
          <Mark className="size-5 text-fg" />
          {site.shortName}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  aria-current={current === item.id ? "location" : undefined}
                  className={cx(
                    "rounded-md px-3 py-1.5 text-[13.5px] transition-colors",
                    current === item.id ? "text-fg" : "text-subtle hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`mailto:${site.email}`}
            className="hidden h-8 items-center rounded-md border border-line-strong px-3 text-[13px] text-fg transition-colors hover:bg-raised sm:inline-flex"
          >
            Email me
          </a>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
            className="grid size-9 place-items-center rounded-md text-muted transition-colors hover:text-fg md:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </Container>

      <nav id="mobile-nav" aria-label="Mobile" hidden={!open} className="border-t border-line md:hidden">
        <Container>
          <ul className="py-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-3 text-[17px] text-fg"
                >
                  {item.label}
                  <span className="font-mono text-[11px] text-subtle">#{item.id}</span>
                </Link>
              </li>
            ))}
            <li className="mt-2 border-t border-line pt-4">
              <a href={`mailto:${site.email}`} className="font-mono text-[13px] text-muted">
                {site.email}
              </a>
            </li>
          </ul>
        </Container>
      </nav>
    </header>
  );
}
