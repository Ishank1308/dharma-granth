import type { ReactNode } from 'react';
import Link from 'next/link';
import { publishedTotals } from '@/lib/ashtavakra';
import { AshShell, ASH_INIT_SCRIPT } from './AshShell';
import './ashtavakra.css';

/**
 * Ashtavakra converges onto the standard sacred reading system: the header and
 * verse content use dharma tokens and the shared section order. AshShell stays
 * only as the saved-scheme provider (no flash on load); the parallel
 * ModeControls settings UI is gone — the site theme is the one theme.
 * (ashtavakra.css stays imported for the index/words list pages; the verse
 * reader no longer depends on it.)
 */
export default function AshtavakraLayout({ children }: { children: ReactNode }) {
  const published = publishedTotals();
  const navLink =
    'inline-flex min-h-[44px] min-w-[44px] items-center justify-center text-sm font-semibold text-dharma-muted transition hover:text-saffron-800 dark:hover:text-saffron-300';
  return (
    <AshShell>
      {/* Applies a saved visual mode before first paint. */}
      <script dangerouslySetInnerHTML={{ __html: ASH_INIT_SCRIPT }} />
      <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/ashtavakra/"
            lang="hi"
            className="inline-flex min-h-[44px] items-center font-devanagari text-base font-bold text-dharma-text"
          >
            अष्टावक्र गीता
          </Link>
          <nav aria-label="अष्टावक्र गीता" className="flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/ashtavakra/#chapters" className={navLink}>प्रकरण 1–{published.chapters}</Link>
            <Link href="/ashtavakra/#concepts" className={navLink}>अवधारणाएँ</Link>
            <Link href="/ashtavakra/words/" className={navLink}>शब्द</Link>
            <Link href="/ashtavakra/#source" className={navLink}>स्रोत</Link>
          </nav>
        </div>
      </div>
      {children}
    </AshShell>
  );
}
