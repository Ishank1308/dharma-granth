'use client';

import { useCallback, useEffect, useMemo, useRef, useState, startTransition, type MouseEvent as ReactMouseEvent } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Search,
  X,
} from 'lucide-react';
import { updateReaderScrollProgress, triggerPranaToast } from '@/lib/prana-capsule-store';
import type { ScriptureCategory } from '@/data/types';
import type { HiCommentaryFragment } from '@/data/hi-commentary/_types';
import { canonicalVerseId } from '@/lib/canonical-verse-id';
import { versePageHref } from '@/lib/verse-paths';
import { commentaryOf, nearestWithMeaning, verseHasMeaning, type NearbyMeaning } from '@/lib/verse-has-meaning';
import { commentaryAmbiguities, type CommentaryAmbiguities } from '@/lib/commentary-lookup';
import { normalizeForSearch, normalizeTransliteration } from '@/lib/normalize-search';
import { splitVyakhyaCommentary, toAsciiDigits, toDevanagari } from '@/lib/verse-format';
import { useStudyProgress, type VerseRef } from '@/lib/useStudyProgress';
import { useReaderSettings } from '@/lib/useReaderSettings';
import { useTheme } from '@/app/components/ThemeProvider';
import { updateLastVerse } from '@/lib/reading-history';
import dynamic from 'next/dynamic';
import { useEverTrue } from '@/lib/use-ever-true';
import { loadReaderDialogImpl } from '@/app/components/reader/ReaderDialog';

// Dialogs and alternate reading modes load the first time they are used, so they stay out of the chapter's first-load JS.
const AddToCollectionModal = dynamic(() => import('./AddToCollectionModal').then((m) => m.AddToCollectionModal), { ssr: false });
const ContributeMeaningModal = dynamic(() => import('./ContributeMeaningModal').then((m) => m.ContributeMeaningModal), { ssr: false });
// One import() site, shared with the idle warm-up below, so both fetch the same chunk.
const loadReaderSettingsPanel = () => import('@/app/components/reader/ReaderSettingsPanel');
const ReaderSettingsPanel = dynamic(() => loadReaderSettingsPanel().then((m) => m.ReaderSettingsPanel), { ssr: false });
import { VerseCard } from './VerseCard';
import { useReadingDepth } from '@/lib/reading-depth';
import { useConnectivity } from '@/lib/useConnectivity';
import { VerseText } from './VerseText';
import type { VerseInsight } from '@/lib/verse-insights';
const MobileFocusMode = dynamic(() => import('./MobileFocusMode').then((m) => m.MobileFocusMode), { ssr: false });
const ConversationModeView = dynamic(() => import('./conversation/ConversationModeView').then((m) => m.ConversationModeView), { ssr: false });
import { triggerTactileFeedback } from '@/lib/haptics';
import {
  startSoundscape,
  stopSoundscape,
  setCurrentVerseContext,
  subscribeSoundscape,
  setContinuousParayana,
  setParayanaCadenceMode,
  strikeTempleBell,
  getSoundscapeState,
  type ParayanaCadenceMode,
  type SoundscapeState,
} from '@/lib/soundscape-lazy';
import {
  saveParayanaChapterProgress,
  clearParayanaChapterProgress,
  getParayanaChapterProgress,
  markChapterCompleteInReadingPlan,
} from '@/lib/reading-plan-sync';
import { saveChapterVersesToDB, getCachedChapterVersesFromDB } from '@/lib/db/granth-indexeddb';
import type { LiteraryVerseMeta } from '@/lib/literary-commentary';
import type { SvadhyayaTab } from '@/app/components/reader/SvadhyayaSplitDrawer';
const SvadhyayaSplitDrawer = dynamic(() => import('@/app/components/reader/SvadhyayaSplitDrawer').then((m) => m.SvadhyayaSplitDrawer), { ssr: false });
import { SpatialShloka, type BhashyaSource, type ReaderMode } from './liquid/SpatialShloka';
import { LiquidGlassDock } from './liquid/LiquidGlassDock';
import {
  saveReadingPosition,
  recordReadingHistory,
  saveVerseBookmark,
  deleteSavedVerse,
} from '@/lib/study/storage';
import { runStudyDataMigration } from '@/lib/study/migration';
import type { Connection } from '@/data/study-content';

interface FullVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  translationSource?: 'ai';
  translationRange?: string;
  translationSeeVerse?: number | string;
  hindi?: string;
  hindiSource?: 'ai';
  hindiReviewRequired?: boolean;
  /** Hindi from a printed edition, published before it was proofread (lib/ocr-hindi-review.ts). */
  hindiUnproofread?: boolean;
  hindiRange?: string;
  hindiSeeVerse?: number | string;
  wordMeaning?: string;
  padaccheda?: string;
  commentary?: string;
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  keywords?: string[];
  speaker?: string;
  chandas?: string;
  concepts?: string[];
}

interface FullChapter {
  number: number;
  title?: string;
  titleSanskrit?: string;
  verses: FullVerse[];
}

interface FullScripture {
  id: string;
  source?: { repo?: string; fetchedAt?: string };
  chapters: FullChapter[];
}

interface Props {
  scriptureId: string;
  category: ScriptureCategory;
  chapterId: number;
  curatedVerseIds: Array<number | string>;
  /** Display titles for the share card; fall back to ids when absent. */
  scriptureTitle?: string;
  chapterTitle?: string;
  basePath?: string;
  /**
   * Skip the "Load full chapter text" button and fetch immediately. Used on
   * placeholder chapters where the curated `.ts` has no verses — there's
   * nothing else on the page so prompting for a click is wasted friction.
   */
  autoLoad?: boolean;
  /**
   * The chapter's verses and commentary, read at build time by the page.
   * Passed so the island can upgrade the server-rendered list into cards.
   */
  initialChapter?: InitialChapter;
  /** Approved, pre-existing cross-scripture links for verses in this page. */
  relatedTeachingsByVerse?: Record<string, Connection[]>;
  /** Curated editorial layers (lib/literary-commentary) for this part's verses, resolved on the server. */
  literaryByVerse?: Record<string, LiteraryVerseMeta>;
}

