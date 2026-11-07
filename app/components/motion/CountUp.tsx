'use client';

import { useEffect, useRef, useState } from 'react';

const EN_IN = new Intl.NumberFormat('en-IN');

/**
 * A number that counts up to its value the first time it scrolls into view.
 *
 * The exported HTML, crawlers, no-JS readers and the first paint all get the final value; the
 * count only replays when the number enters the viewport after load, so a stat already on screen
 * never flashes back to zero. Reduced motion and the lite / low-power / data-saver modes skip it.
 * No animation library: one IntersectionObserver and a requestAnimationFrame loop.
 */
export function CountUp({ value, duration = 1400, className }: { value: number; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const root = document.documentElement;
    const quiet =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      root.hasAttribute('data-lite-mode') ||
      root.hasAttribute('data-low-power') ||
      root.hasAttribute('data-data-saver');
    if (quiet || value < 10) return;

    let raf = 0;
    let first = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasFirst = first;
        first = false;
        if (!entry.isIntersecting) return;
        observer.disconnect();
        // Already visible when the page loaded: leave the true number alone.
        if (wasFirst) return;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 4))));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      setShown(value);
    };
  }, [value, duration]);

  // Hold the final width, so the digits never push their neighbours while counting.
  return (
    <span
      ref={ref}
      className={className ? `apple-stat ${className}` : 'apple-stat'}
      style={{ display: 'inline-block', minWidth: `${EN_IN.format(value).length}ch` }}
    >
      {EN_IN.format(shown)}
    </span>
  );
}
