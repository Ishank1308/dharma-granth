'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { navigateWithTransition, notifyRouteCommitted, type TransitionKind } from '@/lib/view-transition';

const VERSE_PAGE = /^\/scripture\/[^/]+\/chapter\/[^/]+\/verse\/[^/]+\/?$/;

/** The verse panel that belongs to the tapped link, if the link sits on a verse card. */
function heroFor(anchor: HTMLAnchorElement): HTMLElement | null {
  const own = anchor.closest<HTMLElement>('.verse-folio');
  if (own) return own;
  let node: HTMLElement | null = anchor.parentElement;
  for (let depth = 0; node && depth < 6; depth += 1, node = node.parentElement) {
    if (node.tagName === 'MAIN' || node.tagName === 'BODY') break;
    const folios = node.querySelectorAll<HTMLElement>('.verse-folio');
    if (folios.length === 1) return folios[0];
    if (folios.length > 1) break;
  }
  return null;
}

/**
 * Mounted once in the root layout. It tells lib/view-transition when a new route has
 * rendered, and turns ordinary link taps into animated page changes:
 * rel="next" / rel="prev" links slide like a turned page, and a link to a verse page
 * grows the tapped verse into it. Everything else navigates as before.
 */
export function RouteTransitions() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    notifyRouteCommitted();
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor || anchor.hasAttribute('download')) return;
      if (anchor.target && anchor.target !== '_self') return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      const rel = (anchor.getAttribute('rel') ?? '').split(/\s+/);
      let kind: TransitionKind | null = null;
      if (rel.includes('next')) kind = 'next';
      else if (rel.includes('prev')) kind = 'prev';
      else if (VERSE_PAGE.test(url.pathname)) kind = 'open';
      if (!kind) return;

      e.preventDefault();
      navigateWithTransition(router, url.pathname + url.search + url.hash, kind, kind === 'open' ? heroFor(anchor) : null);
    };
    // Capture phase, so this runs before next/link's own handler, which then sees
    // defaultPrevented and leaves the navigation to us.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return null;
}
