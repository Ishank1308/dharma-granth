'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { readHref } from '@/lib/verse-paths';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Copy,
  Download,
  Edit3,
  ExternalLink,
  Flag,
  Globe,
  Languages,
  Lightbulb,
  Maximize2,
  Minimize2,
  Moon,
  Play,
  Quote,
  RotateCcw,
  ScrollText,
  MessageCircle,
  Share2,
  SlidersHorizontal,
  Sparkles,
  StickyNote,
  Sun,
  X,
} from 'lucide-react';
import { whatsappShareUrl } from '@/lib/whatsapp';
import { AnimatePresence, motion } from 'framer-motion';
import { THEME_NAMES, useTheme, type Theme } from './ThemeProvider';
import { cleanVerseField, toAsciiDigits, verseLines } from '@/lib/verse-format';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface VerseItemData {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  wordMeaning?: string;
  hindi?: string;
  translation?: string;
  commentary?: string;
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  meter?: string;
}

export interface ChapterNavItem {
  id: number;
  title: string;
  titleSanskrit?: string;
  verseCount?: number;
}

export interface ScriptureReaderProps {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  chapterId: number;
  chapterTitle: string;
  chapterTitleSanskrit?: string;
  totalChapters: number;
  chaptersList: ChapterNavItem[];
  verse: VerseItemData;
  prevVerse?: {
    number: number | string;
    preview?: string;
    href: string;
  };
  nextVerse?: {
    number: number | string;
    preview?: string;
    href: string;
  };
  allVerseNumbers: Array<number | string>;
  currentIndex: number;
  totalVersesInChapter: number;
  editionDetails?: {
    criticalEdition?: string;
    provenance?: string;
    recension?: string;
    meter?: string;
    license?: string;
  };
}

export interface ReaderSettings {
  sanskritFontSize: 'sm' | 'md' | 'lg' | 'xl';
  translationFontSize: 'sm' | 'md' | 'lg' | 'xl';
  lineSpacing: 'compact' | 'normal' | 'relaxed' | 'loose';
  readingWidth: 'narrow' | 'standard' | 'wide';
  showTransliteration: boolean;
  showHindi: boolean;
  showEnglish: boolean;
  theme: Theme;
  reducedMotion: boolean;
}

const SETTINGS_KEY = 'dharma.distractionFreeSettings';
const BOOKMARKS_KEY = 'dharma.bookmarkedVerses';

const DEFAULT_SETTINGS: ReaderSettings = {
  sanskritFontSize: 'lg',
  translationFontSize: 'md',
  lineSpacing: 'relaxed',
  readingWidth: 'standard',
  showTransliteration: true,
  showHindi: true,
  showEnglish: true,
  theme: 'day',
  reducedMotion: false,
};

interface SavedBookmark {
  scriptureId: string;
  scriptureTitle: string;
  chapterId: number;
  chapterTitle: string;
  verseId: number | string;
  sanskrit: string;
  translation: string;
  hindi?: string;
  timestamp: string;
}

export interface WordGloss {
  pada: string;
  meaning: string;
}

export function parseWordMeanings(text?: string): WordGloss[] {
  if (!text) return [];
  const rawItems = text.split(/[;\n]+/).map((s) => s.trim()).filter(Boolean);
  const result: WordGloss[] = [];
  for (const item of rawItems) {
    const match = item.split(/\s*[-—–:]\s*/);
    if (match.length >= 2) {
      result.push({
        pada: match[0].trim(),
        meaning: match.slice(1).join(' - ').trim(),
      });
    } else if (item.length > 0) {
      result.push({
        pada: item,
        meaning: '',
      });
    }
  }
  return result;
}

/** Determine Sanskrit meter roughly based on total syllables */
function detectChhanda(sanskrit?: string): string {
  if (!sanskrit) return 'अनुष्टुप् छन्दः (Anuṣṭubh Metre)';
  const clean = sanskrit.replace(/[\s|।॥0-9०-९.,\-–—!]/g, '');
  const vowels = clean.match(/[अआइईउऊऋॠएऐओऔािीुूृॄेैोौ]/g);
  const aksharas = vowels ? vowels.length : Math.round(clean.length / 2);
  if (aksharas >= 40 && aksharas <= 48) return 'त्रिष्टुप् छन्दः (Triṣṭubh Metre · 11×4 वर्ण)';
  if (aksharas >= 48 && aksharas <= 54) return 'जगती छन्दः (Jagatī Metre · 12×4 वर्ण)';
  if (aksharas >= 20 && aksharas <= 28) return 'गायत्री छन्दः (Gāyatrī Metre · 8×3 वर्ण)';
  return 'अनुष्टुप् छन्दः (Anuṣṭubh Metre · 8×4 वर्ण · 32 अक्षरात्मक)';
}

