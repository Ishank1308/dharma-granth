'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  Compass,
  FileText,
  Layers,
  List,
  MessageSquare,
  Network,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import { usePerformanceMode } from '@/lib/performance-mode';
import { triggerTactileFeedback } from '@/lib/haptics';

// Static preview placeholder while 3D / graph chunks are loading
function NetworkStaticPlaceholder() {
  return (
    <div className="relative w-full h-[520px] rounded-3xl border border-dharma-border bg-dharma-card/60 backdrop-blur p-8 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Decorative background grid and nodes */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      <div className="relative z-10 space-y-4 max-w-md">
        <div className="mx-auto h-16 w-16 rounded-full bg-saffron-100 dark:bg-saffron-950/60 flex items-center justify-center text-saffron-600 animate-pulse">
          <Network className="h-8 w-8" />
        </div>
        <h3 className="font-devanagari text-lg font-bold text-dharma-text">
          ज्ञान संजाल लोड हो रहा है...
        </h3>
        <p className="text-xs text-dharma-muted">
          17 प्रमुख संकल्पनाओं और संवादों के नोड्स व संबंध रेखाएं तैयार की जा रही हैं।
        </p>
      </div>
    </div>
  );
}

// Strictly lazy-load ConceptGraph only when on /network and 3D/graph is requested
const DynamicConceptGraph = dynamic(
  () => import('@/app/components/ConceptGraph').then((mod) => mod.ConceptGraph),
  {
    ssr: false,
    loading: () => <NetworkStaticPlaceholder />,
  }
);

interface ConcordanceEntry {
  slug: string;
  titleSanskrit: string;
  titleEn: string;
  briefDefinitionHi: string;
  categoryCounts: { total: number };
}

interface SamvadaDialogue {
  id: string;
  titleHi: string;
  titleEn: string;
  speaker: { nameHi: string; roleHi: string };
  listener: { nameHi: string; roleHi: string };
  scriptureTitle: string;
  summaryHi: string;
  themes: string[];
}

export function NetworkViewClient() {
  const { isLiteMode } = usePerformanceMode();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');

  const [concordanceList, setConcordanceList] = useState<ConcordanceEntry[]>([]);
  const [dialogueList, setDialogueList] = useState<SamvadaDialogue[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    if (mediaQuery.matches || isLiteMode) {
      setViewMode('list');
    }

    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) setViewMode('list');
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, [isLiteMode]);

  // Load data for 2D list fallback
  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/data/concordance-index.json`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/data/samvada-dialogues.json`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([concordance, dialogues]) => {
        setConcordanceList(concordance);
        setDialogueList(dialogues);
      })
      .catch(() => {})
      .finally(() => setLoadingData(false));
  }, []);

  const showGraph = viewMode === 'graph' && !prefersReducedMotion && !isLiteMode;

  return (
    <div className="space-y-6">
      {/* View Switcher Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dharma-border bg-dharma-card p-3">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setViewMode('graph');
              triggerTactileFeedback('selection', 'softTap');
            }}
            disabled={prefersReducedMotion}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              viewMode === 'graph'
                ? 'bg-saffron-600 text-white shadow-2xs'
                : 'text-dharma-muted hover:text-dharma-text disabled:opacity-40'
            }`}
          >
            <Network className="h-3.5 w-3.5" />
            <span>3D / संजाल दृश्य</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('list');
              triggerTactileFeedback('selection', 'softTap');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
              viewMode === 'list'
                ? 'bg-saffron-600 text-white shadow-2xs'
                : 'text-dharma-muted hover:text-dharma-text'
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>2D सुलभ सूची दृश्य</span>
          </button>
        </div>

        {prefersReducedMotion && (
          <span className="text-[11px] text-dharma-muted italic flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-500" />
            गति संवेदनशीलता (Reduced Motion) सक्रिय
          </span>
        )}
      </div>

      {/* Main View Area */}
      {showGraph ? (
        <div className="rounded-3xl border border-dharma-border overflow-hidden bg-dharma-card shadow-lg">
          <DynamicConceptGraph articleIds={concordanceList.map((c) => c.slug)} />
        </div>
      ) : (
        /* Accessible 2D List Fallback */
        <div className="space-y-8">
          {/* Section 1: Core Philosophical Concepts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-dharma-text flex items-center gap-2">
                <Compass className="h-4 w-4 text-saffron-600" />
                मूल दार्शनिक संकल्पनाएँ (Core Philosophical Concepts)
              </h2>
              <span className="text-xs text-dharma-muted">
                {concordanceList.length} संकल्पनाएँ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {concordanceList.map((concept) => (
                <div
                  key={concept.slug}
                  className="rounded-2xl border border-dharma-border bg-dharma-card p-4 hover:border-saffron-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-devanagari text-lg font-bold text-saffron-900 dark:text-saffron-200">
                        {concept.titleSanskrit}
                      </h3>
                      <span className="rounded-md bg-saffron-50 px-2 py-0.5 text-[10px] font-bold text-saffron-800 dark:bg-saffron-950/60 dark:text-saffron-300">
                        {concept.categoryCounts.total} संदर्भ
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-dharma-text mb-2">
                      {concept.titleEn}
                    </p>
                    <p className="text-xs text-dharma-muted font-devanagari leading-relaxed line-clamp-2">
                      {concept.briefDefinitionHi}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-dharma-border/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-dharma-muted font-mono uppercase">
                      #{concept.slug}
                    </span>
                    <Link
                      href={`/concepts#${concept.slug}`}
                      className="text-saffron-600 font-semibold hover:underline"
                    >
                      अध्ययन करें →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Sacred Philosophical Dialogues (Saṃvāda) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-dharma-text flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-saffron-600" />
                पवित्र दार्शनिक संवाद (Sacred Saṃvāda Dialogues)
              </h2>
              <span className="text-xs text-dharma-muted">
                {dialogueList.length} प्रमुख संवाद
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dialogueList.map((dialogue) => (
                <div
                  key={dialogue.id}
                  className="rounded-2xl border border-dharma-border bg-dharma-card p-4.5 hover:border-saffron-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-lg bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-900 dark:bg-amber-950/60 dark:text-amber-200">
                      {dialogue.scriptureTitle}
                    </span>
                    <span className="text-xs text-dharma-muted font-mono">{dialogue.id}</span>
                  </div>

                  <h3 className="font-devanagari text-base font-bold text-dharma-text mb-1">
                    {dialogue.titleHi}
                  </h3>
                  <p className="text-xs font-medium text-saffron-800 dark:text-saffron-300 mb-2">
                    {dialogue.titleEn}
                  </p>

                  <div className="my-2 rounded-xl bg-dharma-bg p-2.5 text-xs space-y-1">
                    <p className="text-dharma-text">
                      <strong className="text-saffron-700 dark:text-saffron-400">वक्ता:</strong>{' '}
                      {dialogue.speaker.nameHi} ({dialogue.speaker.roleHi})
                    </p>
                    <p className="text-dharma-text">
                      <strong className="text-saffron-700 dark:text-saffron-400">श्रोता:</strong>{' '}
                      {dialogue.listener.nameHi} ({dialogue.listener.roleHi})
                    </p>
                  </div>

                  <p className="text-xs text-dharma-muted font-devanagari leading-relaxed mb-3">
                    {dialogue.summaryHi}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {dialogue.themes.map((th) => (
                      <span
                        key={th}
                        className="rounded-md border border-dharma-border px-2 py-0.5 text-[10px] text-dharma-muted font-medium"
                      >
                        {th}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
