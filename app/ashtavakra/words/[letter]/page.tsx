import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildWordIndex } from '@/lib/ashtavakra-words';
import { verseHref } from '@/lib/ashtavakra';

interface PageProps {
  params: Promise<{ letter: string }>;
}

export function generateStaticParams() {
  return buildWordIndex().groups.map((group) => ({ letter: group.letter }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const letter = decodeURIComponent(params.letter);
  const group = buildWordIndex().groups.find((item) => item.letter === letter);
  const words = group?.words ?? [];
  // Name the words themselves, so each letter's description says what is on that page.
  let sample = '';
  for (const word of words) {
    const next = sample ? `${sample}, ${word.word}` : word.word;
    if (next.length > 60) break;
    sample = next;
  }
  return {
    title: `शब्द-अन्वेषण: ${letter} · अष्टावक्र गीता`,
    description: `अष्टावक्र गीता में ${letter} से आरम्भ होने वाले ${words.length} पद, हिंदी अर्थ और श्लोक-संदर्भ सहित${sample ? `: ${sample}` : ''}।`,
    alternates: { canonical: `/ashtavakra/words/${encodeURIComponent(letter)}/` },
  };
}

export default async function WordLetterPage(props: PageProps) {
  const params = await props.params;
  const letter = decodeURIComponent(params.letter);
  const group = buildWordIndex().groups.find((item) => item.letter === letter);
  if (!group) notFound();

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <nav aria-label="ब्रेडक्रम्ब" className="ash-meta">
        <Link href="/ashtavakra/" className="ash-link underline">अष्टावक्र गीता</Link>
        {' / '}
        <Link href="/ashtavakra/words/" className="ash-link underline">शब्द-अन्वेषण</Link>
        {' / '}
        <span lang="sa">{group.letter}</span>
      </nav>
      <h1 lang="sa" className="mt-4 font-bold" style={{ fontSize: 'clamp(1.6rem, 1.2rem + 1.5vw, 2.2rem)', lineHeight: 1.4 }}>
        {group.letter}
      </h1>
      <p lang="hi" className="ash-meta mt-2">{group.words.length} पद-समूह।</p>

      <dl className="mt-6 grid gap-3">
        {group.words.map((word) => (
          <div key={word.word} className="ash-card">
            <dt lang="sa" className="font-bold">{word.word}</dt>
            <dd className="mt-1">
              <ul className="grid gap-2">
                {word.glosses.map((gloss) => (
                  <li key={gloss.hindi} lang="hi">
                    <span>{gloss.hindi}</span>{' '}
                    <span className="ash-meta">
                      ({gloss.refs.map((ref, index) => (
                        <span key={ref}>
                          {index > 0 && ', '}
                          <Link href={verseHref(ref)} className="ash-link underline">श्लोक {ref}</Link>
                        </span>
                      ))})
                    </span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
