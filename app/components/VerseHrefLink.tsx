import Link from 'next/link';
import type { ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** True when the URL's last path segment contains a dot, e.g. /verse/4.3.7/. */
export function hasDottedLastSegment(href: string): boolean {
  const path = href.split(/[?#]/)[0].replace(/\/+$/, '');
  return (path.split('/').pop() ?? '').includes('.');
}

/** True for a verse page URL, /scripture/{id}/chapter/{n}/verse/{v}/. */
export function isVersePageHref(href: string): boolean {
  return /^\/scripture\/[^/]+\/chapter\/[^/]+\/verse\/[^/?#]+\/?(?:[?#]|$)/.test(href);
}

/**
 * A link to a verse page. next/link strips the trailing slash from a URL whose
 * last segment contains a dot (it reads `4.3.7` as a file extension), so every
 * Brihadaranyaka or Chandogya verse link would cost a 308 to the slashed
 * canonical. Those render as a plain <a> (a full page load). Verse pages also
 * ship without their RSC payload (scripts/prune-export.mjs), so a Link would
 * only prefetch a 404 before falling back to a page load: they are plain <a>
 * too. Any other URL uses Link.
 */
export function VerseHrefLink({
  href,
  prefetch,
  replace,
  scroll,
  shallow,
  passHref,
  legacyBehavior,
  locale,
  as,
  children,
  ...rest
}: Props) {
  if ((hasDottedLastSegment(href) || isVersePageHref(href)) && href.startsWith('/')) {
    return (
      <a href={`${BASE_PATH}${href}`} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      passHref={passHref}
      legacyBehavior={legacyBehavior}
      locale={locale}
      as={as}
      {...rest}
    >
      {children}
    </Link>
  );
}
