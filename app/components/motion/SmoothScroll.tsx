'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import { usePerformanceMode } from '@/lib/performance-mode';

/**
 * Buttery wheel scrolling (Lenis) for browse surfaces.
 *
 * - Dynamically imported so the initial-JS budget (scripts/check-js-budget)
 *   is untouched; the chunk loads idle, after first paint.
 * - Disabled under `prefers-reduced-motion`, in lite/data-saver mode, and on
 *   chapter/verse reading routes, where exact scroll position matters (verse
 *   deep links, reader focus mode) and native scrolling stays.
 * - Touch scrolling is always native (Lenis smooths wheel input only).
 */
export function SmoothScroll() {
  const reduce = useReducedMotion();
  const { isLiteMode } = usePerformanceMode();
  const pathname = usePathname();
  const isReadingRoute = pathname.includes('/chapter/') || pathname.includes('/verse/');

  useEffect(() => {
    if (reduce || isLiteMode || isReadingRoute) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;

    const start = () => {
      import('lenis')
        .then(({ default: Lenis }) => {
          if (disposed) return;
          const lenis = new Lenis({
            duration: 1.15,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            allowNestedScroll: true,
          });
          let raf = 0;
          const loop = (time: number) => {
            lenis.raf(time);
            raf = requestAnimationFrame(loop);
          };
          raf = requestAnimationFrame(loop);
          cleanup = () => {
            cancelAnimationFrame(raf);
            lenis.destroy();
          };
        })
        .catch(() => {});
    };

    // After first paint: never compete with LCP/hydration.
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(start, { timeout: 2500 });
      return () => {
        disposed = true;
        cancelIdleCallback(id);
        cleanup?.();
      };
    }
    const timer = window.setTimeout(start, 1200);
    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cleanup?.();
    };
  }, [reduce, isLiteMode, isReadingRoute]);

  return null;
}
