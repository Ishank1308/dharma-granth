'use client';

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Atom,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  Edit3,
  FolderCheck,
  FolderPlus,
  GitBranch,
  Highlighter,
  Library,
  Lightbulb,
  Maximize2,
  MoreHorizontal,
  Quote,
  ScrollText,
  Share2,
  Sparkles,
  StickyNote,
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
import { getLiteraryVerseMeta } from '@/lib/literary-commentary';
import { saveAnnotation, deleteAnnotation } from '@/lib/study/storage';
import { useReadingDepth, type ReadingDepth } from '@/lib/useReadingDepth';
import { classifyAnalyticalPerspective, ANALYTICAL_PERSPECTIVES } from '@/lib/analytical-perspective';
import dynamic from 'next/dynamic';

const VerseCuriosityDrawer = dynamic(
  () => import('./curiosity/VerseCuriosityDrawer').then((m) => m.VerseCuriosityDrawer),
  { ssr: false }
);

const StoryDeckModal = dynamic(
  () => import('@/components/reader/StoryDeckModal').then((m) => m.StoryDeckModal),
  { ssr: false }
);

const CitationModal = dynamic(
  () => import('@/components/study/CitationModal').then((m) => m.CitationModal),
  { ssr: false }
);

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
}

export interface VerseLayers {
  translit: boolean;
  hindi: boolean;
  english: boolean;
  commentary: boolean;
}

interface Props {
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
  /** Opens the desktop split-pane Svādhyāya workbench */
  onOpenSvadhyaya?: (tab: 'concept' | 'parallel' | 'manana', data?: unknown) => void;
  /** Whether this verse is active during recitation or jump */
  isActive?: boolean;
  /** Progressive reading depth ('read' | 'understand' | 'study'). If omitted, falls back to useReadingDepth hook. */
  readingDepth?: ReadingDepth;
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

const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
    <span className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center">
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
      <span lang="hi" className="relative font-devanagari text-[14px] font-bold leading-none text-white">{label}</span>
    </span>
  );
}

const iconButton =
  'inline-flex h-8.5 w-8.5 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border border-dharma-border/70 bg-dharma-card/80 text-dharma-muted backdrop-blur transition hover:border-saffron-300 hover:text-saffron-700';

