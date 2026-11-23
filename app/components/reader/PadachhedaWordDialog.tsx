'use client';

import { Search } from 'lucide-react';
import type { SanskritLexiconEntry } from '@/data/sanskrit-lexicon';
import { ReaderDialog } from '@/app/components/reader/ReaderDialog';

export function PadachhedaWordDialog({
  selectedWordGloss,
  onClose,
  onDeepInspect,
}: {
  selectedWordGloss: {
    pada: string;
    meaning: string;
    lexicon?: SanskritLexiconEntry;
  } | null;
  onClose: () => void;
  onDeepInspect: (lex: SanskritLexiconEntry) => void;
}) {
  if (!selectedWordGloss) return null;
  return (
    <ReaderDialog
      open
      onClose={onClose}
      title={selectedWordGloss.lexicon?.termIast || selectedWordGloss.pada}
      titleHi={selectedWordGloss.lexicon?.termDevanagari || selectedWordGloss.pada}
      variant="modal"
    >
      <div className="space-y-4 text-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-50/60 dark:bg-amber-950/30 p-4">
          <div>
            <span lang="sa" className="block font-devanagari text-2xl font-bold text-dharma-text">
              {selectedWordGloss.lexicon?.termDevanagari || selectedWordGloss.pada}
            </span>
            <span lang="sa-Latn" className="mt-0.5 block font-serif text-sm italic text-amber-900 dark:text-amber-200">
              {selectedWordGloss.lexicon?.termIast || selectedWordGloss.pada}
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-dharma-border bg-dharma-card p-3.5">
            <span className="text-2xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              हिन्दी अर्थ (Hindi Meaning)
            </span>
            <p lang="hi" className="mt-1 font-devanagari text-sm font-medium text-dharma-text">
              {selectedWordGloss.lexicon?.simpleHindi ||
                selectedWordGloss.lexicon?.contextualMeaningHi ||
                selectedWordGloss.meaning}
            </p>
          </div>
          <div className="rounded-xl border border-dharma-border bg-dharma-card p-3.5">
            <span className="text-2xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              English Meaning
            </span>
            <p className="mt-1 text-sm font-medium text-dharma-text">
              {selectedWordGloss.lexicon?.simpleEnglish ||
                selectedWordGloss.lexicon?.contextualMeaning ||
                selectedWordGloss.meaning}
            </p>
          </div>
        </div>

        {selectedWordGloss.lexicon ? (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3.5">
            <span className="text-2xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              मूल धातु व व्याकरण (Root & Grammar)
            </span>
            <p className="mt-1 text-xs font-semibold text-dharma-text">
              धातु: {selectedWordGloss.lexicon.rootDhatu}
            </p>
            <p className="mt-0.5 text-xs text-dharma-muted">
              {selectedWordGloss.lexicon.grammarCategory}
            </p>
            <button
              type="button"
              onClick={() => {
                const lex = selectedWordGloss.lexicon;
                onClose();
                if (lex) onDeepInspect(lex);
              }}
              className="mt-3 focus-ring inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-saffron-500/40 bg-saffron-100/80 dark:bg-saffron-900/40 px-3 py-1 text-xs font-bold text-saffron-800 dark:text-saffron-200 hover:border-saffron-600 transition"
            >
              <Search className="h-3.5 w-3.5" />
              <span>विस्तृत धातु अन्वेषण (Deep Dhatu Analysis)</span>
            </button>
          </div>
        ) : (
          <p className="text-2xs text-dharma-muted italic">
            श्लोक संदर्भ: यह पद मूल श्लोक के पदच्छेद एवं अन्वय का प्रत्यक्ष भाग है।
          </p>
        )}
      </div>
    </ReaderDialog>
  );
}
