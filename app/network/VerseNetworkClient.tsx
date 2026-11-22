'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Compass,
  BookOpen,
  Sparkles,
  Search,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Layers,
  Filter,
  Flame,
  Brain,
  Quote,
} from 'lucide-react';
import { VerseGraphNetwork } from '@/app/components/study/VerseGraphNetwork';
import { NetworkHero } from './NetworkHero';
import { FEATURED_SEEDS, type SeedVerse } from './network-seeds';
import { triggerTactileFeedback } from '@/lib/haptics';
import { readHref } from '@/lib/verse-paths';

export function VerseNetworkClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramVerse = searchParams.get('verse');

  const initialSeed = useMemo(() => {
    if (paramVerse) {
      const found = FEATURED_SEEDS.find((s) => s.key === paramVerse);
      if (found) return found;
    }
    return FEATURED_SEEDS[0];
  }, [paramVerse]);

  const [selectedSeed, setSelectedSeed] = useState<SeedVerse>(initialSeed);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (paramVerse) {
      const found = FEATURED_SEEDS.find((s) => s.key === paramVerse);
      if (found && found.key !== selectedSeed.key) {
        setSelectedSeed(found);
      }
    }
  }, [paramVerse, selectedSeed.key]);

  const handleSelectSeed = (seed: SeedVerse) => {
    triggerTactileFeedback('selection', 'click');
    setSelectedSeed(seed);
    router.replace(`/network/?verse=${encodeURIComponent(seed.key)}`, { scroll: false });
  };

  const filteredSeeds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return FEATURED_SEEDS;
    return FEATURED_SEEDS.filter(
      (s) =>
        s.theme.toLowerCase().includes(q) ||
        s.themeHi.includes(q) ||
        s.sanskrit.includes(q) ||
        s.key.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
      <NetworkHero />

      {/* ─── SEED SELECTOR CAROUSEL ───────────────────────────────────────── */}
      <section aria-labelledby="seed-selector-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 id="seed-selector-heading" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
              <span data-bi="en">Select Canonical Verse Node</span> <span data-bi="sep" className="font-devanagari text-base font-normal text-dharma-muted">· </span><span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-base font-normal text-dharma-muted">प्रमुख श्लोक केंद्र</span>
            </h2>
            <p className="text-xs sm:text-sm text-dharma-muted">
              Choose a celebrated verse below to explore its interconnected network across scriptures:
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dharma-muted pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search theme or verse (e.g. Karma, 2.47)..."
              className="w-full rounded-2xl border border-dharma-border bg-dharma-card pl-9 pr-4 py-2 text-xs sm:text-sm text-dharma-text focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
            />
          </div>
        </div>

        {/* Horizontal Ribbon of Seeds */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x">
          {filteredSeeds.map((seed) => {
            const isSelected = seed.key === selectedSeed.key;
            return (
              <button
                key={seed.key}
                type="button"
                onClick={() => handleSelectSeed(seed)}
                className={`snap-start flex-shrink-0 w-72 rounded-2xl border p-4 text-left transition-all relative ${
                  isSelected
                    ? 'border-saffron-500 bg-saffron-500/10 shadow-md ring-2 ring-saffron-500/30'
                    : 'border-dharma-border/80 bg-dharma-card hover:border-saffron-400 hover:bg-dharma-panel'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-saffron-600 dark:text-saffron-400">
                    {seed.scriptureTitle} {seed.chapterId}.{seed.verseId}
                  </span>
                  <span className="text-[10px] font-devanagari opacity-70">
                    {seed.scriptureTitleHi}
                  </span>
                </div>
                <h3 className="font-serif text-sm font-bold text-dharma-text line-clamp-1">
                  {seed.theme}
                </h3>
                <p className="font-devanagari text-xs text-dharma-muted line-clamp-1 mt-0.5">
                  {seed.themeHi}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-dharma-muted line-clamp-2">
                  {seed.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── ACTIVE NODE HIGHLIGHT BAR ─────────────────────────────────────── */}
      <section className="rounded-2xl border border-saffron-500/30 bg-dharma-card p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-dharma-border/60 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
              Active Network Center · वर्तमान केंद्र
            </div>
            <h2 className="font-serif text-2xl font-bold text-dharma-text mt-0.5">
              {selectedSeed.scriptureTitle} {selectedSeed.chapterId}.{selectedSeed.verseId}: {selectedSeed.theme}
            </h2>
          </div>
          <Link
            href={readHref(selectedSeed.scriptureId, selectedSeed.chapterId, selectedSeed.verseId)}
            className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-xl bg-saffron-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-saffron-700 transition"
          >
            <span>Read Full Chapter Verse</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <blockquote className="border-l-4 border-saffron-500 pl-4 py-1 space-y-2">
          <p className="font-devanagari text-lg sm:text-xl font-medium leading-relaxed text-dharma-text">
            {selectedSeed.sanskrit}
          </p>
          <p className="text-sm leading-relaxed text-dharma-muted italic">
            &ldquo;{selectedSeed.translation}&rdquo;
          </p>
        </blockquote>
      </section>

      {/* ─── THE GRAPH NETWORK VISUALIZATION ───────────────────────────────── */}
      <VerseGraphNetwork
        scriptureId={selectedSeed.scriptureId}
        chapterId={selectedSeed.chapterId}
        verseId={selectedSeed.verseId}
        currentVerse={{
          number: selectedSeed.verseId,
          sanskrit: selectedSeed.sanskrit,
          translation: selectedSeed.translation,
        }}
      />

      {/* ─── EDUCATIONAL FOOTNOTE ─────────────────────────────────────────── */}
      <footer className="rounded-2xl border border-dharma-border bg-dharma-panel/60 p-5 text-xs sm:text-sm text-dharma-muted space-y-2">
        <h3 className="font-serif font-bold text-dharma-text text-sm">
          <span data-bi="en">About the Verse Relationship Engine & Methodology</span><span data-bi="sep"> · </span><span lang="hi" data-bi="hi">ज्ञान जाल शोध विधि</span>
        </h3>
        <p className="leading-relaxed">
          The relationships shown in this network are compiled from classical bhashyas (commentaries by Shankaracharya, Ramanujacharya, Madhvacharya, and Vallabhacharya), cross-scriptural concordance indices, and peer-reviewed Vedic philology. No speculative links or machine guesses are shown—each connection represents a conscious thematic echo or direct scriptural citation.
        </p>
      </footer>
    </div>
  );
}
