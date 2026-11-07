import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { JsonLd } from '@/app/components/JsonLd';
import { chapterSummaryCollections, getChapterSummaryCollection } from '@/data/chapter-summaries';
import { getChapterOrientation } from '@/data/chapter-orientation';
import { articleLd, pageLd } from '@/lib/jsonld';
import { readHref } from '@/lib/verse-paths';

const pathFor = (id: string) => `/scripture/${id}/summary`;

export const dynamicParams = false;

export function generateStaticParams() {
  return chapterSummaryCollections.map((c) => ({ id: c.scriptureId }));
}

export async function generateMetadata(props: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const c = getChapterSummaryCollection(params.id);
  if (!c) return {};
  const path = pathFor(c.scriptureId);
  return {
    title: { absolute: `${c.title} — Dharma Granth` },
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: `${path}/` },
    openGraph: { type: 'article', locale: 'hi_IN', alternateLocale: ['en_US'], title: c.title, description: c.description, url: `${path}/` },
  };
}

export default async function ChapterSummariesPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const collection = getChapterSummaryCollection(params.id);
  if (!collection) notFound();
  const { scriptureId } = collection;
  const path = pathFor(scriptureId);
  const chapters = collection.chapters.map((s) => {
    const o = getChapterOrientation(scriptureId, s.chapter);
    return {
      ...s,
      nameHi: s.nameHi ?? o?.nameHi,
      nameEn: s.nameEn ?? o?.nameEn,
      keyVerses: s.keyVerses ?? o?.importantVerses ?? [],
    };
  });
  const allApproved = chapters.every((c) => c.review === 'approved');

  return (
    <main className="min-h-screen bg-dharma-bg pb-20 text-dharma-text" data-scripture-id={scriptureId}>
      <JsonLd
        data={pageLd(
          [
            { name: collection.scriptureNameEn, path: `/scripture/${scriptureId}` },
            { name: 'Chapter summaries', path },
          ],
          articleLd({ path, headline: collection.title, description: collection.description, languages: ['hi', 'en'] }),
        )}
      />
      <section className="border-b border-dharma-border bg-gradient-to-b from-amber-50/70 via-dharma-card to-dharma-bg px-5 py-12 dark:from-amber-950/20 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-xs text-dharma-muted">
            <Link href={`/scripture/${scriptureId}`} className="hover:text-saffron-700">
              {collection.scriptureNameHi}
            </Link>{' '}
            / सार
          </nav>
          <h1 className="mt-3 font-serif text-3xl font-bold sm:text-4xl">
            <span lang="hi" className="font-devanagari">{collection.headingHi}</span>
            <span className="mt-1 block text-xl font-semibold text-dharma-muted sm:text-2xl">{collection.headingEn}</span>
          </h1>
          <p lang="hi" className="mt-4 font-devanagari leading-relaxed text-dharma-muted">
            {collection.introHi}
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
                  href={`#${collection.anchor}-${c.chapter}`}
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
          const chapterHref = `/scripture/${scriptureId}/chapter/${c.chapter}`;
          return (
            <article
              key={c.chapter}
              id={`${collection.anchor}-${c.chapter}`}
              className="scroll-mt-24 rounded-3xl border border-dharma-border bg-dharma-card p-6 shadow-sm sm:p-8"
            >
              <h2 className="font-serif text-2xl font-bold">
                <Link href={chapterHref} className="hover:text-saffron-700">
                  <span lang="hi" className="font-devanagari">
                    {collection.unitHi} {c.chapter}{c.nameHi ? ` — ${c.nameHi}` : ''}
                  </span>
                  {c.nameEn && <span className="mt-1 block text-base font-semibold text-dharma-muted">{c.nameEn}</span>}
                </Link>
              </h2>
              <p lang="hi" className="mt-4 font-devanagari text-lg leading-loose">
                {c.summaryHi}
              </p>
              <p lang="en" className="mt-4 leading-relaxed text-dharma-muted">
                {c.summaryEn}
              </p>
              {c.keyVerses.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                    {collection.keyVersesHi} · Key verses
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {c.keyVerses.map((v) => {
                      const href = readHref(scriptureId, c.chapter, v.verse);
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
                <span lang="hi" className="font-devanagari">पूरा {collection.unitHi} पढ़ें</span> · Read {collection.unitEn} {c.chapter}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}
