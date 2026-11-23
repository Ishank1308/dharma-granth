'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { PadaLine } from '@/app/components/PadaLine';
import {
  ChevronDown,
  Compass,
  Languages,
  Lightbulb,
  ScrollText,
  Sparkles,
  Search,
} from 'lucide-react';
import { cleanVerseField, meaningState, MEANING_COPY, verseLines, verseMarkNumber, formatVerseRef } from '@/lib/verse-format';
import { parseWordMeanings, type WordGloss } from '@/lib/word-gloss';
import { ExplainLine } from '@/app/components/study/ExplainLine';
// Shown only for some reading modes, so each loads when it first renders, not with every verse page.
const CompareViews = dynamic(() => import('@/app/components/study/CompareViews').then((m) => m.CompareViews));
const SanskritWordExplorerDrawer = dynamic(() => import('@/app/components/understand/SanskritWordExplorerDrawer').then((m) => m.SanskritWordExplorerDrawer), { ssr: false });
const PadachhedaWordDialog = dynamic(() => import('@/app/components/reader/PadachhedaWordDialog').then((m) => m.PadachhedaWordDialog), { ssr: false });
import type { SanskritLexiconEntry } from '@/data/sanskrit-lexicon';
import type { ReaderProvenance, ReaderVerseText } from '@/lib/reader-actions';
import type { ReaderSettings } from '@/lib/useReaderSettings';
import type { VerseInsight } from '@/lib/verse-insights';
import { EDITORIAL_DRAFT_LABEL } from '@/lib/editorial-terminology';
import { VerseTreeStructure, type VerseTreeBranch } from '@/app/components/reader/VerseTreeStructure';
import { ModernContextBody, ReflectionBody, parseModernContext } from '@/app/components/ModernContextBlock';
import { SACRED_SECTION_LABEL } from '@/lib/sacred-reading-order';
import Link from 'next/link';

/* ── Type scale: full class strings so Tailwind keeps them ──────────── */

/** Fluid across phone → tablet → desktop; each setting stays larger than the one below.
 * rem floors respect browser zoom, while caps keep Sanskrit comfortable inside the reading column. */
const SANSKRIT_SIZE = {
  sm: 'text-[clamp(1.125rem,calc(0.9rem+1.1vw),1.5rem)]',
  md: 'text-[clamp(1.25rem,calc(1rem+1.6vw),1.875rem)]',
  lg: 'text-[clamp(1.45rem,calc(1.05rem+2.1vw),2.25rem)]',
  xl: 'text-[clamp(1.65rem,calc(1.2rem+2.5vw),2.75rem)]',
} as const;

const TRANSLATION_SIZE = {
  sm: 'text-[0.95rem]',
  md: 'text-base sm:text-[1.075rem]',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
} as const;

// Devanagari carries stacked marks above and below the line, so it needs generous leading (>= 1.95 normal) so matras never clip.
const DEVANAGARI_LEADING = {
  compact: 'leading-[1.8]',
  normal: 'leading-[1.95]',
  relaxed: 'leading-[2.05]',
  loose: 'leading-[2.35]',
} as const;

const LATIN_LEADING = {
  compact: 'leading-snug',
  normal: 'leading-normal',
  relaxed: 'leading-relaxed',
  loose: 'leading-loose',
} as const;

/* ── The six kinds of content, each with its own frame, chip and icon ─── */

type Kind = 'source' | 'aid' | 'translation' | 'editorial' | 'reflection' | 'research' | 'sources';

const KINDS: Record<Kind, { chip: string; chipHi: string }> = {
  source: { chip: 'Source scripture', chipHi: 'मूल पाठ' },
  aid: { chip: 'Reading aid for the source', chipHi: 'मूल पाठ सहायक' },
  translation: { chip: 'Translation', chipHi: 'अनुवाद' },
  editorial: { chip: 'Editorial explanation', chipHi: 'संपादकीय व्याख्या' },
  reflection: { chip: 'Modern reflection · not scripture', chipHi: 'आधुनिक चिंतन' },
  research: { chip: 'Research context · not scripture', chipHi: 'शोध संदर्भ' },
  sources: { chip: 'Sources and edition', chipHi: 'स्रोत' },
};

