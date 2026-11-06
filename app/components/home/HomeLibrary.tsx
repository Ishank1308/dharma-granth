import Link from 'next/link';
import type { CSSProperties } from 'react';
import { getAllScriptures, getScriptureMeta } from '@/data/scriptures';
import type { ScriptureCategory } from '@/data/types';
import { SectionTitle } from '@/app/components/apple/PageHeader';
import { getLibraryStats } from '@/lib/library-stats';

interface Book {
  href: string;
  titleSa: string;
  titleEn: string;
  /** Śruti, Smṛti or the whole library. */
  tradition: string;
  facts?: string;
  /** Spine and title colour. */
  colour: string;
}

function chapters(id: string, word: string): string | undefined {
  const meta = getScriptureMeta(id);
  return meta?.totalChapters ? `${meta.totalChapters} ${word}` : undefined;
}

/**
 * The library on the home page: a grid of book tiles, each with a coloured spine and its Devanagari name.
 * A server component; every title and link is in the exported HTML.
 */
export function HomeLibrary() {
  const all = getAllScriptures();
  const count = (c: ScriptureCategory) => all.filter((s) => s.category === c).length;
  const libraryTotal = getLibraryStats().texts;

  const books: Book[] = [
    { href: '/scripture/bhagavadgita/', titleSa: 'भगवद्गीता', titleEn: 'Bhagavad Gita', tradition: 'Smṛti', facts: '18 chapters · 700 verses', colour: '#c2410c' },
    { href: '/scripture/rigveda/', titleSa: 'ऋग्वेद', titleEn: 'Rigveda', tradition: 'Śruti', facts: chapters('rigveda', 'maṇḍalas'), colour: '#2f6f5e' },
    { href: '/scriptures/?category=upanishad', titleSa: 'उपनिषद्', titleEn: 'Upanishads', tradition: 'Śruti', facts: `${count('upanishad')} in the library`, colour: '#8a6a3c' },
    { href: '/scriptures/?category=itihasa', titleSa: 'इतिहास', titleEn: 'Itihāsa', tradition: 'Smṛti', facts: `${count('itihasa')} texts`, colour: '#1f4e8c' },
    { href: '/scriptures/?category=purana', titleSa: 'पुराण', titleEn: 'Purāṇas', tradition: 'Smṛti', facts: `${count('purana')} in the library`, colour: '#6b3fa0' },
    { href: '/scripture/atharvaveda/', titleSa: 'अथर्ववेद', titleEn: 'Atharvaveda', tradition: 'Śruti', facts: chapters('atharvaveda', 'kāṇḍas'), colour: '#7c2d12' },
  ];

  return (
    <section aria-labelledby="home-library-heading" className="mx-auto max-w-content px-5 pb-20 pt-section">
      <SectionTitle
        id="home-library-heading"
        size="title-1"
        title="The library"
        titleHi="ग्रन्थालय"
        action={
          <Link href="/scriptures/" className="chevron-nudge text-body text-dharma-saffron hover:underline">
            See all {libraryTotal} <span aria-hidden="true">›</span>
          </Link>
        }
      />
      {/* Tiles rise in as a wave (.reveal-grid) and lean toward the pointer with a light on them (data-tilt);
          the Devanagari title floats a little above the card (data-depth). Styles in app/motion.css. */}
      <ul className="reveal-grid grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {books.map((book) => (
          <li key={book.href}>
            <Link
              href={book.href}
              data-tilt
              style={{ '--book': book.colour } as CSSProperties}
              className="home-book group relative flex h-full min-h-[170px] flex-col justify-between overflow-hidden rounded-card bg-dharma-card p-[18px] pl-6 shadow-raised sm:min-h-[230px] sm:rounded-panel sm:p-7 sm:pl-8"
            >
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[color:var(--book-ink)]" />
              <span className="absolute right-6 top-6 hidden text-xs text-dharma-muted sm:block">{book.tradition}</span>
              <span lang="sa" data-depth="8" className="shloka-text text-[28px] leading-tight text-[color:var(--book-ink)] sm:text-[40px]">
                {book.titleSa}
              </span>
              <span data-depth="4">
                <span className="block text-[17px] font-semibold tracking-[-0.02em] text-dharma-text sm:text-[21px]">{book.titleEn}</span>
                {book.facts && <span className="mt-1 block text-sm text-dharma-muted">{book.facts}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
