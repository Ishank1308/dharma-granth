'use client';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import Link from 'next/link';

const DOTTED_SEGMENT_RE = /\/[^/?#]+\.[^/?#]+\/?(?:$|[?#])/;

/** True when the final URL path segment contains a dot (e.g. `/verse/4.4.5/`). */
export function isDottedVerseRoute(href: string): boolean {
  return DOTTED_SEGMENT_RE.test(href);
}

/** Uses native `<a>` for dotted verse slugs (`4.4.5/`) so Next `<Link>` never strips `/` or prefetches missing `.txt`. */
export const VerseRouteLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithoutRef<'a'> & { href: string }
>(function VerseRouteLink({ href, children, ...props }, ref) {
  if (isDottedVerseRoute(href)) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link ref={ref} href={href} {...props}>
      {children}
    </Link>
  );
});
