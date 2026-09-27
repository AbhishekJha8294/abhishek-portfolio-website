"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

type Options = {
  /** How long each frame is held, in ms. Keep the array module-level so it is stable. */
  durations: readonly number[];
  loop?: boolean;
  /** Frames at which playback waits for the viewer (e.g. a human approval gate). */
  holdAt?: readonly number[];
  /** Frame shown to reduced-motion viewers until they interact. Defaults to the last. */
  staticIndex?: number;
};

/**
 * Deterministic frame playback for the system visualizations.
 *
 * - Advances only while the element is on screen.
 * - Honors prefers-reduced-motion: renders a static, fully-labelled frame
 *   and never autoplays; viewers can still step or press play.
 * - Pauses at `holdAt` frames until something calls `go()`.
 */
export function usePlayback<T extends Element = HTMLDivElement>({
  durations,
  loop = true,
  holdAt = [],
  staticIndex,
}: Options) {
  const length = durations.length;
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reduced = usePrefersReducedMotion();

  const [frame, setFrame] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touched, setTouched] = useState(false);

  // Reduced-motion viewers see a finished state until they choose otherwise.
  const index = reduced && !touched ? (staticIndex ?? length - 1) : Math.min(frame, length - 1);
  const active = !paused && (!reduced || touched);
  const atEnd = index >= length - 1;
  const held = holdAt.includes(index);
  const ticking = active && inView && !held && !(atEnd && !loop);

  useEffect(() => {
    if (!ticking) return;
    const t = window.setTimeout(() => {
      setFrame((f) => (f + 1 >= length ? (loop ? 0 : f) : f + 1));
    }, durations[index]);
    return () => window.clearTimeout(t);
  }, [ticking, index, durations, length, loop]);

  const go = useCallback(
    (i: number) => {
      // Stepping manually under reduced motion must not start autoplay.
      if (reduced && !touched) setPaused(true);
      setTouched(true);
      setFrame(Math.max(0, Math.min(i, length - 1)));
    },
    [length, reduced, touched],
  );

  const restart = useCallback(() => {
    setTouched(true);
    setPaused(false);
    setFrame(0);
  }, []);

  const toggle = useCallback(() => {
    setTouched(true);
    if (!active) {
      setPaused(false);
      if (atEnd && !loop) setFrame(0);
      if (reduced && !touched) setFrame(0);
      return;
    }
    setPaused(true);
  }, [active, atEnd, loop, reduced, touched]);

  return { ref, index, active, held, reduced, go, restart, toggle };
}
