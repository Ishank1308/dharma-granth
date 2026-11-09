'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { REVEAL_SEQUENCE } from '@/app/components/motion/primitives';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Copy,
  Edit3,
  FolderCheck,
  FolderPlus,
  Highlighter,
  Maximize2,
  Pause,
  Quote,
  ScrollText,
  Sparkles,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import type { ScriptureCategory } from '@/data/types';
import type { VerseHighlight } from '@/lib/useStudyProgress';
import { resolveKeywordTarget } from '@/lib/keyword-links';
import { isLongPassage, meaningState, MEANING_COPY, verseLines, verseMarkNumber, formatVerseRef, extractVerseSpeaker, cleanTransliteration } from '@/lib/verse-format';
import { shareVerseUrl } from '@/lib/verse-paths';
import { parseWordMeanings } from '@/lib/word-gloss';
import { SITE_URL } from '@/lib/jsonld';
import { ShareVerseButton } from './ShareVerseButton';
import { GlossaryText } from './GlossaryTooltip';
import { ContentLabelBadge } from './ContentLabels';
import { ModernContextBody, ReflectionBody, parseModernContext } from './ModernContextBlock';
import { ConnectedFlow, SacredSection } from '@/app/components/reader/SacredReadingFlow';
import { detectChandas } from '@/lib/chandas-detector';
import { speakSanskritTerm } from '@/lib/sacred-soundscape';
import { triggerTactileFeedback } from '@/lib/haptics';
import { showSabdaPeek } from '@/lib/prana-capsule-store';
import { SamvadaStrip } from '@/app/components/reader/SamvadaStrip';
import type { VerseInsight } from '@/lib/verse-insights';
import { EDITORIAL_DRAFT_LABEL, STUDY_TRANSLATION_SHORT } from '@/lib/editorial-terminology';
import { getLiteraryVerseMeta } from '@/lib/literary-commentary';
import type { ReadingDepth } from '@/lib/reading-depth';
import { ActionMenu } from '@/app/components/primitives/ActionMenu';
import { Collapsible } from '@/app/components/primitives/Collapsible';
import { VerseStudyDisclosure } from '@/app/components/reader/VerseStudyDisclosure';
import { MeaningPendingNote } from '@/app/components/MeaningPending';
import type { NearbyMeaning } from '@/lib/verse-has-meaning';
import dynamic from 'next/dynamic';
import { useEverTrue } from '@/lib/use-ever-true';

// Loaded the first time it opens, so the dialog stays out of the page's first-load JS.
const StoryDeckModal = dynamic(() => import('@/app/components/reader/StoryDeckModal').then((m) => m.StoryDeckModal), { ssr: false });
const CitationModal = dynamic(() => import('@/components/study/CitationModal').then((m) => m.CitationModal), { ssr: false });
import { saveAnnotation, deleteAnnotation } from '@/lib/study/storage';
import type { Connection } from '@/data/study-content';

export interface VerseCardData {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  translationSource?: 'ai';
  /** This verse's English covers a range ("1.1-1.63", a whole hymn) translated together in the edition. */
  translationRange?: string;
  /** The English for this verse is stored on that verse (the first of its range). */
  translationSeeVerse?: number | string;
  hindi?: string;
  hindiSource?: 'ai';
  hindiReviewRequired?: boolean;
  /** Hindi from a printed edition, published before it was proofread (lib/ocr-hindi-review.ts). */
  hindiUnproofread?: boolean;
  /** This verse's Hindi covers a range ("15-17") translated together in the edition. */
  hindiRange?: string;
  /** The Hindi for this verse is stored on that verse (the first of its range). */
  hindiSeeVerse?: number | string;
  wordMeaning?: string;
  padaccheda?: string;
  speaker?: string;
  chandas?: string;
  keywords?: string[];
}

/** Commentary resolved by the parent (Hindi commentary file first, then verse fields). */
export interface VerseMeaning {
  /** AI-drafted and editor-approved (not hand-written); labelled per lib/ai-labels. */
  isAi?: boolean;
  explanation?: string;
  explanationIsHi: boolean;
  /** Hindi व्याख्या and English commentary are kept separate when both exist. */
  vyakhya?: string;
  commentary?: string;
  science?: string;
  scienceIsHi: boolean;
  /** The research note alone is an approved AI rewrite. */
  scienceIsAi?: boolean;
  lesson?: string;
  lessonIsHi: boolean;
  /** Set for editorial-pilot entries: an AI-assisted draft that no person has reviewed yet. */
  editorial?: {
    reviewStatus: 'review-required';
    confidence: 'high' | 'medium' | 'low';
    vijnanaCategory: string;
    evidenceLevel: 'editorial-observation' | 'none';
    arthaDecision: string;
  };
}

const VIJNANA_CATEGORIES: Record<string, string> = {
  psychological: 'मनोवैज्ञानिक · Psychological',
  observational: 'अवलोकन-आधारित · Observational',
  ethical: 'नैतिक · Ethical',
  cognitive: 'संज्ञानात्मक · Cognitive',
  contemplative: 'ध्यान-परंपरा · Contemplative',
  social: 'सामाजिक · Social',
  philosophical: 'दार्शनिक · Philosophical',
  ecological: 'पारिस्थितिक · Ecological',
  linguistic: 'भाषा-शैली · Linguistic',
  historical: 'ऐतिहासिक · Historical',
};

/** Honest status for AI-assisted editorial drafts: shown wherever the draft text appears. */
function DraftBadge({ lang }: { lang: 'hi' | 'en' }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-700/80 dark:text-violet-300/80"
      title="AI-सहायता से तैयार संपादकीय प्रारूप; किसी विद्वान ने अभी इसकी समीक्षा नहीं की · AI-assisted editorial draft; not yet reviewed by a person"
    >
      {lang === 'hi' ? 'संपादकीय प्रारूप · समीक्षा बाकी' : 'Editor draft · review pending'}
    </span>
  );
}

export interface VerseLayers {
  translit: boolean;
  hindi: boolean;
  english: boolean;
  commentary: boolean;
}

