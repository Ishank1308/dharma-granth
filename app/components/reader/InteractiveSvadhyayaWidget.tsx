'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Languages,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import { PadaLine } from '@/app/components/PadaLine';
import { parseModernContext } from '@/app/components/ModernContextBlock';
import type { ReaderVerseText } from '@/lib/reader-actions';
import {
  cleanVerseField,
  formatVerseRef,
  MEANING_COPY,
  meaningState,
  toAsciiDigits,
  verseLines,
  verseMarkNumber,
} from '@/lib/verse-format';
import type { WordGloss } from '@/lib/word-gloss';

export interface InteractiveSvadhyayaWidgetProps {
  scriptureId: string;
  chapterId: number;
  verse: ReaderVerseText;
  glosses: WordGloss[];
  onClose: () => void;
}

const STAGES = [
  { num: '01', hi: 'श्रवण', en: 'Shloka' },
  { num: '02', hi: 'भावार्थ', en: 'Meaning' },
  { num: '03', hi: 'व्याख्या', en: '3-Pillar Insight' },
  { num: '04', hi: 'निदिध्यासन', en: 'Practice & Pause' },
] as const;

interface VyakhyaPillar {
  num: string;
  hi: string;
  en: string;
  body: string;
  isHindi: boolean;
}

interface SankalpaItem {
  title: string;
  detail: string;
  isFallback?: boolean;
}

const PILLAR_LABELS: Record<string, { hi: string; en: string }> = {
  'प्रसंग एवं भाव': { hi: 'प्रसंग एवं भाव', en: 'Context & Bhava' },
  'पद-विवेचन': { hi: 'पद-विवेचन', en: 'Word & Verse Analysis' },
  'जीवन-साधना': { hi: 'जीवन-साधना', en: 'Living Practice' },
  'भावार्थ': { hi: 'भावार्थ', en: 'Core Meaning' },
  'व्याख्या': { hi: 'व्याख्या', en: 'Exposition' },
  'आधुनिक संदर्भ': { hi: 'आधुनिक संदर्भ', en: 'Modern Context' },
};

const FALLBACK_SANKALPAS: SankalpaItem[] = [
  {
    title: 'शांत श्रवण',
    detail: 'श्लोक की प्रत्येक पंक्ति को एक बार धीमे और स्पष्ट उच्चारण के साथ पढ़ें।',
    isFallback: true,
  },
  {
    title: 'मर्म का स्मरण',
    detail: 'इस श्लोक के मुख्य भाव को दिन के किसी एक कार्य से जोड़कर देखें।',
    isFallback: true,
  },
  {
    title: 'साक्षी निरीक्षण',
    detail: 'प्रतिक्रिया देने से पहले एक शांत श्वास लेकर विवेकपूर्ण आचरण चुनें।',
    isFallback: true,
  },
];

function Bi({ hi, en }: { hi: string; en: string }) {
  return (
    <>
      <span lang="hi" data-bi="hi" className="font-devanagari">
        {hi}
      </span>
      <span aria-hidden="true" data-bi="sep">
        {' · '}
      </span>
      <span data-bi="en">{en}</span>
    </>
  );
}

function parseVyakhyaPillars(text: string): VyakhyaPillar[] {
  const cleaned = cleanVerseField(text);
  if (!cleaned) return [];
  const rawParas = cleaned
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return rawParas.map((para, idx) => {
    const num = String(idx + 1).padStart(2, '0');
    const isHindi = /[ऀ-ॿ]/.test(para);
    const prefixMatch = para.match(
      /^(प्रसंग एवं भाव|पद-विवेचन|जीवन-साधना|भावार्थ|व्याख्या|आधुनिक संदर्भ)\s*[—–:-]\s*([\s\S]+)$/,
    );
    if (prefixMatch) {
      const known = PILLAR_LABELS[prefixMatch[1]] ?? { hi: prefixMatch[1], en: `Pillar ${idx + 1}` };
      return {
        num,
        hi: known.hi,
        en: known.en,
        body: prefixMatch[2].trim(),
        isHindi,
      };
    }

    let fallbackLabel = { hi: `विवेचन ${idx + 1}`, en: `Insight ${idx + 1}` };
    if (idx === 0) {
      fallbackLabel = { hi: 'प्रसंग व मूल दृष्टि', en: 'Context & Core Vision' };
    } else if (rawParas.length >= 3 && idx === rawParas.length - 1) {
      fallbackLabel = { hi: 'जीवन-बोध', en: 'Living Wisdom' };
    } else if (rawParas.length === 3 && idx === 1) {
      fallbackLabel = { hi: 'तत्त्व-विवेचन', en: 'Deep Analysis' };
    }

    return {
      num,
      hi: fallbackLabel.hi,
      en: fallbackLabel.en,
      body: para,
      isHindi,
    };
  });
}

