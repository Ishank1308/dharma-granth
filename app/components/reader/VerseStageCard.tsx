'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { VerseRouteLink } from './VerseRouteLink';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Copy,
  Focus,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Square,
  Volume2,
} from 'lucide-react';
import { cleanVerseField, formatVerseRef, toAsciiDigits } from '@/lib/verse-format';
import { triggerTactileFeedbackLazy as triggerTactileFeedback } from '@/lib/haptics-lazy';
import { useEverTrue } from '@/lib/use-ever-true';
import type { ReaderProvenance, ReaderVerseText } from '@/lib/reader-actions';
import type { ReaderSettings } from '@/lib/useReaderSettings';
import type { VerseInsight } from '@/lib/verse-insights';
import { ReaderLayers } from './ReaderLayers';
import { LITE_COMPAT, RAIL_CARD } from './verse-rail-styles';

const VerseMoreActions = dynamic(
  () => import('./VerseMoreActions').then((m) => m.VerseMoreActions),
  { ssr: false },
);

export interface StageVerseLink {
  number: number | string;
  href: string;
}

export interface VerseStageCardProps {
  scriptureId: string;
  chapterId: number;
  chapterTitle: string;
  chapterHref: string;
  label: string;
  traditionBadge: 'sruti' | 'smriti';
  meterLabel?: { sa: string; en: string };
  verse: ReaderVerseText;
  provenance: ReaderProvenance;
  settings: ReaderSettings;
  onUpdateSetting: <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => void;
  insight?: VerseInsight;
  sourceStatus?: ReactNode;
  prev?: StageVerseLink;
  next?: StageVerseLink;
  index: number;
  total: number;
  percent: number;
  focusMode: boolean;
  onToggleFocus: () => void;
  onOpenSettings: () => void;
  onToggleFullscreen: () => void;
  selectedWordIndex: number;
  onSelectWord: (index: number) => void;
  saved: boolean;
  onBookmark: () => void;
  onCopy: () => void;
  onShare: () => void;
  whatsappHref: string;
  onDownloadImage: () => void;
  onDownload: () => void;
  onOpenEmbed: () => void;
  onNotice: (message: string) => void;
  pinnedShlokaBar?: ReactNode;
  children?: ReactNode;
}

const STAGE_WIDTH = {
  narrow: 'max-w-xl',
  standard: 'max-w-2xl',
  wide: 'max-w-3xl',
} as const;

const actionBtn =
  `focus-ring inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-full border border-stone-300/60 dark:border-stone-700/80 bg-dharma-card/90 px-4 text-subhead text-dharma-text transition hover:border-amber-600/50 hover:bg-stone-100/80 dark:hover:bg-stone-800/60 ${LITE_COMPAT}`;

function otherChapter(href: string | undefined, currentChapterId: number): number | undefined {
  const match = href ? /\/chapter\/(\d+)(?:\/|$)/.exec(href) : null;
  if (!match) return undefined;
  const id = Number(match[1]);
  return id !== currentChapterId ? id : undefined;
}

/**
 * Center primary verse stage (`lg:col-span-6`, `max-w-2xl mx-auto w-full`).
 * Renders the tradition & meter header, Listen (`सुनें`) synthesis trigger, Focus (`स्वाध्याय`) toggle,
 * Sanskrit shloka with interactive *padachheda* pills, bilingual translations, deeper layers, and prev/next footer.
 */
