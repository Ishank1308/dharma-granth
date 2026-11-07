'use client';

import Link from 'next/link';
import type { WisdomPathway } from '@/data/wisdom-pathways';
import type { ResolvedPathwayVerse } from '@/lib/wisdom-pathways';
import { ReflectionBlock } from '@/app/components/pathways/ReflectionBlock';
import { LineageStrip } from '@/app/components/pathways/LineageStrip';

/**
 * Calm pathway reading: introduction, foundations, verses with
 * Arth / Vyakhya / Modern Context, lineage, reflection, related.
 */
export function PathwayDetailClient({
  pathway,
  verses,
  related,
}: {
  pathway: WisdomPathway;
  verses: ResolvedPathwayVerse[];
  related: Array<{ slug: string; titleEn: string; titleHi: string; questionEn: string }>;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-dharma-muted">
        <Link href="/" className="hover:underline">Home</Link>
        <span>/</span>
        <Link href="/wisdom-pathways/" className="hover:underline">Wisdom Pathways</Link>
        <span>/</span>
        <span className="text-dharma-text">{pathway.titleEn}</span>
      </nav>
      <p className="mt-6 text-xs font-bold uppercase tracking-wider text-dharma-muted">{pathway.questionEn}</p>
      <h1 className="mt-2 font-serif text-3xl sm:text-4xl">{pathway.titleEn}</h1>
      <p lang="hi" className="mt-2 font-devanagari text-2xl">{pathway.titleHi}</p>
      <p lang="sa" className="mt-1 text-dharma-muted">{pathway.sanskritSubtitle}</p>
      <p className="mt-3 text-sm text-dharma-muted">{pathway.mastersFocusEn}</p>

      <section className="mt-6 apple-card rounded-card border border-dharma-border bg-dharma-card p-5 sm:p-7">
        <h2 className="font-serif text-xl">Introduction</h2>
        <p className="mt-2 leading-relaxed">{pathway.introduction.en}</p>
        <p lang="hi" className="mt-2 font-devanagari leading-relaxed text-dharma-muted">{pathway.introduction.hi}</p>
      </section>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <section className="apple-card rounded-card border border-dharma-border bg-dharma-card p-5">
          <h2 className="font-serif text-lg">Why humans face this</h2>
          <p className="mt-2 text-sm leading-relaxed">{pathway.whyHumansFace.en}</p>
          <p lang="hi" className="mt-2 font-devanagari text-sm leading-relaxed text-dharma-muted">{pathway.whyHumansFace.hi}</p>
        </section>
        <section className="apple-card rounded-card border border-dharma-border bg-dharma-card p-5">
          <h2 className="font-serif text-lg">Scriptural foundations</h2>
          <p className="mt-2 text-sm leading-relaxed">{pathway.scripturalFoundations.en}</p>
          <p lang="hi" className="mt-2 font-devanagari text-sm leading-relaxed text-dharma-muted">{pathway.scripturalFoundations.hi}</p>
        </section>
      </div>

      <div className="mt-8 space-y-6">
        {verses.map(({ verse, arthEn, arthHi, vyakhyaEn, vyakhyaHi, modernContextEn, modernContextHi, href }) => (
          <article key={verse.id} className="apple-card rounded-card border border-dharma-border bg-dharma-card p-5 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-wider text-dharma-saffron">{verse.referenceDisplay}</p>
            <div className="verse-leaf mt-3 rounded-2xl border border-dharma-border/70 bg-dharma-card-soft p-4 sm:p-5">
              <p lang="sa" className="shloka-text font-sanskrit text-lg sm:text-xl leading-[2] text-dharma-text whitespace-pre-line">
                {verse.sanskritDevanagari}
              </p>
            </div>
            <p className="mt-3 text-sm leading-relaxed">{verse.literalTranslationEn}</p>
            <p lang="hi" className="mt-1 font-devanagari text-sm leading-relaxed text-dharma-muted">{verse.literalTranslationHi}</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-xl bg-dharma-bg p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">Arth — direct meaning</p>
                <p className="mt-1 text-sm">{arthEn}</p>
                <p lang="hi" className="mt-1 font-devanagari text-sm text-dharma-muted">{arthHi}</p>
              </div>
              <div className="rounded-xl bg-dharma-bg p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">Vyakhya — how sages read it</p>
                <p className="mt-1 text-sm">{vyakhyaEn}</p>
                <p lang="hi" className="mt-1 font-devanagari text-sm text-dharma-muted">{vyakhyaHi}</p>
              </div>
              <div className="rounded-xl bg-dharma-bg p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">Modern context</p>
                <p className="mt-1 text-sm">{modernContextEn}</p>
                <p lang="hi" className="mt-1 font-devanagari text-sm text-dharma-muted">{modernContextHi}</p>
              </div>
            </div>
            <Link
              href={href.endsWith('/') ? href : `${href}/`}
              className="focus-ring mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg px-4 py-2 text-xs font-semibold text-dharma-saffron hover:border-saffron-400 transition"
            >
              <span>Read in the library: {verse.referenceDisplay}</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-6">
        <LineageStrip ids={pathway.lineageIds} noteEn={pathway.sageNote.en} noteHi={pathway.sageNote.hi} />
      </div>

      <div className="mt-6">
        <ReflectionBlock questions={pathway.reflectionQuestions} prompts={pathway.contemplationPrompts} />
      </div>

      <section className="mt-6 apple-card rounded-card border border-dharma-border bg-dharma-card p-5 sm:p-6">
        <h2 className="font-serif text-xl">Related wisdom pathways</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/wisdom-pathways/${r.slug}/`} className="block rounded-xl border border-dharma-border/60 bg-dharma-bg p-4 hover:border-saffron-400 transition">
                <span className="text-sm font-semibold text-dharma-text">{r.titleEn}</span>
                <span lang="hi" className="block font-devanagari text-sm text-dharma-muted">{r.titleHi}</span>
                <span className="mt-1 block text-xs text-dharma-muted">{r.questionEn}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
