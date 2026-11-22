import Link from 'next/link';
import { SectionTitle } from '@/app/components/apple/PageHeader';
import { getLibraryStats } from '@/lib/library-stats';
import { HomeScriptureTabs } from './HomeScriptureTabs';

/**
 * The library on the home page: an interactive tabbed scripture showcase
 * featuring Vedas, Upanishads, Gita, Darshana, Itihasa, and Puranas with
 * manuscript depth, essence verses, and direct entry points.
 */
export function HomeLibrary() {
  const libraryTotal = getLibraryStats().texts;

  return (
    <section aria-labelledby="home-library-heading" className="mx-auto max-w-content px-5 pb-20 pt-section">
      <SectionTitle
        id="home-library-heading"
        size="title-1"
        title="The library"
        titleHi="पावन ग्रन्थालय"
        action={
          <Link href="/scriptures/" className="chevron-nudge inline-flex min-h-[44px] items-center text-body text-dharma-saffron hover:underline">
            <span>सम्पूर्ण {libraryTotal} ग्रन्थ देखें</span> <span aria-hidden="true">&nbsp;›</span>
          </Link>
        }
      />
      <div className="mt-6">
        <HomeScriptureTabs />
      </div>
    </section>
  );
}
