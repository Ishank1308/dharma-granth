'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  Compass,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { triggerTactileFeedback } from '@/lib/haptics';
import { speakSanskritShloka } from '@/lib/sacred-audio';

export interface MoodConfig {
  id: string;
  emoji: string;
  labelEn: string;
  labelHi: string;
  subheadEn: string;
  subheadHi: string;
  readingPath: {
    title: string;
    href: string;
    description: string;
  };
  verses: Array<{
    ref: string;
    scripture: string;
    href: string;
    sanskrit: string;
    coreShiftEn: string;
    coreShiftHi: string;
  }>;
}

export const MOODS: MoodConfig[] = [
  {
    id: 'restless',
    emoji: '🌊',
    labelEn: 'Restless / Overwhelmed',
    labelHi: 'अति-विचार व अशांत मन',
    subheadEn: 'When mental currents run too fast and the nervous system needs grounding.',
    subheadHi: 'जब विचारों की आंधी चित्त को स्थिर न होने दे।',
    readingPath: {
      title: 'शांत मन और तनाव मुक्ति (Stress & Worry Guide)',
      href: '/wisdom-for-life/stress-and-worry',
      description: 'Understanding the witness consciousness behind mental racing.',
    },
    verses: [
      {
        ref: 'Gita 6.26',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/6/verse/26',
        sanskrit: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् । ततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥',
        coreShiftEn: 'From wherever the restless mind wanders, gently lead it back to awareness without frustration.',
        coreShiftHi: 'जहाँ-जहाँ चंचल मन भटके, बिना क्रोध किए उसे स्नेहपूर्वक अपनी आत्म-चेतना में वापस ले आएं।',
      },
      {
        ref: 'Gita 2.14',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/2/verse/14',
        sanskrit: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः । आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥',
        coreShiftEn: 'Pleasure and pain are shifting seasons of the senses; let them pass across your sky.',
        coreShiftHi: 'सुख और दुःख इंद्रियों के आते-जाते मौसम हैं; उन्हें सहज भाव से बह जाने दें।',
      },
      {
        ref: 'Gita 6.35',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/6/verse/35',
        sanskrit: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम् । अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥',
        coreShiftEn: 'The mind is undoubtedly restless and hard to curb, but steady patient practice and detachment anchor it.',
        coreShiftHi: 'मन निस्संदेह चंचल और कठिन है, पर अभ्यास और वैराग्य से यह वश में हो जाता है।',
      },
    ],
  },
  {
    id: 'discipline',
    emoji: '🔥',
    labelEn: 'Seeking Discipline',
    labelHi: 'संकल्प व कर्म-अनुशासन',
    subheadEn: 'When procrastination or fatigue tempts you to compromise your craft.',
    subheadHi: 'जब आलस्य या भटकाव से निकलकर कर्म में जुटना हो।',
    readingPath: {
      title: 'कर्म-कौशल व आत्म-अनुशासन (Discipline & Skill in Work)',
      href: '/wisdom-for-life/discipline',
      description: 'The art of action without the fever of anxiety.',
    },
    verses: [
      {
        ref: 'Gita 2.47',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/2/verse/47',
        sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
        coreShiftEn: 'Pour your entire vitality into the work; abandon the paralyzing addiction to the outcome.',
        coreShiftHi: 'कर्म में अपना सौ प्रतिशत दें; परिणाम की चिंता से मुक्त होकर कार्य करें।',
      },
      {
        ref: 'Gita 6.5',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/6/verse/5',
        sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् । आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः ॥',
        coreShiftEn: 'Elevate yourself through your own resolve; you are your closest ally or bitterest saboteur.',
        coreShiftHi: 'अपने संकल्प से स्वयं को उठाएं, क्योंकि आप ही अपने सच्चे मित्र हैं।',
      },
      {
        ref: 'Katha 1.2.2',
        scripture: 'कठोपनिषद्',
        href: '/scripture/katha/chapter/1/verse/2',
        sanskrit: 'श्रेयश्च प्रेयश्च मनुष्यमेतस्तौ सम्परीत्य विविनक्ति धीरः ॥',
        coreShiftEn: 'Choose what endures (Shreya) over what gives a cheap fleeting dopamine hit (Preya).',
        coreShiftHi: 'क्षणिक आकर्षण के बजाय वह चुनें जो आपको भीतर से सशक्त बनाए।',
      },
    ],
  },
  {
    id: 'choices',
    emoji: '🧭',
    labelEn: 'Torn Between Choices',
    labelHi: 'कर्तव्य, धर्म और दुविधा',
    subheadEn: 'When values clash and you stand at a difficult career or life crossroads.',
    subheadHi: 'जब दो रास्तों के बीच धर्म और निर्णय लेना कठिन हो।',
    readingPath: {
      title: 'कर्तव्य-बोध व निर्णय क्षमता (Duty & Decision Making)',
      href: '/wisdom-for-life/duty-and-decision-making',
      description: 'Finding clarity in the fog of competing responsibilities.',
    },
    verses: [
      {
        ref: 'Gita 3.35',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/3/verse/35',
        sanskrit: 'श्रेयान्स्वधर्मो विगुणः परधर्मात्स्वनुष्ठितात् । स्वधर्मे निधनं श्रेयः परधर्मो भयावहः ॥',
        coreShiftEn: 'Better your own authentic path done imperfectly than living an imitated life flawlessly.',
        coreShiftHi: 'दूसरों की नकल करने से कहीं बेहतर है अपनी प्रामाणिक प्रकृति के अनुसार जीना।',
      },
      {
        ref: 'Taittiriya 1.11.1',
        scripture: 'तैत्तिरीयोपनिषद्',
        href: '/scripture/taittiriya/chapter/1/verse/11',
        sanskrit: 'सत्यं वद । धर्मं चर । स्वाध्यायान्मा प्रमदः ॥',
        coreShiftEn: 'Speak the truth, embody ethical integrity, and never neglect your daily inner study.',
        coreShiftHi: 'सत्य का साथ दें, धर्म का आचरण करें और स्वाध्याय में प्रमाद न करें।',
      },
      {
        ref: 'Gita 18.66',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/18/verse/66',
        sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
        coreShiftEn: 'Surrender all rigid dogmas into the supreme universal presence; do not grieve.',
        coreShiftHi: 'समस्त संशयों को त्यागकर परमात्म-चेतना की शरण लें; भयमुक्त हों।',
      },
    ],
  },
  {
    id: 'loss',
    emoji: '🌧️',
    labelEn: 'Processing Loss',
    labelHi: 'शोक, बिछोह और आत्म-शांति',
    subheadEn: 'When grief visits and clinging to the past brings excruciating pain.',
    subheadHi: 'जब किसी प्रिय के बिछोह या हानि से हृदय व्यथित हो।',
    readingPath: {
      title: 'शोक का रूपांतरण व स्वीकार (Grief & Healing)',
      href: '/wisdom-for-life/grief-and-loss',
      description: 'A gentle embrace of the eternal reality that never dies.',
    },
    verses: [
      {
        ref: 'Gita 2.22',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/2/verse/22',
        sanskrit: 'वासांसि जीर्णानि यथा विहाय नवानि गृह्णाति नरोऽपराणि । तथा शरीराणि विहाय जीर्णान्यन्यानि संयाति नवानि देही ॥',
        coreShiftEn: 'Just as old garments are cast away for new ones, the soul transcends worn forms.',
        coreShiftHi: 'जैसे मनुष्य पुराने वस्त्र त्यागकर नए धारण करता है, आत्मा भी देह का परिवर्तन करती है।',
      },
      {
        ref: 'Isha 7',
        scripture: 'ईशावास्योपनिषद्',
        href: '/scripture/ishavasya/chapter/1/verse/7',
        sanskrit: 'यस्मिन्सर्वाणि भूतानि आत्मैवाभूद्विजानतः । तत्र को मोहः कः शोक एकत्वमनुपश्यतः ॥',
        coreShiftEn: 'When you see all beings as your very own Self, where is grief? Where is illusion?',
        coreShiftHi: 'जब संपूर्ण सृष्टि में एक ही आत्म-तत्व का दर्शन होता है, तब शोक कहाँ रहता है?',
      },
      {
        ref: 'Gita 2.11',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/2/verse/11',
        sanskrit: 'अशोच्यानन्वशोचस्त्वं प्रज्ञावादांश्च भाषसे । गतासूनगतासूंश्च नानुशोचन्ति पण्डिताः ॥',
        coreShiftEn: 'The wise do not grieve for that which is transient, knowing consciousness never ceases.',
        coreShiftHi: 'ज्ञानी अनित्य के लिए विलाप नहीं करते, वे सत्य के शाश्वत स्वरूप को जानते हैं।',
      },
    ],
  },
  {
    id: 'beginner',
    emoji: '🌱',
    labelEn: 'Curious Beginner',
    labelHi: 'अध्यात्म की सरल शुरुआत',
    subheadEn: 'When you want wisdom without dogmatism, superstition, or complexity.',
    subheadHi: 'बिना किसी आडंबर के वेदों व गीता के मूल सत्य की खोज।',
    readingPath: {
      title: 'आत्म-अन्वेषण की पहली सीढ़ी (Self-Knowledge Foundations)',
      href: '/wisdom-for-life/self-knowledge',
      description: 'The foundational insights of Hindu philosophy explained simply.',
    },
    verses: [
      {
        ref: 'Isha 1',
        scripture: 'ईशावास्योपनिषद्',
        href: '/scripture/ishavasya/chapter/1/verse/1',
        sanskrit: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् । तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ॥',
        coreShiftEn: 'Everything is sacred; enjoy life with boundless joy by surrendering the fever to own it.',
        coreShiftHi: 'यह जगत परमात्मा से व्याप्त है; इसका आनंद लें, स्वामित्व की तृष्णा छोड़कर।',
      },
      {
        ref: 'Gita 2.48',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/2/verse/48',
        sanskrit: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय । सिद्ध्यसिद्ध्योः समो भूत्वा समत्वं योग उच्यते ॥',
        coreShiftEn: 'Perform action anchored in equilibrium; equanimity amidst success and failure is Yoga.',
        coreShiftHi: 'समत्व भाव में स्थित होकर कर्म करें; सफलता और असफलता में सम रहना ही योग है।',
      },
      {
        ref: 'Gita 4.38',
        scripture: 'श्रीमद्भगवद्गीता',
        href: '/scripture/bhagavadgita/chapter/4/verse/38',
        sanskrit: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते । तत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ॥',
        coreShiftEn: 'There is nothing in this world as purifying as self-knowledge, discovered naturally in time through sincere practice.',
        coreShiftHi: 'संसार में आत्मज्ञान के समान पवित्र कुछ नहीं है; निष्काम साधना से यह समय आने पर स्वयं प्रकट होता है।',
      },
    ],
  },
  {
    id: 'philosophy',
    emoji: '🏔️',
    labelEn: 'Deep Philosophy',
    labelHi: 'अद्वैत व चरम सत्य',
    subheadEn: 'When you crave unadulterated non-dual inquiry into the nature of reality.',
    subheadHi: 'ब्रह्म, आत्मा और माया का गहन दार्शनिक अन्वेषण।',
    readingPath: {
      title: 'जीवन का चरम अर्थ (Meaning of Life & Non-Duality)',
      href: '/wisdom-for-life/meaning-of-life',
      description: 'The highest philosophical teachings from Mandukya and Chandogya.',
    },
    verses: [
      {
        ref: 'Mandukya 2',
        scripture: 'माण्डूक्योपनिषद्',
        href: '/scripture/mandukya/chapter/1/verse/2',
        sanskrit: 'सर्वं ह्येतद् ब्रह्म अयमात्मा ब्रह्म सोऽयमात्मा चतुष्पात् ॥',
        coreShiftEn: 'All this is Brahman; this very innermost Self is Brahman, experienced in four states.',
        coreShiftHi: 'यह सब कुछ ब्रह्म है; यह आत्मा ही ब्रह्म है, जो चार अवस्थाओं में अनुभव होता है।',
      },
      {
        ref: 'Chandogya 6.8.7',
        scripture: 'छान्दोग्योपनिषद्',
        href: '/scripture/chandogya/chapter/6/verse/8',
        sanskrit: 'स य एषोऽणिमैतदात्म्यमिदं सर्वं तत्सत्यं स आत्मा तत्त्वमसि श्वेतकेतो ॥',
        coreShiftEn: 'That subtle essence which animates everything is the Truth. That is the Self. You are That.',
        coreShiftHi: 'वह जो सूक्ष्म तत्व संपूर्ण जगत में व्याप्त है, वही सत्य है। वही आत्मा है। तत्त्वमसि — तुम वही हो।',
      },
      {
        ref: 'Mundaka 2.2.8',
        scripture: 'मुण्डकोपनिषद्',
        href: '/scripture/mundaka/chapter/2/verse/8',
        sanskrit: 'भिद्यते हृदयग्रन्थिश्छिद्यन्ते सर्वसंशयाः । क्षीयन्ते चास्य कर्माणि तस्मिन्दृष्टे परावरे ॥',
        coreShiftEn: 'When the Supreme Truth is realized, the knot of the heart unknots, all doubts dissolve, and the bondage of karma falls away.',
        coreShiftHi: 'उस परम तत्व का दर्शन होते ही हृदय की सारी ग्रंथियां खुल जाती हैं और समस्त संशय छिन्न-भिन्न हो जाते हैं।',
      },
    ],
  },
];

