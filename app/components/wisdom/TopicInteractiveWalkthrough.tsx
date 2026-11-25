'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ExternalLink,
  Heart,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Wind,
  X,
} from 'lucide-react';
import type { WisdomTopic } from '@/data/wisdom-for-life';
import { wisdomVerseHref } from '@/lib/wisdom-links';

type OptionalStepInput =
  | {
      id?: string;
      titleHi?: string;
      titleEn?: string;
      bodyHi?: string;
      bodyEn?: string;
    }
  | string;

type OptionalQuestionInput =
  | {
      hi?: string;
      en?: string;
      contextHi?: string;
      contextEn?: string;
    }
  | string;

export interface TopicInteractiveWalkthroughProps {
  topic: WisdomTopic & {
    practicalSteps?: OptionalStepInput[];
    reflectionQuestions?: OptionalQuestionInput[];
  };
  onClose: () => void;
}

interface ActionStepItem {
  id: string;
  titleHi: string;
  titleEn: string;
  bodyHi: string;
  bodyEn: string;
}

interface ReflectionQuestionItem {
  id: string;
  badgeHi: string;
  badgeEn: string;
  questionHi: string;
  questionEn: string;
  contextHi?: string;
  contextEn?: string;
}

type BreathRhythmMode = '4-4-6' | '4-0-6';

interface BreathPhase {
  key: 'inhale' | 'hold' | 'exhale';
  seconds: number;
  labelHi: string;
  labelEn: string;
  cueHi: string;
  cueEn: string;
}

const BREATH_PHASES: Record<BreathRhythmMode, BreathPhase[]> = {
  '4-4-6': [
    {
      key: 'inhale',
      seconds: 4,
      labelHi: 'पूरक',
      labelEn: 'Inhale',
      cueHi: 'नासिका से धीमी और शांत श्वास भीतर लें',
      cueEn: 'Breathe in gently and steadily through the nose',
    },
    {
      key: 'hold',
      seconds: 4,
      labelHi: 'कुम्भक',
      labelEn: 'Hold',
      cueHi: 'बिना किसी खिंचाव के शांत मौन में ठहरें',
      cueEn: 'Rest effortlessly in calm inner stillness',
    },
    {
      key: 'exhale',
      seconds: 6,
      labelHi: 'रेचक',
      labelEn: 'Exhale',
      cueHi: 'कंधों का तनाव छोड़ते हुए लंबी श्वास बाहर छोड़ें',
      cueEn: 'Release tension smoothly with a long, unhurried exhale',
    },
  ],
  '4-0-6': [
    {
      key: 'inhale',
      seconds: 4,
      labelHi: 'पूरक',
      labelEn: 'Inhale',
      cueHi: 'सौम्य भाव से 4 सेकंड तक श्वास भीतर भरें',
      cueEn: 'Inhale softly for 4 seconds without strain',
    },
    {
      key: 'exhale',
      seconds: 6,
      labelHi: 'रेचक',
      labelEn: 'Exhale',
      cueHi: 'बिना रोके 6 सेकंड तक शांत श्वास बाहर छोड़ें',
      cueEn: 'Exhale smoothly for 6 seconds with no breath hold',
    },
  ],
};

const STUDIO_STEPS = [
  { num: '01', hi: 'संवेदना', en: 'Acknowledge' },
  { num: '02', hi: 'शास्त्र-दृष्टि', en: 'Scriptural Shift' },
  { num: '03', hi: 'श्वास-संतुलन', en: 'Calm Breath Pacer' },
  { num: '04', hi: 'सूक्ष्म अभ्यास', en: 'Action Checklist' },
  { num: '05', hi: 'आत्म-चिंतन', en: 'Self-Inquiry' },
] as const;

