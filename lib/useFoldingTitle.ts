'use client';

import { useEffect, useState } from 'react';

/** Height of the site's glass bar (SiteNav, h-[52px]). */
const BAR = 52;
/** Folded once the title has passed this share of the way under the bar. */
const FOLD_AT = 0.8;
/** A page whose first heading starts lower than this many screens down has no large title. */
const MAX_TOP_SCREENS = 1.2;

/**
 * The large title folding into the bar, as on iOS: the page's first <h1> shrinks and fades as it
 * scrolls up under the glass bar, and once it has gone under, its name appears in the bar in
 * place of the wordmark. Scrolling back up reverses it.
 *
 * Returns the short title for the bar and whether it is folded. The shrink is CSS
 * (app/styles/title-fold.css) driven by `--title-fold` (0 to 1) on the heading, so reduced
 * motion and the quiet modes turn it off there while the bar title still swaps.
 */
export function useFoldingTitle(pathname: string | null, enabled: boolean) {
  const [title, setTitle] = useState('');
  const [folded, setFolded] = useState(false);

  useEffect(() => {
    setFolded(false);
    setTitle('');
    if (!enabled) return;

    let heading: HTMLElement | null = null;
    let raf = 0;
    let lastFolded = false;

    const measure = () => {
      raf = 0;
      if (!heading || !heading.isConnected) return;
      const rect = heading.getBoundingClientRect();
      // 0 while the title sits below the bar, 1 once its last line has gone under it.
      const travel = rect.height + 16;
      const progress = Math.min(1, Math.max(0, (BAR + 16 - rect.top) / travel));
      heading.style.setProperty('--title-fold', progress.toFixed(3));
      const now = progress >= FOLD_AT;
      if (now !== lastFolded) {
        lastFolded = now;
        setFolded(now);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    // Client pages render their heading a moment after the route changes; look again briefly.
    let tries = 0;
    const find = () => {
      const h1 = document.querySelector<HTMLElement>('#main-content h1');
      if (!h1) {
        if (tries++ < 10) timer = window.setTimeout(find, 120);
        return;
      }
      const top = h1.getBoundingClientRect().top + window.scrollY;
      if (top > window.innerHeight * MAX_TOP_SCREENS) return;
      const text = shortTitle(h1);
      if (!text) return;
      heading = h1;
      heading.setAttribute('data-title-folding', '');
      // A centred title shrinks toward its middle, a left-aligned one toward its start.
      if (getComputedStyle(h1).textAlign === 'center') heading.style.transformOrigin = 'center bottom';
      setTitle(text);
      measure();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    };
    let timer = window.setTimeout(find, 0);

    return () => {
      window.clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (heading) {
        heading.removeAttribute('data-title-folding');
        heading.style.removeProperty('--title-fold');
        heading.style.removeProperty('transform-origin');
      }
    };
  }, [pathname, enabled]);

  return { title, folded };
}

/**
 * The heading's main line for the bar: a `data-fold-text` part if the page marks one, else the
 * heading without its Hindi or Sanskrit second line (those are separate elements, see CLAUDE.md).
 */
function shortTitle(h1: HTMLElement): string {
  const marked = h1.querySelector('[data-fold-text]');
  if (marked?.textContent?.trim()) return clean(marked.textContent);
  const copy = h1.cloneNode(true) as HTMLElement;
  copy.querySelectorAll('[lang="hi"], [lang="sa"], [aria-hidden="true"], .sr-only').forEach((el) => el.remove());
  return clean(copy.textContent) || clean(h1.textContent);
}

function clean(text: string | null | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim().slice(0, 80);
}
