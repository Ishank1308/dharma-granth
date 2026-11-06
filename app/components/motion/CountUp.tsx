'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { usePerformanceMode } from '@/lib/performance-mode';

type CountUpProps = {
  /** Final value to display. */
  value: number;
  /**
   * Number grouping. A string preset — never a function — because Server
   * Components cannot pass functions to Client Components.
   */
  format?: 'plain' | 'en-IN';
  /** Animation length in seconds. */
  duration?: number;
  className?: string;
};

const EN_IN = new Intl.NumberFormat('en-IN');

function formatValue(n: number, format: 'plain' | 'en-IN'): string {
  return format === 'en-IN' ? EN_IN.format(n) : String(n);
}

/**
 * Animated count-up that settles on `value` the first time it scrolls into
 * view. Server-rendered (and reduced-motion / lite-mode) output is the final
 * value, so crawlers, readers and no-JS users always see the true number;
 * only capable clients replay 0 → value as the stat enters the viewport.
 */
export function CountUp({ value, format = 'en-IN', duration = 1.4, className }: CountUpProps) {
  const reduce = useReducedMotion();
  const { isLiteMode } = usePerformanceMode();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-32px' });
  const [display, setDisplay] = useState(() => formatValue(value, format));

  useEffect(() => {
    if (!inView || reduce || isLiteMode) {
      setDisplay(formatValue(value, format));
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 4);
      setDisplay(formatValue(Math.round(value * eased), format));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, isLiteMode, value, format, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
