import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { getBookExplanation } from '@/data/book-explanations';
import { categories } from '@/data/scripture-meta';
import type { LibraryItem } from '@/lib/library';
import { getAllScriptures, getLibraryCounts } from '@/data/scriptures';
import { getLibraryFacts } from '@/lib/library-server';
import { ScriptureLibraryClient } from '@/app/components/ScriptureLibraryClient';
import { PageHeader } from '@/app/components/apple/PageHeader';
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
      <PageHeader
        width="wide"
        eyebrow="Library"
        title="Scriptures"
        titleHi="ग्रंथालय"
        lead={
          <p>
            Vedas, Upanishads, Itihasas and Puranas in one place. Search by name or topic, filter by tradition, length or
            language, then open any text to read it verse by verse.
          </p>
        }
      />

      <ScriptureLibraryClient scriptures={scriptures} categories={categories} loadError={loadError} />
    </main>
  );
}
