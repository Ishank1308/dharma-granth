import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import Link from 'next/link';
import { buildWordIndex } from '@/lib/ashtavakra-words';

export const metadata: Metadata = {
  title: 'शब्द-अन्वेषण: अष्टावक्र गीता के प्रमुख शब्दार्थ',
  description: 'अष्टावक्र गीता के प्रकाशित और सत्यापित श्लोकों के प्रमुख शब्दार्थ — पहले अक्षर के अनुसार चुनें। ये संपादकीय शब्दार्थ हैं, शब्दकोश नहीं।',
  alternates: { canonical: '/ashtavakra/words/' },
  openGraph: {
    title: 'शब्द-अन्वेषण: अष्टावक्र गीता के प्रमुख शब्दार्थ',
    description:
      'अष्टावक्र गीता के प्रकाशित और सत्यापित श्लोकों के प्रमुख शब्दार्थ — पहले अक्षर के अनुसार चुनें। ये संपादकीय शब्दार्थ हैं, शब्दकोश नहीं।',
    url: '/ashtavakra/words/',
    images: [DEFAULT_OG_IMAGE],
  },
};

/**
 * Letter index only. Each letter is its own page so this HTML stays small
 * enough for the export weight budget.
 */
export default function WordsPage() {
  const index = buildWordIndex();

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <nav aria-label="ब्रेडक्रम्ब" className="ash-meta">
        <Link href="/ashtavakra/" className="ash-link underline">अष्टावक्र गीता</Link> / <span>शब्द-अन्वेषण</span>
      </nav>
      <h1 lang="hi" className="mt-4 font-bold" style={{ fontSize: 'clamp(1.6rem, 1.2rem + 1.5vw, 2.2rem)', lineHeight: 1.4 }}>
        शब्द-अन्वेषण
      </h1>
      <p lang="hi" className="ash-hindi mt-2">
        प्रकाशित और सत्यापित श्लोकों ({index.verseCount}) के प्रमुख शब्दार्थ — कुल {index.wordCount} पद-समूह।
        {' '}जिन {index.flaggedExcluded} श्लोकों पर “समीक्षा आवश्यक” का चिह्न है, उनके शब्द यहाँ शामिल नहीं हैं।
      </p>
      <p lang="hi" className="ash-meta mt-2">
        ये शब्दार्थ वही संपादकीय पदार्थ हैं जो प्रत्येक श्लोक के “पदच्छेद और प्रमुख शब्दार्थ” भाग में दिए गए हैं।
        एक अक्षर चुनें। यह शब्दकोश या पाणिनीय व्युत्पत्ति का दावा नहीं करता।
      </p>

      <nav aria-label="पहला अक्षर" className="mt-6 grid gap-2">
        {index.groups.map((group) => (
          <Link
            key={group.letter}
            href={`/ashtavakra/words/${encodeURIComponent(group.letter)}/`}
            lang="sa"
            className="ash-btn"
            style={{ minHeight: 44, justifyContent: 'space-between' }}
          >
            <span>{group.letter}</span>
            <span className="ash-meta">{group.words.length} पद</span>
          </Link>
        ))}
      </nav>

      <p className="ash-meta mt-10">
        नया प्रकरण प्रकाशित होते ही यह सूची स्वयं बढ़ जाती है; कोई अलग से संपादित शब्दकोश नहीं रखा गया है।
      </p>
    </main>
  );
}
