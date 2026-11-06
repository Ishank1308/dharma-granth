import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPathway } from '@/data/wisdom-pathways';
import { getStarterPathway, mappedStarterPathways } from '@/data/wisdom-pathway-starters';
import {
  conceptsForPathway,
  questionsForPathway,
  questionsForStarter,
  relatedPathways,
  resolveStarterStages,
  topicsForStarter,
} from '@/lib/wisdom-pathways';
import { SITE_URL } from '@/lib/jsonld';

export function generateStaticParams() {
  return mappedStarterPathways().map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const starter = getStarterPathway(params.slug);
  if (!starter || !starter.pathwaySlug || !getPathway(starter.pathwaySlug)) {
    return { title: 'Pathway Not Found' };
  }
  const description = `${starter.questionEn} ${starter.introductionEn}`.slice(0, 155);
  return {
    title: `${starter.questionEn} — ${starter.titleEn}`,
    description,
    alternates: { canonical: `/wisdom-pathways/${starter.pathwaySlug}/` },
    openGraph: {
      title: `${starter.questionEn} — Dharma Granth`,
      description,
      url: `${SITE_URL}/pathways/${starter.slug}/`,
    },
  };
}

/**
 * Starter pathway reading page (MISSION Phases 6 + 8).
 * Server-rendered only — no client JS, so reading is never interrupted and
 * nothing shifts after paint. The canonical URL stays
 * /wisdom-pathways/[pathway]/ (see alternates.canonical); this slug is a
 * named entrance to the same teaching.
 */
