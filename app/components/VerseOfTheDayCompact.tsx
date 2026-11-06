'use client';

import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Copy,
  Feather,
  Scroll,
  Share2,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion';
import { getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { readHref } from '@/lib/verse-paths';
import { formatIstLong } from '@/lib/ist';
import { triggerTactileFeedback } from '@/lib/haptics';
import { usePerformanceMode } from '@/lib/performance-mode';
import { SITE_URL } from '@/lib/jsonld';
import { VerseHrefLink } from '@/app/components/VerseHrefLink';
import { SacredShareModal } from '@/app/components/share/SacredShareModal';
import { subscribeSoundscape, toggleSoundscape } from '@/lib/sacred-soundscape';

export function VerseOfTheDayCompact() {
  const reduce = useReducedMotion();
  const { isLiteMode } = usePerformanceMode();
  const [item, setItem] = useState<DailyWisdomItem | null>(() => getTodayWisdom());
  const [date, setDate] = useState(() => formatIstLong());
  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [langTab, setLangTab] = useState<'bilingual' | 'hindi' | 'english'>('bilingual');
  const [isPalmLeafView, setIsPalmLeafView] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Spring Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 260, damping: 24, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle 360px at ${x} ${y}, rgba(251, 191, 36, 0.22) 0%, rgba(251, 191, 36, 0.05) 45%, transparent 75%)`
  );

  useEffect(() => {
    setItem(getTodayWisdom());
    setDate(formatIstLong());
    const unsub = subscribeSoundscape((state) => {
      setIsPlayingAudio(state.isPlaying);
    });
    return unsub;
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
    const shareText = `${item.sanskrit}\n\n${item.hindi || item.translation}\n— ${item.scriptureTitle} ${item.chapterId}.${item.verseId}\n${SITE_URL}${readHref(item.scriptureId, item.chapterId, item.verseId)}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      triggerTactileFeedback('selection', 'softTap');
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleToggleAudio = () => {
    triggerTactileFeedback('selection', 'softTap');
    toggleSoundscape();
  };

  const handleTogglePalmLeaf = () => {
    triggerTactileFeedback('selection', 'softTap');
    setIsPalmLeafView((prev) => !prev);
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

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {date && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dharma-border/80 bg-dharma-card px-3.5 py-1 text-xs font-semibold text-dharma-muted shadow-xs">
                <Compass className="h-3 w-3 text-saffron-600" />
                <span>{date}</span>
              </span>
            )}

            {/* Sacred Audio Soundscape Chime Button */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border transition shadow-xs ${
                isPlayingAudio
                  ? 'border-amber-400/80 bg-gradient-to-r from-amber-500/20 to-saffron-500/25 text-saffron-700 dark:text-amber-300 ring-2 ring-amber-400/30'
                  : 'border-dharma-border/80 bg-dharma-card text-dharma-muted hover:border-amber-400/60 hover:text-dharma-text'
              }`}
              title={isPlayingAudio ? 'Pause Sacred Soundscape' : 'Play Sacred Tanpura Soundscape'}
              aria-label={isPlayingAudio ? 'Pause Sacred Soundscape' : 'Play Sacred Tanpura Soundscape'}
            >
              {isPlayingAudio ? (
                <>
                  <span className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-saffron-600 animate-pulse" />
                    <span className="w-0.5 h-2/3 bg-saffron-500 animate-pulse delay-75" />
                    <span className="w-0.5 h-4/5 bg-amber-500 animate-pulse delay-150" />
                  </span>
                  <span>तन्पूरा वादन</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-saffron-600" />
                  <span>शान्त ध्वनि</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2.5D Layered Verse Card */}
        {item ? (
          <div
            className="perspective-[1400px]"
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
              className="group relative overflow-hidden rounded-3xl border border-amber-200/90 bg-dharma-card p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-amber-400/80 hover:shadow-2xl dark:border-amber-900/50"
            >
              {/* Dynamic Ambient Prana Glow */}
              <div className="pointer-events-none absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-amber-500/15 via-saffron-500/10 to-amber-600/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Traditional Pothi Gilded Corner Filigree */}
              <div className="pointer-events-none absolute top-3 left-3 size-3.5 border-t-2 border-l-2 border-amber-400/40 rounded-tl-sm" />
              <div className="pointer-events-none absolute top-3 right-3 size-3.5 border-t-2 border-r-2 border-amber-400/40 rounded-tr-sm" />
              <div className="pointer-events-none absolute bottom-3 left-3 size-3.5 border-b-2 border-l-2 border-amber-400/40 rounded-bl-sm" />
              <div className="pointer-events-none absolute bottom-3 right-3 size-3.5 border-b-2 border-r-2 border-amber-400/40 rounded-br-sm" />

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

              <div className="relative z-10 flex flex-col gap-6" style={reduce ? undefined : { transform: 'translateZ(14px)' }}>
                {/* ── Layer 1: Context, Sourcing & Language Controls ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-saffron-800 dark:text-saffron-200 border border-amber-500/20 shadow-xs">
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

                  {/* Actions, Palm Leaf Toggle & Language Switcher */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Palm Leaf Manuscript Format Toggle */}
                    <button
                      type="button"
                      onClick={handleTogglePalmLeaf}
                      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                        isPalmLeafView
                          ? 'border-amber-600 bg-amber-100 dark:bg-amber-950 text-amber-950 dark:text-amber-100'
                          : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
                      }`}
                      title="Toggle Palm-leaf manuscript format"
                      aria-label="Toggle Palm-leaf manuscript format"
                    >
                      <Scroll className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{isPalmLeafView ? 'ताडपत्र' : 'पत्र स्वरूप'}</span>
                    </button>

                    <div className="relative flex rounded-lg bg-dharma-bg p-0.5 border border-dharma-border text-xs">
                      {(['bilingual', 'hindi', 'english'] as const).map((tab) => {
                        const isActive = langTab === tab;
                        return (
                          <button
                            key={tab}
                            type="button"
                            onClick={() => {
                              setLangTab(tab);
                              triggerTactileFeedback('selection', 'softTap');
                            }}
                            className={`relative z-10 min-h-11 px-2.5 py-1 rounded-md font-semibold transition sm:min-h-0 ${
                              isActive
                                ? 'text-saffron-700 dark:text-saffron-300 font-bold'
                                : 'text-dharma-muted hover:text-dharma-text'
                            }`}
                          >
                            {tab === 'bilingual' ? 'Bilingual' : tab === 'hindi' ? 'हिन्दी' : 'English'}
                            {isActive && (
                              <motion.div
                                layoutId="votd-tab-active"
                                className="absolute inset-0 rounded-md bg-dharma-card shadow-xs -z-10"
                                transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                              />
                            )}
                          </button>
                        );
                      })}
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

                {/* ── Layer 2: Canonical Sanskrit Text (or Palm Leaf View) ── */}
                {isPalmLeafView ? (
                  <div
                    className="relative rounded-2xl border border-amber-600/40 p-5 sm:p-7 text-center shadow-md"
                    style={{
                      background: 'linear-gradient(180deg, #f7ecd2 0%, #ecd9b3 100%)',
                      color: '#2a1a0c',
                    }}
                  >
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:left-4">
                      <span className="size-2.5 rounded-full border border-amber-900/60 bg-amber-950" />
                      <span className="h-8 w-0.5 bg-red-700" />
                      <span className="size-2.5 rounded-full border border-amber-900/60 bg-amber-950" />
                    </div>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 sm:right-4">
                      <span className="size-2.5 rounded-full border border-amber-900/60 bg-amber-950" />
                      <span className="h-8 w-0.5 bg-red-700" />
                      <span className="size-2.5 rounded-full border border-amber-900/60 bg-amber-950" />
                    </div>

                    <span className="font-manuscript text-xs font-bold text-red-800 tracking-wider">
                      ॥ श्रीः ॥
                    </span>
                    <blockquote
                      lang="sa"
                      className="mt-2 px-6 font-manuscript text-xl sm:text-2xl lg:text-3xl font-bold leading-relaxed whitespace-pre-line"
                    >
                      {item.sanskrit.split(/([।॥]+)/).map((part, i) =>
                        /^[।॥]+$/.test(part) ? (
                          <span key={i} className="text-red-800 font-bold px-0.5">
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )}
                    </blockquote>
                    <span className="mt-2 block font-manuscript text-xs font-bold text-red-800">
                      ॥ {item.chapterId}.{item.verseId} ॥
                    </span>
                  </div>
                ) : (
                  <div className="verse-leaf apple-pranic-leaf relative rounded-2xl px-5 py-6 text-center md:px-8 md:py-7">
                    <span aria-hidden="true" className="verse-leaf-ornament left-3 top-2">❁</span>
                    <span aria-hidden="true" className="verse-leaf-ornament right-3 top-2">❁</span>
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
                    <span aria-hidden="true" className="mt-2 block font-bold text-saffron-700 dark:text-amber-300 text-sm">
                      ॥ {item.chapterId}.{item.verseId} ॥
                    </span>
                  </div>
                )}

                {/* ── Layer 3: The 3 Canonical Pillars (Bento Trinity) ── */}
                <div className={`grid grid-cols-1 ${langTab === 'bilingual' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-3.5 pt-1`}>
                  {/* Pillar 1: Bhavartha (Shown in bilingual or hindi) */}
                  {(langTab === 'bilingual' || langTab === 'hindi') && item.hindi && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="apple-pillar apple-pillar-bhavartha rounded-2xl p-4 transition-all"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                          ॥ भावार्थ · Essence ॥
                        </span>
                      </div>
                      <p lang="hi" className="font-devanagari text-xs sm:text-sm font-medium leading-relaxed text-dharma-text">
                        {item.hindi}
                      </p>
                    </motion.div>
                  )}

                  {/* Pillar 2: Vyakhya / Translation (Shown in bilingual or english) */}
                  {(langTab === 'bilingual' || langTab === 'english') && item.translation && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="apple-pillar apple-pillar-vyakhya rounded-2xl p-4 transition-all"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="h-2 w-2 rounded-full bg-saffron-500" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                          ॥ व्याख्या · Translation ॥
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-dharma-text font-serif italic opacity-95">
                        “{item.translation}”
                      </p>
                    </motion.div>
                  )}

                  {/* Pillar 3: Modern Context */}
                  {(item.practicalTeaching || item.practicalTeachingHi) && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="apple-pillar apple-pillar-modern rounded-2xl p-4 transition-all"
                    >
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                          ॥ आधुनिक संदर्भ · Action ॥
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-dharma-text">
                        {langTab === 'english'
                          ? (item.practicalTeaching || item.practicalTeachingHi)
                          : (item.practicalTeachingHi || item.practicalTeaching)}
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* ── Layer 4: Samsung One UI Ergonomic Action Bar ── */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-dharma-border/60">
                  <button
                    type="button"
                    onClick={() => {
                      triggerTactileFeedback('medium', 'softTap');
                      setIsShareOpen(true);
                    }}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 via-amber-600 to-saffron-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-saffron-700/25 transition hover:scale-102 hover:shadow-lg active:scale-95"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Create Sacred Card (Share 9:16 / 1:1)</span>
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card px-4 py-2 text-xs font-semibold text-dharma-muted hover:border-saffron-300 hover:text-dharma-text transition"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>

                    <VerseHrefLink
                      href={readHref(item.scriptureId, item.chapterId, item.verseId)}
                      onClick={() => triggerTactileFeedback('medium', 'softTap')}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-amber-300/80 bg-amber-500/10 dark:bg-amber-950/30 px-5 py-2 text-xs font-bold text-saffron-800 dark:text-saffron-200 hover:bg-amber-500/20 transition"
                    >
                      <span>Full Commentary</span>
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </VerseHrefLink>
                  </div>
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

      {/* Sacred Share Studio Modal for Content Creation */}
      {item && (
        <SacredShareModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          data={{
            title: item.scriptureTitle,
            reference: `${item.scriptureTitle} ${item.chapterId}.${item.verseId}`,
            sanskrit: item.sanskrit,
            transliteration: item.transliteration,
            translation: item.translation,
            hindi: item.hindi,
            vyakhya: item.translation,
            modernContext: item.practicalTeachingHi || item.practicalTeaching,
            quote: item.practicalTeaching,
            url: typeof window !== 'undefined' ? `${window.location.origin}${readHref(item.scriptureId, item.chapterId, item.verseId)}` : `${SITE_URL}${readHref(item.scriptureId, item.chapterId, item.verseId)}`,
          }}
        />
      )}
    </section>
  );
}
