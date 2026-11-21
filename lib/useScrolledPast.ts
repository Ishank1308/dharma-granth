'use client';

import { useEffect, useState } from 'react';

/**
 * True while the element with `id` has scrolled off the top of the screen, and false while it is
 * on screen or still below the fold. `topOffset` is the height of the sticky bars it passes under.
 * `resetKey` re-attaches the watcher when the page swaps what the id points at (the next verse).
 */
export function useScrolledPast(id: string, resetKey: string, topOffset = 96): boolean {
  const [past, setPast] = useState(false);
  useEffect(() => {
    setPast(false);
    const el = document.getElementById(id);
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const watcher = new IntersectionObserver(
      ([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.bottom <= topOffset + 1),
      { rootMargin: `-${topOffset}px 0px 0px 0px` },
    );
    watcher.observe(el);
    return () => watcher.disconnect();
  }, [id, resetKey, topOffset]);
  return past;
}
