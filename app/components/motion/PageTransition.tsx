'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

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
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  // Keep the server and first client render identical; the preference is
  // available only in the browser and can otherwise change the wrapper tree.
  const reduce = mounted && Boolean(prefersReducedMotion);
  const pathname = usePathname();
  // No fade on the first load: its `initial` is server-rendered, so the
  // whole page would sit at opacity 0 until hydration. Client-side
  // navigations (JS already running) still fade in.
  const firstLoad = useRef(true);
  useEffect(() => {
    setMounted(true);
    firstLoad.current = false;
  }, []);

  // Chapter to chapter turns like a page: forward swings in from the right edge, back from the left.
  const lastPath = useRef(pathname);
  const turn = useRef<0 | 1 | -1>(0);
  if (lastPath.current !== pathname) {
    const chapterOf = (p: string) => p.match(/^\/scripture\/([^/]+)\/chapter\/(\d+)/);
    const from = chapterOf(lastPath.current);
    const to = chapterOf(pathname);
    turn.current = from && to && from[1] === to[1] && from[2] !== to[2] ? (Number(to[2]) > Number(from[2]) ? 1 : -1) : 0;
    lastPath.current = pathname;
  }
  const pageTurn = turn.current !== 0;

  return (
    <>
      {/* Shimmer sweep — keyed by pathname so it remounts on each nav. */}
      {!reduce && (
        <motion.div
          key={`shimmer-${pathname}`}
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-[3px] overflow-hidden motion-reduce:hidden"
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

      {pageTurn ? (
        <>
          {/* One viewport-sized leaf turns away on its spine, revealing the next chapter beneath. */}
          {!reduce && (
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45]" style={{ perspective: 1600 }}>
              <motion.div
                key={`leaf-${pathname}`}
                className={`page-leaf ${turn.current === 1 ? 'is-forward' : 'is-back'}`}
                style={{ transformOrigin: turn.current === 1 ? 'left center' : 'right center' }}
                initial={{ rotateY: 0, opacity: 1 }}
                animate={{ rotateY: turn.current === 1 ? -115 : 115, opacity: 0 }}
                transition={{ rotateY: { type: 'spring', stiffness: 90, damping: 20 }, opacity: { duration: 0.9, ease: [0.4, 0, 0.6, 1] } }}
              />
            </div>
          )}
          <motion.div
            key={pathname}
            initial={reduce ? false : { opacity: 0, x: turn.current * 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            {children}
          </motion.div>
        </>
      ) : (
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
      )}
    </>
  );
}
