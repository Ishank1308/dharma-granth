'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Compass, HelpCircle, Key, Layers, ListOrdered, MapPin } from 'lucide-react';
import type { ChapterMapNode } from '@/data/chapter-orientation';
import { CONCEPT_DETAILS } from '@/data/concept-details';
import { readHref } from '@/lib/verse-paths';

interface Props {
  scriptureId: string;
  chapterId: number;
  nodes: ChapterMapNode[];
  chapterConclusion?: string;
}

export function InteractiveChapterMap({ scriptureId, chapterId, nodes, chapterConclusion }: Props) {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  if (!nodes || nodes.length === 0) return null;

  const activeNode = nodes[activeStageIndex] || nodes[0];

  return (
    <section
      aria-labelledby="chapter-map-heading"
      className="mt-6 rounded-2xl border border-dharma-border bg-dharma-card p-5 sm:p-7 shadow-sm transition-all"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-dharma-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-saffron-500/15 text-saffron-800 dark:text-saffron-300">
              <Compass className="h-4 w-4" />
            </span>
            <h3 id="chapter-map-heading" className="font-serif text-lg font-bold text-dharma-text">
              Interactive Chapter Map <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· अध्याय मानचित्र</span>
            </h3>
          </div>
          <p className="mt-1 text-xs text-dharma-muted">
            Reviewed thematic progression connecting narrative stages, central inquiries, and key verses.
          </p>
        </div>

        {/* View Mode Toggle: Interactive Stepper vs Accessible List */}
        <div role="group" aria-label="Map display mode" className="flex items-center gap-1 rounded-xl border border-dharma-border bg-dharma-bg p-1 self-start sm:self-center">
          <button
            type="button"
            aria-pressed={viewMode === 'map'}
            onClick={() => setViewMode('map')}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
              viewMode === 'map'
                ? 'bg-saffron-600 text-white shadow-xs'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Map View</span>
          </button>
          <button
            type="button"
            aria-pressed={viewMode === 'list'}
            onClick={() => setViewMode('list')}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
              viewMode === 'list'
                ? 'bg-saffron-600 text-white shadow-xs'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <ListOrdered className="h-3.5 w-3.5" />
            <span>Accessible List</span>
          </button>
        </div>
      </div>

      {viewMode === 'map' ? (
        <div className="mt-5 space-y-6">
          {/* Stepper Navigation */}
          <nav aria-label="Chapter stages stepper" className="overflow-x-auto pb-2 scrollbar-none">
            <ol className="flex min-w-full items-center gap-2 sm:gap-3">
              {nodes.map((node, idx) => {
                const isCurrent = idx === activeStageIndex;
                return (
                  <li key={node.id} className="flex-1 min-w-[140px] sm:min-w-[160px]">
                    <button
                      type="button"
                      aria-current={isCurrent ? 'step' : undefined}
                      onClick={() => setActiveStageIndex(idx)}
                      className={`focus-ring w-full text-left rounded-xl border p-2.5 sm:p-3 transition-all ${
                        isCurrent
                          ? 'border-saffron-600 bg-saffron-50/80 dark:bg-saffron-950/30 shadow-xs'
                          : 'border-dharma-border bg-dharma-bg/80 hover:border-saffron-400'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className={`${isCurrent ? 'text-saffron-700 dark:text-saffron-400' : 'text-dharma-muted'}`}>
                          Stage {idx + 1}
                        </span>
                        <span className="rounded-full bg-dharma-border/50 px-2 py-0.5 text-[10px] font-medium text-dharma-muted">
                          v. {node.verseRange}
                        </span>
                      </div>
                      <p className={`mt-1 line-clamp-1 text-xs font-bold ${isCurrent ? 'text-dharma-text' : 'text-dharma-text/80'}`}>
                        {node.stageName}
                      </p>
                      <p lang="hi" className="font-devanagari text-[11px] text-dharma-muted line-clamp-1">
                        {node.stageNameHi}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* Active Node Detail Card */}
          <article
            aria-live="polite"
            className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-amber-50/40 via-dharma-bg to-dharma-card p-5 sm:p-6 dark:border-amber-900/60 dark:from-amber-950/20 shadow-xs"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dharma-border/80 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                  Stage {activeStageIndex + 1} of {nodes.length} · Verses {activeNode.verseRange}
                </span>
                <h4 className="font-serif text-lg font-bold text-dharma-text mt-0.5">
                  {activeNode.stageName} <span lang="hi" className="font-devanagari font-normal text-base text-dharma-muted">({activeNode.stageNameHi})</span>
                </h4>
              </div>

              {/* Direct Verse Jump Actions */}
              <div className="flex items-center gap-1.5">
                <Link
                  href={readHref(scriptureId, chapterId, activeNode.startVerse)}
                  className="focus-ring inline-flex min-h-[40px] items-center gap-1.5 rounded-xl bg-saffron-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-saffron-700 transition"
                >
                  <span>Read Stage Verses</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-dharma-text">
              {activeNode.summary}
            </p>

            <dl className="mt-4 grid gap-4 sm:grid-cols-2 text-xs">
              {/* Core Question */}
              <div className="rounded-xl border border-dharma-border bg-dharma-card p-3.5">
                <dt className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-saffron-800 dark:text-saffron-300">
                  <HelpCircle className="h-3.5 w-3.5 text-saffron-600" />
                  <span>Central Inquiry (केंद्रीय प्रश्न)</span>
                </dt>
                <dd className="mt-1.5 text-sm italic font-serif leading-relaxed text-dharma-text">
                  &ldquo;{activeNode.coreQuestion}&rdquo;
                </dd>
              </div>

              {/* Concepts Explored */}
              <div className="rounded-xl border border-dharma-border bg-dharma-card p-3.5">
                <dt className="flex items-center gap-1.5 font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-300">
                  <Key className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Major Concepts (प्रमुख अवधारणाएँ)</span>
                </dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {activeNode.concepts.map((concept) => {
                    const detail = CONCEPT_DETAILS[concept.toLowerCase()];
                    return detail ? (
                      <Link
                        key={concept}
                        href={`/concepts/${concept.toLowerCase()}`}
                        className="inline-flex min-h-[32px] items-center rounded-lg border border-emerald-500/30 bg-emerald-50/60 dark:bg-emerald-950/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-900 dark:text-emerald-200 hover:border-emerald-500 transition"
                      >
                        {concept}
                      </Link>
                    ) : (
                      <span
                        key={concept}
                        className="inline-flex min-h-[32px] items-center rounded-lg border border-dharma-border bg-dharma-bg px-2.5 py-0.5 text-xs text-dharma-muted"
                      >
                        {concept}
                      </span>
                    );
                  })}
                </dd>
              </div>
            </dl>

            {/* Key Verse Anchors */}
            {activeNode.keyVerses.length > 0 && (
              <div className="mt-3.5 rounded-xl border border-dharma-border bg-dharma-card p-3 text-xs flex flex-wrap items-center gap-2">
                <span className="font-bold text-dharma-muted uppercase tracking-wide text-[11px]">
                  Pivotal Verses:
                </span>
                {activeNode.keyVerses.map((v) => (
                  <Link
                    key={v}
                    href={readHref(scriptureId, chapterId, v)}
                    className="focus-ring inline-flex min-h-[32px] items-center gap-1 rounded-lg border border-amber-600/30 bg-amber-500/10 px-2.5 py-0.5 font-bold text-amber-900 dark:text-amber-200 hover:border-amber-600 transition"
                  >
                    <span>श्लोक {chapterId}.{v}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            )}

            {activeNode.transitionNote && (
              <p className="mt-3 text-xs text-dharma-muted italic flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-saffron-600 shrink-0" />
                <span>Transition: {activeNode.transitionNote}</span>
              </p>
            )}
          </article>
        </div>
      ) : (
        /* Accessible Screen-Reader Ordered List Alternative */
        <div className="mt-5 space-y-4">
          <p className="text-xs text-dharma-muted">
            Semantic ordered list representation of all {nodes.length} thematic stages:
          </p>
          <ol className="space-y-4">
            {nodes.map((node, i) => (
              <li
                key={node.id}
                className="rounded-xl border border-dharma-border bg-dharma-bg p-4 sm:p-5 text-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dharma-border pb-2">
                  <h4 className="font-bold text-dharma-text text-base">
                    {i + 1}. {node.stageName} <span lang="hi" className="font-devanagari font-normal text-dharma-muted">({node.stageNameHi})</span>
                  </h4>
                  <span className="rounded-full bg-dharma-card px-2.5 py-0.5 text-xs font-semibold text-dharma-muted border border-dharma-border">
                    Verses {chapterId}.{node.verseRange}
                  </span>
                </div>
                <p className="mt-2 text-dharma-text/90 leading-relaxed">
                  {node.summary}
                </p>
                <p className="mt-2 text-xs italic text-dharma-muted">
                  <strong>Inquiry:</strong> &ldquo;{node.coreQuestion}&rdquo;
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-dharma-muted">Key Verses:</span>
                  {node.keyVerses.map((v) => (
                    <Link
                      key={v}
                      href={readHref(scriptureId, chapterId, v)}
                      className="inline-flex min-h-[32px] items-center gap-1 rounded-md border border-dharma-border bg-dharma-card px-2 py-0.5 text-xs font-semibold text-saffron-800 dark:text-saffron-300 underline underline-offset-2"
                    >
                      {chapterId}.{v}
                    </Link>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Chapter Conclusion Summary Card */}
      {chapterConclusion && (
        <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-50/40 p-4 dark:border-emerald-500/20 dark:bg-emerald-950/20 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>Chapter Conclusion & Synthesis · उपसंहार</span>
          </div>
          <p className="mt-1.5 text-sm leading-relaxed text-dharma-text/90">
            {chapterConclusion}
          </p>
        </div>
      )}
    </section>
  );
}
