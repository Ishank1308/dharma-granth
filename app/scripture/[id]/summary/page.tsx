import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { JsonLd } from '@/app/components/JsonLd';
import { gitaChapterSummaries } from '@/data/gita-chapter-summaries';
import { getChapterOrientation } from '@/data/chapter-orientation';
import { articleLd, pageLd } from '@/lib/jsonld';
import { versePageHref } from '@/lib/verse-paths';

// Only the Gita has chapter summaries so far.
const SCRIPTURE_ID = 'bhagavadgita';
const PATH = `/scripture/${SCRIPTURE_ID}/summary`;
const TITLE = 'भगवद्गीता सार: 18 अध्यायों का सारांश · Bhagavad Gita Chapter Summaries';
const DESCRIPTION =
  'श्रीमद्भगवद्गीता के सभी 18 अध्यायों का सरल हिंदी सार, मुख्य श्लोकों के साथ। Bhagavad Gita summary, chapter by chapter, in Hindi and English.';

export const dynamicParams = false;

export function generateStaticParams() {
  return [{ id: SCRIPTURE_ID }];
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  if (params.id !== SCRIPTURE_ID) return {};
  return {
    title: { absolute: `${TITLE} — Dharma Granth` },
    description: DESCRIPTION,
    keywords: [
      'bhagavad gita summary',
      'bhagavad gita chapter summary',
      'gita saar',
      'गीता सार',
      'गीता के 18 अध्याय',
      'भगवद्गीता अध्याय सारांश',
    ],
    alternates: { canonical: `${PATH}/` },
    openGraph: { type: 'article', locale: 'hi_IN', alternateLocale: ['en_US'], title: TITLE, description: DESCRIPTION, url: `${PATH}/` },
  };
}

export default function GitaSummaryPage({ params }: { params: { id: string } }) {
  if (params.id !== SCRIPTURE_ID) notFound();
  const chapters = gitaChapterSummaries.map((s) => ({ ...s, orientation: getChapterOrientation(SCRIPTURE_ID, s.chapter) }));
  const allApproved = chapters.every((c) => c.review === 'approved');

  return (
    <main className="min-h-screen bg-dharma-bg pb-20 text-dharma-text">
      <JsonLd
        data={pageLd(
          [
            { name: 'Bhagavad Gita', path: `/scripture/${SCRIPTURE_ID}` },
            { name: 'Chapter summaries', path: PATH },
          ],
          articleLd({ path: PATH, headline: TITLE, description: DESCRIPTION, languages: ['hi', 'en'] }),
        )}
      />
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg px-5 py-12 dark:from-amber-950/20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-xs text-dharma-muted">
            <Link href={`/scripture/${SCRIPTURE_ID}`} className="hover:text-saffron-700">
              श्रीमद्भगवद्गीता
            </Link>{' '}
            / सार
          </nav>
          <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
            <span lang="hi" className="font-devanagari">भगवद्गीता सार</span>
            <span className="mt-1 block text-xl font-semibold text-dharma-muted sm:text-2xl">Summaries of all 18 chapters</span>
          </h1>
          <p lang="hi" className="mt-4 font-devanagari leading-relaxed text-dharma-muted">
            हर अध्याय में क्या है, सरल हिंदी में, साथ में अंग्रेज़ी सार और उस अध्याय के मुख्य श्लोक। पूरा अध्याय पढ़ने के लिए अध्याय के नाम पर जाएँ।
          </p>
          {!allApproved && (
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200">
              Editorial summaries, not scripture. Status: draft, awaiting editorial review. Always read the verses themselves.
            </p>
          )}
          <ol className="mt-6 flex flex-wrap gap-2" aria-label="Chapters">
            {chapters.map((c) => (
              <li key={c.chapter}>
                <a
                  href={`#adhyay-${c.chapter}`}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-card px-3 text-sm font-semibold hover:border-saffron-300 hover:text-saffron-700"
                >
                  {c.chapter}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mx-auto max-w-3xl space-y-6 px-5 py-10 sm:px-8">
        {chapters.map((c) => {
          const o = c.orientation;
          const chapterHref = `/scripture/${SCRIPTURE_ID}/chapter/${c.chapter}`;
          return (
            <article
              key={c.chapter}
              id={`adhyay-${c.chapter}`}
              className="scroll-mt-24 rounded-3xl border border-dharma-border bg-dharma-card p-6 shadow-sm sm:p-8"
            >
              <h2 className="font-serif text-2xl font-bold">
                <Link href={chapterHref} className="hover:text-saffron-700">
                  <span lang="hi" className="font-devanagari">
                    अध्याय {c.chapter}{o ? ` — ${o.nameHi}` : ''}
                  </span>
                  {o && <span className="mt-1 block text-base font-semibold text-dharma-muted">{o.nameEn}</span>}
                </Link>
              </h2>
              <p lang="hi" className="mt-4 font-devanagari text-lg leading-loose">
                {c.summaryHi}
              </p>
              <p lang="en" className="mt-4 leading-relaxed text-dharma-muted">
                {c.summaryEn}
              </p>
              {o && o.importantVerses.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                    मुख्य श्लोक · Key verses
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {o.importantVerses.map((v) => {
                      const href = versePageHref(SCRIPTURE_ID, c.chapter, v.verse) ?? `${chapterHref}#verse-${v.verse}`;
                      return (
                        <li key={v.verse}>
                          <Link href={href} className="font-semibold text-saffron-700 hover:underline dark:text-saffron-400">
                            {c.chapter}.{v.verse}
                          </Link>{' '}
                          <span className="text-dharma-muted">{v.note}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
              <Link
                href={chapterHref}
                className="mt-5 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-400"
              >
                <span lang="hi" className="font-devanagari">पूरा अध्याय पढ़ें</span> · Read chapter {c.chapter}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
