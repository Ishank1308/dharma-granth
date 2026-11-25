'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { SanskritLexiconEntry } from '@/data/sanskrit-lexicon';
import type { WordGloss } from '@/lib/word-gloss';
import { toAsciiDigits } from '@/lib/verse-format';
import { triggerTactileFeedbackLazy as triggerTactileFeedback } from '@/lib/haptics-lazy';
import { useLocalVerseState } from './useLocalVerseState';
import { VerseRouteLink } from './VerseRouteLink';
import { LITE_COMPAT, RAIL_CARD } from './verse-rail-styles';

export interface ParallelWisdomItem {
  href: string;
  reference: string;
  subtitleHi?: string;
  subtitleEn?: string;
}

export interface VerseContemplationPrompts {
  applyHi?: string;
  applyEn?: string;
  reflectHi?: string;
  reflectEn?: string;
  practiceHi: string;
  practiceEn: string;
}

export interface StudyCompanionRailProps {
  scriptureId: string;
  chapterId: number;
  verseNumber: number | string;
  glosses: WordGloss[];
  lexicon?: Record<string, SanskritLexiconEntry>;
  selectedWordIndex: number;
  onSelectWord: (index: number) => void;
  contemplation: VerseContemplationPrompts;
  parallelLinks: ParallelWisdomItem[];
}

type ContemplationStep = 'apply' | 'reflect' | 'practice';

const railCard = RAIL_CARD;

/**
 * Right sticky rail (`lg:col-span-3`, `lg:sticky lg:top-20 space-y-5`).
 * Provides Active Word Breakdown, 3-Step Contemplation (`त्रि-चरणीय स्वाध्याय`),
 * Private Local Notes (`dharmagranth:note:{scriptureId}:{chapter}:{verse}`), and Parallel Wisdom links.
 */
