'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Compass,
  Heart,
  HelpCircle,
  Sun,
  Flame,
  Shield,
  Clock,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  PenTool,
  Bookmark,
  Share2,
  Pause,
  Play,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type {
  CanonicalVerseRef,
  QuestionWisdomRecord,
  EmotionWisdomRecord,
  AttentionalMode,
  EthicalWisdomAnalytics,
  WisdomRecommendation,
  StoredReflection,
} from '@/lib/wos/types';
import { CANONICAL_QUESTIONS, searchQuestions } from '@/lib/wos/question-wisdom';
import { CORE_EMOTIONS, searchEmotions } from '@/lib/wos/emotion-wisdom';
import { WISDOM_JOURNEYS } from '@/lib/wos/wisdom-journeys';
import { getDailyWisdom } from '@/lib/wos/daily-wisdom';
import {
  ATTENTIONAL_MODE_CONFIGS,
  readAttentionalMode,
  setAttentionalMode,
  WOS_ATTENTIONAL_MODE_EVENT,
} from '@/lib/wos/wellbeing-modes';
import {
  computeEthicalAnalytics,
  recordExploredQuestion,
  recordExploredEmotion,
} from '@/lib/wos/wisdom-analytics';
import { generateWisdomRecommendations } from '@/lib/wos/contextual-engine';
import {
  CANONICAL_REFLECTION_PROMPTS,
  saveReflection,
  readReflections,
  WOS_REFLECTION_EVENT,
} from '@/lib/wos/reflection-engine';

type WOSSurface = 'questions' | 'emotions' | 'daily' | 'journeys' | 'modes' | 'analytics';

