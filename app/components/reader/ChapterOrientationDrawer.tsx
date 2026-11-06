'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  ChevronDown,
  Clock,
  Compass,
  HelpCircle,
  Layers,
  MapPin,
  ShieldAlert,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import type { GitaChapterSummary } from '@/data/gita-chapter-summaries';
import { getChapterOrientation } from '@/data/chapter-orientation';
import { hasConceptPage } from '@/lib/concept-pages';
import { verseCount as fmtVerses } from '@/lib/format';
const InteractiveChapterMap = dynamic(() => import('@/app/components/InteractiveChapterMap').then((m) => m.InteractiveChapterMap), { ssr: false });
import { triggerTactileFeedback } from '@/lib/haptics';
import { readHref } from '@/lib/verse-paths';

interface Props {
  scriptureId: string;
  chapterId: number;
  verseCount: number;
  chapterSummary?: GitaChapterSummary;
  firstVerseAnchor: string;
  allSummariesHref?: string;
}

type TabType = 'summary' | 'flow' | 'concepts';

export function ChapterOrientationDrawer({
  scriptureId,
  chapterId,
  verseCount,
  chapterSummary,
  firstVerseAnchor,
  allSummariesHref,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const orientation = getChapterOrientation(scriptureId, chapterId);
  const minutes = verseCount > 0 ? Math.max(2, Math.round(verseCount * 0.75)) : null;

  // If no summary and no orientation, nothing to render
  if (!chapterSummary && !orientation) return null;

  const toggleDrawer = () => {
    triggerTactileFeedback('medium', 'softTap');
    setIsOpen((prev) => !prev);
  };

  const handleTabChange = (tab: TabType) => {
    triggerTactileFeedback('light', 'softTap');
    setActiveTab(tab);
  };

  const previewSnippet =
    chapterSummary?.summaryHi ||
    orientation?.narrativeContext ||
    'अध्याय की मुख्य शिक्षा, दार्शनिक संदर्भ और श्लोक प्रवाह';

  return (
    <section
      id="chapter-orientation"
      aria-labelledby="chapter-orientation-heading"
      className="mb-6 overflow-hidden rounded-[24px] border border-stone-200/90 dark:border-stone-800/80 bg-white/95 dark:bg-[#161514]/95 shadow-xs transition-all duration-300 hover:shadow-sm"
    >
      {/* ── Collapsed Header Strip (Always visible - One UI Expansive Reachability) ── */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-saffron-300/70 bg-saffron-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-saffron-800 dark:border-saffron-800 dark:bg-saffron-950/60 dark:text-saffron-300 shadow-2xs">
              <Compass className="h-3 w-3 text-saffron-600 dark:text-saffron-400" />
              <span>अध्याय परिचय · Orientation</span>
            </span>

            {verseCount > 0 && minutes && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-stone-200/60 bg-stone-100/60 px-2.5 py-0.5 text-[10px] font-medium text-dharma-muted dark:border-stone-800/60 dark:bg-stone-900/40">
                <Clock className="h-3 w-3 text-saffron-600" />
                <span>{fmtVerses(verseCount)} · {minutes} मिनट स्वाध्याय</span>
              </span>
            )}
          </div>

          <h2
            id="chapter-orientation-heading"
            className="font-serif text-base sm:text-lg font-bold text-dharma-text truncate"
          >
            {orientation?.nameHi || chapterSummary ? (
              <>
                <span lang="hi">{orientation?.nameHi || 'अध्याय सार व संदर्भ'}</span>
                {orientation?.nameEn && (
                  <span className="text-xs font-normal text-dharma-muted ml-2 font-sans">
                    ({orientation.nameEn})
                  </span>
                )}
              </>
            ) : (
              'About this chapter'
            )}
          </h2>

          <p className="mt-1 line-clamp-1 text-xs text-dharma-muted leading-relaxed">
            {previewSnippet}
          </p>
        </div>

        {/* Quick Actions in Header - Apple Tactile Buttons */}
        <div className="flex shrink-0 items-center gap-2 pt-1 sm:pt-0">
          <a
            href={firstVerseAnchor}
            onClick={() => triggerTactileFeedback('selection', 'softTap')}
            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-all duration-150 hover:brightness-105 active:scale-95"
          >
            <span>श्लोक 1 पर जाएं</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* ── Expanded Drawer Content (Clean Tabbed Experience) ────────────────── */}
      {/* ── Expanded Drawer Content (Apple HIG Segmented Tabs & One UI Grouped Cards) ── */}
      {isOpen && (
        <div className="border-t border-stone-200/80 bg-stone-50/50 p-4 sm:p-6 animate-fade-in dark:border-stone-800/80 dark:bg-stone-900/30">
          {/* Apple HIG Segmented Control */}
          <div
            role="tablist"
            aria-label="Chapter Orientation Tabs"
            className="mb-5 flex flex-wrap items-center gap-1 rounded-full border border-stone-200/80 bg-stone-100/90 p-1 shadow-2xs dark:border-stone-800/80 dark:bg-stone-900/90"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'summary'}
              onClick={() => handleTabChange('summary')}
              className={`inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-1 text-xs transition-all duration-150 active:scale-95 ${
                activeTab === 'summary'
                  ? 'bg-white text-stone-900 shadow-xs font-bold dark:bg-stone-800 dark:text-stone-100'
                  : 'font-medium text-dharma-muted hover:text-dharma-text'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
              <span>अध्याय सार व संघर्ष</span>
            </button>

            {orientation && (orientation.sequence || orientation.mapNodes) && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'flow'}
                onClick={() => handleTabChange('flow')}
                className={`inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-1 text-xs transition-all duration-150 active:scale-95 ${
                  activeTab === 'flow'
                    ? 'bg-white text-stone-900 shadow-xs font-bold dark:bg-stone-800 dark:text-stone-100'
                    : 'font-medium text-dharma-muted hover:text-dharma-text'
                }`}
              >
                <Layers className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
                <span>प्रवाह व मानचित्र</span>
              </button>
            )}

            {orientation && (orientation.concepts.length > 0 || orientation.importantVerses.length > 0) && (
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'concepts'}
                onClick={() => handleTabChange('concepts')}
                className={`inline-flex min-h-[36px] flex-1 items-center justify-center gap-1.5 rounded-full px-3.5 py-1 text-xs transition-all duration-150 active:scale-95 ${
                  activeTab === 'concepts'
                    ? 'bg-white text-stone-900 shadow-xs font-bold dark:bg-stone-800 dark:text-stone-100'
                    : 'font-medium text-dharma-muted hover:text-dharma-text'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
                <span>तत्त्व व मुख्य श्लोक</span>
              </button>
            )}
          </div>

          {/* ── TAB 1: Summary & Narrative Conflict ── */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              {/* Gita Press Traditional Summary */}
              {chapterSummary && (
                <div className="rounded-2xl border border-amber-200/90 bg-dharma-card p-4 sm:p-5 dark:border-amber-900/60">
                  <h3 className="font-serif text-base font-bold text-dharma-text mb-2">
                    अध्याय सार <span className="text-xs font-normal text-dharma-muted">· Traditional Overview</span>
                  </h3>
                  <p lang="hi" className="font-devanagari text-base leading-relaxed text-dharma-text">
                    {chapterSummary.summaryHi}
                  </p>
                  {chapterSummary.summaryEn && (
                    <p lang="en" className="mt-3 text-xs sm:text-sm leading-relaxed text-dharma-muted border-t border-dharma-border/50 pt-2">
                      {chapterSummary.summaryEn}
                    </p>
                  )}
                  {allSummariesHref && (
                    <div className="mt-3 text-right">
                      <Link
                        href={allSummariesHref}
                        className="inline-flex items-center gap-1 text-xs font-bold text-saffron-700 hover:text-saffron-800 dark:text-saffron-400"
                      >
                        <span>सभी अध्यायों का सार देखें</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Narrative Context & Central Conflict */}
              {orientation && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {orientation.narrativeContext && (
                    <div className="rounded-xl border border-dharma-border bg-dharma-card p-4 text-xs sm:text-sm">
                      <strong className="block text-xs uppercase tracking-wider text-saffron-700 dark:text-saffron-400 mb-1">
                        Narrative Context · कथात्मक पृष्ठभूमि
                      </strong>
                      <p className="leading-relaxed text-dharma-text">{orientation.narrativeContext}</p>
                    </div>
                  )}

                  {orientation.centralConflict && (
                    <div className="rounded-xl border border-amber-300/80 bg-amber-50/50 dark:border-amber-900/60 dark:bg-amber-950/20 p-4 text-xs sm:text-sm">
                      <strong className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1">
                        <ShieldAlert className="h-3.5 w-3.5" />
                        <span>Central Conflict · केंद्रीय द्वंद्व</span>
                      </strong>
                      <p className="leading-relaxed text-dharma-text">{orientation.centralConflict}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Dialogue Participants & Central Question */}
              {orientation && (
                <dl className="grid gap-3 sm:grid-cols-2 text-xs">
                  <div className="rounded-xl border border-dharma-border bg-dharma-card p-3.5">
                    <dt className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-dharma-muted">
                      <UserCheck className="h-3.5 w-3.5 text-saffron-600" />
                      <span>संवाद सहभागी (Dialogue Participants)</span>
                    </dt>
                    <dd className="mt-1 text-dharma-text">
                      <strong>वक्ता:</strong> {orientation.speakers}
                    </dd>
                    <dd className="mt-0.5 text-dharma-muted">
                      <strong>श्रोता:</strong> {orientation.listeners}
                    </dd>
                  </div>

                  <div className="rounded-xl border border-dharma-border bg-dharma-card p-3.5">
                    <dt className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-dharma-muted">
                      <HelpCircle className="h-3.5 w-3.5 text-saffron-600" />
                      <span>केंद्रीय प्रश्न (Central Inquiries)</span>
                    </dt>
                    <dd className="mt-1 italic font-serif text-dharma-text">
                      &ldquo;{orientation.centralQuestion}&rdquo;
                    </dd>
                  </div>
                </dl>
              )}
            </div>
          )}

          {/* ── TAB 2: Flow & Interactive Map ── */}
          {activeTab === 'flow' && orientation && (
            <div className="space-y-4">
              {/* Step Sequence */}
              {orientation.sequence && orientation.sequence.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-dharma-muted mb-2">
                    How the chapter unfolds · अध्याय क्रम
                  </h3>
                  <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-1">
                    {orientation.sequence.map((s, i) => (
                      <li key={s.label} className="flex flex-col items-stretch lg:flex-1 lg:flex-row lg:items-center">
                        <div className="flex-1 rounded-xl border border-dharma-border bg-dharma-card p-3 text-xs">
                          <p className="font-semibold text-dharma-text">
                            {s.label}{' '}
                            <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
                              · {s.labelHi}
                            </span>
                          </p>
                          <p className="mt-1 text-dharma-muted">{s.text}</p>
                        </div>
                        {i < orientation.sequence.length - 1 && (
                          <>
                            <ArrowDown className="mx-auto my-0.5 h-3.5 w-3.5 text-dharma-muted lg:hidden" aria-hidden="true" />
                            <ArrowRight className="mx-0.5 hidden h-3.5 w-3.5 shrink-0 text-dharma-muted lg:block" aria-hidden="true" />
                          </>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Thematic Flow Links */}
              {orientation.flow && orientation.flow.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-dharma-muted mb-2">
                    Thematic Stages · विषयवार सोपान
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {orientation.flow.map((f, i) => (
                      <Link
                        key={f.label}
                        href={readHref(scriptureId, chapterId, f.verse)}
                        className="flex flex-col rounded-xl border border-dharma-border bg-dharma-card p-3 text-xs transition hover:border-saffron-400 hover:shadow-2xs"
                      >
                        <span className="font-semibold text-dharma-text">
                          {i + 1}. {f.label}{' '}
                          <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
                            · {f.labelHi}
                          </span>
                        </span>
                        <span className="mt-1 text-[11px] text-dharma-muted">श्लोक {f.range}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Chapter Map */}
              {orientation.mapNodes && orientation.mapNodes.length > 0 && (
                <InteractiveChapterMap
                  scriptureId={scriptureId}
                  chapterId={chapterId}
                  nodes={orientation.mapNodes}
                  chapterConclusion={orientation.chapterConclusion}
                />
              )}
            </div>
          )}

          {/* ── TAB 3: Concepts & Key Verses ── */}
          {activeTab === 'concepts' && orientation && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Concepts list */}
                <div className="rounded-xl border border-dharma-border bg-dharma-card p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 mb-2">
                    Main Concepts · प्रमुख अवधारणाएँ
                  </h3>
                  <ul className="flex flex-wrap gap-1.5">
                    {orientation.concepts.map((c) => (
                      <li key={c}>
                        {hasConceptPage(c.toLowerCase()) ? (
                          <Link
                            href={`/concepts/${c.toLowerCase()}`}
                            className="inline-flex items-center rounded-lg border border-saffron-500/30 bg-saffron-50/70 px-2.5 py-1 text-xs font-semibold text-saffron-800 transition hover:border-saffron-500 dark:bg-amber-950/60 dark:text-amber-100"
                          >
                            {c}
                          </Link>
                        ) : (
                          <span className="inline-flex items-center rounded-lg border border-dharma-border bg-dharma-bg px-2.5 py-1 text-xs text-dharma-muted">
                            {c}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>

                  {orientation.prerequisiteConcepts && orientation.prerequisiteConcepts.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-dharma-border/60">
                      <span className="block text-[11px] font-bold text-dharma-muted uppercase tracking-wider mb-1.5">
                        Concepts to know first · पूर्व ज्ञान
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {orientation.prerequisiteConcepts.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center rounded-md border border-dharma-border/80 px-2 py-0.5 text-[11px] text-dharma-muted"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Important Verses */}
                <div className="rounded-xl border border-dharma-border bg-dharma-card p-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 mb-2">
                    Key Verses · प्रमुख श्लोक
                  </h3>
                  <ul className="space-y-2 text-xs">
                    {orientation.importantVerses.map((v) => (
                      <li key={v.verse} className="flex items-baseline gap-2">
                        <Link
                          href={readHref(scriptureId, chapterId, v.verse)}
                          className="shrink-0 font-bold text-saffron-700 hover:text-saffron-800 dark:text-saffron-300 underline underline-offset-2"
                        >
                          श्लोक {chapterId}.{v.verse}
                        </Link>
                        <span className="text-dharma-muted leading-relaxed">{v.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Drawer Footer Status & Jump Button */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dharma-border/80 pt-3 text-xs text-dharma-muted">
            <span>
              Editorial introduction, not scripture. Status:{' '}
              <strong className="text-dharma-text">
                {orientation?.review === 'approved' ? 'approved' : 'draft, awaiting editorial review'}
              </strong>
            </span>

            <a
              href={firstVerseAnchor}
              onClick={() => {
                triggerTactileFeedback('selection', 'softTap');
                setIsOpen(false);
              }}
              className="inline-flex items-center gap-1 font-bold text-saffron-700 hover:text-saffron-800 dark:text-saffron-400"
            >
              <span>सीधे श्लोक पठन पर जाएं</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
