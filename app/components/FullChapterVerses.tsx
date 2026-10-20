'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Flame,
  Maximize2,
  RotateCcw,
  Search,
  SlidersHorizontal,
  X,
  MessageSquare,
  Volume2,
  Pause,
  Play,
  Target,
} from 'lucide-react';
import { updateReaderScrollProgress, triggerPranaToast } from '@/lib/prana-capsule-store';
import type { ScriptureCategory } from '@/data/types';
import type { HiCommentaryFragment } from '@/data/hi-commentary/_types';
import { canonicalVerseId } from '@/lib/canonical-verse-id';
import { versePageHref } from '@/lib/verse-paths';
import { normalizeForSearch, normalizeTransliteration } from '@/lib/normalize-search';
import { toAsciiDigits, toDevanagari } from '@/lib/verse-format';
import { useStudyProgress, type VerseRef } from '@/lib/useStudyProgress';
import { updateLastVerse } from '@/lib/reading-history';
import dynamic from 'next/dynamic';
import { useEverTrue } from '@/lib/use-ever-true';

// Dialogs and alternate reading modes load the first time they are used, so they stay out of the chapter's first-load JS.
const AddToCollectionModal = dynamic(() => import('./AddToCollectionModal').then((m) => m.AddToCollectionModal), { ssr: false });
const ContributeMeaningModal = dynamic(() => import('./ContributeMeaningModal').then((m) => m.ContributeMeaningModal), { ssr: false });
import { VerseCard } from './VerseCard';
import { ReadingDepthSwitch } from '@/app/components/reader/ReadingDepthSwitch';
import { useReadingDepth } from '@/lib/reading-depth';
import { VerseText } from './VerseText';
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
} from '@/lib/sacred-soundscape';
import {
  saveParayanaChapterProgress,
  clearParayanaChapterProgress,
  getParayanaChapterProgress,
  markChapterCompleteInReadingPlan,
} from '@/lib/reading-plan-sync';
import { saveChapterVersesToDB, getCachedChapterVersesFromDB } from '@/lib/db/granth-indexeddb';
import type { SvadhyayaTab } from '@/components/reader/SvadhyayaSplitDrawer';
const SvadhyayaSplitDrawer = dynamic(() => import('@/components/reader/SvadhyayaSplitDrawer').then((m) => m.SvadhyayaSplitDrawer), { ssr: false });
import { MobileOneThumbControlBar } from './reader/MobileOneThumbControlBar';
import {
  saveReadingPosition,
  recordReadingHistory,
  saveVerseBookmark,
  deleteSavedVerse,
} from '@/lib/study/storage';
import { runStudyDataMigration } from '@/lib/study/migration';

interface FullVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  translationSource?: 'ai';
  hindi?: string;
  hindiSource?: 'ai';
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
}

export interface InitialChapter {
  verses: FullVerse[];
  commentary?: HiCommentaryFragment;
  source?: FullScripture['source'];
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'ready'; verses: FullVerse[]; commentary?: HiCommentaryFragment; source?: FullScripture['source'] }
  | { kind: 'empty' }
  | { kind: 'error'; message: string };

