'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Copy,
  Check,
  Download,
  MessageCircle,
  Compass,
  ExternalLink,
  Heart,
  HelpCircle,
  Lightbulb,
  Share2,
  ShieldAlert,
  Sparkles,
  Tag,
  Scroll,
  MessageSquareQuote,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import {
  type WisdomTopic,
  type ScriptureReference,
  wisdomTopics,
} from '@/data/wisdom-for-life';
import { libraryLocation, wisdomVerseHref } from '@/lib/wisdom-links';
import { TopicIllustration } from '../TopicIllustrations';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { ShareVerseButton } from '@/app/components/ShareVerseButton';
import { ShareChips } from '@/app/components/ShareChips';
import { downloadVerseCardPng } from '@/lib/verse-card-png';
import { whatsappShareUrl } from '@/lib/whatsapp';
import dynamic from 'next/dynamic';

// Loaded when a verse's story deck is first opened, so it stays out of the page's first-load JS.
const StoryDeckModal = dynamic(() => import('@/components/reader/StoryDeckModal').then((m) => m.StoryDeckModal), { ssr: false });
import { getLiteraryVerseMeta } from '@/lib/literary-commentary';

export function TopicDetailClient({
  topic,
  prevTopic,
  nextTopic,
  libraryFacts = {},
  searchLine,
}: {
  topic: WisdomTopic;
  prevTopic?: WisdomTopic;
  nextTopic?: WisdomTopic;
  /** Where each cited text's Sanskrit comes from, measured from the library's data files. */
  libraryFacts?: Record<string, { host?: string; fetched?: string }>;
  searchLine?: { hi: string; en: string } | null;
}) {
  const [copiedVerseId, setCopiedVerseId] = useState<string | null>(null);
  const [activeStoryVerse, setActiveStoryVerse] = useState<ScriptureReference | null>(null);
  const [imageNote, setImageNote] = useState('');

  const handleCopyVerse = (verse: ScriptureReference) => {
    const textToCopy = `${verse.referenceDisplay}\n\n${verse.sanskritDevanagari}\n\n${verse.sanskritTransliteration}\n\n[Hindi]: ${verse.literalTranslationHi}\n\n[English]: ${verse.literalTranslationEn}\n\n— Via Dharma Granth (https://dharmagranth.in/wisdom-for-life/${topic.slug})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedVerseId(verse.id);
      setTimeout(() => setCopiedVerseId(null), 2500);
    });
  };

  const handleWhatsAppVerse = (verse: ScriptureReference) => {
    const href = whatsappShareUrl({
      heading: verse.referenceDisplay,
      body: [verse.sanskritDevanagari, verse.literalTranslationHi || verse.literalTranslationEn],
      url: `https://dharmagranth.in/wisdom-for-life/${topic.slug}#verse-${verse.id}`,
    });
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleDownloadVerse = async (verse: ScriptureReference) => {
    try {
      await downloadVerseCardPng({
        reference: verse.referenceDisplay,
        sanskrit: verse.sanskritDevanagari,
        translation: verse.literalTranslationHi || verse.literalTranslationEn,
        fileName: `dharmagranth-${verse.id}.png`,
      });
      setImageNote('');
    } catch {
      setImageNote('छवि नहीं बन सकी।');
    }
  };

  return (
    <div className="pb-24">
      {/* ── Breadcrumb & Top Navigation ─────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between text-xs sm:text-sm text-dharma-muted"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-saffron-600 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/wisdom-for-life" className="hover:text-saffron-600 transition">
            Wisdom for Life
          </Link>
          <span>/</span>
          <span className="text-dharma-text font-medium">{topic.titleEn}</span>
        </div>

        <Link
          href="/wisdom-for-life"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-saffron-700 dark:text-saffron-400 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All 12 Topics</span>
        </Link>
      </nav>

      {/* ── Hero Banner with Calm Illustration ──────────────────── */}
      <header className="relative bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white overflow-hidden py-14 sm:py-20 border-b border-white/10">
        <div className="absolute inset-0 mandala-bg opacity-15" />
        <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 bg-gradient-to-br ${topic.colorGradient}`} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
          <FadeUp>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 justify-between">
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 mb-4">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{topic.categoryLabelEn} • {topic.categoryLabelHi}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-2 leading-tight">
                  {topic.titleEn}
                </h1>
                <p lang="hi" className="text-2xl sm:text-3xl font-devanagari font-bold text-amber-300 mb-3">
                  {topic.titleHi}
                </p>
                <p lang="sa" className="text-sm sm:text-base font-devanagari text-white/80 italic mb-6">
                  {topic.sanskritSubtitle}
                </p>

                <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl font-light">
                  {topic.shortDescEn}
                </p>
                <ShareChips
                  tone="dark"
                  className="mt-5 justify-center md:justify-start"
                  title={`${topic.titleEn} (${topic.titleHi})`}
                  summary={topic.shortDescEn}
                  path={`/wisdom-for-life/${topic.slug}`}
                />
                {searchLine && (
                  <p className="mt-4 max-w-2xl text-sm text-amber-100">
                    <span lang="hi" className="font-devanagari font-semibold">{searchLine.hi}</span>
                    <span className="mt-1 block">{searchLine.en}</span>
                  </p>
                )}
              </div>

              {/* Serene Bespoke Illustration Card */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md p-4 flex items-center justify-center shrink-0 shadow-2xl">
                <TopicIllustration topicId={topic.id} size={160} />
              </div>
            </div>
          </FadeUp>
        </div>
      </header>

      {/* ── Main Content Container ───────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6 relative z-20 space-y-12">
        {/* ── 1. COMPASSIONATE INTRODUCTION ────────────────────────── */}
        <section
          id="compassionate-introduction"
          aria-labelledby="heading-compassionate-intro"
          className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-10 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-saffron-500/10 text-saffron-700 dark:text-saffron-400 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                1. A Compassionate Introduction • संवेदनशील प्रस्तावना
              </p>
              <h2 id="heading-compassionate-intro" className="text-2xl font-serif font-bold text-dharma-text">
                Understanding the Burden You Carry
              </h2>
            </div>
          </div>

          <div className="space-y-6 text-dharma-text leading-relaxed">
            <div className="p-4 sm:p-5 rounded-2xl bg-saffron-500/5 border-l-4 border-saffron-500">
              <p className="text-base sm:text-lg font-serif italic text-dharma-text mb-2">
                &ldquo;{topic.compassionateIntro.leadEn}&rdquo;
              </p>
              <p lang="hi" className="text-sm sm:text-base font-devanagari text-dharma-muted">
                {topic.compassionateIntro.leadHi}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                  Human Dimension (English)
                </h3>
                <p className="text-sm sm:text-base text-dharma-muted leading-relaxed">
                  {topic.compassionateIntro.bodyEn}
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                  आंतरिक परिप्रेक्ष्य (हिंदी)
                </h3>
                <p lang="hi" className="text-sm sm:text-base font-devanagari text-dharma-muted leading-loose">
                  {topic.compassionateIntro.bodyHi}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-dharma-border flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-dharma-muted">
                <strong className="text-dharma-text">The Timeless Ground:</strong>{' '}
                {topic.compassionateIntro.spiritualFoundationEn}
                <div lang="hi" className="font-devanagari mt-1 text-xs sm:text-sm text-dharma-muted">
                  {topic.compassionateIntro.spiritualFoundationHi}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2, 3, 4, 5. CURATED VERSES, TRANSLATIONS & TRADITIONAL CONTEXT ── */}
        <section
          id="curated-verses"
          aria-labelledby="heading-curated-verses"
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                2. Scriptural Foundation • मूल श्लोक एवं शास्त्रीय संदर्भ
              </p>
              <h2 id="heading-curated-verses" className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
                Curated Scripture References ({topic.verses.length})
              </h2>
            </div>
            <p className="text-xs text-dharma-muted">
              Click &ldquo;Read in Reader&rdquo; to explore the surrounding chapter context.
            </p>
          </div>

          <div className="space-y-8">
            {topic.verses.map((verse, index) => {
              const literaryMeta = getLiteraryVerseMeta(
                verse.scriptureId,
                verse.chapterNumber,
                verse.verseNumber,
                {
                  sanskrit: verse.sanskritDevanagari,
                  translation: verse.literalTranslationEn,
                  hindi: verse.literalTranslationHi,
                  lifeLesson: verse.traditionalContext.commentaryNote,
                }
              );
              return (
              <article
                key={verse.id}
                id={`verse-${verse.id}`}
                className="rounded-3xl border border-dharma-border bg-dharma-card overflow-hidden shadow-xl transition-all"
              >
                {/* Verse Header Banner */}
                <div className="bg-dharma-bg/80 border-b border-dharma-border px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-saffron-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-dharma-text">
                        {verse.referenceDisplay}
                      </h3>
                      <p lang="hi" className="text-xs font-devanagari text-dharma-muted">
                        {verse.referenceDisplayHi}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveStoryVerse(verse)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-300/80 bg-amber-50/80 text-xs font-bold text-amber-900 hover:bg-amber-100 transition shadow-2xs dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"
                      aria-label={`६०-सेकंड सार ${verse.referenceDisplay}`}
                      title="६०-सेकंड सार (5-Card Visual Story Deck)"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      <span>६०-सेकंड सार</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyVerse(verse)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-card text-xs font-semibold text-dharma-text hover:border-saffron-400 hover:text-saffron-700 transition"
                      aria-label={`Copy verse ${verse.referenceDisplay}`}
                    >
                      {copiedVerseId === verse.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Verse</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleWhatsAppVerse(verse)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-card text-xs font-semibold text-dharma-text hover:border-emerald-500 hover:text-emerald-800 transition"
                      aria-label={`WhatsApp Share ${verse.referenceDisplay}`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp Share</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownloadVerse(verse)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dharma-border bg-dharma-card text-xs font-semibold text-dharma-text hover:border-saffron-400 hover:text-saffron-800 transition"
                      aria-label={`Download Image ${verse.referenceDisplay}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Image</span>
                    </button>

                    <ShareVerseButton
                      scriptureTitle={verse.scriptureName}
                      chapterTitle={`अध्याय ${verse.chapterNumber}`}
                      verseLabel={String(verse.verseNumber)}
                      sanskrit={verse.sanskritDevanagari}
                      transliteration={verse.sanskritTransliteration}
                      hindi={verse.literalTranslationHi}
                      translation={verse.literalTranslationEn}
                      coreShift={literaryMeta.isCurated ? literaryMeta.coreShiftHi || literaryMeta.coreShiftEn : undefined}
                      compact
                      verseUrl={`https://dharmagranth.in/wisdom-for-life/${topic.slug}#verse-${verse.id}`}
                    />

                    <Link
                      href={wisdomVerseHref(verse)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-saffron-700 text-white text-xs font-bold hover:bg-saffron-800 transition shadow-sm"
                    >
                      <span>Open in library</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                  {imageNote ? <p role="status" className="mt-2 text-xs text-rose-800">{imageNote}</p> : null}
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* 3. Original Verses in Sanskrit Devanagari */}
                  <div className="p-5 sm:p-6 rounded-2xl bg-saffron-500/5 dark:bg-stone-900/60 border border-saffron-500/20 text-center">
                    <p className="text-xs font-bold uppercase tracking-widest text-saffron-700 dark:text-saffron-400 mb-3">
                      मूल संस्कृत श्लोक (Original Sanskrit)
                    </p>
                    <p
                      lang="sa"
                      className="font-devanagari text-xl sm:text-2xl leading-loose font-bold text-dharma-text whitespace-pre-line drop-shadow-sm"
                    >
                      {verse.sanskritDevanagari}
                    </p>
                    <p className="text-xs sm:text-sm text-dharma-muted italic mt-4 whitespace-pre-line leading-relaxed font-sans">
                      {verse.sanskritTransliteration}
                    </p>
                  </div>

                  {/* 4. Literal Translations (Hindi & English) */}
                  <div className="grid md:grid-cols-2 gap-6 pt-2">
                    <div className="rounded-2xl border border-dharma-border/80 bg-dharma-bg/40 p-5">
                      <h4 lang="hi" className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2 font-devanagari flex items-center gap-1.5">
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                        हिंदी अनुवाद एवं भावार्थ
                      </h4>
                      <p lang="hi" className="font-devanagari text-sm sm:text-base text-dharma-text leading-loose">
                        {verse.literalTranslationHi}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-dharma-border/80 bg-dharma-bg/40 p-5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 mb-2 flex items-center gap-1.5">
                        <MessageSquareQuote className="w-3.5 h-3.5" />
                        English translation
                      </h4>
                      <p className="text-sm sm:text-base text-dharma-text leading-relaxed">
                        {verse.literalTranslationEn}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-dharma-muted leading-relaxed">
                    These renderings were drafted with AI assistance and have not been reviewed by a scholar; they are not taken from a published
                    edition. For the library’s own text of this verse, use{' '}
                    <Link href={wisdomVerseHref(verse)} className="font-semibold text-saffron-800 underline underline-offset-4 dark:text-saffron-300">
                      Open in library
                    </Link>
                    .
                  </p>

                  {/* 5. Traditional Context & Classical Commentary */}
                  <div className="rounded-2xl border border-dharma-border bg-dharma-card/80 p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Scroll className="w-4 h-4 text-saffron-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-dharma-text">
                        Traditional context (पारंपरिक संदर्भ)
                      </h4>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-3 text-xs border-b border-dharma-border pb-3">
                      <div>
                        <span className="text-dharma-muted block">Speaker (वक्ता):</span>
                        <strong className="text-dharma-text">{verse.traditionalContext.speaker}</strong>
                      </div>
                      <div>
                        <span className="text-dharma-muted block">Addressee (श्रोता):</span>
                        <strong className="text-dharma-text">{verse.traditionalContext.addressee}</strong>
                      </div>
                      <div>
                        <span className="text-dharma-muted block">Setting (प्रसंग):</span>
                        <span className="text-dharma-text">{verse.traditionalContext.setting}</span>
                      </div>
                    </div>

                    {verse.traditionalContext.commentaryNote && (
                      <div className="text-xs sm:text-sm text-dharma-muted leading-relaxed">
                        <p className="mb-2">
                          <strong className="text-dharma-text">Editorial note (not a commentator’s words):</strong>{' '}
                          {verse.traditionalContext.commentaryNote}
                        </p>
                        {verse.traditionalContext.commentaryNoteHi && (
                          <p lang="hi" className="font-devanagari text-xs sm:text-sm text-dharma-muted">
                            <strong className="text-dharma-text font-devanagari">संपादकीय टिप्पणी:</strong>{' '}
                            {verse.traditionalContext.commentaryNoteHi}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ── The Core Shift (मर्म · In One Breath) ── */}
                  {literaryMeta.isCurated && (
                    <>
                  <div className="rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/95 via-orange-50/70 to-amber-50/95 p-5 dark:border-amber-900/50 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-amber-950/40 shadow-2xs">
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

                  {/* ── What This Verse Does NOT Mean (भ्रम निवारण) ── */}
                  {literaryMeta.isCurated && (
                    <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
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
                    </>
                  )}
                </div>
              </article>
            );
          })}
          </div>

          {/* Traditional Context Overview Box */}
          <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8">
            <h3 className="text-lg font-serif font-bold text-dharma-text mb-2">
              {topic.traditionalContextOverview.titleEn}
            </h3>
            <p lang="hi" className="text-base font-devanagari font-semibold text-rose-700 dark:text-rose-400 mb-3">
              {topic.traditionalContextOverview.titleHi}
            </p>
            <p className="text-sm sm:text-base text-dharma-muted leading-relaxed mb-4">
              {topic.traditionalContextOverview.bodyEn}
            </p>
            <p lang="hi" className="text-sm sm:text-base font-devanagari text-dharma-muted leading-loose mb-6">
              {topic.traditionalContextOverview.bodyHi}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-dharma-border">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted self-center mr-2">
                Key Themes:
              </span>
              {topic.traditionalContextOverview.keyThemes.map((theme, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-saffron-500/10 text-saffron-700 dark:text-saffron-300 border border-saffron-500/20 font-medium"
                >
                  {theme}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. PRACTICAL REFLECTION & CONTEMPLATION ─────────────── */}
        <section
          id="practical-reflection"
          aria-labelledby="heading-practical-reflection"
          className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-10 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                3. Practical Reflection • व्यावहारिक मनन एवं साधना
              </p>
              <h2 id="heading-practical-reflection" className="text-2xl font-serif font-bold text-dharma-text">
                Bringing Scriptural Truth into Daily Living
              </h2>
            </div>
          </div>

          <div className="space-y-6">
            {topic.reflections.map((ref, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-dharma-border bg-dharma-bg/60 p-6 space-y-5"
              >
                <div>
                  <h3 className="text-lg font-serif font-bold text-dharma-text mb-1">
                    {ref.title}
                  </h3>
                  <p lang="hi" className="text-sm font-devanagari text-rose-700 dark:text-rose-400">
                    {ref.titleHi}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-5 text-sm">
                  <div className="p-4 rounded-xl bg-dharma-card border border-dharma-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 mb-1.5">
                      Core Philosophical Insight
                    </p>
                    <p className="text-dharma-text leading-relaxed">{ref.insight}</p>
                    <p lang="hi" className="text-xs font-devanagari text-dharma-muted mt-2">
                      {ref.insightHi}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-dharma-card border border-dharma-border">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Contemplation & Journaling Prompt
                    </p>
                    <p className="text-dharma-text leading-relaxed font-serif italic">
                      &ldquo;{ref.contemplationPrompt}&rdquo;
                    </p>
                    <p lang="hi" className="text-xs font-devanagari text-dharma-muted mt-2">
                      {ref.contemplationPromptHi}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs sm:text-sm text-dharma-text flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      Actionable Daily Practice (नित्य साधना):
                    </strong>{' '}
                    <span>{ref.dailyPractice}</span>
                    <p lang="hi" className="font-devanagari text-xs text-dharma-muted mt-1">
                      {ref.dailyPracticeHi}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 7 & 8. RELATED CONCEPTS & RELATED SCRIPTURES ─────────── */}
        <section className="grid md:grid-cols-2 gap-8">
          {/* 7. Related Concepts */}
          <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-saffron-600" />
              <h3 className="text-lg font-serif font-bold text-dharma-text">
                4. Related Concepts (संबंधित अवधारणाएं)
              </h3>
            </div>
            <p className="text-xs text-dharma-muted mb-4">
              Explore interconnected philosophical concepts in the Dharma Granth knowledge graph:
            </p>

            <div className="space-y-3 flex-grow">
              {topic.relatedConcepts.map((concept) => (
                <Link
                  key={concept.id}
                  href={concept.href}
                  className="group block p-3.5 rounded-2xl border border-dharma-border bg-dharma-bg/60 hover:border-saffron-400 hover:bg-saffron-500/5 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-dharma-text group-hover:text-saffron-700 transition">
                      {concept.labelEn}
                    </span>
                    <span lang="sa" className="font-devanagari text-xs text-saffron-600 font-semibold">
                      {concept.sanskrit}
                    </span>
                  </div>
                  <p className="text-xs text-dharma-muted leading-relaxed line-clamp-2">
                    {concept.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* 8. Related Scriptures */}
          <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-saffron-600" />
              <h3 className="text-lg font-serif font-bold text-dharma-text">
                5. Related Scriptures (संबंधित ग्रंथ)
              </h3>
            </div>
            <p className="text-xs text-dharma-muted mb-4">
              Read the full canonical texts from which these teachings are drawn:
            </p>

            <div className="space-y-3 flex-grow">
              {topic.relatedScriptures.map((scr) => (
                <Link
                  key={scr.id}
                  href={scr.href}
                  className="group block p-3.5 rounded-2xl border border-dharma-border bg-dharma-bg/60 hover:border-saffron-400 hover:bg-saffron-500/5 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-dharma-text group-hover:text-saffron-700 transition">
                      {scr.title}
                    </span>
                    <span lang="sa" className="font-devanagari text-xs text-saffron-600 font-semibold">
                      {scr.titleSanskrit}
                    </span>
                  </div>
                  <p className="text-xs text-dharma-muted leading-relaxed line-clamp-2">
                    {scr.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. SOURCES & CITATIONS ───────────────────────────────── */}
        <section
          id="sources"
          aria-labelledby="heading-sources"
          className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Scroll className="w-4 h-4 text-saffron-600" />
            <h3 id="heading-sources" className="text-lg font-serif font-bold text-dharma-text">
              6. Sources (स्रोत)
            </h3>
          </div>

          <p className="mb-4 text-sm text-dharma-muted leading-relaxed">
            Every verse on this page is cited to a scripture, and each can be opened in the library. The Sanskrit text is the library’s; the
            translations, reflections and notes were drafted with AI assistance and have not been reviewed by a scholar.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead>
                <tr className="border-b border-dharma-border text-dharma-muted uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 pr-4">Text</th>
                  <th className="py-2.5 px-4">Where cited</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dharma-border">
                {topic.sources.map((src, i) => (
                  <tr key={i} className="text-dharma-text">
                    <td className="py-3 pr-4 font-semibold">{src.textName}</td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-dharma-text">
                        {src.section ? `${src.section} (${src.citation})` : src.citation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h4 className="mt-6 mb-2 text-sm font-semibold text-dharma-text">Open each cited verse in the library</h4>
          <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
            {topic.verses.map((v) => {
              const loc = libraryLocation(v);
              const facts = libraryFacts[v.scriptureId];
              return (
                <li key={v.id} className="py-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <Link
                      href={wisdomVerseHref(v)}
                      className="inline-flex min-h-[36px] items-center text-sm font-semibold text-saffron-800 underline underline-offset-4 hover:text-saffron-900 dark:text-saffron-300 dark:hover:text-saffron-200"
                    >
                      {v.referenceDisplay} · library ch. {loc.chapter}, v. {loc.verse}
                    </Link>
                    {facts?.host && (
                      <span className="text-xs text-dharma-muted">
                        · Sanskrit from {facts.host}
                        {facts.fetched ? ` (fetched ${facts.fetched.slice(0, 10)})` : ''}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {/* ── 10. IMPORTANT CONTEXTUAL & MEDICAL DISCLAIMER NOTE ───── */}
        <section
          id="contextual-note"
          aria-labelledby="heading-contextual-note"
          className="rounded-3xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 p-6 sm:p-8 backdrop-blur-sm shadow-lg"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700 dark:text-amber-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 id="heading-contextual-note" className="text-base sm:text-lg font-serif font-bold text-dharma-text">
                  7. {topic.contextualNote.headlineEn}
                </h3>
                <span lang="hi" className="text-xs font-devanagari text-amber-700 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                  {topic.contextualNote.headlineHi}
                </span>
              </div>

              <p className="text-sm text-dharma-muted leading-relaxed">
                {topic.contextualNote.bodyEn}
              </p>
              <p lang="hi" className="font-devanagari text-xs sm:text-sm text-dharma-muted leading-loose">
                {topic.contextualNote.bodyHi}
              </p>

              <div className="p-4 rounded-2xl bg-dharma-bg/80 border border-dharma-border text-xs sm:text-sm text-dharma-text space-y-1.5">
                <p>
                  <strong className="text-amber-700 dark:text-amber-400">Clinical Notice:</strong>{' '}
                  {topic.contextualNote.clinicalDisclaimerEn}
                </p>
                <p lang="hi" className="font-devanagari text-xs text-dharma-muted">
                  {topic.contextualNote.clinicalDisclaimerHi}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Next / Previous Topic Navigation ────────────────────── */}
        <nav
          aria-label="Previous and Next Topics"
          className="pt-6 border-t border-dharma-border grid sm:grid-cols-2 gap-4"
        >
          {prevTopic ? (
            <Link
              href={`/wisdom-for-life/${prevTopic.slug}`}
              className="p-5 rounded-2xl border border-dharma-border bg-dharma-card hover:border-saffron-300 hover:shadow-md transition text-left flex items-center gap-4 group"
            >
              <ArrowLeft className="w-5 h-5 text-dharma-muted group-hover:text-saffron-600 transition group-hover:-translate-x-1" />
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-dharma-muted block">
                  Previous Topic
                </span>
                <span className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                  {prevTopic.titleEn}
                </span>
                <span lang="hi" className="font-devanagari text-xs text-rose-700 block">
                  {prevTopic.titleHi}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextTopic ? (
            <Link
              href={`/wisdom-for-life/${nextTopic.slug}`}
              className="p-5 rounded-2xl border border-dharma-border bg-dharma-card hover:border-saffron-300 hover:shadow-md transition text-right flex items-center justify-end gap-4 group"
            >
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-dharma-muted block">
                  Next Topic
                </span>
                <span className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                  {nextTopic.titleEn}
                </span>
                <span lang="hi" className="font-devanagari text-xs text-rose-700 block">
                  {nextTopic.titleHi}
                </span>
              </div>
              <ArrowRight className="w-5 h-5 text-dharma-muted group-hover:text-saffron-600 transition group-hover:translate-x-1" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </main>

      {activeStoryVerse && (
        <StoryDeckModal
          isOpen={Boolean(activeStoryVerse)}
          onClose={() => setActiveStoryVerse(null)}
          data={{
            scriptureTitle: activeStoryVerse.scriptureName,
            chapterTitle: `अध्याय ${activeStoryVerse.chapterNumber}`,
            verseRef: activeStoryVerse.referenceDisplay,
            sanskrit: activeStoryVerse.sanskritDevanagari,
            transliteration: activeStoryVerse.sanskritTransliteration,
            hindi: activeStoryVerse.literalTranslationHi,
            english: activeStoryVerse.literalTranslationEn,
            meta: getLiteraryVerseMeta(
              activeStoryVerse.scriptureId,
              activeStoryVerse.chapterNumber,
              activeStoryVerse.verseNumber,
              {
                sanskrit: activeStoryVerse.sanskritDevanagari,
                translation: activeStoryVerse.literalTranslationEn,
                hindi: activeStoryVerse.literalTranslationHi,
                lifeLesson: activeStoryVerse.traditionalContext.commentaryNote,
              }
            ),
            chapterHref: activeStoryVerse.readerHref,
            verseHref: `https://dharmagranth.in/wisdom-for-life/${topic.slug}#verse-${activeStoryVerse.id}`,
          }}
        />
      )}
    </div>
  );
}
