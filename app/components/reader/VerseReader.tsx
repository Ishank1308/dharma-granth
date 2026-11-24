'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import Link from 'next/link';
import { VerseRouteLink } from './VerseRouteLink';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { motionAllowed, navigateWithTransition } from '@/lib/view-transition';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Focus,
  Menu,
  Sun,
} from 'lucide-react';
import { THEMES, THEME_NAMES, useTheme } from '@/app/components/ThemeProvider';
import { toAsciiDigits } from '@/lib/verse-format';
import { whatsappShareUrl } from '@/lib/whatsapp';
import { useReaderSettings } from '@/lib/useReaderSettings';
import { triggerTactileFeedbackLazy as triggerTactileFeedback } from '@/lib/haptics-lazy';
import {
  BOOKMARKS_CHANGED_EVENT,
  isBookmarked,
  savedVerseNumbers,
  toggleBookmark,
  verseReference,
  type ReaderProvenance,
  type ReaderRef,
  type ReaderVerseText,
} from '@/lib/reader-actions';
import { parseWordMeanings } from '@/lib/word-gloss';
import { parseModernContext } from '@/app/components/ModernContextBlock';
import type { VerseInsight } from '@/lib/verse-insights';
import type { SacredShareData } from '@/app/components/share/SacredShareModal';
import { VersePageLayout } from './VersePageLayout';
import { ChapterNavigatorRail, MobileChapterNavigatorBar } from './ChapterNavigatorRail';
import { VerseStageCard } from './VerseStageCard';
import { StudyCompanionRail, type ParallelWisdomItem, type VerseContemplationPrompts } from './StudyCompanionRail';
import { LITE_COMPAT } from './verse-rail-styles';

const VerseNavigationDialogs = dynamic(
  () => import('./VerseNavigationDialogs').then((m) => m.VerseNavigationDialogs),
  { ssr: false },
);
const EmbedVerseDialog = dynamic(() => import('@/app/components/EmbedVerseDialog').then((m) => m.EmbedVerseDialog), { ssr: false });
const ReaderSettingsPanel = dynamic(() => import('./ReaderSettingsPanel').then((m) => m.ReaderSettingsPanel), { ssr: false });
const SacredShareModal = dynamic(() => import('@/app/components/share/SacredShareModal').then((m) => m.SacredShareModal), { ssr: false });
import { useSwipeGesture } from '@/lib/useSwipeGesture';
const MobileSwipeIndicator = dynamic(() => import('./MobileSwipeIndicator').then((m) => m.MobileSwipeIndicator), { ssr: false });
const MobileVerseCarousel = dynamic(() => import('./MobileVerseCarousel').then((m) => m.MobileVerseCarousel), { ssr: false });
const PinnedShloka = dynamic(() => import('./PinnedShloka').then((m) => m.PinnedShloka), { ssr: false });
import { useScrolledPast } from '@/lib/useScrolledPast';
import { useEverTrue } from '@/lib/use-ever-true';

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
  preview?: string;
}

export interface VerseReaderProps {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  traditionBadge?: 'sruti' | 'smriti';
  meterLabel?: { sa: string; en: string };
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
  /** Reviewed मर्म line and जीवन प्रसंग chips for this verse (lib/verse-insights). */
  insight?: VerseInsight;
  /** Curated parallel wisdom links across scriptures and concepts. */
  parallelLinks?: ParallelWisdomItem[];
  /** Status chips (server-rendered TrustBadges), shown at the top of the Sources card. */
  sourceStatus?: ReactNode;
  /** Related concepts, topics and cross-references, rendered under the layers. */
  children?: ReactNode;
}

const iconBtn = 'focus-ring apple-icon-button h-[44px] w-[44px] shrink-0';

