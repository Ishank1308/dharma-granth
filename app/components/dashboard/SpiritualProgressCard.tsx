'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronRight,
  BookOpen,
  Calendar,
  FileText,
  Compass,
  Check,
  Info,
  X,
  Award,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  calculateSpiritualLevel,
  SPIRITUAL_LEVELS,
  type UserSadhanaStats,
  type SpiritualLevelDef,
} from '@/lib/spiritual-levels';

interface Props {
  stats: UserSadhanaStats;
}

export function SpiritualProgressCard({ stats }: Props) {
  const [showAllStages, setShowAllStages] = useState(false);
  const { currentLevel, nextLevel, overallProgressPct, remainingForNext } =
    calculateSpiritualLevel(stats);

  return (
    <section aria-labelledby="spiritual-progress-heading" className="w-full">
      {/* Main Spiritual Level Card */}
      <div className="relative overflow-hidden rounded-3xl border border-saffron-300/70 dark:border-saffron-800/40 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-saffron-100/30 dark:from-stone-900/95 dark:via-stone-900/80 dark:to-amber-950/20 p-6 sm:p-8 shadow-sm">
        {/* Subtle Watermark Medallion */}
        <div
          aria-hidden="true"
          className="absolute -right-6 -bottom-8 pointer-events-none text-saffron-500/[0.07] dark:text-saffron-400/[0.04] select-none text-[160px] font-serif leading-none"
        >
          ॐ
        </div>

        {/* Top Header Strip */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-saffron-200/60 dark:border-saffron-900/40 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-saffron-500/15 text-saffron-800 dark:text-saffron-300 border border-saffron-400/30">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600 dark:text-saffron-400" />
                <span>आत्मिक सोपान · Spiritual Progress</span>
              </span>
              <span className="text-2xs font-semibold text-dharma-muted">
                सोपान {currentLevel.index + 1} / {SPIRITUAL_LEVELS.length}
              </span>
            </div>

            <h2 id="spiritual-progress-heading" className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text flex items-center gap-2.5">
              <span>{currentLevel.titleHi}</span>
              <span className="text-lg sm:text-xl font-normal text-dharma-muted">
                ({currentLevel.titleEn})
              </span>
              <span className="text-2xl" aria-hidden="true">
                {currentLevel.symbol}
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-dharma-muted mt-0.5">
              {currentLevel.stageName} · {currentLevel.summaryHi}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAllStages(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-saffron-300/80 dark:border-saffron-800/60 bg-dharma-card/80 text-dharma-text hover:bg-saffron-50 dark:hover:bg-saffron-950/30 transition shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5 text-saffron-600 dark:text-saffron-400" />
            <span>6 सोपान दर्शन · View All Stages</span>
          </button>
        </div>

        {/* Spiritual Aphorism & Contemplation */}
        <div className="my-5 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-saffron-200/60 dark:border-stone-800 p-4 sm:p-5">
          <p className="text-2xs uppercase tracking-widest font-bold text-saffron-700 dark:text-saffron-400 mb-1">
            इस सोपान का ध्येय सूत्र · Sacred Aphorism ({currentLevel.aphorism.source})
          </p>
          <p lang="sa" className="font-devanagari text-lg sm:text-xl font-bold text-dharma-text leading-relaxed">
            « {currentLevel.aphorism.sanskrit} »
          </p>
          <p className="text-xs italic text-dharma-muted mt-0.5 font-serif">
            {currentLevel.aphorism.transliteration}
          </p>
          <p className="text-xs sm:text-sm text-dharma-text mt-2 font-medium">
            {currentLevel.aphorism.translationHi}
          </p>
          <p className="text-xs text-dharma-muted/90 mt-1">
            “{currentLevel.aphorism.translationEn}”
          </p>
        </div>

        {/* Progress Bar & Next Level Milestones */}
        {nextLevel ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-dharma-text flex items-center gap-1.5">
                <span>अगला सोपान:</span>
                <span className="font-bold text-saffron-700 dark:text-saffron-300">
                  {nextLevel.titleHi} ({nextLevel.titleEn}) {nextLevel.symbol}
                </span>
              </span>
              <span className="font-bold text-saffron-700 dark:text-saffron-400">
                {overallProgressPct}%
              </span>
            </div>

            {/* Noble Progress Gauge */}
            <div className="h-2.5 w-full bg-saffron-200/50 dark:bg-stone-800 rounded-full overflow-hidden p-0.5 border border-saffron-300/40 dark:border-stone-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-saffron-600 via-amber-600 to-orange-600 transition-all duration-700 ease-out"
                style={{ width: `${overallProgressPct}%` }}
              />
            </div>

            {/* Remaining Milestones to Next Level */}
            {remainingForNext && (
              <div className="pt-1">
                <p className="text-2xs font-bold uppercase tracking-wider text-dharma-muted mb-2">
                  स्वाध्याय के वैकल्पिक संकेत · Optional study markers
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {remainingForNext.verses > 0 ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-dharma-card/60 border border-dharma-border/60">
                      <BookOpen className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
                      <span className="text-dharma-muted">
                        <strong className="text-dharma-text">{remainingForNext.verses}</strong> और श्लोक
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>पठन दर्ज</span>
                    </div>
                  )}

                  {remainingForNext.days > 0 ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-dharma-card/60 border border-dharma-border/60">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-dharma-muted">
                        <strong className="text-dharma-text">{remainingForNext.days}</strong> दिन स्वाध्याय
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>दिवस दर्ज</span>
                    </div>
                  )}

                  {remainingForNext.notes > 0 ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-dharma-card/60 border border-dharma-border/60">
                      <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span className="text-dharma-muted">
                        <strong className="text-dharma-text">{remainingForNext.notes}</strong> विचार नोट्स
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>चिंतन दर्ज</span>
                    </div>
                  )}

                  {remainingForNext.pathways > 0 ? (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-dharma-card/60 border border-dharma-border/60">
                      <Compass className="w-3.5 h-3.5 text-violet-600 shrink-0" />
                      <span className="text-dharma-muted">
                        <strong className="text-dharma-text">{remainingForNext.pathways}</strong> अध्ययन पथ
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>अध्ययन पथ पूर्ण</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs sm:text-sm font-medium flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              अभिनंदन! आप सर्वोच्च आत्मिक सोपान « ज्ञानी / तत्त्वज्ञ » पर प्रतिष्ठित हैं। आपका स्वाध्याय निरंतर लोक-कल्याण हेतु प्रकाशमान रहे।
            </span>
          </div>
        )}
      </div>

      {/* 6 Stages Modal Dialog */}
      <AnimatePresence>
        {showAllStages && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAllStages(false)}
              className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-3xl rounded-3xl border border-dharma-border bg-dharma-card p-5 sm:p-7 shadow-2xl my-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-dharma-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-saffron-500" />
                    <span className="text-2xs uppercase tracking-widest font-bold text-saffron-700 dark:text-saffron-300">
                      वैदिक स्वाध्याय परंपरा · Traditional Pedagogy
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-dharma-text mt-1">
                    आत्मिक षट्-सोपान (The 6 Classical Seeker Stages)
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllStages(false)}
                  className="rounded-full p-2 text-dharma-muted hover:bg-dharma-panel hover:text-dharma-text transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Philosophical Context note */}
              <div className="my-4 p-3.5 rounded-2xl bg-saffron-500/10 border border-saffron-500/20 text-xs text-dharma-muted">
                <p className="text-dharma-text font-semibold mb-1">
                  « चतुर्विधा भजन्ते मां जनाः सुकृतिनोऽर्जुन । आर्तो जिज्ञासुरर्थार्थी ज्ञानी च भरतर्षभ ॥ »
                </p>
                <p>
                  श्रीमद्भगवद्गीता (7.16) और उपनिषदों में स्वाध्याय की इस क्रमिक यात्रा को आत्म-साक्षात्कार का प्रशस्त मार्ग बताया गया है — जहाँ जिज्ञासु अपनी लगन से ज्ञान का साक्षात करता है।
                </p>
              </div>

              {/* The 6 Stages Grid */}
              <div className="space-y-3.5 mt-4">
                {SPIRITUAL_LEVELS.map((lvl) => {
                  const isCurrent = lvl.id === currentLevel.id;
                  const isCompleted = lvl.index < currentLevel.index;

                  return (
                    <div
                      key={lvl.id}
                      className={`p-4 rounded-2xl border transition ${
                        isCurrent
                          ? 'border-saffron-500 bg-saffron-500/10 shadow-sm'
                          : isCompleted
                          ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                          : 'border-dharma-border/60 bg-dharma-panel/40 opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl" aria-hidden="true">
                            {lvl.symbol}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-serif font-bold text-base text-dharma-text">
                                {lvl.index + 1}. {lvl.titleHi} ({lvl.titleEn})
                              </h4>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-md bg-saffron-600 text-white text-2xs font-bold uppercase tracking-wider">
                                  वर्तमान स्थिति · Current
                                </span>
                              )}
                              {isCompleted && (
                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-2xs font-bold">
                                  <Check className="w-3 h-3" /> सिद्ध
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-dharma-muted">
                              {lvl.stageName} · {lvl.summaryHi}
                            </p>
                          </div>
                        </div>

                        <span className="text-2xs font-serif text-dharma-muted shrink-0 text-right">
                          {lvl.aphorism.source}
                        </span>
                      </div>

                      {/* Aphorism */}
                      <div className="mt-2.5 pt-2.5 border-t border-dharma-border/40 text-xs">
                        <p lang="sa" className="font-devanagari font-semibold text-saffron-800 dark:text-saffron-300">
                          « {lvl.aphorism.sanskrit} »
                        </p>
                        <p className="text-dharma-muted mt-0.5">
                          {lvl.aphorism.translationHi}
                        </p>
                        <p className="text-2xs text-dharma-muted/80 italic mt-0.5">
                          “{lvl.contemplationHi}”
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAllStages(false)}
                  className="px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs transition"
                >
                  समझ गया · Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
