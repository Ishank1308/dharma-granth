'use client';

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from 'react';
import {
  Atom,
  BookOpen,
  ChevronDown,
  Compass,
  Languages,
  Lightbulb,
  Quote,
  ScrollText,
  Sparkles,
  Search,
  Volume2,
} from 'lucide-react';
import { cleanVerseField, toAsciiDigits, verseLines } from '@/lib/verse-format';
import { parseWordMeanings, type WordGloss } from '@/lib/word-gloss';
import { CompareViews } from '@/app/components/study/CompareViews';
import { CommentaryCompare } from '@/app/components/study/CommentaryCompare';
import { COMMENTARIES, verseKey } from '@/data/study-content';
import { SanskritWordExplorerDrawer } from '@/app/components/understand/SanskritWordExplorerDrawer';
import { ReaderDialog } from '@/app/components/reader/ReaderDialog';
import { findLexiconEntry, type SanskritLexiconEntry } from '@/data/sanskrit-lexicon';
import { speakSanskritTerm } from '@/lib/sacred-soundscape';
import type { ReaderProvenance, ReaderVerseText } from '@/lib/reader-actions';
import type { ReaderSettings } from '@/lib/useReaderSettings';
import type { VerseInsight } from '@/lib/verse-insights';
import { EDITORIAL_DRAFT_LABEL } from '@/lib/editorial-terminology';
import { ModernContextBody, ReflectionBody, parseModernContext } from '@/app/components/ModernContextBlock';
import { getVerseStudy, type StudyGroup } from '@/data/verse-study';
import { PalmLeaf, Rubricated, StudyVyakhya, markPhrases, termMarks } from '@/app/components/reader/PalmLeaf';
import { VersePillar, VersePillars } from '@/app/components/reader/VersePillar';
import { countRecitationWords, RecitationHighlightedLine } from '@/app/components/reader/RecitationHighlightedLine';
import Link from 'next/link';

/* ── Type scale: full class strings so Tailwind keeps them ──────────── */

const SANSKRIT_SIZE = {
  sm: 'text-xl sm:text-2xl',
  md: 'text-2xl sm:text-3xl',
  lg: 'text-[1.75rem] sm:text-4xl',
  xl: 'text-3xl sm:text-5xl',
} as const;

const TRANSLATION_SIZE = {
  sm: 'text-[0.95rem]',
  md: 'text-base sm:text-[1.075rem]',
  lg: 'text-lg sm:text-xl',
  xl: 'text-xl sm:text-2xl',
} as const;

