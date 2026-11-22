import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getLibraryStats } from '@/lib/library-stats';
import { HomeScriptureTabs } from './HomeScriptureTabs';

/**
 * The Sacred Library on the home page: editorial 3-column gallery with
 * warm category pills, photographic headers, essence shlokas, and direct entry points.
 */
export function HomeLibrary() {
  const libraryTotal = getLibraryStats().texts;

  return (
    <section aria-labelledby="home-library-heading" className="mx-auto max-w-content px-5 pb-20 pt-section">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2
          id="home-library-heading"
          className="font-serif text-[clamp(1.75rem,3vw,2.35rem)] font-bold tracking-[-0.025em] text-dharma-text"
        >
          <span>The Sacred Library</span>
          <span aria-hidden="true" className="mx-2 font-normal text-dharma-muted">·</span>
          <span lang="hi" className="font-devanagari font-semibold text-dharma-text">पावन ग्रन्थालय</span>
        </h2>

        <Link
          href="/scriptures/"
          className="chevron-nudge focus-ring inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[#9a4b25] hover:underline dark:text-[#f0a56b]"
        >
          <span lang="hi" className="font-devanagari">सम्पूर्ण {libraryTotal} ग्रन्थ देखें</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-5">
        <HomeScriptureTabs totalTexts={libraryTotal} />
      </div>
    </section>
  );
}