export function ScriptureReader({
  scriptureId,
  scriptureTitle,
  scriptureTitleSanskrit,
  chapterId,
  chapterTitle,
  chapterTitleSanskrit,
  totalChapters,
  chaptersList,
  verse,
  prevVerse,
  nextVerse,
  allVerseNumbers,
  currentIndex,
  totalVersesInChapter,
  editionDetails,
}: ScriptureReaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  // Reader Settings State
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch {}
    return DEFAULT_SETTINGS;
  });

  // Keep theme synced with ThemeProvider
  useEffect(() => {
    if (settings.theme !== theme) {
      setSettings((prev) => ({ ...prev, theme }));
    }
  }, [theme, settings.theme]);

  const updateSetting = <K extends keyof ReaderSettings>(
    key: K,
    val: ReaderSettings[K],
  ) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: val };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    if (key === 'theme') {
      setTheme(val as Theme);
    }
    triggerTactileFeedback('selection', 'softTap');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setTheme(DEFAULT_SETTINGS.theme);
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch {}
    triggerTactileFeedback('medium', 'softTap');
  };

  // UI Panels / Modals
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [chapterSelectorOpen, setChapterSelectorOpen] = useState(false);
  const [verseSelectorOpen, setVerseSelectorOpen] = useState(false);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Bookmark state
  const [bookmarked, setBookmarked] = useState(false);

  // Notes state
  const noteKey = `dharma.verse_notes.${scriptureId}.${chapterId}.${verse.number}`;
  const [privateNote, setPrivateNote] = useState('');
  const [hasNote, setHasNote] = useState(false);

  // Mobile Collapsible Commentary sections
  const [commentaryExpanded, setCommentaryExpanded] = useState(true);
  const [explanationExpanded, setExplanationExpanded] = useState(true);
  const [reflectionExpanded, setReflectionExpanded] = useState(true);
  const [researchExpanded, setResearchExpanded] = useState(true);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  // Pada analysis search/filter
  const [padaFilter, setPadaFilter] = useState('');

  // Error Report Form State
  const [errorType, setErrorType] = useState('sanskrit-typo');
  const [errorDetails, setErrorDetails] = useState('');
  const [errorSubmitted, setErrorSubmitted] = useState(false);

  // Initial loads from localStorage
  useEffect(() => {
    // Bookmarks check
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      if (stored) {
        const list: SavedBookmark[] = JSON.parse(stored);
        const exists = list.some(
          (b) =>
            b.scriptureId === scriptureId &&
            b.chapterId === chapterId &&
            String(b.verseId) === String(verse.number),
        );
        setBookmarked(exists);
      }
    } catch {}

    // Private Note check
    try {
      const savedNote = localStorage.getItem(noteKey);
      if (savedNote) {
        setPrivateNote(savedNote);
        setHasNote(true);
      } else {
        setPrivateNote('');
        setHasNote(false);
      }
    } catch {}

  }, [scriptureId, chapterId, verse.number, noteKey]);

  // Toast auto-clear
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    triggerTactileFeedback('success', 'softTap');
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'textarea' || tag === 'input') return;

      if (e.key === 'ArrowLeft' && prevVerse?.href) {
        router.push(prevVerse.href);
      } else if (e.key === 'ArrowRight' && nextVerse?.href) {
        router.push(nextVerse.href);
      } else if (e.key.toLowerCase() === 's') {
        setSettingsOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSettingsOpen(false);
        setChapterSelectorOpen(false);
        setVerseSelectorOpen(false);
        setNoteModalOpen(false);
        setShareModalOpen(false);
        setErrorModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevVerse, nextVerse, router]);

  // Toggle Bookmark
  const handleToggleBookmark = () => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_KEY);
      let list: SavedBookmark[] = stored ? JSON.parse(stored) : [];
      const currentLabel = String(verse.number);
      const exists = list.some(
        (b) =>
          b.scriptureId === scriptureId &&
          b.chapterId === chapterId &&
          String(b.verseId) === currentLabel,
      );

      if (exists) {
        list = list.filter(
          (b) =>
            !(
              b.scriptureId === scriptureId &&
              b.chapterId === chapterId &&
              String(b.verseId) === currentLabel
            ),
        );
        setBookmarked(false);
        showToast('बुकमार्क हटाया गया · Bookmark Removed');
      } else {
        const newBookmark: SavedBookmark = {
          scriptureId,
          scriptureTitle,
          chapterId,
          chapterTitle,
          verseId: verse.number,
          sanskrit: verse.sanskrit || '',
          translation: verse.translation || verse.hindi || '',
          hindi: verse.hindi,
          timestamp: new Date().toISOString(),
        };
        list.unshift(newBookmark);
        setBookmarked(true);
        showToast('श्लोक सुरक्षित किया गया · Verse Bookmarked');
      }
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    } catch {}
  };

  // Copy with reference
  const handleCopyWithReference = async () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const parts = [
      verse.sanskrit ? `॥ ${cleanVerseField(verse.sanskrit)} ॥` : '',
      settings.showTransliteration && verse.transliteration
        ? `IAST: ${verse.transliteration}`
        : '',
      settings.showHindi && verse.hindi
        ? `[हिन्दी अर्थ]:\n${verse.hindi}`
        : '',
      settings.showEnglish && verse.translation
        ? `[English]:\n${verse.translation}`
        : '',
      `— ${scriptureTitle} ${chapterId}.${verse.number}`,
      pageUrl ? `Dharma Granth: ${pageUrl}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      await navigator.clipboard.writeText(parts);
      showToast('संदर्भ सहित कॉपी किया गया · Copied with Reference');
    } catch {
      showToast('कॉपी करने में असमर्थ');
    }
  };

  // WhatsApp share link (also used by the share modal below)
  const whatsappHref = () =>
    whatsappShareUrl({
      heading: `${scriptureTitle} ${chapterId}.${verse.number} · Dharma Granth`,
      body: [verse.sanskrit ? cleanVerseField(verse.sanskrit) : '', verse.hindi || verse.translation || ''],
      url: typeof window !== 'undefined' ? window.location.href : 'https://dharmagranth.dev/',
    });

  // Share Verse
  const handleShare = async () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = `${scriptureTitle} ${chapterId}.${verse.number} · Dharma Granth`;
    const shareText = `${verse.sanskrit ? cleanVerseField(verse.sanskrit) + '\n\n' : ''}${verse.hindi || verse.translation || ''}\n\n— ${shareTitle}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: pageUrl,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    setShareModalOpen(true);
  };

  // Download Verse
  const handleDownload = () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const mdContent = `# ${scriptureTitle} (${scriptureTitleSanskrit || ''})
## ${chapterTitle} · श्लोक ${verse.number}

### 1. मूल संस्कृत श्लोक (Original Sanskrit)
${verse.sanskrit || 'उपलब्ध नहीं'}

### 2. रोमन लिप्यन्तरण (IAST Transliteration)
${verse.transliteration || '—'}

### 3. पदच्छेद एवं अन्वय (Word-by-Word Analysis)
${verse.wordMeaning || '—'}

### 4. हिन्दी भाषार्थ (Literal Hindi Meaning)
${verse.hindi || '—'}

### 5. English Translation (Literal Meaning)
${verse.translation || '—'}

### 6. परम्परागत भाष्य (Traditional Commentary)
${verse.commentary || '—'}

### 7. सरल व्याख्या (Simple Explanation)
${verse.explanation || '—'}

### 8. समकालीन प्रासंगिकता (Modern Reflection)
${verse.lifeLesson || '—'}

### 9. शोध एवं वैज्ञानिक दृष्टि (Research Note)
${verse.science || '—'}

### 10. ग्रंथ स्रोत एवं संस्करण विवरण (Edition & Provenance)
- ग्रन्थ: ${scriptureTitle}
- अध्याय: ${chapterId} (${chapterTitle})
- श्लोक: ${verse.number}
- छन्द: ${editionDetails?.meter || detectChhanda(verse.sanskrit)}
- संस्करण: ${editionDetails?.criticalEdition || 'गीताप्रेस गोरखपुर / BORI Critical Edition'}
- डिजिटल संरक्षण: धर्म ग्रन्थ (Dharma Granth)
- यूआरएल: ${pageUrl}
`;

    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptureId}_ch${chapterId}_v${verse.number}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('श्लोक फ़ाइल डाउनलोड हो गई · Verse Downloaded');
  };

  // Save Note
  const handleSaveNote = () => {
    try {
      if (privateNote.trim()) {
        localStorage.setItem(noteKey, privateNote.trim());
        setHasNote(true);
        showToast('निजी टिप्पणी सहेजी गई · Note Saved');
      } else {
        localStorage.removeItem(noteKey);
        setHasNote(false);
        showToast('टिप्पणी हटाई गई · Note Cleared');
      }
      setNoteModalOpen(false);
    } catch {
      showToast('नोट सहेजने में त्रुटि');
    }
  };

  // Submit Textual Error
  const handleSubmitError = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const reportsKey = 'dharma.textual_error_reports';
      const existing = JSON.parse(localStorage.getItem(reportsKey) || '[]');
      existing.push({
        scriptureId,
        chapterId,
        verseNumber: verse.number,
        errorType,
        errorDetails,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(reportsKey, JSON.stringify(existing));
    } catch {}
    setErrorSubmitted(true);
    setTimeout(() => {
      setErrorModalOpen(false);
      setErrorSubmitted(false);
      setErrorDetails('');
      showToast('पाठ त्रुटि समीक्षा हेतु दर्ज की गई · Error Report Received');
    }, 1400);
  };

  // Parsed words from wordMeaning
  const wordGlosses = useMemo(() => {
    return parseWordMeanings(verse.wordMeaning);
  }, [verse.wordMeaning]);

  const filteredWordGlosses = useMemo(() => {
    if (!padaFilter.trim()) return wordGlosses;
    const q = padaFilter.toLowerCase().trim();
    return wordGlosses.filter(
      (w) =>
        w.pada.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q),
    );
  }, [wordGlosses, padaFilter]);

  // Lines of sanskrit
  const sanskritLines = useMemo(() => {
    return verse.sanskrit ? verseLines(cleanVerseField(verse.sanskrit)) : [];
  }, [verse.sanskrit]);

  // Compute Reading Width CSS Class
  const readingWidthClass =
    settings.readingWidth === 'narrow'
      ? 'max-w-2xl'
      : settings.readingWidth === 'wide'
      ? 'max-w-5xl'
      : 'max-w-3xl';

  // Compute Sanskrit Font Size Class
  const sanskritFontSizeClass =
    settings.sanskritFontSize === 'sm'
      ? 'text-lg md:text-xl'
      : settings.sanskritFontSize === 'md'
      ? 'text-xl md:text-2xl'
      : settings.sanskritFontSize === 'lg'
      ? 'text-2xl md:text-3xl'
      : 'text-3xl md:text-4xl';

  // Compute Translation Font Size Class
  const translationFontSizeClass =
    settings.translationFontSize === 'sm'
      ? 'text-sm md:text-base'
      : settings.translationFontSize === 'md'
      ? 'text-base md:text-lg'
      : settings.translationFontSize === 'lg'
      ? 'text-lg md:text-xl'
      : 'text-xl md:text-2xl';

  // Compute Line Spacing Class
  const lineSpacingClass =
    settings.lineSpacing === 'compact'
      ? 'leading-normal'
      : settings.lineSpacing === 'normal'
      ? 'leading-relaxed'
      : settings.lineSpacing === 'relaxed'
      ? 'leading-loose'
      : 'leading-[2.4]';

  // Reading progress %
  const progressPercent = Math.min(
    100,
    Math.round(((currentIndex + 1) / Math.max(1, totalVersesInChapter)) * 100),
  );

  return (
    <div
      className={`min-h-screen bg-dharma-bg text-dharma-text transition-colors duration-300 selection:bg-saffron-500/20 selection:text-saffron-900 ${
        settings.reducedMotion ? 'motion-reduce' : ''
      }`}
    >
      {/* ─── 1. STICKY READER HEADER ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-dharma-border/80 bg-dharma-bg/95 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
          {/* Left: Back & Title */}
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <Link
              href={`/scripture/${scriptureId}/chapter/${chapterId}`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dharma-border bg-dharma-card/80 text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-700"
              title="अध्याय पर वापस जाएँ · Back to Chapter"
              aria-label="Back to Chapter"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href={`/scripture/${scriptureId}`}
                  className="truncate text-xs font-semibold text-dharma-muted transition hover:text-saffron-700 sm:text-sm"
                >
                  {scriptureTitle}
                </Link>
                <span className="text-dharma-muted/40">·</span>
                <button
                  type="button"
                  onClick={() => setChapterSelectorOpen(true)}
                  className="inline-flex items-center gap-1 truncate rounded-md px-1.5 py-0.5 text-xs font-semibold text-saffron-700 hover:bg-saffron-500/10 sm:text-sm"
                >
                  <span className="truncate">
                    {chapterTitleSanskrit || chapterTitle}
                  </span>
                  <ChevronDown className="h-3 w-3 shrink-0 opacity-70" />
                </button>
              </div>
            </div>
          </div>

          {/* Center: Reading Progress (Desktop & Tablet) */}
          <div className="hidden items-center gap-3 sm:flex">
            <div className="flex flex-col items-center">
              <span className="font-devanagari text-xs font-semibold text-dharma-muted">
                श्लोक {toAsciiDigits(verse.number)} / {toAsciiDigits(totalVersesInChapter)}
              </span>
              <div className="mt-1 h-1.5 w-28 overflow-hidden rounded-full bg-dharma-border/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-saffron-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Actions (Reader Settings, Bookmark, Fast Verse Selector) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Quick Verse Jump Pill */}
            <button
              type="button"
              onClick={() => setVerseSelectorOpen(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card/80 px-2.5 text-xs font-medium text-dharma-text transition hover:border-saffron-400 hover:text-saffron-700 sm:px-3 sm:text-sm"
              title="श्लोक चुनें · Select Verse"
            >
              <span className="font-devanagari font-semibold">
                श्लोक {toAsciiDigits(verse.number)}
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>

            {/* Bookmark button */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition ${
                bookmarked
                  ? 'border-saffron-500 bg-saffron-500/15 text-saffron-600 dark:text-saffron-400'
                  : 'border-dharma-border bg-dharma-card/80 text-dharma-muted hover:border-saffron-400 hover:text-saffron-700'
              }`}
              title={bookmarked ? 'बुकमार्क हटाएं · Remove Bookmark' : 'श्लोक सहेजें · Bookmark Verse'}
              aria-label="Bookmark"
            >
              {bookmarked ? (
                <BookmarkCheck className="h-4 w-4 fill-current" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
            </button>

            {/* Reader Settings button */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dharma-border bg-dharma-card/80 text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-700"
              title="पठन व्यवस्था · Reader Settings (Press 'S')"
              aria-label="Reader Settings"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile thin progress line */}
        <div className="h-0.5 w-full bg-dharma-border/50 sm:hidden">
          <div
            className="h-full bg-saffron-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* ─── 2. VERSE NAVIGATION BAR (Desktop & Tablet) ────────────────────── */}
      <nav
        aria-label="श्लोक संचालन"
        className="mx-auto hidden max-w-5xl items-center justify-between px-4 pt-6 sm:flex sm:px-6"
      >
        {prevVerse ? (
          <Link
            href={prevVerse.href}
            className="group inline-flex items-center gap-3 rounded-2xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-dharma-text shadow-sm transition hover:border-saffron-400 hover:shadow-md"
            title="पिछला श्लोक (← Left Arrow)"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 text-saffron-600 transition group-hover:-translate-x-1" />
            <div className="text-left">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-dharma-muted">
                पिछला श्लोक
              </span>
              <span className="font-devanagari text-sm font-bold text-dharma-text">
                श्लोक {toAsciiDigits(prevVerse.number)}
              </span>
            </div>
          </Link>
        ) : (
          <div className="w-32" />
        )}

        <div className="flex flex-col items-center text-center">
          <span className="font-devanagari text-xs uppercase tracking-widest text-saffron-700">
            {chapterTitleSanskrit || chapterTitle}
          </span>
          <h2 className="mt-0.5 font-serif text-lg font-bold text-dharma-text">
            अध्याय {chapterId} · श्लोक {verse.number}
          </h2>
          <span className="text-[11px] text-dharma-muted">
            कुल {totalVersesInChapter} श्लोकों में से श्लोक {verse.number}
          </span>
        </div>

        {nextVerse ? (
          <Link
            href={nextVerse.href}
            className="group inline-flex items-center gap-3 rounded-2xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-dharma-text shadow-sm transition hover:border-saffron-400 hover:shadow-md"
            title="अगला श्लोक (→ Right Arrow)"
          >
            <div className="text-right">
              <span className="block text-[10px] font-semibold uppercase tracking-wider text-dharma-muted">
                अगला श्लोक
              </span>
              <span className="font-devanagari text-sm font-bold text-dharma-text">
                श्लोक {toAsciiDigits(nextVerse.number)}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-saffron-600 transition group-hover:translate-x-1" />
          </Link>
        ) : (
          <div className="w-32" />
        )}
      </nav>

      {/* ─── MAIN READER WORKSPACE ────────────────────────────────────────── */}
      <main className={`mx-auto px-4 pt-4 pb-32 sm:pt-8 sm:pb-24 ${readingWidthClass}`}>
        {/* Actions Floating Toolbar */}
        <section
          aria-label="श्लोक क्रियाएं"
          className="mb-8 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dharma-border bg-dharma-card/90 p-2.5 shadow-sm backdrop-blur"
        >
          {/* Study Actions */}
          <div className="flex flex-wrap items-center gap-1">
            <button
              type="button"
              onClick={() => setNoteModalOpen(true)}
              className={`relative inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition ${
                hasNote
                  ? 'border-amber-400 bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  : 'border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-400 hover:text-saffron-700'
              }`}
              title="निजी टिप्पणी जोड़ें / देखें"
            >
              <StickyNote className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">टिप्पणी</span>
              {hasNote && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyWithReference}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-2.5 text-xs font-medium text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-700"
              title="संदर्भ सहित कॉपी करें"
            >
              <Copy className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">कॉपी</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-2.5 text-xs font-medium text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-700"
              title="श्लोक साझा करें"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">शेयर</span>
            </button>

            {/* A button, not a link: the URL is read from window.location at click time, so server and client markup match. */}
            <button
              type="button"
              onClick={() => window.open(whatsappHref(), '_blank', 'noopener,noreferrer')}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-2.5 text-xs font-medium text-dharma-muted transition hover:border-green-400 hover:text-green-700"
              title="WhatsApp पर साझा करें"
              aria-label="WhatsApp पर साझा करें"
            >
              <MessageCircle className="h-3.5 w-3.5 text-green-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-2.5 text-xs font-medium text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-700"
              title="श्लोक फाइल डाउनलोड करें"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">डाउनलोड</span>
            </button>

            <button
              type="button"
              onClick={() => setErrorModalOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-dharma-border bg-dharma-card text-dharma-muted transition hover:border-rose-400 hover:text-rose-600"
              title="पाठ अशुद्धि रिपोर्ट करें"
              aria-label="Report Error"
            >
              <Flag className="h-3.5 w-3.5" />
            </button>
          </div>
        </section>

        {/* ─── 3. MAIN VERSE CONTENT SECTIONS (IN EXACT ORDER) ──────────────── */}
        <div className="space-y-8">
          {/* SECTION 1: ORIGINAL SANSKRIT */}
          <article
            id="sacred-sanskrit"
            aria-label="मूल संस्कृत श्लोक"
            className="relative overflow-hidden rounded-panel border-2 border-amber-600/30 bg-gradient-to-b from-[#fffbf4] via-[#fefaf0] to-[#fbf4e4] p-6 shadow-md transition-all dark:border-amber-500/20 dark:from-[#171410] dark:via-[#191512] dark:to-[#14120e] sm:p-10"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2 left-2 font-serif text-xs text-amber-600/30 dark:text-amber-400/20"
            >
              ❖
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-2 right-2 font-serif text-xs text-amber-600/30 dark:text-amber-400/20"
            >
              ❖
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 left-2 font-serif text-xs text-amber-600/30 dark:text-amber-400/20"
            >
              ❖
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-2 right-2 font-serif text-xs text-amber-600/30 dark:text-amber-400/20"
            >
              ❖
            </div>

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-amber-600/15 pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/10 px-3 py-1 font-devanagari text-xs font-bold text-amber-900 dark:text-amber-200">
                <span className="text-amber-600">॥ श्रीहरिः ॥</span>
                <span>मूल शास्त्र पाठ · Sacred Source Scripture</span>
              </span>

              <span className="font-devanagari text-xs font-semibold text-amber-800/80 dark:text-amber-300/80">
                {editionDetails?.meter || detectChhanda(verse.sanskrit)}
              </span>
            </div>

            <div className="my-4 text-center">
              {sanskritLines.length > 0 ? (
                <p
                  lang="sa"
                  className={`font-devanagari font-bold text-dharma-text ${sanskritFontSizeClass} ${lineSpacingClass}`}
                >
                  {sanskritLines.map((line, idx) => (
                    <span key={idx} className="block px-2 py-0.5 tracking-wide">
                      {line}
                    </span>
                  ))}
                  <span className="mt-3 block font-bold text-amber-700 dark:text-amber-400">
                    ॥ {toAsciiDigits(chapterId)}.{toAsciiDigits(verse.number)} ॥
                  </span>
                </p>
              ) : (
                <p lang="sa" className="font-devanagari text-lg text-dharma-muted">
                  संस्कृत मूल पाठ अनुपलब्ध
                </p>
              )}
            </div>

            <div
              aria-hidden="true"
              className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-3 text-amber-600/40 dark:text-amber-400/30"
            >
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-600/30" />
              <span className="font-devanagari text-xs font-bold">॥ ॐ ॥</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-600/30" />
            </div>
          </article>

          {/* SECTION 2: ROMAN TRANSLITERATION */}
          {settings.showTransliteration && verse.transliteration && (
            <article
              id="transliteration"
              aria-label="रोमन लिप्यन्तरण"
              className="rounded-2xl border border-dharma-border/80 bg-dharma-card/60 p-5 shadow-sm transition sm:p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-dharma-muted">
                  <Languages className="h-3.5 w-3.5 text-saffron-600" />
                  <span>लिप्यन्तरण · IAST Roman Transliteration</span>
                </span>
                <span className="text-[11px] text-dharma-muted/70">
                  Phonetic Diacritical Guide
                </span>
              </div>

              <p
                lang="sa-Latn"
                className={`font-serif italic text-dharma-muted/90 ${translationFontSizeClass} ${lineSpacingClass}`}
              >
                {verse.transliteration}
              </p>
            </article>
          )}

          {/* SECTION 3: PADA OR WORD-BY-WORD ANALYSIS */}
          <article
            id="pada-analysis"
            aria-label="पदच्छेद एवं अन्वय"
            className="rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm transition sm:p-7"
          >
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-3">
              <div>
                <span className="inline-flex items-center gap-1.5 font-serif text-sm font-bold text-dharma-text sm:text-base">
                  <ScrollText className="h-4 w-4 text-saffron-600" />
                  <span>पदच्छेद एवं अन्वय · Word-by-Word Analysis</span>
                </span>
                <p className="mt-0.5 text-xs text-dharma-muted">
                  संस्कृत पद और उनका व्याकरणात्मक व प्रामाणिक अर्थ
                </p>
              </div>

              {wordGlosses.length > 4 && (
                <div className="w-full sm:w-auto">
                  <input
                    type="search"
                    placeholder="पद खोजें..."
                    value={padaFilter}
                    onChange={(e) => setPadaFilter(e.target.value)}
                    className="w-full rounded-xl border border-dharma-border bg-dharma-panel px-3 py-1.5 text-xs text-dharma-text placeholder:text-dharma-muted focus:border-saffron-500 focus:outline-none sm:w-44"
                  />
                </div>
              )}
            </div>

            {filteredWordGlosses.length > 0 ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredWordGlosses.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-xl border border-dharma-border/70 bg-dharma-panel-muted/50 p-3 transition hover:border-saffron-300 hover:bg-dharma-card"
                  >
                    <span
                      lang="sa"
                      className="font-devanagari text-sm font-bold text-saffron-800 dark:text-saffron-400"
                    >
                      {item.pada}
                    </span>
                    <span className="mt-1 text-xs leading-relaxed text-dharma-text/90">
                      {item.meaning || '—'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-dharma-border p-4 text-center text-xs text-dharma-muted">
                {verse.wordMeaning ? (
                  <p className="font-serif leading-relaxed">{verse.wordMeaning}</p>
                ) : (
                  <p>
                    इस श्लोक का पद-विश्लेषण पारंपरिक पाठ क्रम के अनुसार नीचे दिए गए भाषार्थ में समाहित है।
                  </p>
                )}
              </div>
            )}
          </article>

          {/* SECTION 4: LITERAL HINDI TRANSLATION */}
          {settings.showHindi && verse.hindi && (
            <article
              id="literal-hindi"
              aria-label="हिन्दी भाषार्थ"
              className="rounded-2xl border border-saffron-500/30 border-l-4 border-l-saffron-600 bg-saffron-500/5 p-5 shadow-sm transition dark:bg-saffron-950/10 sm:p-7"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-devanagari text-xs font-bold uppercase tracking-wide text-saffron-700 dark:text-saffron-400">
                  <span className="h-2 w-2 rounded-full bg-saffron-600" />
                  <span>हिन्दी भाषार्थ · Literal Hindi Translation</span>
                </span>
                <span className="text-[11px] text-dharma-muted">
                  मूल पाठ का निष्ठावान शब्दार्थ
                </span>
              </div>

              <p
                lang="hi"
                className={`whitespace-pre-line font-devanagari font-medium text-dharma-text ${translationFontSizeClass} ${lineSpacingClass}`}
              >
                {verse.hindi}
              </p>
            </article>
          )}

          {/* SECTION 5: LITERAL ENGLISH TRANSLATION */}
          {settings.showEnglish && verse.translation && (
            <article
              id="literal-english"
              aria-label="अंग्रेज़ी अनुवाद"
              className="rounded-2xl border border-amber-600/30 border-l-4 border-l-amber-600 bg-amber-500/5 p-5 shadow-sm transition dark:bg-amber-950/10 sm:p-7"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-600" />
                  <span>English Translation · Literal Meaning</span>
                </span>
                <span className="text-[11px] text-dharma-muted">
                  Faithful Scholarly English
                </span>
              </div>

              <p
                lang="en"
                className={`font-serif text-dharma-text ${translationFontSizeClass} ${lineSpacingClass}`}
              >
                {verse.translation}
              </p>
            </article>
          )}

          {/* SECTION 6: TRADITIONAL COMMENTARY */}
          {verse.commentary && (
            <article
              id="traditional-commentary"
              aria-label="परम्परागत भाष्य"
              className="rounded-2xl border border-amber-700/20 bg-dharma-card p-5 shadow-sm transition sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-dharma-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-600/10 text-amber-700 dark:text-amber-400">
                    <Quote className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-dharma-text sm:text-base">
                      परम्परागत भाष्य · Classical Acharya Bhashya
                    </h3>
                    <p className="text-[11px] text-dharma-muted">
                      प्राचीन आचार्य परम्परा का दार्शनिक निरूपण
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setCommentaryExpanded((prev) => !prev)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dharma-border text-dharma-muted transition hover:bg-dharma-panel sm:hidden"
                  aria-label={commentaryExpanded ? 'संक्षिप्त करें' : 'विस्तार करें'}
                >
                  {commentaryExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              {commentaryExpanded && (
                <div className="mt-4 pl-2">
                  <blockquote className="border-l-2 border-amber-600/40 pl-4">
                    <p
                      className={`whitespace-pre-line text-dharma-text ${translationFontSizeClass} ${lineSpacingClass}`}
                    >
                      {verse.commentary}
                    </p>
                  </blockquote>
                  <div className="mt-3 text-right">
                    <span className="text-[11px] italic text-dharma-muted">
                      — परम्परागत आचार्य टीका एवं साधक संजीवनी संग्रह
                    </span>
                  </div>
                </div>
              )}
            </article>
          )}

          {/* SECTION 7: SIMPLE EXPLANATION */}
          {verse.explanation && (
            <article
              id="simple-explanation"
              aria-label="सरल व्याख्या"
              className="rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/5 to-saffron-500/5 p-5 shadow-sm transition sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600">
                    <Lightbulb className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-dharma-text sm:text-base">
                      सरल व्याख्या · Editorial Clarification
                    </h3>
                    <p className="text-[11px] text-dharma-muted">
                      प्रसंग, भावार्थ एवं सुगम बोध
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExplanationExpanded((prev) => !prev)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dharma-border text-dharma-muted transition hover:bg-dharma-panel sm:hidden"
                  aria-label={explanationExpanded ? 'संक्षिप्त करें' : 'विस्तार करें'}
                >
                  {explanationExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              {explanationExpanded && (
                <div className="mt-4">
                  <p
                    className={`whitespace-pre-line text-dharma-text ${translationFontSizeClass} ${lineSpacingClass}`}
                  >
                    {verse.explanation}
                  </p>
                </div>
              )}
            </article>
          )}

          {/* SECTION 8: MODERN REFLECTION */}
          {verse.lifeLesson && (
            <article
              id="modern-reflection"
              aria-label="समकालीन प्रासंगिकता"
              className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 shadow-sm transition dark:bg-emerald-950/15 sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Compass className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-dharma-text sm:text-base">
                      समकालीन प्रासंगिकता · Modern Reflection & Practical Dharma
                    </h3>
                    <p className="text-[11px] text-dharma-muted">
                      आधुनिक जीवन, निर्णय-क्षमता एवं मानसिक समत्व
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReflectionExpanded((prev) => !prev)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dharma-border text-dharma-muted transition hover:bg-dharma-panel sm:hidden"
                  aria-label={reflectionExpanded ? 'संक्षिप्त करें' : 'विस्तार करें'}
                >
                  {reflectionExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              {reflectionExpanded && (
                <div className="mt-4">
                  <p
                    className={`whitespace-pre-line text-dharma-text ${translationFontSizeClass} ${lineSpacingClass}`}
                  >
                    {verse.lifeLesson}
                  </p>
                </div>
              )}
            </article>
          )}

          {/* SECTION 9: RESEARCH NOTE */}
          {verse.science && (
            <article
              id="research-note"
              aria-label="शोध एवं वैज्ञानिक दृष्टि"
              className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-5 shadow-sm transition dark:bg-indigo-950/15 sm:p-7"
            >
              <div className="flex items-center justify-between border-b border-indigo-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    <Atom className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-serif text-sm font-bold text-dharma-text sm:text-base">
                      शोध एवं वैज्ञानिक दृष्टि · Scholarly Research Note
                    </h3>
                    <p className="text-[11px] text-dharma-muted">
                      मनोविज्ञान, संज्ञानात्मक विज्ञान एवं पुरातात्त्विक अध्ययन
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setResearchExpanded((prev) => !prev)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-dharma-border text-dharma-muted transition hover:bg-dharma-panel sm:hidden"
                  aria-label={researchExpanded ? 'संक्षिप्त करें' : 'विस्तार करें'}
                >
                  {researchExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
              </div>

              {researchExpanded && (
                <div className="mt-4">
                  <p
                    className={`whitespace-pre-line text-dharma-text ${translationFontSizeClass} ${lineSpacingClass}`}
                  >
                    {verse.science}
                  </p>
                </div>
              )}
            </article>
          )}

        </div>
      </main>

      {/* ─── 4. MOBILE STICKY BOTTOM VERSE NAVIGATION ───────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-dharma-border/80 bg-dharma-bg/95 backdrop-blur-md transition-colors sm:hidden">
        <div className="flex h-16 items-center justify-between gap-3 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {prevVerse ? (
            <Link
              href={prevVerse.href}
              className="inline-flex h-11 min-w-[48px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-card px-3 text-sm font-semibold text-dharma-text active:scale-95"
              aria-label="Previous Verse"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="ml-1 text-xs">पिछला</span>
            </Link>
          ) : (
            <div className="w-16" />
          )}

          {/* Direct Verse Selector Pill on Mobile */}
          <button
            type="button"
            onClick={() => setVerseSelectorOpen(true)}
            className="inline-flex h-11 items-center gap-1.5 rounded-full border border-saffron-500/40 bg-saffron-500/10 px-4 text-xs font-bold text-saffron-800 dark:text-saffron-300 active:scale-95"
          >
            <span className="font-devanagari">
              श्लोक {toAsciiDigits(verse.number)} / {toAsciiDigits(totalVersesInChapter)}
            </span>
            <ChevronUp className="h-3.5 w-3.5 opacity-70" />
          </button>

          {nextVerse ? (
            <Link
              href={nextVerse.href}
              className="inline-flex h-11 min-w-[48px] items-center justify-center rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 px-3 text-sm font-semibold text-white shadow-sm active:scale-95"
              aria-label="Next Verse"
            >
              <span className="mr-1 text-xs">अगला</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={`/scripture/${scriptureId}/chapter/${chapterId}`}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-dharma-border bg-dharma-card px-3 text-xs font-semibold text-dharma-text"
            >
              अध्याय समाप्त
            </Link>
          )}
        </div>
      </div>

      {/* ─── 5. READER SETTINGS SIDE PANEL / BOTTOM SHEET ───────────────────── */}
      <AnimatePresence>
        {settingsOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSettingsOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />

            <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="flex w-screen max-w-md flex-col border-l border-dharma-border bg-dharma-panel shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-dharma-border px-5 py-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-saffron-600" />
                    <h2 className="font-serif text-lg font-bold text-dharma-text">
                      पठन व्यवस्था · Reader Settings
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(false)}
                    className="rounded-lg p-1.5 text-dharma-muted hover:bg-dharma-panel-muted hover:text-dharma-text"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex-1 space-y-6 overflow-y-auto p-5">
                  <div>
                    <p className="mb-2.5 block text-xs font-bold uppercase tracking-wide text-dharma-muted">
                      रंग विषय · Themes (4 Themes)
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'day' as Theme, label: THEME_NAMES.day.name, desc: THEME_NAMES.day.hi, bg: '#fdfbf7', border: '#e8e3db' },
                        { id: 'sunset' as Theme, label: THEME_NAMES.sunset.name, desc: THEME_NAMES.sunset.hi, bg: '#fff4e5', border: '#ecc9a7' },
                        { id: 'paper' as Theme, label: THEME_NAMES.paper.name, desc: THEME_NAMES.paper.hi, bg: '#f5ede0', border: '#ded1bd' },
                        { id: 'night' as Theme, label: THEME_NAMES.night.name, desc: THEME_NAMES.night.hi, bg: '#090908', border: '#312b25' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => updateSetting('theme', t.id)}
                          className={`flex items-center gap-3 rounded-xl border p-2.5 text-left transition ${
                            settings.theme === t.id
                              ? 'border-saffron-500 ring-2 ring-saffron-400/40'
                              : 'border-dharma-border hover:border-dharma-muted'
                          }`}
                        >
                          <span
                            className="h-7 w-7 rounded-full border shadow-inner"
                            style={{ backgroundColor: t.bg, borderColor: t.border }}
                          />
                          <div>
                            <span className="block text-xs font-bold text-dharma-text">
                              {t.label}
                            </span>
                            <span lang="hi" className="block text-[10px] text-dharma-muted">
                              {t.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-dharma-muted">
                        संस्कृत फ़ॉन्ट आकार · Sanskrit Size
                      </span>
                      <span className="font-devanagari text-xs font-semibold text-saffron-700">
                        {settings.sanskritFontSize.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => updateSetting('sanskritFontSize', sz)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${
                            settings.sanskritFontSize === sz
                              ? 'border-saffron-500 bg-saffron-600 text-white'
                              : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300'
                          }`}
                        >
                          {sz === 'sm' ? 'छोटा' : sz === 'md' ? 'मध्यम' : sz === 'lg' ? 'बड़ा' : 'विशाल'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wide text-dharma-muted">
                        अनुवाद फ़ॉन्ट आकार · Translation Size
                      </span>
                      <span className="text-xs font-semibold text-saffron-700">
                        {settings.translationFontSize.toUpperCase()}
                      </span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => updateSetting('translationFontSize', sz)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${
                            settings.translationFontSize === sz
                              ? 'border-saffron-500 bg-saffron-600 text-white'
                              : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300'
                          }`}
                        >
                          {sz === 'sm' ? '15px' : sz === 'md' ? '17px' : sz === 'lg' ? '19px' : '22px'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-xs font-bold uppercase tracking-wide text-dharma-muted">
                      पंक्ति अंतराल · Line Spacing
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {(['compact', 'normal', 'relaxed', 'loose'] as const).map((sp) => (
                        <button
                          key={sp}
                          type="button"
                          onClick={() => updateSetting('lineSpacing', sp)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${
                            settings.lineSpacing === sp
                              ? 'border-saffron-500 bg-saffron-600 text-white'
                              : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300'
                          }`}
                        >
                          {sp === 'compact'
                            ? 'सघन'
                            : sp === 'normal'
                            ? 'सामान्य'
                            : sp === 'relaxed'
                            ? 'विस्तृत'
                            : 'प्रशस्त'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 block text-xs font-bold uppercase tracking-wide text-dharma-muted">
                      पठन विस्तार · Reading Width
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {(['narrow', 'standard', 'wide'] as const).map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => updateSetting('readingWidth', w)}
                          className={`rounded-xl border py-2 text-xs font-semibold transition ${
                            settings.readingWidth === w
                              ? 'border-saffron-500 bg-saffron-600 text-white'
                              : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300'
                          }`}
                        >
                          {w === 'narrow' ? 'संकीर्ण (Narrow)' : w === 'standard' ? 'मानक (Standard)' : 'चौड़ा (Wide)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-dharma-border bg-dharma-card/60 p-4">
                    <span className="block text-xs font-bold uppercase tracking-wide text-dharma-muted">
                      सामग्री नियंत्रण · Visibility Toggles
                    </span>

                    <label className="flex cursor-pointer items-center justify-between py-1">
                      <span className="text-sm font-medium text-dharma-text">
                        रोमन लिप्यन्तरण दिखाएँ (IAST)
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.showTransliteration}
                        onChange={(e) => updateSetting('showTransliteration', e.target.checked)}
                        className="h-4 w-4 rounded text-saffron-600 focus:ring-saffron-500"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between py-1">
                      <span className="text-sm font-medium text-dharma-text">
                        हिन्दी भाषार्थ दिखाएँ
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.showHindi}
                        onChange={(e) => updateSetting('showHindi', e.target.checked)}
                        className="h-4 w-4 rounded text-saffron-600 focus:ring-saffron-500"
                      />
                    </label>

                    <label className="flex cursor-pointer items-center justify-between py-1">
                      <span className="text-sm font-medium text-dharma-text">
                        English Translation
                      </span>
                      <input
                        type="checkbox"
                        checked={settings.showEnglish}
                        onChange={(e) => updateSetting('showEnglish', e.target.checked)}
                        className="h-4 w-4 rounded text-saffron-600 focus:ring-saffron-500"
                      />
                    </label>

                    <label htmlFor="reader-reduced-motion" aria-label="मंद गति (Reduced Motion)" className="flex cursor-pointer items-center justify-between border-t border-dharma-border/60 pt-2">
                      <span className="block">
                        <span className="block text-sm font-medium text-dharma-text">
                          मंद गति (Reduced Motion)
                        </span>
                        <span className="text-[11px] text-dharma-muted">
                          एनिमेशन व गतिशीलता न्यूनतम करें
                        </span>
                      </span>
                      <input
                        id="reader-reduced-motion"
                        type="checkbox"
                        checked={settings.reducedMotion}
                        onChange={(e) => updateSetting('reducedMotion', e.target.checked)}
                        className="h-4 w-4 rounded text-saffron-600 focus:ring-saffron-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-dharma-border p-4">
                  <button
                    type="button"
                    onClick={resetSettings}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dharma-border py-2.5 text-xs font-semibold text-dharma-muted transition hover:bg-dharma-panel-muted hover:text-dharma-text"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>मूल व्यवस्था पुनर्स्थापित करें · Reset to Defaults</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 6. CHAPTER SELECTOR MODAL ─────────────────────────────────────── */}
      <AnimatePresence>
        {chapterSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setChapterSelectorOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[80vh] w-full max-w-xl overflow-hidden rounded-2xl border border-dharma-border bg-dharma-panel shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-dharma-border px-6 py-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-dharma-text">
                    अध्याय चुनें · Select Chapter
                  </h3>
                  <p className="text-xs text-dharma-muted">{scriptureTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setChapterSelectorOpen(false)}
                  className="rounded-lg p-1.5 text-dharma-muted hover:bg-dharma-panel-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[60vh] space-y-1 overflow-y-auto p-4">
                {chaptersList.map((ch) => (
                  <Link
                    key={ch.id}
                    href={readHref(scriptureId, ch.id, 1)}
                    onClick={() => setChapterSelectorOpen(false)}
                    className={`flex items-center justify-between rounded-xl p-3 transition ${
                      ch.id === chapterId
                        ? 'border border-saffron-500 bg-saffron-500/10 font-bold text-saffron-800 dark:text-saffron-300'
                        : 'text-dharma-text hover:bg-dharma-panel-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-dharma-card font-devanagari text-xs font-bold text-dharma-muted">
                        {toAsciiDigits(ch.id)}
                      </span>
                      <div>
                        <span className="block font-devanagari text-sm">
                          {ch.titleSanskrit || ch.title}
                        </span>
                        {ch.title && ch.titleSanskrit && (
                          <span className="block text-xs text-dharma-muted">
                            {ch.title}
                          </span>
                        )}
                      </div>
                    </div>
                    {ch.verseCount ? (
                      <span className="text-xs text-dharma-muted">
                        {ch.verseCount} श्लोक
                      </span>
                    ) : null}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 7. DIRECT VERSE SELECTOR MODAL ────────────────────────────────── */}
      <AnimatePresence>
        {verseSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setVerseSelectorOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl border border-dharma-border bg-dharma-panel shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-dharma-border px-6 py-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-dharma-text">
                    श्लोक चुनें · Select Verse
                  </h3>
                  <p className="text-xs text-dharma-muted">
                    अध्याय {chapterId}: {chapterTitleSanskrit || chapterTitle} ({totalVersesInChapter} श्लोक)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setVerseSelectorOpen(false)}
                  className="rounded-lg p-1.5 text-dharma-muted hover:bg-dharma-panel-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4">
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">
                  {allVerseNumbers.map((num) => {
                    const isCurrent = String(num) === String(verse.number);
                    return (
                      <Link
                        key={String(num)}
                        href={readHref(scriptureId, chapterId, num)}
                        onClick={() => setVerseSelectorOpen(false)}
                        className={`flex h-11 items-center justify-center rounded-xl font-devanagari text-sm font-bold transition ${
                          isCurrent
                            ? 'bg-gradient-to-br from-saffron-600 to-amber-600 text-white shadow-md'
                            : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400 hover:text-saffron-700'
                        }`}
                      >
                        {toAsciiDigits(num)}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 8. PRIVATE NOTE MODAL ─────────────────────────────────────────── */}
      <AnimatePresence>
        {noteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNoteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl border border-dharma-border bg-dharma-panel p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between border-b border-dharma-border pb-3">
                <div className="flex items-center gap-2">
                  <StickyNote className="h-5 w-5 text-amber-600" />
                  <h3 className="font-serif text-lg font-bold text-dharma-text">
                    निजी स्वाध्याय टिप्पणी · Private Study Note
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setNoteModalOpen(false)}
                  className="rounded-lg p-1 text-dharma-muted hover:bg-dharma-panel-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-3 text-xs text-dharma-muted">
                श्लोक {chapterId}.{verse.number} पर अपने विचार, गुरु उपदेश अथवा प्रश्न यहाँ लिखें। यह केवल आपके इस उपकरण (Browser) में सुरक्षित रहेगा।
              </p>

              <textarea
                value={privateNote}
                onChange={(e) => setPrivateNote(e.target.value)}
                placeholder="यहाँ अपनी निजी टिप्पणी लिखें..."
                rows={6}
                className="w-full rounded-xl border border-dharma-border bg-dharma-card p-3 text-sm text-dharma-text placeholder:text-dharma-muted focus:border-amber-500 focus:outline-none"
              />

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[11px] text-dharma-muted">
                  {privateNote.length} वर्ण
                </span>
                <div className="flex gap-2">
                  {privateNote && (
                    <button
                      type="button"
                      onClick={() => setPrivateNote('')}
                      className="rounded-xl border border-dharma-border px-3 py-2 text-xs font-semibold text-dharma-muted hover:bg-dharma-panel-muted"
                    >
                      साफ़ करें
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="rounded-xl bg-gradient-to-r from-amber-600 to-saffron-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-amber-700 hover:to-saffron-700"
                  >
                    सहेजें · Save Note
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 9. SHARE MODAL ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {shareModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShareModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-dharma-border bg-dharma-panel p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between border-b border-dharma-border pb-3">
                <div className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-saffron-600" />
                  <h3 className="font-serif text-lg font-bold text-dharma-text">
                    श्लोक साझा करें · Share Verse
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShareModalOpen(false)}
                  className="rounded-lg p-1 text-dharma-muted hover:bg-dharma-panel-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    handleCopyWithReference();
                    setShareModalOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-dharma-border bg-dharma-card p-3 text-left transition hover:border-saffron-400"
                >
                  <span className="text-sm font-semibold text-dharma-text">
                    लिंक व संदर्भ कॉपी करें
                  </span>
                  <Copy className="h-4 w-4 text-dharma-muted" />
                </button>

                {typeof window !== 'undefined' && (
                  <>
                    <a
                      href={whatsappHref()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-left transition hover:bg-emerald-500/20"
                    >
                      <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                        WhatsApp पर साझा करें
                      </span>
                      <ExternalLink className="h-4 w-4 text-emerald-700" />
                    </a>

                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `${scriptureTitle} ${chapterId}.${verse.number}:\n\n${verse.hindi || verse.translation || ''}\n\n`,
                      )}&url=${encodeURIComponent(window.location.href)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-between rounded-xl border border-sky-500/40 bg-sky-500/10 p-3 text-left transition hover:bg-sky-500/20"
                    >
                      <span className="text-sm font-semibold text-sky-800 dark:text-sky-300">
                        X (Twitter) पर साझा करें
                      </span>
                      <ExternalLink className="h-4 w-4 text-sky-700" />
                    </a>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 10. TEXTUAL ERROR REPORT MODAL ─────────────────────────────────── */}
      <AnimatePresence>
        {errorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setErrorModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl border border-dharma-border bg-dharma-panel p-6 shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-between border-b border-dharma-border pb-3">
                <div className="flex items-center gap-2">
                  <Flag className="h-5 w-5 text-rose-600" />
                  <h3 className="font-serif text-lg font-bold text-dharma-text">
                    पाठ अशुद्धि रिपोर्ट · Report Textual Issue
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorModalOpen(false)}
                  className="rounded-lg p-1 text-dharma-muted hover:bg-dharma-panel-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {errorSubmitted ? (
                <div className="py-6 text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600">
                    <Check className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif font-bold text-dharma-text">
                    धन्यवाद! आपका सुझाव दर्ज हुआ
                  </h4>
                  <p className="mt-1 text-xs text-dharma-muted">
                    शास्त्र शुद्धि में सहयोग के लिए हम आपके आभारी हैं।
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitError} className="space-y-4">
                  <div className="text-xs text-dharma-muted">
                    {scriptureTitle} · अध्याय {chapterId}, श्लोक {verse.number}
                  </div>

                  <div>
                    <label htmlFor="reader-error-type" className="mb-1 block text-xs font-semibold text-dharma-text">
                      अशुद्धि का प्रकार
                    </label>
                    <select
                      id="reader-error-type"
                      value={errorType}
                      onChange={(e) => setErrorType(e.target.value)}
                      className="w-full rounded-xl border border-dharma-border bg-dharma-card p-2.5 text-xs text-dharma-text focus:border-saffron-500 focus:outline-none"
                    >
                      <option value="sanskrit-typo">संस्कृत वर्तनी / संधि अशुद्धि</option>
                      <option value="transliteration-flaw">लिप्यन्तरण (IAST) त्रुटि</option>
                      <option value="hindi-translation">हिन्दी भाषार्थ में विसंगति</option>
                      <option value="english-translation">English Translation Inaccuracy</option>
                      <option value="word-meaning">पदच्छेद अथवा शब्दार्थ में त्रुटि</option>
                      <option value="missing-verse">श्लोक क्रम अथवा छूटा हुआ पाठ</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reader-error-details" className="mb-1 block text-xs font-semibold text-dharma-text">
                      विस्तृत विवरण व शुद्ध पाठ
                    </label>
                    <textarea
                      id="reader-error-details"
                      required
                      value={errorDetails}
                      onChange={(e) => setErrorDetails(e.target.value)}
                      placeholder="कृपया त्रुटिपूर्ण शब्द व आपके अनुसार शुद्ध पाठ का सन्दर्भ यहाँ लिखें..."
                      rows={4}
                      className="w-full rounded-xl border border-dharma-border bg-dharma-card p-2.5 text-xs text-dharma-text placeholder:text-dharma-muted focus:border-saffron-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setErrorModalOpen(false)}
                      className="rounded-xl border border-dharma-border px-3 py-2 text-xs font-semibold text-dharma-muted hover:bg-dharma-panel-muted"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      className="rounded-xl bg-gradient-to-r from-saffron-600 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:from-saffron-700 hover:to-rose-700"
                    >
                      जमा करें · Submit
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 11. TOAST NOTIFICATION ────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 transform rounded-full border border-saffron-500/40 bg-dharma-card/95 px-5 py-2.5 text-xs font-semibold text-dharma-text shadow-xl backdrop-blur sm:bottom-8"
          >
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-saffron-500" />
              <span>{toastMessage}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
