'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { routeDepth } from '@/lib/view-transition';

/**
 * Per-route stage + shimmer sweep across the top of the viewport, in CSS
 * (app/motion.css, section 12; app/styles/page-transitions.css), with zero external motion bundle.
 *
 * - `data-vt-stage` gives View Transitions a universal content plane on routes that don't
 *   declare their own `[data-vt-pane]`, so every one of the 91 templates transitions smoothly.
 * - When `lib/view-transition` is driving a View Transition (`data-vt` on `<html>`), CSS arrival
 *   classes step aside so the compositor moves the planes once.
 * - On history `popstate` or browsers without `startViewTransition`, spatial direction is still
 *   preserved: chapter page-turns (`page-turn-*`), hierarchical step-back (`page-back`), and
 *   forward arrivals (`page-settle`).
 * - Nothing animates on first load: exported HTML starts completely at rest.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [live, setLive] = useState(false);
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname !== firstPath.current) setLive(true);
  }, [pathname]);

  const lastPath = useRef(pathname);
  const turn = useRef<0 | 1 | -1>(0);
  const steppingBack = useRef(false);
  const viaViewTransition = useRef(false);
  if (lastPath.current !== pathname) {
    viaViewTransition.current = typeof document !== 'undefined' && document.documentElement.hasAttribute('data-vt');
    const chapterOf = (p: string) => p.match(/^\/scripture\/([^/]+)\/chapter\/(\d+)/);
    const from = chapterOf(lastPath.current);
    const to = chapterOf(pathname);
    turn.current = from && to && from[1] === to[1] && from[2] !== to[2] ? (Number(to[2]) > Number(from[2]) ? 1 : -1) : 0;
    steppingBack.current = turn.current === 0 && routeDepth(pathname) < routeDepth(lastPath.current);
    lastPath.current = pathname;
  }
  const moved = live || pathname !== firstPath.current;
  const forward = turn.current === 1;
  const pageTurn = moved && turn.current !== 0 && !viaViewTransition.current;
  const stepBack = moved && !pageTurn && steppingBack.current && !viaViewTransition.current;
  const settle = moved && !pageTurn && !stepBack && !viaViewTransition.current;

  const stageClass = pageTurn
    ? forward
      ? 'page-turn-forward'
      : 'page-turn-back'
    : stepBack
      ? 'page-back'
      : settle
        ? 'page-settle'
        : undefined;

  return (
    <>
      {moved && (
        <div
          key={`shimmer-${pathname}`}
          aria-hidden="true"
          className="page-shimmer pointer-events-none fixed left-0 right-0 top-0 z-[60] h-[3px] overflow-hidden"
        >
          <span
            className="absolute inset-y-0 w-1/3"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, var(--sc-1) 30%, var(--sc-2) 50%, var(--sc-3) 70%, transparent 100%)',
              boxShadow: '0 0 14px var(--sc-1)',
            }}
          />
        </div>
      )}
      {pageTurn && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45]" style={{ perspective: 1600 }}>
          <div
            key={`leaf-${pathname}`}
            className={`page-leaf ${forward ? 'is-forward' : 'is-back'}`}
            style={{ transformOrigin: forward ? 'left center' : 'right center' }}
          />
        </div>
      )}
      <div key={pathname} data-vt-stage className={stageClass}>
        {children}
      </div>
    </>
  );
}