export function VerseReader(props: VerseReaderProps) {
  const {
    scriptureId,
    scriptureTitle,
    scriptureTitleSanskrit,
    traditionBadge = 'smriti',
    meterLabel,
    chapterId,
    chapterTitle,
    chapterHref,
    pageUrl,
    chapters,
    verses,
    index,
    verse,
    provenance,
    prev,
    next,
    children,
    insight,
    parallelLinks = [],
    sourceStatus,
  } = props;

  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { settings, update, reset, reducedMotion } = useReaderSettings();

  const ref: ReaderRef = useMemo(
    () => ({ scriptureId, scriptureTitle, scriptureTitleSanskrit, chapterId, chapterTitle, url: pageUrl }),
    [scriptureId, scriptureTitle, scriptureTitleSanskrit, chapterId, chapterTitle, pageUrl],
  );
  const label = verseReference(ref, verse);
  const glosses = useMemo(() => parseWordMeanings(verse.wordMeaning), [verse.wordMeaning]);

  const contemplation: VerseContemplationPrompts = useMemo(() => {
    const parsed = verse.reflection ? parseModernContext(verse.reflection) : null;
    const applyText = parsed?.applicationText || parsed?.contextText || insight?.marma || verse.explanation?.slice(0, 220);
    const applyIsHi = Boolean(applyText && /[\u0900-\u097F]/.test(applyText));
    const reflectQ = parsed?.reflectionQuestion;
    const reflectIsHi = Boolean(reflectQ && /[\u0900-\u097F]/.test(reflectQ));

    return {
      applyHi: applyIsHi
        ? applyText
        : 'इस श्लोक के केंद्रीय भाव को आज के एक निर्णय या कर्तव्य के साथ शांत मन से जोड़ें।',
      applyEn: !applyIsHi && applyText
        ? applyText
        : 'Bring the central insight of this shloka into one concrete action or response today.',
      reflectHi: reflectIsHi
        ? reflectQ
        : 'आज मेरे किस विचार या प्रतिक्रिया में इस श्लोक की स्पष्टता सबसे अधिक सहायक हो सकती है?',
      reflectEn: !reflectIsHi && reflectQ
        ? reflectQ
        : 'Where in your current responsibilities can steadiness replace anxious attachment?',
      practiceHi: 'एक क्षण शांत बैठकर श्लोक का स्मरण करें और आज के कर्तव्य को निस्पृह भाव से निभाने का संकल्प लें।',
      practiceEn: 'Pause for three calm breaths, recall the verse, and dedicate one action today without attachment to praise.',
    };
  }, [verse.reflection, verse.explanation, insight?.marma]);

  // Once the shloka has scrolled under the header it is offered again beside the commentary.
  const shlokaAway = useScrolledPast('sanskrit-text', `${chapterId}:${verse.number}`);
  const pinLoaded = useEverTrue(shlokaAway);
  const pinnedShloka = (variant: 'aside' | 'bar') =>
    pinLoaded && (
      <PinnedShloka
        variant={variant}
        away={shlokaAway}
        scriptureId={scriptureId}
        chapterId={chapterId}
        number={verse.number}
        sanskrit={verse.sanskrit}
        smooth={!reducedMotion}
      />
    );

  useEffect(() => {
    document.documentElement.setAttribute('data-reader', '');
    return () => document.documentElement.removeAttribute('data-reader');
  }, []);

  /* ── Dialog state ── */
  const [dialog, setDialog] = useState<null | 'settings' | 'chapters' | 'verses' | 'embed' | 'site'>(null);
  const close = useCallback(() => setDialog(null), []);
  const settingsLoaded = useEverTrue(dialog === 'settings');
  const navDialogsLoaded = useEverTrue(dialog === 'site' || dialog === 'chapters' || dialog === 'verses');
  const embedLoaded = useEverTrue(dialog === 'embed');

  /* ── Toast ── */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const say = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  }, []);
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  /* ── Bookmark ── */
  const [saved, setSaved] = useState(false);
  useEffect(() => setSaved(isBookmarked(ref, verse)), [ref, verse]);
  const [savedInChapter, setSavedInChapter] = useState<ReadonlySet<string>>(() => new Set());
  useEffect(() => {
    const load = () => setSavedInChapter(savedVerseNumbers(scriptureId, chapterId));
    load();
    window.addEventListener(BOOKMARKS_CHANGED_EVENT, load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener(BOOKMARKS_CHANGED_EVENT, load);
      window.removeEventListener('storage', load);
    };
  }, [scriptureId, chapterId]);

  const carouselVerses = useMemo(
    () => verses.map((v) => ({ ...v, isBookmarked: savedInChapter.has(String(v.number)) })),
    [verses, savedInChapter],
  );

  /* ── External Prev-Next Custom Events ── */
  useEffect(() => {
    const handlePrev = () => {
      if (prev?.href) navigateWithTransition(router, prev.href, 'prev');
    };
    const handleNext = () => {
      if (next?.href) navigateWithTransition(router, next.href, 'next');
    };

    window.addEventListener('dharma:verse-prev', handlePrev);
    window.addEventListener('dharma:verse-next', handleNext);
    return () => {
      window.removeEventListener('dharma:verse-prev', handlePrev);
      window.removeEventListener('dharma:verse-next', handleNext);
    };
  }, [prev, next, router]);

  const onBookmark = useCallback(() => {
    const state = toggleBookmark(ref, verse);
    if (state === null) return say('Sorry, this could not be saved because the browser is not allowing storage.');
    setSaved(state);
    if (state) {
      void import('@/lib/analytics').then((m) => m.track('verse_saved', { scriptureId })).catch(() => {});
      void Promise.all([import('@/lib/activity-log'), import('@/lib/reading-history')])
        .then(([act, hist]) => {
          act.logActivity({ kind: 'saved', ref: `${scriptureId}:${chapterId}:${verse.number}` }, { paused: hist.isHistoryPaused() });
        })
        .catch(() => {});
    }
    triggerTactileFeedback(state ? 'success' : 'medium', state ? 'success' : 'softTap');
    say(state ? 'Verse saved' : 'Removed from saved verses');
  }, [ref, verse, scriptureId, chapterId, say]);

  useEffect(() => {
    const handleToggleBookmark = () => onBookmark();
    window.addEventListener('dharma:toggle-bookmark', handleToggleBookmark);
    return () => window.removeEventListener('dharma:toggle-bookmark', handleToggleBookmark);
  }, [onBookmark]);

  /* ── Sacred Share Card Modal ── */
  const [showShareModal, setShowShareModal] = useState(false);
  const shareLoaded = useEverTrue(showShareModal);
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
    [scriptureTitle, label, verse, pageUrl],
  );

  /* ── Mobile Verse Carousel Drawer ── */
  const [carouselOpen, setCarouselOpen] = useState(false);

  /* ── Mobile Touch Swipe Gesture Engine ── */
  const { gestureState, handlers } = useSwipeGesture({
    onSwipeNext: () => {
      if (next) navigateWithTransition(router, next.href, 'next');
    },
    onSwipePrev: () => {
      if (prev) navigateWithTransition(router, prev.href, 'prev');
    },
    canNext: Boolean(next),
    canPrev: Boolean(prev),
    disabled: Boolean(dialog || carouselOpen || showShareModal),
  });
  const swipeLoaded = useEverTrue(gestureState.isSwiping);

  const [followThumb, setFollowThumb] = useState(false);
  useEffect(() => setFollowThumb(motionAllowed()), []);
  const paneStyle: CSSProperties | undefined = !followThumb
    ? undefined
    : gestureState.isSwiping
      ? { transform: `translate3d(${gestureState.deltaX * 0.6}px, 0, 0)`, opacity: 1 - gestureState.progress * 0.12, transition: 'none' }
      : { transition: 'transform 0.5s var(--motion-spring), opacity 0.3s var(--ease-out)' };

  useEffect(() => {
    if (prev?.href) router.prefetch(prev.href);
    if (next?.href) router.prefetch(next.href);
  }, [prev?.href, next?.href, router]);

  /* ── Copy / share / download ── */
  const show = { transliteration: settings.showTransliteration, hindi: settings.showHindi, english: settings.showEnglish };
  const onCopy = async () => {
    try {
      const { buildCopyText } = await import('@/lib/reader-markdown');
      await navigator.clipboard.writeText(buildCopyText(ref, verse, provenance, show));
      say('Copied with reference');
    } catch {
      say('Could not copy. Select the text and copy it manually.');
    }
  };
  const onShare = () => setShowShareModal(true);
  const whatsappHref = whatsappShareUrl({
    heading: `${label} · Dharma Granth`,
    body: [(verse.sanskrit ?? '').trim(), (verse.hindi ?? verse.translation ?? '').trim()],
    url: pageUrl,
  });
  const onDownloadImage = async () => {
    try {
      const { downloadVerseCardPng } = await import('@/lib/verse-card-png');
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
  const onDownload = async () => {
    const { buildDownloadMarkdown } = await import('@/lib/reader-markdown');
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

  const toggleFocusMode = useCallback(() => {
    update('focusMode', !settings.focusMode);
  }, [settings.focusMode, update]);

  const toggleFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen();
    } catch {
      say('Sorry, full screen is not available in this browser.');
    }
  }, [say]);

  const total = verses.length;
  const percent = Math.round(((index + 1) / Math.max(1, total)) * 100);
  const sanskritName = scriptureTitleSanskrit ?? scriptureTitle;

  const otherChapter = (href: string | undefined) => {
    const match = href ? /\/chapter\/(\d+)(?:\/|$)/.exec(href) : null;
    if (!match) return undefined;
    const id = Number(match[1]);
    return id !== chapterId ? id : undefined;
  };

  const mobileBarLink = (target: ReaderVerseLink | undefined, dir: 'prev' | 'next') => {
    const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
    const text = dir === 'prev' ? 'Previous' : 'Next';
    const hi = dir === 'prev' ? 'पिछला' : 'अगला';
    if (!target) return <span className="w-16 shrink-0" aria-hidden="true" />;
    const crosses = otherChapter(target.href);
    const hiLabel = crosses != null ? (dir === 'prev' ? 'पिछला अध्याय' : 'अगला अध्याय') : hi;
    const verseLine =
      crosses != null ? `${toAsciiDigits(crosses)}.${toAsciiDigits(target.number)}` : `श्लोक ${toAsciiDigits(target.number)}`;
    return (
      <VerseRouteLink
        href={target.href}
        rel={dir}
        onClick={() => triggerTactileFeedback('selection', 'click')}
        aria-label={crosses != null ? `${hiLabel}, श्लोक ${crosses}.${target.number}` : `${text} verse, ${target.number}`}
        className={`focus-ring inline-flex min-h-[48px] min-w-0 max-w-full items-center gap-1.5 rounded-pill border border-separator/60 bg-fill-quaternary px-2.5 text-label-primary transition duration-fast hover:border-separator-strong hover:bg-fill-tertiary active:scale-97 sm:gap-2.5 sm:px-3 ${
          dir === 'next' ? 'flex-row-reverse text-right' : ''
        }`}
      >
        <Icon className="h-4 w-4 shrink-0 text-tint" aria-hidden="true" />
        <span className="leading-tight">
          <span className="block text-caption font-medium text-label-secondary">
            <span lang="hi" data-bi="hi" className="font-devanagari">{hiLabel}</span>
            <span data-bi="en-only">{crosses != null ? `${text} chapter` : text}</span>
          </span>{' '}
          <span lang="hi" className="font-devanagari text-subhead font-semibold">{verseLine}</span>
        </span>
      </VerseRouteLink>
    );
  };

  const slashedChapterHref = chapterHref.endsWith('/') ? chapterHref : `${chapterHref}/`;

  return (
    <div
      data-contrast={settings.contrast}
      data-hide-decor={settings.hideDecor || settings.focusMode || settings.liteMode ? '' : undefined}
      data-focus={settings.focusMode ? '' : undefined}
      data-lite={settings.liteMode ? 'true' : undefined}
      data-lite-mode={settings.liteMode ? 'true' : undefined}
      className="reader-root min-h-screen bg-dharma-bg text-dharma-text selection:bg-saffron-500/25"
    >
      <style>{`
        .reader-root[data-contrast=high]{--dharma-muted:var(--dharma-text);--dharma-border:currentColor}
        .reader-root[data-contrast=high] .understand-fade{border-width:2px}
        .reader-root[data-hide-decor] .understand-fade{animation:none}
        .reader-root[data-focus] [data-focus-hide]{display:none!important}
        .reader-root[data-lite] aside,.reader-root[data-lite] [data-focus-hide]{display:none!important}
        .reader-root[data-hide-decor] h3 svg,.reader-root[data-hide-decor] [data-decor]{display:none}
      `}</style>

      {/* 1 · Sticky reader header */}
      <header className={`apple-bar sticky top-0 z-40 border-b ${LITE_COMPAT}`}>
        <div className="mx-auto flex min-h-[52px] max-w-7xl items-center gap-1 px-2 sm:gap-2 sm:px-6 lg:px-8">
          <Link href={slashedChapterHref} aria-label={`Back to chapter ${chapterId}`} title={`Chapter ${chapterId}`} className={iconBtn}>
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
                {scriptureTitle} · Chapter {toAsciiDigits(chapterId)}: {chapterTitle}
              </span>
              <ChevronDown className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </button>
          </div>

          <div className="hidden w-40 sm:block" role="group" aria-label="Reading progress">
            <p className="text-right text-xs font-medium tabular-nums text-dharma-muted">
              Verse {toAsciiDigits(index + 1)} of {toAsciiDigits(total)}
            </p>
            <div
              className="mt-1 h-1 overflow-hidden rounded-full bg-dharma-text/10"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label="Progress through this chapter"
            >
              <div className="h-full rounded-full bg-dharma-saffron" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <button
            type="button"
            data-focus-hide
            onClick={onBookmark}
            aria-pressed={saved}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark this verse'}
            className={`${iconBtn} ${saved ? '!text-dharma-saffron' : ''}`}
          >
            {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
          </button>
          <button
            type="button"
            onClick={() => update('liteMode', !settings.liteMode)}
            aria-pressed={settings.liteMode}
            aria-label={settings.liteMode ? 'Exit reading lite mode' : 'Reading Lite Mode (विशुद्ध पाठ)'}
            title={settings.liteMode ? 'Exit reading lite mode' : 'Reading Lite Mode (विशुद्ध पाठ)'}
            className={`${iconBtn} max-sm:!hidden ${settings.liteMode ? '!text-dharma-saffron' : ''}`}
          >
            <span className="font-serif text-[11px] font-bold">LITE</span>
          </button>
          <button
            type="button"
            onClick={toggleFocusMode}
            aria-pressed={settings.focusMode}
            aria-label={settings.focusMode ? 'Exit focus mode' : 'Enter focus mode'}
            className={`${iconBtn} ${settings.focusMode ? '!text-dharma-saffron' : ''}`}
          >
            <Focus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setDialog('settings')}
            aria-haspopup="dialog"
            aria-label="Reader settings · पठन व्यवस्था"
            title="पठन व्यवस्था · Reader settings"
            className={iconBtn}
          >
            <span aria-hidden="true" className="font-serif text-sm font-bold">Aa</span>
          </button>
          <button
            type="button"
            onClick={() => {
              const nextTheme = THEMES[(THEMES.indexOf(theme) + 1) % THEMES.length];
              setTheme(nextTheme);
              say(`थीम · Theme: ${THEME_NAMES[nextTheme].name}`);
            }}
            aria-label={`Theme: ${THEME_NAMES[theme].name}. Change theme`}
            title={`थीम: ${THEME_NAMES[theme].hi} · ${THEME_NAMES[theme].name}`}
            className={`${iconBtn} max-sm:!hidden`}
          >
            <Sun className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setDialog('site')}
            aria-haspopup="dialog"
            aria-label="Site menu · मेनू"
            title="मेनू · Site menu"
            className={iconBtn}
          >
            <Menu className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div
          className="h-0.5 bg-dharma-text/10 sm:hidden"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
          aria-label="अध्याय पठन प्रगति · Chapter reading progress"
        >
          <div className="h-full bg-dharma-saffron transition-[width] duration-300" style={{ width: `${percent}%` }} />
        </div>
      </header>

      {/* Tactile Edge Swipe Indicator */}
      {swipeLoaded && (
        <MobileSwipeIndicator
          gestureState={gestureState}
          prevNumber={prev && otherChapter(prev.href) != null ? `${otherChapter(prev.href)}.${prev.number}` : prev?.number}
          nextNumber={next && otherChapter(next.href) != null ? `${otherChapter(next.href)}.${next.number}` : next?.number}
        />
      )}

      {/* 2 · 12-Column Responsive Desktop Reading Grid */}
      <VersePageLayout
        verseIdentity={`${scriptureId}:${chapterId}:${verse.number}`}
        focusMode={settings.focusMode}
        onToggleFocus={toggleFocusMode}
        prevHref={prev?.href}
        nextHref={next?.href}
        padaCount={glosses.length}
        dialogOpen={Boolean(dialog || carouselOpen || showShareModal)}
        swipeHandlers={handlers as unknown as Record<string, unknown>}
        paneStyle={paneStyle}
        mobileTopBar={
          <MobileChapterNavigatorBar
            chapterId={chapterId}
            chapterTitle={chapterTitle}
            currentVerseNumber={verse.number}
            totalVerses={total}
            onOpenChapters={() => setDialog('chapters')}
            onOpenVerses={() => setDialog('verses')}
          />
        }
        leftRail={
          <ChapterNavigatorRail
            scriptureTitle={scriptureTitle}
            scriptureTitleSanskrit={scriptureTitleSanskrit}
            chapterId={chapterId}
            chapterTitle={chapterTitle}
            currentVerseNumber={verse.number}
            verses={verses}
            savedInChapter={savedInChapter}
            onOpenChapters={() => setDialog('chapters')}
            onOpenVerses={() => setDialog('verses')}
            pinnedShlokaAside={pinnedShloka('aside')}
          />
        }
        renderCenter={({ focusMode, onToggleFocus, selectedWordIndex, setSelectedWordIndex }) => (
          <VerseStageCard
            scriptureId={scriptureId}
            chapterId={chapterId}
            chapterTitle={chapterTitle}
            chapterHref={slashedChapterHref}
            label={label}
            traditionBadge={traditionBadge}
            meterLabel={meterLabel}
            verse={verse}
            provenance={provenance}
            settings={settings}
            onUpdateSetting={update}
            insight={insight}
            sourceStatus={sourceStatus}
            prev={prev}
            next={next}
            index={index}
            total={total}
            percent={percent}
            focusMode={focusMode}
            onToggleFocus={onToggleFocus}
            onOpenSettings={() => setDialog('settings')}
            onToggleFullscreen={toggleFullscreen}
            selectedWordIndex={selectedWordIndex}
            onSelectWord={setSelectedWordIndex}
            saved={saved}
            onBookmark={onBookmark}
            onCopy={onCopy}
            onShare={onShare}
            whatsappHref={whatsappHref}
            onDownloadImage={onDownloadImage}
            onDownload={onDownload}
            onOpenEmbed={() => setDialog('embed')}
            onNotice={say}
            pinnedShlokaBar={pinnedShloka('bar')}
          >
            {children}
          </VerseStageCard>
        )}
        renderRight={({ selectedWordIndex, setSelectedWordIndex }) => (
          <StudyCompanionRail
            scriptureId={scriptureId}
            chapterId={chapterId}
            verseNumber={verse.number}
            glosses={glosses}
            lexicon={verse.lexicon}
            selectedWordIndex={selectedWordIndex}
            onSelectWord={setSelectedWordIndex}
            contemplation={contemplation}
            parallelLinks={parallelLinks}
          />
        )}
      />

      {/* Mobile: sticky bottom verse navigation */}
      <nav aria-label="Verse navigation" className={`apple-bar fixed inset-x-0 bottom-0 z-40 border-t sm:hidden ${LITE_COMPAT}`}>
        <div className="flex items-center justify-between gap-1.5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:gap-2 sm:px-3">
          {mobileBarLink(prev, 'prev')}
          <button
            type="button"
            onClick={() => {
              triggerTactileFeedback('selection', 'click');
              setCarouselOpen(true);
            }}
            aria-haspopup="dialog"
            className="focus-ring inline-flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center rounded-control px-1 text-center transition active:scale-97 sm:px-2"
          >
            <span lang="hi" className="truncate max-w-full font-devanagari text-subhead font-bold text-label-primary">
              श्लोक {toAsciiDigits(verse.number)}
            </span>
            <span className="truncate max-w-full text-caption tabular-nums text-tint">
              {toAsciiDigits(index + 1)} / {toAsciiDigits(total)} · माला
            </span>
          </button>
          {mobileBarLink(next, 'next')}
        </div>
      </nav>

      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-[80] flex justify-center px-4 sm:bottom-6">
        {toast && <p className="rounded-full border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-medium text-dharma-text shadow-lg">{toast}</p>}
      </div>

      {/* Dialogs */}
      {settingsLoaded && (
        <ReaderSettingsPanel
          open={dialog === 'settings'}
          onClose={close}
          settings={settings}
          update={(key, value) => {
            update(key, value);
            if (key === 'readerMode') {
              triggerTactileFeedback('light', 'softTap');
              void import('@/lib/analytics').then((m) => m.track('mode_selected', { mode: value })).catch(() => {});
            }
          }}
          reset={reset}
          reducedMotion={reducedMotion}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {navDialogsLoaded && (
        <VerseNavigationDialogs
          dialog={dialog === 'site' || dialog === 'chapters' || dialog === 'verses' ? dialog : null}
          onClose={close}
          chapters={chapters}
          chapterId={chapterId}
          verses={verses}
          currentVerseNumber={verse.number}
          savedInChapter={savedInChapter}
          theme={theme}
          setTheme={setTheme}
        />
      )}

      {embedLoaded && (
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
      )}

      {shareLoaded && (
        <SacredShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          data={shareData}
        />
      )}

      {carouselOpen && (
        <MobileVerseCarousel
          isOpen={carouselOpen}
          onClose={() => setCarouselOpen(false)}
          verses={carouselVerses}
          currentVerseNumber={verse.number}
          chapterTitle={`अध्याय ${toAsciiDigits(chapterId)}: ${chapterTitle}`}
          scriptureTitle={scriptureTitle}
        />
      )}
    </div>
  );
}
