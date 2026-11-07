'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, X, Edit3, Check } from 'lucide-react';

interface ContributeMeaningModalProps {
  open: boolean;
  onClose: () => void;
  scriptureId: string;
  chapterId: number | string;
  verseId: number | string;
  sanskrit?: string;
  scriptureTitle?: string;
  chapterTitle?: string;
  current?: {
    explanation?: string;
    science?: string;
    lifeLesson?: string;
    hindi?: string;
    translation?: string;
  };
}

interface FormState {
  explanation: string;
  science: string;
  lifeLesson: string;
  hindi: string;
  notes: string;
}

export function ContributeMeaningModal({
  open,
  onClose,
  scriptureId,
  chapterId,
  verseId,
  sanskrit,
  scriptureTitle,
  chapterTitle,
  current,
}: ContributeMeaningModalProps) {
  const [form, setForm] = useState<FormState>({
    explanation: current?.explanation || '',
    science: current?.science || '',
    lifeLesson: current?.lifeLesson || '',
    hindi: current?.hindi || '',
    notes: '',
  });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  const ch = String(chapterId);
  const v = String(verseId);
  const fragmentKey = `${ch}:${v}`;
  const fullKey = `${scriptureId}:${ch}:${v}`;

  // Suggested file name (matches the fragments map keys)
  const suggestedFile = `${scriptureId.replace(/-/g, '')}.ts`;

  const hasAnyInput = form.explanation.trim() || form.science.trim() || form.lifeLesson.trim();

  function updateField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function buildFragmentSnippet(): string {
    const lines: string[] = [];
    lines.push(`  '${fragmentKey}': {`);
    if (form.explanation.trim()) {
      lines.push(`    explanation: \`${escapeForTemplate(form.explanation.trim())}\`,`);
    }
    if (form.science.trim()) {
      lines.push(`    science: \`${escapeForTemplate(form.science.trim())}\`,`);
    }
    if (form.lifeLesson.trim()) {
      lines.push(`    lifeLesson: \`${escapeForTemplate(form.lifeLesson.trim())}\`,`);
    }
    lines.push(`  },`);
    return lines.join('\n');
  }

  function escapeForTemplate(text: string): string {
    // Basic escaping for template literals: backticks and ${ 
    return text
      .replace(/`/g, '\\`')
      .replace(/\$\{/g, '\\${');
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // Fallback: select in a hidden textarea (rare)
      alert('Copy failed — please select and copy the text manually.');
    }
  }

  function handleCopySnippet() {
    copy(buildFragmentSnippet(), 'snippet');
  }

  function handleCopyFull() {
    const full = `// Add to data/hi-commentary/${suggestedFile}\n` +
      buildFragmentSnippet() +
      `\n\n// Full key for reference: ${fullKey}\n` +
      `// Then run the generator script.`;
    copy(full, 'full');
  }

  // Reset form when modal closes or verse changes (simple approach)
  // Parent controls open, so we can keep values while open for editing.

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} aria-hidden="true" />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Contribute meaning for ${scriptureTitle || scriptureId} ${ch}:${v}`}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 6 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-2xl rounded-2xl border border-dharma-border bg-dharma-card shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-dharma-border px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron-500/10 text-saffron-700">
                  <Edit3 className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.5px] text-saffron-700">Contribute meaning</div>
                  <div className="font-serif text-lg font-bold text-dharma-text">
                    {scriptureTitle || scriptureId} · {ch}:{v}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-dharma-muted hover:bg-dharma-bg hover:text-dharma-text"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[72vh] overflow-y-auto p-5 space-y-5">
              {/* Verse context */}
              {sanskrit && (
                <div className="rounded-xl border border-dharma-border bg-dharma-bg p-4">
                  <div className="text-[10px] uppercase text-saffron-700 mb-1">मूल संस्कृत</div>
                  <p lang="sa" className="font-devanagari text-base leading-relaxed text-dharma-text whitespace-pre-line">{sanskrit}</p>
                </div>
              )}

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="contribute-explanation" className="block text-xs font-semibold uppercase text-emerald-700 mb-1.5">व्याख्या / Explanation</label>
                  <textarea
                    id="contribute-explanation"
                    value={form.explanation}
                    onChange={(e) => updateField('explanation', e.target.value)}
                    placeholder="Provide a clear, insightful explanation (Hindi or English). Include key Sanskrit terms if helpful."
                    className="w-full min-h-[92px] resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm leading-relaxed text-dharma-text focus:border-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contribute-science" className="block text-xs font-semibold uppercase text-indigo-700 mb-1.5">आधुनिक दृष्टि / Science or modern parallel (optional)</label>
                  <textarea
                    id="contribute-science"
                    value={form.science}
                    onChange={(e) => updateField('science', e.target.value)}
                    placeholder="Connect to psychology, physics, biology, history, etc."
                    className="w-full min-h-[72px] resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm leading-relaxed text-dharma-text focus:border-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contribute-life-lesson" className="block text-xs font-semibold uppercase text-amber-700 mb-1.5">जीवन शिक्षा / Life lesson (optional)</label>
                  <textarea
                    id="contribute-life-lesson"
                    value={form.lifeLesson}
                    onChange={(e) => updateField('lifeLesson', e.target.value)}
                    placeholder="A practical takeaway someone can apply today."
                    className="w-full min-h-[72px] resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm leading-relaxed text-dharma-text focus:border-saffron-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contribute-hindi" className="block text-xs font-semibold uppercase text-rose-700 mb-1.5">हिन्दी अर्थ / Hindi translation or arth (optional)</label>
                  <textarea
                    id="contribute-hindi"
                    value={form.hindi}
                    onChange={(e) => updateField('hindi', e.target.value)}
                    placeholder="Short or detailed Hindi meaning."
                    className="w-full min-h-[60px] resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm leading-relaxed text-dharma-text focus:border-saffron-500 focus:outline-none font-devanagari"
                  />
                </div>

                <div>
                  <label htmlFor="contribute-notes" className="block text-xs font-semibold uppercase tracking-wider text-dharma-muted mb-1.5">Notes / Sources (optional)</label>
                  <textarea
                    id="contribute-notes"
                    value={form.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Any references, Gita Press page, personal insight, etc."
                    className="w-full min-h-[48px] resize-y rounded-xl border border-dharma-border bg-dharma-bg p-3 text-sm leading-relaxed text-dharma-text focus:border-saffron-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Live snippet preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-saffron-700">Ready-to-paste fragment (for hi-commentary file)</div>
                  {hasAnyInput && (
                    <button
                      onClick={handleCopySnippet}
                      className="inline-flex items-center gap-1.5 rounded-md border border-dharma-border bg-dharma-bg px-2.5 py-1 text-xs font-medium text-dharma-text hover:bg-white active:bg-saffron-50"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied === 'snippet' ? 'Copied!' : 'Copy snippet'}
                    </button>
                  )}
                </div>
                <pre className="max-h-40 overflow-auto rounded-xl border border-dharma-border bg-[#0f0c09] p-3 text-caption leading-relaxed text-emerald-300 font-mono">
{hasAnyInput ? buildFragmentSnippet() : `  '${fragmentKey}': {\n    explanation: \`...\`,\n    // science, lifeLesson optional\n  },`}
                </pre>
                <p className="mt-1 text-[10px] text-dharma-muted">Suggested file: <code className="font-mono">data/hi-commentary/{suggestedFile}</code></p>
              </div>

              {/* Instructions */}
              <div className="rounded-xl border border-dharma-border/70 bg-dharma-bg/70 p-3 text-xs text-dharma-muted leading-relaxed">
                After pasting the snippet into the commentary file, run the generator in the web project and copy the resulting <code>hi-analysis.json</code> to the mobile app. Your contribution will appear in both apps.
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex flex-col gap-2 border-t border-dharma-border bg-dharma-bg px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={onClose}
                className="rounded-xl border border-dharma-border px-4 py-2 text-sm font-medium text-dharma-text hover:bg-white"
              >
                Close
              </button>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopyFull}
                  disabled={!hasAnyInput}
                  className="inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-white px-4 py-2 text-sm font-semibold text-dharma-text hover:bg-saffron-50 disabled:opacity-50"
                >
                  <Copy className="h-4 w-4" />
                  {copied === 'full' ? 'Copied full package!' : 'Copy full package'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
