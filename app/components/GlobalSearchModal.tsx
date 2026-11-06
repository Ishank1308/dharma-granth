'use client';

import { Fragment, useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { SPRINGS } from '@/app/components/motion/primitives';
import { SPRING as PALETTE_SPRING } from '@/app/components/liquid/motion';
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Clock,
  Compass,
  FileText,
  Flame,
  HelpCircle,
  Quote,
  RotateCcw,
  ScrollText,
  Search,
  Sparkles,
  Sun,
  Trash2,
  WifiOff,
  X,
} from 'lucide-react';
import {
  SEARCH_GROUPS,
  coreScriptureHint,
  isChapterIndexLoaded,
  isCoreIndexLoaded,
  isVerseIndexLoaded,
  loadChapterIndex,
  loadCoreIndex,
  loadSearchShard,
  loadVerseIndex,
  type ChapterIndex,
  type SearchResultGroup,
  type SearchResultItem,
} from '@/lib/search';
import type { CoreIndexFile, SearchShardFile } from '@/lib/search-core';
import { searchWithIntent } from '@/lib/search-intent';
import type { VerseIndexFile } from '@/lib/search-verse-index';
import { getSearchThemes } from '@/lib/search-themes';
import { findHighlights } from '@/lib/search-highlight';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { reviewStatusForHref } from '@/lib/review-badges';
import { EDITORIAL_DRAFT_LABEL, STUDY_TRANSLATION_SHORT } from '@/lib/editorial-terminology';
import { REVIEW_RECORDS } from '@/data/review-records';
import { useTheme } from '@/app/components/ThemeProvider';
import {
  setSoundscapeTrack,
  toggleSoundscape,
  strikeTempleBell,
  getSoundscapeState,
} from '@/lib/sacred-soundscape';
import { triggerPranaToast } from '@/lib/prana-capsule-store';
import { executeSearchWithWorker } from '@/lib/workers/search-worker-client';
import { useConnectivity } from '@/lib/useConnectivity';

export type { SearchResultItem } from '@/lib/search';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Prefills the search box when the dialog opens (e.g. from the home hero). */
  initialQuery?: string;
}

const RECENT_KEY = 'dharma-search-recent-v2';
const NO_RECENT: string[] = [];
const MAX_RECENT = 8;
const RESULT_LIMIT = 40;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/* ── Index loading ───────────────────────────────────────────────────────
   Both indexes are fetched the first time search opens and shared across
   opens. A failed fetch is forgotten so the next open (or "Try again") retries. */

type LoadState = 'idle' | 'loading' | 'ready' | 'error';

let chapterIndexRequest: Promise<void> | null = null;
let verseIndexRequest: Promise<void> | null = null;

function ensureChapterIndex(): Promise<void> {
  if (isChapterIndexLoaded()) return Promise.resolve();
  if (!chapterIndexRequest) {
    chapterIndexRequest = fetch(`${BASE_PATH}/chapter-index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`chapter index: HTTP ${res.status}`);
        return res.json() as Promise<ChapterIndex>;
      })
      .then(loadChapterIndex)
      .catch((err) => {
        chapterIndexRequest = null;
        // Search still works without chapter titles, so this is not surfaced.
        console.warn('[search] chapter index unavailable:', err);
      });
  }
  return chapterIndexRequest;
}

let coreIndexRequest: Promise<void> | null = null;

function ensureCoreIndex(): Promise<void> {
  if (isCoreIndexLoaded()) return Promise.resolve();
  if (!coreIndexRequest) {
    coreIndexRequest = fetch(`${BASE_PATH}/search/core-index.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`core index: HTTP ${res.status}`);
        return res.json() as Promise<CoreIndexFile>;
      })
      .then(loadCoreIndex)
      .catch((err) => {
        coreIndexRequest = null;
        console.warn('[search] core index unavailable:', err);
      });
  }
  return coreIndexRequest;
}

