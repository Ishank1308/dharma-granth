'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { REVEAL_SEQUENCE } from '@/app/components/motion/primitives';
import {
  Bookmark,
  BookmarkCheck,
  Check,
  Compass,
  Copy,
  Edit3,
  FolderCheck,
  FolderPlus,
  Highlighter,
  Maximize2,
  Quote,
  ScrollText,
  Sparkles,
  StickyNote,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import type { ScriptureCategory } from '@/data/types';
import type { VerseHighlight } from '@/lib/useStudyProgress';
import { resolveKeywordTarget } from '@/lib/keyword-links';
import { toAsciiDigits, verseLines } from '@/lib/verse-format';
import { shareVerseUrl } from '@/lib/verse-paths';
import { parseWordMeanings } from '@/lib/word-gloss';
import { SITE_URL } from '@/lib/jsonld';
import { ShareVerseButton } from './ShareVerseButton';
import { GlossaryText } from './GlossaryTooltip';
import { getVerseGraphicClass, getVerseGraphicStyle } from './verse-background';
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
  hindi?: string;
  hindiSource?: 'ai';
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
      className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-300"
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
  /** The reader's own note on this verse, if any. */
  note?: string;
  /** Saves the note; an empty string deletes it. */
  onSaveNote: (text: string) => void;
  highlight?: HighlightColor;
  /** Same colour again removes the highlight (useStudyProgress toggle semantics). */
  onHighlight: (color: HighlightColor) => void;
  /** Opens full-screen focus contemplation mode on this verse */
  onOpenFocus?: () => void;
  /** Dedicated verse page, linked from the card so the URL survives hydration. */
  versePageHref?: string;
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

/** Lotus-petal medallion carrying the verse number in Devanagari numerals. */
function VerseMedallion({ label }: { label: string }) {
  const gradId = useId();
  const petals = Array.from({ length: 8 }, (_, i) => i * 45);
  return (
    <span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center">
      <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full drop-shadow-sm" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
        </defs>
        {petals.map((deg) => (
          <ellipse
            key={deg}
            cx="24"
            cy="9"
            rx="5"
            ry="8.5"
            fill={`url(#${gradId})`}
            opacity="0.28"
            transform={`rotate(${deg} 24 24)`}
          />
        ))}
        <circle cx="24" cy="24" r="14" fill={`url(#${gradId})`} />
        <circle cx="24" cy="24" r="11.5" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="0.8" />
      </svg>
      <span lang="hi" className="relative font-devanagari text-[15px] font-bold leading-none text-white">{label}</span>
    </span>
  );
}

const iconButton =
  'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-dharma-border/70 bg-dharma-card/80 text-dharma-muted backdrop-blur transition hover:border-saffron-300 hover:text-saffron-700 lg:h-9 lg:w-9';

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
  note,
  onSaveNote,
  highlight,
  onHighlight,
  onOpenFocus,
  versePageHref,
  isReciting,
  onPlayRecitation,
  insight,
  onOpenSvadhyaya,
  isActive,
}: Props) {
  const reduce = useReducedMotion();

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

  // ── Personal note ──
  const [editingNote, setEditingNote] = useState(false);
  const [draft, setDraft] = useState('');
  // Focus the editor when the reader opens it (not autoFocus, which also
  // fires on mount and is flagged by jsx-a11y).
  const noteRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (editingNote) noteRef.current?.focus();
  }, [editingNote]);
  const openNoteEditor = () => {
    setDraft(note ?? '');
    setEditingNote(true);
  };
  const saveNote = () => {
    const trimmed = draft.trim();
    onSaveNote(trimmed);
    if (trimmed) {
      saveAnnotation({
        id: `annot_${scriptureId}_${chapterId}_${v.number}`,
        reference: {
          scriptureId,
          chapterId,
          verseId: String(v.number),
          canonicalReference: `${scriptureTitle || scriptureId} ${chapterId}.${v.number}`,
        },
        note: trimmed,
        tags: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      }).catch(() => {});
    } else {
      deleteAnnotation(`annot_${scriptureId}_${chapterId}_${v.number}`).catch(() => {});
    }
    setEditingNote(false);
  };

  const lines = useMemo(() => (v.sanskrit ? verseLines(v.sanskrit) : []), [v.sanskrit]);
  const chandas = useMemo(() => detectChandas(v.sanskrit), [v.sanskrit]);

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
  const showHindi = Boolean((v.hindi || v.hindiSeeVerse != null) && layers.hindi);
  const showEnglish = Boolean(v.translation && layers.english);

  // Sacred reading order (lib/sacred-reading-order): every layer renders in one
  // connected flow — Verse, Arth, Vyakhya, Modern Context, Reflection, Related
  // Wisdom. Gates stay as they were: science appears only at study depth, the
  // lesson and explanations only when the commentary layer is on.
  const modernParsed = useMemo(() => (lesson ? parseModernContext(lesson) : null), [lesson]);
  const showArth = showHindi || showEnglish;
  const showVyakhya = Boolean(layers.commentary && depth !== 'read' && (hasExplanation || literaryMeta.isCurated));
  const showScience = Boolean(layers.commentary && depth === 'study' && science);
  const showLessonModern = Boolean(
    layers.commentary && depth !== 'read' && lesson && modernParsed
      && (!modernParsed.hasStructuredFormat || modernParsed.contextText || modernParsed.applicationText),
  );
  const showModern = showScience || showLessonModern;
  const showReflection = Boolean(
    (layers.commentary && depth !== 'read' && modernParsed?.hasStructuredFormat && modernParsed.reflectionQuestion)
    || (depth !== 'read' && (literaryMeta.isCurated || insight?.marma)),
  );
  const showRelated = Boolean(
    (relatedTeachings && relatedTeachings.length > 0)
    || (insight && insight.situations.length > 0 && depth !== 'read')
    || (depth === 'study' && v.keywords && v.keywords.length > 0),
  );
  const hasMeaning = showArth || showVyakhya || showModern || showReflection;

  // The shloka, transliteration and meanings reveal in that order through CSS (.reveal-seq / data-reveal in
  // globals.css): no opacity:0 in the server HTML, and nothing waits on hydration.
  const verseLabel = String(v.number);

  return (
    <article
      id={`verse-${v.number}`}
      className={`verse-card ${REVEAL_SEQUENCE} group relative scroll-mt-24 rounded-[28px] border bg-dharma-card transition-all duration-300 ${
        isReciting
          ? 'border-amber-400/80 ring-2 ring-amber-400/60 shadow-xl shadow-amber-500/15'
          : highlight
          ? `${HIGHLIGHTS[highlight].ring} border-dharma-border`
          : chantingMode
          ? 'ring-2 ring-saffron-500/25 border-dharma-border'
          : 'border-dharma-border'
      } ${getVerseGraphicClass(category)}`}
      style={{
        ...getVerseGraphicStyle({ category, verseId: v.number }),
        contentVisibility: isActive || isReciting ? 'visible' : 'auto',
        containIntrinsicSize: 'auto 420px',
      }}
      aria-label={`श्लोक ${verseLabel}${isReciting ? ' · श्लोक उच्चारण चालू' : ''}${highlight ? ` · ${HIGHLIGHTS[highlight].label} हाइलाइट` : ''}`}
    >
      <div className="relative p-4 sm:p-5 md:p-7">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-3 sm:mb-5 flex flex-wrap items-center gap-x-3 gap-y-3">
          {onOpenFocus ? (
            <button
              type="button"
              onClick={onOpenFocus}
              className="flex items-center gap-3 text-left focus:outline-none group/hdr"
              title="एकाग्रता मोड में पढ़ें (Focus Mode)"
            >
              <VerseMedallion label={toAsciiDigits(verseLabel)} />
              <div className="shrink-0 whitespace-nowrap">
                <p className="text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
                  अध्याय {toAsciiDigits(chapterId)}
                </p>
                <p className="font-serif text-base font-bold text-dharma-text group-hover/hdr:text-saffron-700 transition-colors">
                  श्लोक {verseLabel}
                </p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <VerseMedallion label={toAsciiDigits(verseLabel)} />
              <div className="shrink-0 whitespace-nowrap">
                <p className="text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
                  अध्याय {toAsciiDigits(chapterId)}
                </p>
                <p className="font-serif text-base font-bold text-dharma-text">श्लोक {verseLabel}</p>
              </div>
            </div>
          )}

          {/* Inline Sandhi-Viccheda (Compound Split) Toggle Pill */}
          {hasSplitData && (
            <button
              type="button"
              onClick={() => {
                setIsSandhiSplit(!isSandhiSplit);
                setHoveredWordIndex(null);
              }}
              aria-pressed={isSandhiSplit}
              title="संधि-विच्छेद (Split Compound Words)"
              className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition border lg:min-h-0 lg:py-1 ${
                isSandhiSplit
                  ? 'border-saffron-500 bg-saffron-100/90 text-saffron-900 shadow-2xs dark:bg-saffron-950/60 dark:text-saffron-200 dark:border-saffron-700'
                  : 'border-dharma-border/80 bg-dharma-card/80 text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
              }`}
            >
              <ScrollText className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
              <span>संधि-विच्छेद · Split Words</span>
            </button>
          )}

          {/* Streamlined, calm toolbar: 3 essential icons + ActionMenu overflow. Never wraps awkwardly on mobile. */}
          <div
            className="ml-auto flex shrink-0 items-center gap-1.5"
            role="toolbar"
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
                  <Volume2 className="h-4 w-4 text-amber-600 dark:text-amber-400 animate-pulse" />
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
            <span className="shrink-0 [&>button]:h-9 [&>button]:w-9">
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
              <AnimatePresence>
                {pickerOpen && (
                  <motion.div
                    role="group"
                    aria-label="हाइलाइट रंग चुनें (Choose highlight colour)"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-full z-30 mt-2 flex items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card p-1.5 shadow-xl"
                  >
                    {(Object.keys(HIGHLIGHTS) as HighlightColor[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          onHighlight(c);
                          setPickerOpen(false);
                        }}
                        className={`h-7 w-7 rounded-full ${HIGHLIGHTS[c].swatch} transition hover:scale-110 ${
                          highlight === c ? 'ring-2 ring-offset-2 ring-offset-dharma-card ring-dharma-text/60' : ''
                        }`}
                        aria-pressed={highlight === c}
                        aria-label={`${HIGHLIGHTS[c].label}${highlight === c ? ' (हटाने के लिए दबाएँ)' : ''}`}
                        title={HIGHLIGHTS[c].label}
                      />
                    ))}
                    {highlight && (
                      <button
                        type="button"
                        onClick={() => {
                          onHighlight(highlight);
                          setPickerOpen(false);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-dharma-border text-dharma-muted hover:text-dharma-text"
                        aria-label="हाइलाइट हटाएँ (Remove highlight)"
                        title="हटाएँ"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ActionMenu overflow */}
            <ActionMenu
              label="और विकल्प · More actions"
              triggerClassName={iconButton}
              items={[
                {
                  key: 'note',
                  label: note ? 'नोट संपादित करें · Edit note' : 'नोट लिखें · Add note',
                  icon: <StickyNote className="h-4 w-4" />,
                  onSelect: () => (editingNote ? setEditingNote(false) : openNoteEditor()),
                },
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

        {/* ── Sanskrit on a manuscript leaf: scripture first; मर्म and the verse-page link follow it ── */}
        {lines.length > 0 && (
          <div className={`verse-leaf relative rounded-2xl px-5 py-6 text-center md:px-10 md:py-8 transition-colors ${
            isReciting ? '!border-amber-400/60 !bg-amber-500/10 dark:!bg-amber-950/40 ring-1 ring-amber-400/40' : ''
          }`}>
            <span aria-hidden="true" className="verse-leaf-ornament left-3 top-2">❁</span>
            <span aria-hidden="true" className="verse-leaf-ornament right-3 top-2">❁</span>
            <div className="mb-3.5 flex flex-wrap items-center justify-center gap-2">
              <ContentLabelBadge kind="mula" />
              {chandas && (
                <span
                  className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-50/80 px-2.5 py-0.5 text-[11px] font-semibold text-amber-900 shadow-2xs dark:border-amber-700/40 dark:bg-amber-950/40 dark:text-amber-200"
                  title={`${chandas.descriptionHi} · ${chandas.description} (${chandas.syllables} वर्ण)`}
                >
                  <span className="font-serif text-amber-700 dark:text-amber-400 font-bold">छन्दः</span>
                  <span>{chandas.name} · {chandas.nameEn}</span>
                </span>
              )}
            </div>
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
                  const isLineActive = isReciting && activeLineIndex === i;
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
                <span aria-hidden="true" className="mt-2 block font-bold text-saffron-700 dark:text-amber-300">
                  ॥ {toAsciiDigits(verseLabel)} ॥
                </span>
              </p>
            )}
            {v.transliteration && layers.translit && (
              <p
                data-reveal="2"
                lang="sa-Latn"
                className="mx-auto mt-4 max-w-2xl whitespace-pre-line border-t border-amber-700/15 pt-4 text-sm italic leading-relaxed text-dharma-muted md:text-[15px]"
              >
                {/* The ॥ N ॥ above already closes the verse; drop the source's trailing "||". */}
                {v.transliteration.replace(/[\s|।॥0-9.]+$/, '')}
              </p>
            )}
          </div>
        )}



        {/* ── Word-by-word meaning (पदच्छेद एवं शब्दार्थ) ─────── */}
        {v.wordMeaning && !chantingMode && depth === 'study' && (
          <div
            className={`mt-4 rounded-2xl border p-4 transition-all ${
              isSandhiSplit
                ? 'border-saffron-300 bg-saffron-50/50 dark:border-saffron-800/40 dark:bg-saffron-950/20'
                : 'border-amber-200/70 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                <ScrollText className="h-3.5 w-3.5" aria-hidden="true" />
                पदच्छेद एवं शब्दार्थ · Word-by-Word Meaning
              </p>
              {hasSplitData && (
                <button
                  type="button"
                  onClick={() => setIsSandhiSplit(!isSandhiSplit)}
                  className="text-[11px] font-bold text-saffron-700 hover:underline dark:text-saffron-300"
                >
                  {isSandhiSplit ? 'संयुक्त श्लोक देखें' : 'विच्छेद दृश्य (Split View)'}
                </button>
              )}
            </div>
            {parsedGloss.length > 0 ? (
              <div className="flex flex-wrap gap-2">
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
                      className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition active:scale-95 text-left ${
                        isSpoken || isHighlighted
                          ? 'border-amber-400 bg-amber-100/90 text-amber-950 dark:border-amber-400 dark:bg-amber-900/40 dark:text-amber-100 ring-2 ring-amber-400/50 shadow-sm'
                          : 'border-amber-200/70 bg-amber-50/60 text-dharma-text hover:border-amber-300 hover:bg-amber-100/40 dark:border-amber-900/50 dark:bg-amber-950/30'
                      }`}
                      aria-label={`उच्चारण सुनें: ${g.pada}`}
                      title={`${g.pada}: क्लिक करके उच्चारण सुनें`}
                    >
                      <span className="font-devanagari font-bold text-amber-900 dark:text-amber-200">{g.pada}</span>
                      {g.meaning && (
                        <>
                          <span className="text-amber-400 dark:text-amber-600 font-serif">·</span>
                          <span className="text-dharma-muted text-[11px] font-sans">{g.meaning}</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p lang="sa" className="font-devanagari text-sm leading-loose text-dharma-text">
                {v.wordMeaning}
              </p>
            )}
          </div>
        )}

        {/* ── The reader's own note ─────────────────────────── */}
        {!chantingMode && (editingNote || note) && (
          <div className="mt-5 rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-4 dark:border-indigo-400/25 dark:bg-indigo-500/10">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
              मेरा नोट
            </p>
            {editingNote ? (
              <>
                <textarea
                  ref={noteRef}
                  value={draft}
                  maxLength={NOTE_MAX}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setEditingNote(false);
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveNote();
                  }}
                  rows={3}
                  placeholder="इस श्लोक पर आपका विचार, प्रश्न या अनुभव…"
                  aria-label={`श्लोक ${verseLabel} पर नोट`}
                  className="w-full resize-y rounded-xl border border-indigo-200 bg-dharma-card p-3 text-sm leading-relaxed text-dharma-text outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 dark:border-indigo-400/30"
                />
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={saveNote}
                    className="rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-indigo-700"
                  >
                    सहेजें
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingNote(false)}
                    className="rounded-full px-3 py-1.5 text-xs font-semibold text-dharma-muted transition hover:text-dharma-text"
                  >
                    रद्द करें
                  </button>
                  {note && (
                    <button
                      type="button"
                      onClick={() => {
                        onSaveNote('');
                        setEditingNote(false);
                      }}
                      className="ml-auto rounded-full px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                    >
                      हटाएँ
                    </button>
                  )}
                  <span
                    className={`hidden text-[11px] text-dharma-muted sm:inline ${note ? '' : 'ml-auto'}`}
                    aria-hidden="true"
                  >
                    Ctrl + Enter
                  </span>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={openNoteEditor}
                className="block w-full whitespace-pre-line text-left text-sm leading-relaxed text-dharma-text"
                aria-label="नोट संपादित करें (Edit note)"
              >
                {note}
              </button>
            )}
          </div>
        )}

        {!chantingMode && (
          <div className="sacred-flow-wrap mt-5" data-reveal="3">
            {/* Dialogue context for the verse above; renders nothing without dialogue data. */}
            <SamvadaStrip scriptureId={scriptureId} chapterId={chapterId} verseNumber={v.number} />

            {/* ── Arth: the literal meaning, always first after the verse ── */}
            {showArth && (
              <SacredSection id={`verse-${v.number}-arth`} section="arth">
              <div className="space-y-3.5">
                {showHindi && (
                  <div className={`rounded-2xl border p-4.5 sm:p-5 shadow-2xs transition-all duration-300 ${
                    isReciting && activeTranslationLang === 'hi'
                      ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/40'
                      : 'border-dharma-border/70 bg-dharma-card-soft/70'
                  }`}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p lang="hi" className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                        {v.hindiRange
                          ? `श्लोक ${toAsciiDigits(v.hindiRange.replace('-', '–'))} का हिंदी अनुवाद · Hindi Translation`
                          : 'हिंदी अनुवाद · Hindi Translation'}
                      </p>
                      <ContentLabelBadge kind="literal" />
                    </div>
                    {!v.hindi && v.hindiSeeVerse != null && (
                      <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-muted">
                        इस श्लोक का अर्थ श्लोक {toAsciiDigits(String(v.hindiSeeVerse))} के साथ संयुक्त रूप से दिया गया है।{' '}
                        <a href={`#verse-${v.hindiSeeVerse}`} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">
                          देखें श्लोक {toAsciiDigits(String(v.hindiSeeVerse))} ↑
                        </a>
                      </p>
                    )}
                    <p lang="hi" className={`font-devanagari ${translationFontSizeClass} text-dharma-text`}>
                      {v.hindi && <GlossaryText text={v.hindi} />}
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
                    </p>
                  </div>
                )}

                {showEnglish && (
                  <div className={`rounded-2xl border p-4.5 sm:p-5 shadow-2xs transition-all duration-300 ${
                    isReciting && activeTranslationLang === 'en'
                      ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/40'
                      : 'border-dharma-border/70 bg-dharma-card/70'
                  }`}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p lang="en" className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                        English Translation
                      </p>
                      <ContentLabelBadge kind="literal" />
                    </div>
                    <p lang="en" className={`font-serif ${translationFontSizeClass} text-dharma-text`}>
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
                    </p>
                  </div>
                )}
              </div>
              </SacredSection>
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
                    <p lang="hi" className="font-devanagari text-sm leading-loose text-dharma-text md:text-base">
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
                    <p lang="en" className="font-serif text-sm leading-relaxed text-dharma-text md:text-base">{commentary}</p>
                  </div>
                )}

                {/* What the verse does NOT mean belongs to Vyakhya: it answers "what it means" by clearing the common misreading. */}
                {literaryMeta.isCurated && depth !== 'read' && (
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
                        <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                          {VIJNANA_CATEGORIES[meaning.editorial.vijnanaCategory]}
                        </span>
                      )}
                      <span className="rounded-full border border-dharma-border/70 bg-dharma-bg/70 px-2 py-0.5 text-[10px] font-semibold text-dharma-muted">
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
                    />
                  </div>
                )}
              </div>
              </SacredSection>
              )}

              {/* ── Reflection: one question to sit with, then the core shift ── */}
              {showReflection && (
              <SacredSection id={`verse-${v.number}-reflection`} section="reflection">
                {layers.commentary && depth !== 'read' && modernParsed?.hasStructuredFormat && modernParsed.reflectionQuestion && (
                  <ReflectionBody
                    question={modernParsed.reflectionQuestion}
                    lang={lessonIsHi ? 'hi' : 'en'}
                  />
                )}
            {literaryMeta.isCurated && depth !== 'read' ? (
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
              insight?.marma && depth !== 'read' && (
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
            {insight && insight.situations.length > 0 && depth !== 'read' && (
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
            {depth === 'study' && v.keywords && v.keywords.length > 0 && (
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

            {!hasMeaning && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-dharma-border bg-dharma-bg/60 p-4">
                <p className="text-sm text-dharma-muted">इस श्लोक का अर्थ अभी जोड़ा जाना बाकी है।</p>
                <button
                  type="button"
                  onClick={onContribute}
                  className="inline-flex items-center gap-1.5 rounded-full border border-saffron-300 bg-saffron-50 px-3 py-1.5 text-xs font-bold text-saffron-800 transition hover:bg-saffron-100 dark:bg-saffron-500/10 dark:text-saffron-200"
                >
                  <Edit3 className="h-3.5 w-3.5" aria-hidden="true" /> पहला अर्थ जोड़ें
                </button>
              </div>
            )}

            {/* ── 7. Quiet Footnote Link ───────────────────────── */}
            {versePageHref && (
              <div className="mt-6 flex items-center justify-end border-t border-dharma-border/50 pt-3">
                <Link
                  href={versePageHref}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-dharma-muted transition hover:text-saffron-700 dark:hover:text-saffron-400"
                >
                  <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>विस्तृत श्लोक विश्लेषण व संदर्भ</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
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
