import type { Metadata } from 'next';
import Link from 'next/link';
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
  title: 'सम्पूर्ण ग्रंथालय · Hindu Scriptures, Vedas & Puranas',
  description:
    'मूल संस्कृत श्लोक, पदच्छेद, हिंदी अर्थ और अंग्रेजी अनुवाद सहित संपूर्ण वैदिक ग्रंथालय: वेद, उपनिषद्, भगवद्गीता, रामायण, महाभारत, पुराण, विदुर नीति एवं दर्शन।',
  alternates: { canonical: '/scriptures/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    type: 'website',
    title: 'सम्पूर्ण ग्रंथालय · Hindu Scriptures, Vedas & Puranas — Dharma Granth',
    description:
      'मूल संस्कृत श्लोक, पदच्छेद, हिंदी अर्थ और अंग्रेजी अनुवाद सहित संपूर्ण वैदिक ग्रंथालय: वेद, उपनिषद्, भगवद्गीता, रामायण, महाभारत, पुराण एवं दर्शन।',
    url: '/scriptures/',
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

      {/* Featured Rare & Practical Philosophy Collection */}
      <section aria-label="दुर्लभ एवं व्यावहारिक दर्शन ग्रंथ" className="mx-auto max-w-7xl px-gutter mb-8">
        <div className="apple-card rounded-card border border-dharma-border bg-dharma-card p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400">
                विशेष संग्रह · Curated Holdings
              </span>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-dharma-text mt-0.5">
                दुर्लभ एवं व्यावहारिक दर्शन ग्रंथ (Practical Philosophy &amp; Rare Texts)
              </h2>
            </div>
            <span className="text-xs text-dharma-muted">
              मूल संस्कृत, पदच्छेद व प्रामाणिक हिंदी अनुवाद
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'viduraniti',
                href: '/scripture/viduraniti/',
                title: 'विदुर नीति (Vidura Niti)',
                desc: 'महाभारत उद्योगपर्व — नीति, मनोविज्ञान और व्यावहारिक शासन-कला (594 श्लोक)',
                badge: 'महाभारत',
                tag: 'नीति व आचरण',
                spineColor: 'bg-amber-500',
                badgeClass: 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-300',
              },
              {
                id: 'shivaswarodaya',
                href: '/scripture/shivaswarodaya/',
                title: 'शिव स्वरोदय (Shiva Swarodaya)',
                desc: 'स्वर योग — प्राण, नाड़ी व श्वास-प्रवाह का प्रत्यक्ष विज्ञान (395 श्लोक)',
                badge: 'स्वर विज्ञान',
                tag: 'प्राणायाम',
                spineColor: 'bg-emerald-600',
                badgeClass: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300',
              },
              {
                id: 'ashtavakra',
                href: '/ashtavakra/',
                title: 'अष्टावक्र गीता (Ashtavakra Gita)',
                desc: 'अद्वैत वेदांत — आत्म-ज्ञान और परम मुक्ति का सीधा संवाद (298 श्लोक)',
                badge: 'वेदांत',
                tag: 'आत्म-ज्ञान',
                spineColor: 'bg-saffron-500',
                badgeClass: 'bg-saffron-500/15 border-saffron-500/30 text-saffron-800 dark:text-saffron-300',
              },
              {
                id: 'naradabhaktisutra',
                href: '/scripture/naradabhaktisutra/',
                title: 'नारद भक्ति सूत्र (Narada Bhakti Sutras)',
                desc: 'परा-भक्ति का शास्त्रीय दर्शन — प्रेम, समर्पण व आत्म-निवेदन (84 सूत्र)',
                badge: 'भक्ति दर्शन',
                tag: 'सूत्र ग्रंथ',
                spineColor: 'bg-indigo-600',
                badgeClass: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-800 dark:text-indigo-300',
              },
            ].map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group card-sacred sheen-sweep relative flex flex-col justify-between overflow-hidden rounded-card border border-dharma-border bg-dharma-card p-5 pl-7 shadow-xs hover:border-saffron-400 hover:shadow-raised"
              >
                <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1.5 ${item.spineColor} rounded-l-card`} />
                <div>
                  <div className="flex items-center justify-between text-2xs mb-2">
                    <span className={`rounded-full border px-2 py-0.5 font-bold ${item.badgeClass}`}>
                      {item.badge}
                    </span>
                    <span className="text-dharma-muted font-medium text-[11px]">{item.tag}</span>
                  </div>
                  <h3 className="font-serif text-title-3 font-semibold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-dharma-muted line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-end text-xs font-semibold text-saffron-700 dark:text-saffron-400 group-hover:translate-x-1 transition-transform">
                  पढ़ें <span aria-hidden="true">&nbsp;›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ScriptureLibraryClient scriptures={scriptures} categories={categories} loadError={loadError} />
    </main>
  );
}