function ensureVerseIndex(): Promise<void> {
  if (isVerseIndexLoaded()) return Promise.resolve();
  if (!verseIndexRequest) {
    verseIndexRequest = fetch(`${BASE_PATH}/search-index/verses.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`verse index: HTTP ${res.status}`);
        return res.json() as Promise<VerseIndexFile>;
      })
      .then(loadVerseIndex)
      .catch((err) => {
        verseIndexRequest = null;
        throw err;
      });
  }
  return verseIndexRequest;
}

/**
 * Fire-and-forget index warmup for search-button hover/focus (SiteNav).
 * Opening the modal starts the same fetches; warming only moves them earlier.
 * Safe to call repeatedly: each index fetches at most once (see ensure* above).
 */
export function warmSearchIndexes(): void {
  void ensureChapterIndex();
  void ensureCoreIndex();
  void ensureVerseIndex().catch(() => {});
}

/* ── Suggestions ─────────────────────────────────────────────────────── */

const SUGGESTED_SEARCHES = [
  { label: 'कर्मण्येवाधिकारस्ते', query: 'कर्मण्येवाधिकारस्ते' },
  { label: 'karmanye vadhikaraste', query: 'karmanye vadhikaraste' },
  { label: 'Bhagavad Gita 2.47', query: 'Bhagavad Gita 2.47' },
  { label: 'Gita chapter 2 verse 47', query: 'Gita chapter 2 verse 47' },
  { label: 'fear · भय', query: 'fear' },
  { label: 'verses about anger', query: 'verses about anger' },
  { label: 'Tat Tvam Asi', query: 'Tat Tvam Asi' },
  { label: 'meaning of life', query: 'meaning of life' },
];

export interface SacredActionItem {
  id: string;
  command: string;
  title: string;
  titleHi: string;
  subtitle: string;
  icon: string;
  run: (onClose: () => void, router: ReturnType<typeof useRouter>, cycleTheme?: () => void) => void;
}

export const SACRED_ACTIONS: SacredActionItem[] = [
  {
    id: 'tanpura',
    command: '> tanpura',
    title: 'Play Vedic Tanpura Drone (432Hz)',
    titleHi: 'वैदिक तन्पूरा नाद प्रारंभ करें (432Hz)',
    subtitle: 'Procedural 432Hz Tanpura Drone · Web Audio',
    icon: '🎶',
    run: (onClose) => {
      setSoundscapeTrack('tanpura');
      if (!getSoundscapeState().isPlaying) toggleSoundscape();
      triggerPranaToast({ message: 'वैदिक तन्पूरा सक्रिय (432Hz) · Tanpura Drone Playing', icon: '🎶' });
      onClose();
    },
  },
  {
    id: 'om',
    command: '> om',
    title: 'Play Om Resonance (108Hz)',
    titleHi: 'प्रणव ॐ नाद प्रारंभ करें (108Hz)',
    subtitle: 'Deep Contemplative 108Hz Soundscape',
    icon: '🕉️',
    run: (onClose) => {
      setSoundscapeTrack('om');
      if (!getSoundscapeState().isPlaying) toggleSoundscape();
      triggerPranaToast({ message: 'प्रणव ॐ नाद सक्रिय (108Hz) · Om Resonance Playing', icon: '🕉️' });
      onClose();
    },
  },
  {
    id: 'bell',
    command: '> bell',
    title: 'Ring Mindfulness Singing Bowl Now (बजाएँ)',
    titleHi: 'शांति घंटा नाद · Pause & Breathe',
    subtitle: 'Mindfulness Singing Bowl Soundscape',
    icon: '🔔',
    run: (onClose) => {
      strikeTempleBell(1);
      triggerPranaToast({ message: 'शांति एवं सजगता · Pause & Breathe 🔔', icon: '🔔' });
      onClose();
    },
  },
  {
    id: 'meditation',
    command: '> meditation',
    title: 'Start 10-Minute Meditation Timer',
    titleHi: '10 मिनट ध्यान साधना प्रारंभ करें',
    subtitle: 'Timed Silent Meditation with Bells & Wake-Lock',
    icon: '🧘',
    run: (onClose, router) => {
      router.push('/practice#meditation');
      triggerPranaToast({ message: 'ध्यान साधना प्रारंभ · 10-Minute Meditation Timer', icon: '🧘' });
      onClose();
    },
  },
  {
    id: 'theme',
    command: '> theme',
    title: 'Switch Theme: Day / Sunset / Paper / Dark / Follow Sun (सौर चक्र)',
    titleHi: 'पठन शैली / सौर चक्र बदलें',
    subtitle: 'Cycle through sacred reading themes',
    icon: '🌓',
    run: (onClose, _r, cycleTheme) => {
      if (cycleTheme) cycleTheme();
      triggerPranaToast({ message: 'थीम परिवर्तित · Theme updated', icon: '🌓' });
      onClose();
    },
  },
  {
    id: 'resume',
    command: '> resume',
    title: 'Resume Last Read Verse',
    titleHi: 'अंतिम पठित श्लोक से पुनः प्रारंभ करें',
    subtitle: 'Jump directly to your last bookmark',
    icon: '📖',
    run: (onClose, router) => {
      try {
        const raw = localStorage.getItem('dharma_parayana_progress');
        if (raw) {
          const p = JSON.parse(raw);
          if (p.scriptureSlug && p.chapterNumber) {
            router.push(`/scripture/${p.scriptureSlug}/chapter/${p.chapterNumber}/#verse-${p.verseNumber || 1}`);
            triggerPranaToast({ message: `श्लोक ${p.verseNumber || 1} से आगे · Resuming reading`, icon: '📖' });
            onClose();
            return;
          }
        }
      } catch {}
      router.push('/scripture/bhagavadgita/chapter/2/#verse-47');
      triggerPranaToast({ message: 'गीता 2.47 से प्रारंभ · Resumed reading', icon: '📖' });
      onClose();
    },
  },
];

/* ── Presentation helpers ────────────────────────────────────────────── */

function groupIcon(group: SearchResultGroup) {
  const cls = 'h-4 w-4 shrink-0';
  switch (group) {
    case 'verse':
      return <Quote className={`${cls} text-amber-500`} aria-hidden="true" />;
    case 'scripture':
      return <BookOpen className={`${cls} text-orange-500`} aria-hidden="true" />;
    case 'chapter':
      return <BookMarked className={`${cls} text-yellow-600 dark:text-yellow-400`} aria-hidden="true" />;
    case 'concept':
      return <Flame className={`${cls} text-rose-500`} aria-hidden="true" />;
    case 'topic':
      return <Compass className={`${cls} text-emerald-600 dark:text-emerald-400`} aria-hidden="true" />;
    case 'commentary':
      return <ScrollText className={`${cls} text-indigo-500 dark:text-indigo-400`} aria-hidden="true" />;
    case 'learning':
      return <Sparkles className={`${cls} text-purple-500 dark:text-purple-400`} aria-hidden="true" />;
    case 'practice':
      return <Sun className={`${cls} text-amber-500`} aria-hidden="true" />;
    default:
      return <FileText className={`${cls} text-tint`} aria-hidden="true" />;
  }
}

