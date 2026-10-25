'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Per-route fade-in wrapper plus a brief shimmer sweep across the
 * top of the viewport.
 *
 * Design notes:
 *
 * - We do NOT use AnimatePresence + mode="wait" here. That pattern
 *   defers rendering the new route until the previous one finishes its
 *   exit animation, which breaks Next 14's streaming SSR and the
 *   loading.tsx Suspense boundary — the new page would not start
 *   downloading until the old fade-out completes.
 * - Instead, we key the wrapper by `pathname` so React remounts both
 *   the page content (which fades in) and the shimmer overlay (which
 *   sweeps once) on every navigation.
 * - The shimmer is a fixed, full-width gradient bar that slides from
 *   left to right across the top edge in ~700ms. It's visible enough
 *   to feel like a "page change" cue without being intrusive — like a
 *   YouTube-style top progress bar but lighter.
 * - Respects prefers-reduced-motion: re-keys but no animation runs.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  // No fade on the first load: its `initial` is server-rendered, so the
  // whole page would sit at opacity 0 until hydration. Client-side
  // navigations (JS already running) still fade in.
  const firstLoad = useRef(true);
  useEffect(() => {
    firstLoad.current = false;
  }, []);

  return (
    <>
      {/* Shimmer sweep — keyed by pathname so it remounts on each nav. */}
      {!reduce && (
        <motion.div
          key={`shimmer-${pathname}`}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[3px] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1, times: [0, 0.7, 1] }}
        >
          <motion.div
            className="absolute inset-y-0 w-1/3"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, var(--sc-1) 30%, var(--sc-2) 50%, var(--sc-3) 70%, transparent 100%)',
              boxShadow: '0 0 14px var(--sc-1)',
            }}
            initial={{ x: '-100%' }}
            animate={{ x: '400%' }}
            transition={{ duration: 0.8, ease: [0.45, 0, 0.2, 1] }}
          />
        </motion.div>
      )}

      <motion.div
        key={pathname}
        // A liquid arrival: the page settles out of a soft blur. `filter` is cleared afterwards so it
        // never becomes a containing block for the page's fixed bars.
        initial={reduce || firstLoad.current ? false : { opacity: 0, y: 14, scale: 0.985, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
