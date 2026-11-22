'use client';

import { useState } from 'react';
import type { PedagogicalWordGloss } from '@/data/pedagogical-gita-2-47';
import { ReaderDialog } from '@/app/components/reader/ReaderDialog';
import { SanskritWordExplorerDrawer } from '@/app/components/understand/SanskritWordExplorerDrawer';
import { findLexiconEntry, type SanskritLexiconEntry } from '@/data/sanskrit-lexicon';

/**
 * Tap a Sanskrit word to see its meaning in this verse (spec §10). Buttons,
 * not hover. The dialog is a bottom sheet on phones and a centred panel on
 * larger screens; it overlays the page, so the verse never shifts.
 */
export function WordExplorer({ words }: { words: PedagogicalWordGloss[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [activeLexiconEntry, setActiveLexiconEntry] = useState<SanskritLexiconEntry | null>(null);

  const handleWordClick = (index: number) => {
    const word = words[index];
    const devanagariWord = word.pada.split(' (')[0].trim();
    const entry = findLexiconEntry(devanagariWord) || findLexiconEntry(word.iast);

    if (entry) {
      setActiveLexiconEntry(entry);
    } else {
      setActiveLexiconEntry(null);
      setOpen(index);
    }
  };

  const w = open === null ? null : words[open];

  return (
    <section aria-label="Important Sanskrit words" className="understand-fade rounded-2xl border border-dharma-border bg-dharma-card p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-base font-bold text-dharma-text">
            <span data-bi="en">Sanskrit Word Explorer</span> <span lang="hi" data-bi="hi" data-bi-lead className="font-devanagari text-sm font-semibold text-dharma-muted">मुख्य पद-विभाजन</span>
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-dharma-muted">Tap any word to inspect its root (dhatu), grammar, context, and philosophical nuances.</p>
        </div>
      </div>

      <ul className="mt-3 flex flex-wrap gap-2">
        {words.map((word, i) => (
          <li key={word.iast}>
            <button
              type="button"
              onClick={() => handleWordClick(i)}
              aria-haspopup="dialog"
              className="focus-ring min-h-[44px] rounded-xl border border-dharma-border bg-dharma-bg px-4 py-1.5 text-left transition hover:border-saffron-500 hover:bg-saffron-50/30 dark:hover:bg-saffron-950/20"
            >
              <span lang="sa" className="block font-devanagari text-lg leading-tight text-dharma-text">{word.pada.split(' (')[0]}</span>
              <span className="block text-xs italic text-dharma-muted">{word.iast}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* Rich Reviewed Lexicon Drawer */}
      <SanskritWordExplorerDrawer
        entry={activeLexiconEntry}
        isOpen={activeLexiconEntry !== null}
        onClose={() => setActiveLexiconEntry(null)}
      />

      {/* Fallback dialog for terms not yet having an extended encyclopedia entry */}
      <ReaderDialog open={w !== null} onClose={() => setOpen(null)} title={w?.iast ?? 'Word'} titleHi={w?.pada.split(' (')[0]} variant="modal">
        {w && (
          <dl className="space-y-4 text-[0.95rem]">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-dharma-muted">Meaning in this verse</dt>
              <dd className="mt-1 text-dharma-text">{w.functionalMeaning}</dd>
              <dd lang="hi" className="mt-1 font-devanagari text-dharma-text">{w.functionalMeaningHi}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-dharma-muted">Word and root</dt>
              <dd lang="hi" className="mt-1 font-devanagari text-dharma-text">{w.root}</dd>
            </div>
          </dl>
        )}
      </ReaderDialog>
    </section>
  );
}
