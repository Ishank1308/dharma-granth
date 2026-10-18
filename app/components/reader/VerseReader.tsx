'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MotionConfig } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Copy,
  Code2,
  Download,
  Flag,
  Focus,
  MessageCircle,
  Maximize2,
  Minimize2,
  Share2,
  SlidersHorizontal,
  StickyNote,
} from 'lucide-react';
import { useTheme } from '@/app/components/ThemeProvider';
import { toDevanagari } from '@/lib/verse-format';
import { whatsappShareUrl } from '@/lib/whatsapp';
import { downloadVerseCardPng } from '@/lib/verse-card-png';
import { EmbedVerseDialog } from '@/app/components/EmbedVerseDialog';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { useReaderSettings } from '@/lib/useReaderSettings';
import { triggerTactileFeedback } from '@/lib/haptics';
import {
  REPORT_KINDS,
  buildCopyText,
  buildDownloadMarkdown,
  buildIssueUrl,
  isBookmarked,
  toggleBookmark,
  verseReference,
  type ReaderProvenance,
  type ReaderRef,
  type ReaderVerseText,
  type ReportKind,
} from '@/lib/reader-actions';
import { ReaderDialog } from './ReaderDialog';
import { ReaderSettingsPanel } from './ReaderSettingsPanel';
import { ReaderLayers } from './ReaderLayers';
import { SacredShareModal, type SacredShareData } from '@/app/components/share/SacredShareModal';
import { useSwipeGesture } from '@/lib/useSwipeGesture';
import { MobileSwipeIndicator } from './MobileSwipeIndicator';
import { MobileReadingProgress } from './MobileReadingProgress';
import { MobileVerseCarousel } from './MobileVerseCarousel';
import { MobileAudioPill } from './MobileAudioPill';
import { verseCount as fmtVerses } from '@/lib/format';
import { track } from '@/lib/analytics';
import { logActivity } from '@/lib/activity-log';
import { isHistoryPaused } from '@/lib/reading-history';

export interface ReaderChapter {
  id: number;
  title: string;
  titleSanskrit?: string;
  verseCount?: number;
  href: string;
}

export interface ReaderVerseLink {
  number: number | string;
  href: string;
}

export interface VerseReaderProps {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  chapterId: number;
  chapterTitle: string;
  scriptureHref: string;
  chapterHref: string;
  /** Absolute URL of this page, for copy / share / download / reports. */
  pageUrl: string;
  chapters: ReaderChapter[];
  /** Every verse of the chapter, in order, for the direct selector. */
  verses: ReaderVerseLink[];
  index: number;
  verse: ReaderVerseText;
  provenance: ReaderProvenance;
  prev?: ReaderVerseLink;
  next?: ReaderVerseLink;
  /** Related concepts, topics and cross-references, rendered under the layers. */
  children?: ReactNode;
}

const WIDTH = { narrow: 'max-w-xl', standard: 'max-w-3xl', wide: 'max-w-5xl' } as const;

const iconBtn =
  'focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-dharma-border bg-dharma-card/80 text-dharma-muted transition hover:border-saffron-400 hover:text-saffron-800 dark:hover:text-saffron-300';

const actionBtn =
  'focus-ring inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-xl border border-dharma-border bg-dharma-card px-3.5 text-sm font-semibold text-dharma-text transition hover:border-saffron-400 hover:text-saffron-800 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-saffron-300';

