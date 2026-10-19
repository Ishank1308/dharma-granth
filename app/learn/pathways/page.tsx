'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, ArrowRight, Award, ChevronDown, ChevronUp, Target, BookOpen } from 'lucide-react';
import { pathways, getPathway, type Pathway } from '@/data/pathways';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { Certificate } from '@/app/components/Certificate';
import { FadeUp, FadeUpOnView, Stagger, StaggerItem } from '@/app/components/motion/primitives';

export default function PathwaysPage() {
  const reduce = useReducedMotion();
  const progress = useStudyProgress();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCertificateFor, setShowCertificateFor] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  // No loading gate: the pathways themselves are static content (and must be
  // in the exported HTML for search engines). Only the reader's progress comes
  // from localStorage; until it loads, every pathway reads as not started.
  const filteredPathways =
    selectedLevel === 'all'
      ? pathways
      : pathways.filter((p) => p.level === selectedLevel);

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* Header */}
      <section className="bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-widest text-saffron-200 mb-2">
              Guided Learning
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
              Learning Pathways
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Structured journeys through Hindu scriptures — from beginner courses to advanced philosophy.
              Track your progress and earn completion certificates.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Level Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Pathways (सभी मार्ग)' },
              { id: 'beginner', label: 'Beginner (प्रारम्भिक)' },
              { id: 'intermediate', label: 'Intermediate (मध्यम)' },
              { id: 'advanced', label: 'Advanced (उन्नत)' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedLevel(tab.id as typeof selectedLevel)}
                className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition ${
                  selectedLevel === tab.id
                    ? 'bg-saffron-600 text-white shadow-sm'
                    : 'border border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300 hover:text-saffron-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-dharma-muted">
            {filteredPathways.length} अध्ययन मार्ग उपलब्ध
          </p>
        </div>

        <Stagger className="space-y-6">
          {filteredPathways.map((pathway) => {
            const pp = progress.getPathwayProgress(pathway.id);
            const completedSteps = pp?.completedSteps ?? [];
            const completedCount = completedSteps.length;
            const pct = Math.round((completedCount / pathway.steps.length) * 100);
            const isComplete = pct === 100;
            const isExpanded = expandedId === pathway.id;
            const firstIncompleteStep =
              pathway.steps.find((s) => !completedSteps.includes(s.id)) ?? pathway.steps[0];

            return (
              <StaggerItem key={pathway.id}>
                <div className="rounded-2xl border border-dharma-border bg-dharma-card overflow-hidden shadow-sm hover:shadow-md transition">
                  {/* Pathway header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${pathway.gradient} flex items-center justify-center text-2xl shadow-md`}>
                          {pathway.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-serif font-bold text-dharma-text">
                              {pathway.title}
                            </h2>
                            {isComplete && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 text-[10px] font-bold uppercase tracking-wider border border-saffron-200">
                                <Award className="w-3 h-3" />
                                Complete
                              </span>
                            )}
                          </div>
                          {pathway.titleSanskrit && (
                            <p lang="sa" className="font-devanagari text-sm text-saffron-600 mb-1">
                              {pathway.titleSanskrit}
                            </p>
                          )}
                          <p className="text-sm text-dharma-muted line-clamp-2">
                            {pathway.description}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className={`px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              pathway.level === 'beginner'
                                ? 'bg-emerald-100 text-emerald-700'
                                : pathway.level === 'intermediate'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}>
                              {pathway.level}
                            </span>
                            <span className="text-dharma-muted">
                              {pathway.steps.length} steps
                            </span>
                            <span className="text-dharma-muted flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {pathway.steps.reduce((acc, s) => acc + s.estimatedMinutes, 0)} min
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : pathway.id)}
                          className="rounded-lg p-1.5 text-dharma-muted hover:bg-dharma-bg hover:text-dharma-text"
                          aria-label={isExpanded ? 'Collapse pathway' : 'Expand pathway'}
                          aria-expanded={isExpanded}
                          aria-controls={`pathway-steps-${pathway.id}`}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <span className="text-xs font-bold text-saffron-700">{pct}%</span>
                      </div>
                    </div>

                    {/* Quick Direct Action */}
                    <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-dharma-border/60">
                      <Link
                        href={firstIncompleteStep.href}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-saffron-50 px-3.5 py-1.5 text-xs font-bold text-saffron-800 transition hover:bg-saffron-100"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>
                          {completedCount === 0
                            ? 'Start Pathway'
                            : isComplete
                            ? 'Review Lessons'
                            : `Continue: ${firstIncompleteStep.title}`}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : pathway.id)}
                        className="text-xs font-semibold text-dharma-muted hover:text-saffron-700"
                        aria-expanded={isExpanded}
                        aria-controls={`pathway-steps-${pathway.id}`}
                      >
                        {isExpanded ? 'Hide Steps' : `Show all ${pathway.steps.length} steps`}
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="px-6 pb-4">
                    <div className="w-full h-2 bg-dharma-border rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${pathway.gradient} transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>

                  {/* Steps: always in the HTML (so the course content is
                      indexable), collapsed with a grid-rows transition and
                      inert while closed so it stays out of the tab order. */}
                  <div
                    id={`pathway-steps-${pathway.id}`}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                    {...({ inert: isExpanded ? undefined : '' } as Record<string, string | undefined>)}
                  >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 pt-2 border-t border-dharma-border">
                          {/* Learning outcomes */}
                          <div className="mb-5 rounded-xl bg-saffron-50/40 border border-saffron-100 p-4">
                            <p className="text-xs font-bold uppercase tracking-wider text-saffron-700 mb-2 flex items-center gap-1.5">
                              <Target className="w-3.5 h-3.5" />
                              What you&apos;ll gain
                            </p>
                            <ul className="space-y-1">
                              {pathway.learningOutcomes.map((outcome, i) => (
                                <li key={i} className="text-sm text-dharma-text flex items-start gap-2">
                                  <span className="text-saffron-500 mt-0.5">•</span>
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Steps */}
                          <div className="space-y-2">
                            {pathway.steps.map((step, idx) => {
                              const isStepComplete = completedSteps.includes(step.id);
                              return (
                                <div
                                  key={step.id}
                                  className={`rounded-xl border p-4 transition-all ${
                                    isStepComplete
                                      ? 'border-emerald-200 bg-emerald-50/30'
                                      : 'border-dharma-border bg-dharma-bg/40'
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <button
                                      onClick={() => progress.togglePathwayStep(pathway.id, step.id)}
                                      className="flex-shrink-0 mt-0.5"
                                      title={isStepComplete ? 'Mark as incomplete' : 'Mark as complete'}
                                    >
                                      {isStepComplete ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                      ) : (
                                        <Circle className="w-5 h-5 text-dharma-muted hover:text-saffron-500 transition" />
                                      )}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-dharma-text">
                                          {step.title}
                                        </h4>
                                        <span className="text-xs text-dharma-muted flex items-center gap-1 flex-shrink-0">
                                          <Clock className="w-3 h-3" />
                                          {step.estimatedMinutes}m
                                        </span>
                                      </div>
                                      {step.titleSanskrit && (
                                        <p lang="sa" className="font-devanagari text-xs text-saffron-600 mb-1">
                                          {step.titleSanskrit}
                                        </p>
                                      )}
                                      <p className="text-xs text-dharma-muted leading-relaxed mb-2">
                                        {step.description}
                                      </p>
                                      {step.focusConcepts && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                          {step.focusConcepts.map((concept) => (
                                            <span
                                              key={concept}
                                              className="px-2 py-0.5 rounded-full bg-saffron-100 text-saffron-800 text-[10px] font-semibold"
                                            >
                                              {concept}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      <Link
                                        href={step.href}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 transition"
                                      >
                                        <BookOpen className="w-3 h-3" />
                                        Start reading
                                        <ArrowRight className="w-3 h-3" />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Certificate section */}
                          {isComplete && (
                            <div className="mt-5 rounded-xl bg-gradient-to-br from-saffron-50 to-amber-50 border border-saffron-200 p-5 text-center">
                              <Award className="w-8 h-8 text-saffron-600 mx-auto mb-2" />
                              <h4 className="text-base font-serif font-bold text-dharma-text mb-1">
                                Pathway Complete! <span aria-hidden="true">🎉</span>
                              </h4>
                              <p className="text-sm text-dharma-muted mb-4">
                                You&apos;ve completed all {pathway.steps.length} steps. Claim your certificate of completion.
                              </p>
                              <button
                                onClick={() => setShowCertificateFor(pathway.id)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 text-white text-sm font-bold hover:from-saffron-700 hover:to-amber-700 transition shadow-md"
                              >
                                <Award className="w-4 h-4" />
                                View Certificate
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>

      {/* Certificate modal */}
      <AnimatePresence>
        {showCertificateFor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowCertificateFor(null)}
          >
            <motion.div
              initial={reduce ? {} : { scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? {} : { scale: 0.9, opacity: 0 }}
              className="max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Certificate
                pathwayTitle={getPathway(showCertificateFor)?.title ?? ''}
                pathwayTitleSanskrit={getPathway(showCertificateFor)?.titleSanskrit}
                studentName="Student"
                completedDate={new Date().toISOString()}
                certificateId={`DG-${showCertificateFor}-${Date.now().toString(36).toUpperCase()}`}
              />
              <div className="text-center mt-4">
                <button
                  onClick={() => setShowCertificateFor(null)}
                  className="px-6 py-2.5 rounded-full bg-white text-dharma-text font-semibold border border-dharma-border hover:bg-saffron-50 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