export default function StarterPathwayPage({ params }: { params: { slug: string } }) {
  const starter = getStarterPathway(params.slug);
  if (!starter || !starter.pathwaySlug) notFound();
  const pathway = getPathway(starter.pathwaySlug);
  if (!pathway) notFound();
  const stages = resolveStarterStages(starter);
  const related = relatedPathways(pathway.slug);
  const questions = questionsForPathway(pathway.slug).filter(
    (q) => !starter.questionIds.includes(q.question.id),
  );
  const starterQuestions = questionsForStarter(starter);
  const concepts = conceptsForPathway(pathway.slug);
  const topics = topicsForStarter(starter);

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-dharma-muted">
          <Link href="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <Link href="/pathways/" className="hover:underline">
            Pathways
          </Link>
          <span>/</span>
          <span className="text-dharma-text">{starter.titleEn}</span>
        </nav>

        <p className="mt-6 text-xs font-bold uppercase tracking-wider text-dharma-muted">{starter.questionEn}</p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{starter.titleEn}</h1>
        <p lang="hi" className="mt-2 font-devanagari text-2xl">
          {starter.titleHi}
        </p>
        <p className="mt-3 text-sm text-dharma-muted">{pathway.mastersFocusEn}</p>

        <section className="mt-6 rounded-2xl border border-dharma-line bg-dharma-card p-5 sm:p-7">
          <h2 className="font-serif text-xl">Introduction</h2>
          <p className="mt-2 leading-relaxed">{starter.introductionEn}</p>
          <p lang="hi" className="mt-2 leading-relaxed text-dharma-muted">
            {starter.introductionHi}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-dharma-muted">{pathway.scripturalFoundations.en}</p>
        </section>

        <ol className="mt-8 space-y-6">
          {stages.map(({ stage, verses, reflections, contemplations, concepts: stageConcepts }, i) => (
            <li
              key={stage.order}
              className="rounded-2xl border border-dharma-line bg-dharma-card p-5 sm:p-7"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                Stage {i + 1} of {stages.length}
              </p>
              <h2 className="mt-1 font-serif text-xl">{stage.titleEn}</h2>
              <p lang="hi" className="mt-0.5 text-base text-dharma-muted">
                {stage.titleHi}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{stage.focusEn}</p>
              <p lang="hi" className="mt-1 text-sm leading-relaxed text-dharma-muted">
                {stage.focusHi}
              </p>

              {verses.map(({ verse, arthEn, arthHi, vyakhyaEn, vyakhyaHi, modernContextEn, modernContextHi, href }) => (
                <article key={verse.id} className="mt-4 rounded-xl bg-dharma-bg p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                    {verse.referenceDisplay}
                  </p>
                  <p lang="sa" className="mt-2 font-devanagari text-lg leading-loose">
                    {verse.sanskritDevanagari}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed">{verse.literalTranslationEn}</p>
                  <p lang="hi" className="mt-1 text-sm leading-relaxed text-dharma-muted">
                    {verse.literalTranslationHi}
                  </p>
                  <div className="mt-4 grid gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                        Arth — direct meaning
                      </p>
                      <p className="mt-1 text-sm">{arthEn}</p>
                      <p lang="hi" className="mt-1 text-sm text-dharma-muted">
                        {arthHi}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                        Vyakhya — how sages read it
                      </p>
                      <p className="mt-1 text-sm">{vyakhyaEn}</p>
                      <p lang="hi" className="mt-1 text-sm text-dharma-muted">
                        {vyakhyaHi}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">Modern context</p>
                      <p className="mt-1 text-sm">{modernContextEn}</p>
                      <p lang="hi" className="mt-1 text-sm text-dharma-muted">
                        {modernContextHi}
                      </p>
                    </div>
                  </div>
                  <Link href={href} className="mt-4 inline-block min-h-[44px] text-sm font-semibold underline">
                    Read in the library: {verse.referenceDisplay}
                  </Link>
                </article>
              ))}

              {reflections.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Reflect</h3>
                  <ul className="mt-1 space-y-2">
                    {reflections.map((r, j) => (
                      <li key={j} className="text-sm leading-relaxed">
                        {r.en}
                        <span lang="hi" className="block text-dharma-muted">
                          {r.hi}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {contemplations.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold">Contemplate</h3>
                  <ul className="mt-1 space-y-2">
                    {contemplations.map((c, j) => (
                      <li key={j} className="text-sm leading-relaxed">
                        {c.en}
                        <span lang="hi" className="block text-dharma-muted">
                          {c.hi}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {stageConcepts.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {stageConcepts.map((c) => (
                    <li key={c.concept.id}>
                      <Link
                        href={c.href}
                        className="inline-block min-h-[44px] rounded-full border border-dharma-line px-3 py-2 text-sm"
                      >
                        {c.concept.labelEn}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>

        <section className="mt-6 rounded-2xl border border-dharma-line bg-dharma-card p-5">
          <h2 className="font-serif text-xl">What the sages add</h2>
          <p className="mt-2 text-sm leading-relaxed">{pathway.sageNote.en}</p>
          <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-muted">
            {pathway.sageNote.hi}
          </p>
        </section>

        {starterQuestions.length > 0 && (
          <section className="mt-6 rounded-2xl border border-dharma-line bg-dharma-card p-5">
            <h2 className="font-serif text-xl">Questions this path answers</h2>
            <ul className="mt-3 space-y-2">
              {starterQuestions.map((q) => (
                <li key={q.question.id}>
                  <Link href={q.href} className="text-sm font-semibold underline">
                    {q.question.questionEn}
                  </Link>
                  <span lang="hi" className="block text-sm text-dharma-muted">
                    {q.question.questionHi}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(topics.length > 0 || concepts.length > 0) && (
          <section className="mt-6 rounded-2xl border border-dharma-line bg-dharma-card p-5">
            <h2 className="font-serif text-xl">Go deeper</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {topics.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.href}
                    className="inline-block min-h-[44px] rounded-full border border-dharma-line px-3 py-2 text-sm"
                  >
                    {t.slug.replace(/-/g, ' ')}
                  </Link>
                </li>
              ))}
              {concepts.map((c) => (
                <li key={c.concept.id}>
                  <Link
                    href={c.href}
                    className="inline-block min-h-[44px] rounded-full border border-dharma-line px-3 py-2 text-sm"
                  >
                    {c.concept.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {questions.length > 0 && (
          <section className="mt-6 rounded-2xl border border-dharma-line bg-dharma-card p-5">
            <h2 className="font-serif text-xl">Related questions</h2>
            <ul className="mt-3 space-y-2">
              {questions.slice(0, 6).map((q) => (
                <li key={q.question.id}>
                  <Link href={q.href} className="text-sm underline">
                    {q.question.questionEn}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-dharma-line bg-dharma-card p-5">
          <h2 className="font-serif text-xl">Related wisdom pathways</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/wisdom-pathways/${r.slug}/`} className="block rounded-xl bg-dharma-bg p-4 hover:underline">
                  <span className="text-sm font-semibold">{r.titleEn}</span>
                  <span lang="hi" className="block text-sm text-dharma-muted">
                    {r.titleHi}
                  </span>
                  <span className="block text-xs text-dharma-muted">{r.questionEn}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-dharma-muted">
            The canonical telling of this teaching lives at{' '}
            <Link href={`/wisdom-pathways/${pathway.slug}/`} className="underline">
              {pathway.titleEn}
            </Link>
            . Contemplate only — no streaks, no scores, nothing to complete.
          </p>
        </section>
      </div>
    </main>
  );
}