export function FullChapterVerses({ scriptureId, category, chapterId, curatedVerseIds, scriptureTitle, chapterTitle, basePath = '', autoLoad = false, initialChapter }: Props) {
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
    runStudyDataMigration().catch(() => {});
  }, []);

  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [chantingMode, setChantingMode] = useState(false);
  const [readingDepth] = useReadingDepth();
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [showTranslit, setShowTranslit] = useState(true);
  const [showHindi, setShowHindi] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showCommentary, setShowCommentary] = useState(true);
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const [focusVerseIndex, setFocusVerseIndex] = useState(0);
  const [activeRecitingVerse, setActiveRecitingVerse] = useState<number | string | null>(null);
  const [parayanaActive, setParayanaActive] = useState(false);
  const [resumeVerse, setResumeVerse] = useState<number | null>(null);
  const [cadenceMode, setCadenceMode] = useState<ParayanaCadenceMode>(() => getSoundscapeState().parayanaCadenceMode);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentViewportVerse, setCurrentViewportVerse] = useState<string | null>(null);
  const [ekagrataMode, setEkagrataMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return JSON.parse(localStorage.getItem('dharma_ekagrata_mode') || 'false');
    } catch {
      return false;
    }
  });
  const pendingParayanaRef = useRef(false);
  const layersMenuRef = useRef<HTMLDivElement>(null);
  const layersTriggerRef = useRef<HTMLButtonElement>(null);
  // One store for the whole chapter (not one per card): notes, highlights and
  // collections are passed down to each VerseCard.
  const { recordReading, getNote, setNote, getHighlight, toggleHighlight, collections } = useStudyProgress();
  const [collectionVerse, setCollectionVerse] = useState<VerseRef | null>(null);
  const contributeLoaded = useEverTrue(Boolean(contributeVerse));
  const collectionLoaded = useEverTrue(Boolean(collectionVerse));
  const focusLoaded = useEverTrue(focusModeOpen);

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
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);

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
      saveChapterVersesToDB(scriptureId, chapterId, state.verses).catch(() => {});
    }
  }, [state.kind, scriptureId, chapterId]);

  // Check IndexedDB cache if loading or offline
  useEffect(() => {
    if (state.kind !== 'loading') return;
    let cancelled = false;
    getCachedChapterVersesFromDB(scriptureId, chapterId)
      .then((cached) => {
        if (!cancelled && cached && cached.length > 0) {
          setState({
            kind: 'ready',
            verses: cached.map((c) => ({
              number: c.verseNum,
              sanskrit: c.sanskrit,
              transliteration: c.transliteration,
              translation: c.translation,
              hindi: c.hindi,
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
      .catch(() => {});
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
          setActiveVerseIndex(idx);
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
          }).catch(() => {});
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
          }).catch(() => {});
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

  // Sync Ekāgratā mode from external events
  useEffect(() => {
    const handleEkagrata = (e: Event) => {
      const custom = e as CustomEvent<{ active: boolean }>;
      if (custom.detail) setEkagrataMode(custom.detail.active);
    };
    window.addEventListener('dharma:ekagrata-toggle', handleEkagrata as EventListener);
    return () => window.removeEventListener('dharma:ekagrata-toggle', handleEkagrata as EventListener);
  }, []);

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
      } catch {}
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
        deleteSavedVerse(`saved:${scriptureId}:${chapterId}:${vId}`).catch(() => {});
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
        }).catch(() => {});
      }

      window.dispatchEvent(new Event('dharma-bookmark-updated'));
      triggerTactileFeedback(!isCurrentlySaved ? 'success' : 'medium', !isCurrentlySaved ? 'success' : 'softTap');
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const scrollToVerse = (verseNum: string | number, behavior: ScrollBehavior = 'smooth') => {
    const el = document.getElementById(`verse-${verseNum}`);
    if (el) {
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Temporarily set contentVisibility to 'visible' to pre-render layout dimensions accurately
      const prevVisibility = el.style.contentVisibility;
      el.style.contentVisibility = 'visible';
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : behavior, block: 'center' });
        setTimeout(() => {
          if (el.dataset.activeVerse !== 'true') {
            el.style.contentVisibility = prevVisibility || '';
          }
        }, 800);
      });
    }
  };

  const playVerse = useCallback(
    (targetVerse: FullVerse) => {
      setActiveRecitingVerse(targetVerse.number);
      scrollToVerse(targetVerse.number);
      saveParayanaChapterProgress(scriptureId, chapterId, targetVerse.number);
      setCurrentVerseContext(
        targetVerse.sanskrit,
        `${scriptureTitle ?? scriptureId} ${chapterTitle ?? `अध्याय ${chapterId}`}, श्लोक ${targetVerse.number}`,
        targetVerse.hindi,
        targetVerse.translation
      );
      startSoundscape('recitation');
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

    const unsub = subscribeSoundscape((st) => {
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

  // Deep-link auto-scroll on mount if ?verse= or #verse- is present
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
        scrollToVerse(targetVerse, 'auto');
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [state.kind]);

  // Close layers menu on outside click or Escape
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!layersMenuRef.current?.contains(e.target as Node)) {
        setShowLayersMenu(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowLayersMenu(false);
        layersTriggerRef.current?.focus();
      }
    }
    if (showLayersMenu) {
      document.addEventListener('mousedown', handlePointerDown);
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('mousedown', handlePointerDown);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showLayersMenu]);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem('dharma_reader_fontsize');
      if (savedFontSize === 'normal' || savedFontSize === 'large' || savedFontSize === 'xl') {
        setFontSize(savedFontSize);
      }
      const savedLayers = localStorage.getItem('dharma_reader_layers');
      if (savedLayers) {
        const parsed = JSON.parse(savedLayers);
        if (typeof parsed.translit === 'boolean') setShowTranslit(parsed.translit);
        if (typeof parsed.hindi === 'boolean') setShowHindi(parsed.hindi);
        if (typeof parsed.english === 'boolean') setShowEnglish(parsed.english);
        if (typeof parsed.commentary === 'boolean') setShowCommentary(parsed.commentary);
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  const updateFontSize = (size: 'normal' | 'large' | 'xl') => {
    setFontSize(size);
    try {
      localStorage.setItem('dharma_reader_fontsize', size);
    } catch {}
  };

  const updateLayers = (updates: Partial<{ translit: boolean; hindi: boolean; english: boolean; commentary: boolean }>) => {
    const next = {
      translit: updates.translit ?? showTranslit,
      hindi: updates.hindi ?? showHindi,
      english: updates.english ?? showEnglish,
      commentary: updates.commentary ?? showCommentary,
    };
    if (updates.translit !== undefined) setShowTranslit(updates.translit);
    if (updates.hindi !== undefined) setShowHindi(updates.hindi);
    if (updates.english !== undefined) setShowEnglish(updates.english);
    if (updates.commentary !== undefined) setShowCommentary(updates.commentary);
    try {
      localStorage.setItem('dharma_reader_layers', JSON.stringify(next));
    } catch {}
  };

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

  // Handle continuous recitation (अध्याय पारायण), media keys, and external triggers
  useEffect(() => {
    if (state.kind !== 'ready') return;

    if (pendingParayanaRef.current && state.verses.length > 0) {
      pendingParayanaRef.current = false;
      setContinuousParayana(true);
      setParayanaActive(true);
      playVerse(state.verses[0]);
    }

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
            const timer = setTimeout(() => {
              playVerse(nextVerse);
            }, 2500);
            return () => clearTimeout(timer);
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
        setParayanaActive(true);
        const targetV =
          (startVerseId
            ? list.find((v) => String(v.number) === String(startVerseId))
            : null) || list[0];
        if (targetV) {
          playVerse(targetV);
        }
      }
    };

    window.addEventListener('dharma:recitation-ended', handleRecitationEnded);
    window.addEventListener('dharma:verse-prev', handlePrev);
    window.addEventListener('dharma:verse-next', handleNext);
    window.addEventListener('dharma:start-chapter-parayana', handleStartParayana);
    return () => {
      window.removeEventListener('dharma:recitation-ended', handleRecitationEnded);
      window.removeEventListener('dharma:verse-prev', handlePrev);
      window.removeEventListener('dharma:verse-next', handleNext);
      window.removeEventListener('dharma:start-chapter-parayana', handleStartParayana);
    };
  }, [state, parayanaActive, activeRecitingVerse, filteredVerses, playVerse]);


  const sanskritFontSizeClass =
    fontSize === 'xl'
      ? 'text-xl md:text-2xl leading-loose font-medium'
      : fontSize === 'large'
      ? 'text-lg md:text-xl leading-loose'
      : 'text-base md:text-lg leading-loose';

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
        setState({ kind: 'ready', verses: extras, commentary, source });
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
    } as RequestInit).catch(() => {});
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
          पूरा अध्याय लोड करें
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
              <div className="flex items-center gap-1.5">
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
    const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
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

  if (state.verses.length === 0) {
    return (
      <div className="rounded-2xl border border-dharma-border bg-dharma-card p-6 text-center text-sm text-dharma-muted">
        इस अध्याय के सभी श्लोक ऊपर दिखाए जा चुके हैं।
      </div>
    );
  }

  return (
    <>
      <section>
        {/* Reader Customization Toolbar */}
        <div className="mb-6 rounded-2xl border border-dharma-border/80 bg-dharma-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-serif font-bold text-dharma-text flex items-center gap-2">
                <span>पूर्ण अध्याय पाठ</span>
                <span className="text-xs font-sans font-normal text-dharma-muted rounded-full bg-dharma-bg px-2.5 py-0.5 border border-dharma-border/60">
                  {filterQuery.trim() ? `${filteredVerses.length} / ${state.verses.length}` : state.verses.length} श्लोक
                </span>
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Continuous Chapter Parayana Button */}
              <button
                type="button"
                onClick={() => {
                  triggerTactileFeedback('selection', 'click');
                  if (parayanaActive) {
                    stopSoundscape();
                    setParayanaActive(false);
                    setActiveRecitingVerse(null);
                    setContinuousParayana(false);
                  } else {
                    setContinuousParayana(true);
                    setParayanaActive(true);
                    const list = filteredVerses.length > 0 ? filteredVerses : state.verses;
                    const startV =
                      (activeRecitingVerse !== null
                        ? list.find((v) => String(v.number) === String(activeRecitingVerse))
                        : null) || list[0];
                    if (startV) {
                      playVerse(startV);
                    }
                  }
                }}
                className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl sm:min-h-0 px-3 py-1.5 text-xs font-semibold transition ${
                  parayanaActive
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/30'
                    : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-amber-300 hover:text-amber-700'
                }`}
                title="सम्पूर्ण अध्याय के श्लोकों का क्रमिक उच्चारण सुनें (Continuous Chapter Recitation)"
                aria-label="अध्याय पारायण"
                aria-pressed={parayanaActive}
              >
                {parayanaActive ? (
                  <Pause className="h-3.5 w-3.5 text-white" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 text-amber-600" />
                )}
                <span className="hidden sm:inline">
                  {parayanaActive && activeRecitingVerse !== null
                    ? `पारायण (${toDevanagari(activeRecitingVerse)})`
                    : 'अध्याय पारायण'}
                </span>
              </button>

              {/* Resume In-Progress Bookmark Pill */}
              {resumeVerse && !parayanaActive && (
                <button
                  type="button"
                  onClick={() => {
                    triggerTactileFeedback('selection', 'click');
                    setContinuousParayana(true);
                    setParayanaActive(true);
                    const list = filteredVerses.length > 0 ? filteredVerses : state.verses;
                    const targetV = list.find((v) => String(v.number) === String(resumeVerse)) || list[0];
                    if (targetV) playVerse(targetV);
                  }}
                  className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl sm:min-h-0 border border-amber-400/80 bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-200 transition hover:bg-amber-500/25 active:scale-95"
                  title={`श्लोक ${resumeVerse} से आगे पारायण जारी रखें`}
                  aria-label={`श्लोक ${resumeVerse} से आगे`}
                >
                  <Play className="h-3 w-3 text-amber-600 dark:text-amber-400 fill-current" />
                  <span>{toDevanagari(resumeVerse)} से आगे</span>
                </button>
              )}

              {/* Bilingual Cadence Mode Selector */}
              <div
                className="inline-flex items-center rounded-xl border border-dharma-border bg-dharma-bg p-0.5 text-xs font-semibold text-dharma-text"
                role="radiogroup"
                aria-label="पारायण वाचन शैली (Recitation cadence mode)"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={cadenceMode === 'sanskrit_only'}
                  onClick={() => setParayanaCadenceMode('sanskrit_only')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    cadenceMode === 'sanskrit_only'
                      ? 'bg-dharma-card text-saffron-700 dark:text-saffron-300 font-bold shadow-sm'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="केवल मूल संस्कृत श्लोक पाठ (Sanskrit Only)"
                >
                  संस्कृत
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={cadenceMode === 'sanskrit_hindi'}
                  onClick={() => setParayanaCadenceMode('sanskrit_hindi')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    cadenceMode === 'sanskrit_hindi'
                      ? 'bg-dharma-card text-saffron-700 dark:text-saffron-300 font-bold shadow-sm'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="संस्कृत श्लोक + संक्षिप्त हिन्दी भावार्थ (Sanskrit + Hindi)"
                >
                  + हिन्दी
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={cadenceMode === 'sanskrit_english'}
                  onClick={() => setParayanaCadenceMode('sanskrit_english')}
                  className={`rounded-lg px-2.5 py-1 transition ${
                    cadenceMode === 'sanskrit_english'
                      ? 'bg-dharma-card text-saffron-700 dark:text-saffron-300 font-bold shadow-sm'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="संस्कृत श्लोक + English Translation (Sanskrit + English)"
                >
                  + Eng
                </button>
              </div>

              {/* Chanting Mode Toggle */}
              <button
                type="button"
                onClick={() => setChantingMode(!chantingMode)}
                className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl sm:min-h-0 px-3 py-1.5 text-xs font-semibold transition ${
                  chantingMode
                    ? 'bg-saffron-600 text-white shadow-sm ring-2 ring-saffron-400/30'
                    : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-300 hover:text-saffron-700'
                }`}
                title="केवल मूल संस्कृत श्लोक पाठ के लिए स्वाध्याय मोड ऑन/ऑफ करें"
                aria-label="स्वाध्याय मोड"
                aria-pressed={chantingMode}
              >
                <Flame className={`h-3.5 w-3.5 ${chantingMode ? 'text-white' : 'text-saffron-600'}`} />
                <span className="hidden sm:inline">स्वाध्याय मोड</span>
              </button>

              {/* Focus Mode Button */}
              <button
                type="button"
                onClick={() => {
                  setFocusVerseIndex(0);
                  setFocusModeOpen(true);
                  triggerTactileFeedback('medium', 'click');
                }}
                className="inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl sm:min-h-0 border border-dharma-border bg-dharma-bg px-3 py-1.5 text-xs font-semibold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700 active:scale-95"
                title="एक-एक श्लोक स्वाध्याय के लिए एकाग्रता मोड खोलें (Focus Mode)"
                aria-label="एकाग्रता मोड"
              >
                <Maximize2 className="h-3.5 w-3.5 text-amber-600" />
                <span className="hidden sm:inline">एकाग्रता मोड</span>
              </button>

              {/* Ekāgratā Spotlight Toggle */}
              <button
                type="button"
                onClick={() => {
                  const next = !ekagrataMode;
                  setEkagrataMode(next);
                  triggerTactileFeedback('medium', 'softTap');
                  window.dispatchEvent(new CustomEvent('dharma:ekagrata-toggle', { detail: { active: next } }));
                  try {
                    localStorage.setItem('dharma_ekagrata_mode', JSON.stringify(next));
                  } catch {}
                }}
                className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl sm:min-h-0 px-3 py-1.5 text-xs font-semibold transition ${
                  ekagrataMode
                    ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                    : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-amber-400 hover:text-amber-700'
                }`}
                title="सक्रिय श्लोक पर एकाग्र ध्यान (Spotlight Focus)"
                aria-label="एकाग्रता स्पॉटलाइट"
                aria-pressed={ekagrataMode}
              >
                <Target className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">स्पॉटलाइट</span>
              </button>

              {/* Font Size Selector */}
              <div className="inline-flex items-center rounded-xl border border-dharma-border bg-dharma-bg p-0.5 text-xs font-semibold text-dharma-text">
                <button
                  type="button"
                  onClick={() => updateFontSize('normal')}
                  className={`min-h-[36px] min-w-[36px] rounded-lg px-2.5 py-1 transition sm:min-h-0 sm:min-w-0 ${
                    fontSize === 'normal'
                      ? 'bg-dharma-card text-saffron-700 shadow-sm font-bold'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="सामान्य अक्षर (Normal font size)"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => updateFontSize('large')}
                  className={`min-h-[36px] min-w-[36px] rounded-lg px-2.5 py-1 transition sm:min-h-0 sm:min-w-0 ${
                    fontSize === 'large'
                      ? 'bg-dharma-card text-saffron-700 shadow-sm font-bold'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="बड़े अक्षर (Large font size)"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => updateFontSize('xl')}
                  className={`min-h-[36px] min-w-[36px] rounded-lg px-2.5 py-1 transition sm:min-h-0 sm:min-w-0 ${
                    fontSize === 'xl'
                      ? 'bg-dharma-card text-saffron-700 shadow-sm font-bold'
                      : 'text-dharma-muted hover:text-dharma-text'
                  }`}
                  title="विशाल अक्षर (Extra large font size)"
                >
                  A++
                </button>
              </div>

              {/* Reading depth: Read / Understand / Study */}
              {!chantingMode && <ReadingDepthSwitch />}

              {/* Layer Toggles (Hidden in chanting mode) */}
              {!chantingMode && (
                <div className="relative" ref={layersMenuRef}>
                  <button
                    type="button"
                    ref={layersTriggerRef}
                    onClick={() => setShowLayersMenu(!showLayersMenu)}
                    className={`inline-flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl sm:min-h-0 border px-3 py-1.5 text-xs font-semibold transition ${
                      showLayersMenu || (!showTranslit || !showHindi || !showEnglish || !showCommentary)
                        ? 'border-saffron-300 bg-saffron-50 text-saffron-800'
                        : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-300'
                    }`}
                    title="भाषा व व्याख्या विकल्प"
                    aria-label="दृश्य — भाषा व व्याख्या विकल्प"
                    aria-expanded={showLayersMenu}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-saffron-600" />
                    <span className="hidden sm:inline">दृश्य</span>
                  </button>

                  {showLayersMenu && (
                    <div className="absolute right-0 top-full mt-2 z-20 w-48 rounded-xl border border-dharma-border bg-dharma-card p-2.5 shadow-xl">
                      <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                        सामग्री चयन
                      </p>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-bg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showTranslit}
                            onChange={(e) => updateLayers({ translit: e.target.checked })}
                            className="rounded text-saffron-600 focus:ring-saffron-500"
                          />
                          <span>लिप्यंतरण (Translit)</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-bg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showHindi}
                            onChange={(e) => updateLayers({ hindi: e.target.checked })}
                            className="rounded text-saffron-600 focus:ring-saffron-500"
                          />
                          <span>हिन्दी अर्थ</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-bg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showEnglish}
                            onChange={(e) => updateLayers({ english: e.target.checked })}
                            className="rounded text-saffron-600 focus:ring-saffron-500"
                          />
                          <span>English Translation</span>
                        </label>
                        <label className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-medium text-dharma-text hover:bg-dharma-bg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={showCommentary}
                            onChange={(e) => updateLayers({ commentary: e.target.checked })}
                            className="rounded text-saffron-600 focus:ring-saffron-500"
                          />
                          <span>विस्तृत व्याख्या / दृष्टि</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Conversation Mode for Dialogue Scriptures (Bhagavad Gita) */}
              {scriptureId === 'bhagavadgita' && (
                <button
                  type="button"
                  onClick={() => setIsConversationMode(!isConversationMode)}
                  className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition sm:min-h-0 ${
                    isConversationMode
                      ? 'border-saffron-600 bg-saffron-600 text-white shadow-2xs'
                      : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400'
                  }`}
                  title="संवाद स्वरूप (Conversation Mode)"
                  aria-pressed={isConversationMode}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>संवाद स्वरूप</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick in-chapter search & verse jump */}
          <div className="mt-3 pt-3 border-t border-dharma-border/60 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-dharma-muted" />
              <input
                type="text"
                aria-label="श्लोक संख्या या शब्द खोजें (Search verses in this chapter)"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="श्लोक संख्या या शब्द खोजें... (e.g. 5, धर्म, कृष्ण)"
                className="w-full rounded-xl border border-dharma-border/70 bg-dharma-bg/80 pl-8 pr-8 py-1.5 text-xs text-dharma-text placeholder:text-dharma-muted/70 outline-none focus:border-saffron-400 focus:ring-1 focus:ring-saffron-400/20"
              />
              {filterQuery && (
                <button
                  type="button"
                  onClick={() => setFilterQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-dharma-muted hover:text-dharma-text"
                  aria-label="Clear filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {state.verses.length > 5 && (
              <div className="flex items-center gap-1.5 text-xs text-dharma-muted">
                <span className="shrink-0 text-[11px] font-medium">श्लोक पर जाएं:</span>
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      scrollToVerse(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  defaultValue=""
                  aria-label="श्लोक पर सीधे जाएं"
                  className="rounded-lg border border-dharma-border/70 bg-dharma-bg px-2 py-1 text-xs text-dharma-text outline-none focus:border-saffron-400 cursor-pointer"
                >
                  <option value="" disabled>
                    चुनें...
                  </option>
                  {state.verses.map((v) => (
                    <option key={String(v.number)} value={String(v.number)}>
                      श्लोक {toDevanagari(v.number)} ({v.number})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {isConversationMode && scriptureId === 'bhagavadgita' ? (
          <ConversationModeView
            scriptureId={scriptureId}
            chapterId={chapterId}
            verses={state.verses}
            onExitConversationMode={() => setIsConversationMode(false)}
          />
        ) : (
          <div className="space-y-6">
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
              if (!hydrated) {
                return (
                  <VerseText
                    key={`${String(v.number)}-${index}`}
                    verse={v}
                    chapterId={chapterId}
                    href={versePageHref(scriptureId, chapterId, v.number)}
                  />
                );
              }
              const verseKey = canonicalVerseId(chapterId, v.number);
              const verseIdNum = Number(verseKey);
              const comment = state.commentary?.[`${chapterId}:${verseIdNum}`];
              const explanationHi = comment?.explanation;
              const scienceHi = comment?.science;
              const lifeLessonHi = comment?.lifeLesson;
              const explanation = explanationHi ?? v.explanation ?? v.commentary;
              const explanationIsHi = Boolean(explanationHi);
              const science = scienceHi ?? v.science;
              const scienceIsHi = Boolean(scienceHi);
              const lesson = lifeLessonHi ?? v.lifeLesson;
              const lessonIsHi = Boolean(lifeLessonHi);
              const isSpotlighted = !ekagrataMode || (activeRecitingVerse ? String(activeRecitingVerse) === String(v.number) : (currentViewportVerse ? currentViewportVerse === String(v.number) : index === 0));
              return (
                <div
                  key={`${String(v.number)}-${index}`}
                  className={`transition-opacity duration-300 ${!isSpotlighted ? 'opacity-35 hover:opacity-90 focus-within:opacity-100' : 'opacity-100'}`}
                >
                  <VerseCard
                    depth={readingDepth}
                    verse={v}
                    meaning={{
                      isAi: Boolean(comment?.ai),
                      explanation,
                      explanationIsHi,
                      science,
                      scienceIsHi,
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
                    note={getNote(scriptureId, chapterId, v.number)?.text}
                    onSaveNote={(text) => setNote(scriptureId, chapterId, v.number, text)}
                    highlight={getHighlight(scriptureId, chapterId, v.number)?.color}
                    onHighlight={(color) => toggleHighlight(scriptureId, chapterId, v.number, color)}
                    onOpenFocus={() => {
                      setFocusVerseIndex(index);
                      setFocusModeOpen(true);
                    }}
                    versePageHref={versePageHref(scriptureId, chapterId, v.number)}
                    isReciting={String(activeRecitingVerse) === String(v.number)}
                    onPlayRecitation={() => togglePlayVerse(v)}
                    onOpenSvadhyaya={handleOpenSvadhyaya}
                    isActive={index === activeVerseIndex}
                  />
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Adhyāya Sūtra: Desktop Vertical Verse Rail */}
      {hydrated && state.verses.length > 8 && (
        <aside
          aria-label="अध्याय सूत्र - श्लोक पथ"
          className="hidden xl:flex fixed right-3 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1 p-1.5 rounded-full bg-stone-900/75 dark:bg-stone-950/85 backdrop-blur-md border border-amber-500/20 shadow-xl max-h-[70vh] overflow-y-auto no-scrollbar scroll-smooth"
        >
          <span className="text-[9px] font-mono text-amber-500/70 select-none pb-0.5">सूत्र</span>
          {state.verses.map((v) => {
            const isCurrent = currentViewportVerse === String(v.number) || String(activeRecitingVerse) === String(v.number);
            return (
              <button
                key={`rail-${String(v.number)}`}
                type="button"
                onClick={() => scrollToVerse(v.number)}
                title={`श्लोक ${toDevanagari(v.number)} (${v.number})`}
                aria-label={`श्लोक ${v.number}`}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-medium transition-all ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/40 scale-110 font-bold'
                    : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/80 hover:scale-105'
                }`}
              >
                {toDevanagari(v.number)}
              </button>
            );
          })}
        </aside>
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

      {/* Mobile One-Thumb Reader Control Bar (<768px) */}
      {state.kind === 'ready' && state.verses.length > 0 && (
        <MobileOneThumbControlBar
          currentVerseNumber={state.verses[activeVerseIndex]?.number ?? 1}
          totalVerses={state.verses.length}
          currentVerseSanskrit={state.verses[activeVerseIndex]?.sanskrit}
          onPrevVerse={() => {
            const nextIdx = Math.max(0, activeVerseIndex - 1);
            setActiveVerseIndex(nextIdx);
            scrollToVerse(state.verses[nextIdx].number);
          }}
          onNextVerse={() => {
            const nextIdx = Math.min(state.verses.length - 1, activeVerseIndex + 1);
            setActiveVerseIndex(nextIdx);
            scrollToVerse(state.verses[nextIdx].number);
          }}
          activeLayers={{
            translit: showTranslit,
            hindi: showHindi,
            english: showEnglish,
            commentary: showCommentary,
          }}
          onToggleLayer={(layer) => {
            if (layer === 'translit') updateLayers({ translit: !showTranslit });
            if (layer === 'hindi') updateLayers({ hindi: !showHindi });
            if (layer === 'english') updateLayers({ english: !showEnglish });
            if (layer === 'commentary') updateLayers({ commentary: !showCommentary });
          }}
        />
      )}
      {state.source?.repo && (
        <p className="mt-6 text-xs text-dharma-muted text-center">
          स्रोत:{' '}
          <a href={state.source.repo} target="_blank" rel="noopener noreferrer" className="underline">
            {state.source.repo.replace('https://github.com/', '')}
          </a>
          {state.source.fetchedAt && ` · प्राप्त ${new Date(state.source.fetchedAt).toLocaleDateString('hi-IN')}`}
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

      {/* Fullscreen Mobile & Screen Focus Mode */}
      {focusLoaded && (
      <MobileFocusMode
        isOpen={focusModeOpen}
        onClose={() => setFocusModeOpen(false)}
        verses={filteredVerses}
        initialVerseIndex={focusVerseIndex}
        scriptureId={scriptureId}
        scriptureTitle={scriptureTitle ?? scriptureId}
        chapterTitle={chapterTitle ?? `अध्याय ${chapterId}`}
        chapterId={chapterId}
        category={category}
        commentary={state.commentary}
        bookmarkedMap={bookmarkedMap}
        onToggleBookmark={(v) => toggleBookmark(v as FullVerse)}
        onVerseChange={(verseNum) => scrollToVerse(verseNum)}
      />
      )}
    </>
  );
}