function parseSankalpaBullets(applicationText: string): SankalpaItem[] {
  if (!applicationText.trim()) return [];
  const lines = applicationText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const bulletLines = lines.filter((l) => /^[-•*]\s+/.test(l));
  const source = bulletLines.length > 0 ? bulletLines : lines;

  return source.slice(0, 5).map((line) => {
    const stripped = line.replace(/^[-•*]\s+/, '').trim();
    const boldColon = stripped.match(/^\*\*([^*]+)\*\*\s*[:：—–-]\s*([\s\S]+)$/);
    if (boldColon) {
      return { title: boldColon[1].trim(), detail: boldColon[2].trim().replace(/\*\*/g, '') };
    }
    const boldSpace = stripped.match(/^\*\*([^*]+)\*\*\s+([\s\S]+)$/);
    if (boldSpace) {
      return { title: boldSpace[1].trim(), detail: boldSpace[2].trim().replace(/\*\*/g, '') };
    }
    return { title: '', detail: stripped.replace(/\*\*/g, '') };
  });
}

export function InteractiveSvadhyayaWidget({
  scriptureId,
  chapterId,
  verse,
  glosses,
  onClose,
}: InteractiveSvadhyayaWidgetProps) {
  const verseKey = `${scriptureId}:${chapterId}:${toAsciiDigits(String(verse.number))}`;
  const storageKey = `dharma.svadhyaya.checks.${verseKey}`;

  const [stage, setStage] = useState<0 | 1 | 2 | 3>(0);
  const [activePadaIdx, setActivePadaIdx] = useState(0);
  const [showIast, setShowIast] = useState(false);
  const [meaningLens, setMeaningLens] = useState<'split' | 'hi' | 'en'>('split');
  const [vyakhyaMode, setVyakhyaMode] = useState<'step' | 'all'>('step');
  const [vyakhyaLang, setVyakhyaLang] = useState<'hi' | 'en'>('hi');
  const [activePillarIdx, setActivePillarIdx] = useState(0);

  // Stage 4: Sankalpa checklist & Contemplative Pause Timer
  const [checkedIndices, setCheckedIndices] = useState<number[]>([]);
  const [timerDuration, setTimerDuration] = useState<30 | 60>(30);
  const [remainingSec, setRemainingSec] = useState<number>(30);
  const [timerRunning, setTimerRunning] = useState(false);

  // Reset per-verse transient state if verse changes while open
  useEffect(() => {
    setStage(0);
    setActivePadaIdx(0);
    setActivePillarIdx(0);
    setTimerRunning(false);
    setRemainingSec(timerDuration);
  }, [verseKey, timerDuration]);

  // Load persisted Sankalpa checks on mount / verse change
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setCheckedIndices([]);
        return;
      }
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setCheckedIndices(parsed.filter((n): n is number => typeof n === 'number' && Number.isInteger(n) && n >= 0));
      } else {
        setCheckedIndices([]);
      }
    } catch {
      setCheckedIndices([]);
    }
  }, [storageKey]);

  // Contemplative Pause countdown interval (ticks only while timerRunning is true)
  useEffect(() => {
    if (!timerRunning) return undefined;
    const id = window.setInterval(() => {
      setRemainingSec((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [timerRunning]);

  // Derived data for Stage 1
  const sanskrit = cleanVerseField(verse.sanskrit);
  const sLines = sanskrit ? verseLines(sanskrit) : [];
  const safePadaIdx = glosses.length > 0 ? Math.min(activePadaIdx, glosses.length - 1) : 0;
  const activeGloss = glosses[safePadaIdx];
  const activeLex = activeGloss ? verse.lexicon?.[activeGloss.pada] : undefined;

  // Derived data for Stage 2
  const mState = meaningState(verse);
  const hasHiText = mState.hi === 'text';
  const hasEnText = mState.en === 'text';
  const bothMeaningsText = hasHiText && hasEnText;
  const bothMeaningsPending = mState.hi === 'pending' && mState.en === 'pending';
  const effectiveLens = bothMeaningsText ? meaningLens : hasHiText ? 'hi' : hasEnText ? 'en' : 'split';

  // Derived data for Stage 3
  const hasHiVyakhya = Boolean(cleanVerseField(verse.explanation));
  const hasEnCommentary = Boolean(cleanVerseField(verse.commentary));
  const effectiveVyakhyaSource =
    hasHiVyakhya && hasEnCommentary
      ? vyakhyaLang === 'en'
        ? verse.commentary ?? ''
        : verse.explanation ?? ''
      : verse.explanation || verse.commentary || '';
  const pillars = parseVyakhyaPillars(effectiveVyakhyaSource);
  const safePillarIdx = pillars.length > 0 ? Math.min(activePillarIdx, pillars.length - 1) : 0;

  // Derived data for Stage 4
  const modernParsed = verse.reflection ? parseModernContext(verse.reflection) : null;
  const parsedSankalpas = modernParsed?.hasStructuredFormat
    ? parseSankalpaBullets(modernParsed.applicationText)
    : [];
  const sankalpaItems = parsedSankalpas.length > 0 ? parsedSankalpas : FALLBACK_SANKALPAS;
  const validChecks = checkedIndices.filter((i) => i >= 0 && i < sankalpaItems.length);
  const checkTotal = sankalpaItems.length;
  const checkCount = validChecks.length;

  const reflectionQuestion =
    modernParsed?.hasStructuredFormat && modernParsed.reflectionQuestion
      ? modernParsed.reflectionQuestion
      : 'इस श्लोक का कौन-सा एक भाव आज आपके आचरण को अधिक शांत, स्पष्ट और धर्मनिष्ठ बना सकता है?';
  const isEditorialFallbackQuestion = !(modernParsed?.hasStructuredFormat && modernParsed.reflectionQuestion);

  const toggleSankalpa = (idx: number) => {
    const exists = validChecks.includes(idx);
    const next = exists ? validChecks.filter((n) => n !== idx) : [...validChecks, idx].sort((a, b) => a - b);
    setCheckedIndices(next);
    try {
      if (next.length === 0) {
        localStorage.removeItem(storageKey);
      } else {
        localStorage.setItem(storageKey, JSON.stringify(next));
      }
    } catch {
      // Storage unavailable; keep session state intact.
    }
  };

  const selectDuration = (sec: 30 | 60) => {
    setTimerRunning(false);
    setTimerDuration(sec);
    setRemainingSec(sec);
  };

  const handleStartPause = () => {
    if (remainingSec === 0) {
      setRemainingSec(timerDuration);
      setTimerRunning(true);
      return;
    }
    setTimerRunning((r) => !r);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setRemainingSec(timerDuration);
  };

  // SVG Ring geometry (ASCII math only)
  const checkRingR = 18;
  const checkRingC = 2 * Math.PI * checkRingR;
  const checkOffset = checkTotal > 0 ? checkRingC * (1 - checkCount / checkTotal) : checkRingC;

  const pauseRingR = 34;
  const pauseRingC = 2 * Math.PI * pauseRingR;
  const pauseProgress = timerDuration > 0 ? (timerDuration - remainingSec) / timerDuration : 0;
  const pauseOffset = pauseRingC * (1 - pauseProgress);

  const pillBtn = (active: boolean) =>
    `focus-ring inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
      active
        ? 'border-saffron-600/60 bg-saffron-500/15 text-saffron-900 dark:border-saffron-400/60 dark:bg-saffron-400/15 dark:text-saffron-200'
        : 'border-dharma-border bg-dharma-bg/70 text-dharma-muted hover:border-saffron-500/40 hover:text-dharma-text'
    }`;

  return (
    <section
      id="svadhyaya-studio"
      aria-labelledby="svadhyaya-studio-title"
      className="rounded-card border border-dharma-border bg-dharma-card p-4 shadow-raised sm:p-6"
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 border-b border-dharma-border/70 pb-3.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-dharma-muted">
            <span className="inline-flex items-center gap-1 rounded-full border border-saffron-500/35 bg-saffron-500/10 px-2.5 py-0.5 text-[11px] font-bold text-saffron-800 dark:text-saffron-300">
              <Sparkles className="h-3 w-3" aria-hidden="true" />
              <Bi hi="स्वाध्याय पथ" en="Guided Svadhyaya" />
            </span>
            <span className="font-mono text-xs font-bold tabular-nums text-dharma-muted">
              {formatVerseRef(scriptureId, chapterId, verse.number)}
            </span>
          </div>
          <h2
            id="svadhyaya-studio-title"
            className="mt-1.5 font-sans text-base font-semibold text-dharma-text sm:text-lg"
          >
            <Bi hi="चतुःसोपान स्वाध्याय स्टूडियो" en="4-Stage Svadhyaya Studio" />
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="स्वाध्याय स्टूडियो बंद करें · Close Svadhyaya Studio"
          className="focus-ring inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full border border-dharma-border bg-dharma-bg/80 text-dharma-muted transition hover:border-saffron-500/50 hover:text-dharma-text"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* 4-Stage Stepper Header + Progress Bar */}
      <div className="mt-4 space-y-3">
        <div
          role="group"
          aria-label="स्वाध्याय सोपान · Svadhyaya stages"
          className="grid grid-cols-2 gap-2 sm:grid-cols-4"
        >
          {STAGES.map((s, idx) => {
            const isActive = stage === idx;
            return (
              <button
                key={s.num}
                type="button"
                aria-pressed={isActive}
                onClick={() => setStage(idx as 0 | 1 | 2 | 3)}
                className={`focus-ring flex min-h-[44px] min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
                  isActive
                    ? 'border-saffron-600/60 bg-saffron-500/15 text-dharma-text shadow-2xs dark:border-saffron-400/60 dark:bg-saffron-400/15'
                    : 'border-dharma-border bg-dharma-bg/60 text-dharma-muted hover:border-saffron-500/40 hover:text-dharma-text'
                }`}
              >
                <span
                  className={`font-mono text-[11px] font-bold tabular-nums ${
                    isActive ? 'text-saffron-700 dark:text-saffron-300' : 'text-dharma-muted'
                  }`}
                >
                  {s.num}
                </span>
                <span className="min-w-0 truncate">
                  <Bi hi={s.hi} en={s.en} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Visual Progress Bar + Prev / Next Controls */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={stage === 0}
            onClick={() => setStage((s) => (s > 0 ? ((s - 1) as 0 | 1 | 2 | 3) : s))}
            aria-label="पिछला सोपान · Previous stage"
            className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-bg/80 px-3 text-xs font-semibold text-dharma-text transition hover:border-saffron-500/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">
              <Bi hi="पिछला" en="Prev" />
            </span>
          </button>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-dharma-muted">
              <span>
                <Bi hi={STAGES[stage].hi} en={STAGES[stage].en} />
              </span>
              <span className="font-mono tabular-nums text-dharma-text">
                {stage + 1} / 4
              </span>
            </div>
            <div
              role="progressbar"
              aria-label="स्वाध्याय प्रगति · Stage progress"
              aria-valuemin={1}
              aria-valuemax={4}
              aria-valuenow={stage + 1}
              className="h-2 w-full overflow-hidden rounded-full border border-dharma-border/60 bg-dharma-bg"
            >
              <div
                style={{ width: `${((stage + 1) / 4) * 100}%` }}
                className="h-full rounded-full bg-saffron-600 dark:bg-saffron-400 motion-safe:transition-[width] motion-safe:duration-300"
              />
            </div>
          </div>

          <button
            type="button"
            disabled={stage === 3}
            onClick={() => setStage((s) => (s < 3 ? ((s + 1) as 0 | 1 | 2 | 3) : s))}
            aria-label="अगला सोपान · Next stage"
            className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-bg/80 px-3 text-xs font-semibold text-dharma-text transition hover:border-saffron-500/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="hidden sm:inline">
              <Bi hi="अगला" en="Next" />
            </span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Active Stage Workspace */}
      <div className="mt-4 pt-1">
        {/* STAGE 1: 01 श्रवण · Shloka */}
        {stage === 0 && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-dharma-border bg-dharma-bg/80 px-3.5 py-4 text-center sm:px-6 sm:py-5">
              {sLines.length > 0 ? (
                <p
                  lang="sa"
                  className="font-devanagari text-[clamp(1.2rem,calc(0.98rem+1.3vw),1.65rem)] font-semibold leading-[2.05] text-dharma-text"
                >
                  {sLines.map((line, i) => (
                    <span key={i} className="block">
                      <PadaLine line={line} />
                    </span>
                  ))}
                  <span
                    aria-hidden="true"
                    className="mt-1.5 block font-sans text-sm font-semibold tabular-nums text-saffron-700 dark:text-saffron-300"
                  >
                    ॥ {verseMarkNumber(verse.number)} ॥
                  </span>
                </p>
              ) : (
                <p className="text-sm text-dharma-muted">
                  <Bi hi="संस्कृत मूल पाठ उपलब्ध नहीं है।" en="Sanskrit text is not available." />
                </p>
              )}

              {verse.transliteration && (
                <div className="mt-3">
                  <button
                    type="button"
                    aria-pressed={showIast}
                    onClick={() => setShowIast((v) => !v)}
                    className={pillBtn(showIast)}
                  >
                    <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                    <Bi hi="लिप्यन्तरण" en="IAST Transliteration" />
                  </button>
                  {showIast && (
                    <p
                      lang="sa-Latn"
                      className="mt-3 whitespace-pre-line font-serif text-sm italic leading-relaxed text-dharma-muted sm:text-base"
                    >
                      {cleanVerseField(verse.transliteration).replace(/[\s|।॥0-9.]+$/, '')}
                    </p>
                  )}
                </div>
              )}
            </div>

            {glosses.length > 0 ? (
              <div className="space-y-3 rounded-2xl border border-dharma-border bg-dharma-bg/50 p-3.5 sm:p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-dharma-muted">
                  <span>
                    <Bi
                      hi="पद चुनें — रूप और अर्थ देखें"
                      en="Tap any pada to inspect its form & meaning"
                    />
                  </span>
                  <span className="font-mono tabular-nums text-dharma-text">
                    {safePadaIdx + 1} / {glosses.length}
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="पदच्छेद शब्द · Interactive pada words"
                  className="flex flex-wrap gap-1.5"
                >
                  {glosses.map((g, idx) => {
                    const isSelected = safePadaIdx === idx;
                    const lex = verse.lexicon?.[g.pada];
                    return (
                      <button
                        key={`${g.pada}-${idx}`}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setActivePadaIdx(idx)}
                        className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
                          isSelected
                            ? 'border-saffron-600 bg-saffron-600 text-white shadow-2xs dark:border-saffron-400 dark:bg-saffron-400 dark:text-stone-950'
                            : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-500/50'
                        }`}
                      >
                        {lex?.termDevanagari && (
                          <span lang="sa" className="font-devanagari">
                            {lex.termDevanagari}
                          </span>
                        )}
                        <span lang="sa-Latn" className="font-serif italic">
                          {g.pada}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Pada Callout Strip */}
                {activeGloss && (
                  <div
                    aria-live="polite"
                    className="rounded-xl border border-saffron-500/30 bg-dharma-card p-3.5 sm:p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-baseline gap-2">
                        {activeLex?.termDevanagari && (
                          <span
                            lang="sa"
                            className="font-devanagari text-lg font-bold text-dharma-text"
                          >
                            {activeLex.termDevanagari}
                          </span>
                        )}
                        <span
                          lang="sa-Latn"
                          className="font-serif text-base font-semibold italic text-saffron-800 dark:text-saffron-300"
                        >
                          {activeLex?.termIast || activeGloss.pada}
                        </span>
                        {activeLex?.rootDhatu && (
                          <span className="rounded-full border border-dharma-border bg-dharma-bg px-2.5 py-0.5 text-[11px] font-semibold text-dharma-muted">
                            धातु: {activeLex.rootDhatu}
                            {activeLex.grammarCategory ? ` · ${activeLex.grammarCategory}` : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={safePadaIdx === 0}
                          onClick={() => setActivePadaIdx((i) => Math.max(0, i - 1))}
                          aria-label="पिछला पद · Previous word"
                          className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-bg text-dharma-text transition hover:border-saffron-500/50 disabled:opacity-40"
                        >
                          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          disabled={safePadaIdx >= glosses.length - 1}
                          onClick={() =>
                            setActivePadaIdx((i) => Math.min(glosses.length - 1, i + 1))
                          }
                          aria-label="अगला पद · Next word"
                          className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-bg text-dharma-text transition hover:border-saffron-500/50 disabled:opacity-40"
                        >
                          <ChevronRight className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-dharma-text sm:text-base">
                      {activeGloss.meaning}
                    </p>
                    {(activeLex?.simpleHindi || activeLex?.contextualMeaningHi) && (
                      <p
                        lang="hi"
                        className="mt-1 font-devanagari text-sm leading-[1.9] text-dharma-muted"
                      >
                        {activeLex.simpleHindi || activeLex.contextualMeaningHi}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dharma-border bg-dharma-bg/60 px-4 py-3 text-sm text-dharma-muted">
                {verse.wordMeaning ? (
                  <p className="leading-relaxed text-dharma-text">{cleanVerseField(verse.wordMeaning)}</p>
                ) : (
                  <p>
                    <Bi
                      hi="शांत मन से मूल श्लोक की ध्वनि और लय का पाठ करें, फिर अगले सोपान पर भावार्थ देखें।"
                      en="Read the original verse slowly, letting its rhythm settle before moving to the meaning."
                    />
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* STAGE 2: 02 भावार्थ · Meaning */}
        {stage === 1 && (
          <div className="space-y-4">
            {bothMeaningsText && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-dharma-muted">
                  <Bi hi="अध्ययन दृष्टि चुनें" en="Choose reading lens" />
                </span>
                <div
                  role="group"
                  aria-label="भावार्थ दृष्टि · Meaning lens"
                  className="flex flex-wrap gap-1.5"
                >
                  <button
                    type="button"
                    aria-pressed={effectiveLens === 'split'}
                    onClick={() => setMeaningLens('split')}
                    className={pillBtn(effectiveLens === 'split')}
                  >
                    <Bi hi="तुलना" en="Side-by-Side" />
                  </button>
                  <button
                    type="button"
                    aria-pressed={effectiveLens === 'hi'}
                    onClick={() => setMeaningLens('hi')}
                    className={pillBtn(effectiveLens === 'hi')}
                  >
                    <Bi hi="केवल हिन्दी" en="Hindi Focus" />
                  </button>
                  <button
                    type="button"
                    aria-pressed={effectiveLens === 'en'}
                    onClick={() => setMeaningLens('en')}
                    className={pillBtn(effectiveLens === 'en')}
                  >
                    <Bi hi="केवल अंग्रेज़ी" en="English Focus" />
                  </button>
                </div>
              </div>
            )}

            {bothMeaningsPending && (
              <p className="rounded-2xl border border-dharma-border bg-dharma-bg/70 px-4 py-4 text-sm italic text-dharma-muted">
                <span lang="hi" className="font-devanagari">
                  {MEANING_COPY.bothPendingHi}
                </span>
                {' · '}
                <span lang="en">{MEANING_COPY.bothPendingEn}</span>
              </p>
            )}

            {(hasHiText || hasEnText) && (
              <div
                className={
                  effectiveLens === 'split' && bothMeaningsText
                    ? 'grid grid-cols-1 gap-3.5 md:grid-cols-2'
                    : 'space-y-3.5'
                }
              >
                {hasHiText && (effectiveLens === 'split' || effectiveLens === 'hi') && (
                  <div className="rounded-2xl border border-dharma-border bg-dharma-bg/75 p-4 sm:p-5">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-dharma-muted">
                      <span>
                        <Bi
                          hi={
                            verse.hindiRange
                              ? MEANING_COPY.hiRange(verse.hindiRange)
                              : 'भावार्थ (हिन्दी)'
                          }
                          en={
                            verse.hindiRange
                              ? `Hindi · verses ${toAsciiDigits(verse.hindiRange.replace('-', '–'))}`
                              : 'Hindi Meaning'
                          }
                        />
                      </span>
                    </div>
                    <p
                      lang="hi"
                      className={`whitespace-pre-line font-devanagari text-dharma-text ${
                        effectiveLens === 'hi'
                          ? 'text-base leading-[2.1] sm:text-lg'
                          : 'text-[0.98rem] leading-[2.0] sm:text-base'
                      }`}
                    >
                      {cleanVerseField(verse.hindi)}
                    </p>
                  </div>
                )}

                {hasEnText && (effectiveLens === 'split' || effectiveLens === 'en') && (
                  <div className="rounded-2xl border border-dharma-border bg-dharma-bg/75 p-4 sm:p-5">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-dharma-muted">
                      <span>
                        <Bi
                          hi="अंग्रेज़ी अनुवाद"
                          en={
                            verse.translationRange
                              ? MEANING_COPY.enRange(toAsciiDigits(verse.translationRange))
                              : 'English Translation'
                          }
                        />
                      </span>
                    </div>
                    <p
                      lang="en"
                      className={`whitespace-pre-line font-serif text-dharma-text ${
                        effectiveLens === 'en'
                          ? 'text-base leading-relaxed sm:text-lg'
                          : 'text-[0.98rem] leading-relaxed sm:text-base'
                      }`}
                    >
                      {cleanVerseField(verse.translation)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {!bothMeaningsPending && !hasHiText && (
              <p
                lang="hi"
                className="rounded-xl border border-dharma-border bg-dharma-bg/60 px-4 py-3 font-devanagari text-xs text-dharma-muted"
              >
                {mState.hi === 'review'
                  ? MEANING_COPY.hiReview
                  : mState.hi === 'with' && verse.hindiSeeVerse != null
                    ? MEANING_COPY.hiWith(verse.hindiSeeVerse)
                    : MEANING_COPY.hiPending}
              </p>
            )}

            {!bothMeaningsPending && !hasEnText && (
              <p
                lang="en"
                className="rounded-xl border border-dharma-border bg-dharma-bg/60 px-4 py-3 text-xs text-dharma-muted"
              >
                {mState.en === 'with' && verse.translationSeeVerse != null
                  ? MEANING_COPY.enWith(verse.translationSeeVerse)
                  : MEANING_COPY.enPending}
              </p>
            )}
          </div>
        )}

        {/* STAGE 3: 03 व्याख्या · 3-Pillar Insight */}
        {stage === 2 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-dharma-muted">
                <Bi
                  hi="संपादकीय व्याख्या · मूल शास्त्र से पृथक्"
                  en="Editorial explanation · distinct from source scripture"
                />
              </span>

              <div className="flex flex-wrap items-center gap-1.5">
                {hasHiVyakhya && hasEnCommentary && (
                  <div
                    role="group"
                    aria-label="व्याख्या भाषा · Commentary language"
                    className="flex flex-wrap gap-1.5"
                  >
                    <button
                      type="button"
                      aria-pressed={vyakhyaLang === 'hi'}
                      onClick={() => {
                        setVyakhyaLang('hi');
                        setActivePillarIdx(0);
                      }}
                      className={pillBtn(vyakhyaLang === 'hi')}
                    >
                      <Bi hi="हिन्दी व्याख्या" en="Hindi" />
                    </button>
                    <button
                      type="button"
                      aria-pressed={vyakhyaLang === 'en'}
                      onClick={() => {
                        setVyakhyaLang('en');
                        setActivePillarIdx(0);
                      }}
                      className={pillBtn(vyakhyaLang === 'en')}
                    >
                      <Bi hi="अंग्रेज़ी टीका" en="English" />
                    </button>
                  </div>
                )}

                {pillars.length > 1 && (
                  <div
                    role="group"
                    aria-label="स्तम्भ दृश्य · Pillar view mode"
                    className="flex flex-wrap gap-1.5"
                  >
                    <button
                      type="button"
                      aria-pressed={vyakhyaMode === 'step'}
                      onClick={() => setVyakhyaMode('step')}
                      className={pillBtn(vyakhyaMode === 'step')}
                    >
                      <Bi hi="एक-एक स्तम्भ" en="Step Focus" />
                    </button>
                    <button
                      type="button"
                      aria-pressed={vyakhyaMode === 'all'}
                      onClick={() => setVyakhyaMode('all')}
                      className={pillBtn(vyakhyaMode === 'all')}
                    >
                      <Bi hi="सभी एक साथ" en="View All" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {pillars.length === 0 ? (
              <p className="rounded-2xl border border-dharma-border bg-dharma-bg/70 px-4 py-4 text-sm italic text-dharma-muted">
                <Bi
                  hi="इस श्लोक की विस्तृत व्याख्या अभी उपलब्ध नहीं है।"
                  en="Detailed commentary is not yet available for this verse."
                />
              </p>
            ) : vyakhyaMode === 'step' && pillars.length > 1 ? (
              <div className="space-y-3">
                <div
                  role="group"
                  aria-label="व्याख्या स्तम्भ · Insight pillars"
                  className="flex flex-wrap gap-1.5"
                >
                  {pillars.map((pillar, idx) => {
                    const active = safePillarIdx === idx;
                    return (
                      <button
                        key={pillar.num}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setActivePillarIdx(idx)}
                        className={pillBtn(active)}
                      >
                        <span className="font-mono text-[11px] font-bold tabular-nums">
                          {pillar.num}
                        </span>
                        <Bi hi={pillar.hi} en={pillar.en} />
                      </button>
                    );
                  })}
                </div>

                {pillars[safePillarIdx] && (
                  <article className="rounded-2xl border border-dharma-border bg-dharma-bg/80 p-4 sm:p-5">
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <h3 className="flex items-center gap-2 font-sans text-sm font-semibold text-saffron-800 dark:text-saffron-300 sm:text-base">
                        <span className="font-mono text-xs font-bold tabular-nums">
                          {pillars[safePillarIdx].num}
                        </span>
                        <Bi
                          hi={pillars[safePillarIdx].hi}
                          en={pillars[safePillarIdx].en}
                        />
                      </h3>
                      <span className="font-mono text-xs font-semibold tabular-nums text-dharma-muted">
                        {safePillarIdx + 1} / {pillars.length}
                      </span>
                    </div>

                    <p
                      lang={pillars[safePillarIdx].isHindi ? 'hi' : 'en'}
                      className={`whitespace-pre-line text-dharma-text ${
                        pillars[safePillarIdx].isHindi
                          ? 'font-devanagari text-[0.98rem] leading-[2.0] sm:text-base'
                          : 'font-serif text-[0.98rem] leading-relaxed sm:text-base'
                      }`}
                    >
                      {pillars[safePillarIdx].body}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-dharma-border/60 pt-3">
                      <button
                        type="button"
                        disabled={safePillarIdx === 0}
                        onClick={() => setActivePillarIdx((i) => Math.max(0, i - 1))}
                        className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-card px-3.5 text-xs font-semibold text-dharma-text transition hover:border-saffron-500/50 disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        <Bi hi="पिछला स्तम्भ" en="Prev Pillar" />
                      </button>
                      <button
                        type="button"
                        disabled={safePillarIdx >= pillars.length - 1}
                        onClick={() =>
                          setActivePillarIdx((i) => Math.min(pillars.length - 1, i + 1))
                        }
                        className="focus-ring inline-flex min-h-[44px] items-center gap-1 rounded-full border border-dharma-border bg-dharma-card px-3.5 text-xs font-semibold text-dharma-text transition hover:border-saffron-500/50 disabled:opacity-40"
                      >
                        <Bi hi="अगला स्तम्भ" en="Next Pillar" />
                        <ChevronRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {pillars.map((pillar) => (
                  <article
                    key={pillar.num}
                    className="rounded-2xl border border-dharma-border bg-dharma-bg/75 p-4 sm:p-5"
                  >
                    <h3 className="mb-2 flex items-center gap-2 font-sans text-sm font-semibold text-saffron-800 dark:text-saffron-300">
                      <span className="font-mono text-xs font-bold tabular-nums">{pillar.num}</span>
                      <Bi hi={pillar.hi} en={pillar.en} />
                    </h3>
                    <p
                      lang={pillar.isHindi ? 'hi' : 'en'}
                      className={`whitespace-pre-line text-dharma-text ${
                        pillar.isHindi
                          ? 'font-devanagari text-[0.98rem] leading-[2.0] sm:text-base'
                          : 'font-serif text-[0.98rem] leading-relaxed sm:text-base'
                      }`}
                    >
                      {pillar.body}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STAGE 4: 04 निदिध्यासन · Practice & Pause */}
        {stage === 3 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-dharma-muted">
              <span>
                <Bi
                  hi="आधुनिक प्रयोग व मौन मनन · मूल शास्त्र नहीं"
                  en="Editorial Application · Not Scripture"
                />
              </span>
              <span className="text-[11px]">
                <Bi
                  hi="केवल आपके उपकरण पर सुरक्षित"
                  en="Saved on this device only"
                />
              </span>
            </div>

            {modernParsed && !modernParsed.hasStructuredFormat && modernParsed.rawText && (
              <div className="rounded-2xl border border-dharma-border bg-dharma-bg/70 p-4">
                <p
                  lang={/[ऀ-ॿ]/.test(modernParsed.rawText) ? 'hi' : 'en'}
                  className="whitespace-pre-line font-devanagari text-sm leading-[1.95] text-dharma-text sm:text-base"
                >
                  {toAsciiDigits(modernParsed.rawText)}
                </p>
              </div>
            )}

            {modernParsed?.hasStructuredFormat && modernParsed.contextText && (
              <div className="rounded-2xl border border-dharma-border bg-dharma-bg/65 p-4">
                <p className="mb-1.5 text-xs font-semibold text-dharma-muted">
                  <Bi hi="आधुनिक संदर्भ" en="Modern Context" />
                </p>
                <p
                  lang="hi"
                  className="whitespace-pre-line font-devanagari text-sm leading-[1.95] text-dharma-text sm:text-base"
                >
                  {toAsciiDigits(modernParsed.contextText.replace(/\*\*/g, ''))}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
              {/* Checkable Sankalpa Cards + Live SVG Progress Ring */}
              <div className="space-y-3 rounded-2xl border border-dharma-border bg-dharma-bg/75 p-4 lg:col-span-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-dharma-text sm:text-base">
                      <Bi
                        hi={
                          parsedSankalpas.length > 0
                            ? 'आज के जीवन में प्रयोग'
                            : 'व्यक्तिगत स्वाध्याय अभ्यास'
                        }
                        en={
                          parsedSankalpas.length > 0
                            ? 'Daily Sankalpa Practice'
                            : 'Personal Study Sankalpa'
                        }
                      />
                    </h3>
                    <p className="mt-0.5 text-xs text-dharma-muted">
                      <Bi
                        hi="जिन बिंदुओं का आप आज अभ्यास करेंगे उन्हें चिह्नित करें"
                        en="Mark each practice step as you apply it today"
                      />
                    </p>
                  </div>

                  {/* Live SVG Progress Ring (0/3 -> 3/3) */}
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                      className="h-12 w-12"
                    >
                      <circle
                        cx="24"
                        cy="24"
                        r={checkRingR}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-dharma-border"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r={checkRingR}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray={checkRingC}
                        strokeDashoffset={checkOffset}
                        transform="rotate(-90 24 24)"
                        className="text-saffron-600 dark:text-saffron-400 motion-safe:transition-[stroke-dashoffset] motion-safe:duration-300 motion-reduce:transition-none"
                      />
                    </svg>
                    <span className="absolute font-mono text-[11px] font-bold tabular-nums text-dharma-text">
                      {checkCount}/{checkTotal}
                    </span>
                  </div>
                </div>

                <div
                  role="group"
                  aria-label="संकल्प अभ्यास सूची · Sankalpa practice checklist"
                  className="space-y-2"
                >
                  {sankalpaItems.map((item, idx) => {
                    const isChecked = validChecks.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        role="checkbox"
                        aria-checked={isChecked}
                        onClick={() => toggleSankalpa(idx)}
                        className={`focus-ring flex min-h-[44px] w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                          isChecked
                            ? 'border-emerald-600/50 bg-emerald-500/10 text-dharma-text dark:border-emerald-400/45 dark:bg-emerald-500/10'
                            : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-500/45'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                            isChecked
                              ? 'border-emerald-600 bg-emerald-600 text-white dark:border-emerald-400 dark:bg-emerald-400 dark:text-stone-950'
                              : 'border-dharma-border bg-dharma-bg'
                          }`}
                        >
                          {isChecked && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                        </span>
                        <span lang="hi" className="min-w-0 flex-1 font-devanagari text-sm leading-[1.85]">
                          {item.title && (
                            <strong className="font-semibold text-dharma-text">
                              {toAsciiDigits(item.title)}:{' '}
                            </strong>
                          )}
                          <span className={isChecked ? 'text-dharma-muted' : 'text-dharma-text'}>
                            {toAsciiDigits(item.detail)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* चिंतन प्रश्न + 30s / 60s मौन मनन (Contemplative Pause Timer) */}
              <div className="flex flex-col justify-between space-y-4 rounded-2xl border border-dharma-border bg-dharma-bg/75 p-4 lg:col-span-2">
                <div className="space-y-2">
                  <h3 className="font-sans text-sm font-semibold text-dharma-text sm:text-base">
                    <Bi hi="चिंतन प्रश्न व मौन मनन" en="Reflection & Contemplative Pause" />
                  </h3>
                  <blockquote
                    lang={/[ऀ-ॿ]/.test(reflectionQuestion) ? 'hi' : 'en'}
                    className="border-l-2 border-saffron-500 pl-3 font-devanagari text-sm font-medium leading-[1.9] text-dharma-text dark:border-saffron-400"
                  >
                    &ldquo;{toAsciiDigits(reflectionQuestion)}&rdquo;
                  </blockquote>
                  {isEditorialFallbackQuestion && (
                    <p className="text-[11px] text-dharma-muted">
                      <Bi
                        hi="स्वाध्याय हेतु संपादकीय चिंतन सूत्र"
                        en="Editorial contemplation prompt for personal inquiry"
                      />
                    </p>
                  )}
                </div>

                <div className="space-y-3 rounded-xl border border-dharma-border bg-dharma-card p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-dharma-muted">
                      <Bi hi="मौन मनन अवधि" en="Pause Duration" />
                    </span>
                    <div
                      role="group"
                      aria-label="मौन मनन अवधि · Contemplative pause duration"
                      className="flex items-center gap-1.5"
                    >
                      {([30, 60] as const).map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          aria-pressed={timerDuration === sec}
                          onClick={() => selectDuration(sec)}
                          className={`focus-ring inline-flex min-h-[44px] min-w-[52px] items-center justify-center rounded-full border px-3 font-mono text-xs font-bold tabular-nums transition ${
                            timerDuration === sec
                              ? 'border-saffron-600/60 bg-saffron-500/15 text-saffron-900 dark:border-saffron-400/60 dark:bg-saffron-400/15 dark:text-saffron-200'
                              : 'border-dharma-border bg-dharma-bg text-dharma-muted hover:text-dharma-text'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        aria-hidden="true"
                        className="h-20 w-20"
                      >
                        <circle
                          cx="40"
                          cy="40"
                          r={pauseRingR}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4.5"
                          className="text-dharma-border"
                        />
                        <circle
                          cx="40"
                          cy="40"
                          r={pauseRingR}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                          strokeDasharray={pauseRingC}
                          strokeDashoffset={pauseOffset}
                          transform="rotate(-90 40 40)"
                          className="text-saffron-600 dark:text-saffron-400 motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700 motion-reduce:transition-none"
                        />
                      </svg>
                      <span className="absolute font-mono text-sm font-bold tabular-nums text-dharma-text">
                        {remainingSec}s
                      </span>
                    </div>

                    <div className="flex flex-1 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={handleStartPause}
                        className="focus-ring inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-full border border-saffron-600 bg-saffron-600 px-3.5 text-xs font-semibold text-white transition hover:bg-saffron-700 dark:border-saffron-400 dark:bg-saffron-400 dark:text-stone-950 dark:hover:bg-saffron-300"
                      >
                        {timerRunning ? (
                          <>
                            <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                            <Bi hi="विराम" en="Pause" />
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" aria-hidden="true" />
                            <Bi
                              hi={remainingSec === 0 ? 'पुनः प्रारम्भ' : 'प्रारम्भ'}
                              en={remainingSec === 0 ? 'Restart' : 'Start'}
                            />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={handleResetTimer}
                        aria-label="मौन मनन रीसेट करें · Reset contemplative timer"
                        className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-dharma-border bg-dharma-bg px-3 text-xs font-semibold text-dharma-text transition hover:border-saffron-500/50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {remainingSec === 0 && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-300"
                    >
                      <Bi
                        hi="मौन मनन पूर्ण — शांत चित्त से स्वाध्याय को धारण करें।"
                        en="Contemplative pause complete."
                      />
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