export function MoodCompassSection() {
  const [selectedMoodId, setSelectedMoodId] = useState<string>('restless');
  const [playingRef, setPlayingRef] = useState<string | null>(null);
  const reduce = useReducedMotion();

  const currentMood = MOODS.find((m) => m.id === selectedMoodId) || MOODS[0];

  const handleSelectMood = (id: string) => {
    triggerTactileFeedback('selection', 'softTap');
    setSelectedMoodId(id);
  };

  const handlePlayAudio = (ref: string, sanskrit: string) => {
    triggerTactileFeedback('light', 'softTap');
    setPlayingRef(ref);
    const ok = speakSanskritShloka(
      sanskrit,
      0.85,
      () => setPlayingRef(null),
      () => setPlayingRef(null)
    );
    if (!ok) setPlayingRef(null);
  };

  return (
    <section
      aria-labelledby="mood-compass-heading"
      className="relative mx-auto my-6 max-w-4xl px-4 sm:px-6 z-20"
    >
      <div className="rounded-3xl border border-stone-200/80 bg-white/90 p-5 sm:p-7 shadow-xl backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-900/90 manuscript-surface">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200/60 dark:border-stone-800/60">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-saffron-700 dark:text-saffron-400 font-bold">
              <Compass className="w-3.5 h-3.5" />
              <span>आज आपका मन कैसा है? · How Is Your Mind Today?</span>
            </p>
            <h3 id="mood-compass-heading" className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
              मानसिक अवस्था अनुसार तत्काल शास्त्र-दर्शन
            </h3>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            <span className="block">{currentMood.subheadHi}</span>
            <span className="mt-0.5 block text-[11px] opacity-80">{currentMood.subheadEn}</span>
          </span>
        </div>

        {/* Horizontal Tactile Mood Selector */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar -mx-2 px-2">
          {MOODS.map((mood) => {
            const isSelected = mood.id === selectedMoodId;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => handleSelectMood(mood.id)}
                aria-pressed={isSelected}
                className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-saffron-600 text-white shadow-md scale-102 ring-2 ring-saffron-400/50'
                    : 'bg-stone-100/90 text-stone-700 hover:bg-stone-200/80 dark:bg-stone-800/70 dark:text-stone-300 dark:hover:bg-stone-800'
                }`}
              >
                <span className="text-base">{mood.emoji}</span>
                <span>{mood.labelHi}</span>
                <span className={`hidden md:inline text-xs font-normal ${isSelected ? 'text-white' : 'text-stone-700 dark:text-stone-300'}`}>
                  ({mood.labelEn})
                </span>
              </button>
            );
          })}
        </div>

        {/* Revealed Content Pane */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMood.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-4"
          >
            {/* Curated Verses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentMood.verses.map((v) => (
                <div
                  key={v.ref}
                  className="flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-stone-50/60 p-4 transition hover:border-amber-400/80 hover:bg-amber-50/30 dark:border-stone-800/80 dark:bg-stone-950/40 dark:hover:bg-amber-950/20"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-saffron-700 dark:text-saffron-400">
                        {v.ref} · {v.scripture}
                      </span>
                      <button
                        type="button"
                        onClick={() => handlePlayAudio(v.ref, v.sanskrit)}
                        title="श्लोक उच्चारण सुनें"
                        aria-label={`श्लोक उच्चारण सुनें · ${v.ref}`}
                        className="p-1 rounded-full text-stone-400 hover:text-saffron-600 transition"
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${playingRef === v.ref ? 'text-saffron-600 animate-pulse' : ''}`} />
                      </button>
                    </div>

                    <p lang="sa" className="font-devanagari text-xs font-bold text-stone-900 dark:text-stone-100 leading-relaxed">
                      {v.sanskrit}
                    </p>

                    <p className="font-serif italic text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                      &ldquo;{v.coreShiftHi}&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 mt-2 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between">
                    <Link
                      href={v.href}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-saffron-700 hover:underline dark:text-saffron-400"
                    >
                      <span>श्लोक पढ़ें</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Guided Reading Path Callout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-saffron-300/80 bg-gradient-to-r from-saffron-50/90 to-amber-50/90 p-4 dark:border-saffron-800/40 dark:from-saffron-950/40 dark:to-amber-950/40">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-saffron-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
                    मार्गदर्शक स्वाध्याय पथ (Guided Reading Path):
                  </p>
                  <p className="text-sm font-bold text-stone-900 dark:text-stone-100">
                    {currentMood.readingPath.title}
                  </p>
                </div>
              </div>

              <Link
                href={currentMood.readingPath.href}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-bold transition shadow-sm shrink-0"
              >
                <span>विस्तृत निबंध पढ़ें</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