function reasonClass(reason: string) {
  if (reason.startsWith('Exact reference')) return 'border-emerald-600/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200';
  if (reason.includes('typo') || reason.startsWith('Showing results')) return 'border-sky-600/30 bg-sky-500/10 text-sky-900 dark:text-sky-200';
  if (reason.startsWith('Cited in') || reason.startsWith('Matches “')) return 'border-rose-600/30 bg-rose-500/10 text-rose-900 dark:text-rose-200';
  return 'border-separator bg-fill-quaternary text-label-secondary';
}

/** Highlights the matching words. Whole words only, so Devanagari conjuncts and vowel signs are never split. */
function Highlighted({ text, query }: { text: string; query: string }): ReactNode {
  const spans = findHighlights(text, query);
  if (spans.length === 0) return text;
  const out: ReactNode[] = [];
  let at = 0;
  spans.forEach(([start, end], i) => {
    if (start > at) out.push(<Fragment key={`t${i}`}>{text.slice(at, start)}</Fragment>);
    out.push(
      <mark key={`m${i}`} className="rounded-[3px] bg-amber-400/25 text-inherit font-medium dark:bg-amber-400/30">
        {text.slice(start, end)}
      </mark>,
    );
    at = end;
  });
  if (at < text.length) out.push(<Fragment key="tail">{text.slice(at)}</Fragment>);
  return out;
}

const isDevanagariText = (s: string) => /[ऀ-ॿ]/.test(s);

/** Type that suits the script of the matched text; Devanagari gets generous leading and no tracking. */
function matchedTextStyle(item: SearchResultItem): { lang: string; className: string } {
  const text = item.matchingText || item.title;
  const field = item.matchedField;
  if (field === 'roman') return { lang: 'sa-Latn', className: 'font-serif text-body italic leading-relaxed text-label-primary' };
  if (field === 'english') return { lang: 'en', className: 'font-serif text-body leading-relaxed text-label-primary' };
  if (field === 'hindi' || (field === 'explanation' && isDevanagariText(text))) {
    return { lang: 'hi', className: 'font-devanagari text-[1.0625rem] leading-[1.9] text-label-primary' };
  }
  if (isDevanagariText(text)) return { lang: 'sa', className: 'font-devanagari text-lg font-semibold leading-[1.85] text-label-primary' };
  return { lang: 'en', className: 'text-body font-semibold leading-relaxed text-label-primary' };
}

const TOPIC_TINTS = [
  'border-rose-500/25 bg-rose-500/5 hover:border-rose-500/40 hover:bg-rose-500/10',
  'border-teal-500/25 bg-teal-500/5 hover:border-teal-500/40 hover:bg-teal-500/10',
  'border-amber-500/25 bg-amber-500/5 hover:border-amber-500/40 hover:bg-amber-500/10',
  'border-indigo-500/25 bg-indigo-500/5 hover:border-indigo-500/40 hover:bg-indigo-500/10',
  'border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/40 hover:bg-emerald-500/10',
  'border-sky-500/25 bg-sky-500/5 hover:border-sky-500/40 hover:bg-sky-500/10',
];

/* ── Component ───────────────────────────────────────────────────────── */

