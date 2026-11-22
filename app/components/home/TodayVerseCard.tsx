'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Share2,
  Sparkles,
  Compass,
  Target,
  CheckCircle2,
  Volume2,
  VolumeX,
  Languages,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ScrollText,
} from 'lucide-react';
import { PadaLine } from '@/app/components/PadaLine';
import { useEffect, useState, useCallback, type CSSProperties } from 'react';
import { DAILY_WISDOM_REGISTRY, getTodayWisdom, type DailyWisdomItem } from '@/data/daily-wisdom-engine';
import { SITE_URL } from '@/lib/jsonld';
import { readHref } from '@/lib/verse-paths';
import type { vibeAttrs } from '@/lib/scripture-vibes';
import { cleanVerseField, toAsciiDigits, verseLines } from '@/lib/verse-format';
import { triggerTactileFeedback } from '@/lib/haptics';

const PatrikaShareStudioModal = dynamic(
  () => import('@/app/components/share/PatrikaShareStudioModal').then((m) => m.PatrikaShareStudioModal),
  { ssr: false }
);

/** Cover colours for each scripture the daily pool can pick, worked out on the server (see HomeTodayVerse)
 * so the browser never loads the whole scripture catalogue to colour one card. */
export type TodayVerseVibes = Record<string, ReturnType<typeof vibeAttrs>>;

type StepTab = 'apply' | 'reflect' | 'sadhana';

