'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Copy,
  Feather,
  Share2,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { readHref } from '@/lib/verse-paths';
import { formatIstLong } from '@/lib/ist';
import { triggerTactileFeedback } from '@/lib/haptics';
import { usePerformanceMode } from '@/lib/performance-mode';

export function VerseOfTheDayCompact() {
  const reduce = useReducedMotion();
  const { isLiteMode } = usePerformanceMode();
  const [item, setItem] = useState<DailyWisdomItem | null>(null);
  const [date, setDate] = useState('');
  const [copied, setCopied] = useState(false);
  const [langTab, setLangTab] = useState<'bilingual' | 'hindi' | 'english'>('bilingual');
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Spring Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 240, damping: 24, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-9, 9]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle 340px at ${x} ${y}, rgba(251, 191, 36, 0.18) 0%, rgba(251, 191, 36, 0.04) 45%, transparent 75%)`
  );

  useEffect(() => {
    setItem(getTodayWisdom());
    setDate(formatIstLong());
  }, []);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || isLiteMode || e.pointerType === 'touch') return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleCopy = async () => {
    if (!item) return;
    const shareText = `${item.sanskrit}\n\n${item.hindi || item.translation}\n— ${item.scriptureTitle} ${item.chapterId}.${item.verseId}\nhttps://dharmagranth.dev${readHref(item.scriptureId, item.chapterId, item.verseId)}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      triggerTactileFeedback('selection', 'softTap');
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <section
      aria-labelledby="votd-heading"
      className="relative border-b border-dharma-border bg-gradient-to-b from-dharma-bg via-dharma-card/30 to-dharma-bg py-12 sm:py-16"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        {/* Section Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-saffron-600 animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                <span lang="hi" className="font-devanagari">दैनिक श्लोक व मनन</span> · Verse of the Day
              </p>
            </div>
            <h2 id="votd-heading" className="font-serif text-2xl sm:text-3xl font-bold text-dharma-text mt-1">
              Contemplative Verse for Today
            </h2>
          </div>

          {date && (
            <span className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-dharma-border/80 bg-dharma-card px-3.5 py-1 text-xs font-semibold text-dharma-muted shadow-xs">
              <Compass className="h-3 w-3 text-saffron-600" />
              <span>{date}</span>
            </span>
          )}
        </div>

        {/* 2.5D Layered Verse Card */}
        {item ? (
          <div
            className="perspective-[1200px]"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <motion.article
              ref={cardRef}
              style={
                reduce || isLiteMode
                  ? undefined
                  : {
                      rotateX,
                      rotateY,
                      transformStyle: 'preserve-3d',
                    }
              }
              whileHover={
                reduce || isLiteMode
                  ? undefined
                  : {
                      y: -4,
                      transition: { duration: 0.25 },
                    }
              }
              className="group relative overflow-hidden rounded-3xl border border-amber-200/90 bg-dharma-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-amber-400/80 hover:shadow-xl dark:border-amber-900/50"
            >
              {/* Dynamic Light Specular Glare */}
              {!reduce && !isLiteMode && (
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-20 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: glareBackground,
                  }}
                />
              )}

              {/* Manuscript Spine Accent (Left margin) */}
              <div
                className="pointer-events-none absolute left-0 inset-y-6 w-1.5 rounded-r-full bg-gradient-to-b from-amber-400 via-saffron-500 to-amber-600 opacity-80"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col gap-6">
                {/* ── Layer 1: Context, Sourcing & Language Controls ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-saffron-800 dark:text-saffron-200 border border-amber-500/20">
                      {item.scriptureTitle} {item.chapterId}.{item.verseId}
                    </span>
                    <span lang="sa" className="font-devanagari text-xs font-semibold text-dharma-muted">
                      {item.scriptureTitleSanskrit} · {item.chapterTitle}
                    </span>
                    {item.meter && (
                      <span className="hidden sm:inline-flex rounded-full bg-dharma-bg px-2.5 py-0.5 text-[10px] font-medium text-dharma-muted border border-dharma-border">
                        {item.meter}
                      </span>
                    )}
                  </div>

                  {/* Actions & Language View Switcher */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex rounded-lg bg-dharma-bg p-0.5 border border-dharma-border text-xs">
                      <button
                        type="button"
                        onClick={() => setLangTab('bilingual')}
                        className={`min-h-11 px-2.5 py-0.5 rounded-md font-semibold transition sm:min-h-0 ${
                          langTab === 'bilingual'
                            ? 'bg-dharma-card text-saffron-700 dark:text-saffron-300 shadow-xs'
                            : 'text-dharma-muted hover:text-dharma-text'
                        }`}
                      >
                        Bilingual
                      </button>
                      <button
                        type="button"
                        onClick={() => setLangTab('hindi')}
                        className={`min-h-11 px-2.5 py-0.5 rounded-md font-semibold transition sm:min-h-0 ${
                          langTab === 'hindi'
                            ? 'bg-dharma-card text-saffron-700 dark:text-saffron-300 shadow-xs'
                            : 'text-dharma-muted hover:text-dharma-text'
                        }`}
                      >
                        हिन्दी
                      </button>
                      <button
                        type="button"
                        onClick={() => setLangTab('english')}
                        className={`min-h-11 px-2.5 py-0.5 rounded-md font-semibold transition sm:min-h-0 ${
                          langTab === 'english'
                            ? 'bg-dharma-card text-saffron-700 dark:text-saffron-300 shadow-xs'
                            : 'text-dharma-muted hover:text-dharma-text'
                        }`}
                      >
                        English
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-dharma-border bg-dharma-card text-dharma-muted sm:h-8 sm:w-8 transition hover:border-saffron-300 hover:text-dharma-text"
                      title="Copy verse citation"
                      aria-label="Copy verse citation"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Layer 2: Canonical Sanskrit Text ── */}
                <div className="pl-3 sm:pl-4">
                  <blockquote
                    lang="sa"
                    className="whitespace-pre-line font-devanagari text-2xl sm:text-3xl lg:text-4xl font-bold leading-relaxed sm:leading-loose text-dharma-text tracking-wide"
                  >
                    {item.sanskrit}
                  </blockquote>

                  {item.transliteration && (
                    <p className="mt-2.5 font-serif text-xs sm:text-sm italic text-dharma-muted leading-relaxed">
                      {item.transliteration}
                    </p>
                  )}
                </div>

                {/* ── Layer 3: Translation ── */}
                <div className="pl-3 sm:pl-4 space-y-2 border-l-2 border-amber-300/40 dark:border-amber-700/50">
                  {(langTab === 'bilingual' || langTab === 'hindi') && item.hindi && (
                    <p lang="hi" className="font-devanagari text-sm sm:text-base font-medium leading-relaxed text-dharma-text">
                      <span className="font-bold text-saffron-800 dark:text-saffron-300">भावार्थ: </span>
                      {item.hindi}
                    </p>
                  )}
                  {(langTab === 'bilingual' || langTab === 'english') && item.translation && (
                    <p className="text-sm sm:text-base font-normal leading-relaxed text-dharma-text">
                      <span className="font-semibold text-dharma-muted">Translation: </span>
                      {item.translation}
                    </p>
                  )}
                </div>

                {/* ── Layer 4: Modern Reflection / Practical Life Application ── */}
                {(item.practicalTeaching || item.practicalTeachingHi) && (
                  <div className="rounded-2xl border border-amber-300/60 bg-amber-500/5 p-4 sm:p-5 dark:border-amber-900/60">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Feather className="h-4 w-4 text-saffron-700 dark:text-saffron-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                        दैनिक मनन · Practical Reflection
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed text-dharma-text">
                      {item.practicalTeachingHi || item.practicalTeaching}
                    </p>
                  </div>
                )}

                {/* ── Layer 5: Read Full Explanation & Sourcing ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs text-dharma-muted">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <span>शास्त्रीय संदर्भ सहित · With canonical context</span>
                  </span>

                  <Link
                    href={readHref(item.scriptureId, item.chapterId, item.verseId)}
                    onClick={() => triggerTactileFeedback('medium', 'softTap')}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700 hover:shadow-lg active:scale-98"
                  >
                    <span>Read Full Explanation & Commentary</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </motion.article>
          </div>
        ) : (
          <div
            className="mt-3 min-h-[22rem] rounded-3xl border border-dharma-border bg-dharma-card animate-pulse"
            aria-hidden="true"
          />
        )}
      </div>
    </section>
  );
}