export function GlobalSearchModal({ isOpen, onClose, initialQuery = '' }: Props) {
  const router = useRouter();
  const { cycleTheme } = useTheme();
  const reduce = useReducedMotion();
  const listboxId = useId();
  const statusId = useId();

  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<SearchResultGroup | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isOnline = useConnectivity();
  const [chaptersReady, setChaptersReady] = useState(isChapterIndexLoaded);
  const [coreReady, setCoreReady] = useState(isCoreIndexLoaded);
  const [shardToken, setShardToken] = useState('');
  const [verseState, setVerseState] = useState<LoadState>(isVerseIndexLoaded() ? 'ready' : 'idle');
  const [recentRaw, setRecent] = useLocalStorage<string[]>(RECENT_KEY, NO_RECENT);
  const recent = Array.isArray(recentRaw) ? recentRaw.filter((r) => typeof r === 'string') : NO_RECENT;

  const inputRef = useRef<HTMLInputElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Typing stays responsive: results follow a deferred copy of the query.
  const deferredQuery = useDeferredValue(query);
  const trimmed = deferredQuery.trim();
  const isStale = query !== deferredQuery;

  const isActionQuery = trimmed.startsWith('>');
  const actionFilter = isActionQuery ? trimmed.slice(1).trim().toLowerCase() : '';
  const matchingActions = useMemo(() => {
    if (!isActionQuery) return [];
    if (!actionFilter) return SACRED_ACTIONS;
    return SACRED_ACTIONS.filter(
      (a) =>
        a.command.toLowerCase().includes(actionFilter) ||
        a.title.toLowerCase().includes(actionFilter) ||
        a.titleHi.toLowerCase().includes(actionFilter)
    );
  }, [isActionQuery, actionFilter]);

  useEffect(() => {
    if (!isOpen || chaptersReady) return;
    let cancelled = false;
    ensureChapterIndex().then(() => {
      if (!cancelled && isChapterIndexLoaded()) setChaptersReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, chaptersReady]);

  useEffect(() => {
    if (!isOpen || coreReady) return;
    let cancelled = false;
    ensureCoreIndex().then(() => {
      if (!cancelled && isCoreIndexLoaded()) setCoreReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [isOpen, coreReady]);

  const scriptureHint = coreScriptureHint(trimmed);
  useEffect(() => {
    if (!coreReady || !scriptureHint || scriptureHint === shardToken) return;
    let cancelled = false;
    fetch(`${BASE_PATH}/search/shards/${scriptureHint}.json`)
      .then((res) => (res.ok ? (res.json() as Promise<SearchShardFile>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        loadSearchShard(data);
        setShardToken(scriptureHint);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [coreReady, scriptureHint, shardToken]);

  // Verse text: loaded when the dialog opens, retried when "Try again" resets the state to idle.
  // No cancel-on-cleanup here: setting 'loading' re-runs this effect, and a cleanup flag would
  // swallow the 'ready' that follows, leaving search stuck on "Loading verse text…".
  useEffect(() => {
    if (!isOpen || verseState !== 'idle') return;
    setVerseState('loading');
    ensureVerseIndex()
      .then(() => setVerseState('ready'))
      .catch((err) => {
        console.warn('[search] verse index unavailable:', err);
        setVerseState('error');
      });
  }, [isOpen, verseState]);

  // Reset and focus on open.
  useEffect(() => {
    if (!isOpen) return;
    setQuery(initialQuery);
    setSelectedGroup(null);
    setSelectedIndex(0);
    inputRef.current?.focus();
    const t = setTimeout(() => {
      const input = inputRef.current;
      if (!input) return;
      input.focus();
      input.setSelectionRange(input.value.length, input.value.length);
    }, 40);
    return () => clearTimeout(t);
  }, [isOpen, initialQuery]);

  // Return focus to whatever opened the dialog.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      if (opener && opener !== document.body && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const verseReady = verseState === 'ready';
  const result = useMemo(
    () => (trimmed ? searchWithIntent(trimmed, { group: selectedGroup, limit: RESULT_LIMIT }) : null),
    // The indexes arrive after the dialog opens; searching again when they do fills in verses and chapters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trimmed, selectedGroup, chaptersReady, verseReady, coreReady, shardToken],
  );

  // Results in the order they are shown (by group), so the arrow keys follow what the eye sees.
  const display = useMemo(() => {
    if (!result) return [] as SearchResultItem[];
    return SEARCH_GROUPS.flatMap((g) => result.results.filter((r) => r.group === g.id));
  }, [result]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [display]);

  useEffect(() => {
    if (!isOpen || display.length === 0) return;
    document.getElementById(`search-item-${selectedIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, isOpen, display]);

  const remember = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      setRecent((prev) => [clean, ...(Array.isArray(prev) ? prev : []).filter((r) => r !== clean)].slice(0, MAX_RECENT));
    },
    [setRecent],
  );

  const runSearch = (text: string) => {
    setQuery(text);
    remember(text);
    inputRef.current?.focus();
  };

  const openFromKeyboard = (item: SearchResultItem) => {
    remember(query);
    onClose();
    router.push(item.href);
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      const win = windowRef.current;
      if (!win) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const focusable = Array.from(
        win.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => el.offsetParent !== null);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !win.contains(active);
      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    // Enter and arrows while a Hindi/Devanagari IME is composing pick a candidate; they must not navigate.
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'ArrowDown') {
      if (isActionQuery && matchingActions.length > 0) {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % matchingActions.length);
        return;
      }
      if (display.length > 0) {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % display.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (isActionQuery && matchingActions.length > 0) {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + matchingActions.length) % matchingActions.length);
        return;
      }
      if (display.length > 0) {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + display.length) % display.length);
      }
    } else if (e.key === 'Home' && display.length > 0 && e.ctrlKey) {
      e.preventDefault();
      setSelectedIndex(0);
    } else if (e.key === 'End' && display.length > 0 && e.ctrlKey) {
      e.preventDefault();
      setSelectedIndex(display.length - 1);
    } else if (e.key === 'Enter') {
      if (isActionQuery && matchingActions.length > 0) {
        e.preventDefault();
        const action = matchingActions[selectedIndex % matchingActions.length] || matchingActions[0];
        action.run(onClose, router, cycleTheme);
        return;
      }
      if (display[selectedIndex]) {
        e.preventDefault();
        openFromKeyboard(display[selectedIndex]);
      } else if (trimmed) {
        remember(trimmed);
      }
    }
  };

  const studyTopics = useMemo(
    () =>
      getSearchThemes()
        .slice(0, 6)
        .map((t, i) => ({ name: t.name, nameHi: t.nameHi, blurb: t.topic.shortDescEn, tint: TOPIC_TINTS[i % TOPIC_TINTS.length] })),
    [],
  );

  const counts = result?.groupCounts ?? {};
  const shownGroups = SEARCH_GROUPS.filter((g) => (counts[g.id] ?? 0) > 0);
  const suggestion = result?.suggestion && result.suggestion.toLowerCase() !== trimmed.toLowerCase() ? result.suggestion : null;
  const verseLoading = verseState === 'loading' || verseState === 'idle';
  // Nothing found yet, but the verse text (the largest index, so the last to arrive) is still
  // on its way: say so rather than "No results".
  const waitingForIndex = !!result && result.totalMatches === 0 && verseLoading && isOnline !== false;

  // What a screen reader hears; it follows the deferred query, so it does not chatter on every keystroke.
  const announcement = !trimmed
    ? 'Search is ready. Type to search scriptures, verses, topics and practices.'
    : isStale || waitingForIndex
      ? 'Searching…'
      : result && result.totalMatches > 0
        ? `${result.totalMatches} result${result.totalMatches === 1 ? '' : 's'} for ${trimmed}. ${shownGroups
            .map((g) => `${counts[g.id]} ${g.label}`)
            .join(', ')}.${verseLoading ? ' Verse text is still loading.' : ''}`
        : `No results for ${trimmed}.${suggestion ? ` Did you mean ${suggestion}?` : ''}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="global-search"
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:p-12"
          role="dialog"
          aria-modal="true"
          aria-label="Global Search"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
            className="fixed inset-0 bg-black/45 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={reduce ? { duration: 0 } : PALETTE_SPRING}
            ref={windowRef}
            className="liquid-glass relative z-10 flex max-h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-panel shadow-2xl"
          >
            {/* Search box */}
            <div className="flex items-center border-b border-separator px-4 py-3 sm:px-6">
              <Search className={`mr-3.5 h-5 w-5 shrink-0 ${isStale ? 'animate-pulse text-amber-500' : 'text-tint'}`} aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search Gita 2.47, कर्म, fear, or type > for actions…"
                aria-label="Search scriptures, verses, topics and practices"
                aria-describedby={statusId}
                className="min-h-[44px] min-w-0 flex-1 bg-transparent text-title-3 font-normal text-label-primary outline-none placeholder:text-label-tertiary sm:text-title-2"
                role="combobox"
                aria-expanded={display.length > 0}
                aria-autocomplete="list"
                aria-controls={listboxId}
                aria-activedescendant={display.length > 0 ? `search-item-${selectedIndex}` : undefined}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                enterKeyHint="search"
              />
              <div className="ml-2 flex shrink-0 items-center gap-2">
                {isOnline === false && (
                  <span className="inline-flex items-center gap-1 rounded-pill border border-amber-600/30 bg-amber-500/10 px-2.5 py-0.5 text-caption font-medium text-amber-900 dark:text-amber-200">
                    <WifiOff className="h-3 w-3" aria-hidden="true" />
                    <span className="hidden sm:inline">Offline</span>
                  </span>
                )}
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      inputRef.current?.focus();
                    }}
                    className="focus-ring flex h-8 w-8 items-center justify-center rounded-control text-label-tertiary hover:bg-fill-quaternary hover:text-label-primary transition"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onClose}
                    className="focus-ring hidden min-h-[32px] rounded-control border border-separator bg-fill-quaternary px-2 text-caption font-mono font-medium text-label-secondary hover:text-label-primary hover:bg-fill-tertiary transition sm:inline-block"
                    aria-label="Close search"
                  >
                    ESC
                  </button>
                )}
              </div>
            </div>

            {/* Filters: which group of results to show */}
            {result && result.totalMatches > 0 && (
              <div role="group" aria-label="Show results from" className="flex items-center gap-1.5 overflow-x-auto border-b border-separator bg-surface-canvas/60 px-4 py-2 text-footnote">
                <button
                  type="button"
                  aria-pressed={selectedGroup === null}
                  onClick={() => setSelectedGroup(null)}
                  className={`focus-ring inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-pill px-3.5 text-footnote font-semibold transition ${
                    selectedGroup === null
                      ? 'bg-tint text-on-tint shadow-xs'
                      : 'border border-separator bg-surface-raised text-label-secondary hover:bg-fill-quaternary hover:text-label-primary'
                  }`}
                >
                  All ({Object.values(counts).reduce((n, c) => n + (c ?? 0), 0)})
                </button>
                {shownGroups.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    aria-pressed={selectedGroup === g.id}
                    onClick={() => setSelectedGroup((prev) => (prev === g.id ? null : g.id))}
                    className={`focus-ring inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-pill px-3.5 text-footnote font-semibold transition ${
                      selectedGroup === g.id
                        ? 'bg-tint text-on-tint shadow-xs'
                        : 'border border-separator bg-surface-raised text-label-secondary hover:bg-fill-quaternary hover:text-label-primary'
                    }`}
                  >
                    {groupIcon(g.id)}
                    <span>
                      <span lang="hi" className="font-devanagari">{g.hindiLabel}</span> · {g.label}
                    </span>
                    <span className="font-mono text-caption opacity-80">{counts[g.id]}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Notices: offline, loading, load failure, did-you-mean */}
            {isOnline === false && (
              <div role="status" className="flex items-start gap-2 border-b border-amber-600/20 bg-amber-500/10 px-4 py-2.5 text-footnote text-amber-950 dark:text-amber-100">
                <WifiOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>
                  <strong className="font-semibold">You are offline.</strong>{' '}
                  {verseReady
                    ? 'Search still works: verse text has already been downloaded.'
                    : 'Titles, topics and references still work, but verse text could not be loaded. It will load when you reconnect.'}
                </p>
              </div>
            )}
            {isOnline && verseState === 'error' && (
              <div role="alert" className="flex items-center justify-between gap-3 border-b border-rose-600/20 bg-rose-500/10 px-4 py-2.5 text-footnote text-rose-950 dark:text-rose-100">
                <p>Verse text could not be loaded, so results show titles, topics and references only.</p>
                <button
                  type="button"
                  onClick={() => setVerseState('idle')}
                  className="focus-ring inline-flex min-h-[32px] shrink-0 items-center gap-1.5 rounded-pill bg-rose-600 px-3 text-footnote font-semibold text-white hover:bg-rose-700"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Try again
                </button>
              </div>
            )}
            {suggestion && (
              <div className="flex items-center justify-between gap-3 border-b border-separator bg-tint-fill px-4 py-2.5 text-footnote text-label-primary">
                <p className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 shrink-0 text-tint" aria-hidden="true" />
                  <span>
                    Did you mean <strong className="font-semibold underline underline-offset-2">{suggestion}</strong>?
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => runSearch(suggestion)}
                  className="focus-ring min-h-[32px] shrink-0 rounded-pill bg-tint px-3 text-footnote font-semibold text-on-tint hover:opacity-90"
                >
                  Search this instead
                </button>
              </div>
            )}
            {result?.intentNote && (
              <p role="status" className="border-b border-separator bg-tint-fill px-4 py-2 text-footnote text-label-primary">
                {result.intentNote}
              </p>
            )}
            {!suggestion && result?.isTypoCorrected && result.totalMatches > 0 && (
              <p role="status" className="border-b border-separator bg-surface-canvas/60 px-4 py-2 text-footnote text-label-secondary">
                No exact match, so these are the closest to your spelling.
              </p>
            )}

            {/* Screen-reader announcements */}
            <div id={statusId} role="status" aria-live="polite" className="sr-only">
              {announcement}
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3 sm:p-5">
              {isActionQuery ? (
                <div className="space-y-3 py-1">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="flex items-center gap-1.5 text-footnote font-semibold text-tint">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>पवित्र क्रियाएँ · Sacred Actions</span>
                    </h3>
                    <span className="text-caption font-mono text-label-tertiary">Use ↑↓ and Enter</span>
                  </div>
                  {matchingActions.length === 0 ? (
                    <p className="p-4 text-center text-subhead text-label-secondary">
                      No matching actions found for &ldquo;{actionFilter}&rdquo;. Try <code className="text-tint">&gt; tanpura</code>, <code className="text-tint">&gt; bell</code>, or <code className="text-tint">&gt; meditation</code>.
                    </p>
                  ) : (
                    <ul className="grid gap-2">
                      {matchingActions.map((action, idx) => (
                        <li key={action.id}>
                          <button
                            type="button"
                            onClick={() => action.run(onClose, router, cycleTheme)}
                            className={`focus-ring w-full text-left p-3.5 rounded-card border transition flex items-center justify-between gap-3 ${
                              idx === selectedIndex % matchingActions.length
                                ? 'border-tint/60 bg-tint-fill ring-1 ring-tint/30'
                                : 'border-separator bg-surface-raised hover:bg-fill-quaternary'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-control bg-fill-tertiary text-2xl">
                                {action.icon}
                              </span>
                              <div>
                                <p className="text-subhead font-semibold text-label-primary">{action.title}</p>
                                <p className="text-caption text-label-secondary">{action.titleHi} · {action.subtitle}</p>
                              </div>
                            </div>
                            <span className="rounded-control border border-separator bg-fill-quaternary px-2 py-1 font-mono text-caption font-semibold text-tint">
                              {action.command}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : !trimmed ? (
                <div className="space-y-6 py-1">
                  {/* Sacred Quick Actions row */}
                  <section aria-label="Sacred Quick Actions">
                    <div className="mb-2 flex items-center justify-between px-1">
                      <h3 className="flex items-center gap-1.5 text-footnote font-semibold text-tint">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span lang="hi" className="font-devanagari normal-case tracking-normal">पवित्र क्रियाएँ</span> · Sacred Actions ({'>'})
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SACRED_ACTIONS.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => a.run(onClose, router, cycleTheme)}
                          className="focus-ring flex items-center gap-2.5 p-2.5 rounded-card border border-separator bg-surface-raised hover:bg-fill-quaternary hover:border-tint/40 active:scale-97 text-left transition"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-control bg-fill-tertiary text-base">
                            {a.icon}
                          </span>
                          <span className="truncate text-footnote font-medium text-label-primary">{a.title}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                  {recent.length > 0 && (
                    <section aria-labelledby={`${listboxId}-recent`}>
                      <div className="mb-2 flex items-center justify-between px-1">
                        <h3 id={`${listboxId}-recent`} className="flex items-center gap-1.5 text-footnote font-semibold text-label-secondary">
                          <Clock className="h-3.5 w-3.5 text-tint" aria-hidden="true" />
                          <span lang="hi" className="font-devanagari normal-case tracking-normal">हाल की खोज</span> · Recent searches
                        </h3>
                        <button
                          type="button"
                          onClick={() => setRecent([])}
                          className="focus-ring inline-flex min-h-[32px] items-center gap-1.5 rounded-pill px-2.5 text-caption font-medium text-label-tertiary hover:text-rose-600 hover:bg-fill-quaternary transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          Clear history
                        </button>
                      </div>
                      <ul className="flex flex-wrap gap-2">
                        {recent.map((item) => (
                          <li key={item}>
                            <button
                              type="button"
                              onClick={() => runSearch(item)}
                              className="focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-pill border border-separator bg-surface-raised px-3.5 text-footnote text-label-primary hover:border-tint/40 hover:bg-fill-quaternary transition"
                            >
                              <Clock className="h-3.5 w-3.5 text-label-tertiary" aria-hidden="true" />
                              {item}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  <section aria-labelledby={`${listboxId}-suggested`}>
                    <h3 id={`${listboxId}-suggested`} className="mb-2 flex items-center gap-1.5 px-1 text-footnote font-semibold text-label-secondary">
                      <Sparkles className="h-3.5 w-3.5 text-tint" aria-hidden="true" />
                      <span lang="hi" className="font-devanagari normal-case tracking-normal">सुझाई खोज</span> · Try searching
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {SUGGESTED_SEARCHES.map((s) => (
                        <li key={s.query}>
                          <button
                            type="button"
                            onClick={() => runSearch(s.query)}
                            className="focus-ring inline-flex min-h-[36px] items-center rounded-pill border border-separator bg-surface-raised px-3.5 text-footnote font-medium text-label-primary hover:border-tint/40 hover:bg-fill-quaternary active:scale-97 transition"
                          >
                            {s.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section aria-labelledby={`${listboxId}-topics`}>
                    <h3 id={`${listboxId}-topics`} className="mb-2 flex items-center gap-1.5 px-1 text-footnote font-semibold text-label-secondary">
                      <Flame className="h-3.5 w-3.5 text-tint" aria-hidden="true" />
                      <span lang="hi" className="font-devanagari normal-case tracking-normal">अध्ययन विषय</span> · Study topics
                    </h3>
                    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {studyTopics.map((t) => (
                        <li key={t.name}>
                          <button
                            type="button"
                            onClick={() => runSearch(t.name)}
                            className={`focus-ring flex min-h-[64px] w-full flex-col items-start rounded-card border p-3 text-left transition hover:shadow-sm ${t.tint}`}
                          >
                            <span className="text-subhead font-semibold text-label-primary">
                              {t.name} <span lang="hi" className="font-devanagari text-caption font-normal text-label-secondary">· {t.nameHi}</span>
                            </span>
                            <span className="mt-0.5 line-clamp-2 text-caption text-label-secondary">{t.blurb}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              ) : null}

              {trimmed && result && result.totalMatches > 0 && verseLoading && isOnline && (
                <div role="status" className="mb-3 flex items-center gap-2 rounded-card border border-separator bg-surface-raised/70 px-3 py-2 text-footnote text-label-secondary">
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-tint border-t-transparent" aria-hidden="true" />
                  Loading verse text… verse results will appear in a moment.
                </div>
              )}

              {trimmed && waitingForIndex && (
                <div className="flex flex-col items-center gap-3 px-3 py-12 text-center text-subhead text-label-secondary">
                  <span className="h-6 w-6 animate-spin rounded-full border-2 border-tint border-t-transparent" aria-hidden="true" />
                  <p>
                    <span lang="hi" className="font-devanagari">खोज रहे हैं…</span> · Searching the verses…
                  </p>
                </div>
              )}

              {trimmed && result && result.totalMatches === 0 && !waitingForIndex && (
                <div className="px-3 py-10 text-center">
                  <HelpCircle className="mx-auto mb-3 h-10 w-10 text-label-tertiary" aria-hidden="true" />
                  <h3 className="text-title-3 font-semibold text-label-primary">
                    <span lang="hi" className="font-devanagari">कोई परिणाम नहीं</span> · No results for “{trimmed}”
                  </h3>
                  <ul className="mx-auto mt-3 max-w-md space-y-1 text-left text-footnote text-label-secondary">
                    <li>• Try part of the verse in Devanagari or Roman letters (“karmanye vadhikaraste”).</li>
                    <li>• Try a reference such as “Gita 2.47” or “Katha 1.2”.</li>
                    <li>• Try one idea: “fear”, “anger”, “meaning of life”, “भय”.</li>
                  </ul>
                  <ul className="mx-auto mt-5 flex max-w-lg flex-wrap justify-center gap-2">
                    {SUGGESTED_SEARCHES.slice(0, 5).map((s) => (
                      <li key={s.query}>
                        <button
                          type="button"
                          onClick={() => runSearch(s.query)}
                          className="focus-ring inline-flex min-h-[36px] items-center rounded-pill border border-separator bg-surface-raised px-3.5 text-footnote font-medium text-label-primary hover:border-tint/40 hover:bg-fill-quaternary transition"
                        >
                          {s.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link
                      href={`/scriptures?q=${encodeURIComponent(trimmed)}`}
                      onClick={onClose}
                      className="apple-pill min-h-[40px] px-5"
                    >
                      Browse the library <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                    <Link
                      href="/wisdom-for-life"
                      onClick={onClose}
                      className="focus-ring inline-flex min-h-[40px] items-center gap-1.5 rounded-pill border border-separator bg-surface-raised px-5 text-subhead font-medium text-label-primary hover:bg-fill-quaternary transition"
                    >
                      Wisdom for Life topics
                    </Link>
                  </div>
                </div>
              )}

              {trimmed && result && result.totalMatches > 0 && (
                <div id={listboxId} role="listbox" aria-label="Search results" className="space-y-6">
                  {SEARCH_GROUPS.map((group) => {
                    const items = display.filter((r) => r.group === group.id);
                    if (items.length === 0) return null;
                    const headingId = `${listboxId}-${group.id}`;
                    return (
                      <div key={group.id} role="group" aria-label={`${group.hindiLabel}. ${group.label}`} className="space-y-2">
                        <div aria-hidden="true" className="flex items-center justify-between border-b border-separator px-1 pb-1.5">
                          <h3 id={headingId} className="flex items-center gap-2 text-footnote font-semibold text-label-secondary">
                            {groupIcon(group.id)}
                            <span lang="hi" className="font-devanagari normal-case tracking-normal">{group.hindiLabel}</span> · {group.label}
                          </h3>
                          <span className="font-mono text-caption text-label-tertiary">{items.length}</span>
                        </div>

                        {items.map((item) => {
                          const index = display.indexOf(item);
                          const selected = index === selectedIndex;
                          const style = matchedTextStyle(item);
                          const matched = item.matchingText || item.title;
                          const showSubtitle = item.subtitle && item.subtitle !== item.reference && item.subtitle !== matched;
                          const reviewStatus = reviewStatusForHref(item.href, REVIEW_RECORDS);
                          return (
                            <Link
                              key={item.id}
                              id={`search-item-${index}`}
                              href={item.href}
                              role="option"
                              aria-selected={selected}
                              aria-label={`${item.reference ?? item.title}. ${item.matchReason}. ${item.languageLabel}. ${reviewStatus}.`}
                              tabIndex={selected ? 0 : -1}
                              onClick={() => {
                                remember(query);
                                onClose();
                              }}
                              onMouseMove={() => {
                                if (!selected) setSelectedIndex(index);
                              }}
                              className={`search-result-in group relative isolate block rounded-card border p-3.5 transition-colors sm:p-4 ${
                                selected
                                  ? 'border-tint/60 bg-tint-fill ring-1 ring-tint/30'
                                  : 'border-separator bg-surface-raised hover:border-tint/40 hover:bg-fill-quaternary'
                              }`}
                              style={{ animationDelay: `${Math.min(index, 8) * 25}ms` }}
                            >
                              {/* One highlight layer shared by every result, so the selection glides between them. */}
                              {selected && (
                                <motion.span
                                  layoutId="search-selection"
                                  aria-hidden="true"
                                  className="pointer-events-none absolute inset-0 -z-10 rounded-card bg-tint-fill shadow-xs ring-1 ring-tint/40"
                                  transition={reduce ? { duration: 0 } : SPRINGS.settle}
                                />
                              )}
                              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                                <span className="font-mono text-caption font-bold text-tint">
                                  {item.reference ?? item.groupLabel}
                                </span>
                                <span className="flex flex-wrap items-center gap-1.5">
                                  <span className={`rounded-pill border px-2 py-0.5 text-caption font-semibold ${reasonClass(item.matchReason)}`}>{item.matchReason}</span>
                                  <span className="rounded-pill border border-separator bg-surface-canvas/60 px-2 py-0.5 text-caption font-medium text-label-secondary">{item.languageLabel}</span>
                                  {/* Kept on every result, but "Not yet reviewed" (most of the library) is plain text, not a pill. */}
                                  {reviewStatus.startsWith('Reviewed') ? (
                                    <span className="rounded-pill border border-emerald-600/30 bg-emerald-500/10 px-2 py-0.5 text-caption font-medium text-emerald-900 dark:text-emerald-200">{reviewStatus}</span>
                                  ) : (
                                    <span className="px-1 text-caption text-label-tertiary">{reviewStatus}</span>
                                  )}
                                </span>
                              </div>

                              <p lang={style.lang} className={`line-clamp-4 whitespace-pre-line ${style.className}`}>
                                <Highlighted text={matched} query={trimmed} />
                              </p>
                              {showSubtitle && <p className="mt-0.5 text-caption text-label-secondary">{item.subtitle}</p>}

                              {item.translationExcerpt && item.translationExcerpt !== matched && (
                                <p className="mt-2.5 rounded-card border border-separator/60 bg-fill-quaternary/40 p-2.5 text-footnote leading-relaxed text-label-primary">
                                  <span className="mr-1.5 font-semibold text-label-secondary">Translation:</span>
                                  <span lang={isDevanagariText(item.translationExcerpt) ? 'hi' : 'en'} className={isDevanagariText(item.translationExcerpt) ? 'font-devanagari leading-[1.8]' : ''}>
                                    <Highlighted text={item.translationExcerpt} query={trimmed} />
                                  </span>
                                  {item.translationIsAi && (
                                    <span className="ml-2 rounded-pill border border-violet-500/30 bg-violet-500/10 px-1.5 py-px text-[10px] font-semibold text-violet-900 dark:text-violet-200" title={STUDY_TRANSLATION_SHORT.detail}>{STUDY_TRANSLATION_SHORT.en}</span>
                                  )}
                                </p>
                              )}

                              {item.group === 'verse' && item.commentaryExcerpt && item.matchedField === 'explanation' && (
                                <p className="mt-2 rounded-card border border-separator/60 bg-fill-quaternary/40 p-2.5 text-footnote leading-relaxed text-label-primary">
                                  <span className="mr-1.5 font-semibold text-label-secondary">Explanation:</span>
                                  <Highlighted text={item.commentaryExcerpt} query={trimmed} />
                                  {item.aiDrafted && (
                                    <span className="ml-2 rounded-pill border border-violet-500/30 bg-violet-500/10 px-1.5 py-px text-[10px] font-semibold text-violet-900 dark:text-violet-200" title={EDITORIAL_DRAFT_LABEL.detail}>{EDITORIAL_DRAFT_LABEL.en}</span>
                                  )}
                                </p>
                              )}

                              <div className="mt-2.5 flex items-center justify-end border-t border-separator/50 pt-2 text-footnote">
                                <span className="inline-flex items-center gap-1 font-semibold text-tint transition-transform group-hover:translate-x-0.5">
                                  {(item.actionLabel ?? 'Open').replace(/\s*[→➜]\s*$/, '')}
                                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer: keys and count */}
            <div className="flex items-center justify-between border-t border-separator bg-surface-canvas/60 px-4 py-2.5 text-caption text-label-tertiary">
              <div className="hidden items-center gap-4 sm:flex">
                <span className="flex items-center gap-1"><kbd className="rounded-control border border-separator bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-label-secondary shadow-xs">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="rounded-control border border-separator bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-label-secondary shadow-xs">↵</kbd> Open</span>
                <span className="flex items-center gap-1"><kbd className="rounded-control border border-separator bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-label-secondary shadow-xs">Tab</kbd> Filters</span>
                <span className="flex items-center gap-1"><kbd className="rounded-control border border-separator bg-surface-raised px-1.5 py-0.5 font-mono text-[10px] text-label-secondary shadow-xs">Esc</kbd> Close</span>
              </div>
              <span className="ml-auto font-medium text-label-secondary">
                {waitingForIndex ? 'Searching…' : result ? `${result.totalMatches} result${result.totalMatches === 1 ? '' : 's'}${result.totalMatches > RESULT_LIMIT ? ` · top ${RESULT_LIMIT}` : ''}` : 'Dharma Granth search'}
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
