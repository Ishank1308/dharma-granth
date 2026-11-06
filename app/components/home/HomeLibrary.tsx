import Link from 'next/link';
import type { CSSProperties } from 'react';
import { getAllScriptures, getScriptureMeta } from '@/data/scriptures';
import type { ScriptureCategory } from '@/data/types';

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

  const books: Book[] = [
    { href: '/scripture/bhagavadgita/', titleSa: 'भगवद्गीता', titleEn: 'Bhagavad Gita', tradition: 'Smṛti', facts: '18 chapters · 700 verses', colour: '#c2410c' },
    { href: '/scripture/rigveda/', titleSa: 'ऋग्वेद', titleEn: 'Rigveda', tradition: 'Śruti', facts: chapters('rigveda', 'maṇḍalas'), colour: '#2f6f5e' },
    { href: '/scriptures/?category=upanishad', titleSa: 'उपनिषद्', titleEn: 'Upanishads', tradition: 'Śruti', facts: `${count('upanishad')} in the library`, colour: '#8a6a3c' },
    { href: '/scriptures/?category=itihasa', titleSa: 'इतिहास', titleEn: 'Itihāsa', tradition: 'Smṛti', facts: `${count('itihasa')} texts`, colour: '#1f4e8c' },
    { href: '/scriptures/?category=purana', titleSa: 'पुराण', titleEn: 'Purāṇas', tradition: 'Smṛti', facts: `${count('purana')} in the library`, colour: '#6b3fa0' },
    { href: '/scripture/atharvaveda/', titleSa: 'अथर्ववेद', titleEn: 'Atharvaveda', tradition: 'Śruti', facts: chapters('atharvaveda', 'kāṇḍas'), colour: '#7c2d12' },
  ];

  return (
    <section aria-labelledby="home-library-heading" className="mx-auto max-w-[980px] px-5 pb-20 pt-16 sm:pt-20">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id="home-library-heading" className="text-[28px] font-semibold tracking-[-0.03em] text-dharma-text sm:text-[40px]">
          <span>The library</span>{' '}
          <span lang="hi" className="ml-1 font-devanagari text-lg font-normal tracking-normal text-dharma-muted sm:text-[22px]">
            ग्रन्थालय
          </span>
        </h2>
        <Link href="/scriptures/" className="text-[17px] text-dharma-saffron hover:underline">
          See all {all.length} <span aria-hidden="true">›</span>
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {books.map((book) => (
          <li key={book.href}>
            <Link
              href={book.href}
              style={{ '--book': book.colour } as CSSProperties}
              className="home-book group relative flex h-full min-h-[170px] flex-col justify-between overflow-hidden rounded-[22px] bg-dharma-card p-[18px] pl-6 shadow-[0_2px_6px_rgba(0,0,0,0.04),0_12px_40px_rgba(0,0,0,0.06)] transition hover:-translate-y-0.5 sm:min-h-[230px] sm:rounded-[28px] sm:p-7 sm:pl-8"
            >
              <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-[color:var(--book-ink)]" />
              <span className="absolute right-6 top-6 hidden text-xs text-dharma-muted sm:block">{book.tradition}</span>
              <span lang="sa" className="shloka-text text-[28px] leading-tight text-[color:var(--book-ink)] sm:text-[40px]">
                {book.titleSa}
              </span>
              <span>
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
