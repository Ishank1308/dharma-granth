'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

/**
 * Per-route arrival plus a brief shimmer sweep across the top of the viewport, in CSS
 * (app/motion.css, section 12), so the layout carries no motion library.
 *
 * - The wrapper is keyed by `pathname`, so React remounts the page content (which settles in) and
 *   the shimmer (which sweeps once) on every navigation. No exit wait, so streaming is never held up.
 * - Nothing animates on the first load: the exported HTML is the page at rest, and the classes
 *   are only added once the app is running.
 * - Chapter to chapter, a leaf the colour of the page turns away on its spine instead.
 * - Reduced motion: the CSS switches every piece off.
 * - A change animated by lib/view-transition (verse to verse, chapter to chapter, opening a
 *   verse) skips the settle and the leaf, since the browser moves the screens itself.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Same tree on the server and the first client render; animations start with the first navigation.
  const [live, setLive] = useState(false);
  const firstPath = useRef(pathname);
  useEffect(() => {
    if (pathname !== firstPath.current) setLive(true);
  }, [pathname]);

  // Chapter to chapter turns like a page: forward swings in from the right edge, back from the left.
  const lastPath = useRef(pathname);
  const turn = useRef<0 | 1 | -1>(0);
  // When lib/view-transition is animating this change (data-vt on <html>), the browser
  // already moves the screens, so the arrival classes and the leaf stay off.
  const viaViewTransition = useRef(false);
  if (lastPath.current !== pathname) {
    viaViewTransition.current = typeof document !== 'undefined' && document.documentElement.hasAttribute('data-vt');
    const chapterOf = (p: string) => p.match(/^\/scripture\/([^/]+)\/chapter\/(\d+)/);
    const from = chapterOf(lastPath.current);
    const to = chapterOf(pathname);
    turn.current = from && to && from[1] === to[1] && from[2] !== to[2] ? (Number(to[2]) > Number(from[2]) ? 1 : -1) : 0;
    lastPath.current = pathname;
  }
  const moved = live || pathname !== firstPath.current;
  const forward = turn.current === 1;
  const pageTurn = moved && turn.current !== 0 && !viaViewTransition.current;
  const settle = moved && !viaViewTransition.current;

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
      <div key={pathname} className={pageTurn ? (forward ? 'page-turn-forward' : 'page-turn-back') : settle ? 'page-settle' : undefined}>
        {children}
      </div>
    </>
  );
}
