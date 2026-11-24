'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ChevronLeft, ChevronRight, Eye, RotateCcw, Sparkles } from 'lucide-react';
import { learningPaths } from '@/data/learning-paths';

interface RecallCardItem {
  id: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pathId: string;
  pathTitle: string;
  term: string;
  sanskrit: string;
  transliteration: string;
  definition: string;
  philosophicalContext: string;
  scriptureAnchor: string;
}

const STORAGE_KEY = 'dharma.learn.conceptRecall.v1';

export function InteractiveShravanaStudio() {
  const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [cardIdx, setCardIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        setMasteredIds(parsed.filter((s): s is string => typeof s === 'string'));
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const allCards = useMemo<RecallCardItem[]>(() => {
    const out: RecallCardItem[] = [];
    for (const path of learningPaths) {
      for (const c of path.keyConcepts ?? []) {
        out.push({
          id: `${path.id}:${c.id}`,
          difficulty: path.difficulty,
          pathId: path.id,
          pathTitle: path.title,
          term: c.term,
          sanskrit: c.sanskrit,
          transliteration: c.transliteration,
          definition: c.definition,
          philosophicalContext: c.philosophicalContext,
          scriptureAnchor: c.scriptureAnchor,
        });
      }
    }
    return out;
  }, []);

  const cards = useMemo(() => {
    if (levelFilter === 'all') return allCards;
    return allCards.filter((c) => c.difficulty === levelFilter);
  }, [allCards, levelFilter]);

  const safeIdx = cards.length > 0 ? cardIdx % cards.length : 0;
  const active = cards[safeIdx] ?? null;
  const isMastered = active ? masteredIds.includes(active.id) : false;

  const toggleMastered = () => {
    if (!active) return;
    const next = isMastered
      ? masteredIds.filter((id) => id !== active.id)
      : [...masteredIds, active.id];
    setMasteredIds(next);
    try {
      if (next.length === 0) window.localStorage.removeItem(STORAGE_KEY);
      else window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  if (!active) return null;

  return (
    <section
      id="learn-shravana-studio"
      aria-labelledby="learn-shravana-heading"
      className="mx-auto max-w-content px-gutter pt-12"
    >
      <div className="apple-card p-5 sm:p-7 space-y-5 border border-dharma-border">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dharma-border pb-4">
          <div className="space-y-1">
            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-dharma-saffron">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span lang="hi" data-bi="hi" className="font-devanagari normal-case">संवादात्मक स्मरण अभ्यास · उपकरण पर सुरक्षित</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">Interactive Concept Recall · Saved on Device</span>
            </p>
            <h2 id="learn-shravana-heading" className="text-title-2 font-semibold text-dharma-text">
              <span data-bi="en">Quick Concept Studio</span>
              <span data-bi="sep"> · </span>
              <span lang="hi" data-bi="hi" className="font-devanagari">त्वरित तत्त्व-स्मरण स्टूडियो</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-dharma-border bg-dharma-bg px-3 py-1 font-mono text-xs font-semibold tabular-nums text-dharma-saffron">
              {masteredIds.length} / {allCards.length} स्पष्ट
            </span>
            {masteredIds.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setMasteredIds([]);
                  try {
                    window.localStorage.removeItem(STORAGE_KEY);
                  } catch {}
                }}
                aria-label="स्मरण प्रगति रीसेट करें · Reset recall progress"
                className="focus-ring inline-flex min-h-[38px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-bg px-3 text-xs text-dharma-muted hover:text-dharma-text"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div role="group" aria-label="स्तर चयन · Concept level" className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'all', en: 'All', hi: 'सभी' },
                { id: 'beginner', en: 'Beginner', hi: 'प्रारम्भिक' },
                { id: 'intermediate', en: 'Intermediate', hi: 'मध्यम' },
                { id: 'advanced', en: 'Advanced', hi: 'उन्नत' },
              ] as const
            ).map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                aria-pressed={levelFilter === lvl.id}
                onClick={() => {
                  setLevelFilter(lvl.id);
                  setCardIdx(0);
                  setRevealed(false);
                }}
                className={`focus-ring min-h-[40px] rounded-full border px-3.5 text-xs font-semibold transition ${
                  levelFilter === lvl.id
                    ? 'border-dharma-saffron bg-dharma-saffron text-dharma-bg'
                    : 'border-dharma-border bg-dharma-bg/70 text-dharma-text hover:border-dharma-saffron/50'
                }`}
              >
                <span data-bi="en">{lvl.en}</span>
                <span data-bi="sep"> · </span>
                <span lang="hi" data-bi="hi" className="font-devanagari">{lvl.hi}</span>
              </button>
            ))}
          </div>

          <span className="font-mono text-xs tabular-nums text-dharma-muted">
            Card {safeIdx + 1} / {cards.length}
          </span>
        </div>

        {/* Active Recall Card */}
        <div className="rounded-2xl border border-dharma-border bg-dharma-bg/65 p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-dharma-saffron">{active.scriptureAnchor}</p>
              <p lang="sa" className="mt-1 font-devanagari text-2xl sm:text-3xl font-semibold text-dharma-text">
                {active.sanskrit}
              </p>
              <p className="text-sm font-semibold text-dharma-text">
                {active.term}{' '}
                <span className="font-serif font-normal italic text-dharma-muted">({active.transliteration})</span>
              </p>
            </div>

            <button
              type="button"
              aria-pressed={isMastered}
              onClick={toggleMastered}
              className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition ${
                isMastered
                  ? 'border-emerald-600 bg-emerald-600 text-white'
                  : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-dharma-saffron'
              }`}
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span lang="hi" data-bi="hi" className="font-devanagari">{isMastered ? 'स्पष्ट है' : 'स्पष्ट चिह्नित करें'}</span>
              <span data-bi="en-only">{isMastered ? 'Mastered' : 'Mark clear'}</span>
            </button>
          </div>

          {!revealed ? (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-full bg-dharma-saffron px-5 text-xs font-semibold text-dharma-bg transition hover:opacity-90"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                <span lang="hi" data-bi="hi" className="font-devanagari">अर्थ एवं दार्शनिक संदर्भ देखें</span>
                <span data-bi="en-only">Reveal Meaning & Context</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 border-t border-dharma-border pt-4">
              <p className="text-sm sm:text-base leading-relaxed text-dharma-text">{active.definition}</p>
              <p className="rounded-xl border border-dharma-border bg-dharma-card p-3.5 text-xs sm:text-sm leading-relaxed text-dharma-muted">
                <strong className="text-dharma-text">Philosophical Context:</strong> {active.philosophicalContext}
              </p>
              <Link
                href={`/learn/${active.pathId}/`}
                className="focus-ring inline-flex min-h-[40px] items-center gap-1.5 text-xs font-semibold text-dharma-saffron hover:underline"
              >
                <span>Open pathway: {active.pathTitle}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-dharma-border/60">
            <button
              type="button"
              onClick={() => {
                setCardIdx((i) => (i - 1 + cards.length) % cards.length);
                setRevealed(false);
              }}
              aria-label="पिछली अवधारणा · Previous concept"
              className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card px-4 text-xs font-semibold text-dharma-text hover:border-dharma-saffron"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span lang="hi" data-bi="hi" className="font-devanagari">पिछला</span>
              <span data-bi="en-only">Previous</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCardIdx((i) => (i + 1) % cards.length);
                setRevealed(false);
              }}
              aria-label="अगली अवधारणा · Next concept"
              className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card px-4 text-xs font-semibold text-dharma-text hover:border-dharma-saffron"
            >
              <span lang="hi" data-bi="hi" className="font-devanagari">अगला</span>
              <span data-bi="en-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
