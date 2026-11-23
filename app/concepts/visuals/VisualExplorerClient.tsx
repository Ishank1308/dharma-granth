'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Eye, ArrowLeft, BookOpen, Layers } from 'lucide-react';
import { VISUAL_CONCEPTS, VISUAL_CONCEPT_KEYS, type VisualConceptData } from '@/data/visual-concepts';
import { InteractiveVisualLayer } from '@/app/components/visuals/InteractiveVisualLayer';
import { triggerTactileFeedback } from '@/lib/haptics';

export function VisualExplorerClient() {
  const [selectedConceptId, setSelectedConceptId] = useState<string>('dharma');

  const selectedConcept: VisualConceptData = VISUAL_CONCEPTS[selectedConceptId] ?? VISUAL_CONCEPTS.dharma;

  const handleSelectConcept = useCallback((id: string) => {
    triggerTactileFeedback('selection', 'click');
    setSelectedConceptId(id);
  }, []);

  return (
    <div className="space-y-8">
      {/* ── Concept Selector Ribbon ────────────────────────────────────────── */}
      <nav
        aria-label="अवधारणा चयन पट्टी"
        className="relative overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory"
      >
        <div className="flex items-center gap-2.5 min-w-max px-1">
          {VISUAL_CONCEPT_KEYS.map((key) => {
            const concept = VISUAL_CONCEPTS[key];
            const isSelected = concept.id === selectedConceptId;
            return (
              <button
                key={concept.id}
                type="button"
                onClick={() => handleSelectConcept(concept.id)}
                aria-pressed={isSelected}
                className={`group flex min-h-[48px] items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 transition-all snap-center ${
                  isSelected
                    ? 'border-saffron-500 bg-gradient-to-r from-saffron-600 to-amber-700 text-white shadow-lg ring-4 ring-saffron-500/20'
                    : 'border-dharma-border/80 bg-dharma-card hover:border-saffron-400 hover:bg-dharma-bg'
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-xl font-devanagari text-xs font-bold transition-all ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-saffron-500/10 text-saffron-700 dark:text-saffron-300'
                  }`}
                >
                  {concept.binduSymbol}
                </span>
                <span className="text-left leading-tight">
                  <span className={`block font-devanagari text-xs font-bold ${isSelected ? 'text-white' : 'text-dharma-text'}`}>
                    {concept.sanskrit}
                  </span>
                  <span className={`text-[10px] font-medium ${isSelected ? 'text-amber-100' : 'text-dharma-muted'}`}>
                    {concept.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── Main Interactive Sacred Visualizer Canvas ──────────────────────── */}
      <section aria-label={`${selectedConcept.label} इंटरैक्टिव आरेख`}>
        <InteractiveVisualLayer conceptId={selectedConcept.id} />
      </section>

      {/* ── Quick Summary & Deep Dive Link ─────────────────────────────────── */}
      <div className="rounded-3xl border border-dharma-border/80 bg-dharma-card p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
              {selectedConcept.label} ({selectedConcept.sanskrit}) की तात्विक दृष्टि
            </h3>
            <p className="text-xs text-dharma-muted">
              मूल प्रमाण: {selectedConcept.scriptureSource}
            </p>
          </div>
          <Link
            href={`/concepts/${selectedConcept.id}/`}
            className="focus-ring inline-flex items-center gap-2 rounded-xl bg-saffron-700 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-saffron-800 transition-all min-h-[44px]"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>पूरा दार्शनिक लेख व श्लोक संग्रह पढ़ें</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl bg-dharma-bg/70 border border-dharma-border/70 space-y-1">
            <p className="font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              ध्येय सूत्र (Core Formula)
            </p>
            <p className="font-devanagari text-sm font-bold text-dharma-text">
              « {selectedConcept.coreMantra} »
            </p>
            <p className="text-dharma-muted italic">
              {selectedConcept.coreMantraEn}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dharma-bg/70 border border-dharma-border/70 space-y-1">
            <p className="font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              ज्यामितीय प्रतिरूप (Visual Archetype)
            </p>
            <p className="font-serif text-sm font-semibold text-dharma-text capitalize">
              {selectedConcept.archetype.replace(/-/g, ' ')}
            </p>
            <p className="font-devanagari text-dharma-muted">
              {selectedConcept.geometry.titleHi}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-dharma-bg/70 border border-dharma-border/70 space-y-1">
            <p className="font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              साधना का परम फल (Realization)
            </p>
            <p className="font-devanagari text-xs text-dharma-text font-medium leading-relaxed">
              {selectedConcept.knowledgeMap.ultimateFruit.hi}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
