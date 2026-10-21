
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import {
  getAvailableScriptures,
  getLibraryCounts,
  getRealChapterCount,
  getRealScriptureCount,
  getRealVerseCount,
} from '@/data/scriptures';
import { getLibraryFacts } from '@/lib/library-server';
import { catalogueNote, formatCount as formatHolding } from '@/lib/holdings-label';
import { publishedTotals } from '@/lib/ashtavakra';

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export function FeaturedScripturesSection() {
  const ashtavakra = publishedTotals();
  const availableScriptures = getAvailableScriptures();
  // Ensure we select the 6 compact core scriptures
  const featuredIds = ['bhagavadgita', 'ishavasya', 'katha', 'mandukya', 'mundaka', 'nityakarmakriya'];
  const featured = featuredIds
    .map((id) => availableScriptures.find((s) => s.id === id))
    .filter(Boolean);

  // Fallback to first 6 if any not found
  const displayTexts = featured.length === 6 ? featured : availableScriptures.slice(0, 6);

  const archiveVerses = getRealVerseCount() + ashtavakra.verses;
  const archiveChapters = getRealChapterCount() + ashtavakra.chapters;
  const archiveScriptures = getRealScriptureCount() + (ashtavakra.verses > 0 ? 1 : 0);

  return (
    <section
      aria-labelledby="featured-scriptures-heading"
      className="border-b border-dharma-border bg-dharma-bg py-16 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="size-2 rounded-full bg-saffron-600 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                प्रमुख ग्रंथ · Curated Archive
              </p>
            </div>
            <h2
              id="featured-scriptures-heading"
              className="font-serif text-3xl font-bold text-dharma-text sm:text-4xl"
            >
              Featured Scriptures
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-dharma-muted">
              The Ashtavakra Gita has its own reading. Language labels on the other cards show the share of published verses available in each language.
            </p>
          </div>

          <Link
            href="/scriptures/?explained=1"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-5 py-2.5 text-xs font-bold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 shadow-sm"
          >
            <span>View Full Library</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Library Stats Row */}
        <dl className="mb-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-dharma-border py-4 text-xs">
          <div className="flex items-baseline gap-2">
            <dt className="text-dharma-muted">Texts with verses:</dt>
            <dd className="font-bold text-dharma-text">{formatCount(archiveScriptures)}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-dharma-muted">Chapters in the library:</dt>
            <dd className="font-bold text-dharma-text">{formatCount(archiveChapters)}</dd>
          </div>
          <div className="flex items-baseline gap-2">
            <dt className="text-dharma-muted">Verses in the library:</dt>
            <dd className="font-bold text-dharma-text">{formatCount(archiveVerses)}</dd>
          </div>
        </dl>

        {/* Six Compact Cards Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/ashtavakra/"
            className="group relative flex flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-6 transition-all hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-lg dark:hover:border-amber-700/60"
          >
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-full bg-saffron-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-200 border border-saffron-500/20">
                  Separate reading
                </span>
                <ChevronRight
                  className="h-4 w-4 text-dharma-muted transition-transform group-hover:translate-x-1 group-hover:text-saffron-600"
                  aria-hidden="true"
                />
              </div>
              <h3 className="font-serif text-xl font-bold text-dharma-text group-hover:text-saffron-800 transition">
                Ashtavakra Gita
              </h3>
              <p lang="sa" className="mt-1 font-devanagari text-sm text-saffron-800 dark:text-saffron-200">
                अष्टावक्र गीता
              </p>
              <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-dharma-muted">
                Sanskrit, the book’s Hindi meaning, and a simple explanation. Chapters 19 and 20 are published and marked review-required.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-dharma-border/60 pt-4 text-xs font-semibold text-dharma-muted">
              <span>
                {formatHolding(ashtavakra.chapters)} Prakaranas · {formatHolding(ashtavakra.verses)} Verses
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-saffron-800 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition group-hover:bg-saffron-700">
                Start Reading →
              </span>
            </div>
          </Link>
          {displayTexts.map((scripture, index) => {
            if (!scripture) return null;
            const held = getLibraryCounts(scripture.id);
            const catalogueVerses = scripture.canonicalTotalVerses ?? scripture.totalVerses;
            const note = catalogueNote(held.verses, catalogueVerses, 'verse');
            const facts = getLibraryFacts(scripture.id);
            const languages = [
              facts.languages.sa ? { id: 'sa', label: 'संस्कृत' } : null,
              facts.languages.hi ? { id: 'hi', label: 'हिन्दी' } : null,
              facts.languages.en ? { id: 'en', label: 'English' } : null,
            ].filter((lang): lang is { id: 'sa' | 'hi' | 'en'; label: string } => lang !== null);
            return (
              <Link
                key={scripture.id}
                href={`/scripture/${scripture.id}/`}
                className={`${index >= 3 ? 'hidden sm:flex ' : ''}group relative flex flex-col justify-between rounded-2xl border border-dharma-border bg-dharma-card p-6 transition-all hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-lg dark:hover:border-amber-700/60`}
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-saffron-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 border border-saffron-500/20">
                      {scripture.category}
                    </span>
                    <ChevronRight
                      className="h-4 w-4 text-dharma-muted transition-transform group-hover:translate-x-1 group-hover:text-saffron-600"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="font-serif text-xl font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    {scripture.title}
                  </h3>
                  <p lang="sa" className="mt-1 font-devanagari text-sm text-saffron-800 dark:text-saffron-200">
                    {scripture.titleSanskrit}
                  </p>
                  <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-dharma-muted">
                    {scripture.description}
                  </p>

                  {/* Language availability */}
                  <ul aria-label="Language coverage across published verses" className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-dharma-muted">
                    {languages.map((lang) => {
                      const coverage = facts.languageCoverage;
                      const count = coverage?.[lang.id];
                      const percent = coverage && coverage.totalVerses > 0 && count !== undefined
                        ? (count / coverage.totalVerses) * 100
                        : undefined;
                      const percentLabel = percent === undefined
                        ? undefined
                        : percent > 0 && percent < 1 ? '<1%' : `${Math.round(percent)}%`;
                      const description = percentLabel && coverage && count !== undefined
                        ? `${lang.label}: ${percentLabel} of published verses (${count} of ${coverage.totalVerses})`
                        : lang.label;
                      return (
                        <li key={lang.id} lang={lang.id} title={description} aria-label={description} className="rounded-md border border-dharma-border bg-dharma-bg px-2 py-0.5">
                          {lang.label}
                          {percentLabel && <span className="ml-1 text-[10px]">{percentLabel}</span>}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-dharma-border/60 pt-4 text-xs font-semibold text-dharma-muted">
                  <span>
                    {formatHolding(held.chapters)} {held.chapters === 1 ? 'Chapter' : 'Chapters'} · {formatHolding(held.verses)} {held.verses === 1 ? 'Verse' : 'Verses'}
                    {note && <span className="mt-1 block font-normal">{note}</span>}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-xl bg-saffron-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm transition group-hover:bg-saffron-700">
                      Start Reading →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