export function VerseReader(props: VerseReaderProps) {
  const {
    scriptureId, scriptureTitle, scriptureTitleSanskrit, chapterId, chapterTitle, scriptureHref, chapterHref,
    pageUrl, chapters, verses, index, verse, provenance, prev, next, children,
  } = props;

  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { settings, update, reset, reducedMotion } = useReaderSettings();
  const { getNote, setNote } = useStudyProgress();

  const ref: ReaderRef = useMemo(
    () => ({ scriptureId, scriptureTitle, scriptureTitleSanskrit, chapterId, chapterTitle, url: pageUrl }),
    [scriptureId, scriptureTitle, scriptureTitleSanskrit, chapterId, chapterTitle, pageUrl],
  );
  const label = verseReference(ref, verse);

  /* Reader mode: the site navand companion dock step aside (see globals.css). */
  useEffect(() => {
    document.documentElement.setAttribute('data-reader', '');
    return () => document.documentElement.removeAttribute('data-reader');
  }, []);

  /* ── Dialog state ── */
  const [dialog, setDialog] = useState<null | 'settings' | 'chapters' | 'verses' | 'note' | 'report' | 'embed'>(null);
  const close = useCallback(() => setDialog(null), []);

  /* ── Toast ── */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const say = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  /* ── Bookmark ── */
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(isBookmarked(ref, verse)), [ref, verse]);
  const onBookmark = () => {
    const state = toggleBookmark(ref, verse);
    if (state === null) return say('Could not save: browser storage is unavailable.');
    setSaved(state);
    if (state) {
      track('verse_saved', { scriptureId });
      logActivity({ kind: 'saved', ref: `${scriptureId}:${chapterId}:${verse.number}` }, { paused: isHistoryPaused() });
    }
    triggerTactileFeedback(state ? 'success' : 'medium', state ? 'success' : 'softTap');
    say(state ? 'Verse saved' : 'Removed from saved verses');
  };

  /* ── Sacred Share Card Modal ── */
  const [showShareModal, setShowShareModal] = useState(false);
  const shareData: SacredShareData = useMemo(
    () => ({
      title: scriptureTitle,
      reference: label,
      sanskrit: (verse.sanskrit ?? '').trim(),
      transliteration: verse.transliteration?.trim(),
      translation: (verse.translation ?? '').trim(),
      hindi: verse.hindi?.trim(),
      quote: verse.reflection || (verse.hindi ? verse.hindi.slice(0, 140) : undefined),
      url: pageUrl,
    }),
    [scriptureTitle, label, verse, pageUrl]
  );

  /* ── Mobile Verse Carousel Drawer ── */
  const [carouselOpen, setCarouselOpen] = useState(false);

  /* ── Mobile Touch Swipe Gesture Engine ── */
  const { gestureState, handlers } = useSwipeGesture({
    onSwipeNext: () => {
      if (next) router.push(next.href);
    },
    onSwipePrev: () => {
      if (prev) router.push(prev.href);
    },
    canNext: Boolean(next),
    canPrev: Boolean(prev),
    disabled: Boolean(dialog || carouselOpen || showShareModal),
  });

  /* ── Copy / share / download ── */
  const show = { transliteration: settings.showTransliteration, hindi: settings.showHindi, english: settings.showEnglish };
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildCopyText(ref, verse, provenance, show));
      say('Copied with reference');
    } catch {
      say('Could not copy. Select the text and copy it manually.');
    }
  };
  const onShare = () => {
    setShowShareModal(true);
  };
  const whatsappHref = whatsappShareUrl({
    heading: `${label} · Dharma Granth`,
    body: [(verse.sanskrit ?? '').trim(), (verse.hindi ?? verse.translation ?? '').trim()],
    url: pageUrl,
  });
  const onDownloadImage = async () => {
    try {
      await downloadVerseCardPng({
        reference: `${label}`,
        sanskrit: verse.sanskrit,
        translation: verse.hindi || verse.translation,
        fileName: `dharmagranth-${scriptureId}-${chapterId}-${verse.number}.png`,
      });
      say('Image downloaded');
    } catch {
      say('Could not draw the image');
    }
  };
  const onDownload = () => {
    const blob = new Blob([buildDownloadMarkdown(ref, verse, provenance)], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptureId}-${chapterId}-${verse.number}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    say('Verse downloaded');
  };

  /* ── Private note (same store as the rest of the app) ── */
  const noteText = getNote(scriptureId, chapterId, String(verse.number))?.text ?? '';
  const [draft, setDraft] = useState('');
  const openNote = () => {
    setDraft(noteText);
    setDialog('note');
  };
  const saveNote = () => {
    setNote(scriptureId, chapterId, String(verse.number), draft.trim());
    close();
    say(draft.trim() ? 'Note saved on this device' : 'Note removed');
  };

  /* ── Report ── */
  const [kind, setKind] = useState<ReportKind>('sanskrit');
  const [details, setDetails] = useState('');
  const issueUrl = buildIssueUrl(ref, verse, kind, details);

  /* ── Verse picker ── */
  const [pick, setPick] = useState('');
  const visibleVerses = pick.trim() ? verses.filter((v) => String(v.number).startsWith(pick.trim())) : verses;

  /* ── Arrow-key navigation (never while typing or with a dialog open) ── */
  useEffect(() => {
    if (dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable)) return;
      if (e.key === 'ArrowLeft' && prev) router.push(prev.href);
      if (e.key === 'ArrowRight' && next) router.push(next.href);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dialog, prev, next, router]);

  const total = verses.length;
  const SIZE_ORDER = ['sm', 'md', 'lg', 'xl'] as const;
  const stepSize = (d: number) => {
    const i = SIZE_ORDER.indexOf(settings.sanskritSize);
    const n = SIZE_ORDER[Math.min(3, Math.max(0, i + d))];
    update('sanskritSize', n);
    update('translationSize', n);
  };
  const toggleFullscreen = () => {
    try {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen();
    } catch {
      say('Full screen is not available in this browser.');
    }
  };
  const percent = Math.round(((index + 1) / Math.max(1, total)) * 100);
  const sanskritName = scriptureTitleSanskrit ?? scriptureTitle;

  const otherChapter = (href: string | undefined) => {
    const match = href ? /\/chapter\/(\d+)(?:\/|$)/.exec(href) : null;
    if (!match) return undefined;
    const id = Number(match[1]);
    return id !== chapterId ? id : undefined;
  };

  const navLink = (target: ReaderVerseLink | undefined, dir: 'prev' | 'next', size: 'bar' | 'row') => {
    const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
    const text = dir === 'prev' ? 'Previous' : 'Next';
    const hi = dir === 'prev' ? 'पिछला' : 'अगला';
    const base =
      size === 'bar'
        ? 'min-h-[48px] px-3'
        : 'min-h-[52px] px-4';
    if (!target) return <span className={size === 'bar' ? 'w-[88px]' : 'w-40'} aria-hidden="true" />;
    const crosses = otherChapter(target.href);
    const hiLabel = crosses != null ? (dir === 'prev' ? 'पिछला अध्याय' : 'अगला अध्याय') : hi;
    const verseLine = crosses != null
      ? (size === 'bar'
        ? `${toDevanagari(crosses)}.${toDevanagari(target.number)}`
        : `अध्याय ${toDevanagari(crosses)}, श्लोक ${toDevanagari(target.number)}`)
      : `श्लोक ${toDevanagari(target.number)}`;
    return (
      <Link
        href={target.href}
        rel={dir}
        onClick={() => triggerTactileFeedback('selection', 'click')}
        aria-label={crosses != null ? `${hiLabel}, श्लोक ${crosses}.${target.number}` : `${text} verse, ${target.number}`}
        className={`focus-ring inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card font-semibold text-dharma-text transition hover:border-saffron-400 ${base} ${dir === 'next' ? 'flex-row-reverse text-right' : ''}`}
      >
        <Icon className="h-4 w-4 shrink-0 text-saffron-700 dark:text-saffron-300" aria-hidden="true" />
        <span className="leading-tight">
          <span className="block text-[11px] font-medium text-dharma-muted">
            <span lang="hi" className="font-devanagari">{hiLabel}</span>{crosses == null ? ` · ${text}` : ''}
          </span>
          <span lang="hi" className="font-devanagari text-sm">{verseLine}</span>
        </span>
      </Link>
    );
  };

  return (
    <MotionConfig reducedMotion={reducedMotion ? 'always' : 'user'}>
      <div
        data-contrast={settings.contrast}
        data-hide-decor={settings.hideDecor || settings.focusMode || settings.liteMode ? '' : undefined}
        data-focus={settings.focusMode ? '' : undefined}
        data-lite={settings.liteMode ? '' : undefined}
        data-tone={settings.tone}
        className="reader-root min-h-screen bg-dharma-bg text-dharma-text selection:bg-saffron-500/25"
      >
        <style>{`
          .reader-root[data-contrast=high]{--dharma-muted:var(--dharma-text);--dharma-border:currentColor}
          .reader-root[data-contrast=high] .understand-fade{border-width:2px}
          .reader-root[data-hide-decor] .understand-fade{animation:none}
          .reader-root[data-tone=paper]{--dharma-bg:#ffffff;--dharma-text:#1c1917}
          .reader-root[data-tone=sepia]{--dharma-bg:#f4ecd8;--dharma-text:#3b2f1e}
          .reader-root[data-tone=night]{--dharma-bg:#101010;--dharma-text:#ece7dd}
          .reader-root[data-focus] aside,.reader-root[data-focus] [data-focus-hide]{display:none!important}
          .reader-root[data-lite] aside,.reader-root[data-lite] [data-focus-hide]{display:none!important}
          .reader-root[data-hide-decor] h3 svg,.reader-root[data-hide-decor] [data-decor]{display:none}
        `}</style>
        {/* 1 · Sticky reader header */}
        <header className="sticky top-0 z-40 border-b border-dharma-border/80 bg-dharma-bg/95 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
            <Link href={scriptureHref} aria-label={`Back to ${scriptureTitle}`} className={iconBtn}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>

            <div className="min-w-0 flex-1">
              <p lang="sa" className="truncate font-devanagari text-sm font-semibold leading-tight text-dharma-text">
                {sanskritName}
              </p>
              <button
                type="button"
                onClick={() => setDialog('chapters')}
                aria-haspopup="dialog"
                className="focus-ring relative -my-3 -ml-1 inline-flex min-h-[44px] max-w-full items-center gap-1 rounded-md px-1 text-xs text-dharma-muted hover:text-saffron-800 dark:hover:text-saffron-300"
              >
                <span className="truncate">
                  {scriptureTitle} · Chapter {chapterId}: {chapterTitle}
                </span>
                <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </button>
            </div>

            <div className="hidden w-40 sm:block" role="group" aria-label="Reading progress">
              <p className="text-right text-xs font-medium text-dharma-muted">
                Verse {index + 1} of {total}
              </p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-dharma-border/70" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label="Progress through this chapter">
                <div className="h-full rounded-full bg-saffron-600" style={{ width: `${percent}%` }} />
              </div>
            </div>

            <button type="button" data-focus-hide onClick={onBookmark} aria-pressed={saved} aria-label={saved ? 'Remove bookmark' : 'Bookmark this verse'} className={`${iconBtn} ${saved ? '!border-saffron-600 !text-saffron-800 dark:!text-saffron-300' : ''}`}>
              {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => update('liteMode', !settings.liteMode)}
              aria-pressed={settings.liteMode}
              aria-label={settings.liteMode ? 'Exit reading lite mode' : 'Reading Lite Mode (विशुद्ध पाठ)'}
              title={settings.liteMode ? 'Exit reading lite mode' : 'Reading Lite Mode (विशुद्ध पाठ)'}
              className={`${iconBtn} ${settings.liteMode ? '!border-saffron-600 !text-saffron-800 dark:!text-saffron-300' : ''}`}
            >
              <span className="font-serif text-[11px] font-bold">LITE</span>
            </button>
            <button type="button" onClick={() => update('focusMode', !settings.focusMode)} aria-pressed={settings.focusMode} aria-label={settings.focusMode ? 'Exit focus mode' : 'Enter focus mode'} className={`${iconBtn} ${settings.focusMode ? '!border-saffron-600 !text-saffron-800 dark:!text-saffron-300' : ''}`}>
              <Focus className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setDialog('settings')} aria-haspopup="dialog" aria-label="Reader settings" className={iconBtn}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <div className="h-0.5 bg-dharma-border/50 sm:hidden" aria-hidden="true">
            <div className="h-full bg-saffron-600" style={{ width: `${percent}%` }} />
          </div>
        </header>

        {/* Mobile Reading Progress Bar */}
        <MobileReadingProgress
          currentVerseNumber={verse.number}
          totalVerses={total}
          currentIndex={index}
          chapterTitle={chapterTitle}
        />

        {/* Tactile Edge Swipe Indicator */}
        <MobileSwipeIndicator
          gestureState={gestureState}
          prevNumber={prev && otherChapter(prev.href) != null ? `${otherChapter(prev.href)}.${prev.number}` : prev?.number}
          nextNumber={next && otherChapter(next.href) != null ? `${otherChapter(next.href)}.${next.number}` : next?.number}
        />

        <div className="mx-auto flex justify-center gap-8 xl:px-6" {...handlers}>
        {/* Left sidebar (wide screens): where you are in the chapter */}
        <aside aria-label="Chapter navigation" className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-60 shrink-0 self-start overflow-y-auto pt-8 xl:block">
          <p lang="hi" className="font-devanagari text-sm font-semibold text-dharma-text">{sanskritName}</p>
          <button type="button" onClick={() => setDialog('chapters')} aria-haspopup="dialog" className="focus-ring mt-0.5 min-h-[44px] w-full rounded-lg text-left text-sm text-dharma-muted hover:text-saffron-800 dark:hover:text-saffron-300">
            Chapter {chapterId}: {chapterTitle} <ChevronDown className="inline h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <p className="mt-2 text-xs font-medium text-dharma-muted">Verse {index + 1} of {total}</p>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-dharma-border/70" aria-hidden="true">
            <div className="h-full rounded-full bg-saffron-600" style={{ width: `${percent}%` }} />
          </div>
          <nav aria-label="Verses in this chapter" className="mt-4">
            <ul className="grid grid-cols-5 gap-1.5">
              {verses.map((v) => {
                const current = String(v.number) === String(verse.number);
                return (
                  <li key={String(v.number)}>
                    <Link
                      href={v.href}
                      aria-current={current ? 'true' : undefined}
                      aria-label={`Verse ${v.number}`}
                      className={`focus-ring flex h-11 items-center justify-center rounded-lg border text-xs font-semibold transition ${current ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-500'}`}
                    >
                      {v.number}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className={`min-w-0 flex-1 px-4 pb-32 pt-6 sm:pb-20 sm:pt-8 xl:px-0 ${WIDTH[settings.readingWidth]}`}>
          {/* 2 · Verse navigation (desktop; phones get the sticky bar below) */}
          <nav aria-label="Verse navigation" className="mb-6 hidden items-center justify-between gap-3 sm:flex">
            {navLink(prev, 'prev', 'row')}
            <button
              type="button"
              onClick={() => setDialog('verses')}
              aria-haspopup="dialog"
              className="focus-ring inline-flex min-h-[52px] flex-col items-center justify-center rounded-xl px-4 text-center transition hover:bg-dharma-card"
            >
              <span className="font-serif text-lg font-bold text-dharma-text">{label}</span>
              <span className="inline-flex items-center gap-1 text-xs text-dharma-muted">
                Verse {index + 1} of {total} · jump to verse <ChevronDown className="h-3 w-3" aria-hidden="true" />
              </span>
            </button>
            {navLink(next, 'next', 'row')}
          </nav>

          <h1 className="sr-only">{label}</h1>

          {settings.focusMode && (
            <div role="region" aria-label="Focus mode controls" className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-dharma-border bg-dharma-card/80 p-2 text-xs">
              <button type="button" onClick={() => update('focusMode', false)} className={actionBtn}>
                <Minimize2 className="h-4 w-4" aria-hidden="true" /> Exit focus mode
              </button>
              <div role="group" aria-label="Background tone" className="flex gap-1">
                {(['default', 'paper', 'sepia', 'night'] as const).map((t) => (
                  <button key={t} type="button" aria-pressed={settings.tone === t} onClick={() => update('tone', t)} className={`focus-ring min-h-[44px] rounded-xl border px-3 font-semibold capitalize ${settings.tone === t ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text'}`}>
                    {t === 'default' ? 'Site' : t}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Reading width" className="flex gap-1">
                {(['narrow', 'standard', 'wide'] as const).map((w) => (
                  <button key={w} type="button" aria-pressed={settings.readingWidth === w} onClick={() => update('readingWidth', w)} className={`focus-ring min-h-[44px] rounded-xl border px-3 font-semibold capitalize ${settings.readingWidth === w ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text'}`}>
                    {w}
                  </button>
                ))}
              </div>
              <div role="group" aria-label="Text size" className="flex gap-1">
                <button type="button" aria-label="Smaller text" onClick={() => stepSize(-1)} className={iconBtn}>A−</button>
                <button type="button" aria-label="Larger text" onClick={() => stepSize(1)} className={iconBtn}>A+</button>
              </div>
              <div role="group" aria-label="Line spacing" className="flex gap-1">
                {(['normal', 'relaxed', 'loose'] as const).map((l) => (
                  <button key={l} type="button" aria-pressed={settings.lineSpacing === l} onClick={() => update('lineSpacing', l)} className={`focus-ring min-h-[44px] rounded-xl border px-3 font-semibold capitalize ${settings.lineSpacing === l ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text'}`}>
                    {l}
                  </button>
                ))}
              </div>
              <button type="button" aria-pressed={settings.reducedMotion === true} onClick={() => update('reducedMotion', settings.reducedMotion === true ? null : true)} className={actionBtn}>
                Reduce motion
              </button>
              <button type="button" onClick={toggleFullscreen} className={actionBtn}>
                <Maximize2 className="h-4 w-4" aria-hidden="true" /> Full screen
              </button>
              <span role="status" className="ml-auto px-2 text-dharma-muted">Verse {index + 1} of {total} · {percent}% through the chapter</span>
            </div>
          )}


          {/* Actions */}
          {/* One swipeable row on phones keeps the verse near the top; it wraps from sm up. */}
          <div role="toolbar" aria-label="Verse actions" data-focus-hide className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            <button type="button" onClick={onBookmark} aria-pressed={saved} className={actionBtn}>
              {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
              {saved ? 'Saved' : 'Save'}
            </button>
            <button type="button" onClick={openNote} className={actionBtn}>
              <StickyNote className="h-4 w-4" aria-hidden="true" />
              {noteText ? 'Edit note' : 'Note'}
              {noteText && <span className="h-1.5 w-1.5 rounded-full bg-saffron-600" aria-label="has a note" />}
            </button>
            <button type="button" onClick={onCopy} className={actionBtn}>
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy
            </button>
            <Link href={`${chapterHref}#verse-${verse.number}`} className={actionBtn}>
              <ArrowRight className="h-4 w-4" aria-hidden="true" /> Open context
            </Link>
            <button
              type="button"
              onClick={onShare}
              className={`${actionBtn} border-saffron-500/50 bg-saffron-500/10 font-bold text-saffron-900 dark:text-saffron-200`}
              aria-label="Generate sacred verse card for WhatsApp / Instagram"
            >
              <Share2 className="h-4 w-4 text-saffron-600 dark:text-saffron-400" aria-hidden="true" />
              <span>Share Card</span>
            </button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className={actionBtn}
              aria-label="Share this verse on WhatsApp"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
            </a>
            <button type="button" onClick={onDownloadImage} className={actionBtn} aria-label="Download Image">
              <Download className="h-4 w-4" aria-hidden="true" /> Download Image
            </button>
            <button type="button" onClick={() => setDialog('embed')} aria-haspopup="dialog" className={actionBtn}>
              <Code2 className="h-4 w-4" aria-hidden="true" /> Embed
            </button>
            <button type="button" onClick={onDownload} className={actionBtn}>
              <Download className="h-4 w-4" aria-hidden="true" /> Download
            </button>
            <button type="button" onClick={() => setDialog('report')} className={actionBtn}>
              <Flag className="h-4 w-4" aria-hidden="true" /> Report error
            </button>
          </div>

          {/* 3 · Reader Mode Bar: [Quick] [Simple] [Deep] */}
          <div
            role="tablist"
            aria-label="Reading depth: Quick, Simple or Deep"
            className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dharma-border bg-dharma-card/70 p-2 shadow-sm"
          >
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              {(
                [
                  { id: 'quick', en: 'Quick', hi: 'संक्षेप', hint: '1-min core takeaway' },
                  { id: 'simple', en: 'Simple', hi: 'सरल', hint: 'Clear meaning & life example' },
                  { id: 'deep', en: 'Deep', hi: 'गहन', hint: 'Full padas, commentary & sources' },
                ] as const
              ).map((m) => {
                const active = settings.readerMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    role="tab"
                    id={`mode-${m.id}`}
                    aria-selected={active}
                    aria-controls="mode-panel"
                    tabIndex={active ? 0 : -1}
                    onKeyDown={(e) => {
                      const ids = ['quick', 'simple', 'deep'] as const;
                      const i = ids.indexOf(settings.readerMode as (typeof ids)[number]);
                      const n = e.key === 'ArrowRight' ? (i + 1) % 3 : e.key === 'ArrowLeft' ? (i + 2) % 3 : -1;
                      if (n < 0) return;
                      e.preventDefault();
                      e.stopPropagation();
                      update('readerMode', ids[n]);
                      setTimeout(() => document.getElementById(`mode-${ids[n]}`)?.focus(), 0);
                    }}
                    onClick={() => {
                      triggerTactileFeedback('light', 'softTap');
                      update('readerMode', m.id);
                      track('mode_selected', { mode: m.id });
                    }}
                    className={`focus-ring flex-1 sm:flex-none min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      active
                        ? 'bg-saffron-600 text-white shadow-sm'
                        : 'text-dharma-muted hover:text-dharma-text hover:bg-dharma-bg/80'
                    }`}
                  >
                    <span className="flex items-center justify-center gap-1.5">
                      <span lang="hi" className="font-devanagari">{m.hi}</span>
                      <span className="opacity-60">·</span>
                      <span>{m.en}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="hidden sm:inline-block text-xs text-dharma-muted pr-3">
              {settings.readerMode === 'quick' && 'त्वरित बोध · सार व व्यावहारिक प्रयोग'}
              {settings.readerMode === 'simple' && 'सुबोध व्याख्या · जीवन में प्रासंगिकता'}
              {settings.readerMode === 'deep' && 'गहन अध्ययन · पदच्छेद, भाष्य व संदर्भ'}
            </span>
          </div>

          {/* 4 · The layers */}
          <ReaderLayers
            scriptureId={scriptureId}
            verse={verse}
            chapterId={chapterId}
            provenance={provenance}
            settings={settings}
            onReport={() => setDialog('report')}
            onUpdateSetting={update}
          />

          {noteText && (
            <section aria-label="Your private note" className="mt-5 rounded-2xl border border-dashed border-dharma-border bg-dharma-card/60 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-dharma-muted">Your note · private to this device</p>
              <p className="whitespace-pre-line text-sm text-dharma-text">{noteText}</p>
            </section>
          )}

          <div data-focus-hide>{children}</div>
        </main>

        {/* Right rail (extra-wide screens): quick actions and page anchors */}
        <aside aria-label="On this page" className="sticky top-20 hidden w-56 shrink-0 self-start pt-8 2xl:block">
          <h2 className="text-xs font-bold uppercase tracking-wide text-dharma-muted">On this page</h2>
          <ul className="mt-2 space-y-0.5 text-sm">
            {[
              ['layer-sanskrit', 'Original verse'],
              ['understand-h', '12-Layer Understanding'],
              ['verse-graph', 'Verse Network & Graph'],
              ['layer-tradition', 'Traditional commentary'],
              ['layer-sources', 'Sources'],
            ].map(([id, text]) => (
              <li key={id}>
                <a href={`#${id}`} className="focus-ring flex min-h-[44px] items-center rounded-lg px-2 text-dharma-text hover:bg-dharma-card hover:text-saffron-800 dark:hover:text-saffron-300">{text}</a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2">
            <button type="button" onClick={onBookmark} aria-pressed={saved} className={actionBtn}>
              {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
              {saved ? 'Saved' : 'Save verse'}
            </button>
            <button
              type="button"
              onClick={onShare}
              className={`${actionBtn} border-saffron-500/40 bg-saffron-500/10 text-saffron-900 dark:text-saffron-200`}
            >
              <Share2 className="h-4 w-4 text-saffron-600 dark:text-saffron-400" aria-hidden="true" /> Share Card (9:16)
            </button>
            <button type="button" onClick={() => setDialog('settings')} aria-haspopup="dialog" className={actionBtn}>
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" /> Reader settings
            </button>
            <button type="button" onClick={() => setDialog('report')} className={actionBtn}>
              <Flag className="h-4 w-4" aria-hidden="true" /> Report correction
            </button>
          </div>
        </aside>
        </div>

        {/* Mobile: sticky bottom verse navigation (the page has matching bottom padding, so it never covers the verse) */}
        <nav aria-label="Verse navigation" className="fixed inset-x-0 bottom-0 z-40 border-t border-dharma-border/80 bg-dharma-bg/95 backdrop-blur sm:hidden">
          <div className="flex items-center justify-between gap-2 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
            {navLink(prev, 'prev', 'bar')}
            <button
              type="button"
              onClick={() => {
                triggerTactileFeedback('selection', 'click');
                setCarouselOpen(true);
              }}
              aria-haspopup="dialog"
              className="focus-ring inline-flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-2 text-center transition active:scale-95"
            >
              <span lang="hi" className="font-devanagari text-sm font-bold text-dharma-text">श्लोक {toDevanagari(verse.number)}</span>
              <span className="text-[11px] font-medium text-saffron-700 dark:text-saffron-400">{index + 1} / {total} · माला खोलें</span>
            </button>
            {navLink(next, 'next', 'bar')}
          </div>
        </nav>

        <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4 sm:bottom-6">
          {toast && <p className="rounded-full border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-medium text-dharma-text shadow-lg">{toast}</p>}
        </div>

        {/* Dialogs */}
        <ReaderSettingsPanel open={dialog === 'settings'} onClose={close} settings={settings} update={update} reset={reset} reducedMotion={reducedMotion} theme={theme} setTheme={setTheme} />

        <ReaderDialog open={dialog === 'chapters'} onClose={close} title="Chapters" titleHi="अध्याय" variant="modal">
          <ul className="space-y-1">
            {chapters.map((c) => (
              <li key={c.id}>
                <Link
                  href={c.href}
                  onClick={close}
                  aria-current={c.id === chapterId ? 'true' : undefined}
                  className={`focus-ring flex min-h-[52px] items-center justify-between gap-3 rounded-xl px-3 py-2 transition ${c.id === chapterId ? 'bg-saffron-100 font-semibold text-saffron-950 dark:bg-saffron-900/40 dark:text-saffron-100' : 'hover:bg-dharma-bg'}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{c.id}. {c.title}</span>
                    {c.titleSanskrit && <span lang="sa" className="block truncate font-devanagari text-sm text-dharma-muted">{c.titleSanskrit}</span>}
                  </span>
                  {c.verseCount ? <span className="shrink-0 text-xs text-dharma-muted">{fmtVerses(c.verseCount)}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </ReaderDialog>

        <ReaderDialog open={dialog === 'verses'} onClose={() => { close(); setPick(''); }} title="Go to verse" titleHi="श्लोक चुनें" variant="modal">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const exact = verses.find((v) => String(v.number) === pick.trim());
              if (exact) { close(); router.push(exact.href); }
            }}
            className="mb-4"
          >
            <label htmlFor="reader-verse-pick" className="mb-1 block text-sm font-semibold text-dharma-text">Verse number</label>
            <input
              id="reader-verse-pick"
              inputMode="numeric"
              autoComplete="off"
              value={pick}
              onChange={(e) => setPick(e.target.value)}
              placeholder={`1 – ${total}`}
              className="min-h-[48px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-base text-dharma-text outline-none focus:border-saffron-600 focus:ring-2 focus:ring-saffron-600/25"
            />
          </form>
          <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6" aria-label="Verses in this chapter">
            {visibleVerses.map((v) => (
              <li key={String(v.number)}>
                <Link
                  href={v.href}
                  onClick={() => { close(); setPick(''); }}
                  aria-current={String(v.number) === String(verse.number) ? 'true' : undefined}
                  className={`focus-ring flex h-12 items-center justify-center rounded-xl border text-sm font-semibold transition ${String(v.number) === String(verse.number) ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-500'}`}
                >
                  {v.number}
                </Link>
              </li>
            ))}
          </ul>
          {visibleVerses.length === 0 && <p className="mt-3 text-sm text-dharma-muted">No verse starts with “{pick}”.</p>}
        </ReaderDialog>

        <ReaderDialog
          open={dialog === 'note'}
          onClose={close}
          title="Private note"
          titleHi="निजी टिप्पणी"
          icon={<StickyNote className="h-5 w-5 text-saffron-700" aria-hidden="true" />}
          footer={
            <div className="flex justify-end gap-2">
              <button type="button" onClick={close} className="focus-ring min-h-[44px] rounded-xl px-4 text-sm font-semibold text-dharma-muted hover:text-dharma-text">Cancel</button>
              <button type="button" onClick={saveNote} className="focus-ring min-h-[44px] rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800">Save note</button>
            </div>
          }
        >
          <label htmlFor="reader-note" className="mb-2 block text-sm text-dharma-muted">
            About {label}. Saved only in this browser; clear the text and save to remove it.
          </label>
          <textarea
            id="reader-note"
            value={draft}
            maxLength={2000}
            rows={7}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-base text-dharma-text outline-none focus:border-saffron-600 focus:ring-2 focus:ring-saffron-600/25"
          />
        </ReaderDialog>

        <EmbedVerseDialog
          open={dialog === 'embed'}
          onClose={close}
          label={label}
          url={pageUrl}
          sanskrit={verse.sanskrit}
          hindi={verse.hindi}
          english={verse.translation}
          onNotice={say}
        />

        <ReaderDialog open={dialog === 'report'} onClose={close} title="Report a textual error" titleHi="पाठ-त्रुटि" icon={<Flag className="h-5 w-5 text-rose-700" aria-hidden="true" />}>
          <p className="mb-4 text-sm text-dharma-muted">
            Describe what is wrong in {label}. This opens a prefilled issue on GitHub; nothing is sent until you press “Create issue” there, and this site stores nothing.
          </p>
          <label htmlFor="reader-report-kind" className="mb-1 block text-sm font-semibold text-dharma-text">What kind of error?</label>
          <select id="reader-report-kind" value={kind} onChange={(e) => setKind(e.target.value as ReportKind)} className="mb-4 min-h-[48px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-base text-dharma-text">
            {REPORT_KINDS.map((k) => (
              <option key={k.id} value={k.id}>{k.label}</option>
            ))}
          </select>
          <label htmlFor="reader-report-details" className="mb-1 block text-sm font-semibold text-dharma-text">What is wrong, and what should it be?</label>
          <textarea id="reader-report-details" value={details} rows={5} onChange={(e) => setDetails(e.target.value)} className="mb-4 w-full resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-base text-dharma-text outline-none focus:border-saffron-600 focus:ring-2 focus:ring-saffron-600/25" />
          <a href={issueUrl} target="_blank" rel="noopener noreferrer" onClick={close} className="focus-ring inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800">
            Open prefilled GitHub issue
          </a>
        </ReaderDialog>

        {/* Sacred Share Card Modal (9:16 Story / 1:1 Post / WhatsApp Card) */}
        <SacredShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          data={shareData}
        />

        {/* Mobile Tactile Verse Carousel Drawer */}
        <MobileVerseCarousel
          isOpen={carouselOpen}
          onClose={() => setCarouselOpen(false)}
          verses={verses}
          currentVerseNumber={verse.number}
          chapterTitle={`अध्याय ${chapterId}: ${chapterTitle}`}
          scriptureTitle={scriptureTitle}
        />

        <MobileAudioPill />
      </div>
    </MotionConfig>
  );
}