// Devanagari carries stacked marks above and below the line, so it needs more leading than Latin.
const DEVANAGARI_LEADING = {
  compact: 'leading-[1.7]',
  normal: 'leading-[1.85]',
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

type Kind = 'source' | 'aid' | 'translation' | 'tradition' | 'editorial' | 'reflection' | 'research' | 'sources';

const KINDS: Record<Kind, { chip: string; chipHi: string; frame: string; chipCls: string; Icon: typeof BookOpen }> = {
  source: {
    chip: 'Source scripture',
    chipHi: 'मूल पाठ',
    frame: 'border-2 border-amber-700/35 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-950/25',
    chipCls: 'border-amber-700/40 bg-amber-100 text-amber-950 dark:border-amber-500/40 dark:bg-amber-900/40 dark:text-amber-100',
    Icon: ScrollText,
  },
  aid: {
    chip: 'Reading aid for the source',
    chipHi: 'मूल पाठ सहायक',
    frame: 'border border-amber-700/25 bg-amber-50/40 dark:border-amber-500/20 dark:bg-amber-950/15',
    chipCls: 'border-amber-700/30 bg-amber-50 text-amber-950 dark:border-amber-500/30 dark:bg-amber-900/30 dark:text-amber-100',
    Icon: Languages,
  },
  translation: {
    chip: 'Translation',
    chipHi: 'अनुवाद',
    frame: 'border border-dharma-border border-l-4 border-l-saffron-600 bg-dharma-card',
    chipCls: 'border-saffron-600/40 bg-saffron-100 text-saffron-950 dark:border-saffron-500/40 dark:bg-saffron-900/40 dark:text-saffron-100',
    Icon: Languages,
  },
  tradition: {
    chip: 'Traditional commentary',
    chipHi: 'परम्परागत भाष्य',
    frame: 'border border-stone-400/50 border-l-4 border-l-stone-600 bg-stone-100/70 dark:border-stone-600/50 dark:border-l-stone-400 dark:bg-stone-900/40',
    chipCls: 'border-stone-500/40 bg-stone-200 text-stone-900 dark:border-stone-500/40 dark:bg-stone-800 dark:text-stone-100',
    Icon: Quote,
  },
  editorial: {
    chip: 'Editorial explanation',
    chipHi: 'संपादकीय व्याख्या',
    frame: 'border border-sky-500/30 border-l-4 border-l-sky-600 bg-sky-50/60 dark:border-sky-500/25 dark:bg-sky-950/20',
    chipCls: 'border-sky-600/40 bg-sky-100 text-sky-950 dark:border-sky-500/40 dark:bg-sky-900/40 dark:text-sky-100',
    Icon: Lightbulb,
  },
  reflection: {
    chip: 'Modern reflection · not scripture',
    chipHi: 'आधुनिक चिंतन',
    frame: 'border border-emerald-600/30 border-l-4 border-l-emerald-600 bg-emerald-50/60 dark:border-emerald-500/25 dark:bg-emerald-950/20',
    chipCls: 'border-emerald-600/40 bg-emerald-100 text-emerald-950 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100',
    Icon: Compass,
  },
  research: {
    chip: 'Research context · not scripture',
    chipHi: 'शोध संदर्भ',
    frame: 'border border-indigo-500/30 border-l-4 border-l-indigo-600 bg-indigo-50/60 dark:border-indigo-400/25 dark:bg-indigo-950/20',
    chipCls: 'border-indigo-600/40 bg-indigo-100 text-indigo-950 dark:border-indigo-400/40 dark:bg-indigo-900/40 dark:text-indigo-100',
    Icon: Atom,
  },
  sources: {
    chip: 'Sources and edition',
    chipHi: 'स्रोत',
    frame: 'border border-dharma-border bg-dharma-card/70',
    chipCls: 'border-dharma-border bg-dharma-bg text-dharma-text',
    Icon: BookOpen,
  },
};

/** Quiet corner brackets for the source verse only. Decorative: hidden from assistive tech and by the "hide decorative" setting. */
function CornerMarks() {
  const c = 'absolute h-3 w-3 border-amber-700/50 dark:border-amber-400/40';
  return (
    <span aria-hidden="true" data-decor="">
      <span className={`${c} left-2 top-2 border-l-2 border-t-2 rounded-tl-md`} />
      <span className={`${c} right-2 top-2 border-r-2 border-t-2 rounded-tr-md`} />
      <span className={`${c} bottom-2 left-2 border-b-2 border-l-2 rounded-bl-md`} />
      <span className={`${c} bottom-2 right-2 border-b-2 border-r-2 rounded-br-md`} />
    </span>
  );
}

function AiBadge({ children, title }: { children: ReactNode; title?: string }) {
  return (
    <span title={title} className="inline-flex items-center gap-1 rounded-full border border-violet-500/40 bg-violet-100 px-2 py-0.5 text-[11px] font-semibold text-violet-950 dark:border-violet-400/40 dark:bg-violet-900/40 dark:text-violet-100">
      <Sparkles className="h-3 w-3" aria-hidden="true" />
      {children}
    </span>
  );
}

/** True inside a VersePillar: the pillar is the card, so its layers drop their own frame. */
const InPillar = createContext(false);

/**
 * One layer of the page. `collapsible` layers are native <details>: open in
 * the server HTML (so every reader and crawler gets the text), then closed on
 * phones after mount so a long verse page stays scannable.
 * Inside a pillar a layer keeps its label chip and badge but loses its border,
 * background, shadow and icon tile; a hairline separates it from the layer above.
 */
function Layer({
  id,
  kind,
  title,
  titleHi,
  badge,
  collapsible = false,
  className = '',
  children,
}: {
  id: string;
  kind: Kind;
  title: string;
  titleHi?: string;
  badge?: ReactNode;
  collapsible?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const k = KINDS[kind];
  const ref = useRef<HTMLDetailsElement>(null);
  const bare = useContext(InPillar);
  const pad = bare ? '' : 'px-4 sm:px-6';

  useEffect(() => {
    if (collapsible && ref.current && window.matchMedia('(max-width: 639px)').matches) ref.current.open = false;
  }, [collapsible]);

  const head = (
    <>
      {!bare && (
        <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${k.chipCls}`}>
          <k.Icon className="h-4 w-4" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className={`inline-flex flex-wrap items-center gap-x-2 rounded-full border px-2.5 py-0.5 text-xs font-bold ${k.chipCls}`}>
          <span lang="hi" className="font-devanagari text-[0.8125rem] leading-snug">
            {k.chipHi}
          </span>
          <span aria-hidden="true" className="opacity-50">
            ·
          </span>
          <span>{k.chip}</span>
        </span>
        <span className="mt-1 block font-serif text-base font-bold text-dharma-text sm:text-lg">
          <span id={`${id}-title`}>{title}</span>
          {titleHi && (
            <span lang="hi" className="ml-2 font-devanagari text-[0.95rem] font-normal text-dharma-muted">
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
      className={bare ? `relative border-t border-dharma-border/60 pt-4 first:border-t-0 first:pt-0 ${className}` : `relative rounded-2xl shadow-sm ${k.frame} ${className}`}
    >
      {kind === 'source' && <CornerMarks />}
      {collapsible ? (
        <details ref={ref} open className="group">
          <summary className={`focus-ring flex min-h-[48px] cursor-pointer list-none items-center gap-3 rounded-2xl ${bare ? 'py-1' : 'px-4 py-3 sm:px-6'} [&::-webkit-details-marker]:hidden`}>
            {head}
            <ChevronDown className="h-5 w-5 shrink-0 text-dharma-muted transition group-open:rotate-180" aria-hidden="true" />
          </summary>
          <div className={`${pad} ${bare ? 'pb-1 pt-2' : 'pb-5'}`}>{children}</div>
        </details>
      ) : (
        <>
          <div className={`flex items-center gap-3 ${pad} ${bare ? '' : 'pt-4'}`}>{head}</div>
          <div className={`${pad} ${bare ? 'pt-2.5' : 'pb-5 pt-3'}`}>{children}</div>
        </>
      )}
    </section>
  );
}

/* ── Word-by-word ──────────────────────────────────────────────────── */

export { parseWordMeanings, type WordGloss } from '@/lib/word-gloss';

const dash = (s: string) => s.replace(/[\s|।॥0-9.]+$/, '');

const aidToggle =
  'focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-amber-700/25 px-3 py-1 text-xs font-semibold text-dharma-muted transition hover:border-saffron-400 hover:text-dharma-text aria-expanded:border-saffron-500 aria-expanded:text-dharma-text';

/* ── The layers: root shloka, then the अर्थ → व्याख्या → विज्ञान tree ── */

export function ReaderLayers({
  scriptureId,
  verse,
  chapterId,
  provenance: p,
  settings,
  onReport,
  onUpdateSetting,
  insight,
  sourceStatus,
}: {
  scriptureId: string;
  verse: ReaderVerseText;
  chapterId: number;
  provenance: ReaderProvenance;
  settings: ReaderSettings;
  onReport: () => void;
  onUpdateSetting?: <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => void;
  /** Reviewed मर्म line and जीवन प्रसंग chips, when this verse has them. */
  insight?: VerseInsight;
  /** Status chips rendered by the page (TrustBadges), placed at the top of the Sources card. */
  sourceStatus?: ReactNode;
}) {
  const [activeRecitationWordIndex, setActiveRecitationWordIndex] = useState<number | null>(null);
  const [activeRecitationWordBoundary, setActiveRecitationWordBoundary] = useState<{ chunkIndex: number; charIndex: number; length: number } | null>(null);
  const [isRecitingThisVerse, setIsRecitingThisVerse] = useState(false);

  useEffect(() => {
    const handleWord = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setActiveRecitationWordIndex(typeof detail?.wordIndex === 'number' ? detail.wordIndex : null);
      setActiveRecitationWordBoundary(
        typeof detail?.chunkIndex === 'number' && typeof detail?.charIndex === 'number'
          ? { chunkIndex: detail.chunkIndex, charIndex: detail.charIndex, length: detail.charLength || 0 }
          : null,
      );
      setIsRecitingThisVerse(true);
    };
    const handleChunk = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.chunkIndex !== null && detail?.chunkIndex !== undefined) {
        setIsRecitingThisVerse(true);
        setActiveRecitationWordIndex(null);
        setActiveRecitationWordBoundary(null);
      } else {
        setIsRecitingThisVerse(false);
        setActiveRecitationWordIndex(null);
        setActiveRecitationWordBoundary(null);
      }
    };
    const handleEnd = () => {
      setIsRecitingThisVerse(false);
      setActiveRecitationWordIndex(null);
      setActiveRecitationWordBoundary(null);
    };

    window.addEventListener('dharma:recitation-word', handleWord);
    window.addEventListener('dharma:recitation-chunk', handleChunk);
    window.addEventListener('dharma:recitation-ended', handleEnd);
    return () => {
      window.removeEventListener('dharma:recitation-word', handleWord);
      window.removeEventListener('dharma:recitation-chunk', handleChunk);
      window.removeEventListener('dharma:recitation-ended', handleEnd);
    };
  }, []);

  const [activeLexiconEntry, setActiveLexiconEntry] = useState<SanskritLexiconEntry | null>(null);
  const [selectedWordGloss, setSelectedWordGloss] = useState<{
    pada: string;
    meaning: string;
    lexicon?: SanskritLexiconEntry;
  } | null>(null);

  const sanskrit = cleanVerseField(verse.sanskrit);
  const lines = sanskrit ? verseLines(sanskrit) : [];
  const glosses = parseWordMeanings(verse.wordMeaning);
  // Palm-leaf prototype: only verses with study markup (data/verse-study) change.
  const study = getVerseStudy(scriptureId, chapterId, verse.number);
  const [studyGroup, setStudyGroup] = useState<StudyGroup | null>(null);
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

  const hasArth =
    Boolean(showHindiTrans && (verse.hindi || verse.hindiSeeVerse != null)) || Boolean(showEnglishTrans && verse.translation);
  const hasPadas = Boolean(settings.showCommentary && !isQuick && !settings.liteMode && verse.wordMeaning);
  const [showPadas, setShowPadas] = useState(false);
  // Traditional commentary appears only once a reviewed commentary exists for this verse;
  // until then the layer would just repeat the text above around an "add commentary" notice.
  const hasCommentary = (COMMENTARIES[verseKey(scriptureId, chapterId, verse.number)]?.length ?? 0) > 0;
  const showTradition = settings.showCommentary && !isQuick && !settings.liteMode && hasCommentary;
  // Sacred reading order (lib/sacred-reading-order): one Vyakhya branch carries
  // the explanation, the English commentary and the traditional bhashya together;
  // Modern Context carries the lesson and the research note; Reflection carries
  // only the चिंतन प्रश्न. Gates are unchanged from the old Vigyan branch.
  const hasVyakhya = settings.showCommentary && (Boolean(verse.explanation) || Boolean(verse.commentary) || showTradition);
  const modernParsed = verse.reflection ? parseModernContext(verse.reflection) : null;
  const showModernLesson = Boolean(!settings.liteMode && verse.reflection && modernParsed
    && (!modernParsed.hasStructuredFormat || modernParsed.contextText || modernParsed.applicationText));
  const hasModern = settings.showCommentary && (showModernLesson || Boolean(!isQuick && !settings.liteMode && verse.research));
  const showSituations = Boolean(insight && insight.situations.length > 0 && settings.showCommentary && !settings.liteMode);
  const hasReflection = Boolean(settings.showCommentary && !settings.liteMode && modernParsed?.hasStructuredFormat && modernParsed.reflectionQuestion);

  const handleInspectPada = (pada: string) => {
    const entry = findLexiconEntry(pada);
    if (entry) {
      setActiveLexiconEntry(entry);
    }
  };

  return (
    <article id={`verse-${verse.number}`} className="space-y-5" aria-label={`Verse ${verse.number}`} data-study-active={studyGroup ?? undefined}>
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
      <Layer id="layer-sanskrit" kind="source" title="Original Sanskrit" titleHi="मूल संस्कृत" className={`apple-pranic-leaf transition-all duration-300 ${isRecitingThisVerse ? 'ring-2 ring-amber-500/50 shadow-md shadow-amber-500/10' : ''}`}>
        {lines.length > 0 ? (
          <>
          {study ? (
            <PalmLeaf>
              <p id="sanskrit-text" lang="sa" className={`text-center font-manuscript ${SANSKRIT_SIZE[settings.sanskritSize]} ${devLeading}`}>
                {lines.map((line, i) => (
                  <span key={i} className="block">
                    <Rubricated text={line} />
                  </span>
                ))}
                <span aria-hidden="true" className="rubric mt-2 block text-[0.6em]">
                  ॥ {toAsciiDigits(chapterId)}.{toAsciiDigits(verse.number)} ॥
                </span>
              </p>
            </PalmLeaf>
          ) : (
          <p id="sanskrit-text" lang="sa" className={`text-center font-devanagari font-semibold text-dharma-text ${SANSKRIT_SIZE[settings.sanskritSize]} ${devLeading}`}>
            {lines.map((line, i) => (
              <span key={i} className="block">
                <RecitationHighlightedLine
                  line={line}
                  activeWordIndex={isRecitingThisVerse ? activeRecitationWordIndex : null}
                  wordIndexOffset={lines.slice(0, i).reduce(
                    (count, previousLine) => count + countRecitationWords(previousLine),
                    0,
                  )}
                  activeCharacterRange={isRecitingThisVerse && activeRecitationWordBoundary?.chunkIndex === i
                    ? { start: activeRecitationWordBoundary.charIndex, length: activeRecitationWordBoundary.length }
                    : null}
                />
              </span>
            ))}
            <span aria-hidden="true" className="mt-2 block text-[0.6em] font-bold text-amber-800 dark:text-amber-300">
              ॥ {toAsciiDigits(chapterId)}.{toAsciiDigits(verse.number)} ॥
            </span>
          </p>
          )}
          </>
        ) : (
          <p className="text-center text-sm text-dharma-muted">The Sanskrit text is not available for this verse.</p>
        )}
        {!isQuick && (verse.transliteration || hasPadas) && (
          <div className="mt-4 border-t border-amber-700/15 pt-3">
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
                  <span>IAST</span>
                  <span lang="hi" className="font-devanagari">लिप्यन्तरण</span>
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
                  <span lang="hi" className="font-devanagari">पदच्छेद</span>
                  <span>Word by word</span>
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





      {/* 2 · The three pillars (CLAUDE.md §4), in reading order भावार्थ → व्याख्या → आधुनिक संदर्भ.
          Pillar 1 holds the printed translation (still labelled अनुवाद, never rewritten). The मर्म
          "core shift" line is not shown on verse pages. A pillar with nothing to show is left out. */}
      {(hasArth || hasVyakhya || hasPadas || hasModern || hasReflection || showSituations) && (
        <InPillar.Provider value>
        <VersePillars>
          {hasArth && (
            <VersePillar kind="bhavartha" hint="श्लोक का अर्थ: मूल अनुवाद">
              {(
              <div className="space-y-4">
                {showHindiTrans && !verse.hindi && verse.hindiSeeVerse != null && (
                  // The edition translates this verse together with earlier ones; the passage lives there.
                  <p lang="hi" className="rounded-2xl border border-dharma-border bg-dharma-card px-4 py-3 font-devanagari text-sm text-dharma-muted">
                    इस श्लोक का हिन्दी अर्थ श्लोक {toAsciiDigits(String(verse.hindiSeeVerse))} के साथ संयुक्त रूप से दिया गया है।{' '}
                    <a href={`../${verse.hindiSeeVerse}/`} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                      श्लोक {toAsciiDigits(String(verse.hindiSeeVerse))} देखें →
                    </a>
                  </p>
                )}
                {showHindiTrans && verse.hindi && (
                  <Layer
                    id="layer-hindi"
                    kind="translation"
                    title={verse.hindiRange ? `Hindi translation · verses ${verse.hindiRange.replace('-', '–')}` : 'Hindi translation'}
                    titleHi={verse.hindiRange ? `श्लोक ${toAsciiDigits(verse.hindiRange.replace('-', '–'))} का अनुवाद` : 'हिन्दी अनुवाद'}
                  >
                    <p lang="hi" className={`whitespace-pre-line font-devanagari text-dharma-text ${tSize} ${devLeading}`}>
                      {study ? markPhrases(cleanVerseField(verse.hindi), termMarks(study.translationTerms)) : cleanVerseField(verse.hindi)}
                    </p>
                  </Layer>
                )}
                {showEnglishTrans && verse.translation && (
                  <Layer
                    id="layer-english"
                    kind="translation"
                    title="English translation"
                    titleHi="अंग्रेज़ी अनुवाद"
                  >
                    <p lang="en" className={`font-serif text-dharma-text ${tSize} ${latinLeading}`}>
                      {cleanVerseField(verse.translation)}
                    </p>
                  </Layer>
                )}
              </div>
              )}
            </VersePillar>
          )}
          {(hasVyakhya || hasPadas) && (
            <VersePillar kind="vyakhya" hint="श्लोक का पदच्छेद और दार्शनिक विवेचन">
      {/* Word by word: a reading aid for the shloka, kept apart from the व्याख्या and
          hidden by default. In the HTML either way, so crawlers and no-JS readers get it. */}
      {hasPadas && (
        <div hidden={!showPadas}>
        <Layer
          id="layer-padas"
          kind="aid"
          title="Word by word"
          titleHi="पदच्छेद"
        >
          <p className="mb-2.5 text-xs text-dharma-muted">
            <span lang="hi" className="font-devanagari">किसी पद को स्पर्श करें: उसका अर्थ, व्याकरण और उच्चारण खुलेगा।</span>{' '}
            <span>Tap a word for its meaning, grammar and pronunciation.</span>
          </p>
          {glosses.length > 1 ? (
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {glosses.map((g, i) => {
                const lexiconMatch = findLexiconEntry(g.pada);
                const displayTerm = lexiconMatch?.termDevanagari || g.pada;
                return (
                  <li key={i} className="list-none" data-study-group={study?.padaGroups[g.pada]}>
                    {/* The card is a plain container: the word is the button, and its ::after stretches over the
                        whole card, so a click anywhere still opens the gloss. Pronounce and धातु sit above it
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
                        <div className="relative z-10 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              speakSanskritTerm(displayTerm, 0.85);
                            }}
                            className="focus-ring inline-flex h-7 w-7 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-300 transition"
                            aria-label={`उच्चारण सुनें: ${g.pada}`}
                            title="उच्चारण सुनें (Pronounce)"
                          >
                            <Volume2 className="h-3.5 w-3.5" />
                          </button>
                          {lexiconMatch && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInspectPada(g.pada);
                              }}
                              className="focus-ring inline-flex min-h-[28px] items-center gap-1 rounded-md border border-saffron-500/40 bg-saffron-100/70 dark:bg-saffron-900/40 px-2 py-0.5 text-[11px] font-bold text-saffron-800 dark:text-saffron-200 hover:border-saffron-600 transition"
                            >
                              <Search className="h-3 w-3" />
                              <span>धातु</span>
                            </button>
                          )}
                        </div>
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
              {hasVyakhya && (
              <div className="space-y-4">
                {verse.explanation && (
                  <Layer
                    id="layer-explanation"
                    kind="editorial"
                    title={isQuick ? 'Key message' : 'Explanation'}
                    titleHi={isQuick ? 'मुख्य संदेश' : 'व्याख्या'}
                    badge={p.explanationIsAi ? <AiBadge title={EDITORIAL_DRAFT_LABEL.detail}>{EDITORIAL_DRAFT_LABEL.en}</AiBadge> : undefined}
                    collapsible={false}
                  >
                    {study && !isQuick ? (
                      <StudyVyakhya
                        text={verse.explanation}
                        study={study}
                        className={`whitespace-pre-line text-dharma-text ${tSize} ${devLeading} font-devanagari`}
                      />
                    ) : (
                    <p
                      lang={/[ऀ-ॿ]/.test(verse.explanation ?? '') ? 'hi' : 'en'}
                      className={`whitespace-pre-line text-dharma-text ${tSize} ${/[ऀ-ॿ]/.test(verse.explanation ?? '') ? `${devLeading} font-devanagari` : `${latinLeading} font-serif`}`}
                    >
                      {verse.explanation}
                    </p>
                    )}
                  </Layer>
                )}
                {verse.commentary && (
                  <Layer
                    id="layer-commentary"
                    kind="editorial"
                    title="Commentary"
                    collapsible={false}
                  >
                    <p lang="en" className={`whitespace-pre-line font-serif text-dharma-text ${tSize} ${latinLeading}`}>
                      {verse.commentary}
                    </p>
                  </Layer>
                )}
                {showTradition && (
                  <Layer
                    id="layer-tradition"
                    kind="tradition"
                    title="Traditional commentary"
                    titleHi="परम्परागत भाष्य"
                    collapsible={!isTraditional && perspective !== 'researcher'}
                  >
                    <div className="rounded-xl border border-stone-300 bg-stone-50/70 dark:border-stone-700 dark:bg-stone-900/40 p-3.5 mb-3 text-xs text-stone-700 dark:text-stone-300">
                      <p className="font-semibold text-stone-900 dark:text-stone-200">
                        <span lang="hi" className="font-devanagari">सम्प्रदाय-तटस्थता</span> · Every tradition with respect
                      </p>
                      <p className="mt-1 leading-relaxed">
                        The classical commentaries speak from different schools, such as Advaita, Vishishtadvaita and Dvaita. They are set side by side here, and no one school is presented as the only true reading.
                      </p>
                    </div>
                    <CommentaryCompare scriptureId={scriptureId} chapterId={chapterId} verse={verse} />
                  </Layer>
                )}
              </div>
              )}
            </VersePillar>
          )}
          {(hasModern || (hasReflection && modernParsed?.reflectionQuestion) || showSituations) && (
            <VersePillar kind="modern" hint="आज के जीवन में प्रयोग">
              {hasModern && (
              <div className="space-y-4">
                {/* Modern reflection and research stay separate frames, never mixed into the commentary */}
                {showModernLesson && verse.reflection && modernParsed && (
                  <Layer
                    id="layer-modern"
                    kind="reflection"
                    title={isQuick ? 'In daily practice' : 'Living the teaching today'}
                    titleHi={isQuick ? 'दैनिक आचरण' : 'आज के जीवन में'}
                    badge={aiCommentary}
                    collapsible={perspective === 'researcher'}
                  >
                    <ModernContextBody
                      parsed={modernParsed}
                      lang={/[ऀ-ॿ]/.test(verse.reflection) ? 'hi' : 'en'}
                      className={`${tSize} ${/[ऀ-ॿ]/.test(verse.reflection) ? devLeading : latinLeading}`}
                    />
                  </Layer>
                )}
                {!isQuick && !settings.liteMode && verse.research && (
                  <Layer id="layer-research" kind="research" title="A modern parallel" titleHi="शोध टिप्पणी" badge={p.researchIsAi ? <AiBadge title={EDITORIAL_DRAFT_LABEL.detail}>{EDITORIAL_DRAFT_LABEL.en}</AiBadge> : aiCommentary} collapsible={perspective !== 'researcher'}>
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
              )}
              {hasReflection && modernParsed?.reflectionQuestion && (
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
              )}
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
            </VersePillar>
          )}
        </VersePillars>
        </InPillar.Provider>
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
        <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-dharma-muted">
          Found a mistake?{' '}
          <button type="button" onClick={onReport} className="focus-ring inline-flex min-h-[44px] items-center rounded font-semibold text-saffron-800 underline underline-offset-4 dark:text-saffron-300">
            Report a textual error
          </button>
        </p>
      </Layer>

      {/* Sanskrit Word Explorer Modal/Drawer */}
      <SanskritWordExplorerDrawer
        entry={activeLexiconEntry}
        isOpen={activeLexiconEntry !== null}
        onClose={() => setActiveLexiconEntry(null)}
      />

      {/* Word-by-Word (पदच्छेद) Audio & Meaning Popover */}
      {selectedWordGloss && (
        <ReaderDialog
          open={selectedWordGloss !== null}
          onClose={() => setSelectedWordGloss(null)}
          title={selectedWordGloss.lexicon?.termIast || selectedWordGloss.pada}
          titleHi={selectedWordGloss.lexicon?.termDevanagari || selectedWordGloss.pada}
          variant="modal"
        >
          <div className="space-y-4 text-sm">
            {/* Word Pronunciation & Heading Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30 p-4">
              <div>
                <span lang="sa" className="block font-devanagari text-2xl font-bold text-dharma-text">
                  {selectedWordGloss.lexicon?.termDevanagari || selectedWordGloss.pada}
                </span>
                <span lang="sa-Latn" className="mt-0.5 block font-serif text-sm italic text-amber-900 dark:text-amber-200">
                  {selectedWordGloss.lexicon?.termIast || selectedWordGloss.pada}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  speakSanskritTerm(
                    selectedWordGloss.lexicon?.termDevanagari || selectedWordGloss.pada,
                    0.85
                  )
                }
                className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-amber-500/20 px-3.5 py-2 font-semibold text-amber-900 hover:bg-amber-500/30 dark:text-amber-200 transition active:scale-95 border border-amber-500/40"
              >
                <Volume2 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>उच्चारण · Hear Word</span>
              </button>
            </div>

            {/* Contextual Hindi & English Meanings */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-dharma-border bg-dharma-card p-3.5">
                <span className="text-2xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  हिन्दी अर्थ (Hindi Meaning)
                </span>
                <p lang="hi" className="mt-1 font-devanagari text-sm font-medium text-dharma-text">
                  {selectedWordGloss.lexicon?.simpleHindi ||
                    selectedWordGloss.lexicon?.contextualMeaningHi ||
                    selectedWordGloss.meaning}
                </p>
              </div>
              <div className="rounded-xl border border-dharma-border bg-dharma-card p-3.5">
                <span className="text-2xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  English Meaning
                </span>
                <p className="mt-1 text-sm font-medium text-dharma-text">
                  {selectedWordGloss.lexicon?.simpleEnglish ||
                    selectedWordGloss.lexicon?.contextualMeaning ||
                    selectedWordGloss.meaning}
                </p>
              </div>
            </div>

            {/* Classical Dhatu & Grammar Details if available */}
            {selectedWordGloss.lexicon ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5">
                <span className="text-2xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  मूल धातु व व्याकरण (Root & Grammar)
                </span>
                <p className="mt-1 text-xs font-semibold text-dharma-text">
                  धातु: {selectedWordGloss.lexicon.rootDhatu}
                </p>
                <p className="mt-0.5 text-xs text-dharma-muted">
                  {selectedWordGloss.lexicon.grammarCategory}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const lex = selectedWordGloss.lexicon;
                    setSelectedWordGloss(null);
                    if (lex) setActiveLexiconEntry(lex);
                  }}
                  className="mt-3 focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-saffron-500/40 bg-saffron-100/80 dark:bg-saffron-900/40 px-3 py-1 text-xs font-bold text-saffron-800 dark:text-saffron-200 hover:border-saffron-600 transition"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>विस्तृत धातु अन्वेषण (Deep Dhatu Analysis)</span>
                </button>
              </div>
            ) : (
              <p className="text-2xs text-dharma-muted italic">
                श्लोक संदर्भ: यह पद मूल श्लोक के पदच्छेद एवं अन्वय का प्रत्यक्ष भाग है।
              </p>
            )}
          </div>
        </ReaderDialog>
      )}
    </article>
  );
}
