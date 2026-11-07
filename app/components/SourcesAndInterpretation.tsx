'use client';

import {
  BookOpen,
  ScrollText,
  FileCheck2,
  History,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Layers,
  Scale,
  Sparkles,
  Info,
} from 'lucide-react';
import { CONTENT_LABELS, type ContentLabelKey } from '@/lib/content-labels';
import {
  getScriptureSourceMeta,
  SCRIPTURE_SOURCES,
  type ScriptureSourceMeta,
  type SourceCorrectionEntry,
} from '@/data/sources-registry';

export interface SourcesAndInterpretationProps {
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleSanskrit?: string;
  chapterId?: number | string;
  verseId?: number | string;
  /** Custom edition or reviewer overrides if available from page data */
  editionOverride?: string;
  sourceUrlOverride?: string;
  className?: string;
}

export function SourcesAndInterpretation({
  scriptureId,
  scriptureTitle,
  scriptureTitleSanskrit,
  editionOverride,
  sourceUrlOverride,
  className = '',
}: SourcesAndInterpretationProps) {
  const meta: ScriptureSourceMeta = getScriptureSourceMeta(
    scriptureId,
    scriptureTitle,
    scriptureTitleSanskrit,
  );

  // A variant note only when one is recorded for this text (not the registry's default line).
  const variantNote = SCRIPTURE_SOURCES[scriptureId]?.alternativeReadingNote;

  const labelKeys: ContentLabelKey[] = [
    'mula',
    'literal',
    'commentary',
    'explanation',
    'reflection',
    'research',
  ];

  return (
    <section
      aria-labelledby="sources-interpretation-heading"
      className={`rounded-2xl border border-dharma-border bg-dharma-card p-5 sm:p-7 shadow-sm space-y-6 ${className}`}
    >
      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-dharma-border/70 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dharma-muted">
            <Scale className="w-3.5 h-3.5 text-saffron-600" />
            <span>शास्त्रीय प्रामाणिकता एवं पारदर्शकता</span>
            <span aria-hidden="true">·</span>
            <span>Sources & Interpretation</span>
          </div>
          <h2 id="sources-interpretation-heading" className="text-xl sm:text-2xl font-serif font-bold text-dharma-text mt-1">
            स्रोत, संस्करण एवं व्याख्या वर्गीकरण
          </h2>
          <p className="text-xs sm:text-sm text-dharma-muted mt-1 max-w-2xl leading-relaxed">
            धर्म ग्रंथ पर मूल शास्त्र, पारंपरिक भाष्य और आधुनिक व्याख्या को पूर्णतः पृथक रखा जाता है ताकि पाठक को किसी भी व्याख्या के शास्त्र होने का भ्रम न हो।
          </p>
        </div>
      </div>

      {/* ── 1. Content Labels: 6 Epistemic Tiers Guide ──
          The same guide on every verse page, so it stays folded until asked for. */}
      <details className="group space-y-3">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 rounded-xl [&::-webkit-details-marker]:hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-dharma-muted flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-saffron-600" />
            सामग्री वर्गीकरण संकेत (Epistemic Content Labels)
          </h3>
          <span className="flex items-center gap-1 text-[11px] text-dharma-muted">
            6 स्तरिय प्रमाण व्यवस्था
            <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" aria-hidden="true" />
          </span>
        </summary>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {labelKeys.map((key) => {
            const item = CONTENT_LABELS[key];
            return (
              <div
                key={key}
                className="p-3 rounded-xl border border-dharma-border/80 bg-dharma-panel-muted/60 space-y-1.5 text-xs transition hover:border-saffron-300/50"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${item.visualBadgeClass}`}
                  >
                    <span lang="hi" className="font-devanagari">
                      {item.labelHi}
                    </span>
                    <span aria-hidden="true" className="mx-1 opacity-50">
                      ·
                    </span>
                    <span>{item.labelEn}</span>
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-dharma-text leading-snug">
                  {item.tagline}
                </p>
                <p className="text-[11px] text-dharma-muted leading-relaxed line-clamp-2" title={item.description}>
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </details>

      {/* ── 2. Variants & corrections: only what is actually recorded for this text ── */}
      {(variantNote || meta.correctionHistory.length > 0) && (
        <div className="space-y-4 border-t border-dharma-border pt-4 text-xs">
          <h3 className="flex items-center gap-1.5 text-xs font-bold text-saffron-700 dark:text-saffron-300">
            <History className="w-3.5 h-3.5" aria-hidden="true" />
            <span lang="hi" className="font-devanagari">पाठ-भेद एवं संशोधन</span>
            <span aria-hidden="true">·</span>
            <span>Variants & corrections</span>
          </h3>
          {variantNote && (
            <div className="p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
              <span className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700" aria-hidden="true" />
                पाठ-भेद टिप्पणी (Alternative Reading / Variant Notes):
              </span>
              <p className="text-dharma-text leading-relaxed mt-0.5">{variantNote}</p>
            </div>
          )}
          {meta.correctionHistory.map((entry: SourceCorrectionEntry, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-xl border border-dharma-border/60 bg-dharma-panel-muted/40 flex items-start justify-between gap-3"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-stone-200 dark:bg-stone-800 text-[10px] font-bold">
                    {entry.version}
                  </span>
                  <span className="text-dharma-muted text-[11px]">{entry.date}</span>
                </div>
                <p className="text-dharma-text font-devanagari">{entry.noteHi}</p>
                <p className="text-dharma-muted text-[11px]">{entry.note}</p>
              </div>
              <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" aria-hidden="true" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
