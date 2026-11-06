import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
import { SacredScriptureCard } from '@/app/components/motion/SacredScriptureCard';

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

const SCRIPTURE_WATERMARKS: Record<string, string> = {
  bhagavadgita: 'गीता',
  ishavasya: 'ईश',
  katha: 'कठ',
  mandukya: 'माण्डूक्य',
  mundaka: 'मुण्डक',
  nityakarmakriya: 'नित्यकर्म',
};

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
      className="relative border-b border-dharma-border bg-gradient-to-b from-dharma-bg via-dharma-card/20 to-dharma-bg py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2.5 flex items-center gap-2">
              <span className="size-2 rounded-full bg-saffron-600 animate-pulse ring-4 ring-saffron-500/20" />
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
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-dharma-muted">
              Explore timeless wisdom preserved in original Sanskrit, accompanied by authentic Hindi meaning and dignified English study notes.
            </p>
          </div>

          <Link
            href="/scriptures/?explained=1"
            className="group inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-5 py-2.5 text-xs font-bold text-dharma-text transition hover:border-amber-400/80 hover:text-saffron-700 hover:shadow-md shadow-xs"
          >
            <span>View Full Library</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>

        {/* Library Stats Row */}
        <dl className="mb-10 flex flex-wrap gap-x-8 gap-y-2.5 rounded-2xl border border-dharma-border/80 bg-dharma-card/50 px-6 py-4 text-xs backdrop-blur-xs">
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

        {/* Six 3D Interactive Manuscript Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* 1. Ashtavakra Gita */}
          <SacredScriptureCard
            href="/ashtavakra/"
            titleEn="Ashtavakra Gita"
            titleSa="अष्टावक्र गीता"
            category="Separate reading"
            description="Sanskrit, the book’s Hindi meaning, and a simple explanation. Chapters 19 and 20 are published and marked review-required."
            holdingLabel={`${formatHolding(ashtavakra.chapters)} Prakaranas · ${formatHolding(ashtavakra.verses)} Verses`}
            watermarkSa="अष्टावक्र"
            isSeparateReading
          />

          {/* 2-6. Featured Core Scriptures */}
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
            ]
              .filter((lang): lang is { id: 'sa' | 'hi' | 'en'; label: string } => lang !== null)
              .map((lang) => {
                const coverage = facts.languageCoverage;
                const count = coverage?.[lang.id];
                const percent =
                  coverage && coverage.totalVerses > 0 && count !== undefined
                    ? Math.round((count / coverage.totalVerses) * 100)
                    : undefined;
                return {
                  id: lang.id,
                  label: lang.label,
                  percent,
                };
              });

            const holdingText = `${formatHolding(held.chapters)} ${
              held.chapters === 1 ? 'Chapter' : 'Chapters'
            } · ${formatHolding(held.verses)} ${held.verses === 1 ? 'Verse' : 'Verses'}${
              note ? ` (${note})` : ''
            }`;

            return (
              <SacredScriptureCard
                key={scripture.id}
                href={`/scripture/${scripture.id}/`}
                titleEn={scripture.title}
                titleSa={scripture.titleSanskrit || scripture.title}
                category={scripture.category}
                description={scripture.description}
                holdingLabel={holdingText}
                watermarkSa={SCRIPTURE_WATERMARKS[scripture.id] || scripture.titleSanskrit}
                languages={languages}
                className={index >= 3 ? 'hidden sm:block' : ''}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
