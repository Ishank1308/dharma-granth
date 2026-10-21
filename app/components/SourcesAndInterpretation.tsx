'use client';

import { useState } from 'react';
import {
  BookOpen,
  ScrollText,
  FileCheck2,
  History,
  AlertCircle,
  Flag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Send,
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
import { triggerHaptic } from '@/lib/haptics';
import { ISSUES_REPO } from '@/lib/reader-actions';

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
  chapterId,
  verseId,
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

  // Report correction modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState<'typo' | 'numbering' | 'sandhi' | 'attribution'>('typo');
  const [reportDetails, setReportDetails] = useState('');

  const identifier = verseId
    ? `${scriptureTitle} ${chapterId ? `Ch. ${chapterId}, ` : ''}Verse ${verseId}`
    : chapterId
      ? `${scriptureTitle} — Chapter ${chapterId}`
      : scriptureTitle;

  const issueHref = `${ISSUES_REPO}/issues/new?title=${encodeURIComponent(`Text issue: ${identifier} — ${reportCategory}`)}&body=${encodeURIComponent(`**Reference:** ${identifier}\n**Type:** ${reportCategory}\n\n**What is wrong, and what should it be?**\n${reportDetails.trim() || '(please describe)'}`)}`;

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

        <button
          type="button"
          onClick={() => setReportModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-saffron-300 dark:border-saffron-800 bg-saffron-50/70 dark:bg-saffron-950/30 text-xs font-semibold text-saffron-800 dark:text-saffron-300 hover:bg-saffron-100 transition shrink-0 self-start sm:self-center"
        >
          <Flag className="w-3.5 h-3.5" />
          <span>त्रुटि रिपोर्ट करें · Report error</span>
        </button>
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

      {/* ── 3. Report Correction Accessible Modal ── */}
      {reportModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-dharma-border bg-dharma-card p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-dharma-border pb-3">
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4 text-saffron-600" />
                <h3 id="report-modal-title" className="text-base font-bold text-dharma-text font-serif">
                  पाठ्य अशुद्धि रिपोर्ट करें · Report Textual Correction
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="p-1 rounded-lg text-dharma-muted hover:text-dharma-text"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-dharma-muted">
              संदर्भ: <strong className="text-dharma-text">{identifier}</strong>
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-3.5 text-xs">
              <p className="text-dharma-muted">
                This opens a prefilled issue on GitHub. Nothing is sent until you press “Create issue” there, and this site stores nothing.
              </p>
              <div>
                <label htmlFor="correction-category-select" className="font-semibold text-dharma-text block mb-1">
                  अशुद्धि का प्रकार (Category):
                </label>
                <select
                  id="correction-category-select"
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value as typeof reportCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-dharma-border bg-dharma-panel-muted text-dharma-text font-medium outline-none focus:border-saffron-500"
                >
                  <option value="typo">वर्तनी अथवा मात्रा अशुद्धि (Spelling / Diacritic typo)</option>
                  <option value="numbering">श्लोक संख्या अथवा अध्याय क्रम (Verse numbering error)</option>
                  <option value="sandhi">संधि विच्छेद अथवा पदच्छेद त्रुटि (Sandhi / Pada-split error)</option>
                  <option value="attribution">भाष्य अथवा आचार्य संदर्भ त्रुटि (Commentary attribution error)</option>
                </select>
              </div>
              <div>
                <label htmlFor="correction-details-textarea" className="font-semibold text-dharma-text block mb-1">
                  विवरण एवं शुद्ध पाठ (Details & Suggested Correction):
                </label>
                <textarea
                  id="correction-details-textarea"
                  rows={4}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="कृपया बताएं कि कौन सा शब्द अशुद्ध है और किस प्रामाणिक संस्करण के अनुसार क्या होना चाहिए..."
                  className="w-full px-3 py-2 rounded-xl border border-dharma-border bg-dharma-panel-muted text-dharma-text font-devanagari outline-none focus:border-saffron-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-dharma-border">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-dharma-border text-dharma-muted hover:text-dharma-text"
                >
                  रद्द करें · Cancel
                </button>
                <a
                  href={issueHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setReportModalOpen(false)}
                  className="inline-flex min-h-[44px] items-center gap-1.5 px-4 py-2 rounded-xl bg-saffron-600 text-white font-bold hover:bg-saffron-700 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Open GitHub issue</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
