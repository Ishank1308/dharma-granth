'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Bookmark,
  Brain,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Compass,
  Code2,
  Copy,
  Download,
  ExternalLink,
  Flame,
  HelpCircle,
  Lightbulb,
  Quote,
  RotateCcw,
  ScrollText,
  MessageCircle,
  Share2,
  Sparkles,
  Sprout,
  XCircle,
  Zap,
} from 'lucide-react';
import { GITA_2_47_PEDAGOGICAL, type PedagogicalVerseData } from '@/data/pedagogical-gita-2-47';
import { triggerTactileFeedback } from '@/lib/haptics';
import { readHref, shareVerseUrl } from '@/lib/verse-paths';
import { whatsappShareUrl } from '@/lib/whatsapp';
import { downloadVerseCardPng } from '@/lib/verse-card-png';
import dynamic from 'next/dynamic';

export type ContemplationTier = 'quick' | 'simple' | 'deep';

// Loaded on demand (first click on Embed) so the dialog and its framer-motion layer stay out of the page's first-load JS.
const EmbedVerseDialog = dynamic(
  () => import('@/app/components/EmbedVerseDialog').then((m) => m.EmbedVerseDialog),
  { ssr: false },
);

export interface PedagogicalVerseCardProps {
  data?: PedagogicalVerseData;
  initialTier?: ContemplationTier;
  className?: string;
  onTierChange?: (tier: ContemplationTier) => void;
  showExploreLink?: boolean;
}

