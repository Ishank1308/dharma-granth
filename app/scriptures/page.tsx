import type { Metadata } from 'next';
import Link from 'next/link';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { getBookExplanation } from '@/data/book-explanations';
import { categories } from '@/data/scripture-meta';
import { getAllScriptures, getLibraryCounts } from '@/data/scriptures';
import { getLibraryFacts } from '@/lib/library-server';
import { FadeUp } from '@/app/components/motion/primitives';
import { ScriptureLibraryClient } from '@/app/components/ScriptureLibraryClient';
import { publishedTotals } from '@/lib/ashtavakra';

function loadLibrary() {
  return getAllScriptures().map((scripture) => {
    const held = getLibraryCounts(scripture.id);
    const catalogueVerses = scripture.canonicalTotalVerses ?? scripture.totalVerses;
    return {
      ...scripture,
      totalChapters: held.chapters,
      totalVerses: held.verses,
      canonicalTotalVerses: catalogueVerses !== held.verses ? catalogueVerses : scripture.canonicalTotalVerses,
      explanation: getBookExplanation(scripture.id),
      facts: getLibraryFacts(scripture.id),
    };
  });
}

export const metadata: Metadata = {
  title: 'All Scriptures',
  description:
    'The full library of Hindu sacred texts catalogued at Dharma Granth — Vedas, Upanishads, Itihasas, Puranas, Smritis, and more. Texts with verse text in the library are marked.',
  alternates: { canonical: '/scriptures/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    type: 'website',
    title: 'All Scriptures — Dharma Granth',
    description:
      'Browse the full library of Hindu sacred texts, organized by category. Texts with verse text in the library are marked.',
    url: '/scriptures',
  },
};

export default function ScripturesPage() {
  let scriptures: ReturnType<typeof loadLibrary> = [];
  let loadError = false;
  try {
    scriptures = loadLibrary();
  } catch (error) {
    // Render the page's own failure state instead of the generic error page.
    console.error('[scriptures] could not load the catalogue:', error);
    loadError = true;
  }

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* Inspora-inspired Archival Gallery Header */}
      <div className="border-b border-dharma-border/80 bg-dharma-card/60 backdrop-blur-sm py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-center gap-2 mb-3">
              <span className="editorial-section-eyebrow text-xs font-semibold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                The Sacred Archive
              </span>
            </div>
            <h1 className="editorial-section-title text-3xl font-serif font-bold text-dharma-text sm:text-5xl tracking-tight">
              Scripture Library
              <span lang="hi" className="ml-3 block font-devanagari text-2xl font-semibold leading-relaxed text-dharma-muted sm:inline sm:text-4xl">
                ग्रंथालय
              </span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-3 text-base text-dharma-muted sm:text-lg max-w-2xl leading-relaxed">
              Vedas, Upanishads, Itihasas and Puranas in one place. Search by name or topic, filter by tradition, length or language, then open any text to read it verse by verse.
            </p>
          </FadeUp>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 pt-8">
        <Link
          href="/ashtavakra/"
          className="flex flex-col gap-2 rounded-2xl border border-dharma-border bg-dharma-card p-5 transition hover:border-saffron-700 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p lang="hi" className="font-devanagari text-sm font-semibold text-saffron-800 dark:text-saffron-200">अष्टावक्र गीता</p>
            <h2 className="font-serif text-2xl font-bold text-dharma-text">Ashtavakra Gita</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dharma-muted">
              A separate reading, not one of the catalogue cards below. {publishedTotals().chapters} prakaranas and {publishedTotals().verses} verses are published. Chapters 19 and 20 stay review-required.
            </p>
          </div>
          <span className="inline-flex min-h-11 items-center text-sm font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-200">
            Open the reading
          </span>
        </Link>
      </section>

      <ScriptureLibraryClient scriptures={scriptures} categories={categories} loadError={loadError} />
    </main>
  );
}
