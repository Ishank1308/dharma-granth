import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { getBookExplanation } from '@/data/book-explanations';
import { categories } from '@/data/scripture-meta';
import type { LibraryItem } from '@/lib/library';
import { getAllScriptures, getLibraryCounts } from '@/data/scriptures';
import { getLibraryFacts } from '@/lib/library-server';
import { FadeUp } from '@/app/components/motion/primitives';
import { ScriptureLibraryClient } from '@/app/components/ScriptureLibraryClient';
import { publishedTotals } from '@/lib/ashtavakra';

function loadLibrary() {
  const catalogue = getAllScriptures().map((scripture) => {
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

  // Ashtavakra Gita has its own reviewed reading route and chapter data rather
  // than the standard seeded-scripture JSON, so include its measured totals here.
  const ashtavakraTotals = publishedTotals();
  const ashtavakra: LibraryItem = {
    id: 'ashtavakra',
    title: 'Ashtavakra Gita',
    titleSanskrit: 'अष्टावक्र गीता',
    titleIast: 'Aṣṭāvakra Gītā',
    category: 'vedanta',
    description: 'A dialogue on the nature of the Self and liberation. Some chapters remain under editorial review.',
    totalChapters: ashtavakraTotals.chapters,
    totalVerses: ashtavakraTotals.verses,
    tags: ['Advaita', 'Nondualism', 'Self', 'Liberation'],
    hasData: ashtavakraTotals.verses > 0,
    isCurated: true,
    facts: {
      languages: { sa: true, hi: true, en: true },
      hindiCommentary: false,
    },
  };

  return [...catalogue, ashtavakra];
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
              <span className="size-2 rounded-full bg-saffron-600 animate-status-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                The Sacred Archive
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-dharma-text sm:text-5xl tracking-tight">
              Scripture Library{' '}
              <span lang="hi" className="ml-3 block font-devanagari text-2xl font-semibold leading-relaxed text-dharma-muted sm:ml-1 sm:inline sm:text-4xl">
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

      <ScriptureLibraryClient scriptures={scriptures} categories={categories} loadError={loadError} />
    </main>
  );
}