interface Props {
  /** How much explanation to show; defaults to everything (study) for callers that do not choose. */
  depth?: ReadingDepth;
  verse: VerseCardData;
  /** Existing, approved editorial connections; the server passes at most three. */
  relatedTeachings?: Connection[];
  meaning: VerseMeaning;
  layers: VerseLayers;
  scriptureId: string;
  chapterId: number;
  category: ScriptureCategory;
  scriptureTitle: string;
  chapterTitle: string;
  chantingMode: boolean;
  sanskritFontSizeClass: string;
  translationFontSizeClass?: string;
  bookmarked: boolean;
  copied: boolean;
  onToggleBookmark: () => void;
  onCopy: () => void;
  onContribute: () => void;
  onAddToCollection?: () => void;
  inCollectionCount?: number;
  highlight?: HighlightColor;
  /** Same colour again removes the highlight (useStudyProgress toggle semantics). */
  onHighlight: (color: HighlightColor) => void;
  /** Opens full-screen focus contemplation mode on this verse */
  onOpenFocus?: () => void;
  /** Spatial focus (liquid/SpatialShloka): the verse number lifts or lowers this verse. */
  spatialFocused?: boolean;
  onToggleSpatial?: () => void;
  /** Dedicated verse page, linked from the card so the URL survives hydration. */
  versePageHref?: string;
  /** The reader asked for this verse's study (tapped its number in the chapter): open it, full study included. */
  studyRequested?: boolean;
  /** Whether this verse is currently being recited */
  isReciting?: boolean;
  /** Callback to trigger recitation of this verse */
  onPlayRecitation?: () => void;
  /** Reviewed मर्म line and जीवन प्रसंग chips, when this verse has them. */
  insight?: VerseInsight;
  /** Opens the desktop split-pane Svādhyāya workbench */
  onOpenSvadhyaya?: (tab: 'concept' | 'parallel' | 'manana', data?: unknown) => void;
  /** Whether this verse is active during recitation or jump */
  isActive?: boolean;
  /** For a verse without a meaning: the nearest verses in this chapter that have one. */
  meaningNearby?: NearbyMeaning;
}

type HighlightColor = VerseHighlight['color'];

const NOTE_MAX = 2000;

const CONNECTION_KIND_LABEL: Record<Connection['kind'], string> = {
  similar: 'संबद्ध दृष्टि · Related perspective',
  complementary: 'पूरक शिक्षा · Complementary teaching',
  'different-emphasis': 'भिन्न बलाघात · Different emphasis',
  narrative: 'कथात्मक संदर्भ · Narrative example',
  commentary: 'भाष्य-संबंध · Commentary connection',
};

// Full class strings (not built dynamically) so Tailwind keeps them.
const HIGHLIGHTS: Record<HighlightColor, { label: string; swatch: string; ring: string; spine: string }> = {
  saffron: { label: 'केसरिया', swatch: 'bg-saffron-500', ring: 'ring-2 ring-saffron-400/70', spine: 'from-saffron-400 via-saffron-500 to-saffron-600' },
  amber: { label: 'सुनहरा', swatch: 'bg-amber-400', ring: 'ring-2 ring-amber-400/70', spine: 'from-amber-300 via-amber-400 to-amber-500' },
  rose: { label: 'गुलाबी', swatch: 'bg-rose-500', ring: 'ring-2 ring-rose-400/70', spine: 'from-rose-400 via-rose-500 to-rose-600' },
  emerald: { label: 'हरा', swatch: 'bg-emerald-500', ring: 'ring-2 ring-emerald-400/70', spine: 'from-emerald-400 via-emerald-500 to-emerald-600' },
  indigo: { label: 'नीला', swatch: 'bg-indigo-500', ring: 'ring-2 ring-indigo-400/70', spine: 'from-indigo-400 via-indigo-500 to-indigo-600' },
};

/** Decide the language from the text itself: more Devanagari than Latin letters = Hindi. */
function isMostlyDevanagari(text: string | undefined): boolean {
  if (!text) return false;
  let deva = 0;
  let latin = 0;
  for (const ch of text) {
    if (ch >= 'ऀ' && ch <= 'ॿ') deva++;
    else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')) latin++;
  }
  return deva > latin;
}

/** Quiet verse reference that stays legible without competing with the shloka. */
function VerseReference({ label }: { label: string }) {
  return (
    <span className="verse-ref font-serif text-sm font-semibold tabular-nums text-saffron-800 dark:text-saffron-300">
      {label}
    </span>
  );
}

/** One translation; a passage covering several verses carries its label, and a long one is folded under it. */
function PassageText({ lang, label, long, className, children }: { lang: 'hi' | 'en'; label?: string; long: boolean; className: string; children: ReactNode }) {
  const labelClass = `text-xs text-dharma-muted ${lang === 'hi' ? 'font-devanagari' : ''}`;
  if (label && long) {
    return (
      <details>
        <summary lang={lang} className={`cursor-pointer ${labelClass} font-medium`}>
          {label}
        </summary>
        <p lang={lang} className={`mt-2 whitespace-pre-line ${className}`}>
          {children}
        </p>
      </details>
    );
  }
  return (
    <>
      {label && (
        <p lang={lang} className={`mb-1 ${labelClass}`}>
          {label}
        </p>
      )}
      <p lang={lang} className={className}>
        {children}
      </p>
    </>
  );
}

/** A meaning not written yet in one language, said quietly in the slot it will fill. */
function PendingMeaning({ lang, children }: { lang: 'hi' | 'en'; children: ReactNode }) {
  return (
    <p lang={lang} className={`text-sm italic text-dharma-muted ${lang === 'hi' ? 'font-devanagari' : ''}`}>
      {children}
    </p>
  );
}

const iconButton =
  'inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-transparent text-dharma-muted/80 transition-colors duration-200 hover:bg-dharma-card-soft hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500';