export function VerseCard({
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
  onOpenSvadhyaya,
  isActive,
  readingDepth: propReadingDepth,
}: Props) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const tabsId = useId();

  // ── Reading Depth & Progressive Disclosure State ──
  const { depth: globalDepth } = useReadingDepth();
  const parentDepth = propReadingDepth ?? globalDepth;
  const [localOverride, setLocalOverride] = useState<ReadingDepth | null>(null);

  // When global depth changes, clear local overrides to follow global intent
  useEffect(() => {
    setLocalOverride(null);
  }, [parentDepth]);

  const currentDepth = localOverride ?? parentDepth;
  const isReadMode = currentDepth === 'read';
  const isUnderstandMode = currentDepth === 'understand';
  const isStudyMode = currentDepth === 'study';

  // Quick language toggle in Read mode if both are available
  const [readLangPref, setReadLangPref] = useState<'default' | 'hindi' | 'english'>('default');

  // ── Overflow More Menu Popover ──
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!moreMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!moreMenuRef.current?.contains(e.target as Node)) setMoreMenuOpen(false);
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') setMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [moreMenuOpen]);

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

  // ── Scholarly Citation Modal ──
  const [citationModalOpen, setCitationModalOpen] = useState(false);

  // ── 60-Second Story Deck Modal & Literary Essayist Metadata ──
  const [storyDeckOpen, setStoryDeckOpen] = useState(false);
  const literaryMeta = useMemo(() => {
    return getLiteraryVerseMeta(scriptureId, chapterId, v.number, {
      sanskrit: v.sanskrit,
      translation: v.translation,
      hindi: v.hindi,
      keywords: v.keywords,
      explanation: meaning.explanation,
      lifeLesson: meaning.lesson,
    });
  }, [scriptureId, chapterId, v.number, v.sanskrit, v.translation, v.hindi, v.keywords, meaning.explanation, meaning.lesson]);

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
  const explanationIsHi = meaning.explanationIsHi || isMostlyDevanagari(explanation);
  const scienceIsHi = meaning.scienceIsHi || isMostlyDevanagari(science);
  const lessonIsHi = meaning.lessonIsHi || isMostlyDevanagari(lesson);
  const showHindi = Boolean(v.hindi && layers.hindi);
  const showEnglish = Boolean(v.translation && layers.english);

  // ── Word-by-word meaning visibility (Hidden by default) ──
  const [isWordMeaningOpen, setIsWordMeaningOpen] = useState(false);

  // ── Jñāna-Vṛkṣa Tree View Mode (branch focus vs full tree) ──
  const [treeViewMode, setTreeViewMode] = useState<'branch' | 'tree'>('branch');

  const treeBranches = useMemo(() => {
    const list: Array<{ id: TabId; label: string; shortLabel: string; icon: typeof Sparkles; color: string }> = [];
    if (showHindi || showEnglish || v.hindi || v.translation) {
      list.push({ id: 'meaning', label: '🌱 १. अर्थ (Meaning)', shortLabel: 'अर्थ', icon: ScrollText, color: 'text-amber-600' });
    }
    if (explanation || literaryMeta.misreadingHi || literaryMeta.deeperTruthHi) {
      list.push({ id: 'explain', label: '🌿 २. व्याख्या (Exposition)', shortLabel: 'व्याख्या', icon: Sparkles, color: 'text-saffron-600' });
    }
    if (science || lesson) {
      list.push({ id: 'science', label: '🍎 ३. विज्ञान (Science & Wisdom)', shortLabel: 'विज्ञान', icon: Atom, color: 'text-indigo-600' });
    }
    return list;
  }, [showHindi, showEnglish, v.hindi, v.translation, explanation, literaryMeta.misreadingHi, literaryMeta.deeperTruthHi, science, lesson]);

  const [activeBranch, setActiveBranch] = useState<TabId>('meaning');
  const currentBranch = treeBranches.some((b) => b.id === activeBranch) ? activeBranch : treeBranches[0]?.id || 'meaning';
  const showLesson = Boolean(layers.commentary && lesson);
  const hasMeaning = treeBranches.length > 0 || showLesson;

  // Cursor spotlight
  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const el = cardRef.current;
    if (!el || reduce || e.pointerType !== 'mouse') return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  };

  const onBranchKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = -1;
    if (e.key === 'ArrowRight') next = (index + 1) % treeBranches.length;
    else if (e.key === 'ArrowLeft') next = (index - 1 + treeBranches.length) % treeBranches.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = treeBranches.length - 1;
    if (next === -1) return;
    e.preventDefault();
    setActiveBranch(treeBranches[next].id);
    document.getElementById(`${tabsId}-branch-${treeBranches[next].id}`)?.focus();
  };

  const renderMeaningBranch = () => (
    <div className="space-y-3.5">
      {showHindi && (
        <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card-soft/70 p-4 shadow-2xs">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p lang="hi" className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              हिंदी अनुवाद · Hindi Translation
            </p>
            <ContentLabelBadge kind="literal" />
          </div>
          <p lang="hi" className="font-devanagari text-base leading-relaxed text-dharma-text md:text-[17px]">
            {v.hindi && <GlossaryText text={v.hindi} />}
            {v.hindiSource === 'ai' && (
              <span className="ml-2 inline-block rounded-full border border-blue-200 bg-blue-50 px-1.5 py-px align-middle text-[9px] font-medium text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300">
                AI अनुवाद
              </span>
            )}
          </p>
        </div>
      )}
      {showEnglish && (
        <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card/70 p-4 shadow-2xs">
          <div className="mb-2 flex items-center justify-between gap-2">
            <p lang="en" className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
              English Translation
            </p>
            <ContentLabelBadge kind="literal" />
          </div>
          <p lang="en" className="font-serif text-sm leading-relaxed text-dharma-text md:text-base">
            {v.translation}
            {v.translationSource === 'ai' && (
              <span className="ml-2 inline-block rounded-full border border-blue-200 bg-blue-50 px-1.5 py-px align-middle text-[9px] font-medium text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-300">
                AI translation
              </span>
            )}
          </p>
        </div>
      )}

      {/* ── The Core Shift (मर्म · In One Breath) ── */}
      <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/95 via-orange-50/70 to-amber-50/95 p-4 sm:p-5 dark:border-amber-900/50 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/40 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300">
            <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            मर्म · In One Breath
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {literaryMeta.situationalMoments.map((m) => (
              <span
                key={m.id}
                title={m.descriptionEn}
                className="inline-flex items-center gap-1 rounded-full border border-amber-300/70 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-amber-950 dark:border-amber-800/60 dark:bg-amber-900/40 dark:text-amber-200"
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
          <p className="font-serif text-xs sm:text-sm text-amber-900/85 dark:text-amber-300/80 mt-1 font-normal">
            {literaryMeta.coreShiftEn}
          </p>
        )}
      </div>
    </div>
  );

  const renderExplainBranch = () => (
    <div className="space-y-3.5">
      {explanation && (
        <div className="rounded-2xl border border-amber-200/70 bg-amber-50/40 p-4.5 dark:border-amber-900/40 dark:bg-amber-950/20 shadow-2xs">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
              {explanationIsHi ? 'व्याख्या व भावार्थ · Exposition' : 'Commentary & Exposition'}
            </p>
            <ContentLabelBadge kind="explanation" />
          </div>
          <p
            lang={explanationIsHi ? 'hi' : 'en'}
            className={`text-sm leading-relaxed text-dharma-text md:text-base ${explanationIsHi ? 'font-devanagari leading-loose' : 'font-serif'}`}
          >
            {explanation}
          </p>
        </div>
      )}

      {/* ── What This Verse Does NOT Mean (भ्रम निवारण) vs Deeper Truth ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
    </div>
  );

  const renderScienceBranch = () => {
    const perspectiveKey = science ? classifyAnalyticalPerspective(science) : 'not-applicable';
    const perspectiveMeta = ANALYTICAL_PERSPECTIVES[perspectiveKey];

    return (
      <div className="space-y-3.5">
        {science && (
          <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/40 p-4.5 dark:border-indigo-900/40 dark:bg-indigo-950/20 shadow-2xs">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/40 bg-indigo-100/80 px-2.5 py-0.5 text-[11px] font-bold text-indigo-900 dark:border-indigo-500/30 dark:bg-indigo-950/50 dark:text-indigo-200">
                  <span>{perspectiveMeta.labelHi}</span>
                  <span className="opacity-50">·</span>
                  <span className="font-normal">{perspectiveMeta.badgeEn}</span>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="rounded-full border border-amber-300/60 bg-amber-50/80 px-2 py-0.5 text-[10px] font-semibold text-amber-900 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300">
                  संपादकीय विवेचन · Not Scripture
                </span>
                <ContentLabelBadge kind="research" />
              </div>
            </div>
            <p
              lang={scienceIsHi ? 'hi' : 'en'}
              className={`text-sm leading-relaxed text-dharma-text md:text-base ${scienceIsHi ? 'font-devanagari leading-loose' : 'font-serif'}`}
            >
              {science}
            </p>
          </div>
        )}

      {showLesson && (
        <aside className="relative overflow-hidden rounded-2xl border border-amber-300/70 bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-transparent p-4 dark:border-amber-400/25 dark:from-amber-500/10 dark:via-orange-500/5 shadow-2xs">
          <div className="mb-1.5 flex items-center justify-between">
            <p
              className={`flex items-center gap-1.5 font-bold text-amber-700 dark:text-amber-300 ${
                lessonIsHi ? 'text-xs' : 'text-[11px] uppercase tracking-[0.18em]'
              }`}
            >
              <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
              {lessonIsHi ? 'आधुनिक चिंतन व सीख · Practical Living Wisdom' : 'Modern Reflection & Lesson'}
            </p>
            <ContentLabelBadge kind="reflection" />
          </div>
          <p
            lang={lessonIsHi ? 'hi' : 'en'}
            className={`text-xs sm:text-sm font-medium leading-relaxed text-dharma-text md:text-base ${lessonIsHi ? 'font-devanagari leading-loose' : ''}`}
          >
            {lesson}
          </p>
        </aside>
      )}
    </div>
    );
  };

  const fadeIn = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10, filter: 'blur(4px)' },
          whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
          viewport: { once: true, margin: '0px 0px -40px 0px' },
          transition: { duration: 0.55, delay: 0.08 + i * 0.12, ease: EASE_OUT_QUINT },
        };

  const verseLabel = String(v.number);

  // Decide single translation to display in Read mode
  const effectiveReadLang = readLangPref === 'default'
    ? (v.hindi ? 'hindi' : 'english')
    : readLangPref;

  return (
    <article
      ref={cardRef}
      id={`verse-${v.number}`}
      data-active-verse={isActive ? 'true' : 'false'}
      onPointerMove={onPointerMove}
      className={`verse-card group relative scroll-mt-24 rounded-[26px] border border-dharma-border bg-dharma-card card-3d-depth ${
        highlight ? HIGHLIGHTS[highlight].ring : chantingMode ? 'ring-2 ring-saffron-500/25' : ''
      } ${getVerseGraphicClass(category)}`}
      style={{
        ...getVerseGraphicStyle({ category, verseId: v.number }),
        contentVisibility: isActive ? 'visible' : 'auto',
        containIntrinsicSize: isReadMode ? 'auto 280px' : 'auto 480px',
      }}
      aria-label={`श्लोक ${verseLabel}${highlight ? ` · ${HIGHLIGHTS[highlight].label} हाइलाइट` : ''}`}
    >
      {/* Decorative manuscript border */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]">
        <div className="verse-card-spotlight" />
        <div
          className={`absolute inset-y-8 left-0 rounded-r-full bg-gradient-to-b opacity-80 ${
            highlight ? `w-1.5 ${HIGHLIGHTS[highlight].spine}` : 'w-1 from-amber-300 via-saffron-500 to-rose-500'
          }`}
        />
      </div>

      <div className="relative p-4 sm:p-6 md:p-7">
        {/* ── Header ─────────────────────────────────────────── */}
        <header className="mb-4 flex items-center justify-between gap-3">
          {onOpenFocus ? (
            <button
              type="button"
              onClick={onOpenFocus}
              className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group/hdr"
              title="एकाग्रता मोड में पढ़ें (Focus Mode)"
            >
              <VerseMedallion label={toDevanagari(verseLabel)} />
              <div className="shrink-0 whitespace-nowrap">
                <p className="text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
                  अध्याय {toDevanagari(chapterId)}
                </p>
                <p className="font-serif text-sm sm:text-base font-bold text-dharma-text group-hover/hdr:text-saffron-700 transition-colors">
                  श्लोक {verseLabel}
                </p>
              </div>
            </button>
          ) : (
            <div className="flex items-center gap-2.5 sm:gap-3">
              <VerseMedallion label={toDevanagari(verseLabel)} />
              <div className="shrink-0 whitespace-nowrap">
                <p className="text-[11px] font-semibold text-saffron-800 dark:text-saffron-300">
                  अध्याय {toDevanagari(chapterId)}
                </p>
                <p className="font-serif text-sm sm:text-base font-bold text-dharma-text">श्लोक {verseLabel}</p>
              </div>
            </div>
          )}

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 sm:gap-2" role="toolbar" aria-label="श्लोक विकल्प">
            {/* Essential Action 1: Bookmark */}
            <button
              type="button"
              onClick={onToggleBookmark}
              className={`${iconButton} ${bookmarked ? '!border-saffron-400 !bg-saffron-50 !text-saffron-700 dark:!bg-saffron-900/30' : ''}`}
              aria-pressed={bookmarked}
              aria-label={bookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
              title={bookmarked ? 'बुकमार्क हटाएं' : 'बुकमार्क करें'}
            >
              {bookmarked ? (
                <BookmarkCheck className="h-4 w-4 fill-saffron-500/25" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>

            {/* Essential Action 2: Copy */}
            <button
              type="button"
              onClick={onCopy}
              className={`${iconButton} ${copied ? '!border-emerald-300 !text-emerald-600' : ''}`}
              aria-label={copied ? 'कॉपी हो गया' : 'कॉपी करें'}
              title="कॉपी करें"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>

            {/* In Study mode, expose deep tools directly */}
            {isStudyMode && (
              <>
                {hasSplitData && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsSandhiSplit(!isSandhiSplit);
                      setHoveredWordIndex(null);
                    }}
                    aria-pressed={isSandhiSplit}
                    title="संधि-विच्छेद (Split Compound Words)"
                    className={`hidden sm:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition border ${
                      isSandhiSplit
                        ? 'border-saffron-500 bg-saffron-100/90 text-saffron-900 dark:bg-saffron-950/60 dark:text-saffron-200'
                        : 'border-dharma-border/80 bg-dharma-card/80 text-dharma-muted hover:border-saffron-300'
                    }`}
                  >
                    <ScrollText className="h-3 w-3 text-saffron-600 dark:text-saffron-400" />
                    <span>संधि-विच्छेद</span>
                  </button>
                )}

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
                    className="hidden md:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 hover:bg-indigo-100 transition dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                  >
                    <StickyNote className="h-3 w-3" />
                    <span>मनन</span>
                  </button>
                )}
              </>
            )}

            {/* Essential Action 3: More Options Menu (•••) */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen((o) => !o)}
                className={`${iconButton} ${moreMenuOpen ? '!border-saffron-400 !text-saffron-700' : ''}`}
                aria-expanded={moreMenuOpen}
                aria-haspopup="true"
                aria-label="अन्य विकल्प (More options)"
                title="अन्य विकल्प"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {moreMenuOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full z-40 mt-1.5 w-56 rounded-2xl border border-dharma-border bg-dharma-card p-1.5 shadow-xl backdrop-blur-md"
                  >
                    {/* Add to Collection */}
                    {onAddToCollection && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          onAddToCollection();
                          setMoreMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-dharma-text hover:bg-dharma-bg transition"
                      >
                        {inCollectionCount && inCollectionCount > 0 ? (
                          <FolderCheck className="h-4 w-4 text-saffron-600" />
                        ) : (
                          <FolderPlus className="h-4 w-4 text-dharma-muted" />
                        )}
                        <span>{inCollectionCount && inCollectionCount > 0 ? `संग्रह में सुरक्षित (${inCollectionCount})` : 'संग्रह में जोड़ें'}</span>
                      </button>
                    )}

                    {/* Note Editor */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        if (editingNote) setEditingNote(false);
                        else openNoteEditor();
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-dharma-text hover:bg-dharma-bg transition"
                    >
                      <StickyNote className="h-4 w-4 text-indigo-500" />
                      <span>{note ? 'मेरा नोट संपादित करें' : 'नोट लिखें'}</span>
                    </button>

                    {/* Scholarly Citation */}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMoreMenuOpen(false);
                        setCitationModalOpen(true);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-dharma-text hover:bg-dharma-bg transition"
                    >
                      <Quote className="h-4 w-4 text-amber-600" />
                      <span>शास्त्रीय उद्धरण (Citation)</span>
                    </button>

                    {/* Focus Mode */}
                    {onOpenFocus && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onOpenFocus();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-dharma-text hover:bg-dharma-bg transition"
                      >
                        <Maximize2 className="h-4 w-4 text-dharma-muted" />
                        <span>एकाग्रता मोड (Focus)</span>
                      </button>
                    )}

                    {/* Story Deck */}
                    {!chantingMode && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          setStoryDeckOpen(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-amber-900 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
                      >
                        <Zap className="h-4 w-4 text-amber-600" />
                        <span>६०-सेकंड सार (Story Deck)</span>
                      </button>
                    )}

                    {/* Contribute */}
                    {!chantingMode && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMoreMenuOpen(false);
                          onContribute();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-dharma-text hover:bg-dharma-bg transition"
                      >
                        <Edit3 className="h-4 w-4 text-dharma-muted" />
                        <span>अर्थ सुधारें / योगदान</span>
                      </button>
                    )}

                    {/* Highlight Swatch Strip */}
                    <div className="mt-1 border-t border-dharma-border/60 pt-1.5 px-2">
                      <p className="text-[10px] font-bold text-dharma-muted uppercase tracking-wider mb-1">हाइलाइट रंग</p>
                      <div className="flex items-center gap-1.5 pb-1">
                        {(Object.keys(HIGHLIGHTS) as HighlightColor[]).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              onHighlight(c);
                              setMoreMenuOpen(false);
                            }}
                            className={`h-5 w-5 rounded-full ${HIGHLIGHTS[c].swatch} transition hover:scale-110 ${
                              highlight === c ? 'ring-2 ring-offset-1 ring-dharma-text' : ''
                            }`}
                            aria-label={HIGHLIGHTS[c].label}
                            title={HIGHLIGHTS[c].label}
                          />
                        ))}
                        {highlight && (
                          <button
                            type="button"
                            onClick={() => {
                              onHighlight(highlight);
                              setMoreMenuOpen(false);
                            }}
                            className="flex h-5 w-5 items-center justify-center rounded-full border border-dharma-border text-dharma-muted hover:text-dharma-text text-[10px]"
                            title="हटाएँ"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* ── Canonical Scripture Leaf ─────────────────────────── */}
        {lines.length > 0 && (
          <div className="verse-leaf relative rounded-2xl px-4 py-5 text-center sm:px-8 sm:py-6 md:px-10 md:py-8">
            <span aria-hidden="true" className="verse-leaf-ornament left-3 top-2">❁</span>
            <span aria-hidden="true" className="verse-leaf-ornament right-3 top-2">❁</span>
            <div className="mb-2.5 flex justify-center">
              <ContentLabelBadge kind="mula" />
            </div>

            {/* Split View (Only active in study mode when toggled) */}
            {isStudyMode && isSandhiSplit && hasSplitData ? (
              <div className="mx-auto my-2 max-w-2xl text-center">
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
              </div>
            ) : (
              <p lang="sa" className={`font-devanagari ${sanskritFontSizeClass} text-dharma-text leading-relaxed sm:leading-loose`}>
                {lines.map((line, i) => (
                  <motion.span key={i} className="block rounded-xl px-2 py-0.5" {...fadeIn(i)}>
                    <GlossaryText text={line} />
                  </motion.span>
                ))}
                <motion.span
                  aria-hidden="true"
                  className="mt-2 block font-bold text-saffron-700 dark:text-amber-300"
                  {...fadeIn(lines.length)}
                >
                  ॥ {toDevanagari(verseLabel)} ॥
                </motion.span>
              </p>
            )}

            {/* Transliteration */}
            {v.transliteration && layers.translit && (
              <p
                lang="sa-Latn"
                className="mx-auto mt-3.5 max-w-2xl whitespace-pre-line border-t border-amber-700/15 pt-3.5 text-xs sm:text-sm italic leading-relaxed text-dharma-muted"
              >
                {v.transliteration.replace(/[\s|।॥0-9.]+$/, '')}
              </p>
            )}
          </div>
        )}

        {/* ── Personal Note Editor (When Active) ───────────────── */}
        {!chantingMode && (editingNote || note) && (
          <div className="mt-4 rounded-2xl border border-indigo-200/80 bg-indigo-50/60 p-4 dark:border-indigo-400/25 dark:bg-indigo-500/10">
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
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={openNoteEditor}
                className="block w-full whitespace-pre-line text-left text-sm leading-relaxed text-dharma-text hover:opacity-80 transition"
                aria-label="नोट संपादित करें"
              >
                {note}
              </button>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            MODE 1: पाठ · READ (Scripture-First Default)
        ══════════════════════════════════════════════════════════ */}
        {!chantingMode && isReadMode && (
          <div className="mt-4">
            {/* Single Short Translation */}
            {effectiveReadLang === 'hindi' && v.hindi ? (
              <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card-soft/60 p-4 shadow-2xs">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p lang="hi" className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                    सरल हिन्दी अनुवाद
                  </p>
                  {v.translation && (
                    <button
                      type="button"
                      onClick={() => setReadLangPref('english')}
                      className="text-[11px] font-semibold text-dharma-muted hover:text-saffron-700 transition"
                    >
                      English में देखें →
                    </button>
                  )}
                </div>
                <p lang="hi" className="font-devanagari text-base leading-relaxed text-dharma-text md:text-[17px]">
                  <GlossaryText text={v.hindi} />
                </p>
              </div>
            ) : v.translation ? (
              <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card/70 p-4 shadow-2xs">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <p lang="en" className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                    English Meaning
                  </p>
                  {v.hindi && (
                    <button
                      type="button"
                      onClick={() => setReadLangPref('hindi')}
                      className="text-[11px] font-semibold text-dharma-muted hover:text-saffron-700 transition"
                    >
                      हिन्दी में देखें →
                    </button>
                  )}
                </div>
                <p lang="en" className="font-serif text-sm leading-relaxed text-dharma-text md:text-base">
                  {v.translation}
                </p>
              </div>
            ) : null}

            {/* Calm Single Action to Understand */}
            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => setLocalOverride('understand')}
                className="group inline-flex items-center gap-2 rounded-full border border-saffron-300/80 bg-saffron-50/70 px-4 py-2 text-xs font-bold text-saffron-900 transition hover:bg-saffron-100 hover:border-saffron-400 dark:border-saffron-700/60 dark:bg-saffron-950/40 dark:text-saffron-200 shadow-2xs cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5 text-saffron-600 dark:text-saffron-400 group-hover:scale-110 transition-transform" />
                <span>सरल अर्थ समझें · Understand this passage</span>
                <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:translate-y-0.5 transition-transform" />
              </button>

              {versePageHref && (
                <Link
                  href={versePageHref}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-dharma-muted hover:text-saffron-700 dark:hover:text-saffron-400 transition"
                >
                  <Compass className="h-3 w-3" />
                  <span>विस्तृत श्लोक पृष्ठ</span>
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            MODE 2: बोध · UNDERSTAND & MODE 3: स्वाध्याय · STUDY
        ══════════════════════════════════════════════════════════ */}
        {!chantingMode && !isReadMode && (
          <div className="mt-5 space-y-4.5">
            {/* ── Word-by-word meaning (Hidden by default behind collapsible disclosure) ─── */}
            {v.wordMeaning && (
              <div className="rounded-2xl border border-amber-200/60 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-950/15 overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setIsWordMeaningOpen(!isWordMeaningOpen)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-amber-100/40 dark:hover:bg-amber-900/20 cursor-pointer"
                  aria-expanded={isWordMeaningOpen}
                  aria-controls={`word-meaning-${v.number}`}
                >
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
                    <ScrollText className="h-4 w-4 text-amber-700 dark:text-amber-400" aria-hidden="true" />
                    <span>पदच्छेद एवं शब्दार्थ · Word-by-Word Meaning</span>
                    {parsedGloss.length > 0 && (
                      <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 dark:bg-amber-900/60 dark:text-amber-300">
                        {parsedGloss.length} पद
                      </span>
                    )}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
                    <span>{isWordMeaningOpen ? 'छुपाएं' : 'देखें'}</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isWordMeaningOpen ? 'rotate-180' : ''}`} />
                  </span>
                </button>

                {isWordMeaningOpen && (
                  <div id={`word-meaning-${v.number}`} className="border-t border-amber-200/50 dark:border-amber-900/30 p-4 space-y-3">
                    {hasSplitData && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsSandhiSplit(!isSandhiSplit)}
                          className="text-[11px] font-bold text-saffron-700 hover:underline dark:text-saffron-300"
                        >
                          {isSandhiSplit ? 'संयुक्त श्लोक देखें' : 'विच्छेद दृश्य (Split View)'}
                        </button>
                      </div>
                    )}
                    {parsedGloss.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {parsedGloss.map((g, gIdx) => {
                          const isHighlighted = hoveredWordIndex === gIdx;
                          return (
                            <div
                              key={gIdx}
                              onMouseEnter={() => setHoveredWordIndex(gIdx)}
                              onMouseLeave={() => setHoveredWordIndex(null)}
                              className={`rounded-lg px-2.5 py-1.5 text-xs transition border cursor-pointer ${
                                isHighlighted
                                  ? 'border-saffron-400 bg-saffron-100 text-saffron-950 font-semibold dark:bg-saffron-950/70 dark:text-saffron-200 shadow-2xs'
                                  : 'border-transparent bg-dharma-card/60 text-dharma-text hover:border-dharma-border'
                              }`}
                            >
                              <span className="font-devanagari font-bold mr-1.5">{g.pada}</span>
                              <span className="text-dharma-muted">→ {g.meaning}</span>
                            </div>
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
              </div>
            )}

            {/* ── ज्ञान-वृक्ष (Jñāna-Vṛkṣa) Mindmap Tree ── */}
            {treeBranches.length > 0 && (
              <div className="rounded-[22px] border border-amber-200/80 bg-gradient-to-b from-amber-50/30 via-dharma-card/50 to-amber-50/10 p-3.5 sm:p-5 dark:border-amber-900/40 dark:from-amber-950/20 dark:via-dharma-card/30 dark:to-transparent shadow-xs">
                {/* Mindmap Tree Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/50 pb-3 dark:border-amber-900/30">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-saffron-600 text-white shadow-2xs">
                      <GitBranch className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold tracking-wide text-dharma-text flex items-center gap-1.5">
                        <span>ज्ञान-वृक्ष</span>
                        <span className="text-dharma-muted font-normal">· Jñāna-Vṛkṣa Flow</span>
                      </p>
                      <p className="text-[10px] text-dharma-muted">
                        अर्थ (बीज) ➔ व्याख्या (शाखा) ➔ विज्ञान (फल)
                      </p>
                    </div>
                  </div>

                  {/* View Mode Toggle: Single Branch Focus vs Full Tree */}
                  {treeBranches.length > 1 && (
                    <div className="inline-flex rounded-full border border-dharma-border/80 bg-dharma-bg/80 p-0.5 text-[11px] font-semibold">
                      <button
                        type="button"
                        onClick={() => setTreeViewMode('branch')}
                        className={`rounded-full px-2.5 py-1 transition ${
                          treeViewMode === 'branch'
                            ? 'bg-amber-600 text-white shadow-2xs font-bold'
                            : 'text-dharma-muted hover:text-dharma-text'
                        }`}
                      >
                        🌿 चयनित शाखा
                      </button>
                      <button
                        type="button"
                        onClick={() => setTreeViewMode('tree')}
                        className={`rounded-full px-2.5 py-1 transition ${
                          treeViewMode === 'tree'
                            ? 'bg-amber-600 text-white shadow-2xs font-bold'
                            : 'text-dharma-muted hover:text-dharma-text'
                        }`}
                      >
                        🌳 पूर्ण वृक्ष
                      </button>
                    </div>
                  )}
                </div>

                {/* Mindmap Interactive Node Navigator (in Branch mode) */}
                {treeViewMode === 'branch' && treeBranches.length > 1 && (
                  <div className="mt-3.5 mb-2 overflow-x-auto pb-1">
                    <div className="relative flex items-center justify-start gap-2 py-1 min-w-max">
                      {/* Connecting branch line behind nodes */}
                      <div className="absolute left-6 right-6 top-1/2 h-0.5 -translate-y-1/2 bg-gradient-to-r from-amber-300 via-saffron-400 to-indigo-300 dark:from-amber-800 dark:via-saffron-700 dark:to-indigo-800 pointer-events-none" />

                      {treeBranches.map((branch, i) => {
                        const isSelected = currentBranch === branch.id;
                        const BranchIcon = branch.icon;
                        return (
                          <button
                            key={branch.id}
                            id={`${tabsId}-branch-${branch.id}`}
                            type="button"
                            role="tab"
                            aria-selected={isSelected}
                            tabIndex={isSelected ? 0 : -1}
                            onClick={() => setActiveBranch(branch.id)}
                            onKeyDown={(e) => onBranchKeyDown(e, i)}
                            className={`relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all shadow-2xs cursor-pointer ${
                              isSelected
                                ? 'border border-amber-400 bg-gradient-to-r from-amber-500 to-saffron-600 text-white ring-2 ring-saffron-400/30 scale-102'
                                : 'border border-dharma-border bg-dharma-card/90 text-dharma-muted hover:border-amber-300 hover:text-dharma-text'
                            }`}
                          >
                            <BranchIcon className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-saffron-600 dark:text-saffron-400'}`} />
                            <span>{branch.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Branch Content: Focused Single Branch or Full Tree */}
                <div className="mt-3.5">
                  {treeViewMode === 'branch' ? (
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={currentBranch}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: 0.18 }}
                        className="space-y-3.5"
                      >
                        {currentBranch === 'meaning' && renderMeaningBranch()}
                        {currentBranch === 'explain' && renderExplainBranch()}
                        {currentBranch === 'science' && renderScienceBranch()}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    /* Full Tree Mindmap View with illuminated vertical lineage stem */
                    <div className="relative space-y-5 pl-5 sm:pl-7 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-saffron-500 before:to-indigo-500">
                      {/* Node 1: अर्थ */}
                      <div className="relative space-y-3">
                        <div className="absolute -left-[1.65rem] sm:-left-[2.15rem] top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] text-white shadow-2xs ring-4 ring-dharma-card">
                          🌱
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider">
                          <span>शाखा १ · अर्थ (The Root Meaning)</span>
                        </div>
                        {renderMeaningBranch()}
                      </div>

                      {/* Node 2: व्याख्या */}
                      {(explanation || literaryMeta.misreadingHi || literaryMeta.deeperTruthHi) && (
                        <div className="relative space-y-3 pt-2">
                          <div className="absolute -left-[1.65rem] sm:-left-[2.15rem] top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-saffron-500 text-[10px] text-white shadow-2xs ring-4 ring-dharma-card">
                            🌿
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-saffron-900 dark:text-saffron-200 uppercase tracking-wider">
                            <span>शाखा २ · व्याख्या (Living Exposition)</span>
                          </div>
                          {renderExplainBranch()}
                        </div>
                      )}

                      {/* Node 3: विज्ञान */}
                      {(science || showLesson) && (
                        <div className="relative space-y-3 pt-2">
                          <div className="absolute -left-[1.65rem] sm:-left-[2.15rem] top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white shadow-2xs ring-4 ring-dharma-card">
                            🍎
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                            <span>शाखा ३ · विज्ञान (Living Science & Wisdom)</span>
                          </div>
                          {renderScienceBranch()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Related Keywords (In Study mode) ── */}
            {isStudyMode && v.keywords && v.keywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
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
                      className="inline-flex items-center gap-1 rounded-full border border-saffron-200/80 bg-saffron-50/70 px-2.5 py-0.5 text-[11px] font-semibold text-saffron-800 transition-all hover:border-saffron-400 hover:bg-saffron-100 dark:border-saffron-400/25 dark:bg-saffron-500/10 dark:text-saffron-200"
                    >
                      <span>#{k.replace(/^#+/, '')}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* ── Curiosity & Inquiry Drawer (Child/Teen/Parent natural questions) ── */}
            <VerseCuriosityDrawer
              scriptureId={scriptureId}
              chapter={chapterId}
              verse={v.number}
            />

            {/* ── Bottom Progressive Control Footer ── */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dharma-border/60 pt-3 text-xs">
              <button
                type="button"
                onClick={() => setLocalOverride('read')}
                className="inline-flex items-center gap-1.5 font-semibold text-dharma-muted hover:text-dharma-text transition cursor-pointer"
              >
                <ChevronUp className="h-3.5 w-3.5" />
                <span>संक्षिप्त करें · Return to Calm Read</span>
              </button>

              {isUnderstandMode ? (
                <button
                  type="button"
                  onClick={() => setLocalOverride('study')}
                  className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50/80 px-3 py-1 font-bold text-indigo-700 hover:bg-indigo-100 transition dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 cursor-pointer shadow-2xs"
                >
                  <span>गहन स्वाध्याय व शोध · Deep Study</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                versePageHref && (
                  <Link
                    href={versePageHref}
                    className="inline-flex items-center gap-1 font-semibold text-saffron-700 dark:text-saffron-300 hover:underline"
                  >
                    <span>विस्तृत श्लोक विश्लेषण</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>

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

      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        params={{
          scriptureId,
          scriptureTitle,
          chapterId,
          verseNum: v.number,
          sanskrit: v.sanskrit || '',
          transliteration: v.transliteration,
          hindi: v.hindi,
          translation: v.translation,
          verseUrl: shareVerseUrl(SITE_URL, scriptureId, chapterId, v.number),
        }}
      />
    </article>
  );
}
