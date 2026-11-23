'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { inferRouteTransition, navigateWithTransition, notifyRouteCommitted } from '@/lib/view-transition';

/** The verse panel or card container that belongs to the tapped link for shared-element morphs. */
function heroFor(anchor: HTMLAnchorElement): HTMLElement | null {
  // A card container marked data-vt-source (e.g. a Library book card or Concept card) grows as a whole,
  // even when its link is a nested CTA on desktop. Otherwise a card link marked data-vt="open"
  // grows into the target page's data-vt-hero element.
  const source = anchor.closest<HTMLElement>('[data-vt-source]');
  if (source) return source;
  const own = anchor.closest<HTMLElement>('.verse-folio, a[data-vt]');
  if (own) return own;
  let node: HTMLElement | null = anchor.parentElement;
  for (let depth = 0; node && depth < 6; depth += 1, node = node.parentElement) {
    if (node.tagName === 'MAIN' || node.tagName === 'BODY' || node.tagName === 'NAV' || node.tagName === 'HEADER') break;
    const folios = node.querySelectorAll<HTMLElement>('.verse-folio');
    if (folios.length === 1) return folios[0];
    if (folios.length > 1) break;
  }
  return null;
}

/**
 * Mounted once in the root layout. Connects every screen-to-screen client navigation
 * through structural View Transitions:
 * - Sequential next/prev links and sibling chapters/verses turn like pages
 * - Primary nav rail glides laterally (`nav-next` / `nav-prev`)
 * - Drilling deeper into books, chapters, verses, concepts or festivals opens forward
 *   (morphing shared `[data-vt-source]` / `a[data-vt="open"]` / `.verse-folio` into `[data-vt-hero]`)
 * - Stepping up to a parent screen recedes cleanly (`back`)
 * - Peer routes cross-settle smoothly (`navigate`)
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
      if (!anchor || anchor.hasAttribute('download') || anchor.dataset.vt === 'none') return;
      if (anchor.target && anchor.target !== '_self') return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      const rel = (anchor.getAttribute('rel') ?? '').split(/\s+/).filter(Boolean);
      const kind = inferRouteTransition(window.location.pathname, url.pathname, {
        rel,
        vtAttr: anchor.dataset.vt,
      });

      e.preventDefault();
      navigateWithTransition(
        router,
        url.pathname + url.search + url.hash,
        kind,
        kind === 'open' ? heroFor(anchor) : null,
      );
    };
    // Capture phase so this runs before next/link's own handler, which then sees
    // defaultPrevented and leaves the navigation to us.
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [router]);

  return null;
}
