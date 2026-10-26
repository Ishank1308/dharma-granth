import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface Crumb {
  label: string;
  /** Omit on the current page; it is rendered as plain text with aria-current. */
  href?: string;
}

/**
 * Visible breadcrumb trail (Library > Scripture > Chapter > Verse). Server component, no client JS.
 * Links carry a trailing slash, matching the site's canonical URLs.
 */
export function Breadcrumbs({ items, className = '' }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={`border-b border-dharma-border/60 ${className}`}>
      <ol className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-1 gap-y-0 px-5 py-1 text-xs text-dharma-muted sm:px-6 sm:text-sm">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${i}-${item.label}`} className="flex min-w-0 items-center gap-1">
              {i > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden="true" /> : null}
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="inline-flex min-h-[44px] min-w-11 max-w-[14rem] items-center truncate rounded font-medium hover:text-saffron-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:hover:text-saffron-300"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className="max-w-[16rem] truncate font-semibold text-dharma-text">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