export interface InitialChapter {
  verses: FullVerse[];
  commentary?: HiCommentaryFragment;
  commentaryAmbiguity?: { normalized: string[]; raw: string[] };
  source?: FullScripture['source'];
  /** मर्म and जीवन प्रसंग for the verses that have them (lib/verse-insights). */
  insights?: Record<string, VerseInsight>;
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ready'; verses: FullVerse[]; commentary?: HiCommentaryFragment; commentaryAmbiguity?: CommentaryAmbiguities; source?: FullScripture['source'] }
  | { kind: 'empty' }
  | { kind: 'error'; message: string };

/** Verses that hydrate as full cards straight away; later ones upgrade near the viewport. */
const RICH_BATCH = 10;

/** The set with these verse numbers added; the same set when nothing is new, so React skips the render. */
function withRich(prev: Set<string>, numbers: Array<string | number>): Set<string> {
  const missing = numbers.map(String).filter((n) => !prev.has(n));
  if (missing.length === 0) return prev;
  const next = new Set(prev);
  missing.forEach((n) => next.add(n));
  return next;
}

export function FullChapterVerses({ scriptureId, category, chapterId, curatedVerseIds, scriptureTitle, chapterTitle, basePath = '', autoLoad = false, initialChapter, relatedTeachingsByVerse = {}, literaryByVerse = {} }: Props) {
  const isOnline = useConnectivity();
  const { settings: readerSettings, update: updateReaderSetting, reset: resetReaderSettings, reducedMotion } = useReaderSettings();
  const { theme, setTheme } = useTheme();
  const curatedVerseSet = useMemo(
    () => new Set(curatedVerseIds.map((id) => String(id))),
    [curatedVerseIds],
  );
  const [state, setState] = useState<State>(() => {
    if (initialChapter && initialChapter.verses.length > 0) {
      return {
        kind: 'ready',
        verses: initialChapter.verses.filter(
          (v) => !curatedVerseSet.has(canonicalVerseId(chapterId, v.number)),
        ),
        commentary: initialChapter.commentary,
        commentaryAmbiguity: initialChapter.commentaryAmbiguity
          ? { normalized: new Set(initialChapter.commentaryAmbiguity.normalized), raw: new Set(initialChapter.commentaryAmbiguity.raw) }
          : commentaryAmbiguities(chapterId, initialChapter.verses.map(v => v.number)),
        source: initialChapter.source,
      };
    }
    return { kind: autoLoad ? 'loading' : 'idle' };
  });
  const [contributeVerse, setContributeVerse] = useState<FullVerse | null>(null);
  // The server render (and the first client render, which must match it)
  // lists plain VerseText; interactive cards replace them once hydrated.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
    runStudyDataMigration().catch(() => { });
  }, []);
  // Long chapters: the first RICH_BATCH verses hydrate as full cards; the rest stay as the plain
  // VerseText the server rendered (same id and text) and upgrade as they near the viewport.
  const [richVerses, setRichVerses] = useState<Set<string>>(() => new Set());
  // Verses whose number the reader tapped: their card opens with the full study, here in the chapter.
  const [studyRequested, setStudyRequested] = useState<Set<string>>(() => new Set());

  /**
   * A plain verse's number links to its verse page, so crawlers and readers without JavaScript can reach it.
   * Once the chapter is interactive, a tap on it opens that verse's explanation in place instead of leaving
   * the adhyay. A new-tab click (Ctrl/Cmd, Shift, middle button) still opens the verse page.
   */
  const openPlainVerseInPlace = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = (e.target as Element).closest?.('[data-plain-verse] h3 a');
    const verseNum = link?.closest<HTMLElement>('[data-plain-verse]')?.dataset.plainVerse;
    if (!verseNum) return;
    e.preventDefault();
    e.stopPropagation();
    setStudyRequested((prev) => withRich(prev, [verseNum]));
    setRichVerses((prev) => withRich(prev, [verseNum]));
  };

  const [chantingMode, setChantingMode] = useState(false);
  const [readingDepth] = useReadingDepth();
  const [isConversationMode, setIsConversationMode] = useState(false);
  const showCommentary = readerSettings.showCommentary;
  const [readerSettingsOpen, setReaderSettingsOpen] = useState(false);
  // The search field opens on tap, so the first shloka stays near the top.
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const closeFocusMode = useCallback(() => setFocusModeOpen(false), []);
  const [focusVerseIndex, setFocusVerseIndex] = useState(0);
  const [activeRecitingVerse, setActiveRecitingVerse] = useState<number | string | null>(null);
  const [parayanaActive, setParayanaActive] = useState(false);
  const [resumeVerse, setResumeVerse] = useState<number | null>(null);
  const [cadenceMode, setCadenceMode] = useState<ParayanaCadenceMode>(() => getSoundscapeState().parayanaCadenceMode);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentViewportVerse, setCurrentViewportVerse] = useState<string | null>(null);
  // Spatial focus: the lifted verse, and what the dock asks it to open (Anvaya, Bhāṣya or nothing).
  const [focusedVerse, setFocusedVerse] = useState<string | null>(null);
  const [readerMode, setReaderMode] = useState<ReaderMode>('samhita');
  useEffect(() => {
    if (!focusedVerse) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocusedVerse(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedVerse]);
  const ekagrataMode = readerSettings.spotlightMode;
  const pendingParayanaRef = useRef(false);
  const showTranslit = readerSettings.showTransliteration;
  const showHindi = readerSettings.showHindi;
  const showEnglish = readerSettings.showEnglish;
  // One store for the whole chapter (not one per card): notes, highlights and
  // collections are passed down to each VerseCard.
  const { recordReading, getNote, setNote, getHighlight, toggleHighlight, collections } = useStudyProgress();
  const [collectionVerse, setCollectionVerse] = useState<VerseRef | null>(null);
  const contributeLoaded = useEverTrue(Boolean(contributeVerse));
  const collectionLoaded = useEverTrue(Boolean(collectionVerse));
  const focusLoaded = useEverTrue(focusModeOpen);
  const readerSettingsLoaded = useEverTrue(readerSettingsOpen);

  // The Aa sheet holds reading depth, the recitation view and what read-aloud speaks, and its code
  // is fetched when it first opens. Fetch it once the chapter is at rest as well, so the service
  // worker has it saved and a reader who then goes offline can still open it. Skipped when the
  // reader or the browser asks to save data; the sheet then loads on first open, as before.
  const chapterReady = state.kind === 'ready';
  useEffect(() => {
    // Waits for the connection too, so a page opened offline warms the sheet once it is back.
    if (!chapterReady || isOnline !== true) return;
    const warm = () => {
      if (document.documentElement.hasAttribute('data-data-saver')) return;
      void loadReaderSettingsPanel().catch(() => {});
      void loadReaderDialogImpl().catch(() => {});
    };
    if ('requestIdleCallback' in window) {
      const idle = window.requestIdleCallback(warm, { timeout: 10_000 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = setTimeout(warm, 4000);
    return () => clearTimeout(timer);
  }, [chapterReady, isOnline]);

  const getCollectionCount = (verseNum: number | string) => {
    return collections.filter((c) =>
      c.verseRefs.some(
        (ref) =>
          ref.scriptureId === scriptureId &&
          ref.chapterId === chapterId &&
          String(ref.verseId) === String(verseNum),
      ),
    ).length;
  };

  // Auto-record study reading when chapter is loaded
  useEffect(() => {
    if (state.kind === 'ready' && state.verses.length > 0) {
      recordReading();
    }
  }, [state, recordReading]);

  // ── Svadhyaya Split Workbench & Mobile Drawer State ──
  const [svadhyayaOpen, setSvadhyayaOpen] = useState(false);
  const svadhyayaLoaded = useEverTrue(svadhyayaOpen);
  const [svadhyayaTab, setSvadhyayaTab] = useState<SvadhyayaTab>('concept');
  const [svadhyayaConcept, setSvadhyayaConcept] = useState<string | null>(null);
  const [svadhyayaParallel, setSvadhyayaParallel] = useState<{
    scriptureSlug: string;
    scriptureTitle: string;
    chapter: number;
    verseNum: string | number;
    sanskrit: string;
    transliteration?: string;
    hindi?: string;
    translation?: string;
    relationNoteHi?: string;
  } | null>(null);
  const [svadhyayaMananaContext, setSvadhyayaMananaContext] = useState<{
    scriptureSlug: string;
    scriptureTitle: string;
    chapter: number;
    verseNum: string | number;
    sanskrit?: string;
    initialNote?: string;
  } | null>(null);

  // ── Mobile Reader & Level State ──
  const [{ index: activeVerseIndex, direction: verseDirection }, setActiveVerse] = useState({ index: 0, direction: 0 });

  const handleOpenSvadhyaya = (tab: SvadhyayaTab, data?: unknown) => {
    setSvadhyayaTab(tab);
    if (tab === 'concept' && typeof data === 'string') {
      setSvadhyayaConcept(data);
    } else if (tab === 'parallel' && data) {
      setSvadhyayaParallel(data as typeof svadhyayaParallel);
    } else if (tab === 'manana' && data) {
      setSvadhyayaMananaContext(data as typeof svadhyayaMananaContext);
    }
    setSvadhyayaOpen(true);
    triggerTactileFeedback('selection', 'softTap');
  };

  // Background hydration into IndexedDB for sub-5ms repeat visits and offline resolution
  useEffect(() => {
    if (state.kind === 'ready' && state.verses.length > 0) {
      saveChapterVersesToDB(scriptureId, chapterId, state.verses).catch(() => { });
    }
  }, [state.kind, scriptureId, chapterId]);

  // Check IndexedDB cache if loading or offline
  useEffect(() => {
    if (state.kind !== 'loading') return;
    let cancelled = false;
    // The Hindi review list is about 450 KB, so it loads only when a cached chapter is found,
    // instead of riding in every chapter page's bundle.
    getCachedChapterVersesFromDB(scriptureId, chapterId)
      .then(async (cached) => {
        if (!cached || cached.length === 0) return;
        const { isHindiWithheld, isUnproofreadShown } = await import('@/lib/ocr-hindi-review');
        if (!cancelled) {
          setState({
            kind: 'ready',
            verses: cached.map((c) => ({
              number: c.verseNum,
              sanskrit: c.sanskrit,
              transliteration: c.transliteration,
              translation: c.translation,
              // An old OCR-review key must not hide the newer source-checked
              // AI-attributed Hindi. Legacy cached OCR (no provenance) stays withheld.
              hindi: isHindiWithheld(scriptureId, chapterId, c.verseNum) && c.hindiSource !== 'ai' ? undefined : c.hindi,
              hindiSource: c.hindiSource,
              hindiReviewRequired: isHindiWithheld(scriptureId, chapterId, c.verseNum) && c.hindiSource !== 'ai',
              hindiUnproofread: c.hindiSource === 'ai' ? false : isUnproofreadShown(scriptureId, chapterId, c.verseNum),
              wordMeaning: c.wordMeaning,
              padaccheda: c.padaccheda,
              commentary: c.commentary,
              explanation: c.explanation,
              science: c.science,
              lifeLesson: c.lifeLesson,
              keywords: c.keywords,
              speaker: c.speaker,
              chandas: c.chandas,
              concepts: c.concepts,
            })),
          });
        }
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, [state.kind, scriptureId, chapterId]);

  // Remember the verse being read, so "continue reading" resumes at it.
  useEffect(() => {
    if (state.kind !== 'ready') return;
    let timer = 0;
    const record = () => {
      // The reading line: a third of the way down the viewport.
      const line = window.innerHeight / 3;
      const cards = document.querySelectorAll<HTMLElement>('.verse-card[id^="verse-"]');
      for (let idx = 0; idx < cards.length; idx++) {
        const card = cards[idx];
        if (card.getBoundingClientRect().bottom > line) {
          const vNumStr = card.id.slice('verse-'.length);
          updateLastVerse(scriptureId, chapterId, vNumStr);
          setCurrentViewportVerse(vNumStr);
          setActiveVerse((previous) => previous.index === idx
            ? previous
            : { index: idx, direction: Math.sign(idx - previous.index) });
          const vNum = Number(vNumStr);
          if (!Number.isNaN(vNum) && state.verses.length > 0) {
            const percent = Math.round((vNum / state.verses.length) * 100);
            updateReaderScrollProgress({
              scriptureId,
              scriptureTitle: scriptureTitle ?? scriptureId,
              chapterNumber: chapterId,
              verseNumber: vNum,
              totalVerses: state.verses.length,
              percent,
            });
          }
          const pct = Math.round(((idx + 1) / cards.length) * 100);
          saveReadingPosition({
            scriptureId,
            chapterId,
            verseId: vNumStr,
            scrollAnchor: `verse-${vNumStr}`,
            updatedAt: new Date().toISOString(),
            percentage: pct,
          }).catch(() => { });
          recordReadingHistory({
            id: `hist_${scriptureId}_${chapterId}_${Date.now()}`,
            reference: {
              scriptureId,
              chapterId,
              verseId: vNumStr,
              canonicalReference: `${scriptureTitle || scriptureId} ${chapterId}.${vNumStr}`,
            },
            visitedAt: new Date().toISOString(),
            progressPercent: pct,
            timeSpentSeconds: 0,
          }).catch(() => { });
          return;
        }
      }
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(record, 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, [state, scriptureId, chapterId, scriptureTitle]);

  // Load verse bookmark statuses from localStorage and sync across components
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const saved = localStorage.getItem('dharma.bookmarkedVerses');
        if (saved) {
          const list: Array<{
            scriptureId: string;
            chapterId?: number;
            verseId: number | string;
          }> = JSON.parse(saved);
          const map: Record<string, boolean> = {};
          for (const b of list) {
            if (b.scriptureId === scriptureId && b.chapterId === chapterId) {
              map[String(b.verseId)] = true;
            }
          }
          setBookmarkedMap(map);
        } else {
          setBookmarkedMap({});
        }
      } catch { }
    };

    loadBookmarks();
    window.addEventListener('dharma-bookmark-updated', loadBookmarks);
    window.addEventListener('storage', loadBookmarks);
    return () => {
      window.removeEventListener('dharma-bookmark-updated', loadBookmarks);
      window.removeEventListener('storage', loadBookmarks);
    };
  }, [scriptureId, chapterId]);

  const toggleBookmark = (v: FullVerse) => {
    try {
      const saved = localStorage.getItem('dharma.bookmarkedVerses');
      const list: Array<{
        scriptureId: string;
        scriptureTitle: string;
        chapterId?: number;
        chapterTitle: string;
        verseId: number | string;
        sanskrit: string;
        translation: string;
        hindi?: string;
        timestamp: string;
      }> = saved ? JSON.parse(saved) : [];

      const vId = String(v.number);
      const isCurrentlySaved = Boolean(bookmarkedMap[vId]);

      let nextList: typeof list;
      if (isCurrentlySaved) {
        nextList = list.filter(
          (b) =>
            !(
              b.scriptureId === scriptureId &&
              b.chapterId === chapterId &&
              String(b.verseId) === vId
            ),
        );
      } else {
        const item = {
          scriptureId,
          scriptureTitle: scriptureTitle ?? scriptureId,
          chapterId,
          chapterTitle: chapterTitle ?? `अध्याय ${chapterId}`,
          verseId: v.number,
          sanskrit: v.sanskrit ?? '',
          translation: v.translation ?? v.hindi ?? '',
          hindi: v.hindi,
          timestamp: new Date().toISOString(),
        };
        nextList = [item, ...list];
      }

      localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify(nextList));
      setBookmarkedMap((prev) => ({
        ...prev,
        [vId]: !isCurrentlySaved,
      }));

      // Sync with IndexedDB v2 study storage
      if (isCurrentlySaved) {
        deleteSavedVerse(`saved:${scriptureId}:${chapterId}:${vId}`).catch(() => { });
      } else {
        saveVerseBookmark({
          id: `saved:${scriptureId}:${chapterId}:${vId}`,
          reference: {
            scriptureId,
            chapterId,
            verseId: vId,
            canonicalReference: `${scriptureTitle ?? scriptureId} ${chapterId}.${vId}`,
            sanskritSnippet: v.sanskrit,
            translationSnippet: v.translation,
          },
          collectionIds: [],
          savedAt: new Date().toISOString(),
        }).catch(() => { });
      }

      window.dispatchEvent(new Event('dharma-bookmark-updated'));
      triggerTactileFeedback(!isCurrentlySaved ? 'success' : 'medium', !isCurrentlySaved ? 'success' : 'softTap');
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const scrollToVerse = (
    verseNum: string | number,
    behavior: ScrollBehavior = 'smooth',
    preserveLayout = false,
    block: ScrollLogicalPosition = 'center'
  ) => {
    // The target becomes a full card; the plain verse it replaces has the same id, so the jump still lands.
    setRichVerses((prev) => withRich(prev, [verseNum]));
    const el = document.getElementById(`verse-${verseNum}`);
    if (el) {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isLite = document.documentElement.dataset.liteMode === 'true';
      // Temporarily set contentVisibility to 'visible' to pre-render layout dimensions accurately
      const prevVisibility = el.style.contentVisibility;
      el.style.contentVisibility = 'visible';
      const alignVerse = () => {
        // Re-query: the rich card can replace the plain verse node before this runs.
        const target = el.isConnected ? el : document.getElementById(`verse-${verseNum}`);
        target?.scrollIntoView({ behavior: prefersReduced || isLite ? 'instant' : behavior, block });
      };
      requestAnimationFrame(() => requestAnimationFrame(alignVerse));

      if (preserveLayout) {
        // Long chapters expand skipped cards as they enter the viewport. Correct once after that layout settles.
        window.setTimeout(() => {
          const current = el.isConnected ? el : document.getElementById(`verse-${verseNum}`);
          if (!current) return;
          const rect = current.getBoundingClientRect();
          if (rect.bottom <= 0 || rect.top >= window.innerHeight) alignVerse();
        }, 500);
      } else {
        setTimeout(() => {
          const rect = el.getBoundingClientRect();
          const isInViewport = rect.bottom > 0 && rect.top < window.innerHeight;
          if (el.dataset.activeVerse !== 'true' && !isInViewport) {
            el.style.contentVisibility = prevVisibility || '';
          }
        }, 800);
      }
    }
  };

  const playVerse = useCallback(
    (targetVerse: FullVerse) => {
      scrollToVerse(targetVerse.number);
      saveParayanaChapterProgress(scriptureId, chapterId, targetVerse.number);
      setCurrentVerseContext(
        targetVerse.sanskrit,
        `${scriptureTitle ?? scriptureId} ${chapterTitle ?? `अध्याय ${chapterId}`}, श्लोक ${targetVerse.number}`,
        targetVerse.hindi,
        targetVerse.translation
      );
      startSoundscape('recitation');
      // Setting the context notifies listeners before playback has started.
      setActiveRecitingVerse(targetVerse.number);
      triggerTactileFeedback('selection', 'softTap');
    },
    [scriptureTitle, scriptureId, chapterTitle, chapterId]
  );

  const togglePlayVerse = (targetVerse: FullVerse) => {
    if (String(activeRecitingVerse) === String(targetVerse.number)) {
      stopSoundscape();
      setActiveRecitingVerse(null);
      setParayanaActive(false);
    } else {
      playVerse(targetVerse);
    }
  };

  // Sync with global soundscape playback status & resume bookmark
  useEffect(() => {
    const checkResume = () => {
      const v = getParayanaChapterProgress(scriptureId, chapterId);
      setResumeVerse(v);
    };
    checkResume();

    const unsub = subscribeSoundscape((st: SoundscapeState) => {
      setCadenceMode(st.parayanaCadenceMode);
      if (!st.isPlaying || st.activeTrack !== 'recitation') {
        setActiveRecitingVerse(null);
        setParayanaActive(false);
      }
    });

    window.addEventListener('dharma:parayana-progress-updated', checkResume);
    return () => {
      unsub();
      window.removeEventListener('dharma:parayana-progress-updated', checkResume);
    };
  }, [scriptureId, chapterId]);

  // Deep-link auto-scroll if ?verse= or #verse- is present; layout correction handles long chapters.
  useEffect(() => {
    if (state.kind !== 'ready') return;
    const urlParams = new URLSearchParams(window.location.search);
    const targetVerse =
      urlParams.get('verse') ||
      (window.location.hash.startsWith('#verse-')
        ? window.location.hash.replace('#verse-', '')
        : null);
    if (targetVerse) {
      const timer = setTimeout(() => {
        // Jump, like a native #hash link: a smooth scroll across a long
        // chapter is slow and can be cut short by layout shifts.
        scrollToVerse(targetVerse, 'auto', true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [state.kind]);


  const handleCopyVerse = async (v: FullVerse) => {
    try {
      const parts: string[] = [];
      if (v.sanskrit) parts.push(v.sanskrit);
      if (v.transliteration) parts.push(v.transliteration);
      if (v.hindi) parts.push(`हिन्दी: ${v.hindi}`);
      if (v.translation) parts.push(`English: ${v.translation}`);
      parts.push(`— ${scriptureTitle ?? scriptureId}, ${chapterTitle ?? `अध्याय ${chapterId}`}, श्लोक ${v.number}`);
      if (typeof window !== 'undefined') {
        parts.push(window.location.href);
      }
      await navigator.clipboard.writeText(parts.join('\n\n'));
      setCopiedId(String(v.number));
      triggerTactileFeedback('medium', 'click');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy verse:', err);
    }
  };

  // Match keys computed once per chapter, not on every keystroke.
  const verseSearchKeys = useMemo(() => {
    if (state.kind !== 'ready') return [];
    return state.verses.map((v) => ({
      number: String(v.number),
      devaNumber: toDevanagari(v.number),
      // Transliteration gets phonetic folding, so "dharmakshetre" finds IAST
      // "dharmakṣetre".
      phonetic: normalizeTransliteration(v.transliteration ?? ''),
      text: normalizeForSearch([v.sanskrit, v.hindi, v.translation].filter(Boolean).join(' ')),
    }));
  }, [state]);

  // Verses without a meaning link to the nearest ones in the chapter that have one.
  const meaningNearby = useMemo(() => {
    if (state.kind !== 'ready') return new Map<string, NearbyMeaning>();
    return nearestWithMeaning(
      state.verses.map((v) => String(v.number)),
      state.verses.map((v) => verseHasMeaning(v, commentaryOf(state.commentary, chapterId, v.number, state.commentaryAmbiguity))),
    );
  }, [state, chapterId]);

  const filteredVerses = useMemo(() => {
    if (state.kind !== 'ready') return [];
    const q = normalizeForSearch(filterQuery);
    if (!q) return state.verses;
    const qPhonetic = normalizeTransliteration(filterQuery);
    const rawNumber = filterQuery.trim();
    const asciiDigits = toAsciiDigits(rawNumber);
    const devaDigits = toDevanagari(rawNumber);
    return state.verses.filter((_, i) => {
      const keys = verseSearchKeys[i];
      return (
        keys.number.includes(rawNumber) ||
        (asciiDigits !== '' && keys.number.includes(asciiDigits)) ||
        keys.devaNumber.includes(devaDigits) ||
        (qPhonetic !== '' && keys.phonetic.includes(qPhonetic)) ||
        keys.text.includes(q)
      );
    });
  }, [state, filterQuery, verseSearchKeys]);

  // Upgrade plain verses to full cards as they come within ~1.5 screens, a few at a time.
  useEffect(() => {
    if (!hydrated) return;
    const plain = document.querySelectorAll<HTMLElement>('[data-plain-verse]');
    if (plain.length === 0) return;
    const order = filteredVerses.map((v) => String(v.number));
    if (typeof IntersectionObserver === 'undefined') {
      setRichVerses((prev) => withRich(prev, order));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const near: string[] = [];
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const at = order.indexOf((e.target as HTMLElement).dataset.plainVerse ?? '');
          if (at !== -1) near.push(...order.slice(Math.max(0, at - 2), at + 4));
        }
        if (near.length > 0) setRichVerses((prev) => withRich(prev, near));
      },
      { rootMargin: '1200px 0px' },
    );
    plain.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [hydrated, filteredVerses, richVerses]);

  // Handle continuous recitation (अध्याय पारायण), media keys, and external triggers
  useEffect(() => {
    if (state.kind !== 'ready') return;

    if (pendingParayanaRef.current && state.verses.length > 0) {
      pendingParayanaRef.current = false;
      setContinuousParayana(true);
      playVerse(state.verses[0]);
      setParayanaActive(true);
    }

    let nextVerseTimer: ReturnType<typeof setTimeout> | undefined;
    const handleRecitationEnded = () => {
      const soundState = getSoundscapeState();
      if (parayanaActive || soundState.continuousParayana) {
        if (activeRecitingVerse !== null) {
          const list = filteredVerses.length > 0 ? filteredVerses : state.verses;
          const currentIndex = list.findIndex(
            (v) => String(v.number) === String(activeRecitingVerse)
          );
          if (currentIndex !== -1 && currentIndex + 1 < list.length) {
            const nextVerse = list[currentIndex + 1];
            // 2.5s serene breath pause between verses
            clearTimeout(nextVerseTimer);
            nextVerseTimer = setTimeout(() => playVerse(nextVerse), 2500);
          } else if (currentIndex + 1 >= list.length) {
            // Reached the end of the chapter
            strikeTempleBell(3);
            stopSoundscape();
            setContinuousParayana(false);
            setParayanaActive(false);
            setActiveRecitingVerse(null);
            clearParayanaChapterProgress(scriptureId, chapterId);
            setResumeVerse(null);

            const planUpdated = markChapterCompleteInReadingPlan(scriptureId, chapterId);
            if (planUpdated) {
              setToastMessage('अध्याय पारायण पूर्ण · Chapter marked complete in your Sadhana Reading Plan');
              setTimeout(() => setToastMessage(null), 4500);
              triggerPranaToast({
                message: 'अध्याय पारायण पूर्ण · Chapter marked complete in your Sadhana Reading Plan',
                icon: '🔔',
              });
            }
          }
        }
      } else {
        setActiveRecitingVerse(null);
      }
    };

    const handlePrev = () => {
      if (activeRecitingVerse !== null) {
        const list = filteredVerses.length > 0 ? filteredVerses : state.verses;
        const idx = list.findIndex((v) => String(v.number) === String(activeRecitingVerse));
        if (idx > 0) {
          playVerse(list[idx - 1]);
        }
      }
    };

    const handleNext = () => {
      if (activeRecitingVerse !== null) {
        const list = filteredVerses.length > 0 ? filteredVerses : state.verses;
        const idx = list.findIndex((v) => String(v.number) === String(activeRecitingVerse));
        if (idx !== -1 && idx + 1 < list.length) {
          playVerse(list[idx + 1]);
        }
      }
    };

    const handleStartParayana = (e?: Event) => {
      const customEvent = e as CustomEvent<{ startVerse?: number | string }>;
      const startVerseId = customEvent?.detail?.startVerse;
      const list = filteredVerses.length > 0 ? filteredVerses : state.verses;
      if (list.length > 0) {
        setContinuousParayana(true);
        const targetV =
          (startVerseId
            ? list.find((v) => String(v.number) === String(startVerseId))
            : null) || list[0];
        if (targetV) {
          playVerse(targetV);
          setParayanaActive(true);
        }
      }
    };

    window.addEventListener('dharma:recitation-ended', handleRecitationEnded);
    window.addEventListener('dharma:verse-prev', handlePrev);
    window.addEventListener('dharma:verse-next', handleNext);
    window.addEventListener('dharma:start-chapter-parayana', handleStartParayana);
    return () => {
      clearTimeout(nextVerseTimer);
      window.removeEventListener('dharma:recitation-ended', handleRecitationEnded);
      window.removeEventListener('dharma:verse-prev', handlePrev);
      window.removeEventListener('dharma:verse-next', handleNext);
      window.removeEventListener('dharma:start-chapter-parayana', handleStartParayana);
    };
  }, [state, parayanaActive, activeRecitingVerse, filteredVerses, playVerse]);


  const sanskritFontSizeClass = `${{
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl font-medium',
  }[readerSettings.sanskritSize]} ${{
    // 1.95 is the floor for Devanagari: below it stacked matras and repha clip.
    compact: 'leading-[1.95]',
    normal: 'leading-[2.05]',
    relaxed: 'leading-[2.2]',
    loose: 'leading-[2.4]',
  }[readerSettings.lineSpacing]}`;
  const translationFontSizeClass = `${{
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl',
    xl: 'text-xl md:text-2xl',
  }[readerSettings.translationSize]} ${{
    compact: 'leading-[1.7]',
    normal: 'leading-[1.85]',
    relaxed: 'leading-[2.05]',
    loose: 'leading-[2.35]',
  }[readerSettings.lineSpacing]}`;

  useEffect(() => {
    if (state.kind !== 'loading') return;
    const controller = new AbortController();
    (async () => {
      try {
        // Default caching, not 'force-cache': that serves a cached copy however
        // old, so readers kept seeing chapters from before a data repair.
        const shardRes = await fetch(
          `${basePath}/data/scriptures-full/${scriptureId}/ch-${chapterId}.json`,
          { signal: controller.signal },
        );

        if (!shardRes.ok) {
          setState({ kind: 'empty' });
          return;
        }

        const shard = (await shardRes.json()) as {
          chapter?: FullChapter;
          source?: FullScripture['source'];
        };
        const chapter = shard.chapter;
        const source = shard.source;

        if (!chapter || chapter.verses.length === 0) {
          setState({ kind: 'empty' });
          return;
        }

        const commentaryRes = await fetch(`${basePath}/data/hi-commentary/${scriptureId}.json`, {
          signal: controller.signal,
        });
        const extras = chapter.verses.filter(
          (v) => !curatedVerseSet.has(canonicalVerseId(chapterId, v.number)),
        );
        const commentary: HiCommentaryFragment | undefined = commentaryRes.ok
          ? await commentaryRes.json()
          : undefined;
        setState({ kind: 'ready', verses: extras, commentary, commentaryAmbiguity: commentaryAmbiguities(chapterId, chapter.verses.map(v => v.number)), source });
      } catch (err) {
        if (controller.signal.aborted) return;
        setState({ kind: 'error', message: (err as Error).message });
      }
    })();
    return () => controller.abort();
  }, [state.kind, scriptureId, chapterId, curatedVerseSet, basePath]);

  // Warm the cache for the next chapter so prev/next navigation feels
  // instant. Failure-silent: a missing shard just means there is no next
  // chapter. Pages built with their verses (initialChapter) skip this: the
  // next chapter's page carries its own, and next/link prefetches it.
  const fetchesShards = !initialChapter;
  useEffect(() => {
    if (!fetchesShards || state.kind !== 'ready') return;
    fetch(`${basePath}/data/scriptures-full/${scriptureId}/ch-${chapterId + 1}.json`, {
      priority: 'low',
    } as RequestInit).catch(() => { });
  }, [fetchesShards, state.kind, basePath, scriptureId, chapterId]);

  // Retry by itself once the connection comes back.
  useEffect(() => {
    if (state.kind !== 'error') return;
    const retry = () => setState({ kind: 'loading' });
    window.addEventListener('online', retry);
    return () => window.removeEventListener('online', retry);
  }, [state.kind]);

  if (state.kind === 'idle') {
    return (
      <div className="rounded-2xl border border-dashed border-saffron-300 bg-saffron-500/10 p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-saffron-100/80 text-saffron-700 mb-3">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif font-bold text-dharma-text mb-1">पूरा अध्याय पढ़ें</h3>
        <p className="text-sm text-dharma-muted max-w-md mx-auto mb-4">
          ऊपर मुख्य श्लोक उनकी पूर्ण व्याख्या सहित दिए गए हैं। शेष श्लोकों का मूल पाठ मुक्त-स्रोत संग्रह से लोड किया जा सकता है।
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: 'loading' })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-semibold transition"
        >
          शेष श्लोक देखें
        </button>
      </div>
    );
  }

  if (state.kind === 'loading') {
    return (
      <div className="space-y-6" role="status" aria-label="अध्याय लोड हो रहा है…">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-[28px] border border-dharma-border bg-dharma-card p-5 md:p-7 shadow-sm animate-pulse min-h-[340px]"
            aria-hidden="true"
          >
            {/* Header: medal, titles, actions toolbar */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 rounded-full bg-saffron-500/15" />
                <div className="space-y-1.5">
                  <div className="h-3 w-16 rounded bg-dharma-border/80" />
                  <div className="h-4 w-24 rounded bg-dharma-border/80" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {[0, 1, 2, 3].map((btn) => (
                  <div key={btn} className="h-9 w-9 rounded-full bg-dharma-border/60" />
                ))}
              </div>
            </div>

            {/* Manuscript Leaf (Sanskrit container placeholder) */}
            <div className="rounded-2xl border border-amber-300/30 bg-amber-50/40 dark:bg-amber-950/20 px-6 py-8 min-h-[130px] flex flex-col items-center justify-center space-y-3">
              <div className="h-5 w-4/5 rounded bg-amber-200/50 dark:bg-amber-900/40" />
              <div className="h-5 w-3/5 rounded bg-amber-200/50 dark:bg-amber-900/40" />
              <div className="h-3 w-2/5 rounded bg-amber-200/30 dark:bg-amber-900/30" />
            </div>

            {/* Meaning section placeholder */}
            <div className="mt-5 space-y-2.5 pt-2">
              <div className="h-3 w-20 rounded bg-dharma-border/80" />
              <div className="h-4 w-full rounded bg-dharma-border/60" />
              <div className="h-4 w-5/6 rounded bg-dharma-border/50" />
            </div>
          </div>
        ))}
        <span className="sr-only">अध्याय लोड हो रहा है…</span>
      </div>
    );
  }

  if (state.kind === 'empty') {
    return (
      <div className="rounded-2xl border border-dashed border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        इस ग्रंथ का पूर्ण-पाठ अभी तैयार नहीं हुआ है। पूर्ण पाठ संग्रहीत करने के लिए{' '}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100">npm run seed:all</code> चलाएँ ताकि{' '}
        <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-stone-100">public/data/scriptures-full/</code> भर जाए।
      </div>
    );
  }

  if (state.kind === 'error') {
    const offline = isOnline === false;
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-200 bg-rose-50/10 p-6 text-center"
      >
        <p className="font-semibold text-rose-900">
          {offline ? 'आप ऑफ़लाइन हैं — अध्याय लोड नहीं हो सका।' : 'अध्याय लोड नहीं हो सका।'}
        </p>
        <p className="mt-1 text-sm text-dharma-muted">
          {offline
            ? 'इंटरनेट से जुड़ने के बाद फिर से प्रयास करें।'
            : 'कनेक्शन में रुकावट हो सकती है। कृपया फिर से प्रयास करें।'}
        </p>
        <button
          type="button"
          onClick={() => setState({ kind: 'loading' })}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-saffron-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-saffron-700"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          पुनः प्रयास करें
        </button>
        {/* Kept for bug reports, out of the way of readers. */}
        <p className="mt-3 text-[11px] text-dharma-muted/70" lang="en">
          {state.message}
        </p>
      </div>
    );
  }

  /** The commentaries this verse actually carries, for the Bhāṣya switcher. Absent ones are not listed. */
  const bhashyaFor = (v: FullVerse): BhashyaSource[] => {
    const comment = commentaryOf(state.commentary, chapterId, v.number, state.commentaryAmbiguity);
    const { vyakhya, commentary } = splitVyakhyaCommentary([comment?.explanation, v.explanation, v.commentary], v.wordMeaning);
    const isHi = (t: string) => (t.match(/[\u0900-\u097F]/g)?.length ?? 0) > (t.match(/[A-Za-z]/g)?.length ?? 0);
    const draft = Boolean(comment?.ai || comment?.explanationAi || comment?.editorial);
    const out: BhashyaSource[] = [];
    if (vyakhya) out.push({ id: 'vyakhya', labelHi: 'व्याख्या', labelEn: 'Explanation', text: vyakhya, lang: 'hi', draft });
    if (commentary && commentary !== vyakhya) {
      out.push({ id: 'commentary', labelHi: 'टीका', labelEn: 'Commentary', text: commentary, lang: isHi(commentary) ? 'hi' : 'en', draft: !vyakhya && draft });
    }
    const science = comment?.science ?? v.science;
    if (science) out.push({ id: 'research', labelHi: 'शोध टिप्पणी', labelEn: 'Research note', text: science, lang: isHi(science) ? 'hi' : 'en', draft: Boolean(comment?.ai || comment?.scienceAi) });
    const lesson = comment?.lifeLesson ?? v.lifeLesson;
    if (lesson) out.push({ id: 'lesson', labelHi: 'जीवन सूत्र', labelEn: 'For life', text: lesson, lang: isHi(lesson) ? 'hi' : 'en', draft: Boolean(comment?.ai) });
    return out;
  };

  const changeReaderMode = (mode: ReaderMode) => {
    setReaderMode(mode);
    if (mode === 'samhita') {
      setFocusedVerse(null);
      return;
    }
    if (!focusedVerse && state.kind === 'ready' && state.verses.length > 0) {
      // Nothing lifted yet: lift the verse being read.
      const target = currentViewportVerse ?? String(state.verses[activeVerseIndex]?.number ?? state.verses[0].number);
      setFocusedVerse(target);
      document.getElementById(`verse-${target}`)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    }
  };

  const toggleListening = () => {
    triggerTactileFeedback('selection', 'click');
    if (parayanaActive) {
      stopSoundscape();
      setParayanaActive(false);
      setActiveRecitingVerse(null);
      setContinuousParayana(false);
      return;
    }
    window.dispatchEvent(
      new CustomEvent('dharma:start-chapter-parayana', { detail: { startVerse: focusedVerse ?? currentViewportVerse ?? undefined } }),
    );
  };

  if (state.verses.length === 0) {
    return (
      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        इस अध्याय के सभी श्लोक ऊपर दिखाए जा चुके हैं।
      </div>
    );
  }

  const viewportVerseIdx = currentViewportVerse !== null
    ? state.verses.findIndex((v) => String(v.number) === String(currentViewportVerse))
    : -1;
  const activeVerseIdx = viewportVerseIdx >= 0 ? viewportVerseIdx : 0;
  const activeVerseNumber = state.verses[activeVerseIdx]?.number ?? (currentViewportVerse ?? '1');
  const prevVerseNum = activeVerseIdx > 0 ? state.verses[activeVerseIdx - 1]?.number : null;
  const nextVerseNum = activeVerseIdx < state.verses.length - 1 ? state.verses[activeVerseIdx + 1]?.number : null;
  const chapterScrollPct = state.verses.length > 0 && viewportVerseIdx >= 0
    ? Math.min(100, Math.round(((viewportVerseIdx + 1) / state.verses.length) * 100))
    : 0;

  return (
    <>
      <section>
        {/* Sticky running head: chapter and verse progress, ‹/› steppers, verse jump, the Aa sheet
            (every reading choice: depth, type, layers, recitation) and search within the chapter. */}
        <div className="sticky top-[52px] z-30 -mx-2 mb-4 border-b border-dharma-border/60 bg-dharma-bg/95 px-2 py-1.5 backdrop-blur-md sm:mb-6 sm:pb-2.5 sm:pt-2">
          {/* One row on phones (360px up): the chapter number shows from sm. */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <p className="text-xs text-dharma-muted truncate">
                <span className="sr-only">पूर्ण अध्याय पाठ · </span>
                {filterQuery.trim() ? (
                  `${filteredVerses.length} / ${state.verses.length} श्लोक`
                ) : (
                  <span>
                    <span className="hidden font-semibold text-dharma-text truncate sm:inline" title={chapterTitle}>
                      अध्याय {toAsciiDigits(chapterId)}
                    </span>
                    <span className="mx-1 hidden text-dharma-muted/60 sm:inline" aria-hidden="true">·</span>
                    <span className="font-medium text-dharma-text">
                      श्लोक{' '}
                      <span key={activeVerseNumber} className="reader-verse-number inline-block tabular-nums" data-direction={verseDirection}>
                        {toAsciiDigits(activeVerseNumber)}
                      </span>
                    </span>
                    <span className="text-dharma-muted"> / {toAsciiDigits(state.verses.length)}</span>
                  </span>
                )}
                {parayanaActive && activeRecitingVerse !== null && (
                  <span className="ml-1.5 hidden sm:inline text-amber-700 dark:text-amber-300 font-medium">
                    · पारायण {toAsciiDigits(activeRecitingVerse)}
                  </span>
                )}
              </p>

              {/* Prev/Next verse micro-steppers */}
              {state.verses.length > 1 && (
                <div className="hidden sm:inline-flex items-center gap-0.5 ml-0.5">
                  <button
                    type="button"
                    disabled={prevVerseNum === null}
                    onClick={() => {
                      if (prevVerseNum !== null) {
                        triggerTactileFeedback('selection', 'softTap');
                        scrollToVerse(prevVerseNum, 'smooth', false, 'start');
                      }
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text hover:bg-dharma-card-soft disabled:opacity-25 disabled:pointer-events-none transition"
                    title="पिछला श्लोक (Previous verse)"
                    aria-label="पिछला श्लोक (Previous verse)"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={nextVerseNum === null}
                    onClick={() => {
                      if (nextVerseNum !== null) {
                        triggerTactileFeedback('selection', 'softTap');
                        scrollToVerse(nextVerseNum, 'smooth', false, 'start');
                      }
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text hover:bg-dharma-card-soft disabled:opacity-25 disabled:pointer-events-none transition"
                    title="अगला श्लोक (Next verse)"
                    aria-label="अगला श्लोक (Next verse)"
                  >
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-1 sm:gap-2">
              {state.verses.length > 5 && (
                <label className="liquid-pill inline-flex min-h-[40px] items-center rounded-full px-2 text-xs sm:px-2.5 font-medium text-dharma-muted hover:text-dharma-text">
                  <span className="sr-only">श्लोक पर जाएं</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        scrollToVerse(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    aria-label="श्लोक पर सीधे जाएं (Jump to verse)"
                    className="min-h-11 max-w-[44vw] cursor-pointer rounded-lg bg-transparent px-2 py-1 text-xs font-semibold text-dharma-text outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                  >
                    <option value="" disabled className="bg-dharma-card text-dharma-text">
                      श्लोक पर जाएं ▾
                    </option>
                    {state.verses.map((v) => (
                      <option key={String(v.number)} value={String(v.number)} className="bg-dharma-card text-dharma-text">
                        श्लोक {toAsciiDigits(v.number)}{bookmarkedMap[String(v.number)] ? ' · सहेजा हुआ' : ''}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <button
                type="button"
                onClick={() => setReaderSettingsOpen(true)}
                className="liquid-pill inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-1.5 rounded-full px-3 text-sm font-semibold text-dharma-text hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                title="पठन व्यवस्था · Reader settings"
                aria-label="पठन व्यवस्था · Reader settings"
                aria-haspopup="dialog"
                aria-expanded={readerSettingsOpen}
              >
                <span aria-hidden="true" className="font-serif">Aa</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const opening = !searchOpen;
                  setSearchOpen(opening);
                  // After the field is shown, so a keyboard or phone reader can type at once.
                  if (opening) requestAnimationFrame(() => searchInputRef.current?.focus());
                }}
                className={`liquid-pill inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${filterQuery.trim() ? 'text-saffron-700 dark:text-saffron-300' : 'text-dharma-text'}`}
                title="इस अध्याय में खोजें · Search this chapter"
                aria-label="इस अध्याय में खोजें · Search this chapter"
                aria-expanded={searchOpen}
                aria-controls="chapter-verse-search"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {chapterScrollPct > 0 && (
            <div aria-hidden="true" className="absolute -bottom-[1px] left-0 right-0 h-[2px] overflow-hidden bg-dharma-border/30">
              <div
                className="reader-progress-fill h-full origin-left bg-gradient-to-r from-saffron-500 via-amber-500 to-saffron-600"
                style={{ transform: `scaleX(${chapterScrollPct / 100})` }}
              />
            </div>
          )}

          <div
            id="chapter-verse-search"
            className={`${searchOpen ? 'liquid-reveal' : 'hidden'} relative mt-2`}
          >
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dharma-muted" aria-hidden="true" />
            <input
              ref={searchInputRef}
              type="search"
              aria-label="श्लोक संख्या या शब्द खोजें (Search verses in this chapter)"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="श्लोक संख्या या शब्द खोजें... (e.g. 5, धर्म, कृष्ण)"
              className="min-h-[44px] w-full rounded-xl border border-dharma-border/70 bg-dharma-bg/80 pl-9 pr-11 text-sm text-dharma-text placeholder:text-dharma-muted/70 outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-400/20 [&::-webkit-search-cancel-button]:hidden"
            />
            {filterQuery && (
              <button
                type="button"
                onClick={() => {
                  setFilterQuery('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-0 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
                aria-label="Clear filter"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Gives each verse's h3 a parent heading (h1 chapter → h2 verses → h3 verse). */}
        <h2 className="sr-only"><span lang="hi" data-bi="hi">श्लोक</span><span data-bi="sep"> · </span><span data-bi="en">Verses</span></h2>
        {isConversationMode && scriptureId === 'bhagavadgita' ? (
          <ConversationModeView
            scriptureId={scriptureId}
            chapterId={chapterId}
            verses={state.verses}
            onExitConversationMode={() => setIsConversationMode(false)}
          />
        ) : (
          <div
            className="space-y-8"
            data-verse-size={readerSettings.sanskritSize}
            data-verse-leading={readerSettings.lineSpacing}
            onClickCapture={hydrated ? openPlainVerseInPlace : undefined}
          >
            {filteredVerses.length === 0 ? (
              <div className="rounded-xl border border-dashed border-dharma-border bg-dharma-card p-8 text-center text-sm text-dharma-muted">
                <p className="font-semibold text-dharma-text mb-1">&lsquo;{filterQuery}&rsquo; के लिए कोई श्लोक नहीं मिला</p>
                <p className="text-xs mb-3">कृपया दूसरा श्लोक क्रमांक या शब्द खोजें।</p>
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dharma-border bg-dharma-bg text-xs font-semibold hover:border-saffron-300"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> फ़िल्टर हटाएं
                </button>
              </div>
            ) : (
              filteredVerses.map((v, index) => {
                const isSpotlighted = !ekagrataMode || (activeRecitingVerse ? String(activeRecitingVerse) === String(v.number) : (currentViewportVerse ? currentViewportVerse === String(v.number) : index === 0));

                // For index >= RICH_BATCH when not in richVerses: render lightweight plain VerseText
                // with the identical outer wrapper div so container height and child selectors remain stable.
                if (index >= RICH_BATCH && !richVerses.has(String(v.number))) {
                  return (
                    <div
                      key={`${String(v.number)}-${index}`}
                      data-plain-verse={String(v.number)}
                      className={`transition-opacity duration-300 ${!isSpotlighted ? 'opacity-35 hover:opacity-90 focus-within:opacity-100' : 'opacity-100'}`}
                    >
                      <SpatialShloka
                        focused={focusedVerse === String(v.number)}
                        dimmed={focusedVerse !== null && focusedVerse !== String(v.number)}
                        onFocusChange={(on) => setFocusedVerse(on ? String(v.number) : null)}
                        mode={readerMode}
                        wordMeaning={v.wordMeaning}
                        bhashya={focusedVerse === String(v.number) ? bhashyaFor(v) : []}
                      >
                        <VerseText verse={v} chapterId={chapterId} scriptureId={scriptureId} href={versePageHref(scriptureId, chapterId, v.number)} />
                      </SpatialShloka>
                    </div>
                  );
                }

                // Otherwise (initial RICH_BATCH verses and scrolled verses): render full VerseCard
                // directly both on SSR and client to completely eliminate the 2.816 CLS hydration swap.
                const comment = commentaryOf(state.commentary, chapterId, v.number, state.commentaryAmbiguity);
                const explanationHi = comment?.explanation;
                const scienceHi = comment?.science;
                const lifeLessonHi = comment?.lifeLesson;
                const { vyakhya, commentary } = splitVyakhyaCommentary(
                  [explanationHi, v.explanation, v.commentary],
                  v.wordMeaning,
                );
                const explanation = vyakhya ?? commentary;
                const explanationIsHi = Boolean(vyakhya);
                const science = scienceHi ?? v.science;
                const scienceIsHi = Boolean(scienceHi);
                const lesson = lifeLessonHi ?? v.lifeLesson;
                const lessonIsHi = Boolean(lifeLessonHi);

                return (
                  <div
                    key={`${String(v.number)}-${index}`}
                    className={`transition-opacity duration-300 ${!isSpotlighted ? 'opacity-35 hover:opacity-90 focus-within:opacity-100' : 'opacity-100'}`}
                  >
                    <SpatialShloka
                      focused={focusedVerse === String(v.number)}
                      dimmed={focusedVerse !== null && focusedVerse !== String(v.number)}
                      onFocusChange={(on) => setFocusedVerse(on ? String(v.number) : null)}
                      mode={readerMode}
                      wordMeaning={v.wordMeaning}
                      bhashya={focusedVerse === String(v.number) ? bhashyaFor(v) : []}
                    >
                      <VerseCard
                        spatialFocused={focusedVerse === String(v.number)}
                        onToggleSpatial={() => setFocusedVerse((cur) => (cur === String(v.number) ? null : String(v.number)))}
                        depth={readingDepth}
                        verse={v}
                        relatedTeachings={relatedTeachingsByVerse[String(v.number)]}
                        literaryMeta={literaryByVerse[String(v.number)]}
                        meaning={{
                          isAi: Boolean(comment?.ai || comment?.explanationAi),
                          editorial: comment?.editorial,
                          explanation,
                          explanationIsHi,
                          vyakhya,
                          commentary,
                          science,
                          scienceIsHi,
                          scienceIsAi: Boolean(comment?.ai || comment?.scienceAi),
                          lesson,
                          lessonIsHi,
                        }}
                        layers={{
                          translit: showTranslit,
                          hindi: showHindi,
                          english: showEnglish,
                          commentary: showCommentary,
                        }}
                        scriptureId={scriptureId}
                        chapterId={chapterId}
                        category={category}
                        scriptureTitle={scriptureTitle ?? scriptureId}
                        chapterTitle={chapterTitle ?? `अध्याय ${chapterId}`}
                        chantingMode={chantingMode}
                        sanskritFontSizeClass={sanskritFontSizeClass}
                        translationFontSizeClass={translationFontSizeClass}
                        bookmarked={Boolean(bookmarkedMap[String(v.number)])}
                        copied={copiedId === String(v.number)}
                        onToggleBookmark={() => toggleBookmark(v)}
                        onCopy={() => handleCopyVerse(v)}
                        onContribute={() => setContributeVerse(v)}
                        onAddToCollection={() =>
                          setCollectionVerse({
                            scriptureId,
                            scriptureTitle: scriptureTitle ?? scriptureId,
                            chapterId,
                            chapterTitle: chapterTitle ?? `अध्याय ${chapterId}`,
                            verseId: v.number,
                            sanskrit: v.sanskrit || '',
                            translation: v.hindi || v.translation || '',
                          })
                        }
                        inCollectionCount={getCollectionCount(v.number)}
                        highlight={getHighlight(scriptureId, chapterId, v.number)?.color}
                        onHighlight={(color) => toggleHighlight(scriptureId, chapterId, v.number, color)}
                        insight={initialChapter?.insights?.[String(v.number)]}
                        onOpenFocus={() => {
                          setFocusVerseIndex(index);
                          setFocusModeOpen(true);
                        }}
                        versePageHref={versePageHref(scriptureId, chapterId, v.number)}
                        studyRequested={studyRequested.has(String(v.number))}
                        isReciting={String(activeRecitingVerse) === String(v.number)}
                        onPlayRecitation={() => togglePlayVerse(v)}
                        onOpenSvadhyaya={handleOpenSvadhyaya}
                        isActive={index === activeVerseIndex}
                        meaningNearby={meaningNearby.get(String(v.number))}
                      />
                    </SpatialShloka>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Svadhyaya Split Workbench (Desktop sticky workbench / Mobile bottom sheet) */}
        {svadhyayaLoaded && (
          <SvadhyayaSplitDrawer
            isOpen={svadhyayaOpen}
            onClose={() => setSvadhyayaOpen(false)}
            activeTab={svadhyayaTab}
            onTabChange={setSvadhyayaTab}
            conceptSlug={svadhyayaConcept}
            parallelVerse={svadhyayaParallel}
            mananaContext={svadhyayaMananaContext}
            onJumpToVerse={(slug, ch, vNum) => {
              if (slug === scriptureId && ch === chapterId) {
                scrollToVerse(vNum);
              } else {
                window.location.href = `/scripture/${slug}/?ch=${ch}&verse=${vNum}`;
              }
            }}
          />
        )}

        {/* The reader's Liquid Glass dock: Saṁhitā, Anvaya, Śravaṇa, Bhāṣya, ⌘K. */}
        {state.kind === 'ready' && state.verses.length > 0 && (
          <LiquidGlassDock
            mode={readerMode}
            onModeChange={changeReaderMode}
            listening={parayanaActive}
            recitingVerse={activeRecitingVerse !== null ? toAsciiDigits(activeRecitingVerse) : undefined}
            onToggleListening={toggleListening}
            pinned={focusedVerse !== null}
          />
        )}
        {state.source?.repo && (
          <p className="mt-6 text-xs text-dharma-muted text-center">
            स्रोत:{' '}
            <a href={state.source.repo} target="_blank" rel="noopener noreferrer" className="underline" onClick={(e) => e.stopPropagation()}>
              {state.source.repo.replace('https://github.com/', '')}
            </a>
            {state.source.fetchedAt && ` · प्राप्त ${new Date(state.source.fetchedAt).toLocaleDateString('hi-IN', { numberingSystem: 'latn' })}`}
          </p>
        )}

        {/* Floating toast notification */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full bg-stone-950/90 text-amber-400 border border-amber-500/30 backdrop-blur-md text-xs font-medium shadow-2xl animate-fade-in"
          >
            {toastMessage}
          </div>
        )}

      </section>

      {/* Single contribute modal for bulk verses */}
      {contributeLoaded && (
        <ContributeMeaningModal
          open={!!contributeVerse}
          onClose={() => setContributeVerse(null)}
          scriptureId={scriptureId}
          chapterId={chapterId}
          verseId={contributeVerse?.number ?? ''}
          sanskrit={contributeVerse?.sanskrit}
          scriptureTitle={undefined}
          chapterTitle={undefined}
          current={{
            hindi: contributeVerse?.hindi,
            translation: contributeVerse?.translation,
            explanation: contributeVerse?.explanation || contributeVerse?.commentary || contributeVerse?.wordMeaning,
            science: contributeVerse?.science,
            lifeLesson: contributeVerse?.lifeLesson,
          }}
        />
      )}

      {/* Add verse to collection modal */}
      {collectionLoaded && (
        <AddToCollectionModal
          open={Boolean(collectionVerse)}
          onClose={() => setCollectionVerse(null)}
          verse={collectionVerse}
        />
      )}

      {readerSettingsLoaded && (
        <ReaderSettingsPanel
          open={readerSettingsOpen}
          onClose={() => setReaderSettingsOpen(false)}
          settings={readerSettings}
          update={updateReaderSetting}
          reset={() => {
            // Also forgets the shared depth choice, so the chapter opens at its first depth again.
            resetReaderSettings();
            // The sheet holds these chapter choices too, so its reset returns them to how a chapter first opens.
            setChantingMode(false);
            setIsConversationMode(false);
            setParayanaCadenceMode('sanskrit_only');
          }}
          reducedMotion={reducedMotion}
          theme={theme}
          setTheme={setTheme}
          scope="chapter"
          chapter={{
            recitation: chantingMode,
            setRecitation: setChantingMode,
            cadence: cadenceMode,
            setCadence: setParayanaCadenceMode,
            ...(scriptureId === 'bhagavadgita' ? { conversation: isConversationMode, setConversation: setIsConversationMode } : null),
            openFocus: () => {
              setFocusVerseIndex(0);
              setFocusModeOpen(true);
            },
          }}
        />
      )}

      {/* Fullscreen Mobile & Screen Focus Mode */}
      {focusLoaded && (
        <MobileFocusMode
          isOpen={focusModeOpen}
          onClose={closeFocusMode}
          // A chapter search that matches nothing must not leave this full-screen view empty.
          verses={filteredVerses.length > 0 ? filteredVerses : state.kind === 'ready' ? state.verses : filteredVerses}
          initialVerseIndex={focusVerseIndex}
          scriptureId={scriptureId}
          scriptureTitle={scriptureTitle ?? scriptureId}
          chapterTitle={chapterTitle ?? `अध्याय ${chapterId}`}
          chapterId={chapterId}
          category={category}
          commentary={state.commentary}
          commentaryAmbiguity={state.commentaryAmbiguity}
          bookmarkedMap={bookmarkedMap}
          onToggleBookmark={(v) => toggleBookmark(v as FullVerse)}
          onVerseChange={(verseNum) => scrollToVerse(verseNum)}
        />
      )}
    </>
  );
}