export function TopicInteractiveWalkthrough({ topic, onClose }: TopicInteractiveWalkthroughProps) {
  const rawUid = useId().replace(/:/g, '');
  const lotusGlowId = `lotus-glow-${rawUid}`;
  const lotusRingId = `lotus-ring-${rawUid}`;
  const progressGradId = `progress-grad-${rawUid}`;

  const [activeStep, setActiveStep] = useState<number>(0);
  const [verseIdx, setVerseIdx] = useState<number>(0);

  // Step 3: Guided Pranayama Rhythm state
  const [breathMode, setBreathMode] = useState<BreathRhythmMode>('4-4-6');
  const [breathRunning, setBreathRunning] = useState<boolean>(false);
  const [phaseIdx, setPhaseIdx] = useState<number>(0);
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cycles, setCycles] = useState<number>(0);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Step 4 & Step 5: localStorage-persisted state
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [questionIdx, setQuestionIdx] = useState<number>(0);
  const [privateNote, setPrivateNote] = useState<string>('');
  const [noteSavedAt, setNoteSavedAt] = useState<boolean>(false);

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const phaseDeadlineRef = useRef<number>(0);

  const stepsStorageKey = `dharma.wisdom.steps.${topic.slug}`;
  const noteStorageKey = `dharma.wisdom.note.${topic.slug}`;

  // Detect prefers-reduced-motion & Escape key cleanly
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      e.preventDefault();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    if (typeof window.matchMedia !== 'function') {
      return () => window.removeEventListener('keydown', onKeyDown);
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      mq.removeEventListener('change', onChange);
    };
  }, [onClose]);

  // Load persisted checklist & private note per topic slug
  useEffect(() => {
    setVerseIdx(0);
    setQuestionIdx(0);
    try {
      const rawSteps = window.localStorage.getItem(stepsStorageKey);
      if (rawSteps) {
        const parsed: unknown = JSON.parse(rawSteps);
        if (Array.isArray(parsed)) {
          setCheckedIds(parsed.filter((item): item is string => typeof item === 'string'));
        } else if (
          parsed &&
          typeof parsed === 'object' &&
          'completed' in parsed &&
          Array.isArray((parsed as { completed: unknown }).completed)
        ) {
          setCheckedIds(
            (parsed as { completed: unknown[] }).completed.filter(
              (item): item is string => typeof item === 'string',
            ),
          );
        } else {
          setCheckedIds([]);
        }
      } else {
        setCheckedIds([]);
      }
    } catch {
      setCheckedIds([]);
    }

    try {
      const savedNote = window.localStorage.getItem(noteStorageKey);
      setPrivateNote(savedNote ?? '');
      setNoteSavedAt(Boolean(savedNote));
    } catch {
      setPrivateNote('');
      setNoteSavedAt(false);
    }
  }, [stepsStorageKey, noteStorageKey]);

  // Breath timer loop using wall-clock deadline so background throttling never skews counts
  const phases = BREATH_PHASES[breathMode];
  const currentPhase = phases[phaseIdx] ?? phases[0];

  useEffect(() => {
    if (!breathRunning) return;
    phaseDeadlineRef.current = Date.now() + secondsLeft * 1000;

    const timer = window.setInterval(() => {
      const remainingMs = phaseDeadlineRef.current - Date.now();
      if (remainingMs <= 80) {
        setPhaseIdx((prevIdx) => {
          const list = BREATH_PHASES[breathMode];
          const nextIdx = (prevIdx + 1) % list.length;
          if (nextIdx === 0) {
            setCycles((c) => c + 1);
          }
          const nextSec = list[nextIdx].seconds;
          phaseDeadlineRef.current = Date.now() + nextSec * 1000;
          setSecondsLeft(nextSec);
          return nextIdx;
        });
      } else {
        setSecondsLeft(Math.max(1, Math.ceil(remainingMs / 1000)));
      }
    }, 200);

    return () => window.clearInterval(timer);
    // secondsLeft is intentionally read only when starting/resuming or switching mode
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathRunning, breathMode]);

  const handleSelectBreathMode = (mode: BreathRhythmMode) => {
    setBreathRunning(false);
    setBreathMode(mode);
    setPhaseIdx(0);
    setSecondsLeft(BREATH_PHASES[mode][0].seconds);
  };

  const handleResetBreath = () => {
    setBreathRunning(false);
    setPhaseIdx(0);
    setSecondsLeft(BREATH_PHASES[breathMode][0].seconds);
    setCycles(0);
  };

  // Derive topic-specific checkable action steps (Editorial Application · Not Scripture)
  const actionSteps = useMemo<ActionStepItem[]>(() => {
    if (Array.isArray(topic.practicalSteps) && topic.practicalSteps.length > 0) {
      return topic.practicalSteps.map((item, i) => {
        if (typeof item === 'string') {
          return {
            id: `step-${i}`,
            titleHi: `अभ्यास ${i + 1}`,
            titleEn: `Practice ${i + 1}`,
            bodyHi: item,
            bodyEn: item,
          };
        }
        return {
          id: item.id ?? `step-${i}`,
          titleHi: item.titleHi ?? `अभ्यास ${i + 1}`,
          titleEn: item.titleEn ?? `Practice ${i + 1}`,
          bodyHi: item.bodyHi ?? item.bodyEn ?? '',
          bodyEn: item.bodyEn ?? item.bodyHi ?? '',
        };
      });
    }

    const derived: ActionStepItem[] = [];
    topic.reflections.forEach((ref, idx) => {
      derived.push({
        id: `daily-practice-${idx}`,
        titleHi: ref.titleHi || 'नित्य साधना प्रयोग',
        titleEn: ref.title || 'Core Daily Practice',
        bodyHi: ref.dailyPracticeHi || ref.dailyPractice,
        bodyEn: ref.dailyPractice || ref.dailyPracticeHi,
      });
    });

    const leadVerse = topic.verses[0];
    if (leadVerse) {
      derived.push({
        id: `verse-pause-${leadVerse.id}`,
        titleHi: `श्लोक स्मरण · ${leadVerse.referenceDisplayHi}`,
        titleEn: `Scriptural Anchor · ${leadVerse.referenceDisplay}`,
        bodyHi: `प्रतिक्रिया देने से पहले 1 मिनट रुककर ${leadVerse.referenceDisplayHi} के मूल भाव को शांत मन से पढ़ें और स्मरण करें।`,
        bodyEn: `Pause for 1 quiet minute before reacting and revisit the central insight of ${leadVerse.referenceDisplay}.`,
      });
    }

    derived.push({
      id: 'breath-settle',
      titleHi: 'तीन शांत श्वास-चक्र',
      titleEn: '3 Calm Breath Cycles',
      bodyHi: `श्वास-संतुलन अभ्यास में कम से कम 3 पूर्ण चक्र पूरे करें और इस आधार में ठहरें: "${topic.compassionateIntro.spiritualFoundationHi}"`,
      bodyEn: `Complete at least 3 calm breath cycles while resting in this ground: "${topic.compassionateIntro.spiritualFoundationEn}"`,
    });

    const themeEn = topic.traditionalContextOverview.keyThemes[0];
    const themeHi = topic.traditionalContextOverview.keyThemesHi?.[0] ?? themeEn;
    if (themeEn) {
      derived.push({
        id: 'living-theme',
        titleHi: `आज का व्यवहार-संकल्प · ${themeHi}`,
        titleEn: `One Intentional Action · ${themeEn}`,
        bodyHi: `आज के किसी एक साधारण कार्य या संवाद में "${themeHi}" की दृष्टि को सजग रूप से व्यवहार में उतारें।`,
        bodyEn: `Bring "${themeEn}" into one ordinary conversation, duty, or decision today.`,
      });
    }

    return derived;
  }, [topic]);

  // Derive topic-specific self-inquiry questions
  const inquiryQuestions = useMemo<ReflectionQuestionItem[]>(() => {
    if (Array.isArray(topic.reflectionQuestions) && topic.reflectionQuestions.length > 0) {
      return topic.reflectionQuestions.map((q, i) => {
        if (typeof q === 'string') {
          return {
            id: `q-${i}`,
            badgeHi: `प्रश्न ${i + 1}`,
            badgeEn: `Question ${i + 1}`,
            questionHi: q,
            questionEn: q,
          };
        }
        return {
          id: `q-${i}`,
          badgeHi: `प्रश्न ${i + 1}`,
          badgeEn: `Question ${i + 1}`,
          questionHi: q.hi ?? q.en ?? '',
          questionEn: q.en ?? q.hi ?? '',
          contextHi: q.contextHi,
          contextEn: q.contextEn,
        };
      });
    }

    const items: ReflectionQuestionItem[] = [];
    topic.reflections.forEach((ref, idx) => {
      items.push({
        id: `prompt-${idx}`,
        badgeHi: ref.titleHi || 'मूल आत्म-जिज्ञासा',
        badgeEn: ref.title || 'Core Contemplation',
        questionHi: ref.contemplationPromptHi || ref.contemplationPrompt,
        questionEn: ref.contemplationPrompt || ref.contemplationPromptHi,
        contextHi: ref.insightHi,
        contextEn: ref.insight,
      });
    });

    const v0 = topic.verses[0];
    if (v0) {
      items.push({
        id: `scriptural-mirror-${v0.id}`,
        badgeHi: `शास्त्र-दर्पण · ${v0.referenceDisplayHi}`,
        badgeEn: `Scriptural Mirror · ${v0.referenceDisplay}`,
        questionHi: `जब आप ${v0.referenceDisplayHi} के आलोक में अपनी वर्तमान परिस्थिति को देखते हैं, तो आज कौन-सी एक अनावश्यक चिंता या पकड़ आप शांत भाव से छोड़ सकते हैं?`,
        questionEn: `Looking at your present situation through ${v0.referenceDisplay}, what one reactive grip or assumption can you set down today?`,
        contextHi: v0.literalTranslationHi,
        contextEn: v0.literalTranslationEn,
      });
    }

    items.push({
      id: 'timeless-ground-inquiry',
      badgeHi: 'साक्षी आधार',
      badgeEn: 'Steady Inner Ground',
      questionHi: `आज के दिन के किस एक साधारण क्षण में आप स्वयं को यह याद दिलाएंगे — "${topic.compassionateIntro.spiritualFoundationHi}"?`,
      questionEn: `In which one ordinary moment today will you remind yourself: "${topic.compassionateIntro.spiritualFoundationEn}"?`,
    });

    return items;
  }, [topic]);

  const toggleActionStep = (stepId: string) => {
    setCheckedIds((prev) => {
      const next = prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId];
      try {
        window.localStorage.setItem(stepsStorageKey, JSON.stringify(next));
      } catch {
        // Ignore storage quota / private-mode write errors
      }
      return next;
    });
  };

  const resetChecklist = () => {
    setCheckedIds([]);
    try {
      window.localStorage.removeItem(stepsStorageKey);
    } catch {
      // Ignore storage errors
    }
  };

  const handleNoteChange = (value: string) => {
    setPrivateNote(value);
    try {
      if (value.trim()) {
        window.localStorage.setItem(noteStorageKey, value);
        setNoteSavedAt(true);
      } else {
        window.localStorage.removeItem(noteStorageKey);
        setNoteSavedAt(false);
      }
    } catch {
      // Ignore storage errors
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % STUDIO_STEPS.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + STUDIO_STEPS.length) % STUDIO_STEPS.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = STUDIO_STEPS.length - 1;
    else return;
    e.preventDefault();
    setActiveStep(next);
    tabRefs.current[next]?.focus();
  };

  const checkedCount = actionSteps.filter((s) => checkedIds.includes(s.id)).length;
  const progressPct = actionSteps.length > 0 ? Math.round((checkedCount / actionSteps.length) * 100) : 0;
  const selectedVerse = topic.verses[verseIdx] ?? topic.verses[0];
  const selectedQuestion = inquiryQuestions[questionIdx] ?? inquiryQuestions[0];

  // SVG lotus scale for non-reduced-motion breathing
  const lotusScale =
    !breathRunning || reducedMotion
      ? 1
      : currentPhase.key === 'inhale' || currentPhase.key === 'hold'
        ? 1.18
        : 0.84;

  const lotusTransitionMs =
    !breathRunning || reducedMotion
      ? 0
      : currentPhase.key === 'hold'
        ? 300
        : currentPhase.seconds * 1000;

  const ringCircumference = 2 * Math.PI * 18;
  const ringDashOffset = ringCircumference * (1 - progressPct / 100);

  return (
    <section
      id="wisdom-inquiry-studio"
      aria-labelledby="wisdom-studio-heading"
      className="rounded-3xl border border-dharma-border bg-dharma-card text-dharma-text shadow-xl overflow-hidden"
    >
      {/* Top Studio Header Bar */}
      <div className="border-b border-dharma-border bg-dharma-bg/70 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-saffron-500/15 text-saffron-700 dark:text-saffron-300 border border-saffron-500/25">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
              <span lang="hi" data-bi="hi">संवादात्मक स्वाध्याय स्टूडियो · संपादकीय अभ्यास</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">5-Step Dharmic Inquiry · Editorial Practice</span>
            </p>
            <h2 id="wisdom-studio-heading" className="text-base sm:text-lg font-serif font-bold text-dharma-text truncate">
              <span data-bi="en">{topic.titleEn}</span>
              <span data-bi="sep"> · </span>
              <span lang="hi" data-bi="hi" className="font-devanagari">{topic.titleHi}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono tabular-nums text-dharma-muted px-2.5 py-1 rounded-full border border-dharma-border bg-dharma-card">
            {activeStep + 1} / 5
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Interactive 5-Step Inquiry"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-3 text-xs font-semibold text-dharma-text hover:border-saffron-400 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-saffron-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>
              <span lang="hi" data-bi="hi">बंद करें</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">Close</span>
            </span>
          </button>
        </div>
      </div>

      {/* 5-Step Tablist */}
      <div
        role="tablist"
        aria-label="5-Step Dharmic Inquiry"
        aria-orientation="horizontal"
        className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-2.5 sm:p-3 border-b border-dharma-border bg-dharma-bg/40"
      >
        {STUDIO_STEPS.map((step, idx) => {
          const isSelected = activeStep === idx;
          return (
            <button
              key={step.num}
              ref={(el) => {
                tabRefs.current[idx] = el;
              }}
              id={`wisdom-step-tab-${idx}`}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`wisdom-step-panel-${idx}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => setActiveStep(idx)}
              onKeyDown={(e) => handleTabKeyDown(e, idx)}
              className={`min-h-[44px] rounded-xl px-3 py-2 text-left text-xs font-semibold transition border flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-saffron-600 ${
                isSelected
                  ? 'border-saffron-600 bg-saffron-700 text-white shadow-sm'
                  : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
              }`}
            >
              <span
                className={`font-mono text-[11px] tabular-nums font-bold ${
                  isSelected ? 'text-white' : 'text-saffron-700 dark:text-saffron-400'
                }`}
              >
                {step.num}
              </span>
              <span className="truncate leading-snug">
                <span lang="hi" data-bi="hi" className="font-devanagari">{step.hi}</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">{step.en}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Panel Body */}
      <div
        id={`wisdom-step-panel-${activeStep}`}
        role="tabpanel"
        aria-labelledby={`wisdom-step-tab-${activeStep}`}
        tabIndex={0}
        className="p-5 sm:p-8 space-y-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-saffron-600"
      >
        {/* ── STEP 01: ACKNOWLEDGE ── */}
        {activeStep === 0 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
              <Heart className="h-4 w-4" aria-hidden="true" />
              <span>
                01 <span lang="hi" data-bi="hi">संवेदना — अपनी वर्तमान स्थिति को स्वीकारें</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">Acknowledge Where You Stand</span>
              </span>
            </div>

            <div className="rounded-2xl border-l-4 border-saffron-600 bg-dharma-bg p-5 space-y-2.5">
              <p lang="hi" className="font-devanagari text-base sm:text-lg font-semibold text-dharma-text leading-loose">
                &ldquo;{topic.compassionateIntro.leadHi}&rdquo;
              </p>
              <p className="font-serif italic text-sm sm:text-base text-dharma-muted leading-relaxed">
                &ldquo;{topic.compassionateIntro.leadEn}&rdquo;
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-dharma-border bg-dharma-bg/50 p-4 space-y-2">
                <p lang="hi" className="text-xs font-bold text-dharma-muted font-devanagari">
                  मानवीय अनुभव (हिंदी)
                </p>
                <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-loose">
                  {topic.compassionateIntro.bodyHi}
                </p>
              </div>
              <div className="rounded-2xl border border-dharma-border bg-dharma-bg/50 p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-dharma-muted">
                  Human Context (English)
                </p>
                <p className="text-sm text-dharma-text leading-relaxed">
                  {topic.compassionateIntro.bodyEn}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>
                  <span lang="hi" data-bi="hi">शाश्वत आध्यात्मिक आधार</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Core Spiritual Ground</span>
                </span>
              </div>
              <p lang="hi" className="font-devanagari text-sm sm:text-base font-medium text-dharma-text leading-loose">
                {topic.compassionateIntro.spiritualFoundationHi}
              </p>
              <p className="text-sm text-dharma-muted leading-relaxed">
                {topic.compassionateIntro.spiritualFoundationEn}
              </p>
              <div className="flex flex-wrap gap-2 pt-2 border-t border-dharma-border">
                {topic.traditionalContextOverview.keyThemes.map((theme, i) => {
                  const themeHi = topic.traditionalContextOverview.keyThemesHi?.[i];
                  return (
                    <span
                      key={theme}
                      className="rounded-full border border-dharma-border bg-dharma-bg px-3 py-1 text-xs font-medium text-dharma-text"
                    >
                      {themeHi ? (
                        <>
                          <span lang="hi" data-bi="hi" className="font-devanagari">{themeHi}</span>
                          <span data-bi="sep"> · </span>
                          <span data-bi="en">{theme}</span>
                        </>
                      ) : (
                        theme
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 02: SCRIPTURAL SHIFT ── */}
        {activeStep === 1 && selectedVerse && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                <BookOpen className="h-4 w-4" aria-hidden="true" />
                <span>
                  02 <span lang="hi" data-bi="hi">शास्त्र-दृष्टि — प्रमाणित श्लोक चयन</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Scriptural Shift</span>
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums text-dharma-muted">
                {verseIdx + 1} / {topic.verses.length}
              </span>
            </div>

            {topic.verses.length > 1 && (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Select cited verse">
                {topic.verses.map((v, idx) => {
                  const active = idx === verseIdx;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setVerseIdx(idx)}
                      className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                        active
                          ? 'border-saffron-600 bg-saffron-700 text-white shadow-sm'
                          : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400'
                      }`}
                    >
                      <span className="font-mono tabular-nums mr-1.5">{idx + 1}.</span>
                      <span data-bi="en">{v.referenceDisplay}</span>
                      <span data-bi="sep"> · </span>
                      <span lang="hi" data-bi="hi" className="font-devanagari">{v.referenceDisplayHi}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="rounded-2xl border border-dharma-border bg-dharma-bg p-5 sm:p-6 text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                <span>{selectedVerse.referenceDisplay}</span>
                <span> · </span>
                <span lang="hi" className="font-devanagari">{selectedVerse.referenceDisplayHi}</span>
              </p>
              <p
                lang="sa"
                className="font-devanagari text-lg sm:text-2xl font-bold text-dharma-text leading-loose whitespace-pre-line"
              >
                {selectedVerse.sanskritDevanagari}
              </p>
              {selectedVerse.sanskritTransliteration && (
                <p className="text-xs sm:text-sm italic text-dharma-muted whitespace-pre-line">
                  {selectedVerse.sanskritTransliteration}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-dharma-border bg-dharma-bg/50 p-4 space-y-1.5">
                <p lang="hi" className="text-xs font-bold text-saffron-700 dark:text-saffron-300 font-devanagari">
                  हिंदी भावार्थ
                </p>
                <p lang="hi" className="font-devanagari text-sm sm:text-base text-dharma-text leading-loose">
                  {selectedVerse.literalTranslationHi}
                </p>
              </div>
              <div className="rounded-2xl border border-dharma-border bg-dharma-bg/50 p-4 space-y-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                  English Rendering
                </p>
                <p className="text-sm sm:text-base text-dharma-text leading-relaxed">
                  {selectedVerse.literalTranslationEn}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                  <span lang="hi" data-bi="hi">व्यावहारिक दृष्टि (संपादकीय अध्ययन नोट · शास्त्र नहीं)</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Practical Takeaway (Editorial Application · Not Scripture)</span>
                </p>
                <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
                  {selectedVerse.traditionalContext.commentaryNoteHi ||
                    selectedVerse.traditionalContext.settingHi ||
                    topic.reflections[0]?.insightHi}
                </p>
                <p className="text-xs sm:text-sm text-dharma-muted leading-relaxed">
                  {selectedVerse.traditionalContext.commentaryNote ||
                    selectedVerse.traditionalContext.setting ||
                    topic.reflections[0]?.insight}
                </p>
              </div>

              <Link
                href={wisdomVerseHref(selectedVerse)}
                className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl bg-saffron-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-saffron-800 transition shadow-sm"
              >
                <span>
                  <span lang="hi" data-bi="hi">ग्रंथालय में पढ़ें</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Read in Reader</span>
                </span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        )}

        {/* ── STEP 03: CALM BREATH PACER ── */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                <Wind className="h-4 w-4" aria-hidden="true" />
                <span>
                  03 <span lang="hi" data-bi="hi">श्वास-संतुलन — निर्देशित प्राणायाम लय</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Calm Breath Pacer</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Breathing rhythm mode">
                <button
                  type="button"
                  aria-pressed={breathMode === '4-4-6'}
                  onClick={() => handleSelectBreathMode('4-4-6')}
                  className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-semibold transition tabular-nums ${
                    breathMode === '4-4-6'
                      ? 'border-saffron-600 bg-saffron-700 text-white'
                      : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400'
                  }`}
                >
                  4-4-6 <span lang="hi" data-bi="hi">संतुलित</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Balanced</span>
                </button>
                <button
                  type="button"
                  aria-pressed={breathMode === '4-0-6'}
                  onClick={() => handleSelectBreathMode('4-0-6')}
                  className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-semibold transition tabular-nums ${
                    breathMode === '4-0-6'
                      ? 'border-saffron-600 bg-saffron-700 text-white'
                      : 'border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400'
                  }`}
                >
                  4-0-6 <span lang="hi" data-bi="hi">सौम्य (बिना कुम्भक)</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Gentle</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-center rounded-2xl border border-dharma-border bg-dharma-bg/60 p-5 sm:p-6">
              {/* Live SVG Lotus Breath Circle (static indicator under prefers-reduced-motion) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center w-48 h-48">
                  <svg
                    width={192}
                    height={192}
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <defs>
                      <radialGradient id={lotusGlowId} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#fb923c" stopOpacity="0.38" />
                        <stop offset="65%" stopColor="#ea580c" stopOpacity="0.14" />
                        <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                      </radialGradient>
                      <linearGradient id={lotusRingId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#c2410c" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="88" stroke="currentColor" className="text-dharma-border" strokeWidth="1.5" strokeDasharray="4 4" />
                    <g
                      style={
                        reducedMotion
                          ? { transform: 'none', transition: 'none' }
                          : {
                              transform: `scale(${lotusScale})`,
                              transformOrigin: '100px 100px',
                              transition: lotusTransitionMs > 0 ? `transform ${lotusTransitionMs}ms ease-in-out` : 'none',
                            }
                      }
                    >
                      <circle cx="100" cy="100" r="72" fill={`url(#${lotusGlowId})`} />
                      <circle cx="100" cy="100" r="56" stroke={`url(#${lotusRingId})`} strokeWidth="3" />
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                        <ellipse
                          key={deg}
                          cx="100"
                          cy="62"
                          rx="10"
                          ry="22"
                          transform={`rotate(${deg} 100 100)`}
                          fill="#ea580c"
                          fillOpacity="0.16"
                          stroke="#ea580c"
                          strokeOpacity="0.45"
                          strokeWidth="1.2"
                        />
                      ))}
                    </g>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
                    <span className="text-2xl font-mono font-bold tabular-nums text-dharma-text">
                      {secondsLeft}s
                    </span>
                    <span className="text-xs font-bold text-saffron-700 dark:text-saffron-300 mt-0.5">
                      <span lang="hi" data-bi="hi" className="font-devanagari">{currentPhase.labelHi}</span>
                      <span data-bi="sep" aria-hidden="true"> · </span>
                      <span data-bi="en">{currentPhase.labelEn}</span>
                    </span>
                  </div>
                </div>
                {reducedMotion && (
                  <p className="mt-1 text-[11px] text-dharma-muted text-center">
                    <span lang="hi" data-bi="hi">स्थिर चरण संकेतक सक्रिय (कम गति वरीयता)</span>
                    <span data-bi="sep"> · </span>
                    <span data-bi="en">Static phase indicator active (Reduced Motion)</span>
                  </p>
                )}
              </div>

              {/* Phase Breakdown, Controls & Cycle Counter */}
              <div className="md:col-span-7 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {phases.map((p, idx) => {
                    const isActive = idx === phaseIdx && breathRunning;
                    return (
                      <div
                        key={p.key}
                        className={`rounded-xl border p-3 text-xs transition ${
                          isActive
                            ? 'border-saffron-600 bg-saffron-500/10 text-dharma-text font-bold'
                            : 'border-dharma-border bg-dharma-card text-dharma-muted'
                        }`}
                      >
                        <div className="font-mono tabular-nums font-bold text-dharma-text">{p.seconds}s</div>
                        <div>
                          <span lang="hi" data-bi="hi" className="font-devanagari">{p.labelHi}</span>
                          <span data-bi="sep" aria-hidden="true"> · </span>
                          <span data-bi="en">{p.labelEn}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-xl border border-dharma-border bg-dharma-card p-4 space-y-1" aria-live="polite">
                  <p lang="hi" className="font-devanagari text-sm font-medium text-dharma-text">
                    {currentPhase.cueHi}
                  </p>
                  <p className="text-xs text-dharma-muted">{currentPhase.cueEn}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setBreathRunning((r) => !r)}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-saffron-700 px-4 py-2.5 text-xs font-bold text-white hover:bg-saffron-800 transition shadow-sm"
                    >
                      {breathRunning ? (
                        <>
                          <Pause className="h-4 w-4" aria-hidden="true" />
                          <span>
                            <span lang="hi" data-bi="hi">विराम</span>
                            <span data-bi="sep"> · </span>
                            <span data-bi="en">Pause</span>
                          </span>
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" aria-hidden="true" />
                          <span>
                            <span lang="hi" data-bi="hi">प्रारंभ करें</span>
                            <span data-bi="sep"> · </span>
                            <span data-bi="en">Start</span>
                          </span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleResetBreath}
                      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-card px-3.5 py-2.5 text-xs font-semibold text-dharma-text hover:border-saffron-400 transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        <span lang="hi" data-bi="hi">रीसेट</span>
                        <span data-bi="sep"> · </span>
                        <span data-bi="en">Reset</span>
                      </span>
                    </button>
                  </div>

                  <div className="rounded-xl border border-dharma-border bg-dharma-card px-3.5 py-2 text-xs font-semibold text-dharma-text tabular-nums">
                    <span lang="hi" data-bi="hi">पूर्ण चक्र:</span>
                    <span data-bi="sep"> </span>
                    <span data-bi="en">Cycles:</span>{' '}
                    <strong className="font-mono tabular-nums text-saffron-700 dark:text-saffron-300">{cycles}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 04: ACTION CHECKLIST ── */}
        {activeStep === 3 && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                  04 <span lang="hi" data-bi="hi">सूक्ष्म अभ्यास — आज के जीवन में प्रयोग</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Action Checklist</span>
                </p>
                <p className="text-xs text-dharma-muted">
                  <span lang="hi" data-bi="hi" className="font-devanagari">संपादकीय अभ्यास · मूल शास्त्र नहीं · आपकी प्रगति इसी उपकरण पर सुरक्षित रहती है।</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Editorial Application · Not Scripture · Progress is saved locally on this device.</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true" className="shrink-0">
                  <defs>
                    <linearGradient id={progressGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#16a34a" />
                    </linearGradient>
                  </defs>
                  <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" className="text-dharma-border" strokeWidth="4" />
                  <circle
                    cx="22"
                    cy="22"
                    r="18"
                    fill="none"
                    stroke={`url(#${progressGradId})`}
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringDashOffset}
                    transform="rotate(-90 22 22)"
                  />
                </svg>
                <div className="text-xs font-mono tabular-nums font-bold text-dharma-text">
                  <div>
                    {checkedCount} / {actionSteps.length}
                  </div>
                  <div className="text-[11px] font-sans font-normal text-dharma-muted">{progressPct}%</div>
                </div>
                {checkedCount > 0 && (
                  <button
                    type="button"
                    onClick={resetChecklist}
                    className="min-h-[44px] rounded-xl border border-dharma-border bg-dharma-bg px-3 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition"
                  >
                    <span lang="hi" data-bi="hi">साफ़ करें</span>
                    <span data-bi="sep"> · </span>
                    <span data-bi="en">Reset</span>
                  </button>
                )}
              </div>
            </div>

            <div
              role="progressbar"
              aria-label="Action checklist progress"
              aria-valuenow={checkedCount}
              aria-valuemin={0}
              aria-valuemax={actionSteps.length}
              className="h-2 w-full rounded-full bg-dharma-bg overflow-hidden border border-dharma-border"
            >
              <div
                className="h-full bg-emerald-700 motion-safe:transition-[width] motion-safe:duration-300 motion-reduce:transition-none"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="space-y-3">
              {actionSteps.map((step, i) => {
                const isChecked = checkedIds.includes(step.id);
                return (
                  <button
                    key={step.id}
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => toggleActionStep(step.id)}
                    className={`w-full min-h-[44px] rounded-2xl border p-4 text-left transition flex items-start gap-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-saffron-600 ${
                      isChecked
                        ? 'border-emerald-600/50 bg-emerald-500/5 text-dharma-text'
                        : 'border-dharma-border bg-dharma-bg/50 text-dharma-text hover:border-saffron-400'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-xs font-bold transition ${
                        isChecked
                          ? 'border-emerald-700 bg-emerald-700 text-white'
                          : 'border-dharma-border bg-dharma-card text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="space-y-1 min-w-0">
                      <span className="block text-sm font-bold text-dharma-text">
                        <span className="font-mono tabular-nums text-xs text-saffron-700 dark:text-saffron-400 mr-1.5">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <span lang="hi" data-bi="hi" className="font-devanagari">{step.titleHi}</span>
                        <span data-bi="sep"> · </span>
                        <span data-bi="en">{step.titleEn}</span>
                      </span>
                      <span lang="hi" className="block font-devanagari text-xs sm:text-sm text-dharma-text leading-relaxed">
                        {step.bodyHi}
                      </span>
                      <span className="block text-xs text-dharma-muted leading-relaxed">
                        {step.bodyEn}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 05: SELF-INQUIRY ── */}
        {activeStep === 4 && selectedQuestion && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                  05 <span lang="hi" data-bi="hi">आत्म-चिंतन — शांत प्रश्न एवं निजी मनन</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Self-Inquiry &amp; Private Reflection</span>
                </p>
                <p className="mt-0.5 text-[11px] text-dharma-muted">
                  <span lang="hi" data-bi="hi" className="font-devanagari">संपादकीय अभ्यास · मूल शास्त्र नहीं</span>
                  <span data-bi="sep" aria-hidden="true"> · </span>
                  <span data-bi="en">Editorial Application · Not Scripture</span>
                </p>
              </div>

              <div className="flex items-center gap-1.5" role="group" aria-label="Self-inquiry question stepper">
                <button
                  type="button"
                  disabled={questionIdx === 0}
                  onClick={() => setQuestionIdx((q) => Math.max(0, q - 1))}
                  aria-label="Previous reflection question"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-bg text-dharma-text disabled:opacity-40 hover:border-saffron-400 transition"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <span className="px-2.5 text-xs font-mono tabular-nums text-dharma-muted">
                  {questionIdx + 1} / {inquiryQuestions.length}
                </span>
                <button
                  type="button"
                  disabled={questionIdx >= inquiryQuestions.length - 1}
                  onClick={() => setQuestionIdx((q) => Math.min(inquiryQuestions.length - 1, q + 1))}
                  aria-label="Next reflection question"
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-dharma-border bg-dharma-bg text-dharma-text disabled:opacity-40 hover:border-saffron-400 transition"
                >
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-dharma-border bg-dharma-bg p-5 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                <span lang="hi" data-bi="hi" className="font-devanagari">{selectedQuestion.badgeHi}</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">{selectedQuestion.badgeEn}</span>
              </p>
              <p lang="hi" className="font-devanagari text-base sm:text-lg font-semibold text-dharma-text leading-loose">
                {selectedQuestion.questionHi}
              </p>
              <p className="font-serif italic text-sm sm:text-base text-dharma-muted leading-relaxed">
                {selectedQuestion.questionEn}
              </p>
              {(selectedQuestion.contextHi || selectedQuestion.contextEn) && (
                <div className="pt-3 border-t border-dharma-border text-xs text-dharma-muted space-y-1">
                  {selectedQuestion.contextHi && (
                    <p lang="hi" className="font-devanagari leading-relaxed">{selectedQuestion.contextHi}</p>
                  )}
                  {selectedQuestion.contextEn && <p className="leading-relaxed">{selectedQuestion.contextEn}</p>}
                </div>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label htmlFor={`wisdom-note-${topic.slug}`} className="text-xs font-bold text-dharma-text">
                  <span lang="hi" data-bi="hi">निजी आत्म-चिंतन नोट (वैकल्पिक)</span>
                  <span data-bi="sep"> · </span>
                  <span data-bi="en">Private Reflection Note (Optional)</span>
                </label>
                {noteSavedAt && (
                  <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                    <span lang="hi" data-bi="hi">इसी उपकरण पर सुरक्षित</span>
                    <span data-bi="sep"> · </span>
                    <span data-bi="en">Saved on this device</span>
                  </span>
                )}
              </div>

              <textarea
                id={`wisdom-note-${topic.slug}`}
                rows={4}
                value={privateNote}
                onChange={(e) => handleNoteChange(e.target.value)}
                placeholder="यहाँ अपना शांत विचार या आज का एक छोटा संकल्प लिखें... / Write a quiet reflection or one small intention for today..."
                className="w-full rounded-2xl border border-dharma-border bg-dharma-bg p-4 text-sm text-dharma-text placeholder:text-dharma-muted focus:border-saffron-600 focus:outline-none focus:ring-2 focus:ring-saffron-500/20"
              />

              <div className="flex items-start gap-2 rounded-xl border border-dharma-border bg-dharma-bg/60 p-3 text-xs text-dharma-muted">
                <Lock className="h-4 w-4 shrink-0 text-saffron-700 dark:text-saffron-300 mt-0.5" aria-hidden="true" />
                <p className="leading-relaxed">
                  <span lang="hi" data-bi="hi" className="font-devanagari">
                    गोपनीयता: आपका यह लेखन केवल आपके इसी ब्राउज़र (localStorage) में सुरक्षित रहता है और किसी सर्वर या खाते पर कभी नहीं भेजा जाता।
                  </span>
                  <span data-bi="sep"> </span>
                  <span data-bi="en">
                    On-device privacy: Your reflection stays strictly in this browser&apos;s localStorage and is never sent to any server or account.
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step Footer Prev / Next Stepper */}
        <div className="pt-4 border-t border-dharma-border flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-bg px-4 py-2 text-xs font-semibold text-dharma-text disabled:opacity-40 hover:border-saffron-400 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              <span lang="hi" data-bi="hi">पिछला चरण</span>
              <span data-bi="sep"> · </span>
              <span data-bi="en">Previous</span>
            </span>
          </button>

          {activeStep < STUDIO_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep((s) => Math.min(STUDIO_STEPS.length - 1, s + 1))}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-saffron-700 px-4 py-2 text-xs font-bold text-white hover:bg-saffron-800 transition shadow-sm"
            >
              <span>
                <span lang="hi" data-bi="hi">अगला: {STUDIO_STEPS[activeStep + 1].hi}</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">Next: {STUDIO_STEPS[activeStep + 1].en}</span>
              </span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                <span lang="hi" data-bi="hi">स्वाध्याय पूर्ण</span>
                <span data-bi="sep"> · </span>
                <span data-bi="en">Complete Inquiry</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