function AiBadge({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <span title={title} className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-950 dark:border-violet-400/40 dark:bg-violet-900/40 dark:text-violet-100">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * One layer of the page. `collapsible` layers are native <details>: open in
 * the server HTML (so every reader and crawler gets the text), then closed on
 * phones after mount so a long verse page stays scannable.
 */
function Layer({
  id,
  kind,
  title,
  titleHi,
  badge,
  collapsible = false,
  children,
}: {
  id: string;
  kind: Kind;
  title: string;
  titleHi?: string;
  badge?: ReactNode;
  collapsible?: boolean;
  children: ReactNode;
}) {
  const k = KINDS[kind];
  const ref = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (collapsible && ref.current && window.matchMedia('(max-width: 639px)').matches) ref.current.open = false;
  }, [collapsible]);

  // Apple-style layer heading: a small label naming what kind of text this is (source or interpretation), then the title.
  const head = (
    <>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-semibold text-dharma-muted">
          <span lang="hi" className="font-devanagari">{k.chipHi}</span>
          <span aria-hidden="true"> · </span>
          <span>{k.chip}</span>
        </span>
        <span className={`mt-0.5 block font-sans font-semibold tracking-[-0.02em] text-dharma-text ${kind === 'source' ? 'sr-only' : 'text-body sm:text-[19px]'}`}>
          <span id={`${id}-title`}>{title}</span>{' '}
          {titleHi && (
            <span lang="hi" className="ml-1 font-devanagari text-[0.95rem] font-normal text-dharma-muted">
              {titleHi}
            </span>
          )}
        </span>
      </span>
      {badge}
    </>
  );

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative rounded-card ${kind === 'source' ? 'verse-card single-verse px-3 py-3 sm:px-5 sm:py-4' : 'bg-dharma-card h-full'}`}
    >
      {collapsible ? (
        <details ref={ref} open className="group">
          <summary className="focus-ring flex min-h-[56px] cursor-pointer list-none items-center gap-3 rounded-[18px] px-4 py-3 sm:px-6 [&::-webkit-details-marker]:hidden">
            {head}
            <ChevronDown className="h-5 w-5 shrink-0 text-dharma-muted transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className="px-4 pb-5 sm:px-6">{children}</div>
        </details>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 px-3 pt-2 sm:px-4">{head}</div>
          <div className={kind === 'source' ? 'pt-1' : 'px-4 pb-5 pt-3 sm:px-6'}>{children}</div>
        </>
      )}
    </section>
  );
}

/* ── Word-by-word ──────────────────────────────────────────────────── */

export { parseWordMeanings, type WordGloss } from '@/lib/word-gloss';

const dash = (s: string) => s.replace(/[\s|।॥0-9.]+$/, '');

const aidToggle =
  'focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-full border border-separator/60 bg-dharma-text/[0.06] px-4 py-2 text-footnote font-medium text-dharma-text transition hover:bg-dharma-text/[0.1] active:scale-[0.98] aria-expanded:border-dharma-saffron/40 aria-expanded:bg-dharma-saffron/15 aria-expanded:text-dharma-saffron';

/* ── The layers: root shloka, then the अर्थ → व्याख्या → विज्ञान tree ── */

export function ReaderLayers({
  scriptureId,
  verse,
  chapterId,
  provenance: p,
  settings,
  onUpdateSetting,
  insight,
  sourceStatus,
  selectedWordIndex = 0,
  onSelectWord,
}: {
  scriptureId: string;
  verse: ReaderVerseText;
  chapterId: number;
  provenance: ReaderProvenance;
  settings: ReaderSettings;
  onUpdateSetting?: <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => void;
  /** Reviewed मर्म line and जीवन प्रसंग chips, when this verse has them. */
  insight?: VerseInsight;
  /** Status chips rendered by the page (TrustBadges), placed at the top of the Sources card. */
  sourceStatus?: ReactNode;
  /** Active interactive padachheda pill index, synced with StudyCompanionRail. */
  selectedWordIndex?: number;
  onSelectWord?: (index: number) => void;
}) {
  const [activeLexiconEntry, setActiveLexiconEntry] = useState<SanskritLexiconEntry | null>(null);
  const [selectedWordGloss, setSelectedWordGloss] = useState<{
    pada: string;
    meaning: string;
    lexicon?: SanskritLexiconEntry;
  } | null>(null);

  const sanskrit = cleanVerseField(verse.sanskrit);
  const lines = sanskrit ? verseLines(sanskrit) : [];
  const glosses = parseWordMeanings(verse.wordMeaning);
  const devLeading = DEVANAGARI_LEADING[settings.lineSpacing];
  const latinLeading = LATIN_LEADING[settings.lineSpacing];
  const tSize = TRANSLATION_SIZE[settings.translationSize];
  const aiCommentary = p.commentaryIsAi ? <AiBadge title={EDITORIAL_DRAFT_LABEL.detail}>{EDITORIAL_DRAFT_LABEL.en}</AiBadge> : undefined;

  const perspective = settings.perspective || 'beginner';

  const isQuick = settings.readerMode === 'quick';
  const isTraditional = settings.readerMode === 'traditional';
  const isDeep = settings.readerMode === 'deep' || isTraditional || perspective === 'researcher' || perspective === 'student';

  // Language preferences
  const showHindiTrans =
    settings.showHindi &&
    (settings.preferredLanguage === 'all' || settings.preferredLanguage === 'hindi' || isDeep);
  const showEnglishTrans =
    settings.showEnglish &&
    (settings.preferredLanguage === 'all' || settings.preferredLanguage === 'english' || isDeep);

  // The अर्थ branch is on every verse; a meaning not written yet says so in its place.
  const meaningNow = meaningState(verse);
  const hasArth = showHindiTrans || showEnglishTrans;
  const bothPending = showHindiTrans && showEnglishTrans && meaningNow.hi === 'pending' && meaningNow.en === 'pending';
  const hasPadas = Boolean(settings.showCommentary && !isQuick && !settings.liteMode && glosses.length > 0);
  const [showPadas, setShowPadas] = useState(false);
  const showMarma = Boolean(insight?.marma && settings.showCommentary && !settings.liteMode);
  // Sacred reading order (lib/sacred-reading-order): one Vyakhya branch carries
  // the core shift (marma), the explanation and the English commentary together;
  // Modern Context carries the lesson and the research note; Reflection carries
  // only the चिंतन प्रश्न. Gates are unchanged from the old Vigyan branch.
  const hasVyakhya = settings.showCommentary && (showMarma || Boolean(verse.explanation) || Boolean(verse.commentary));
  const modernParsed = verse.reflection ? parseModernContext(verse.reflection) : null;
  const showModernLesson = Boolean(!settings.liteMode && verse.reflection && modernParsed
    && (!modernParsed.hasStructuredFormat || modernParsed.contextText || modernParsed.applicationText));
  const hasModern = settings.showCommentary && (showModernLesson || Boolean(!isQuick && !settings.liteMode && verse.research));
  const hasReflection = Boolean(settings.showCommentary && !settings.liteMode && modernParsed?.hasStructuredFormat && modernParsed.reflectionQuestion);
  // Only offer links to sections that exist for this verse and reading mode.
  const anchorPrefix = `reader-study-${scriptureId}-${chapterId}-${String(verse.number).replace(/[^A-Za-z0-9_-]/g, '-')}`;
  const studySteps = [
    { id: 'arth', hi: SACRED_SECTION_LABEL.arth.hi, en: SACRED_SECTION_LABEL.arth.en, enabled: hasArth },
    { id: 'vyakhya', hi: SACRED_SECTION_LABEL.vyakhya.hi, en: SACRED_SECTION_LABEL.vyakhya.en, enabled: hasVyakhya },
    { id: 'modern', hi: SACRED_SECTION_LABEL.modern.hi, en: SACRED_SECTION_LABEL.modern.en, enabled: hasModern },
    { id: 'reflection', hi: SACRED_SECTION_LABEL.reflection.hi, en: SACRED_SECTION_LABEL.reflection.en, enabled: hasReflection },
  ].filter((step) => step.enabled);

  const handleInspectPada = (pada: string) => {
    const entry = verse.lexicon?.[pada];
    if (entry) {
      setActiveLexiconEntry(entry);
    }
  };

  return (
    <article id={`verse-${verse.number}`} className="space-y-3.5 sm:space-y-4" aria-label={`Verse ${verse.number}`}>
      {/* Reading depth and perspective live in the reader's control row (ReaderControlBar). */}
      {settings.liteMode && (
        <div className="flex items-center justify-between rounded-xl border border-dharma-border/60 bg-dharma-card/50 px-3.5 py-2 text-xs text-dharma-muted">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="font-semibold text-dharma-text">विशुद्ध पाठ (Reading Lite Mode)</span>
            <span>· Distraction-free scripture focus</span>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSetting?.('liteMode', false)}
            className="focus-ring inline-flex min-h-[44px] items-center rounded-lg px-3 font-semibold text-saffron-700 dark:text-saffron-400 hover:underline"
          >
            Exit Lite Mode
          </button>
        </div>
      )}

      {/* 1 · Original Sanskrit: scripture comes first on the page; editorial lines follow it. */}
      <Layer
        id="layer-sanskrit"
        kind="source"
        title="Original Sanskrit"
        titleHi="मूल संस्कृत"
        badge={
          <span className="verse-ref font-serif text-sm font-semibold tabular-nums">
            {formatVerseRef(scriptureId, chapterId, verse.number)}
          </span>
        }
      >
        {lines.length > 0 ? (
          <>
          <p id="sanskrit-text" lang="sa" className={`verse-folio min-w-0 rounded-2xl px-2 py-3.5 text-center font-devanagari font-semibold text-dharma-text sm:px-6 sm:py-5 ${SANSKRIT_SIZE[settings.sanskritSize]} ${devLeading}`}>
            {lines.map((line, i) => (
              <span key={i} className="block">
                <PadaLine line={line} />
              </span>
            ))}
            <span aria-hidden="true" className="verse-mark mt-1.5 block text-sm font-semibold sm:text-base">
              ॥ {verseMarkNumber(verse.number)} ॥
            </span>
            {/* The light over a chapter photo (scene-photos.css); hidden everywhere else. */}
            <span className="photo-light" />
          </p>
          {/* Interactive Padachheda word pills: updates selectedWordIndex in StudyCompanionRail without layout shift */}
          {!settings.liteMode && glosses.length > 0 && onSelectWord && (
            <div className="mt-3 rounded-2xl border border-amber-700/20 bg-amber-50/45 dark:border-amber-500/20 dark:bg-amber-950/20 px-3 py-2.5 [[data-lite=true]_&]:hidden">
              <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-semibold text-dharma-muted">
                <span>
                  <span lang="hi" className="font-devanagari text-dharma-text">पदच्छेद</span>{' '}
                  <span>· Tap a word to inspect grammar</span>
                </span>
              </div>
              <div role="group" aria-label="Interactive padachheda words" className="flex flex-wrap gap-1.5">
                {glosses.map((g, idx) => {
                  const isSelected = selectedWordIndex === idx;
                  const lex = verse.lexicon?.[g.pada];
                  return (
                    <button
                      key={`${g.pada}-${idx}`}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => onSelectWord(idx)}
                      className={`focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition [[data-lite=true]_&]:transition-none ${
                        isSelected
                          ? 'border-amber-700 bg-amber-800 text-amber-50 shadow-2xs dark:border-amber-300 dark:bg-amber-300 dark:text-stone-950'
                          : 'border-amber-700/30 bg-dharma-card/90 text-dharma-text hover:border-amber-600/60 hover:bg-amber-100/60 dark:border-amber-500/25 dark:hover:bg-amber-900/35'
                      }`}
                    >
                      {lex?.termDevanagari ? (
                        <span lang="sa" className="font-devanagari">{lex.termDevanagari}</span>
                      ) : (
                        <span lang="sa-Latn" className="font-serif italic">{g.pada}</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {glosses[selectedWordIndex] && (
                <p className="mt-2 border-t border-amber-700/15 dark:border-amber-500/15 pt-1.5 text-xs text-dharma-text lg:sr-only">
                  <span className="font-semibold">{glosses[selectedWordIndex].pada}:</span>{' '}
                  <span>{glosses[selectedWordIndex].meaning}</span>
                </p>
              )}
            </div>
          )}
          {!settings.liteMode && (
            <ExplainLine lines={lines} scopeId="sanskrit-text" verseLabel={formatVerseRef(scriptureId, chapterId, verse.number)} fullTranslation={cleanVerseField(verse.translation)} entries={verse.lineExplanations} />
          )}
          </>
        ) : (
          <p className="text-center text-sm text-dharma-muted">The Sanskrit text is not available for this verse.</p>
        )}
        {!isQuick && (verse.transliteration || hasPadas) && (
          <div className="mt-2.5">
            {/* Reading aids for the shloka: folded until the reader asks for them. */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {verse.transliteration && (
                <button
                  type="button"
                  onClick={() => onUpdateSetting?.('showTransliteration', !settings.showTransliteration)}
                  aria-expanded={settings.showTransliteration}
                  aria-controls="iast-text"
                  className={aidToggle}
                >
                  <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                  <span data-bi="en">IAST</span>
                  <span lang="hi" data-bi="hi" className="font-devanagari">लिप्यन्तरण</span>
                </button>
              )}
              {hasPadas && (
                <button
                  type="button"
                  onClick={() => setShowPadas((v) => !v)}
                  aria-expanded={showPadas}
                  aria-controls="layer-padas"
                  className={aidToggle}
                >
                  <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span lang="hi" data-bi="hi" className="font-devanagari">पदच्छेद</span>
                  <span data-bi="en">Word by word</span>
                </button>
              )}
            </div>
            {/* Always in the HTML (crawlers, no-JS); hidden until the reader asks for it. */}
            {verse.transliteration && (
              <p
                id="iast-text"
                lang="sa-Latn"
                hidden={!settings.showTransliteration}
                className={`mt-3 whitespace-pre-line text-center font-serif italic text-dharma-text/90 ${tSize} ${latinLeading}`}
              >
                {dash(cleanVerseField(verse.transliteration))}
              </p>
            )}
          </div>
        )}
      </Layer>

      {/* Word by word: a reading aid for the shloka, kept apart from the व्याख्या and
          hidden by default. In the HTML either way, so crawlers and no-JS readers get it. */}
      {hasPadas && (
        <div hidden={!showPadas}>
        <Layer
          id="layer-padas"
          kind="aid"
          title="Word by word (पदच्छेद व अन्वय)"
          titleHi="पदच्छेद"
        >
          <div className="mb-2.5 flex items-center justify-between text-xs text-dharma-muted">
            <span>किसी पद को चुनें — उसका अर्थ और व्याकरण देखें:</span>
          </div>
          {glosses.length > 1 ? (
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {glosses.map((g, i) => {
                const lexiconMatch = verse.lexicon?.[g.pada] ?? null;
                return (
                  <li key={i} className="list-none">
                    {/* The card is a plain container: the word is the button, and its ::after stretches over the
                        whole card, so a click anywhere still opens the gloss. धातु sits above it
                        (relative z-10) instead of being nested inside an interactive element. */}
                    <div
                      className={`group relative h-full rounded-xl border p-2.5 transition active:scale-[0.99] ${
                        lexiconMatch
                          ? 'border-saffron-500/40 bg-saffron-50/20 dark:bg-saffron-950/20 hover:border-saffron-500 hover:shadow-sm'
                          : 'border-amber-700/20 bg-dharma-card/70 hover:border-amber-500/60 hover:bg-amber-50/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <button
                          type="button"
                          aria-haspopup="dialog"
                          aria-label={`शब्दार्थ: ${g.pada} — ${g.meaning}`}
                          onClick={() =>
                            setSelectedWordGloss({
                              pada: g.pada,
                              meaning: g.meaning,
                              lexicon: lexiconMatch || undefined,
                            })
                          }
                          className="focus-ring flex flex-wrap items-center gap-1.5 rounded-md text-left after:absolute after:inset-0 after:rounded-xl after:content-['']"
                        >
                          {lexiconMatch?.termDevanagari && (
                            <span lang="sa" className="font-devanagari text-sm font-bold text-dharma-text">
                              {lexiconMatch.termDevanagari}
                            </span>
                          )}
                          <span lang="sa-Latn" className="font-serif text-sm font-bold italic text-amber-900 dark:text-amber-200">
                            {g.pada}
                          </span>
                        </button>
                        {lexiconMatch && (
                          <div className="relative z-10 flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInspectPada(g.pada);
                              }}
                              className="focus-ring tap-halo inline-flex min-h-[32px] items-center gap-1 rounded-md border border-saffron-500/40 bg-saffron-100/70 dark:bg-saffron-900/40 px-2.5 py-1 text-[11px] font-bold text-saffron-800 dark:text-saffron-200 hover:border-saffron-600 transition"
                            >
                              <Search className="h-3 w-3" />
                              <span>धातु</span>
                            </button>
                          </div>
                        )}
                      </div>
                      <p className={`mt-1 text-sm text-dharma-text ${latinLeading}`}>{g.meaning}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className={`text-dharma-text ${tSize} ${latinLeading}`}>{verse.wordMeaning}</p>
          )}
        </Layer>
        </div>
      )}

      {/* 2 · Direct Meaning (भावार्थ): immediately below the shloka so Hindi & English meaning
          are visible above the fold on both phone and desktop without scrolling past navigation. */}
      {hasArth && (
        <div id={`${anchorPrefix}-arth`} className="scroll-mt-32 space-y-3 sm:scroll-mt-24 sm:space-y-4">
          {bothPending && (
            <p className="rounded-2xl border border-dharma-border bg-dharma-card px-4 py-3 text-sm italic text-dharma-muted">
              <span lang="hi" className="font-devanagari">{MEANING_COPY.bothPendingHi}</span>
              {' · '}
              <span lang="en">{MEANING_COPY.bothPendingEn}</span>
            </p>
          )}
          {showHindiTrans && !bothPending && meaningNow.hi === 'with' && (
            <p lang="hi" className="rounded-2xl border border-dharma-border bg-dharma-card px-4 py-3 font-devanagari text-sm text-dharma-muted">
              <a href={`../${verse.hindiSeeVerse}/`} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                {MEANING_COPY.hiWith(verse.hindiSeeVerse!)}
              </a>
            </p>
          )}
          {showHindiTrans && !bothPending && (meaningNow.hi === 'pending' || meaningNow.hi === 'review') && (
            <p lang="hi" className="rounded-2xl border border-dharma-border bg-dharma-card px-4 py-3 font-devanagari text-sm italic text-dharma-muted">
              {meaningNow.hi === 'review' ? MEANING_COPY.hiReview : MEANING_COPY.hiPending}
            </p>
          )}
          {((showHindiTrans && meaningNow.hi === 'text') || (showEnglishTrans && meaningNow.en === 'text')) && (
            <div
              className={
                showHindiTrans && meaningNow.hi === 'text' && showEnglishTrans && meaningNow.en === 'text'
                  ? 'grid grid-cols-1 gap-3 md:grid-cols-2 [[data-lang=hi]_&]:grid-cols-1 [[data-lang=en]_&]:grid-cols-1'
                  : 'space-y-3'
              }
            >
              {showHindiTrans && meaningNow.hi === 'text' && (
                <div className="[[data-lang=en]_&]:hidden h-full">
                  <Layer
                    id="layer-hindi"
                    kind="translation"
                    title={verse.hindiRange ? `Hindi Translation · verses ${verse.hindiRange.replace('-', '–')}` : 'Hindi Meaning'}
                    titleHi={verse.hindiRange ? MEANING_COPY.hiRange(verse.hindiRange) : 'भावार्थ (हिन्दी)'}
                    badge={
                      <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/40 bg-saffron-100/60 dark:bg-saffron-900/30 px-2.5 py-0.5 text-[11px] font-bold text-saffron-900 dark:text-saffron-200">
                        मूलानुवाद · Literal
                      </span>
                    }
                  >
                    <p lang="hi" className={`whitespace-pre-line font-devanagari text-dharma-text ${tSize} ${devLeading}`}>
                      {cleanVerseField(verse.hindi)}
                    </p>
                  </Layer>
                </div>
              )}
              {showEnglishTrans && meaningNow.en === 'text' && (
                <div className="[[data-lang=hi]_&]:hidden h-full">
                  <Layer
                    id="layer-english"
                    kind="translation"
                    title={verse.translationRange ? MEANING_COPY.enRange(verse.translationRange) : 'English Translation'}
                    badge={
                      <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/40 bg-saffron-100/60 dark:bg-saffron-900/30 px-2.5 py-0.5 text-[11px] font-bold text-saffron-900 dark:text-saffron-200">
                        Literal Text
                      </span>
                    }
                  >
                    <p lang="en" className={`whitespace-pre-line font-serif text-dharma-text ${tSize} ${latinLeading}`}>
                      {cleanVerseField(verse.translation)}
                    </p>
                  </Layer>
                </div>
              )}
            </div>
          )}
          {showEnglishTrans && !bothPending && meaningNow.en === 'with' && (
            <p lang="en" className="rounded-2xl border border-dharma-border bg-dharma-card px-4 py-3 text-sm text-dharma-muted">
              <a href={`../${verse.translationSeeVerse}/`} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                {MEANING_COPY.enWith(verse.translationSeeVerse!)}
              </a>
            </p>
          )}
          {showEnglishTrans && !bothPending && meaningNow.en === 'pending' && (
            <p lang="en" className="rounded-2xl border border-dharma-border bg-dharma-card px-4 py-3 text-sm italic text-dharma-muted">
              {MEANING_COPY.enPending}
            </p>
          )}
        </div>
      )}

      {/* Study path strip: jumps across Original Sanskrit, Meaning, Vyakhya, Modern Context, Reflection & Sources. */}
      {!settings.liteMode && !settings.focusMode && (
        <nav
          id="reader-study-guide"
          aria-label="श्लोक अध्ययन मार्ग · Verse study guide"
          className="scroll-mt-28 rounded-[18px] border border-dharma-border/80 bg-dharma-card/85 px-3 py-2 shadow-sm sm:px-4"
        >
          <div className="-mx-1 flex min-w-0 snap-x snap-proximity items-center gap-1.5 overflow-x-auto px-1 py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span lang="hi" className="mr-1 shrink-0 font-devanagari text-xs font-bold text-dharma-muted">अध्ययन मार्ग:</span>
            <a href="#layer-sanskrit" aria-label="मूल श्लोक · Original Sanskrit" className="focus-ring inline-flex min-h-[44px] shrink-0 snap-start items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 text-xs font-semibold text-dharma-text transition-colors hover:border-amber-500/70">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
              <span lang="hi" className="font-devanagari">मूल श्लोक</span>
            </a>
            {studySteps.map((step, i) => (
              <a
                key={step.id}
                href={'#' + anchorPrefix + '-' + step.id}
                aria-label={step.hi + ' · ' + step.en}
                className="focus-ring inline-flex min-h-[44px] shrink-0 snap-start items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-bg/70 px-3 text-xs font-semibold text-dharma-text transition-colors hover:border-saffron-500/60 hover:bg-saffron-500/10"
              >
                <span aria-hidden="true" className="font-mono text-[10px] font-bold tabular-nums text-saffron-700 dark:text-saffron-300">{String(i + 1).padStart(2, '0')}</span>
                <span lang="hi" className="font-devanagari">{step.hi}</span>
              </a>
            ))}
            <a href="#layer-sources" aria-label="स्रोत एवं संस्करण · Sources and edition" className="focus-ring inline-flex min-h-[44px] shrink-0 snap-start items-center rounded-full border border-dharma-border bg-dharma-bg/70 px-3 text-xs font-semibold text-dharma-text transition-colors hover:border-saffron-500/60 hover:bg-saffron-500/10">
              <span lang="hi" className="font-devanagari">स्रोत</span>
            </a>
          </div>
        </nav>
      )}

      {/* 3–9 · Deeper study tree in sacred reading order (lib/sacred-reading-order):
          व्याख्या → आधुनिक संदर्भ → चिंतन. Native <details> branches keep every layer in server HTML. */}
      <VerseTreeStructure
        persistent
        anchorPrefix={anchorPrefix}
        branches={(
          [
          hasVyakhya && {
            id: 'vyakhya',
            labelHi: SACRED_SECTION_LABEL.vyakhya.hi,
            labelEn: SACRED_SECTION_LABEL.vyakhya.en,
            icon: Lightbulb,
            hint: 'श्लोक का सरल हिन्दी विवेचन',
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                {showMarma && insight?.marma && (
                  <figure className="border-l-4 border-saffron-500 pl-4 dark:border-saffron-400" data-testid="reader-marma">
                    <figcaption className="mb-1 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-800 dark:text-saffron-300">
                      <span lang="hi">मर्म</span>
                      <span aria-hidden="true">·</span>
                      <span lang="en">The Core Shift</span>
                      <span className="normal-case tracking-normal text-dharma-muted">· Editorial, not scripture</span>
                    </figcaption>
                    <blockquote lang="en" className="font-serif text-lg font-semibold leading-snug text-dharma-text sm:text-xl">
                      {insight.marma}
                    </blockquote>
                  </figure>
                )}
                {verse.explanation && (
                  <Layer
                    id="layer-explanation"
                    kind="editorial"
                    title={isQuick ? 'Key Message' : 'Vyakhya (व्याख्या)'}
                    titleHi={isQuick ? 'मुख्य संदेश' : 'व्याख्या'}
                    badge={p.explanationIsAi ? <AiBadge title={EDITORIAL_DRAFT_LABEL.detail}>{EDITORIAL_DRAFT_LABEL.en}</AiBadge> : undefined}
                    collapsible={false}
                  >
                    <p
                      lang={/[ऀ-ॿ]/.test(verse.explanation ?? '') ? 'hi' : 'en'}
                      className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.explanation ?? '') ? `${devLeading} font-devanagari` : `${latinLeading} font-serif`}`}
                    >
                      {verse.explanation}
                    </p>
                  </Layer>
                )}
                {verse.commentary && (
                  <Layer
                    id="layer-commentary"
                    kind="editorial"
                    title="Commentary & Explanation"
                    collapsible={false}
                  >
                    <p lang="en" className={`whitespace-pre-line font-serif text-dharma-text ${tSize} ${latinLeading}`}>
                      {verse.commentary}
                    </p>
                  </Layer>
                )}
              </div>
            ),
          },
          hasModern && {
            id: 'modern',
            labelHi: SACRED_SECTION_LABEL.modern.hi,
            labelEn: SACRED_SECTION_LABEL.modern.en,
            icon: Compass,
            hint: 'आज के जीवन में प्रयोग',
            defaultOpen: true,
            content: (
              <div className="space-y-4">
                {/* Modern reflection and research stay separate frames, never mixed into the commentary */}
                {showModernLesson && verse.reflection && modernParsed && (
                  <Layer
                    id="layer-modern"
                    kind="reflection"
                    title={isQuick ? "Practical Action & Takeaway" : "Modern Context & Application"}
                    titleHi={isQuick ? "दैनिक आचरण" : "आधुनिक संदर्भ"}
                    badge={aiCommentary}
                    collapsible={perspective === 'researcher'}
                  >
                    <ModernContextBody
                      parsed={modernParsed}
                      lang={/[ऀ-ॿ]/.test(verse.reflection) ? 'hi' : 'en'}
                      className={`${tSize} ${/[ऀ-ॿ]/.test(verse.reflection) ? devLeading : latinLeading}`}
                      hideContextHeading={!isQuick}
                    />
                  </Layer>
                )}
                {!isQuick && !settings.liteMode && verse.research && (
                  <Layer id="layer-research" kind="research" title="Comparative Research Note" titleHi="शोध टिप्पणी" badge={p.researchIsAi ? <AiBadge title={EDITORIAL_DRAFT_LABEL.detail}>{EDITORIAL_DRAFT_LABEL.en}</AiBadge> : aiCommentary} collapsible={perspective !== 'researcher'}>
                    <p
                      lang={/[ऀ-ॿ]/.test(verse.research) ? 'hi' : 'en'}
                      className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.research) ? devLeading : latinLeading} ${/[ऀ-ॿ]/.test(verse.research) ? 'font-devanagari' : 'font-serif'}`}
                    >
                      {verse.research}
                    </p>
                    <p className="mt-3 text-xs text-dharma-muted">
                      A modern parallel offered for reflection. It is not part of the scripture, and it has not been checked against the original
                      sources it may allude to.
                    </p>
                  </Layer>
                )}
              </div>
            ),
          },
          hasReflection && modernParsed?.reflectionQuestion && {
            id: 'reflection',
            labelHi: SACRED_SECTION_LABEL.reflection.hi,
            labelEn: SACRED_SECTION_LABEL.reflection.en,
            icon: Sparkles,
            hint: 'चिंतन प्रश्न',
            defaultOpen: true,
            content: (
              <Layer
                id="layer-reflection"
                kind="reflection"
                title="Reflection"
                titleHi="चिंतन प्रश्न"
                badge={aiCommentary}
                collapsible={false}
              >
                <ReflectionBody
                  question={modernParsed.reflectionQuestion}
                  lang={verse.reflection && /[ऀ-ॿ]/.test(verse.reflection) ? 'hi' : 'en'}
                  className={`${tSize} ${verse.reflection && /[ऀ-ॿ]/.test(verse.reflection) ? devLeading : latinLeading}`}
                />
              </Layer>
            ),
          },
          ] as Array<VerseTreeBranch | false>
        ).filter((b): b is VerseTreeBranch => Boolean(b))}
      />

      {insight && insight.situations.length > 0 && settings.showCommentary && !settings.liteMode && (
        <nav aria-label="जीवन प्रसंग · Life situations" className="flex flex-wrap items-center gap-1.5">
          <span lang="hi" className="mr-1 font-devanagari text-xs font-semibold text-dharma-muted">जीवन प्रसंग:</span>
          {insight.situations.map((s) => (
            <Link
              key={s.slug}
              href={s.href}
              className="focus-ring inline-flex min-h-[32px] items-center gap-1 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-2.5 py-0.5 text-xs font-semibold text-indigo-800 transition hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/20"
            >
              <span lang="en">{s.en}</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span lang="hi" className="font-devanagari">{s.hi}</span>
            </Link>
          ))}
        </nav>
      )}

      {isDeep && settings.showCommentary && !settings.liteMode && (
        <CompareViews scriptureId={scriptureId} chapterId={chapterId} verse={verse} provenance={p} />
      )}

      {/* 10 · Sources and edition: the page's one provenance card. Status chips, the
          recorded edition and translator, dates, licence, a variant note only when one
          is recorded, and a single way to report an error. */}
      <Layer id="layer-sources" kind="sources" title="Sources and edition" titleHi="स्रोत एवं संस्करण" collapsible>
        {sourceStatus}
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          {p.edition && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Sanskrit edition</dt>
              <dd className="mt-0.5 text-dharma-text">{p.edition}</dd>
            </div>
          )}
          {p.translator && (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Translation</dt>
              <dd className="mt-0.5 text-dharma-text">{p.translator}</dd>
            </div>
          )}
          {p.sourceHost && (
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Source</dt>
              <dd className="mt-0.5 text-dharma-text">{p.sourceUrl ? (
                  <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                    {p.sourceHost}
                  </a>
                ) : (
                  p.sourceHost
                )}</dd>
            </div>
          )}
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Last updated</dt>
            <dd className="mt-0.5 text-dharma-text">{p.lastUpdated ? p.lastUpdated.slice(0, 10) : <span className="text-dharma-muted">Not recorded</span>}</dd>
          </div>
          {p.sourceLicense && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">Licence note (as recorded)</dt>
              <dd className="mt-0.5 text-dharma-muted">{p.sourceLicense}</dd>
            </div>
          )}
          {p.variantNote && (
            <div className="sm:col-span-2">
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-dharma-muted">
                <span lang="hi" className="font-devanagari normal-case tracking-normal">पाठ-भेद</span> · Variant readings
              </dt>
              <dd className="mt-0.5 text-dharma-text">{p.variantNote}</dd>
            </div>
          )}
        </dl>
      </Layer>

      {/* Sanskrit Word Explorer Modal/Drawer */}
      {activeLexiconEntry && (
        <SanskritWordExplorerDrawer entry={activeLexiconEntry} isOpen onClose={() => setActiveLexiconEntry(null)} />
      )}

      {/* Word-by-Word (पदच्छेद) Meaning Popover */}
      {selectedWordGloss && (
        <PadachhedaWordDialog
          selectedWordGloss={selectedWordGloss}
          onClose={() => setSelectedWordGloss(null)}
          onDeepInspect={(lex) => setActiveLexiconEntry(lex)}
        />
      )}
    </article>
  );
}
