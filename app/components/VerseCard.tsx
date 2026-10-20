'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { REVEAL_SEQUENCE } from '@/app/components/motion/primitives';
import {
  Atom,
  Bookmark,
  BookmarkCheck,
  Check,
  Compass,
  Copy,
  Edit3,
  FolderCheck,
  FolderPlus,
  Highlighter,
  Library,
  Lightbulb,
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
import { toDevanagari, verseLines } from '@/lib/verse-format';
import { shareVerseUrl } from '@/lib/verse-paths';
import { parseWordMeanings, type WordGloss } from '@/lib/word-gloss';
import { SITE_URL } from '@/lib/jsonld';
import { ShareVerseButton } from './ShareVerseButton';
import { GlossaryText } from './GlossaryTooltip';
import { getVerseGraphicClass, getVerseGraphicStyle } from './verse-background';
import { ContentLabelBadge } from './ContentLabels';
import { detectChandas } from '@/lib/chandas-detector';
import { speakSanskritTerm } from '@/lib/sacred-soundscape';
import { triggerTactileFeedback } from '@/lib/haptics';
import { showSabdaPeek } from '@/lib/prana-capsule-store';
import { SamvadaStrip } from '@/app/components/reader/SamvadaStrip';
import { getLiteraryVerseMeta } from '@/lib/literary-commentary';
import type { ReadingDepth } from '@/lib/reading-depth';
import { ActionMenu } from '@/app/components/primitives/ActionMenu';
import { Collapsible } from '@/app/components/primitives/Collapsible';
import dynamic from 'next/dynamic';
import { useEverTrue } from '@/lib/use-ever-true';

// Loaded the first time it opens, so the dialog stays out of the page's first-load JS.
const StoryDeckModal = dynamic(() => import('@/components/reader/StoryDeckModal').then((m) => m.StoryDeckModal), { ssr: false });
const CitationModal = dynamic(() => import('@/components/study/CitationModal').then((m) => m.CitationModal), { ssr: false });
import { saveAnnotation, deleteAnnotation } from '@/lib/study/storage';

export interface VerseCardData {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  translationSource?: 'ai';
  hindi?: string;
  hindiSource?: 'ai';
  wordMeaning?: string;
  padaccheda?: string;
  speaker?: string;
  chandas?: string;
  keywords?: string[];
}

/** Commentary resolved by the parent (Hindi commentary file first, then verse fields). */
export interface VerseMeaning {
  /** AI-drafted and reviewer-approved (not hand-written); shown with a label. */
  isAi?: boolean;
  explanation?: string;
  explanationIsHi: boolean;
  science?: string;
  scienceIsHi: boolean;
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
  meaning: VerseMeaning;
  layers: VerseLayers;
  scriptureId: string;
  chapterId: number;
  category: ScriptureCategory;
  scriptureTitle: string;
  chapterTitle: string;
  chantingMode: boolean;
  sanskritFontSizeClass: string;
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
  /** Opens the desktop split-pane Svādhyāya workbench */
  onOpenSvadhyaya?: (tab: 'concept' | 'parallel' | 'manana', data?: unknown) => void;
  /** Whether this verse is active during recitation or jump */
  isActive?: boolean;
}

type TabId = 'meaning' | 'explain' | 'science';
type HighlightColor = VerseHighlight['color'];

const NOTE_MAX = 2000;

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
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-dharma-border/70 bg-dharma-card/80 text-dharma-muted backdrop-blur transition hover:border-saffron-300 hover:text-saffron-700';

export function VerseCard({
  depth = 'study',
  verse: v,
  meaning,
  layers,
  scriptureId,
  chapterId,
  category,
  scriptureTitle,
  chapterTitle,
  chantingMode,
  sanskritFontSizeClass,
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
  onOpenSvadhyaya,
  isActive,
}: Props) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const tabsId = useId();

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
  const parsedWordMeanings = useMemo(() => parseWordMeanings(v.wordMeaning), [v.wordMeaning]);

  // Recitation line-by-line / translation live highlighting
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [activeTranslationLang, setActiveTranslationLang] = useState<'hi' | 'en' | null>(null);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isReciting) {
      setActiveLineIndex(null);
      setActiveTranslationLang(null);
      return;
    }

    const handleChunk = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.isTranslation) {
        setActiveLineIndex(null);
        setActiveTranslationLang(detail.language);
      } else if (typeof detail?.chunkIndex === 'number') {
        setActiveLineIndex(detail.chunkIndex);
        setActiveTranslationLang(null);
      } else {
        setActiveLineIndex(null);
        setActiveTranslationLang(null);
      }
    };

    window.addEventListener('dharma:recitation-chunk', handleChunk);
    return () => window.removeEventListener('dharma:recitation-chunk', handleChunk);
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
  const scienceIsHi = meaning.scienceIsHi || isMostlyDevanagari(science);
  const lessonIsHi = meaning.lessonIsHi || isMostlyDevanagari(lesson);
  const showHindi = Boolean(v.hindi && layers.hindi);
  const showEnglish = Boolean(v.translation && layers.english);

  const tabs = useMemo(() => {
    const list: Array<{ id: TabId; label: string; icon: typeof Sparkles }> = [];
    if (showHindi || showEnglish) list.push({ id: 'meaning', label: 'अर्थ', icon: ScrollText });
    if (layers.commentary && depth !== 'read' && explanation) {
      list.push({ id: 'explain', label: 'व्याख्या', icon: Sparkles });
    }
    if (layers.commentary && depth === 'study' && science) list.push({ id: 'science', label: meaning.editorial ? 'आधुनिक परिप्रेक्ष्य' : 'विज्ञान', icon: Atom });
    return list;
  }, [showHindi, showEnglish, layers.commentary, depth, explanation, science, meaning.editorial]);

  const [chosenTab, setChosenTab] = useState<TabId>('meaning');
  // Fall back to the first available tab if the chosen one was switched off.
  const activeTab = tabs.some((t) => t.id === chosenTab) ? chosenTab : tabs[0]?.id;
  const showLesson = Boolean(layers.commentary && depth !== 'read' && lesson);
  const hasMeaning = tabs.length > 0 || showLesson;

  // Cursor spotlight: CSS variables only, no React re-render per move.
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el || reduce || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  // WAI-ARIA tabs: arrow keys / Home / End move between tabs.
  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tabs.length - 1;
    if (next === -1) return;
    e.preventDefault();
    setChosenTab(tabs[next].id);
    document.getElementById(`${tabsId}-tab-${tabs[next].id}`)?.focus();
  };

  // The shloka, transliteration and meanings reveal in that order through CSS (.reveal-seq / data-reveal in
  // globals.css): no opacity:0 in the server HTML, and nothing waits on hydration.
  const verseLabel = String(v.number);

  return (
    <article
      ref={cardRef}
      id={`verse-${v.number}`}
      onPointerMove={onPointerMove}
      className={`verse-card ${REVEAL_SEQUENCE} group relative scroll-mt-24 rounded-[28px] border bg-dharma-card card-3d-depth transition-all duration-300 ${
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
      {/* Clips the decorative layers to the rounded card; kept separate so
          the highlight picker can overflow the card edge. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
        <div className="verse-card-spotlight" />
        {/* Gilded spine, like the binding edge of a manuscript leaf; takes the highlight colour */}
        <div
          className={`absolute inset-y-8 left-0 rounded-r-full bg-gradient-to-b opacity-80 ${
            isReciting
              ? 'w-2 from-amber-300 via-amber-500 to-amber-600 shadow-sm'
              : highlight
              ? `w-1.5 ${HIGHLIGHTS[highlight].spine}`
              : 'w-1 from-amber-300 via-saffron-500 to-rose-500'
          }`}
        />
      </div>

      <div className="relative p-5 md:p-7">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-3">
          {onOpenFocus ? (
            <button
              type="button"
              onClick={onOpenFocus}
              className="flex items-center gap-3 text-left focus:outline-none group/hdr"
              title="एकाग्रता मोड में पढ़ें (Focus Mode)"
            >
              <VerseMedallion label={toDevanagari(verseLabel)} />
              <div className="shrink-0 whitespace-nowrap">
                <p className="text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
                  अध्याय {toDevanagari(chapterId)}
                </p>
                <p className="font-serif text-base font-bold text-dharma-text group-hover/hdr:text-saffron-700 transition-colors">
                  श्लोक {verseLabel}
                </p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <VerseMedallion label={toDevanagari(verseLabel)} />
              <div className="shrink-0 whitespace-nowrap">
                <p className="text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
                  अध्याय {toDevanagari(chapterId)}
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
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition border ${
                isSandhiSplit
                  ? 'border-saffron-500 bg-saffron-100/90 text-saffron-900 shadow-2xs dark:bg-saffron-950/60 dark:text-saffron-200 dark:border-saffron-700'
                  : 'border-dharma-border/80 bg-dharma-card/80 text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
              }`}
            >
              <ScrollText className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" />
              <span>संधि-विच्छेद · Split Words</span>
            </button>
          )}

          {/* Svadhyaya Workbench Quick Button (Desktop Note / Reflection) */}
          {onOpenSvadhyaya && (
            <button
              type="button"
              onClick={() =>
                onOpenSvadhyaya('manana', {
                  scriptureSlug: scriptureId,
                  scriptureTitle,
                  chapter: chapterId,
                  verseNum: v.number,
                  sanskrit: v.sanskrit,
                  initialNote: note,
                })
              }
              title="स्वाध्याय मनन टिप्पणी लिखें"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 hover:bg-indigo-100 transition dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
            >
              <StickyNote className="h-3 w-3" />
              <span>मनन टिप्पणी</span>
            </button>
          )}

          {/* On phones the actions get their own row and wrap; without shrink-0 the
          eight 36px buttons were squeezed to ~22px at 320px. */}
          <div
            className="order-last flex w-full flex-wrap items-center justify-start gap-2 sm:order-none sm:ml-auto sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-1.5"
            role="toolbar"
            aria-label="श्लोक विकल्प (Verse actions)"
          >
            {/* Audio Recitation button */}
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

            {onAddToCollection && (
              <button
                type="button"
                onClick={onAddToCollection}
                className={`${iconButton} ${inCollectionCount && inCollectionCount > 0 ? '!border-saffron-400 !bg-saffron-50 !text-saffron-700 dark:!bg-saffron-900/30' : ''}`}
                aria-label={inCollectionCount && inCollectionCount > 0 ? `संग्रह में सुरक्षित (${inCollectionCount})` : 'संग्रह में जोड़ें (Add to collection)'}
                title={inCollectionCount && inCollectionCount > 0 ? `संग्रह में सुरक्षित (${inCollectionCount})` : 'संग्रह में जोड़ें'}
              >
                {inCollectionCount && inCollectionCount > 0 ? (
                  <FolderCheck className="h-4 w-4" />
                ) : (
                  <FolderPlus className="h-4 w-4" />
                )}
              </button>
            )}

            {/* Highlight: colour picker popover */}
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setPickerOpen((o) => !o)}
                className={`${iconButton} ${highlight ? '!border-transparent !text-white ' + HIGHLIGHTS[highlight].swatch : ''}`}
                aria-expanded={pickerOpen}
                aria-haspopup="true"
                aria-label={highlight ? `हाइलाइट: ${HIGHLIGHTS[highlight].label} (Change highlight)` : 'हाइलाइट करें (Highlight)'}
                title="हाइलाइट करें"
              >
                <Highlighter className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {pickerOpen && (
                  <motion.div
                    role="group"
                    aria-label="हाइलाइट रंग चुनें (Choose highlight colour)"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.14 }}
                    className="absolute left-1/2 top-full z-30 mt-2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card p-1.5 shadow-xl"
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
                          onHighlight(highlight); // same colour toggles it off
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

            <button
              type="button"
              onClick={() => (editingNote ? setEditingNote(false) : openNoteEditor())}
              className={`${iconButton} ${note ? '!border-indigo-300 !bg-indigo-50 !text-indigo-700 dark:!bg-indigo-500/15 dark:!text-indigo-300' : ''}`}
              aria-expanded={editingNote}
              aria-label={note ? 'नोट संपादित करें (Edit note)' : 'नोट लिखें (Add a note)'}
              title={note ? 'नोट संपादित करें' : 'नोट लिखें'}
            >
              <StickyNote className="h-4 w-4" />
            </button>
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
            <ActionMenu
              label="और विकल्प · More actions"
              triggerClassName={iconButton}
              items={[
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
                  label: '६०-सेकंड सार · 60-second summary',
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

        {versePageHref && (
          <div className="mb-4 -mt-2 flex items-center justify-between">
            <Link
              href={versePageHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-saffron-200/80 bg-saffron-50/70 px-3 py-1 text-xs font-semibold text-saffron-800 transition hover:border-saffron-300 hover:bg-saffron-100 dark:border-saffron-900/60 dark:bg-saffron-950/40 dark:text-saffron-300"
            >
              <Compass className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400" aria-hidden="true" />
              <span>विस्तृत श्लोक विश्लेषण व संदर्भ</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}

        {/* ── Sanskrit on a manuscript leaf ───────────────────── */}
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
                      className={`block rounded-xl px-2.5 py-1 -mx-2.5 transition-colors duration-200 ${
                        isLineActive
                          ? 'bg-amber-500/20 text-amber-950 dark:text-amber-100 ring-1 ring-amber-400/50 shadow-xs font-medium'
                          : ''
                      }`}
                    >
                      <GlossaryText text={line} />
                    </span>
                  );
                })}
                <span aria-hidden="true" className="mt-2 block font-bold text-saffron-700 dark:text-amber-300">
                  ॥ {toDevanagari(verseLabel)} ॥
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
          <>
            {/* ── The Core Shift (मर्म · In One Breath) ── */}
            {literaryMeta.isCurated && depth !== 'read' && (
              <>
            <div className="mt-5 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/95 via-orange-50/70 to-amber-50/95 p-4.5 sm:p-5 dark:border-amber-900/50 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/40 shadow-2xs">
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
            </div>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-dharma-muted">{literaryMeta.editorialLabel} · {literaryMeta.editorialStatus}</p>
              </>
            )}

            {/* ── Meaning tabs ──────────────────────────────── */}
            {tabs.length > 0 && activeTab && (
              <div className="mt-5">
                {tabs.length > 1 && (
                  <div
                    role="tablist"
                    aria-label="अर्थ और व्याख्या"
                    className="relative mb-4 inline-flex rounded-full border border-dharma-border/70 bg-dharma-bg/70 p-1"
                  >
                    {tabs.map((tab, i) => {
                      const selected = tab.id === activeTab;
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          id={`${tabsId}-tab-${tab.id}`}
                          type="button"
                          role="tab"
                          aria-selected={selected}
                          aria-controls={`${tabsId}-panel`}
                          tabIndex={selected ? 0 : -1}
                          onClick={() => setChosenTab(tab.id)}
                          onKeyDown={(e) => onTabKeyDown(e, i)}
                          className={`relative inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold transition-colors ${
                            selected ? 'text-white' : 'text-dharma-muted hover:text-dharma-text'
                          }`}
                        >
                          {selected && (
                            <motion.span
                              layoutId={`${tabsId}-pill`}
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-saffron-600 to-amber-500 shadow-md"
                              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 36 }}
                            />
                          )}
                          <Icon className="relative h-3.5 w-3.5" aria-hidden="true" />
                          <span className="relative">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Third in the reveal sequence; a wrapper, so the CSS reveal and framer's tab-switch fade never
                    animate the same node. */}
                <div data-reveal="3">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeTab}
                    id={`${tabsId}-panel`}
                    role={tabs.length > 1 ? 'tabpanel' : undefined}
                    aria-labelledby={tabs.length > 1 ? `${tabsId}-tab-${activeTab}` : undefined}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className={`space-y-4 rounded-2xl transition-all duration-300 ${
                      ''
                    }`}
                  >
                    {activeTab === 'meaning' && (
                      <div className="space-y-4">
                        {showHindi && (
                          <div className={`rounded-2xl border p-4 shadow-2xs transition-all duration-300 ${
                            isReciting && activeTranslationLang === 'hi'
                              ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-400/40'
                              : 'border-dharma-border/70 bg-dharma-card-soft/70'
                          }`}>
                            <div className="mb-2 flex items-center justify-between gap-2">
                              <p lang="hi" className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                                हिंदी अनुवाद · Hindi Translation
                              </p>
                              <ContentLabelBadge kind="literal" />
                            </div>
                            <p lang="hi" className="font-devanagari text-base leading-loose text-dharma-text md:text-[17px]">
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
                          <div className={`rounded-2xl border p-4 shadow-2xs transition-all duration-300 ${
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
                            <p lang="en" className="font-serif text-sm leading-relaxed text-dharma-text md:text-base">
                              {v.translation}
                              {meaning.editorial && meaning.editorial.arthaDecision !== 'preserve-existing' && (
                                <span className="ml-2 align-middle"><DraftBadge lang="en" /></span>
                              )}
                              {v.translationSource === 'ai' && (
                                <span
                                  className="ml-2 inline-block rounded-full border border-blue-200 bg-blue-50 px-1.5 py-px align-middle text-[9px] font-medium text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300"
                                  title="Machine-translated from the Sanskrit; not a scholarly translation"
                                >
                                  AI translation
                                </span>
                              )}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'meaning' && (
                      <SamvadaStrip scriptureId={scriptureId} chapterId={chapterId} verseNumber={v.number} />
                    )}

                    {activeTab === 'explain' && (
                      <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-4.5 dark:border-amber-900/40 dark:bg-amber-950/20 shadow-2xs">
                        <div className="mb-2.5 flex items-center justify-between gap-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                            {explanationIsHi ? 'व्याख्या व भावार्थ · Explanation' : 'Commentary & Explanation'}
                          </p>
                          <ContentLabelBadge kind="explanation" />
                          {meaning.editorial && <DraftBadge lang="hi" />}
                          {meaning.isAi && (
                            <p
                              className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-300"
                              title="AI द्वारा तैयार और संपादक द्वारा समीक्षित"
                            >
                              <Sparkles className="h-3 w-3" aria-hidden="true" />
                              AI व्याख्या · समीक्षित
                            </p>
                          )}
                        </div>
                        {explanation && !explanationIsHi && (
                          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-dharma-border/70 bg-dharma-bg/70 px-2.5 py-0.5 text-[11px] font-semibold text-dharma-muted">
                            हिन्दी व्याख्या शीघ्र · English commentary for now
                          </p>
                        )}
                        {explanation && (
                          <p
                            lang={explanationIsHi ? 'hi' : 'en'}
                            className={`text-sm leading-relaxed text-dharma-text md:text-base ${explanationIsHi ? 'font-devanagari leading-loose' : 'font-serif'}`}
                          >
                            {explanation}
                          </p>
                        )}
                      </div>
                    )}

                    {activeTab === 'science' && science && (
                      <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/40 p-4.5 dark:border-indigo-900/40 dark:bg-indigo-950/20 shadow-2xs">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
                            {meaning.editorial ? 'विवेकपूर्ण आधुनिक परिप्रेक्ष्य · Responsible Modern Perspective' : 'शोध व आधुनिक संदर्भ · Research & Context'}
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
                            <ContentLabelBadge kind="research" />
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
                  </motion.div>
                </AnimatePresence>
                </div>
              </div>
            )}

            {/* ── Modern Reflection & Takeaway (Never mixed with classical commentary) ── */}
            {showLesson && (
              <motion.aside
                {...(reduce
                  ? {}
                  : {
                      initial: { opacity: 0, scale: 0.98 },
                      whileInView: { opacity: 1, scale: 1 },
                      viewport: { once: true },
                      transition: { duration: 0.4 },
                    })}
                className="relative mt-5 overflow-hidden rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-transparent p-4.5 dark:border-amber-400/25 dark:from-amber-500/10 dark:via-orange-500/5 shadow-2xs"
              >
                <div className="mb-2 flex items-center justify-between">
                  <p
                    className={`flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 ${
                      lessonIsHi ? 'text-xs' : 'text-[11px] uppercase tracking-[0.18em]'
                    }`}
                  >
                    <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
                    {lessonIsHi ? 'आधुनिक चिंतन व सीख' : 'Modern Reflection & Lesson'}
                  </p>
                  <ContentLabelBadge kind="reflection" />
                  {meaning.editorial && <DraftBadge lang="hi" />}
                </div>
                <p
                  lang={lessonIsHi ? 'hi' : 'en'}
                  className={`text-sm font-medium leading-relaxed text-dharma-text md:text-base ${lessonIsHi ? 'font-devanagari leading-loose' : ''}`}
                >
                  {lesson}
                </p>
              </motion.aside>
            )}

            {/* ── What This Verse Does NOT Mean (भ्रम निवारण) ── */}
            {literaryMeta.isCurated && depth !== 'read' && (
              <Collapsible className="mt-4.5" title={<><span lang="hi" className="font-devanagari">सामान्य भ्रम और वास्तविक दृष्टि</span> · Common misreading</>}>
            <div className="mt-4.5 grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Misreading Box */}
              <div className="rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 dark:border-rose-900/40 dark:bg-rose-950/20 shadow-2xs">
                <p className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <span>❌</span> सामान्य भ्रम (What It Does NOT Mean)
                </p>
                <p lang="hi" className="font-devanagari text-xs sm:text-sm text-rose-950 dark:text-rose-100 leading-relaxed">
                  {literaryMeta.misreadingHi}
                </p>
                <p className="text-[11px] text-rose-800/80 dark:text-rose-300/70 italic mt-1 font-serif">
                  &ldquo;{literaryMeta.misreadingEn}&rdquo;
                </p>
              </div>

              {/* Deeper Truth Box */}
              <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20 shadow-2xs">
                <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <span>✓</span> वास्तविक दृष्टि (The Deeper Truth)
                </p>
                <p lang="hi" className="font-devanagari text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 leading-relaxed font-medium">
                  {literaryMeta.deeperTruthHi}
                </p>
                <p className="text-[11px] text-emerald-800/80 dark:text-emerald-300/70 mt-1 font-serif">
                  {literaryMeta.deeperTruthEn}
                </p>
              </div>
            </div>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-dharma-muted">{literaryMeta.editorialLabel} · {literaryMeta.editorialStatus}</p>
              </Collapsible>
            )}

            {depth === 'study' && v.keywords && v.keywords.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
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
          </>
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
