import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { clipDescription } from '@/lib/meta-text';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { JsonLd } from '@/app/components/JsonLd';
import { getKnowledgeHub, knowledgeHubs } from '@/data/knowledge-hubs';
import { getWisdomConcept } from '@/data/wisdom-concepts';
import { getWisdomQuestion } from '@/data/wisdom-questions';
import {
  hubQuestions,
  relatedHubs,
  topicsForConcept,
  versesForWisdomConcept,
} from '@/lib/wisdom-discovery/links';
import { SITE_URL } from '@/lib/jsonld';

export function generateStaticParams() {
  return knowledgeHubs.map((hub) => ({ slug: hub.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const hub = getKnowledgeHub(params.slug);
  const concept = hub ? getWisdomConcept(hub.conceptSlug) : undefined;
  if (!hub || !concept) return { title: 'Knowledge Hub Not Found' };
  const title = `${concept.labelEn} (${concept.labelHi}) — Knowledge Hub`;
  const description = clipDescription(`${hub.taglineEn} ${hub.overviewEn}`);
  return {
    title,
    description,
    alternates: { canonical: `/knowledge/${hub.slug}/` },
    openGraph: {
      images: [DEFAULT_OG_IMAGE],
      title: `${title} — Dharma Granth`,
      description,
      url: `${SITE_URL}/knowledge/${hub.slug}/`,
    },
  };
}

const h2 = 'font-serif text-xl font-bold text-dharma-text';

export default function KnowledgeHubPage({ params }: { params: { slug: string } }) {
  const hub = getKnowledgeHub(params.slug);
  if (!hub) return notFound();
  const concept = getWisdomConcept(hub.conceptSlug);
  if (!concept) return notFound();

  const verses = versesForWisdomConcept(concept.id);
  const topics = topicsForConcept(concept.id);
  const hubs = relatedHubs(concept.id);

  const seenQuestions = new Set<string>();
  const questions = [
    ...hub.featuredQuestions
      .map((id) => getWisdomQuestion(id))
      .filter((q): q is NonNullable<typeof q> => Boolean(q)),
    ...hubQuestions(concept.id),
  ].filter((q) => {
    if (seenQuestions.has(q.id)) return false;
    seenQuestions.add(q.id);
    return true;
  });

  const pos = knowledgeHubs.findIndex((h) => h.slug === hub.slug);
  const prev = pos > 0 ? knowledgeHubs[pos - 1] : undefined;
  const next = pos < knowledgeHubs.length - 1 ? knowledgeHubs[pos + 1] : undefined;
  const prevConcept = prev ? getWisdomConcept(prev.conceptSlug) : undefined;
  const nextConcept = next ? getWisdomConcept(next.conceptSlug) : undefined;

  return (
    <main className="min-h-screen bg-dharma-bg">
      <section className="bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 py-14 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <nav aria-label="Breadcrumb" className="mb-4 text-xs text-saffron-200">
            <Link href="/wisdom-for-life/" className="underline underline-offset-2">Wisdom for Life</Link>
            <span aria-hidden="true"> · </span>
            <span>{concept.labelEn} hub</span>
          </nav>
          <p className="text-xs font-bold uppercase tracking-widest text-saffron-200">
            <span lang="hi" className="font-devanagari">ज्ञान केंद्र</span>
            {' · Knowledge hub'}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-bold">
            <span lang="sa" className="font-devanagari">{concept.sanskrit}</span>
            <span className="ml-3">{concept.labelEn}</span>
            <span lang="hi" className="ml-3 font-devanagari text-2xl opacity-90">{concept.labelHi}</span>
          </h1>
          <p className="mt-3 text-lg opacity-90">{hub.taglineEn}</p>
          <p lang="hi" className="mt-1 font-devanagari opacity-90">{hub.taglineHi}</p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl space-y-10 px-6 py-10">
        <section aria-label="Overview">
          <h2 className={h2}>Overview</h2>
          <p className="mt-2 leading-relaxed text-dharma-text">{hub.overviewEn}</p>
          <p lang="hi" className="mt-2 font-devanagari leading-relaxed text-dharma-text">{hub.overviewHi}</p>
        </section>

        <section aria-label="Key teachings">
          <h2 className={h2}>Key teachings</h2>
          <ul className="mt-3 space-y-4">
            {hub.keyTeachings.map((t) => (
              <li key={t.titleEn} className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
                <h3 className="font-semibold text-dharma-text">
                  {t.titleEn} <span lang="hi" className="font-devanagari font-normal text-dharma-muted">· {t.titleHi}</span>
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-dharma-text">{t.bodyEn}</p>
                <p lang="hi" className="mt-1 font-devanagari text-sm leading-relaxed text-dharma-muted">{t.bodyHi}</p>
              </li>
            ))}
          </ul>
        </section>

        {verses.length > 0 && (
          <section aria-label="Key verses">
            <h2 className={h2}>Key verses</h2>
            <ul className="mt-3 space-y-2">
              {verses.map((v) => (
                <li key={`${v.scriptureId}-${v.chapter}-${v.verse}`}>
                  <Link
                    href={v.href}
                    className="inline-flex min-h-[44px] items-center text-sm text-saffron-800 underline decoration-saffron-800/30 underline-offset-4 hover:decoration-saffron-800 dark:text-saffron-300"
                  >
                    {v.reference}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-label="Scriptures">
          <h2 className={h2}>Scriptures that teach this</h2>
          <ul className="mt-3 space-y-3">
            {hub.scriptures.map((s) => (
              <li key={s.id} className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
                <Link href={`/scripture/${s.id}/`} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                  {s.titleEn} <span lang="hi" className="font-devanagari">· {s.titleHi}</span>
                </Link>
                <p className="mt-1 text-sm text-dharma-text">{s.whyEn}</p>
                <p lang="hi" className="mt-1 font-devanagari text-sm text-dharma-muted">{s.whyHi}</p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Modern applications">
          <h2 className={h2}>Modern applications</h2>
          <ul className="mt-3 space-y-3">
            {hub.modernApplications.map((a) => (
              <li key={a.situationEn} className="rounded-2xl border border-dharma-border bg-dharma-card p-4">
                <p className="text-sm font-semibold text-dharma-text">{a.situationEn}</p>
                <p lang="hi" className="font-devanagari text-sm text-dharma-muted">{a.situationHi}</p>
                <p className="mt-2 text-sm text-dharma-text">
                  <span className="font-semibold">Practice: </span>{a.practiceEn}
                </p>
                <p lang="hi" className="mt-1 font-devanagari text-sm text-dharma-muted">
                  <span>अभ्यास: </span>{a.practiceHi}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {topics.length > 0 && (
          <section aria-label="Life topics">
            <h2 className={h2}>Explore in life topics</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.href}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-dharma-border bg-dharma-card px-4 text-sm text-dharma-text hover:border-saffron-400"
                  >
                    {t.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {questions.length > 0 && (
          <section aria-label="Related questions">
            <h2 className={h2}>Questions this answers</h2>
            <ul className="mt-3 space-y-3">
              {questions.map((q) => (
                <li key={q.id} id={`question-${q.id}`} className="scroll-mt-24 rounded-2xl border border-dharma-border bg-dharma-card p-4">
                  <p className="font-semibold text-dharma-text">{q.questionEn}</p>
                  <p lang="hi" className="font-devanagari text-sm text-dharma-muted">{q.questionHi}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hubs.length > 0 && (
          <section aria-label="Related concepts">
            <h2 className={h2}>Related concepts</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {hubs.map((h) => (
                <li key={h.slug}>
                  <Link
                    href={h.href}
                    className="inline-flex min-h-[44px] items-center rounded-full border border-dharma-border bg-dharma-card px-4 text-sm text-dharma-text hover:border-saffron-400"
                  >
                    <span lang="hi" className="font-devanagari">{h.labelHi}</span>
                    <span className="ml-2 text-dharma-muted">{h.labelEn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <nav aria-label="More knowledge hubs" className="flex items-center justify-between border-t border-dharma-border pt-6">
          <div>
            {prev && prevConcept && (
              <Link href={`/knowledge/${prev.slug}/`} className="text-sm text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                ← {prevConcept.labelEn}
              </Link>
            )}
          </div>
          <Link href="/wisdom-for-life/" className="text-sm text-dharma-muted underline underline-offset-2">
            All life topics
          </Link>
          <div>
            {next && nextConcept && (
              <Link href={`/knowledge/${next.slug}/`} className="text-sm text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                {nextConcept.labelEn} →
              </Link>
            )}
          </div>
        </nav>
      </div>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: `${concept.labelEn} (${concept.labelHi}) — Knowledge Hub`,
          inLanguage: ['en', 'hi', 'sa'],
          url: `${SITE_URL}/knowledge/${hub.slug}/`,
        }}
      />
    </main>
  );
}