export function VerseStageCard({
  scriptureId,
  chapterId,
  chapterTitle,
  chapterHref,
  label,
  traditionBadge,
  meterLabel,
  verse,
  provenance,
  settings,
  onUpdateSetting,
  insight,
  sourceStatus,
  prev,
  next,
  index,
  total,
  percent,
  focusMode,
  onToggleFocus,
  onOpenSettings,
  onToggleFullscreen,
  selectedWordIndex,
  onSelectWord,
  saved,
  onBookmark,
  onCopy,
  onShare,
  whatsappHref,
  onDownloadImage,
  onDownload,
  onOpenEmbed,
  onNotice,
  pinnedShlokaBar,
  children,
}: VerseStageCardProps) {
  const [moreActions, setMoreActions] = useState(false);
  const moreActionsLoaded = useEverTrue(moreActions);
  const [speaking, setSpeaking] = useState(false);

  // Stop any active browser speech synthesis when navigating between verses or unmounting.
  useEffect(() => {
    setSpeaking(false);
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [scriptureId, chapterId, verse.number]);

  const handleListen = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onNotice('Voice recitation is not supported in this browser.');
      return;
    }
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = cleanVerseField(verse.sanskrit) || cleanVerseField(verse.hindi) || cleanVerseField(verse.translation);
    if (!text) {
      onNotice('No verse text available to read aloud.');
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.88;
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      setSpeaking(true);
      window.speechSynthesis.speak(utterance);
      triggerTactileFeedback('selection', 'softTap');
    } catch {
      setSpeaking(false);
      onNotice('Could not start voice recitation.');
    }
  }, [speaking, verse.sanskrit, verse.hindi, verse.translation, onNotice]);

  const renderStepLink = (target: StageVerseLink | undefined, dir: 'prev' | 'next') => {
    const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
    const enLabel = dir === 'prev' ? 'Previous' : 'Next';
    const hiLabel = dir === 'prev' ? 'पिछला' : 'अगला';
    if (!target) {
      return <span className="hidden sm:block sm:w-36" aria-hidden="true" />;
    }
    const crosses = otherChapter(target.href, chapterId);
    const asciiNum = toAsciiDigits(target.number);
    const asciiCross = crosses != null ? toAsciiDigits(crosses) : null;
    const refText = asciiCross ? `Ch. ${asciiCross} · ${asciiCross}.${asciiNum}` : `श्लोक ${asciiNum}`;
    const aria = asciiCross
      ? `${enLabel} chapter, verse ${asciiCross}.${asciiNum}`
      : `${enLabel} verse, ${asciiNum}`;

    return (
      <VerseRouteLink
        href={target.href}
        rel={dir}
        onClick={() => triggerTactileFeedback('selection', 'click')}
        aria-label={aria}
        className={`focus-ring inline-flex min-h-[48px] min-w-0 items-center gap-2.5 rounded-2xl border border-stone-300/70 dark:border-stone-700/80 bg-dharma-card px-4 py-2 text-dharma-text shadow-2xs transition hover:border-amber-600/60 hover:bg-amber-50/40 dark:hover:bg-stone-800/70 active:scale-[0.98] [[data-lite-mode=true]_&]:shadow-none [[data-lite-mode=true]_&]:transition-none ${
          dir === 'next' ? 'flex-row-reverse text-right ml-auto' : ''
        }`}
      >
        <Icon className="h-4 w-4 shrink-0 text-amber-800 dark:text-amber-300" aria-hidden="true" />
        <span className="min-w-0 leading-tight">
          <span className="block text-[11px] font-medium text-dharma-muted">
            <span lang="hi" data-bi="hi" className="font-devanagari">{hiLabel}</span>
            <span data-bi="sep" aria-hidden="true"> · </span>
            <span data-bi="en">{enLabel}</span>
          </span>
          <span lang="hi" className="block truncate font-devanagari text-sm font-semibold tabular-nums text-dharma-text">
            {refText}
          </span>
        </span>
        <kbd
          className="hidden rounded-md border border-stone-300/80 dark:border-stone-700 px-1.5 py-0.5 font-mono text-[10px] text-dharma-muted lg:inline-flex"
          aria-hidden="true"
        >
          {dir === 'prev' ? '←' : '→'}
        </kbd>
      </VerseRouteLink>
    );
  };

  const refShort = formatVerseRef(scriptureId, chapterId, verse.number);

  return (
    <div className={`${STAGE_WIDTH[settings.readingWidth]} mx-auto w-full min-w-0`}>
      {pinnedShlokaBar}

      {/* Stage Header Card: Tradition badge, Chandas meter, Verse H1, Listen (सुनें), and Focus (स्वाध्याय) */}
      <header className={`mb-3 sm:mb-4 ${RAIL_CARD} !p-3 sm:!px-5 sm:!py-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-700/35 bg-amber-100/80 dark:border-amber-500/35 dark:bg-amber-900/40 px-2.5 py-0.5 text-[11px] font-semibold text-amber-950 dark:text-amber-100">
              <span>{traditionBadge === 'sruti' ? 'Śruti' : 'Smṛti'}</span>{' '}
              <span aria-hidden="true">·</span>{' '}
              <span lang="sa" className="font-devanagari">
                {traditionBadge === 'sruti' ? 'श्रुति' : 'स्मृति'}
              </span>
            </span>

            {meterLabel && (
              <span className="inline-flex items-center gap-1 rounded-full border border-stone-300/75 bg-stone-100/85 dark:border-stone-700 dark:bg-stone-800/80 px-2.5 py-0.5 text-[11px] font-medium text-dharma-text">
                <span lang="hi" className="font-devanagari text-dharma-muted">छन्द:</span>{' '}
                <span lang="sa" className="font-devanagari font-semibold">{meterLabel.sa}</span>{' '}
                <span className="hidden sm:inline text-dharma-muted">· {meterLabel.en}</span>
              </span>
            )}

            <span className="inline-flex items-center rounded-full bg-stone-200/70 dark:bg-stone-800 px-2.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-dharma-muted">
              {toAsciiDigits(refShort)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleListen}
              aria-pressed={speaking}
              aria-label={speaking ? 'Stop recitation · पाठ रोकें' : 'Listen · सुनें'}
              className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${LITE_COMPAT} ${
                speaking
                  ? 'border-amber-700 bg-amber-800 text-amber-50 dark:border-amber-300 dark:bg-amber-300 dark:text-stone-950'
                  : 'border-stone-300/75 dark:border-stone-700 bg-stone-100/80 dark:bg-stone-800/70 text-dharma-text hover:border-amber-600/50'
              }`}
            >
              {speaking ? (
                <Square className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <Volume2 className="h-3.5 w-3.5 shrink-0 text-amber-800 dark:text-amber-300" aria-hidden="true" />
              )}
              <span lang="hi" className="font-devanagari">{speaking ? 'रोकें' : 'सुनें'}</span>
              <span className="hidden sm:inline">{speaking ? '· Stop' : '· Listen'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleFocus}
              aria-pressed={focusMode}
              aria-label={focusMode ? 'Exit focus mode · स्वाध्याय बंद करें' : 'Focus mode · स्वाध्याय'}
              className={`focus-ring hidden sm:inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${LITE_COMPAT} ${
                focusMode
                  ? 'border-amber-700 bg-amber-800 text-amber-50 dark:border-amber-300 dark:bg-amber-300 dark:text-stone-950'
                  : 'border-stone-300/75 dark:border-stone-700 bg-stone-100/80 dark:bg-stone-800/70 text-dharma-text hover:border-amber-600/50'
              }`}
            >
              <Focus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span lang="hi" className="font-devanagari">स्वाध्याय</span>
              <span className="hidden sm:inline">· Focus</span>
              <kbd
                aria-hidden="true"
                className="hidden rounded border border-current/25 px-1 py-0.2 font-mono text-[10px] opacity-75 lg:inline"
              >
                F
              </kbd>
            </button>
          </div>
        </div>

        <div className="mt-2.5 text-center">
          <p className="hidden text-xs font-semibold uppercase tracking-wider text-amber-900 dark:text-amber-300 sm:block">
            {chapterTitle}
          </p>
          <h1 className="text-title-2 font-semibold text-dharma-text sm:mt-0.5 sm:text-title-1">
            {label}
          </h1>
        </div>
      </header>

      {focusMode && (
        <div
          role="region"
          aria-label="Focus mode controls"
          className={`mb-5 flex flex-wrap items-center gap-2 ${RAIL_CARD} p-2.5 text-xs`}
        >
          <button type="button" onClick={onToggleFocus} className={actionBtn}>
            <Focus className="h-4 w-4" aria-hidden="true" /> Exit focus mode
          </button>
          <button
            type="button"
            onClick={onOpenSettings}
            aria-haspopup="dialog"
            aria-label="Reader settings · पठन व्यवस्था"
            className={actionBtn}
          >
            <span aria-hidden="true" className="font-serif text-subhead font-semibold">Aa</span>
            <span className="hidden sm:inline">
              <span data-bi="en">Settings</span>
              <span data-bi="sep"> · </span>
              <span lang="hi" data-bi="hi" className="font-devanagari">पठन व्यवस्था</span>
            </span>
          </button>
          <button type="button" onClick={onToggleFullscreen} aria-label="Full screen" className={actionBtn}>
            <span>Full screen</span>
          </button>
          <span role="status" className="ml-auto px-2 text-dharma-muted tabular-nums">
            Verse {toAsciiDigits(index + 1)} of {toAsciiDigits(total)} · {toAsciiDigits(percent)}%
          </span>
        </div>
      )}

      {/* Primary Scripture, Interactive Padachheda, Translations & Deeper Study Tree */}
      <ReaderLayers
        scriptureId={scriptureId}
        verse={verse}
        chapterId={chapterId}
        provenance={provenance}
        settings={settings}
        onUpdateSetting={onUpdateSetting}
        insight={insight}
        sourceStatus={sourceStatus}
        selectedWordIndex={selectedWordIndex}
        onSelectWord={onSelectWord}
      />

      {/* Verse Actions Toolbar */}
      <div
        role="toolbar"
        aria-label="Verse actions"
        data-focus-hide
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
      >
        <button type="button" onClick={onBookmark} aria-pressed={saved} className={actionBtn}>
          {saved ? <BookmarkCheck className="h-4 w-4" aria-hidden="true" /> : <Bookmark className="h-4 w-4" aria-hidden="true" />}
          {saved ? 'Saved' : 'Save'}
        </button>
        <button type="button" onClick={onCopy} className={actionBtn}>
          <Copy className="h-4 w-4" aria-hidden="true" /> Copy
        </button>
        <button
          type="button"
          onClick={onShare}
          className={`${actionBtn} !border-amber-700/35 !bg-amber-100/80 !text-amber-950 dark:!border-amber-500/35 dark:!bg-amber-900/40 dark:!text-amber-100`}
          aria-label="Generate sacred verse card for WhatsApp / Instagram"
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
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
        <button
          type="button"
          onClick={() => setMoreActions((v) => !v)}
          aria-expanded={moreActions}
          aria-controls="verse-more-actions"
          className={actionBtn}
        >
          <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
          {moreActions ? 'Less' : 'More'}
        </button>
      </div>

      {moreActionsLoaded && (
        <VerseMoreActions
          visible={moreActions}
          chapterHref={chapterHref}
          verseNumber={verse.number}
          onDownloadImage={onDownloadImage}
          onOpenEmbed={onOpenEmbed}
          onDownload={onDownload}
        />
      )}

      {/* Stage Footer: Previous and Next Verse Navigation */}
      <footer className="mt-7 border-t border-stone-300/60 dark:border-stone-800 pt-5">
        <nav aria-label="Previous and next verse" className="flex flex-wrap items-center justify-between gap-3">
          {renderStepLink(prev, 'prev')}
          {renderStepLink(next, 'next')}
        </nav>
      </footer>

      <div data-focus-hide>{children}</div>
    </div>
  );
}