export function WisdomOperatingSystem() {
  const [activeSurface, setActiveSurface] = useState<WOSSurface>('questions');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionWisdomRecord | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionWisdomRecord | null>(null);
  const [activeMode, setActiveModeState] = useState<AttentionalMode>('standard');
  const [analytics, setAnalytics] = useState<EthicalWisdomAnalytics | null>(null);
  
  // Pause timer state
  const [pauseSecondsLeft, setPauseSecondsLeft] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Guided Reflection Drawer state
  const [reflectionTargetVerse, setReflectionTargetVerse] = useState<CanonicalVerseRef | null>(null);
  const [reflectionPromptIdx, setReflectionPromptIdx] = useState<number>(0);
  const [reflectionText, setReflectionText] = useState<string>('');
  const [reflectionSavedAlert, setReflectionSavedAlert] = useState<boolean>(false);

  // Daily wisdom
  const daily = useMemo(() => getDailyWisdom(), []);

  // Hydration & Listeners
  useEffect(() => {
    setActiveModeState(readAttentionalMode());
    setAnalytics(computeEthicalAnalytics());

    const handleModeChange = (e: Event) => {
      const custom = e as CustomEvent<AttentionalMode>;
      if (custom.detail) setActiveModeState(custom.detail);
    };

    const handleReflectionSaved = () => {
      setAnalytics(computeEthicalAnalytics());
    };

    window.addEventListener(WOS_ATTENTIONAL_MODE_EVENT, handleModeChange);
    window.addEventListener(WOS_REFLECTION_EVENT, handleReflectionSaved);

    return () => {
      window.removeEventListener(WOS_ATTENTIONAL_MODE_EVENT, handleModeChange);
      window.removeEventListener(WOS_REFLECTION_EVENT, handleReflectionSaved);
    };
  }, []);

  // Pause Timer countdown
  useEffect(() => {
    if (!isTimerRunning || pauseSecondsLeft <= 0) return;
    const interval = setInterval(() => {
      setPauseSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, pauseSecondsLeft]);

  // Handle Mode Change
  const handleSelectMode = (mode: AttentionalMode) => {
    setActiveModeState(mode);
    setAttentionalMode(mode);
  };

  // Questions Filter
  const filteredQuestions = useMemo(() => {
    return searchQuestions(searchQuery);
  }, [searchQuery]);

  // Emotions Filter
  const filteredEmotions = useMemo(() => {
    return searchEmotions(searchQuery);
  }, [searchQuery]);

  // Recommendations
  const recommendations: WisdomRecommendation[] = useMemo(() => {
    const qIds = selectedQuestion ? [selectedQuestion.id] : [];
    const eIds = selectedEmotion ? [selectedEmotion.id] : [];
    return generateWisdomRecommendations({
      recentVerseIds: [],
      bookmarkedVerseIds: [],
      exploredQuestionIds: qIds,
      exploredEmotionIds: eIds,
      viewedTopicSlugs: [],
    });
  }, [selectedQuestion, selectedEmotion]);

  const handleOpenQuestion = (q: QuestionWisdomRecord) => {
    setSelectedQuestion(q);
    recordExploredQuestion(q.id);
  };

  const handleOpenEmotion = (e: EmotionWisdomRecord) => {
    setSelectedEmotion(e);
    setPauseSecondsLeft(e.pauseExercise.durationSeconds);
    setIsTimerRunning(false);
    recordExploredEmotion(e.id);
  };

  const handleSaveCurrentReflection = () => {
    if (!reflectionTargetVerse || !reflectionText.trim()) return;
    const prompt = CANONICAL_REFLECTION_PROMPTS[reflectionPromptIdx]!;
    saveReflection({
      verseReference: {
        scriptureId: reflectionTargetVerse.scriptureId,
        chapterNumber: reflectionTargetVerse.chapterNumber,
        verseNumber: reflectionTargetVerse.verseNumber,
        citation: reflectionTargetVerse.citation,
        sanskritSnippet: reflectionTargetVerse.sanskritDevanagari.slice(0, 100),
      },
      promptType: prompt.type,
      promptQuestion: prompt.questionEn,
      response: reflectionText.trim(),
    });
    setReflectionSavedAlert(true);
    setTimeout(() => {
      setReflectionSavedAlert(false);
      setReflectionTargetVerse(null);
      setReflectionText('');
    }, 1500);
  };

  return (
    <div className="w-full text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* ── Top WOS Navigation Pills ────────────────────────────────────────── */}
      <nav aria-label="Wisdom Operating System surfaces" className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 py-4 px-2 border-b border-stone-200 dark:border-stone-800 scrollbar-none">
        <button
          onClick={() => { setActiveSurface('questions'); setSelectedQuestion(null); setSelectedEmotion(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            activeSurface === 'questions'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-300" />
          <span>Ask a Question</span>
          <span lang="hi" className="text-[11px] opacity-80">(प्रश्न)</span>
        </button>

        <button
          onClick={() => { setActiveSurface('emotions'); setSelectedQuestion(null); setSelectedEmotion(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            activeSurface === 'emotions'
              ? 'bg-rose-700 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-300" />
          <span>Explore by Emotion</span>
          <span lang="hi" className="text-[11px] opacity-80">(भाव)</span>
        </button>

        <button
          onClick={() => { setActiveSurface('daily'); setSelectedQuestion(null); setSelectedEmotion(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            activeSurface === 'daily'
              ? 'bg-saffron-700 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-300" />
          <span>Daily Wisdom</span>
          <span lang="hi" className="text-[11px] opacity-80">(आज का विचार)</span>
        </button>

        <button
          onClick={() => { setActiveSurface('journeys'); setSelectedQuestion(null); setSelectedEmotion(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            activeSurface === 'journeys'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-300" />
          <span>Wisdom Journeys</span>
          <span lang="hi" className="text-[11px] opacity-80">(साधना पथ)</span>
        </button>

        <button
          onClick={() => { setActiveSurface('modes'); setSelectedQuestion(null); setSelectedEmotion(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            activeSurface === 'modes'
              ? 'bg-indigo-700 text-white shadow-sm'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Layers className="w-4 h-4 text-indigo-300" />
          <span>Wellbeing Modes</span>
          <span lang="hi" className="text-[11px] opacity-80">(उपराम)</span>
        </button>

        <button
          onClick={() => { setActiveSurface('analytics'); setSelectedQuestion(null); setSelectedEmotion(null); }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            activeSurface === 'analytics'
              ? 'bg-stone-800 text-white shadow-sm dark:bg-stone-200 dark:text-stone-900'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Self-Study Ledger</span>
          <span lang="hi" className="text-[11px] opacity-80">(स्वाध्याय)</span>
        </button>
      </nav>

      {/* ── Surface 1: QUESTION-FIRST EXPLORATION ──────────────────────────── */}
      {activeSurface === 'questions' && (
        <section className="max-w-5xl mx-auto py-8 px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
              Begin with an Existential Inquiry
            </h2>
            <p lang="hi" className="text-base text-amber-700 dark:text-amber-400 font-devanagari font-medium mb-2">
              जीवन के मूलभूत प्रश्नों से शास्त्र का अन्वेषण करें
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              No chapter numbers needed. Choose the question your heart is asking right now.
            </p>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.id}
                role="button" tabIndex={0} aria-pressed={selectedQuestion?.id === q.id} onClick={() => handleOpenQuestion(q)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpenQuestion(q); } }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedQuestion?.id === q.id
                    ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 shadow-md ring-1 ring-amber-500'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-amber-300 dark:hover:border-amber-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {q.sanskritInquiry}
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">
                  {q.questionEn}
                </h3>
                <p lang="hi" className="text-sm font-devanagari text-stone-700 dark:text-stone-300 mb-3">
                  {q.questionHi}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                  {q.philosophicalPivotEn}
                </p>
              </div>
            ))}
          </div>

          {/* Active Question Detail Card */}
          {selectedQuestion && (
            <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-amber-50/40 dark:bg-stone-900 border border-amber-200 dark:border-amber-900/60 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
                    {selectedQuestion.sanskritInquiry}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
                    {selectedQuestion.questionEn}
                  </h3>
                  <p lang="hi" className="text-lg font-devanagari text-amber-800 dark:text-amber-300">
                    {selectedQuestion.questionHi}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Philosophical Pivot */}
              <div className="mb-6 p-4 rounded-xl bg-white dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  The Root Philosophical Shift
                </h4>
                <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                  {selectedQuestion.philosophicalPivotEn}
                </p>
                <p lang="hi" className="text-sm text-stone-700 dark:text-stone-300 font-devanagari mt-2">
                  {selectedQuestion.philosophicalPivotHi}
                </p>
              </div>

              {/* Primary Canonical Verses */}
              <div className="mb-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Canonical Verses (मूल श्लोक)
                </h4>
                {selectedQuestion.primaryVerses.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                        {v.citation} ({v.citationHi})
                      </span>
                      <Link
                        href={v.readerHref}
                        className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        Read in Reader <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <p lang="sa" className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 whitespace-pre-line leading-relaxed mb-3">
                      {v.sanskritDevanagari}
                    </p>

                    <p lang="hi" className="text-sm font-devanagari text-stone-700 dark:text-stone-300 mb-2">
                      {v.translationHi}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                      &ldquo;{v.translationEn}&rdquo;
                    </p>

                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                      <button
                        onClick={() => setReflectionTargetVerse(v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-medium hover:bg-amber-200"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Reflect Privately on this Shloka</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contemplative Micro-Action */}
              <div className="p-4 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-300/60 dark:border-amber-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-600" />
                  Today&apos;s Contemplative Micro-Action (आज का आचरण)
                </h4>
                <p className="text-sm text-stone-800 dark:text-stone-200">
                  {selectedQuestion.contemplativeActionEn}
                </p>
                <p lang="hi" className="text-sm font-devanagari text-stone-700 dark:text-stone-300 mt-1">
                  {selectedQuestion.contemplativeActionHi}
                </p>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Surface 2: EMOTION-FIRST EXPLORATION ───────────────────────────── */}
      {activeSurface === 'emotions' && (
        <section className="max-w-5xl mx-auto py-8 px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
              Where Is Your Heart Right Now?
            </h2>
            <p lang="hi" className="text-base text-rose-700 dark:text-rose-400 font-devanagari font-medium mb-2">
              अपनी वर्तमान मनःस्थिति से शांति का मार्ग खोजें
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Scripture is not an academic lecture; it is a healing dialogue for the troubled mind.
            </p>
          </div>

          {/* Emotion Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
            {filteredEmotions.map((emo) => (
              <button
                key={emo.id}
                onClick={() => handleOpenEmotion(emo)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedEmotion?.id === emo.id
                    ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 shadow-md ring-1 ring-rose-500'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-rose-300'
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400 block mb-1">
                  {emo.sanskritTerm.split(' ')[0]}
                </span>
                <span className="text-sm font-serif font-bold block text-stone-900 dark:text-stone-100 mb-1">
                  {emo.emotionEn}
                </span>
                <span lang="hi" className="text-xs font-devanagari text-stone-600 dark:text-stone-400 block">
                  {emo.emotionHi}
                </span>
              </button>
            ))}
          </div>

          {/* Selected Emotion Portal */}
          {selectedEmotion && (
            <div className="p-6 sm:p-8 rounded-3xl bg-rose-50/30 dark:bg-stone-900 border border-rose-200 dark:border-rose-900/60 shadow-lg">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-700 dark:text-rose-400">
                    {selectedEmotion.sanskritTerm}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1">
                    {selectedEmotion.emotionEn}
                  </h3>
                  <p lang="hi" className="text-base font-devanagari text-rose-800 dark:text-rose-300">
                    {selectedEmotion.emotionHi}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedEmotion(null)}
                  className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800"
                >
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Contemplative Breath Anchor Timer */}
              <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-center">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                  {selectedEmotion.pauseExercise.titleEn} ({selectedEmotion.pauseExercise.titleHi})
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300 max-w-lg mx-auto mb-4">
                  {selectedEmotion.pauseExercise.instructionsEn}
                </p>

                <div className="flex items-center justify-center gap-4">
                  <div className="text-3xl font-mono font-bold text-rose-600 dark:text-rose-400">
                    {Math.floor(pauseSecondsLeft / 60)}:{(pauseSecondsLeft % 60).toString().padStart(2, '0')}
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors"
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isTimerRunning ? 'Pause' : 'Start 90s Breath'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setPauseSecondsLeft(selectedEmotion.pauseExercise.durationSeconds);
                    }}
                    className="p-2 rounded-full text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Root Insight */}
              <div className="mb-6 p-4 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Root Philosophical Insight (दार्शनिक समाधान)
                </h4>
                <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-serif">
                  {selectedEmotion.rootInsightEn}
                </p>
                <p lang="hi" className="text-sm text-stone-700 dark:text-stone-300 font-devanagari mt-2">
                  {selectedEmotion.rootInsightHi}
                </p>
              </div>

              {/* Verses for this emotion */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                  Primary Healing Verses
                </h4>
                {selectedEmotion.primaryVerses.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                        {v.citation}
                      </span>
                      <Link
                        href={v.readerHref}
                        className="text-xs font-medium text-rose-600 hover:underline flex items-center gap-1"
                      >
                        Read Chapter <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <p lang="sa" className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 whitespace-pre-line mb-2">
                      {v.sanskritDevanagari}
                    </p>
                    <p lang="hi" className="text-sm font-devanagari text-stone-700 dark:text-stone-300 mb-1">
                      {v.translationHi}
                    </p>
                    <p className="text-xs text-stone-600 dark:text-stone-400 italic">
                      &ldquo;{v.translationEn}&rdquo;
                    </p>

                    <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700 flex justify-between">
                      <button
                        onClick={() => setReflectionTargetVerse(v)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-xs font-medium hover:bg-rose-100"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Reflect Privately</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── Surface 3: DAILY WISDOM RHYTHM ─────────────────────────────────── */}
      {activeSurface === 'daily' && (
        <section className="max-w-3xl mx-auto py-8 px-4">
          <div className="p-6 sm:p-10 rounded-3xl bg-amber-50/50 dark:bg-stone-900 border border-amber-200 dark:border-amber-900/60 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" />
                Sacred Daily Rhythm · {daily.date}
              </span>
              <span className="text-xs text-stone-500 font-mono">No Notifications · Pure Presence</span>
            </div>

            {/* Verse of the Day */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-1">
                Verse of the Day (आज का श्लोक)
              </h3>
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {daily.verse.citation} ({daily.verse.citationHi})
                  </span>
                  <Link
                    href={daily.verse.readerHref}
                    className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                  >
                    Full Verse <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
                <p lang="sa" className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 whitespace-pre-line leading-relaxed mb-4">
                  {daily.verse.sanskritDevanagari}
                </p>
                <p lang="hi" className="text-base font-devanagari text-stone-800 dark:text-stone-200 mb-2">
                  {daily.verse.translationHi}
                </p>
                <p className="text-sm text-stone-600 dark:text-stone-400 italic">
                  &ldquo;{daily.verse.translationEn}&rdquo;
                </p>
              </div>
            </div>

            {/* Reflection of the Day */}
            <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                Reflection of the Day (आज का मनन)
              </h4>
              <p className="text-sm text-stone-800 dark:text-stone-200 leading-relaxed mb-2 font-serif">
                {daily.reflectionEn}
              </p>
              <p lang="hi" className="text-sm font-devanagari text-stone-700 dark:text-stone-300">
                {daily.reflectionHi}
              </p>
            </div>

            {/* Question of the Day */}
            <div className="mb-6 p-5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1">
                Question of the Day (आज का आत्म-प्रश्न)
              </h4>
              <p className="text-base font-serif font-semibold text-stone-900 dark:text-stone-100 mb-1">
                &ldquo;{daily.questionOfTheDayEn}&rdquo;
              </p>
              <p lang="hi" className="text-sm font-devanagari text-stone-700 dark:text-stone-300">
                &ldquo;{daily.questionOfTheDayHi}&rdquo;
              </p>
            </div>

            {/* Quiet Exit Note */}
            <div className="p-4 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 text-center">
              <p className="text-xs text-amber-900 dark:text-amber-200 font-medium">
                {daily.sacredNoteEn}
              </p>
              <p lang="hi" className="text-xs font-devanagari text-amber-800 dark:text-amber-300 mt-1">
                {daily.sacredNoteHi}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Surface 4: WISDOM JOURNEYS ─────────────────────────────────────── */}
      {activeSurface === 'journeys' && (
        <section className="max-w-5xl mx-auto py-8 px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
              Structured Wisdom Journeys
            </h2>
            <p lang="hi" className="text-base text-emerald-700 dark:text-emerald-400 font-devanagari font-medium mb-2">
              अनुशासित साधना और विचार रूपांतरण के पथ
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              5-Step Daily Cadence: Read → Reflect → Practice → Apply → Review. Zero streak penalties.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WISDOM_JOURNEYS.map((j) => (
              <div
                key={j.id}
                className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 transition-all shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {j.sanskritName}
                  </span>
                  <span className="text-xs text-stone-500 font-mono">
                    {j.totalDays} Days · {j.estimatedMinutesPerDay}m/day
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">
                  {j.titleEn}
                </h3>
                <p lang="hi" className="text-sm font-devanagari text-stone-700 dark:text-stone-300 mb-3">
                  {j.titleHi}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 line-clamp-2">
                  {j.objectiveEn}
                </p>

                <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex justify-between items-center">
                  <span className="text-xs text-stone-500">
                    Day 1: {j.steps[0]?.titleEn || 'Intro'}
                  </span>
                  <Link
                    href={`/learn/journeys/`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Open Journey <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Surface 5: ATTENTIONAL MODES & WELLBEING ───────────────────────── */}
      {activeSurface === 'modes' && (
        <section className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
              Attentional Modes
            </h2>
            <p lang="hi" className="text-base text-indigo-700 dark:text-indigo-400 font-devanagari font-medium mb-2">
              डिजिटल उपराम और ध्यान के अनुकूल वातावरण
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              Technology should stewardship your attention, never compete for it. Choose the mode matching your current need.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(ATTENTIONAL_MODE_CONFIGS).map((cfg) => (
              <div
                key={cfg.mode}
                role="button" tabIndex={0} aria-pressed={activeMode === cfg.mode} onClick={() => handleSelectMode(cfg.mode)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSelectMode(cfg.mode); } }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  activeMode === cfg.mode
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md ring-1 ring-indigo-600'
                    : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                    {cfg.nameHi}
                  </span>
                  {activeMode === cfg.mode && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <CheckCircle2 className="w-4 h-4" /> Active
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-1">
                  {cfg.nameEn}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {cfg.descriptionEn}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Surface 6: ETHICAL WISDOM ANALYTICS ────────────────────────────── */}
      {activeSurface === 'analytics' && (
        <section className="max-w-4xl mx-auto py-8 px-4">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
              Ethical Svadhyaya Ledger
            </h2>
            <p lang="hi" className="text-base text-amber-700 dark:text-amber-400 font-devanagari font-medium mb-2">
              स्वाध्याय और आत्म-विकास का अनाग्रही एवं सहज विवरण
            </p>
            <p className="text-sm text-stone-600 dark:text-stone-400">
              No daily streaks, no guilt, no comparison. Only your voluntary commitment to wisdom in the last 28 days.
            </p>
          </div>

          {analytics && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                  Study Hours
                </span>
                <span className="text-3xl font-serif font-bold text-amber-600 dark:text-amber-400">
                  {analytics.studyHoursTotal}h {analytics.studyMinutesTotal}m
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Consciously confirmed</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                  Reflections Written
                </span>
                <span className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {analytics.reflectionsWrittenCount}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Private journal notes</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                  Questions Explored
                </span>
                <span className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {analytics.questionsExploredCount}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Existential inquiries</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                  Emotions Addressed
                </span>
                <span className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {analytics.emotionsExploredCount}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Healing pauses taken</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                  Reading Days
                </span>
                <span className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {analytics.activeReadingDaysCount} / 28
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Non-consecutive rhythm</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-center">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                  Wisdom Sessions
                </span>
                <span className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  {analytics.wisdomSessionsCompletedCount}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Timed sacred immersions</span>
              </div>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-center">
            <p className="text-xs text-stone-600 dark:text-stone-300">
              All records are stored strictly on your local browser. No telemetry is transmitted to our servers.
            </p>
            <div className="mt-3 flex justify-center gap-3">
              <Link
                href="/practice/journal/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline"
              >
                <BookOpen className="w-3.5 h-3.5" /> Open Private Journal
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Guided Reflection Modal Drawer ─────────────────────────────────── */}
      {reflectionTargetVerse && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full sm:max-w-2xl bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-stone-200 dark:border-stone-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Guided Reflection (निदिध्यासन)
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                  {reflectionTargetVerse.citation}
                </h3>
              </div>
              <button
                onClick={() => setReflectionTargetVerse(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Prompt Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
              {CANONICAL_REFLECTION_PROMPTS.map((p, idx) => (
                <button
                  key={p.type}
                  onClick={() => setReflectionPromptIdx(idx)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    reflectionPromptIdx === idx
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                  }`}
                >
                  {p.labelEn} ({p.labelHi})
                </button>
              ))}
            </div>

            {/* Active Prompt Question */}
            <div className="mb-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-1">
                {CANONICAL_REFLECTION_PROMPTS[reflectionPromptIdx]?.questionEn}
              </p>
              <p lang="hi" className="text-xs font-devanagari text-amber-800 dark:text-amber-300">
                {CANONICAL_REFLECTION_PROMPTS[reflectionPromptIdx]?.questionHi}
              </p>
            </div>

            {/* Response Textarea */}
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Write your private reflection here... (Stored only on your device)"
              rows={5}
              className="w-full p-4 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500 mb-4 resize-none"
            />

            {/* Save Action */}
            <div className="flex justify-between items-center">
              {reflectionSavedAlert ? (
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Saved securely to your local journal!
                </span>
              ) : (
                <span className="text-xs text-stone-400">100% Client-Side Private</span>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setReflectionTargetVerse(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCurrentReflection}
                  disabled={!reflectionText.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50 transition-colors"
                >
                  Save Reflection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