export function PedagogicalVerseCard({
  data = GITA_2_47_PEDAGOGICAL,
  initialTier = 'quick',
  className = '',
  onTierChange,
  showExploreLink = true,
}: PedagogicalVerseCardProps) {
  const [tier, setTier] = useState<ContemplationTier>(initialTier);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [embedOpen, setEmbedOpen] = useState(false);
  // Mounted on the first click, so the dialog's code is fetched only when someone embeds a verse.
  const [embedMounted, setEmbedMounted] = useState(false);
  const cardId = useId();

  // The verse page's absolute URL; read from window, so only call it in the browser (event handlers, or once the dialog is open).
  function verseUrl(): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dharmagranth.in';
    return shareVerseUrl(origin, data.scriptureId, data.chapterId, data.verseId);
  }

  async function handleDownloadImage() {
    triggerTactileFeedback('light', 'click');
    try {
      await downloadVerseCardPng({
        reference: `${data.scriptureTitle} ${data.chapterId}.${data.verseId}`,
        sanskrit: data.sanskrit,
        translation: data.simpleMeaningHi || data.simpleMeaningEn,
        fileName: `dharmagranth-${data.scriptureId}-${data.chapterId}-${data.verseId}.png`,
      });
    } catch {
      showToast('Could not draw the image');
    }
  }

  function handleWhatsApp() {
    triggerTactileFeedback('light', 'click');
    const href = whatsappShareUrl({
      heading: `${data.scriptureTitle} ${data.chapterId}.${data.verseId} · Dharma Granth`,
      body: [data.sanskrit, data.simpleMeaningHi || data.simpleMeaningEn],
      url: verseUrl(),
    });
    window.open(href, '_blank', 'noopener,noreferrer');
  }

  // Switch tier
  function handleTierSelect(newTier: ContemplationTier) {
    triggerTactileFeedback('light', 'softTap');
    setTier(newTier);
    onTierChange?.(newTier);
  }

  // Check saved state from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem('dharma.bookmarkedVerses');
      if (raw) {
        const bookmarks = JSON.parse(raw);
        if (Array.isArray(bookmarks)) {
          const found = bookmarks.some(
            (b: { scriptureId: string; verseId: string | number }) =>
              b.scriptureId === data.scriptureId && String(b.verseId) === String(data.verseId),
          );
          setIsSaved(found);
          return;
        }
      }
      setIsSaved(false);
    } catch {
      setIsSaved(false);
    }
  }, [data.scriptureId, data.verseId]);

  function showToast(msg: string) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  }

  // 3. Save to bookmarks
  function handleSave() {
    triggerTactileFeedback('light', 'softTap');
    try {
      const raw = localStorage.getItem('dharma.bookmarkedVerses');
      let bookmarks: Array<Record<string, unknown>> = [];
      if (raw) {
        bookmarks = JSON.parse(raw);
        if (!Array.isArray(bookmarks)) bookmarks = [];
      }

      if (isSaved) {
        bookmarks = bookmarks.filter(
          (b) => !(b.scriptureId === data.scriptureId && String(b.verseId) === String(data.verseId)),
        );
        localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify(bookmarks));
        setIsSaved(false);
        showToast('Verse removed from bookmarks');
      } else {
        bookmarks.push({
          scriptureId: data.scriptureId,
          scriptureTitle: data.scriptureTitle,
          chapterId: data.chapterId,
          chapterTitle: data.chapterTitle,
          verseId: data.verseId,
          sanskrit: data.sanskrit,
          translation: data.simpleMeaningEn,
          hindi: data.simpleMeaningHi,
          timestamp: new Date().toISOString(),
        });
        localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify(bookmarks));
        setIsSaved(true);
        showToast('Verse saved to your bookmarks (संग्रह में सहेजा गया)');
      }
    } catch {
      showToast('Could not update bookmarks');
    }
  }

  // 4. Share
  async function handleShare() {
    triggerTactileFeedback('light', 'click');
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}${readHref(
      data.scriptureId,
      data.chapterId,
      data.verseId,
    )}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${data.scriptureTitle} ${data.chapterId}.${data.verseId}`,
          text: `${data.sanskrit}\n\n⚡ ${data.inOneLineEn}\n${data.inOneLineHi}`,
          url,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard');
    } catch {
      showToast('Could not copy link');
    }
  }

  // 5. Copy Text
  async function handleCopy() {
    triggerTactileFeedback('light', 'click');
    const lines = [
      `${data.scriptureTitle} ${data.chapterId}.${data.verseId}`,
      data.sanskrit,
      `IAST: ${data.transliteration}`,
      `⚡ In one line: ${data.inOneLineEn}`,
      `⚡ एक पंक्ति में: ${data.inOneLineHi}`,
      `Simple Meaning: ${data.simpleMeaningEn}`,
      `सरल अर्थ: ${data.simpleMeaningHi}`,
      `Why it matters today: ${data.whyItMattersToday.map((s) => `• ${s.title}: ${s.text}`).join('\n')}`,
      `Source: ${data.sourceTransparency.sanskritEdition}`,
    ].join('\n\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      showToast('Verse and explanation copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy to clipboard');
    }
  }

  return (
    <article
      id={cardId}
      className={`relative overflow-hidden rounded-3xl border border-amber-200/90 bg-dharma-card shadow-xl transition-all dark:border-amber-900/50 ${className}`}
    >
      {/* Top Banner: Verse Reference & Depth Tier Selector */}
      <div className="border-b border-dharma-border bg-gradient-to-r from-amber-500/10 via-saffron-500/10 to-amber-500/5 px-6 py-4 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-600/30 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>{data.scriptureTitleSanskrit} २.४७</span>
            </span>
            <span className="text-xs text-dharma-muted">
              {data.scriptureTitle} {data.chapterId}.{data.verseId} · {data.meter}
            </span>
          </div>

          {/* Tier Selector: [⚡ Quick] [🌱 Simple] [📖 Deep] */}
          <div
            role="tablist"
            aria-label="Contemplation depth tier"
            className="inline-flex rounded-full border border-dharma-border bg-dharma-panel p-1 shadow-inner"
          >
            <button
              type="button"
              role="tab"
              aria-selected={tier === 'quick'}
              aria-controls={`${cardId}-quick-panel`}
              onClick={() => handleTierSelect('quick')}
              className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                tier === 'quick'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>⚡ Quick</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={tier === 'simple'}
              aria-controls={`${cardId}-simple-panel`}
              onClick={() => handleTierSelect('simple')}
              className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                tier === 'simple'
                  ? 'bg-saffron-600 text-white shadow'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
            >
              <Sprout className="h-3.5 w-3.5" />
              <span>🌱 Simple</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={tier === 'deep'}
              aria-controls={`${cardId}-deep-panel`}
              onClick={() => handleTierSelect('deep')}
              className={`flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition ${
                tier === 'deep'
                  ? 'bg-stone-800 text-amber-200 shadow dark:bg-stone-700'
                  : 'text-dharma-muted hover:text-dharma-text'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>📖 Deep</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left = Sanskrit & Transliteration; Right = Pedagogical Explanation */}
      <div className="grid lg:grid-cols-[1fr_1.25fr]">
        {/* Left Column: Original Sanskrit & Recitation Controls */}
        <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-saffron-950 via-amber-950 to-stone-900 p-6 text-white sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 mandala-bg opacity-15" />
          <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full border border-amber-400/20 opacity-20" />

          <div className="relative z-10">
            {/* Epistemic Tier Badge */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-400/10 px-3 py-0.5 text-[11px] font-semibold text-amber-200">
                <ScrollText className="h-3 w-3 text-amber-300" />
                {data.epistemicTier}
              </span>
              <span className="text-[11px] text-amber-200/70">
                {data.chapterTitleSanskrit} (अध्याय {data.chapterId})
              </span>
            </div>

            {/* Original Sanskrit Text */}
            <div className="my-6">
              <p
                lang="sa"
                className="font-devanagari text-2xl font-medium leading-[2.1] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] sm:text-3xl sm:leading-[2.1]"
              >
                {data.sanskrit}
              </p>
            </div>

            {/* Roman Transliteration */}
            <div className="border-t border-white/15 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80">
                IAST Transliteration
              </p>
              <p className="mt-1 font-serif text-sm italic leading-relaxed text-amber-100/90 whitespace-pre-line">
                {data.transliteration}
              </p>
            </div>
          </div>

          {/* Study Actions Bar: [Save] [Share] [Copy] [Read in Context] */}
          <div className="relative z-10 mt-8 border-t border-white/15 pt-5">
            <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200/70">
                Study Actions · स्वाध्याय साधन
              </p>
              <span className="text-[10px] text-amber-200/60 font-serif">
                {data.scriptureTitle} {data.chapterId}.{data.verseId}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* 1. Save */}
              <button
                type="button"
                onClick={handleSave}
                aria-label={isSaved ? 'Remove from saved verses' : 'Save verse'}
                className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold transition shadow-sm ${
                  isSaved
                    ? 'border-amber-400 bg-amber-400/20 text-amber-200'
                    : 'border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-amber-300'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-amber-300 text-amber-300' : 'text-white/80'}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {/* 2. Share */}
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share verse"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 hover:border-amber-300 shadow-sm"
              >
                <Share2 className="h-4 w-4 text-white/80" />
                <span>Share</span>
              </button>

              {/* 2b. WhatsApp (a button: the link is built from window.location when clicked) */}
              <button
                type="button"
                onClick={handleWhatsApp}
                aria-label="Share verse on WhatsApp"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 hover:border-amber-300 shadow-sm"
              >
                <MessageCircle className="h-4 w-4 text-emerald-300" />
                <span>WhatsApp Share</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadImage}
                aria-label="Download Image"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 hover:border-amber-300 shadow-sm"
              >
                <Download className="h-4 w-4 text-white/80" />
                <span>Download Image</span>
              </button>

              {/* 3. Copy */}
              <button
                type="button"
                onClick={handleCopy}
                aria-label="Copy verse text"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 hover:border-amber-300 shadow-sm"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-white/80" />}
                <span>{copied ? 'Copied' : 'Copy Verse'}</span>
              </button>

              {/* 3b. Embed */}
              <button
                type="button"
                onClick={() => {
                  setEmbedMounted(true);
                  setEmbedOpen(true);
                }}
                aria-haspopup="dialog"
                aria-label="Embed this verse on your website"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 hover:border-amber-300 shadow-sm"
              >
                <Code2 className="h-4 w-4 text-white/80" />
                <span>Embed</span>
              </button>

              {/* 4. Full Context */}
              {showExploreLink && (
                <Link
                  href={readHref(data.scriptureId, data.chapterId, data.verseId)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20 hover:border-amber-300 shadow-sm"
                  title="Read full chapter context"
                >
                  <BookOpen className="h-4 w-4 text-white/80" />
                  <span>Read in Context</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Pedagogical Content Depending on Tier */}
        <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 bg-dharma-card">
          {/* ================================================================= */}
          {/* TIER 1: QUICK MODE                                               */}
          {/* ================================================================= */}
          {tier === 'quick' && (
            <div id={`${cardId}-quick-panel`} className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-dharma-border pb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  <Zap className="h-4 w-4" />
                  <span>Understand this verse · त्वरित बोध</span>
                </span>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:text-amber-300">
                  ⚡ In One Line
                </span>
              </div>

              {/* 1. In One Line (English & Hindi) */}
              <div className="rounded-2xl border border-amber-300/80 bg-amber-500/10 p-5 dark:border-amber-900/60 dark:bg-amber-950/20">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-200 font-bold">
                    ⚡
                  </span>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                      In One Line (एक पंक्ति में संदेश)
                    </h3>
                    <p className="mt-1 font-serif text-lg font-bold text-dharma-text sm:text-xl leading-snug">
                      &ldquo;{data.inOneLineEn}&rdquo;
                    </p>
                    <p lang="hi" className="mt-2 font-devanagari text-base font-medium text-dharma-text/90 leading-relaxed">
                      &ldquo;{data.inOneLineHi}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Summary Preview */}
              <div className="rounded-2xl border border-dharma-border bg-dharma-panel/60 p-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                  The Core Realization
                </h4>
                <p className="mt-1.5 text-sm leading-relaxed text-dharma-text">
                  You are responsible for your dedication and honesty today. You do not own the harvest;
                  you own the plowing. Let go of result-anxiety, and your mind immediately gains tranquility and strength.
                </p>
              </div>

              {/* Quick Action Prompt */}
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 dark:border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                    Try this today
                  </span>
                </div>
                <p className="mt-1 text-sm text-dharma-text/90">
                  Complete one important task today without repeatedly checking metrics, feedback, or wondering how it will be judged.
                </p>
              </div>

              {/* Deep dive switcher button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleTierSelect('simple')}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-saffron-500/40 bg-saffron-500/10 px-4 py-2.5 text-xs font-bold text-saffron-800 transition hover:bg-saffron-500/20 dark:text-saffron-300"
                >
                  <Sprout className="h-4 w-4" />
                  <span>Explore simple explanations, modern examples & key words</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TIER 2: SIMPLE MODE (All 9 pedagogical elements)                   */}
          {/* ================================================================= */}
          {tier === 'simple' && (
            <div id={`${cardId}-simple-panel`} className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-dharma-border pb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  <Sprout className="h-4 w-4" />
                  <span>Simple Pedagogical Guide · सुबोध प्रबोधन</span>
                </span>
                <span className="text-xs text-dharma-muted">For students & first-time readers</span>
              </div>

              {/* 1. In One Line */}
              <div className="rounded-xl border border-amber-300/80 bg-amber-500/10 p-3.5 dark:border-amber-900/60">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  ⚡ In One Line
                </p>
                <p className="mt-1 font-serif text-base font-bold text-dharma-text sm:text-lg">
                  {data.inOneLineEn}
                </p>
                <p lang="hi" className="mt-1 font-devanagari text-sm text-dharma-text/90">
                  {data.inOneLineHi}
                </p>
              </div>

              {/* 2 & 3. Simple Meaning (English & Hindi) */}
              <div className="space-y-4">
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                    <span>💬 Simple English Meaning</span>
                  </h4>
                  <p className="mt-1.5 font-serif text-sm leading-relaxed text-dharma-text sm:text-base">
                    {data.simpleMeaningEn}
                  </p>
                </div>

                <div className="border-t border-dharma-border pt-3">
                  <h4 lang="hi" className="flex items-center gap-1.5 font-devanagari text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    <span>🇮🇳 सरल हिंदी भावार्थ</span>
                  </h4>
                  <p lang="hi" className="mt-1.5 font-devanagari text-sm leading-loose text-dharma-text sm:text-base">
                    {data.simpleMeaningHi}
                  </p>
                </div>
              </div>

              {/* 4. Key Words (४ मुख्य शब्द) */}
              <div className="border-t border-dharma-border pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-dharma-muted mb-3">
                  🔑 4 Crucial Words (मुख्य शब्द)
                </h4>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {data.keyWords.map((word, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-dharma-border bg-dharma-panel/60 p-3 transition hover:border-amber-300/70"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span lang="sa" className="font-devanagari text-sm font-bold text-amber-900 dark:text-amber-200">
                          {word.pada}
                        </span>
                        <span className="text-[10px] text-dharma-muted italic font-serif">
                          {word.root}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-snug text-dharma-text/90">
                        {word.functionalMeaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Why It Matters Today */}
              <div className="border-t border-dharma-border pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">
                  🌱 Why It Matters Today (आज के जीवन में इसका महत्व)
                </h4>
                <div className="space-y-2">
                  {data.whyItMattersToday.map((scenario, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs leading-relaxed text-dharma-text/90"
                    >
                      <p className="font-bold text-emerald-900 dark:text-emerald-200">
                        • {scenario.title} ({scenario.titleHi})
                      </p>
                      <p className="mt-0.5 text-dharma-text/85">{scenario.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. A Relatable Modern Example (With clear disclaimer badge) */}
              <div className="border-t border-dharma-border pt-4">
                <div className="rounded-2xl border border-sky-400/30 bg-sky-500/5 p-4 dark:border-sky-500/20 dark:bg-sky-950/20">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300">
                      📱 A Relatable Modern Example
                    </span>
                    <span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-900 dark:text-sky-200">
                      {data.modernExample.disclaimer}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-dharma-text">
                    Context: {data.modernExample.context}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-dharma-text/90">
                    {data.modernExample.scenarioEn}
                  </p>
                  <p lang="hi" className="mt-2 font-devanagari text-xs leading-relaxed text-dharma-text/85 border-t border-sky-500/15 pt-2">
                    {data.modernExample.scenarioHi}
                  </p>
                </div>
              </div>

              {/* 7. What It Does Not Mean */}
              <div className="border-t border-dharma-border pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-3">
                  🚫 What It Does Not Mean (इसका क्या अर्थ नहीं है)
                </h4>
                <div className="space-y-2">
                  {data.whatItDoesNotMean.map((item, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs leading-relaxed"
                    >
                      <p className="font-bold text-rose-900 dark:text-rose-200">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-dharma-text/85">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 8. Try This Today & 9. Think About It */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-dharma-border pt-4">
                {/* 8. Try This Today */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                  <div className="flex items-center justify-between gap-1">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>✅ Try This Today</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-900 bg-emerald-500/15 px-2 py-0.5 rounded-full dark:text-emerald-100">
                      {data.tryThisToday.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-dharma-text">
                    {data.tryThisToday.instructionEn}
                  </p>
                </div>

                {/* 9. Think About It */}
                <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-4">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-800 dark:text-indigo-300">
                    <Brain className="h-4 w-4" />
                    <span>🧠 Think About It (चिंतन)</span>
                  </span>
                  <p className="mt-2 text-xs italic leading-relaxed text-dharma-text">
                    &ldquo;{data.reflectionQuestion.en}&rdquo;
                  </p>
                  <p lang="hi" className="mt-1 font-devanagari text-xs text-dharma-text/80">
                    &ldquo;{data.reflectionQuestion.hi}&rdquo;
                  </p>
                </div>
              </div>

              {/* Switch to Deep Commentary Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => handleTierSelect('deep')}
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-2xl border border-stone-500/40 bg-stone-500/10 px-4 py-2.5 text-xs font-bold text-dharma-text transition hover:bg-stone-500/20"
                >
                  <BookOpen className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                  <span>Explore traditional commentaries (Shankara, Ramanuja, Sridhara Swami) & sources</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TIER 3: DEEP MODE (Traditional Commentaries + Source Transparency) */}
          {/* ================================================================= */}
          {tier === 'deep' && (
            <div id={`${cardId}-deep-panel`} className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-dharma-border pb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                  <span>Deep Scholarly & Traditional Commentary · शास्त्रीय भाष्य</span>
                </span>
                <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-[11px] font-bold text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                  Lineage Interpretations
                </span>
              </div>

              {/* Brief Quick Recall */}
              <div className="rounded-xl border border-amber-300/80 bg-amber-500/10 p-3 text-xs leading-relaxed">
                <span className="font-bold text-amber-800 dark:text-amber-300">Core Verse Principle: </span>
                <span>{data.inOneLineEn}</span>
              </div>

              {/* 10. Traditional Commentary from Ācāryas */}
              {data.traditionalCommentary && (
              <div className="space-y-3.5">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dharma-text">
                  <Quote className="h-4 w-4 text-amber-600" />
                  <span>Classical Lineage Perspectives (पारंपरिक भाष्य)</span>
                </h4>

                {/* Adi Shankara */}
                <div className="rounded-2xl border border-amber-700/30 bg-amber-500/5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif text-sm font-bold text-amber-900 dark:text-amber-200">
                      {data.traditionalCommentary!.shankara.author}
                    </p>
                    <span className="text-[10px] rounded-full bg-amber-500/15 px-2 py-0.5 font-semibold text-amber-800 dark:text-amber-300">
                      {data.traditionalCommentary!.shankara.tradition}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-dharma-muted italic">
                    {data.traditionalCommentary!.shankara.work}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-dharma-text/95">
                    {data.traditionalCommentary!.shankara.summaryEn}
                  </p>
                  <p lang="hi" className="mt-1.5 font-devanagari text-xs leading-relaxed text-dharma-text/80 border-t border-amber-500/15 pt-1.5">
                    {data.traditionalCommentary!.shankara.summaryHi}
                  </p>
                </div>

                {/* Ramanuja */}
                <div className="rounded-2xl border border-orange-700/30 bg-orange-500/5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif text-sm font-bold text-orange-950 dark:text-orange-200">
                      {data.traditionalCommentary!.ramanuja.author}
                    </p>
                    <span className="text-[10px] rounded-full bg-orange-500/15 px-2 py-0.5 font-semibold text-orange-800 dark:text-orange-300">
                      {data.traditionalCommentary!.ramanuja.tradition}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-dharma-muted italic">
                    {data.traditionalCommentary!.ramanuja.work}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-dharma-text/95">
                    {data.traditionalCommentary!.ramanuja.summaryEn}
                  </p>
                  <p lang="hi" className="mt-1.5 font-devanagari text-xs leading-relaxed text-dharma-text/80 border-t border-orange-500/15 pt-1.5">
                    {data.traditionalCommentary!.ramanuja.summaryHi}
                  </p>
                </div>

                {/* Sridhara Swami */}
                <div className="rounded-2xl border border-stone-700/30 bg-stone-500/5 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-serif text-sm font-bold text-stone-900 dark:text-stone-200">
                      {data.traditionalCommentary!.sridhara.author}
                    </p>
                    <span className="text-[10px] rounded-full bg-stone-500/15 px-2 py-0.5 font-semibold text-stone-800 dark:text-stone-300">
                      {data.traditionalCommentary!.sridhara.tradition}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-dharma-muted italic">
                    {data.traditionalCommentary!.sridhara.work}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-dharma-text/95">
                    {data.traditionalCommentary!.sridhara.summaryEn}
                  </p>
                  <p lang="hi" className="mt-1.5 font-devanagari text-xs leading-relaxed text-dharma-text/80 border-t border-stone-500/15 pt-1.5">
                    {data.traditionalCommentary!.sridhara.summaryHi}
                  </p>
                </div>
              </div>
              )}

              {/* 11. Source Transparency & Edition Details */}
              <div className="border-t border-dharma-border pt-4">
                <div className="rounded-2xl border border-dharma-border bg-dharma-panel/80 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ScrollText className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dharma-text">
                      11. Source Transparency & Philological Authenticity
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs text-dharma-text sm:grid-cols-2">
                    <div>
                      <span className="font-semibold text-dharma-muted">Scripture: </span>
                      <span>{data.sourceTransparency.scripture}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-dharma-muted">Reference: </span>
                      <span>{data.sourceTransparency.reference}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-dharma-muted">Epic Context: </span>
                      <span>{data.sourceTransparency.epicContext}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-dharma-muted">Chhandas (Meter): </span>
                      <span>{data.sourceTransparency.meter}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-dharma-muted">Sanskrit Edition: </span>
                      <span>{data.sourceTransparency.sanskritEdition}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-dharma-muted">Authority Tier: </span>
                      <span className="font-bold text-amber-800 dark:text-amber-300">
                        {data.sourceTransparency.epistemicTier}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] text-dharma-muted italic border-t border-dharma-border pt-2">
                    {data.sourceTransparency.editorialNote}
                  </p>
                </div>
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Link
                  href={readHref(data.scriptureId, data.chapterId, data.verseId)}
                  className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-saffron-600 to-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow transition hover:from-saffron-700 hover:to-amber-700"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>View Sources & Interpretation Component</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/scripture/${data.scriptureId}/chapter/${data.chapterId}`}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border border-dharma-border bg-dharma-panel px-4 py-2.5 text-xs font-bold text-dharma-text transition hover:border-amber-300"
                >
                  <span>Chapter {data.chapterId} Full Context</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Bottom Footer Action: Link to Full Verse Reader */}
          {showExploreLink && tier !== 'deep' && (
            <div className="mt-8 border-t border-dharma-border pt-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={readHref(data.scriptureId, data.chapterId, data.verseId)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Read Context</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-2 text-xs text-dharma-muted">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  <span>Verified Canonical Scripture</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-amber-300 bg-stone-900/95 px-5 py-2 text-xs font-medium text-white shadow-2xl backdrop-blur-md animate-fade-in z-30"
        >
          {toastMsg}
        </div>
      )}

      {embedMounted && (
        <EmbedVerseDialog
          open={embedOpen}
          onClose={() => setEmbedOpen(false)}
          label={`${data.scriptureTitle} ${data.chapterId}.${data.verseId}`}
          url={verseUrl()}
          sanskrit={data.sanskrit}
          hindi={data.simpleMeaningHi}
          english={data.simpleMeaningEn}
          onNotice={showToast}
        />
      )}
    </article>
  );
}
