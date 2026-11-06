'use client';

import { useEffect, useState } from 'react';

/**
 * Keeps a closing menu, sheet or banner mounted long enough for its CSS exit animation, so the
 * site chrome can animate in and out without a motion library (app/motion.css, section 12).
 *
 * `mounted` says whether to render it; `closing` is true while it plays its exit. Put
 * `data-closing={closing || undefined}` on the element and let CSS pick the animation.
 */
export function usePresence(open: boolean, exitMs = 200): { mounted: boolean; closing: boolean } {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return;
    }
    if (!mounted) return;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, exitMs);
    return () => window.clearTimeout(timer);
    // `mounted` is read, not tracked: only a change of `open` starts or cancels an exit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, exitMs]);

  return { mounted: open || mounted, closing: !open && closing };
}