export function VerseCard({
  depth = 'study',
  verse: v,
  relatedTeachings,
  meaning,
  layers,
  scriptureId,
  chapterId,
  category,
  scriptureTitle,
  chapterTitle,
  chantingMode,
  sanskritFontSizeClass,
  translationFontSizeClass = 'text-base md:text-lg leading-relaxed',
  bookmarked,
  copied,
  onToggleBookmark,
  onCopy,
  onContribute,
  onAddToCollection,
  inCollectionCount,
  highlight,
  onHighlight,
  onOpenFocus,
  spatialFocused = false,
  onToggleSpatial,
  versePageHref,
  studyRequested = false,
  isReciting,
  onPlayRecitation,
  insight,
  onOpenSvadhyaya,
  isActive,
  meaningNearby,
}: Props) {

  // ── Highlight colour picker ──
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPickerOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setPickerOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [pickerOpen]);

  const rawLines = useMemo(() => (v.sanskrit ? verseLines(v.sanskrit) : []), [v.sanskrit]);
  const { speaker, verseLines: lines, hasSpeakerInText } = useMemo(
    () => extractVerseSpeaker(v.speaker, rawLines),
    [v.speaker, rawLines]
  );
  const chandas = useMemo(() => detectChandas(v.sanskrit), [v.sanskrit]);
  const transliterationText = useMemo(
    () => cleanTransliteration(v.transliteration, hasSpeakerInText),
    [v.transliteration, hasSpeakerInText]
  );

  // Recitation line-by-line / translation live highlighting
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [activeTranslationLang, setActiveTranslationLang] = useState<'hi' | 'en' | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  const [activeWordBoundary, setActiveWordBoundary] = useState<{ chunkIndex: number; charIndex: number; length: number } | null>(null);

  useEffect(() => {
    if (!isReciting) {
      setActiveLineIndex(null);
      setActiveTranslationLang(null);
      setActiveWordBoundary(null);
      return;
    }

    const handleChunk = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.isTranslation) {
        setActiveLineIndex(null);
        setActiveTranslationLang(detail.language);
        setActiveWordBoundary(null);
      } else if (typeof detail?.chunkIndex === 'number') {
        setActiveLineIndex(detail.chunkIndex);
        setActiveTranslationLang(null);
      } else {
        setActiveLineIndex(null);
        setActiveTranslationLang(null);
        setActiveWordBoundary(null);
      }
    };

    const handleWord = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (typeof detail?.chunkIndex === 'number' && typeof detail?.charIndex === 'number') {
        setActiveWordBoundary({
          chunkIndex: detail.chunkIndex,
          charIndex: detail.charIndex,
          length: detail.charLength || 0,
        });
      } else {
        setActiveWordBoundary(null);
      }
    };

    window.addEventListener('dharma:recitation-chunk', handleChunk);
    window.addEventListener('dharma:recitation-word', handleWord);
    return () => {
      window.removeEventListener('dharma:recitation-chunk', handleChunk);
      window.removeEventListener('dharma:recitation-word', handleWord);
    };
  }, [isReciting]);

  // ── Scholarly Citation Modal ──
  const [citationModalOpen, setCitationModalOpen] = useState(false);

  // ── 60-Second Story Deck Modal & Literary Essayist Metadata ──
  const [storyDeckOpen, setStoryDeckOpen] = useState(false);
  const storyDeckLoaded = useEverTrue(storyDeckOpen);
  const citationLoaded = useEverTrue(citationModalOpen);
  const literaryMeta = useMemo(() => {
    return getLiteraryVerseMeta(scriptureId, chapterId, v.number);
  }, [scriptureId, chapterId, v.number]);

  // ── Sandhi-Viccheda (Compound Split Words) ──
  const [isSandhiSplit, setIsSandhiSplit] = useState(false);
  const [hoveredWordIndex, setHoveredWordIndex] = useState<number | null>(null);

  const parsedGloss = useMemo(() => {
    if (v.wordMeaning) {
      return parseWordMeanings(v.wordMeaning);
    }
    return [];
  }, [v.wordMeaning]);

  const splitWords = useMemo<Array<{ pada: string; meaning?: string }>>(() => {
    if (v.padaccheda) {
      const tokens = v.padaccheda.split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean);
      return tokens.map((pada) => {
        const matching = parsedGloss.find(
          (g) => g.pada.toLowerCase() === pada.toLowerCase() || g.pada.includes(pada) || pada.includes(g.pada)
        );
        return { pada, meaning: matching?.meaning };
      });
    }
    if (parsedGloss.length > 0) {
      return parsedGloss;
    }
    return [];
  }, [v.padaccheda, parsedGloss]);

  const hasSplitData = splitWords.length > 0;

  const { explanation, science, lesson } = meaning;
  // The source flag only says which file the text came from; Hindi व्याख्या
  // also lives in the verse data itself, so check the text.
  const explanationIsHi = meaning.explanationIsHi || isMostlyDevanagari(explanation);
  const vyakhya = meaning.vyakhya ?? (explanationIsHi ? explanation : undefined);
  const commentary = meaning.commentary ?? (!explanationIsHi ? explanation : undefined);
  const hasExplanation = Boolean(vyakhya || commentary);
  const scienceIsHi = meaning.scienceIsHi || isMostlyDevanagari(science);
  const lessonIsHi = meaning.lessonIsHi || isMostlyDevanagari(lesson);
  // The अर्थ slot is always there for each language the reader shows; a meaning not written yet says so.
  const state = meaningState(v);
  const showHindi = layers.hindi;
  const showEnglish = layers.english;
  const bothPending = showHindi && showEnglish && state.hi === 'pending' && state.en === 'pending';

  const modernParsed = useMemo(() => (lesson ? parseModernContext(lesson) : null), [lesson]);
  const showArth = showHindi || showEnglish;
  const hasStudyContent = Boolean(
    v.wordMeaning || hasExplanation || science || lesson || literaryMeta.isCurated
    || insight?.marma || insight?.situations.length || v.keywords?.length || relatedTeachings?.length,
  );

  // The shloka, transliteration and meanings reveal in that order through CSS (.reveal-seq / data-reveal in
  // globals.css): no opacity:0 in the server HTML, and nothing waits on hydration.
  const verseLabel = String(v.number);

  return (
    <article
      id={`verse-${v.number}`}
      className={`verse-card book-verse ${REVEAL_SEQUENCE} group relative scroll-mt-24 transition-all duration-300 ${
        isReciting
          ? 'book-verse-ringed bg-amber-500/5 ring-2 ring-amber-400/50 animate-prana-pulse'
          : highlight
          ? `book-verse-ringed ${HIGHLIGHTS[highlight].ring}`
          : ''
      }`}
      style={{
        contentVisibility: isActive || isReciting ? 'visible' : 'auto',
        containIntrinsicSize: 'auto 420px',
      }}
      aria-label={`श्लोक ${verseLabel}${isReciting ? ' · श्लोक उच्चारण चालू' : ''}${highlight ? ` · ${HIGHLIGHTS[highlight].label} हाइलाइट` : ''}`}
    >
      <div className="relative px-1 py-2 sm:px-2">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-2 flex flex-wrap items-center gap-x-3">
          {onToggleSpatial || onOpenFocus ? (
            <button
              type="button"
              onClick={onToggleSpatial ?? onOpenFocus}
              aria-pressed={onToggleSpatial ? spatialFocused : undefined}
              className="group/hdr flex min-h-11 min-w-11 items-center gap-3 rounded-lg px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dharma-card"
              title={onToggleSpatial ? (spatialFocused ? 'श्लोक नीचे रखें · Lower this verse' : 'श्लोक उठाएँ · Lift this verse into focus') : 'एकाग्रता मोड में पढ़ें (Focus Mode)'}
            >
              <span className="sr-only">श्लोक</span>
              <VerseReference label={formatVerseRef(scriptureId, chapterId, verseLabel)} />
            </button>
          ) : (
            <div className="flex min-h-11 items-center gap-3 px-1">
              <span className="sr-only">श्लोक</span>
              <VerseReference label={formatVerseRef(scriptureId, chapterId, verseLabel)} />
            </div>
          )}

          {/* Streamlined, calm toolbar: 3 essential icons + ActionMenu overflow. Never wraps awkwardly on mobile. */}
          <div
            className="ml-auto flex shrink-0 items-center gap-0.5 transition-opacity duration-200 [@media(hover:hover)]:opacity-40 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100"
            role="group"
            aria-label="श्लोक विकल्प (Verse actions)"
          >
            {/* Audio Recitation */}
            {onPlayRecitation && v.sanskrit && (
              <button
                type="button"
                onClick={onPlayRecitation}
                className={`${iconButton} ${isReciting ? '!border-amber-400 !bg-amber-500/20 !text-amber-700 dark:!text-amber-300 ring-2 ring-amber-400/50' : ''}`}
                aria-pressed={isReciting}
                aria-label={isReciting ? 'श्लोक उच्चारण रोकें (Pause recitation)' : 'श्लोक उच्चारण सुनें (Listen to verse recitation)'}
                title={isReciting ? 'श्लोक उच्चारण रोकें' : 'श्लोक उच्चारण सुनें'}
              >
                {isReciting ? (
                  <Pause className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Bookmark */}
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`${iconButton} ${bookmarked ? '!border-saffron-400 !bg-saffron-50 !text-saffron-700 dark:!bg-saffron-900/30' : ''}`}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? 'बुकमार्क हटाएं (Remove bookmark)' : 'बुकमार्क करें (Bookmark)'}
              title={bookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-4 w-4 fill-saffron-500/25" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>

            {/* Share */}
            <span className="shrink-0 [&>button]:h-11 [&>button]:w-11 [&>button]:border-transparent [&>button]:bg-transparent [&>button]:shadow-none [&>button]:backdrop-blur-none [&>button]:text-dharma-muted/80 [&>button:hover]:bg-dharma-card-soft [&>button:hover]:text-dharma-text">
              <ShareVerseButton
                scriptureTitle={scriptureTitle}
                chapterTitle={chapterTitle}
                verseLabel={verseLabel}
                sanskrit={v.sanskrit}
                transliteration={v.transliteration}
                hindi={v.hindi}
                translation={v.translation}
                coreShift={literaryMeta.isCurated ? literaryMeta.coreShiftHi || literaryMeta.coreShiftEn : undefined}
                verseUrl={shareVerseUrl(SITE_URL, scriptureId, chapterId, v.number)}
              />
            </span>

            {/* Colour picker popover when open */}
            <div className="relative" ref={pickerRef}>
              {/* CSS pop-in (motion.css .chrome-pop), so a chapter page does not need framer-motion. */}
              {pickerOpen && (
                  <div
                    role="group"
                    aria-label="हाइलाइट रंग चुनें (Choose highlight colour)"
                    className="chrome-pop absolute right-0 top-full z-30 mt-2 flex items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card p-1.5 shadow-xl"
                  >
                    {(Object.keys(HIGHLIGHTS) as HighlightColor[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          onHighlight(c);
                          setPickerOpen(false);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:scale-110"
                        aria-pressed={highlight === c}
                        aria-label={`${HIGHLIGHTS[c].label}${highlight === c ? ' (हटाने के लिए दबाएँ)' : ''}`}
                        title={HIGHLIGHTS[c].label}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-6 w-6 rounded-full ${HIGHLIGHTS[c].swatch} ${
                            highlight === c ? 'ring-2 ring-offset-2 ring-offset-dharma-card ring-dharma-text/60' : ''
                          }`}
                        />
                      </button>
                    ))}
                    {highlight && (
                      <button
                        type="button"
                        onClick={() => {
                          onHighlight(highlight);
                          setPickerOpen(false);
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text"
                        aria-label="हाइलाइट हटाएँ (Remove highlight)"
                        title="हटाएँ"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-dharma-border">
                          <X className="h-3.5 w-3.5" />
                        </span>
                      </button>
                    )}
                  </div>
              )}
            </div>

            {/* ActionMenu overflow */}
            <ActionMenu
              label="और विकल्प · More actions"
              triggerClassName={iconButton}
              items={[
                {
                  key: 'highlight',
                  label: highlight ? 'हाइलाइट बदलें या हटाएं · Highlight' : 'हाइलाइट करें · Highlight',
                  icon: <Highlighter className="h-4 w-4" />,
                  onSelect: () => setPickerOpen((o) => !o),
                },
                {
                  key: 'collection',
                  label: inCollectionCount && inCollectionCount > 0 ? `संग्रह में सुरक्षित (${inCollectionCount})` : 'संग्रह में जोड़ें · Add to collection',
                  icon: inCollectionCount && inCollectionCount > 0 ? <FolderCheck className="h-4 w-4" /> : <FolderPlus className="h-4 w-4" />,
                  onSelect: onAddToCollection ?? (() => {}),
                  hidden: !onAddToCollection,
                },
                {
                  key: 'sandhi',
                  label: isSandhiSplit ? 'संयुक्त श्लोक दृश्य · Standard view' : 'पदच्छेद विच्छेद दृश्य · Split view',
                  icon: <ScrollText className="h-4 w-4" />,
                  onSelect: () => setIsSandhiSplit(!isSandhiSplit),
                  hidden: !hasSplitData,
                },
                {
                  key: 'copy',
                  label: copied ? 'कॉपी हो गया · Copied' : 'उद्धरण सहित कॉपी · Copy with citation',
                  icon: copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />,
                  onSelect: onCopy,
                },
                {
                  key: 'citation',
                  label: 'शास्त्रीय उद्धरण · Scholarly citation',
                  icon: <Quote className="h-4 w-4" />,
                  onSelect: () => setCitationModalOpen(true),
                },
                {
                  key: 'story',
                  label: '60-सेकंड सार · 60-second summary',
                  icon: <Zap className="h-4 w-4" />,
                  onSelect: () => setStoryDeckOpen(true),
                  hidden: chantingMode,
                },
                {
                  key: 'focus',
                  label: 'एकाग्रता मोड · Focus mode',
                  icon: <Maximize2 className="h-4 w-4" />,
                  onSelect: () => onOpenFocus?.(),
                  hidden: !onOpenFocus,
                },
                {
                  key: 'contribute',
                  label: 'अर्थ जोड़ें या सुधारें · Suggest a correction',
                  icon: <Edit3 className="h-4 w-4" />,
                  onSelect: onContribute,
                  hidden: chantingMode,
                },
              ]}
            />
          </div>
        </header>

        {/* ── The canonical verse remains the visual center of the card. ── */}
        {lines.length > 0 && (
          <div className={`verse-folio relative rounded-2xl px-2 py-4 text-center md:px-8 md:py-6 transition-colors ${
            isReciting ? '!border-amber-400/60 !bg-amber-500/10 dark:!bg-amber-950/40 ring-1 ring-amber-400/40' : ''
          }`}>
            {speaker && (
              <div className="mb-3.5 flex justify-center">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide transition-all ${
                    isReciting && activeLineIndex === 0 && hasSpeakerInText
                      ? 'bg-amber-500/20 text-amber-900 dark:text-amber-200 ring-1 ring-amber-400/50'
                      : 'bg-amber-100/70 text-amber-900/90 dark:bg-amber-950/40 dark:text-amber-200/90 border border-amber-300/40 dark:border-amber-800/30'
                  }`}
                >
                  <span className="text-[10px] opacity-75 font-serif" aria-hidden="true">✦</span>
                  <span className="font-devanagari">{speaker}</span>
                  <span className="text-[10px] opacity-75 font-serif" aria-hidden="true">✦</span>
                </span>
              </div>
            )}
            {isSandhiSplit && hasSplitData ? (
              <div data-reveal="1" className="mx-auto my-2 max-w-2xl text-center">
                <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-amber-300/80 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/30">
                  {splitWords.map((w, wIdx) => {
                    const isHovered = hoveredWordIndex === wIdx;
                    return (
                      <button
                        key={wIdx}
                        type="button"
                        onMouseEnter={() => setHoveredWordIndex(wIdx)}
                        onMouseLeave={() => setHoveredWordIndex(null)}
                        onClick={() => setHoveredWordIndex(isHovered ? null : wIdx)}
                        className={`cursor-pointer rounded-xl px-3 py-1.5 text-base md:text-lg font-devanagari font-bold transition-all ${
                          isHovered
                            ? 'bg-saffron-600 text-white shadow-md scale-105 ring-2 ring-saffron-400'
                            : 'bg-dharma-card/90 text-dharma-text border border-dharma-border/80 hover:border-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-950/40'
                        }`}
                      >
                        {w.pada}
                      </button>
                    );
                  })}
                </div>
                {hoveredWordIndex !== null && splitWords[hoveredWordIndex] && (
                  <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-saffron-300 bg-saffron-100/90 px-3.5 py-1.5 text-xs text-saffron-950 shadow-sm dark:border-saffron-700 dark:bg-saffron-950/60 dark:text-saffron-200">
                    <span className="font-devanagari font-bold text-sm">{splitWords[hoveredWordIndex].pada}</span>
                    {splitWords[hoveredWordIndex].meaning && (
                      <span className="font-medium">→ {splitWords[hoveredWordIndex].meaning}</span>
                    )}
                  </div>
                )}
                <p className="mt-2 text-[11px] text-dharma-muted italic">
                  किसी भी पद पर कर्सर ले जाएँ या स्पर्श करें (Hover/tap any word for Hindi & English gloss)
                </p>
              </div>
            ) : (
              <p data-reveal="1" lang="sa" className={`font-devanagari ${sanskritFontSizeClass} text-dharma-text`}>
                {lines.map((line, i) => {
                  const recitationLineIdx = hasSpeakerInText ? i + 1 : i;
                  const isLineActive = isReciting && activeLineIndex === recitationLineIdx;
                  return (
                    <span
                      key={i}
                      className={`block rounded-xl px-3 py-1.5 -mx-3 transition-all duration-300 ${
                        isLineActive
                          ? 'bg-amber-500/15 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400/50 font-medium'
                          : ''
                      }`}
                    >
                      <GlossaryText text={line} />
                    </span>
                  );
                })}
                <span
                  aria-hidden="true"
                  className="verse-mark mt-2 block text-base font-semibold text-saffron-700/90 dark:text-amber-300/90"
                  title={chandas ? `छन्दः ${chandas.name} · ${chandas.nameEn} (${chandas.syllables} वर्ण)` : undefined}
                >
                  ॥ {verseMarkNumber(verseLabel)} ॥
                </span>
              </p>
            )}
            {transliterationText && layers.translit && (
              <p
                data-reveal="2"
                lang="sa-Latn"
                className="mx-auto mt-4 max-w-2xl whitespace-pre-line border-t border-amber-700/15 pt-4 text-sm italic leading-relaxed text-dharma-muted md:text-[15px]"
              >
                {/* The ॥ N ॥ above already closes the verse; drop the source's trailing "||". */}
                {transliterationText}
              </p>
            )}
          </div>
        )}

        {!chantingMode && (
          <div className="sacred-flow-wrap mt-5" data-reveal="3">
            {/* ── Arth: the literal meaning, always first after the verse ── */}
            {showArth && (
              <section id={`verse-${v.number}-arth`} aria-label={`अर्थ · Meaning, ${formatVerseRef(scriptureId, chapterId, verseLabel)}`}>
              <div className="space-y-4">
                {bothPending ? (
                  <div className="flex flex-col gap-3">
                    {/* No meaning in either language: why, the transliteration when that layer is off, and the nearest verses with one. */}
                    <MeaningPendingNote
                      chapterId={chapterId}
                      transliteration={!layers.translit ? v.transliteration : undefined}
                      nearby={meaningNearby}
                      hasExplanation={hasExplanation}
                    />
                    {!chantingMode && !hasExplanation && (
                      <button
                        type="button"
                        onClick={onContribute}
                        className="inline-flex min-h-[44px] items-center gap-1 self-start text-xs font-semibold text-saffron-800 underline-offset-2 hover:underline dark:text-saffron-300"
                      >
                        <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span lang="hi" className="font-devanagari">अर्थ सुझाएँ</span>
                        <span lang="en">Suggest one</span>
                      </button>
                    )}
                  </div>
                ) : (
                <>
                {showHindi && (
                  <div className={`-mx-2 rounded-xl px-2 py-1 transition-colors duration-200 ${
                    isReciting && activeTranslationLang === 'hi'
                      ? 'bg-amber-500/10 ring-2 ring-inset ring-amber-400/35'
                      : ''
                  }`}>
                    {showEnglish && state.hi === 'text' && !v.hindiRange && (
                      <p className="mb-1 text-[11px] font-semibold tracking-wide text-saffron-800/80 dark:text-saffron-300/80 font-devanagari">
                        भावार्थ · Hindi
                      </p>
                    )}
                    {state.hi === 'text' && v.hindiUnproofread && (
                      <p className="mb-1 text-xs text-dharma-muted">
                        <span lang="hi" className="font-devanagari">{MEANING_COPY.hiUnproofread}</span>{' '}
                        <span aria-hidden="true">·</span> <span lang="en">From the printed edition, not yet proofread</span>
                      </p>
                    )}
                    {state.hi === 'text' && (
                      <PassageText
                        lang="hi"
                        label={v.hindiRange ? MEANING_COPY.hiRange(v.hindiRange) : undefined}
                        long={Boolean(v.hindiRange) && isLongPassage(v.hindi)}
                        className={`font-devanagari ${translationFontSizeClass} text-dharma-text`}
                      >
                        <GlossaryText text={v.hindi!} />
                        {meaning.editorial && meaning.editorial.arthaDecision !== 'preserve-existing' && (
                          <span className="ml-2 align-middle"><DraftBadge lang="hi" /></span>
                        )}
                        {v.hindiSource === 'ai' && (
                          <span
                            className="ml-2 inline-block rounded-full border border-blue-200 bg-blue-50 px-1.5 py-px align-middle text-[9px] font-medium text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300"
                            title="संस्कृत से मशीन-अनुवादित; विद्वत् अनुवाद नहीं"
                          >
                            AI अनुवाद
                          </span>
                        )}
                      </PassageText>
                    )}
                    {state.hi === 'review' && (
                      <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-muted">
                        {MEANING_COPY.hiReview}
                      </p>
                    )}
                    {state.hi === 'with' && (
                      <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-muted">
                        <a href={`#verse-${v.hindiSeeVerse}`} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                          {MEANING_COPY.hiWith(v.hindiSeeVerse!)}
                        </a>
                      </p>
                    )}
                    {state.hi === 'pending' && (
                      <PendingMeaning lang="hi">{MEANING_COPY.hiPending}</PendingMeaning>
                    )}
                  </div>
                )}

                {showEnglish && (
                  <div className={`-mx-2 rounded-xl px-2 py-1 transition-colors duration-200 ${
                    showHindi ? 'mt-2 pt-2 border-t border-dharma-border/30' : ''
                  } ${
                    isReciting && activeTranslationLang === 'en'
                      ? 'bg-amber-500/10 ring-2 ring-inset ring-amber-400/35'
                      : ''
                  }`}>
                    {showHindi && state.en === 'text' && !v.translationRange && (
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-saffron-800/80 dark:text-saffron-300/80 font-serif">
                        Translation · English
                      </p>
                    )}
                    {state.en === 'text' && (
                      <PassageText
                        lang="en"
                        label={v.translationRange ? MEANING_COPY.enRange(v.translationRange) : undefined}
                        long={Boolean(v.translationRange) && isLongPassage(v.translation)}
                        className={`font-serif ${translationFontSizeClass} text-dharma-text`}
                      >
                        {v.translation}
                        {meaning.editorial && meaning.editorial.arthaDecision !== 'preserve-existing' && (
                          <span className="ml-2 align-middle"><DraftBadge lang="en" /></span>
                        )}
                        {v.translationSource === 'ai' && (
                          <span
                            className="ml-2 inline-block rounded-full border border-blue-200 bg-blue-50 px-1.5 py-px align-middle text-[9px] font-medium text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300"
                            title={STUDY_TRANSLATION_SHORT.detail}
                          >
                            {STUDY_TRANSLATION_SHORT.en}
                          </span>
                        )}
                      </PassageText>
                    )}
                    {state.en === 'with' && (
                      <p lang="en" className="text-sm leading-relaxed text-dharma-muted">
                        <a href={`#verse-${v.translationSeeVerse}`} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                          {MEANING_COPY.enWith(v.translationSeeVerse!)}
                        </a>
                      </p>
                    )}
                    {state.en === 'pending' && (
                      <PendingMeaning lang="en">{MEANING_COPY.enPending}</PendingMeaning>
                    )}
                  </div>
                )}
                </>
                )}
              </div>
              </section>
            )}

            {/* Dialogue context for the verse above; renders nothing without dialogue data. */}
            <SamvadaStrip scriptureId={scriptureId} chapterId={chapterId} verseNumber={v.number} />

            {hasStudyContent && (
              <VerseStudyDisclosure
                key={`${depth}:${layers.commentary}:${studyRequested ? 1 : 0}`}
                depth={depth}
                defaultOpen={studyRequested || (depth !== 'read' && layers.commentary)}
                loadFullStudy={studyRequested}
                canDeepen={Boolean(v.wordMeaning || science || v.keywords?.length)}
                versePageHref={versePageHref}
              >
                {(studyDepth) => {
                  const showVyakhya = Boolean(hasExplanation || literaryMeta.isCurated);
                  const showScience = Boolean(studyDepth === 'study' && science);
                  const showLessonModern = Boolean(
                    lesson && modernParsed
                    && (!modernParsed.hasStructuredFormat || modernParsed.contextText || modernParsed.applicationText),
                  );
                  const showModern = showScience || showLessonModern;
                  const showReflection = Boolean(
                    (modernParsed?.hasStructuredFormat && modernParsed.reflectionQuestion)
                    || literaryMeta.isCurated || insight?.marma,
                  );
                  const showRelated = Boolean(
                    relatedTeachings?.length || insight?.situations.length
                    || (studyDepth === 'study' && v.keywords?.length),
                  );

                  return (
                    <>
                      {/* ── Word-by-word meaning (पदच्छेद एवं शब्दार्थ) ─────── */}
                      {v.wordMeaning && !chantingMode && studyDepth === 'study' && (
                        <div
                          className={`mt-3 rounded-xl border p-2.5 sm:p-3 transition-all ${
                            isSandhiSplit
                              ? 'border-saffron-300/80 bg-saffron-50/40 dark:border-saffron-800/40 dark:bg-saffron-950/20'
                              : 'border-amber-200/70 bg-amber-50/40 dark:border-amber-900/30 dark:bg-amber-950/20'
                          }`}
                        >
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <p className="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-amber-900/90 dark:text-amber-200/90">
                              <ScrollText className="h-3 w-3 shrink-0 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                              <span>पदच्छेद एवं शब्दार्थ</span>
                              <span className="font-normal text-amber-800/70 dark:text-amber-300/70 text-[10px]">· Word-by-Word</span>
                            </p>
                            {hasSplitData && (
                              <button
                                type="button"
                                onClick={() => setIsSandhiSplit(!isSandhiSplit)}
                                className="text-[10px] font-medium text-saffron-700 hover:underline dark:text-saffron-300"
                              >
                                {isSandhiSplit ? 'संयुक्त श्लोक देखें' : 'विच्छेद दृश्य (Split View)'}
                              </button>
                            )}
                          </div>
                          {parsedGloss.length > 0 ? (
                            <div className="flex flex-wrap gap-1.5">
                              {parsedGloss.map((g, gIdx) => {
                                const isHighlighted = hoveredWordIndex === gIdx;
                                const isSpoken = activeWordIndex === gIdx;
                                return (
                                  <button
                                    key={gIdx}
                                    type="button"
                                    onMouseEnter={() => setHoveredWordIndex(gIdx)}
                                    onMouseLeave={() => setHoveredWordIndex(null)}
                                    onClick={() => {
                                      triggerTactileFeedback('selection', 'softTap');
                                      setActiveWordIndex(gIdx);
                                      speakSanskritTerm(g.pada, 0.85);
                                      showSabdaPeek({
                                        word: g.pada,
                                        wordDevanagari: g.pada,
                                        meaningHi: g.meaning,
                                        verseRef: `${scriptureTitle} ${chapterId}.${v.number}`,
                                      });
                                      setTimeout(() => setActiveWordIndex((cur) => (cur === gIdx ? null : cur)), 1800);
                                    }}
                                    className={`inline-flex min-h-[26px] items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] transition active:scale-95 text-left ${
                                      isSpoken || isHighlighted
                                        ? 'border-amber-400 bg-amber-100/90 text-amber-950 dark:border-amber-400 dark:bg-amber-900/40 dark:text-amber-100 ring-1 ring-amber-400/50 shadow-2xs'
                                        : 'border-amber-200/70 bg-amber-50/60 text-dharma-text hover:border-amber-300 hover:bg-amber-100/40 dark:border-amber-900/50 dark:bg-amber-950/30'
                                    }`}
                                    aria-label={`उच्चारण सुनें: ${g.pada}`}
                                    title={`${g.pada}: क्लिक करके उच्चारण सुनें`}
                                  >
                                    <span className="font-devanagari text-xs font-semibold text-amber-900 dark:text-amber-200">{g.pada}</span>
                                    {g.meaning && (
                                      <>
                                        <span className="text-amber-400/80 dark:text-amber-600/80 font-serif text-[10px]">·</span>
                                        <span className="text-dharma-muted text-[10px] font-sans leading-tight">{g.meaning}</span>
                                      </>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <p lang="sa" className="font-devanagari text-xs leading-relaxed text-dharma-text">
                              {v.wordMeaning}
                            </p>
                          )}
                        </div>
                      )}

                      {/* ── Vyakhya → Modern Context → Reflection: one connected flow ── */}
                      {(showVyakhya || showModern || showReflection) && (
                        <ConnectedFlow label="व्याख्या से आधुनिक जीवन तक · From explanation to modern life">
                        {showVyakhya && (
                        <SacredSection id={`verse-${v.number}-vyakhya`} section="vyakhya">
                        <div className="space-y-4">
                          {/* Vyakhya: What does this teaching mean? */}
                          {vyakhya && (
                            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-4.5 sm:p-5 shadow-2xs dark:border-amber-900/40 dark:bg-amber-950/20">
                              <div className="mb-2.5 flex flex-wrap items-center justify-end gap-1.5">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  <ContentLabelBadge kind="explanation" />
                                  {meaning.editorial && <DraftBadge lang="hi" />}
                                  {meaning.isAi && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-300" title={`${EDITORIAL_DRAFT_LABEL.detailHi} ${EDITORIAL_DRAFT_LABEL.detail}`}>
                                      <Sparkles className="h-3 w-3" aria-hidden="true" />
                                      {EDITORIAL_DRAFT_LABEL.hi}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p lang="hi" className="font-devanagari text-base leading-loose text-dharma-text">
                                {vyakhya}
                              </p>
                            </div>
                          )}

                          {commentary && (
                            <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card/70 p-4.5 sm:p-5 shadow-2xs">
                              <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">Commentary &amp; Explanation</p>
                                <ContentLabelBadge kind="explanation" />
                              </div>
                              <p lang="en" className="font-serif text-base leading-relaxed text-dharma-text">{commentary}</p>
                            </div>
                          )}

                          {/* What the verse does NOT mean belongs to Vyakhya: it answers "what it means" by clearing the common misreading. */}
                          {literaryMeta.isCurated && (
                            <Collapsible title={<><span lang="hi" className="font-devanagari">सामान्य भ्रम और वास्तविक दृष्टि</span> · Common misreading &amp; deeper truth</>}>
                              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-900/40 dark:bg-rose-950/20 shadow-2xs">
                                  <p className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                    <span>❌</span> सामान्य भ्रम (What It Does NOT Mean)
                                  </p>
                                  <p lang="hi" className="font-devanagari text-xs sm:text-sm text-rose-950 dark:text-rose-100 leading-relaxed">
                                    {literaryMeta.misreadingHi}
                                  </p>
                                  {literaryMeta.misreadingEn && (
                                    <p className="text-[11px] text-rose-800/80 dark:text-rose-300/70 italic mt-1 font-serif">
                                      &ldquo;{literaryMeta.misreadingEn}&rdquo;
                                    </p>
                                  )}
                                </div>
                                <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20 shadow-2xs">
                                  <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                                    <span>✓</span> वास्तविक दृष्टि (The Deeper Truth)
                                  </p>
                                  <p lang="hi" className="font-devanagari text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed font-medium">
                                    {literaryMeta.deeperTruthHi}
                                  </p>
                                  {literaryMeta.deeperTruthEn && (
                                    <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/70 mt-1 font-serif">
                                      {literaryMeta.deeperTruthEn}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </Collapsible>
                          )}
                        </div>
                        </SacredSection>
                        )}

                        {/* ── Modern Context: how the teaching appears in life today ── */}
                        {showModern && (
                        <SacredSection id={`verse-${v.number}-modern`} section="modern">
                        <div className="space-y-4">
                          {showScience && science && (
                            <div className="rounded-2xl border border-dharma-border bg-dharma-card-soft p-4 sm:p-5 shadow-2xs">
                              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                                  {meaning.editorial ? 'विवेकपूर्ण आधुनिक परिप्रेक्ष्य · Responsible Modern Perspective' : 'आधुनिक परिप्रेक्ष्य · Modern perspective'}
                                </p>
                            {meaning.editorial ? (
                              <span className="flex flex-wrap items-center gap-1.5">
                                {VIJNANA_CATEGORIES[meaning.editorial.vijnanaCategory] && (
                                  <span data-content-label="vijnana" className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                                    {VIJNANA_CATEGORIES[meaning.editorial.vijnanaCategory]}
                                  </span>
                                )}
                                <span data-content-label="editorial" className="rounded-full border border-dharma-border/70 bg-dharma-bg/70 px-2 py-0.5 text-[10px] font-semibold text-dharma-muted">
                                  संपादकीय अवलोकन · Editorial observation
                                </span>
                                <DraftBadge lang="hi" />
                              </span>
                            ) : (
                              <span className="flex flex-wrap items-center gap-1.5">
                                <ContentLabelBadge kind="research" />
                                {meaning.scienceIsAi && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-300" title={`${EDITORIAL_DRAFT_LABEL.detailHi} ${EDITORIAL_DRAFT_LABEL.detail}`}>
                                    <Sparkles className="h-3 w-3" aria-hidden="true" />
                                    {EDITORIAL_DRAFT_LABEL.hi}
                                  </span>
                                )}
                              </span>
                            )}
                          </div>
                          <p
                            lang={scienceIsHi ? 'hi' : 'en'}
                            className={`text-sm leading-relaxed text-dharma-text md:text-base ${scienceIsHi ? 'font-devanagari leading-loose' : ''}`}
                          >
                            {science}
                          </p>
                            </div>
                          )}
                          {showLessonModern && lesson && modernParsed && (
                            <div>
                              <div className="mb-2 flex flex-wrap items-center justify-end gap-1.5">
                                <ContentLabelBadge kind="reflection" />
                                {meaning.editorial && <DraftBadge lang="hi" />}
                              </div>
                              <ModernContextBody
                                parsed={modernParsed}
                                lang={lessonIsHi ? 'hi' : 'en'}
                                className={lessonIsHi ? 'leading-loose' : ''}
                                hideContextHeading
                              />
                            </div>
                          )}
                        </div>
                        </SacredSection>
                        )}

                        {/* ── Reflection: one question to sit with, then the core shift ── */}
                        {showReflection && (
                        <SacredSection id={`verse-${v.number}-reflection`} section="reflection">
                          {modernParsed?.hasStructuredFormat && modernParsed.reflectionQuestion && (
                            <ReflectionBody
                              question={modernParsed.reflectionQuestion}
                              lang={lessonIsHi ? 'hi' : 'en'}
                            />
                          )}
                      {literaryMeta.isCurated ? (
                        <div className="rounded-2xl border border-dharma-border bg-dharma-card-soft p-4 sm:p-5 shadow-2xs">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
                              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                              मर्म · In One Breath
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {literaryMeta.situationalMoments.map((m) => (
                                <span
                                  key={m.id}
                                  title={m.descriptionEn}
                                  className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-white/80 px-2.5 py-0.5 text-[11px] font-medium text-amber-950 dark:border-amber-800/60 dark:bg-amber-900/40 dark:text-amber-200"
                                >
                                  <span>{m.emoji}</span>
                                  <span>{m.labelHi}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="font-serif italic text-base sm:text-lg font-bold leading-relaxed text-amber-950 dark:text-amber-100">
                            &ldquo;{literaryMeta.coreShiftHi}&rdquo;
                          </p>
                          {literaryMeta.coreShiftEn && (
                            <p className="font-serif text-xs sm:text-sm text-amber-900/85 dark:text-amber-300/80 mt-1.5 font-normal">
                              {literaryMeta.coreShiftEn}
                            </p>
                          )}
                          <p className="mt-2.5 text-[10px] font-semibold uppercase tracking-wider text-dharma-muted">
                            {literaryMeta.editorialLabel} · {literaryMeta.editorialStatus}
                          </p>
                        </div>
                      ) : (
                        insight?.marma && (
                          <figure className="border-l-4 border-saffron-500 pl-4 dark:border-saffron-400">
                            <figcaption className="mb-1 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-saffron-800 dark:text-saffron-300">
                              <span lang="hi">मर्म</span>
                              <span aria-hidden="true">·</span>
                              <span lang="en">The Core Shift</span>
                              <ContentLabelBadge kind="reflection" />
                            </figcaption>
                            <blockquote lang="en" className="font-serif text-base sm:text-lg font-semibold leading-snug text-dharma-text">
                              {insight.marma}
                            </blockquote>
                          </figure>
                        )
                      )}
                        </SacredSection>
                        )}
                        </ConnectedFlow>
                      )}

                      {/* ── Related Wisdom: approved links, life situations, keywords ── */}
                      {showRelated && (
                      <SacredSection id={`verse-${v.number}-related`} section="related">
                      {/* Life situations */}
                      {insight && insight.situations.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span lang="hi" className="mr-1 text-[11px] font-semibold text-dharma-muted">जीवन प्रसंग:</span>
                          {insight.situations.map((s) => (
                            <Link
                              key={s.slug}
                              href={s.href}
                              className="inline-flex items-center gap-1 rounded-full border border-indigo-200/80 bg-indigo-50/70 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-800 transition hover:border-indigo-400 hover:bg-indigo-100 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-200 dark:hover:bg-indigo-500/20"
                            >
                              <span lang="en">{s.en}</span>
                              <span aria-hidden="true" className="opacity-50">·</span>
                              <span lang="hi">{s.hi}</span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Keywords */}
                      {studyDepth === 'study' && v.keywords && v.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-medium text-dharma-muted/80 mr-1">संबंधित:</span>
                          {v.keywords.map((k) => {
                            const target = resolveKeywordTarget(k);
                            return (
                              <Link
                                key={k}
                                href={target.href}
                                onClick={(e) => {
                                  if (onOpenSvadhyaya) {
                                    e.preventDefault();
                                    onOpenSvadhyaya('concept', k.replace(/^#+/, '').toLowerCase());
                                  }
                                }}
                                title={target.tooltip}
                                className="inline-flex items-center gap-1 rounded-full border border-saffron-200/80 bg-saffron-50/70 px-2.5 py-0.5 text-[11px] font-semibold text-saffron-800 transition-all hover:border-saffron-400 hover:bg-saffron-100 hover:text-saffron-900 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 dark:border-saffron-400/25 dark:bg-saffron-500/10 dark:text-saffron-200 dark:hover:bg-saffron-500/20"
                              >
                                <span>#{k.replace(/^#+/, '')}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}

                      {relatedTeachings && relatedTeachings.length > 0 && (
                        <details className="rounded-2xl border border-dharma-border/70 bg-dharma-card/50">
                          <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-2 text-sm font-semibold text-dharma-text outline-none transition-colors hover:bg-dharma-card focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2 focus-visible:ring-offset-dharma-bg [&::-webkit-details-marker]:hidden">
                            <span><span lang="hi" className="font-devanagari">संबंधित उपदेश</span> · Related teachings</span>
                            <span className="shrink-0 text-xs font-medium text-dharma-muted">{Math.min(relatedTeachings.length, 3)} links</span>
                          </summary>
                          <div className="space-y-3 border-t border-dharma-border/60 p-4">
                            <p className="text-xs leading-relaxed text-dharma-muted">
                              Editorial links for study. A link does not claim that two passages teach exactly the same thing.
                            </p>
                            <ul className="space-y-3">
                              {relatedTeachings.slice(0, 3).map((connection) => (
                                <li key={`${connection.scriptureTitle}-${connection.reference}`} className="rounded-xl border border-dharma-border/60 bg-dharma-card/70 p-3">
                                  <p className="text-[11px] font-bold uppercase tracking-wide text-dharma-muted">
                                    {CONNECTION_KIND_LABEL[connection.kind]}
                                  </p>
                                  <p className="mt-1 font-semibold text-dharma-text">
                                    {connection.href ? (
                                      <Link href={connection.href} className="inline-flex min-h-[44px] items-center text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                                        {connection.scriptureTitle} {connection.reference} <span className="ml-1" aria-hidden="true">→</span>
                                      </Link>
                                    ) : (
                                      <>{connection.scriptureTitle} {connection.reference}</>
                                    )}
                                  </p>
                                  <p className="text-sm leading-relaxed text-dharma-text">{connection.summary}</p>
                                  <p className="mt-1 text-xs leading-relaxed text-dharma-muted">
                                    <span className="font-semibold">Why linked:</span> {connection.reason}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      )}
                      </SacredSection>
                      )}

                    </>
                  );
                }}
              </VerseStudyDisclosure>
            )}


          </div>
        )}
      </div>

      {storyDeckLoaded && (
      <StoryDeckModal
        isOpen={storyDeckOpen}
        onClose={() => setStoryDeckOpen(false)}
        data={{
          scriptureTitle: scriptureTitle || scriptureId,
          chapterTitle,
          verseRef: chapterTitle ? `${scriptureTitle} ${chapterId}.${v.number}` : `श्लोक ${verseLabel}`,
          sanskrit: v.sanskrit || '',
          transliteration: v.transliteration,
          hindi: v.hindi,
          english: v.translation,
          meta: literaryMeta,
          chapterHref: versePageHref,
          verseHref: shareVerseUrl(SITE_URL, scriptureId, chapterId, v.number),
        }}
      />
      )}

      {citationLoaded && (
      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        params={{
          scriptureId,
          scriptureTitle,
          chapterId,
          verseNum: v.number,
          sanskrit: v.sanskrit ?? '',
          transliteration: v.transliteration,
          hindi: v.hindi,
          translation: v.translation,
          verseUrl: shareVerseUrl(SITE_URL, scriptureId, chapterId, v.number),
        }}
      />
      )}
    </article>
  );
}
