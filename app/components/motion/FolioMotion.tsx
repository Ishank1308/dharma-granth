'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Lets only the verse panels near the viewport animate. A chapter's photo or drawn scene sits behind
 * every verse's Sanskrit panel (`.verse-folio`) and moves on a clock (app/styles/scene-photos.css,
 * scenes.css). Left to run everywhere, a chapter you had scrolled through kept several endless
 * animations per verse ticking off screen, and the page never came to rest. This marks the panels
 * within reach of the viewport with `data-live`; the stylesheets animate only those.
 *
 * One IntersectionObserver for the page. Panels that arrive later (plain verses upgraded to rich
 * cards, a filtered list) are picked up by a MutationObserver that re-scans at most once per frame.
 * Without JavaScript or IntersectionObserver the pictures simply hold still.
 */
export function FolioMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || typeof MutationObserver === 'undefined') return;
    const scope = document.querySelector<HTMLElement>('[data-photo], [data-scene]');
    if (!scope) return;

    const watched = new WeakSet<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        const left: Element[] = [];
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.target.hasAttribute('data-live')) left.push(entry.target);
          entry.target.toggleAttribute('data-live', entry.isIntersecting);
        }
        // A plain verse card is `content-visibility: auto`. Flung far off screen it is skipped before its
        // styles update, and its animations would then tick on unseen for good. Asking for them makes
        // the browser bring that panel's styles up to date, which ends them.
        for (const folio of left) folio.getAnimations({ subtree: true });
      },
      // Start a little before the panel scrolls in, so it is already moving when it is seen.
      { rootMargin: '240px 0px' },
    );

    const scan = () => {
      for (const folio of scope.querySelectorAll('.verse-folio')) {
        if (watched.has(folio)) continue;
        watched.add(folio);
        io.observe(folio);
      }
    };

    let frame = 0;
    const mo = new MutationObserver(() => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        scan();
      });
    });

    scan();
    mo.observe(scope, { childList: true, subtree: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
      for (const folio of scope.querySelectorAll('.verse-folio[data-live]')) folio.removeAttribute('data-live');
    };
  }, [pathname]);

  return null;
}
