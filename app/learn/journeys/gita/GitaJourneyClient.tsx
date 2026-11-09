'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  CheckCircle2,
  Circle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Volume2,
  Sparkles,
  Flame,
  Heart,
  Eye,
  Filter,
  RefreshCw,
} from 'lucide-react';
import {
  GITA_CHAPTER_JOURNEYS,
  GITA_SHATKAS,
  type GitaChapterJourney,
  type GitaShatkaId,
} from '@/data/gita-journey-data';
import { speakSanskritTerm } from '@/lib/sacred-soundscape';
import { parseStored } from '@/lib/safe-stored';

const STORAGE_KEY = 'dharma-gita-journey-studied';

export function GitaJourneyClient() {
  const [selectedShatka, setSelectedShatka] = useState<GitaShatkaId | 'all'>('all');
  const [studiedChapters, setStudiedChapters] = useState<number[]>([]);
  const [highlightedChapter, setHighlightedChapter] = useState<number | null>(null);
  const [copiedVerseRef, setCopiedVerseRef] = useState<string | null>(null);
  const [playingRef, setPlayingRef] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setStudiedChapters(parseStored<number[]>(stored, []).filter((c) => typeof c === 'number'));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleStudied = (chNum: number) => {
    const updated = studiedChapters.includes(chNum)
      ? studiedChapters.filter((c) => c !== chNum)
      : [...studiedChapters, chNum];
    setStudiedChapters(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const copyVerse = async (text: string, ref: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedVerseRef(ref);
      setTimeout(() => setCopiedVerseRef(null), 2000);
    } catch {
      // ignore
    }
  };

  const playVerse = (sanskrit: string, ref: string) => {
    setPlayingRef(ref);
    speakSanskritTerm(sanskrit);
    setTimeout(() => setPlayingRef(null), 4000);
  };

  const scrollToChapter = (chNum: number) => {
    setHighlightedChapter(chNum);
    const element = document.getElementById(`chapter-${chNum}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => setHighlightedChapter(null), 3000);
  };

  const filteredChapters = useMemo(() => {
    if (selectedShatka === 'all') return GITA_CHAPTER_JOURNEYS;
    return GITA_CHAPTER_JOURNEYS.filter((c) => c.shatka === selectedShatka);
  }, [selectedShatka]);

  const completionPercent = Math.round((studiedChapters.length / 18) * 100);

  return (
    <div className="space-y-12">
      {/* ─── 1. PROGRESS BAR & HERO STATS ─────────────────────────────────── */}
      <section
        aria-label="Study Progress"
        className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
              Personal Study Tracker · स्वाध्याय प्रगति
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text mt-1">
              {isClient ? `${studiedChapters.length} of 18 Chapters Studied` : '18 Chapters Roadmap'}
            </h2>
            <p className="text-xs sm:text-sm text-dharma-muted">
              Tick chapters as you read or contemplate them. Saved privately on this device.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-serif text-3xl font-extrabold text-saffron-600">
              {isClient ? `${completionPercent}%` : '0%'}
            </span>
            {studiedChapters.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setStudiedChapters([]);
                  localStorage.removeItem(STORAGE_KEY);
                }}
                className="inline-flex items-center gap-1 text-xs text-dharma-muted hover:text-red-500 transition"
                title="Reset Progress"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress line */}
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-dharma-bg border border-dharma-border/60">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-saffron-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${isClient ? completionPercent : 0}%` }}
          />
        </div>
      </section>

      {/* ─── 2. DILEMMA COMPASS QUICK SELECTOR ────────────────────────────── */}
      <section
        aria-labelledby="dilemma-compass-heading"
        className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-saffron-500/5 to-transparent p-6 sm:p-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-5 h-5 text-saffron-600" />
          <h2 id="dilemma-compass-heading" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
            The Dilemma Compass (जीवन-संशय समाधान)
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-dharma-muted mb-6">
          What inner conflict, doubt, or crisis are you facing right now? Click any dilemma to jump straight to Sri Krishna’s counsel in that chapter.
        </p>

        <div className="flex flex-wrap gap-2.5">
          {GITA_CHAPTER_JOURNEYS.map((ch) => (
            <button
              key={ch.chapter}
              type="button"
              onClick={() => scrollToChapter(ch.chapter)}
              className="group inline-flex items-center gap-2 rounded-2xl border border-dharma-border bg-dharma-card px-3.5 py-2 text-xs font-semibold text-dharma-text transition hover:border-saffron-500 hover:bg-saffron-500/10"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-saffron-500/20 text-[10px] font-bold text-saffron-800 dark:text-saffron-300">
                {ch.chapter}
              </span>
              <span>{ch.dilemmaTag}</span>
              <span className="text-[11px] font-devanagari text-dharma-muted group-hover:text-saffron-800 dark:group-hover:text-saffron-300">
                ({ch.dilemmaTagHi})
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ─── 3. THE 3 SHATKAS ARCHITECTURE ────────────────────────────────── */}
      <section aria-labelledby="shatkas-heading" className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-semibold text-saffron-800 dark:text-saffron-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mahavakya Architecture · तत्त्वमसि</span>
          </div>
          <h2 id="shatkas-heading" className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text">
            The 3 Classical Shatkas of Srimad Bhagavad Gita
          </h2>
          <p className="text-xs sm:text-sm text-dharma-muted mt-1">
            Centuries of classical Vedantic commentators (Adi Shankara, Ramanuja, Madhva) categorize the 18 chapters into three profound six-chapter movements matching the Upanishadic Mahavakya: <strong>Tat Tvam Asi (That Thou Art)</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(['karma', 'bhakti', 'jnana'] as GitaShatkaId[]).map((shatkaKey) => {
            const sh = GITA_SHATKAS[shatkaKey];
            const isSelected = selectedShatka === shatkaKey;

            return (
              <button
                key={sh.id}
                type="button"
                onClick={() => setSelectedShatka(isSelected ? 'all' : shatkaKey)}
                className={`text-left rounded-3xl border p-5 sm:p-6 transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-saffron-500 ring-2 ring-saffron-500/30 bg-saffron-500/10'
                    : 'border-dharma-border bg-dharma-card hover:border-dharma-border/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                      {sh.chaptersRange}
                    </span>
                    <span className="text-xs font-bold text-dharma-muted">{sh.mahavakyaPart}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-dharma-text">
                    {sh.name}
                  </h3>
                  <p lang="hi" className="font-devanagari text-xs text-saffron-800 dark:text-saffron-300 font-semibold mb-3">
                    {sh.nameHi}
                  </p>

                  <p className="text-xs text-dharma-muted leading-relaxed">
                    {sh.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-dharma-border/60 flex items-center justify-between text-xs">
                  <span className="font-medium text-dharma-text">{sh.themeHi}</span>
                  <span className="text-saffron-600 font-semibold">{isSelected ? 'Active Filter ✓' : 'Filter Chapters →'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── 4. CHAPTERS FILTER CONTROLS ─────────────────────────────────── */}
      <section className="flex flex-wrap items-center justify-between gap-4 border-b border-dharma-border pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-dharma-muted" />
          <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
            Showing {filteredChapters.length} of 18 Chapters
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedShatka('all')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedShatka === 'all'
                ? 'bg-saffron-600 text-white'
                : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
            }`}
          >
            All 18
          </button>
          <button
            type="button"
            onClick={() => setSelectedShatka('karma')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedShatka === 'karma'
                ? 'bg-amber-600 text-white'
                : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-amber-400'
            }`}
          >
            Karma (1–6)
          </button>
          <button
            type="button"
            onClick={() => setSelectedShatka('bhakti')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedShatka === 'bhakti'
                ? 'bg-rose-600 text-white'
                : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-rose-400'
            }`}
          >
            Bhakti (7–12)
          </button>
          <button
            type="button"
            onClick={() => setSelectedShatka('jnana')}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
              selectedShatka === 'jnana'
                ? 'bg-indigo-600 text-white'
                : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-indigo-400'
            }`}
          >
            Jnana (13–18)
          </button>
        </div>
      </section>

      {/* ─── 5. THE 18 ADHYAYAS INTERACTIVE DIRECTORY ─────────────────────── */}
      <section aria-labelledby="chapter-directory-heading" className="space-y-8">
        <h2 id="chapter-directory-heading" className="sr-only">
          Bhagavad Gita 18 Chapters Journey
        </h2>

        {filteredChapters.map((ch) => {
          const isStudied = studiedChapters.includes(ch.chapter);
          const isHighlighted = highlightedChapter === ch.chapter;
          const shatkaMeta = GITA_SHATKAS[ch.shatka];
          const fullVerseShareText = `${ch.keyVerse.ref}\n${ch.keyVerse.sanskrit}\n\nअर्थ: ${ch.keyVerse.hindi}\n\nEnglish: ${ch.keyVerse.english}`;

          return (
            <article
              key={ch.chapter}
              id={`chapter-${ch.chapter}`}
              className={`rounded-3xl border bg-dharma-card p-6 sm:p-8 transition shadow-xs space-y-6 ${
                isHighlighted
                  ? 'border-saffron-500 ring-4 ring-saffron-500/20'
                  : 'border-dharma-border'
              }`}
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dharma-border/60 pb-5">
                <div className="flex items-start sm:items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-saffron-500/15 border border-saffron-500/30 text-base font-bold text-saffron-800 dark:text-saffron-300">
                    {ch.chapter}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${shatkaMeta.badgeColor}`}>
                        {shatkaMeta.name.split(' ')[0]} Shatka
                      </span>
                      <span className="text-xs text-dharma-muted">
                        {ch.versesCount} Verses (श्लोक)
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
                      Chapter {ch.chapter}: {ch.title}
                    </h3>
                    <p lang="sa" className="font-devanagari text-base sm:text-lg font-semibold text-saffron-800 dark:text-saffron-300">
                      अध्याय {ch.chapter}: {ch.titleHi} ({ch.sanskritName})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleStudied(ch.chapter)}
                    className={`focus-ring inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                      isStudied
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
                        : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
                    }`}
                  >
                    {isStudied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Studied ✓</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-4 h-4" />
                        <span>Mark Studied</span>
                      </>
                    )}
                  </button>

                  <Link
                    href={`/scripture/bhagavadgita/chapter/${ch.chapter}/`}
                    className="focus-ring inline-flex items-center gap-1.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 px-3.5 py-2 text-xs font-bold text-white transition shadow-xs"
                  >
                    <span>Read Chapter</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Dual-Column: Crisis vs Counsel */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Arjuna's Crisis */}
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-4 sm:p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-300">
                    <span className="flex h-2 w-2 rounded-full bg-rose-500" />
                    <span>Arjuna’s Crisis & Dilemma · विषाद व संशय</span>
                  </div>
                  <p lang="hi" className="font-devanagari text-sm font-medium text-dharma-text leading-relaxed">
                    {ch.arjunaCrisisHi}
                  </p>
                  <p className="text-xs text-dharma-muted italic leading-relaxed pt-1">
                    {ch.arjunaCrisis}
                  </p>
                </div>

                {/* Sri Krishna's Resolution */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 sm:p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Sri Krishna’s Resolution · भगवद् समाधान</span>
                  </div>
                  <p lang="hi" className="font-devanagari text-sm font-medium text-dharma-text leading-relaxed">
                    {ch.krishnaCounselHi}
                  </p>
                  <p className="text-xs text-dharma-muted italic leading-relaxed pt-1">
                    {ch.krishnaCounsel}
                  </p>
                </div>
              </div>

              {/* Centerpiece Verse Shloka Box */}
              <div className="rounded-2xl border border-amber-300/40 dark:border-amber-800/40 bg-amber-50/60 dark:bg-amber-950/20 p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-amber-300/30 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                    Centerpiece Mahavakya ({ch.keyVerse.ref})
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => playVerse(ch.keyVerse.sanskrit, ch.keyVerse.ref)}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-300/60 bg-amber-100/50 dark:bg-amber-900/40 px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-200/50"
                      aria-label="Listen to Sanskrit recitation"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${playingRef === ch.keyVerse.ref ? 'animate-pulse text-saffron-600' : ''}`} />
                      <span>{playingRef === ch.keyVerse.ref ? 'Reciting…' : 'उच्चारण'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => copyVerse(fullVerseShareText, ch.keyVerse.ref)}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-300/60 bg-amber-100/50 dark:bg-amber-900/40 px-2.5 py-1 text-[11px] font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-200/50"
                      aria-label="Copy verse text"
                    >
                      {copiedVerseRef === ch.keyVerse.ref ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p
                  lang="sa"
                  className="font-devanagari text-lg sm:text-xl font-bold leading-relaxed text-amber-950 dark:text-amber-100 whitespace-pre-line text-center py-1"
                >
                  {ch.keyVerse.sanskrit}
                </p>
                <p className="text-xs sm:text-sm font-serif italic text-dharma-muted text-center whitespace-pre-line">
                  {ch.keyVerse.iast}
                </p>

                <div className="pt-2 border-t border-amber-300/30 text-xs sm:text-sm text-dharma-text space-y-1">
                  <p lang="hi" className="font-devanagari">
                    <strong>भावार्थ:</strong> {ch.keyVerse.hindi}
                  </p>
                  <p className="font-serif text-xs text-dharma-muted italic">
                    <strong>English:</strong> {ch.keyVerse.english}
                  </p>
                </div>
              </div>

              {/* Life Application */}
              <div className="rounded-2xl border border-dharma-border bg-dharma-bg/60 p-4 sm:p-5 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-saffron-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <strong className="text-dharma-text font-bold block">
                    दैनिक जीवन में प्रयोग (Daily Life Application):
                  </strong>
                  <p lang="hi" className="font-devanagari text-dharma-text leading-relaxed">
                    {ch.lifeApplicationHi}
                  </p>
                  <p className="text-xs text-dharma-muted italic leading-relaxed">
                    {ch.lifeApplication}
                  </p>
                </div>
              </div>

              {/* Footer link to chapter verses */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-dharma-muted">
                  Focus: <strong>{ch.dilemmaSummary}</strong>
                </span>

                <Link
                  href={`/scripture/bhagavadgita/chapter/${ch.chapter}/`}
                  className="inline-flex items-center gap-1 font-bold text-saffron-800 dark:text-saffron-300 hover:underline"
                >
                  <span>अध्याय {ch.chapter} सम्पूर्ण पाठ व व्याख्या</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