export function TodayVerseCard({
  vibes = {},
  initialItem,
}: {
  vibes?: TodayVerseVibes;
  initialItem?: DailyWisdomItem;
}) {
  const [itemIndex, setItemIndex] = useState<number>(() => {
    const seed = initialItem ?? DAILY_WISDOM_REGISTRY[0];
    const idx = DAILY_WISDOM_REGISTRY.findIndex((x) => x.id === seed.id);
    return idx >= 0 ? idx : 0;
  });
  const [shareOpen, setShareOpen] = useState(false);
  const [showTranslit, setShowTranslit] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number | null>(0);
  const [activeStep, setActiveStep] = useState<StepTab>('apply');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [sadhanaDone, setSadhanaDone] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const item = DAILY_WISDOM_REGISTRY[itemIndex] ?? initialItem ?? DAILY_WISDOM_REGISTRY[0];

  useEffect(() => {
    const today = getTodayWisdom();
    const idx = DAILY_WISDOM_REGISTRY.findIndex((x) => x.id === today.id);
    if (idx >= 0) setItemIndex(idx);
  }, []);

  useEffect(() => {
    setActiveWordIdx(item.wordMeaning?.length ? 0 : null);
    try {
      const key = `dharma.daily.sadhana.${item.id}.${new Date().toISOString().slice(0, 10)}`;
      setSadhanaDone(Boolean(localStorage.getItem(key)));
    } catch {
      setSadhanaDone(false);
    }
  }, [item.id, item.wordMeaning]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const showNotice = useCallback((msg: string) => {
    setToastMsg(msg);
    const timer = setTimeout(() => setToastMsg(null), 3200);
    return () => clearTimeout(timer);
  }, []);

  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text.replace(/[।॥|]/g, ' '));
      utter.lang = 'hi-IN';
      utter.rate = 0.85;
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utter);
    } catch {
      setIsSpeaking(false);
    }
  }, []);

  const toggleRecitation = () => {
    triggerTactileFeedback('selection', 'softTap');
    if (isSpeaking) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    } else {
      speakText(item.sanskrit);
    }
  };

  const handleCompleteSadhana = () => {
    triggerTactileFeedback('selection', 'softTap');
    const next = !sadhanaDone;
    setSadhanaDone(next);
    try {
      const key = `dharma.daily.sadhana.${item.id}.${new Date().toISOString().slice(0, 10)}`;
      if (next) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
    } catch {}
    if (next) {
      showNotice('आज का स्वाध्याय संकल्प पूर्ण हुआ · Daily Sadhana recorded on this device');
    }
  };

  const cycleItem = (delta: number) => {
    triggerTactileFeedback('selection', 'softTap');
    if (isSpeaking && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setItemIndex((prev) => (prev + delta + DAILY_WISDOM_REGISTRY.length) % DAILY_WISDOM_REGISTRY.length);
  };

  const handleShareClick = () => {
    triggerTactileFeedback('selection', 'softTap');
    setShareOpen(true);
  };

  const attrs = vibes[item.scriptureId];
  const lines = verseLines(cleanVerseField(item.sanskrit));
  const verseHref = readHref(item.scriptureId, item.chapterId, item.verseId);
  const words = item.wordMeaning ?? [];

  return (
    <section
      aria-labelledby="today-verse-heading"
      className="reveal verse-card today-verse relative overflow-hidden rounded-panel border border-amber-500/30 bg-dharma-card/85 p-5 text-left shadow-raised backdrop-blur-2xl sm:p-8 lg:p-9"
      data-scripture-id={item.scriptureId}
      data-material={attrs?.['data-material']}
      style={attrs?.style}
    >
      {/* Ambient Liquid-Glass Radial Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-radial from-dharma-saffron/15 via-amber-500/5 to-transparent blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-radial from-amber-500/12 via-dharma-saffron/5 to-transparent blur-2xl"
      />

      {/* Classical Manuscript Corner Accents */}
      <span aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 font-serif text-sm text-dharma-saffron/45 select-none">
        𑁍
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute right-3 top-2.5 font-serif text-sm text-dharma-saffron/45 select-none">
        𑁍
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 left-3 font-serif text-sm text-dharma-saffron/45 select-none">
        𑁍
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-3 font-serif text-sm text-dharma-saffron/45 select-none">
        𑁍
      </span>

      {/* Non-intrusive Personalized Sadhana Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="mb-4 flex items-center justify-between gap-2 rounded-2xl border border-emerald-500/35 bg-emerald-500/12 px-4 py-2.5 text-xs font-semibold text-emerald-900 shadow-xs backdrop-blur-md dark:text-emerald-200"
        >
          <span className="flex items-center gap-2 font-devanagari">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
            {toastMsg}
          </span>
        </div>
      )}

      {/* ── Top Fluent Glass Header Bar ── */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 id="today-verse-heading" className="inline-flex items-center gap-2 text-sm font-bold tracking-normal text-dharma-saffron">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-dharma-saffron/15 text-dharma-saffron shadow-[inset_0_1px_0_var(--glass-specular-top)]">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <span>Verse of the day</span>
            <span aria-hidden="true">·</span>
            <span lang="hi" className="font-devanagari">आज का श्लोक</span>
          </h2>

          {item.theme && (
            <span className="rounded-full border border-dharma-saffron/25 bg-dharma-saffron/10 px-2.5 py-0.5 text-[11px] font-semibold text-dharma-saffron">
              {item.theme}
            </span>
          )}

          {item.meter && (
            <span className="hidden rounded-full border border-dharma-border/70 bg-dharma-bg/65 px-2.5 py-0.5 font-serif text-[11px] text-dharma-muted sm:inline-block">
              छन्द: {item.meter}
            </span>
          )}
        </div>

        {/* Interactive Audio, Transliteration & Coordinate Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleRecitation}
            aria-pressed={isSpeaking}
            className={`focus-ring inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
              isSpeaking
                ? 'border-dharma-saffron bg-dharma-saffron text-dharma-bg shadow-xs'
                : 'border-dharma-border/80 bg-dharma-bg/70 text-dharma-text hover:border-dharma-saffron/50'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-3.5 w-3.5 animate-pulse" aria-hidden="true" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-dharma-saffron" aria-hidden="true" />
            )}
            <span lang="hi" className="font-devanagari">{isSpeaking ? 'रोकें' : 'सुनें'}</span>
            <span className="hidden sm:inline">· {isSpeaking ? 'Stop' : 'Listen'}</span>
          </button>

          {item.transliteration && (
            <button
              type="button"
              onClick={() => {
                triggerTactileFeedback('selection', 'softTap');
                setShowTranslit((v) => !v);
              }}
              aria-pressed={showTranslit}
              className={`focus-ring inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                showTranslit
                  ? 'border-dharma-saffron/50 bg-dharma-saffron/15 text-dharma-saffron'
                  : 'border-dharma-border/80 bg-dharma-bg/70 text-dharma-muted hover:text-dharma-text'
              }`}
            >
              <Languages className="h-3.5 w-3.5" aria-hidden="true" />
              <span>IAST</span>
            </button>
          )}

          <Link
            href={verseHref}
            className="verse-ref focus-ring inline-flex min-h-[38px] items-center gap-1 rounded-full border border-dharma-saffron/30 bg-dharma-saffron/12 px-3.5 py-1.5 text-xs font-semibold tabular-nums text-dharma-text hover:border-dharma-saffron"
            aria-label={`${item.scriptureTitle} ${item.chapterId}.${item.verseId}`}
          >
            <span>{item.scriptureTitle}</span>
            <span>{item.chapterId}.{item.verseId}</span>
          </Link>
        </div>
      </div>

      {/* ── Asymmetric 12-Column Bento Layout (Zero Left/Right Wasted Space) ── */}
      <div className="relative z-10 mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
        {/* LEFT COLUMN (7 cols): Sacred Sanskrit Folio, Interactive Padaccheda & Bilingual Meanings */}
        <div className="flex flex-col justify-between gap-5 lg:col-span-7">
          {/* Sacred Sanskrit Manuscript Sanctuary */}
          <div className="verse-folio relative overflow-hidden rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-500/[0.07] via-dharma-bg/75 to-dharma-card/90 px-5 py-6 text-center shadow-[inset_0_1px_0_var(--glass-specular-top)] sm:px-7 sm:py-8">
            <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-dharma-muted">
              <span lang="sa" className="font-devanagari text-dharma-saffron/90">
                {item.scriptureTitleSanskrit} · {item.chapterTitle}
              </span>
              <span className="font-serif">अध्याय {item.chapterId}, श्लोक {item.verseId}</span>
            </div>

            <p lang="sa" className="shloka-text text-[clamp(1.35rem,2.3vw,2.05rem)] font-semibold leading-[1.78] text-dharma-text">
              {lines.map((line, i) => (
                <span key={i} className="verse-line block" style={{ '--i': i } as CSSProperties}>
                  {line ? <PadaLine line={line} /> : '\u00a0'}
                </span>
              ))}
            </p>

            <span aria-hidden="true" className="verse-mark mt-3 block text-sm font-semibold text-dharma-saffron">
              ॥ {item.chapterId}.{item.verseId} ॥
            </span>

            {showTranslit && item.transliteration && (
              <p
                lang="sa-Latn"
                className="mt-4 whitespace-pre-line border-t border-amber-500/20 pt-3 font-serif text-xs sm:text-sm italic leading-relaxed text-dharma-muted"
              >
                {item.transliteration}
              </p>
            )}
          </div>

          {/* Interactive Word-by-Word (पदच्छेद) Explorer Strip */}
          {words.length > 0 && (
            <div className="rounded-2xl border border-dharma-border/75 bg-dharma-bg/65 p-4 backdrop-blur-md">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <p className="inline-flex items-center gap-1.5 text-xs font-bold text-dharma-text">
                  <ScrollText className="h-3.5 w-3.5 text-dharma-saffron" aria-hidden="true" />
                  <span lang="hi" className="font-devanagari">पदच्छेद व शब्दार्थ</span>
                  <span className="font-normal text-dharma-muted">· Tap a Sanskrit word</span>
                </p>
                <span className="text-[11px] text-dharma-muted">{words.length} padas</span>
              </div>

              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Word-by-word meanings">
                {words.map((w, idx) => {
                  const selected = activeWordIdx === idx;
                  return (
                    <button
                      key={`${w.word}-${idx}`}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        triggerTactileFeedback('selection', 'softTap');
                        setActiveWordIdx(idx);
                      }}
                      className={`focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                        selected
                          ? 'border-dharma-saffron bg-dharma-saffron/15 font-bold text-dharma-text shadow-2xs'
                          : 'border-dharma-border/70 bg-dharma-card/80 text-dharma-text/85 hover:border-dharma-saffron/45'
                      }`}
                    >
                      <span lang="sa" className="font-devanagari text-sm font-semibold text-dharma-saffron">
                        {w.word}
                      </span>
                    </button>
                  );
                })}
              </div>

              {activeWordIdx !== null && words[activeWordIdx] && (
                <div className="mt-2.5 flex items-center justify-between gap-3 rounded-xl border border-dharma-saffron/25 bg-dharma-saffron/[0.07] px-3.5 py-2 text-xs">
                  <div>
                    <span lang="sa" className="font-devanagari font-bold text-dharma-text">
                      {words[activeWordIdx].word}
                    </span>
                    <span className="mx-2 text-dharma-muted">→</span>
                    <span className="font-medium text-dharma-text/90">{words[activeWordIdx].meaning}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakText(words[activeWordIdx].word)}
                    aria-label={`Pronounce ${words[activeWordIdx].word}`}
                    className="focus-ring inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-dharma-saffron/15 text-dharma-saffron hover:bg-dharma-saffron/25"
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Side-by-Side Bilingual Translations (Hindi & English) */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {item.hindi && (
              <div className="rounded-2xl border border-dharma-border/75 bg-dharma-bg/70 p-4 shadow-2xs">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-dharma-saffron font-devanagari">
                  हिन्दी भावार्थ · Hindi Meaning
                </p>
                <p lang="hi" className="font-devanagari text-sm sm:text-[15px] leading-[1.85] text-dharma-text">
                  {item.hindi}
                </p>
              </div>
            )}
            {item.translation && (
              <div className="rounded-2xl border border-dharma-border/75 bg-dharma-bg/70 p-4 shadow-2xs">
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                  English Translation
                </p>
                <p className="font-serif text-sm sm:text-[15.5px] leading-relaxed text-dharma-text/90">
                  {item.translation}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols): Step-by-Step Living Wisdom & Real-Life Sadhana Bento Stack */}
        <div className="flex flex-col justify-between gap-4 rounded-2xl border border-dharma-border/80 bg-dharma-bg/60 p-4 sm:p-5 backdrop-blur-xl lg:col-span-5">
          <div>
            {/* Progressive 3-Step Navigation Tabs */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-dharma-border/60">
              <span className="text-xs font-bold uppercase tracking-wider text-dharma-saffron">
                <span lang="hi" className="font-devanagari normal-case">त्रि-चरणीय स्वाध्याय</span> · 3-Step Contemplation
              </span>
              <span className="text-[11px] font-medium text-dharma-muted">Step {activeStep === 'apply' ? '1' : activeStep === 'reflect' ? '2' : '3'} of 3</span>
            </div>

            <div
              role="tablist"
              aria-label="Contemplation steps"
              className="mt-3 grid grid-cols-3 gap-1.5 rounded-xl border border-dharma-border/70 bg-dharma-card/80 p-1"
            >
              {[
                { id: 'apply' as const, num: '1', hi: 'प्रयोग', en: 'Apply', Icon: Compass },
                { id: 'reflect' as const, num: '2', hi: 'मनन', en: 'Reflect', Icon: Target },
                { id: 'sadhana' as const, num: '3', hi: 'संकल्प', en: 'Practice', Icon: CheckCircle2 },
              ].map(({ id, num, hi, en, Icon }) => {
                const active = activeStep === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      triggerTactileFeedback('selection', 'softTap');
                      setActiveStep(id);
                    }}
                    className={`focus-ring flex min-h-[40px] items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? 'bg-dharma-text text-dharma-bg shadow-xs'
                        : 'text-dharma-muted hover:text-dharma-text'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span lang="hi" className="font-devanagari">{num}. {hi}</span>
                    <span className="hidden xl:inline text-[11px] opacity-80">({en})</span>
                  </button>
                );
              })}
            </div>

            {/* Active Step Focus Panel */}
            <div className="mt-4 space-y-3">
              {activeStep === 'apply' && (
                <div className="rounded-2xl border border-dharma-saffron/30 bg-dharma-saffron/[0.07] p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dharma-saffron">
                    <Compass className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span lang="hi" className="font-devanagari normal-case">1. जीवन में प्रयोग</span>
                    <span aria-hidden="true">·</span>
                    <span>Real-Life Application</span>
                  </div>
                  <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-text">
                    {toAsciiDigits(item.practicalTeachingHi)}
                  </p>
                  {item.practicalTeaching && (
                    <p className="border-t border-dharma-saffron/20 pt-2 text-xs leading-relaxed text-dharma-muted">
                      {toAsciiDigits(item.practicalTeaching)}
                    </p>
                  )}
                </div>
              )}

              {activeStep === 'reflect' && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                    <Target className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span lang="hi" className="font-devanagari normal-case">2. आत्म-चिन्तन प्रश्न</span>
                    <span aria-hidden="true">·</span>
                    <span>Inner Inquiry</span>
                  </div>
                  <p lang="hi" className="font-devanagari text-sm font-medium leading-relaxed text-dharma-text">
                    {toAsciiDigits(item.reflectionPromptHi)}
                  </p>
                  {item.reflectionPrompt && (
                    <p className="border-t border-amber-500/20 pt-2 font-serif text-xs italic leading-relaxed text-dharma-muted">
                      &ldquo;{toAsciiDigits(item.reflectionPrompt)}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {activeStep === 'sadhana' && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.07] p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span lang="hi" className="font-devanagari normal-case">3. आज का अभ्यास संकल्प</span>
                    </span>
                    {sadhanaDone && (
                      <span className="rounded-full bg-emerald-600/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 dark:text-emerald-200">
                        ✓ पूर्ण
                      </span>
                    )}
                  </div>
                  <p lang="hi" className="font-devanagari text-sm leading-relaxed text-dharma-text">
                    {toAsciiDigits(item.dailyChallengeHi)}
                  </p>
                  {item.dailyChallenge && (
                    <p className="text-xs leading-relaxed text-dharma-muted">
                      {toAsciiDigits(item.dailyChallenge)}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleCompleteSadhana}
                    aria-pressed={sadhanaDone}
                    className={`focus-ring inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      sadhanaDone
                        ? 'border border-emerald-500/40 bg-emerald-600/15 text-emerald-900 dark:text-emerald-200'
                        : 'bg-dharma-saffron text-dharma-bg shadow-xs hover:opacity-95'
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    <span lang="hi" className="font-devanagari">
                      {sadhanaDone ? 'आज का संकल्प पूर्ण हुआ' : 'संकल्प पूर्ण करें · Mark Complete'}
                    </span>
                  </button>
                </div>
              )}

              {/* Compact Secondary Summary Tiles so all 3 dimensions remain glanceable on desktop */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {activeStep !== 'reflect' && item.reflectionPromptHi && (
                  <button
                    type="button"
                    onClick={() => setActiveStep('reflect')}
                    className="focus-ring flex items-start gap-2.5 rounded-xl border border-dharma-border/60 bg-dharma-card/75 p-3 text-left transition hover:border-dharma-saffron/45"
                  >
                    <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dharma-saffron" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-dharma-muted">
                        <span lang="hi" className="font-devanagari">आज का मनन</span> · Reflection Prompt
                      </p>
                      <p lang="hi" className="mt-0.5 line-clamp-2 font-devanagari text-xs text-dharma-text/90">
                        {toAsciiDigits(item.reflectionPromptHi)}
                      </p>
                    </div>
                  </button>
                )}

                {activeStep !== 'sadhana' && item.dailyChallengeHi && (
                  <button
                    type="button"
                    onClick={() => setActiveStep('sadhana')}
                    className="focus-ring flex items-start gap-2.5 rounded-xl border border-dharma-border/60 bg-dharma-card/75 p-3 text-left transition hover:border-dharma-saffron/45"
                  >
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-dharma-muted">
                        <span lang="hi" className="font-devanagari">आज का संकल्प</span> · Daily Micro-Practice
                      </p>
                      <p lang="hi" className="mt-0.5 line-clamp-2 font-devanagari text-xs text-dharma-text/90">
                        {toAsciiDigits(item.dailyChallengeHi)}
                      </p>
                    </div>
                  </button>
                )}

                {activeStep !== 'apply' && item.practicalTeachingHi && (
                  <button
                    type="button"
                    onClick={() => setActiveStep('apply')}
                    className="focus-ring flex items-start gap-2.5 rounded-xl border border-dharma-border/60 bg-dharma-card/75 p-3 text-left transition hover:border-dharma-saffron/45"
                  >
                    <Compass className="mt-0.5 h-3.5 w-3.5 shrink-0 text-dharma-saffron" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-dharma-muted">
                        <span lang="hi" className="font-devanagari">जीवन में प्रयोग</span> · Practical Shift
                      </p>
                      <p lang="hi" className="mt-0.5 line-clamp-2 font-devanagari text-xs text-dharma-text/90">
                        {toAsciiDigits(item.practicalTeachingHi)}
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right-Column Footer: Actions & Wisdom Pool Switcher */}
          <div className="space-y-3 border-t border-dharma-border/60 pt-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={verseHref}
                className="chevron-nudge focus-ring inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-dharma-saffron px-4 py-2.5 text-xs sm:text-sm font-bold text-dharma-bg shadow-xs transition hover:opacity-95"
              >
                <BookOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Read in context</span>
                <span aria-hidden="true">›</span>
              </Link>
              <button
                type="button"
                onClick={handleShareClick}
                className="focus-ring inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-4 py-2.5 text-xs sm:text-sm font-semibold text-dharma-text transition hover:border-dharma-saffron/50 hover:text-dharma-saffron"
              >
                <Share2 className="h-4 w-4 text-dharma-saffron" aria-hidden="true" />
                <span>Share card</span>
                <span aria-hidden="true" className="text-dharma-muted">·</span>
                <span lang="hi" className="font-devanagari">साझा करें</span>
              </button>
            </div>

            {/* Intuitive Prev/Next Daily Shloka Explorer */}
            <div className="flex items-center justify-between gap-2 text-xs text-dharma-muted">
              <button
                type="button"
                onClick={() => cycleItem(-1)}
                className="focus-ring inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-dharma-border/70 bg-dharma-card/70 px-2.5 py-1 font-medium text-dharma-text hover:border-dharma-saffron/45"
                aria-label="Previous daily verse"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span lang="hi" className="font-devanagari">पिछला श्लोक</span>
              </button>
              <span className="tabular-nums text-[11px]">
                श्लोक {itemIndex + 1} / {DAILY_WISDOM_REGISTRY.length}
              </span>
              <button
                type="button"
                onClick={() => cycleItem(1)}
                className="focus-ring inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-dharma-border/70 bg-dharma-card/70 px-2.5 py-1 font-medium text-dharma-text hover:border-dharma-saffron/45"
                aria-label="Next daily verse"
              >
                <span lang="hi" className="font-devanagari">अगला श्लोक</span>
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {shareOpen && (
        <PatrikaShareStudioModal
          isOpen={shareOpen}
          onClose={() => setShareOpen(false)}
          data={{
            scriptureTitle: item.scriptureTitleSanskrit || item.scriptureTitle,
            chapterTitle: item.chapterTitle,
            reference: `${item.scriptureTitleSanskrit || item.scriptureTitle} ${item.chapterId}.${item.verseId}`,
            sanskrit: item.sanskrit,
            transliteration: item.transliteration,
            hindi: item.hindi,
            translation: item.translation,
            coreShift: item.practicalTeachingHi,
            url: `${SITE_URL}${verseHref}`,
          }}
        />
      )}
    </section>
  );
}