export function StudyCompanionRail({
  scriptureId,
  chapterId,
  verseNumber,
  glosses,
  lexicon,
  selectedWordIndex,
  onSelectWord,
  contemplation,
  parallelLinks,
}: StudyCompanionRailProps) {
  const [step, setStep] = useState<ContemplationStep>('apply');
  const noteId = useId();
  const tabBaseId = useId();
  const noteTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const CONTEMPLATION_STEPS: ContemplationStep[] = ['apply', 'reflect', 'practice'];

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (event.key === 'ArrowRight') next = (idx + 1) % CONTEMPLATION_STEPS.length;
    else if (event.key === 'ArrowLeft') next = (idx - 1 + CONTEMPLATION_STEPS.length) % CONTEMPLATION_STEPS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = CONTEMPLATION_STEPS.length - 1;
    else return;
    event.preventDefault();
    event.stopPropagation();
    setStep(CONTEMPLATION_STEPS[next]);
    tabRefs.current[next]?.focus();
  };

  const { hydrated, note, setNote, saveStatus, practiceDone, togglePractice } = useLocalVerseState({
    scriptureId,
    chapterId,
    verseId: verseNumber,
  });

  const safeIndex = glosses.length > 0 ? Math.min(Math.max(0, selectedWordIndex), glosses.length - 1) : 0;
  const activeGloss = glosses[safeIndex] ?? null;
  const activeLexicon = activeGloss ? lexicon?.[activeGloss.pada] : undefined;

  const statusLabel =
    !hydrated
      ? 'Local device only'
      : saveStatus === 'saving'
        ? 'Saving…'
        : saveStatus === 'saved'
          ? 'Saved locally'
          : saveStatus === 'unavailable'
            ? 'Session only'
            : 'Private on device';

  return (
    <div className="space-y-5">
      {/* 1 · Active Word Breakdown (पद-विश्लेषण) */}
      <section aria-labelledby={`${tabBaseId}-word-h`} className={railCard}>
        <div className="flex items-center justify-between gap-2">
          <h2 id={`${tabBaseId}-word-h`} className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
            <span>Word Grammar</span>{' '}
            <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari normal-case tracking-normal">पद-विश्लेषण</span>
          </h2>
          {glosses.length > 1 && (
            <div className="inline-flex items-center gap-1">
              <button
                type="button"
                onClick={() => onSelectWord((safeIndex - 1 + glosses.length) % glosses.length)}
                aria-label="Previous word in verse"
                className={`focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-stone-300/70 dark:border-stone-700 text-dharma-text hover:bg-stone-100 dark:hover:bg-stone-800 ${LITE_COMPAT}`}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <span className="px-1 font-mono text-[11px] font-semibold tabular-nums text-dharma-muted">
                {toAsciiDigits(safeIndex + 1)}/{toAsciiDigits(glosses.length)}
              </span>
              <button
                type="button"
                onClick={() => onSelectWord((safeIndex + 1) % glosses.length)}
                aria-label="Next word in verse"
                className={`focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-stone-300/70 dark:border-stone-700 text-dharma-text hover:bg-stone-100 dark:hover:bg-stone-800 ${LITE_COMPAT}`}
              >
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {activeGloss ? (
          <div className="mt-3 min-h-[144px] flex flex-col justify-between rounded-xl border border-amber-700/25 bg-amber-50/50 dark:border-amber-500/25 dark:bg-amber-950/20 p-3">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-1.5">
                <p lang="sa" className="font-devanagari text-lg font-bold text-dharma-text">
                  {activeLexicon?.termDevanagari ?? activeGloss.pada}
                </p>
                {activeLexicon?.termIast && activeLexicon.termIast !== activeGloss.pada && (
                  <span lang="sa-Latn" className="font-serif text-xs italic text-amber-900 dark:text-amber-200">
                    {activeLexicon.termIast}
                  </span>
                )}
              </div>
              {activeLexicon?.termDevanagari && activeLexicon.termDevanagari !== activeGloss.pada && (
                <p lang="sa-Latn" className="font-serif text-xs italic text-amber-900 dark:text-amber-200">
                  {activeGloss.pada}
                </p>
              )}
              <p className="mt-1.5 text-sm leading-relaxed text-dharma-text">
                {activeLexicon?.simpleHindi || activeLexicon?.contextualMeaningHi || activeGloss.meaning}
              </p>
              {activeLexicon?.simpleEnglish && activeLexicon.simpleEnglish !== activeGloss.meaning && (
                <p className="mt-0.5 text-xs leading-relaxed text-dharma-muted">
                  {activeLexicon.simpleEnglish}
                </p>
              )}
            </div>

            {(activeLexicon?.rootDhatu || activeLexicon?.grammarCategory) && (
              <dl className="mt-3 grid grid-cols-1 gap-1.5 border-t border-amber-700/20 dark:border-amber-500/20 pt-2.5 text-xs">
                {activeLexicon.rootDhatu && (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="font-semibold text-dharma-muted">
                      <span lang="hi" className="font-devanagari">धातु</span> · Root
                    </dt>
                    <dd className="text-right font-medium text-dharma-text">
                      {activeLexicon.rootDhatu}
                    </dd>
                  </div>
                )}
                {activeLexicon.grammarCategory && (
                  <div className="flex items-baseline justify-between gap-2">
                    <dt className="font-semibold text-dharma-muted">
                      <span lang="hi" className="font-devanagari">रूप</span> · Form
                    </dt>
                    <dd className="text-right font-medium text-dharma-text">
                      {activeLexicon.grammarCategory}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        ) : (
          <p className="mt-2.5 rounded-xl border border-stone-300/50 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 p-3 text-xs leading-relaxed text-dharma-muted">
            <span lang="hi" className="font-devanagari">
              इस श्लोक का पदच्छेद जुड़ने पर प्रत्येक संस्कृत पद की धातु और व्याकरण यहाँ दिखेगा।
            </span>{' '}
            <span>Word-by-word morphology appears here when padachheda glosses are published for this verse.</span>
          </p>
        )}
      </section>

      {/* 2 · Interactive 3-Step Contemplation (त्रि-चरणीय स्वाध्याय) */}
      <section aria-labelledby={`${tabBaseId}-contemplate-h`} className={railCard}>
        <div className="flex items-center justify-between gap-2">
          <h2 id={`${tabBaseId}-contemplate-h`} className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
            <span lang="hi" className="font-devanagari normal-case tracking-normal text-sm font-semibold text-dharma-text">
              त्रि-चरणीय स्वाध्याय
            </span>{' '}
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-dharma-muted">
              3-Step Contemplation · Not scripture
            </span>
          </h2>
        </div>

        <div
          role="tablist"
          aria-label="Three-step contemplation"
          aria-orientation="horizontal"
          className="mt-3 grid grid-cols-3 gap-1 rounded-xl bg-stone-200/65 dark:bg-stone-900/80 p-1"
        >
          {(
            [
              { id: 'apply', num: '1', hi: 'प्रयोग', en: 'Apply' },
              { id: 'reflect', num: '2', hi: 'मनन', en: 'Reflect' },
              { id: 'practice', num: '3', hi: 'संकल्प', en: 'Practice' },
            ] as const
          ).map((item, idx) => {
            const active = step === item.id;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[idx] = el;
                }}
                id={`${tabBaseId}-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={active}
                aria-controls={`${tabBaseId}-panel-${item.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => {
                  triggerTactileFeedback('selection', 'softTap');
                  setStep(item.id);
                }}
                onKeyDown={(e) => handleTabKeyDown(e, idx)}
                className={`focus-ring flex min-h-[44px] flex-col items-center justify-center rounded-lg px-1.5 py-1 text-center text-xs font-semibold transition [[data-lite-mode=true]_&]:transition-none ${
                  active
                    ? 'bg-dharma-card text-dharma-text shadow-2xs ring-1 ring-amber-600/35'
                    : 'text-dharma-muted hover:text-dharma-text'
                }`}
              >
                <span className="tabular-nums">{item.num}. {item.en}</span>
                <span lang="hi" className="font-devanagari text-[11px] font-normal">
                  {item.hi}
                </span>
              </button>
            );
          })}
        </div>

        <div
          id={`${tabBaseId}-panel-${step}`}
          role="tabpanel"
          aria-labelledby={`${tabBaseId}-tab-${step}`}
          tabIndex={0}
          className="focus-ring mt-3 min-h-[112px] rounded-xl border border-stone-300/50 dark:border-stone-800 bg-stone-100/55 dark:bg-stone-900/45 p-3 text-xs leading-relaxed text-dharma-text"
        >
          {step === 'apply' && (
            <div className="space-y-1.5">
              {contemplation.applyHi && (
                <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-text">
                  {contemplation.applyHi}
                </p>
              )}
              {contemplation.applyEn && (
                <p lang="en" className="text-xs leading-relaxed text-dharma-muted">
                  {contemplation.applyEn}
                </p>
              )}
            </div>
          )}

          {step === 'reflect' && (
            <div className="space-y-2">
              {contemplation.reflectHi && (
                <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-text">
                  {contemplation.reflectHi}
                </p>
              )}
              {contemplation.reflectEn && (
                <p lang="en" className="text-xs leading-relaxed text-dharma-muted">
                  {contemplation.reflectEn}
                </p>
              )}
              <button
                type="button"
                onClick={() => noteTextareaRef.current?.focus()}
                className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-xl border border-amber-700/35 bg-amber-100/75 dark:border-amber-500/35 dark:bg-amber-900/35 px-3 py-1.5 text-xs font-semibold text-amber-950 dark:text-amber-100 hover:border-amber-700/60 [[data-lite-mode=true]_&]:transition-none"
              >
                <span lang="hi" className="font-devanagari">नीचे मनन लिखें</span>
                <span>· Write note ↓</span>
              </button>
            </div>
          )}

          {step === 'practice' && (
            <div className="space-y-2.5">
              <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-text">
                {contemplation.practiceHi}
              </p>
              <p lang="en" className="text-xs leading-relaxed text-dharma-muted">
                {contemplation.practiceEn}
              </p>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-2.5 rounded-xl border border-amber-700/30 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-950/30 px-3 py-2 text-xs font-semibold text-dharma-text transition hover:border-amber-600/60 [[data-lite-mode=true]_&]:transition-none">
                <input
                  type="checkbox"
                  checked={practiceDone}
                  onChange={() => {
                    triggerTactileFeedback('selection', 'softTap');
                    togglePractice();
                  }}
                  className="h-4 w-4 shrink-0 rounded accent-amber-700"
                />
                <span className="flex-1">
                  <span lang="hi" className="font-devanagari">आज का संकल्प पूरा किया</span>
                  {' · '}
                  <span>Practiced today</span>
                </span>
              </label>
            </div>
          )}
        </div>
      </section>

      {/* 3 · Private Local Notes (निजी मनन) */}
      <section aria-labelledby={`${tabBaseId}-note-h`} className={railCard}>
        <div className="flex items-center justify-between gap-2">
          <label htmlFor={noteId} id={`${tabBaseId}-note-h`} className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
            <span>Private Note</span>{' '}
            <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari normal-case tracking-normal">निजी मनन</span>
          </label>
          <span
            role="status"
            aria-live="polite"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-dharma-muted"
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                saveStatus === 'saved'
                  ? 'bg-emerald-600 dark:bg-emerald-400'
                  : saveStatus === 'saving'
                    ? 'bg-amber-600 dark:bg-amber-400'
                    : 'bg-stone-400'
              }`}
            />
            <span>{statusLabel}</span>
          </span>
        </div>

        <textarea
          ref={noteTextareaRef}
          id={noteId}
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your personal reflection on this shloka…"
          className="mt-2.5 w-full resize-y rounded-xl border border-stone-300/70 dark:border-stone-700/80 bg-dharma-bg/85 p-3 text-sm leading-relaxed text-dharma-text outline-none transition placeholder:text-dharma-muted focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 [[data-lite-mode=true]_&]:transition-none"
        />

        <p className="mt-1.5 text-[11px] text-dharma-muted">
          Stored only in this browser — zero cloud sync.
        </p>
      </section>

      {/* 4 · Parallel Wisdom (समान प्रज्ञा) */}
      {parallelLinks.length > 0 && (
        <section aria-labelledby={`${tabBaseId}-parallel-h`} className={railCard}>
          <h2 id={`${tabBaseId}-parallel-h`} className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
            <span>Parallel Wisdom</span>{' '}
            <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari normal-case tracking-normal">समान प्रज्ञा</span>
          </h2>
          <ul className="mt-2.5 space-y-2">
            {parallelLinks.map((item) => (
              <li key={item.href}>
                <VerseRouteLink
                  href={item.href}
                  data-vt="open"
                  className="focus-ring group flex min-h-[44px] items-center justify-between gap-2 rounded-xl border border-stone-300/55 dark:border-stone-800 bg-stone-100/55 dark:bg-stone-900/45 px-3 py-2 text-left transition hover:border-amber-600/55 hover:bg-amber-50/45 dark:hover:bg-stone-800/70 [[data-lite-mode=true]_&]:transition-none"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-semibold text-dharma-text group-hover:text-amber-900 dark:group-hover:text-amber-200">
                      {item.reference}
                    </span>
                    {(item.subtitleHi || item.subtitleEn) && (
                      <span className="mt-0.5 block truncate text-[11px] text-dharma-muted">
                        {item.subtitleHi && (
                          <span lang="hi" className="font-devanagari">{item.subtitleHi}</span>
                        )}
                        {item.subtitleHi && item.subtitleEn && <span aria-hidden="true"> · </span>}
                        {item.subtitleEn && <span>{item.subtitleEn}</span>}
                      </span>
                    )}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-dharma-muted group-hover:text-amber-800 dark:group-hover:text-amber-300" aria-hidden="true" />
                </VerseRouteLink>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
