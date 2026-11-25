'use client';

import { useEffect } from 'react';

const KEYS = [
  ['← / → · j / k', 'Prev / Next'],
  ['[ / ]', 'Pada Jump'],
  ['S', '4-Step Studio'],
  ['W', 'Word Lens'],
  ['I', 'IAST Toggle'],
  ['N', 'Study Note'],
  ['B', 'Save Verse'],
  ['F', 'Focus Mode'],
  ['? / Esc', 'Toggle / Close'],
] as const;

export function ReaderShortcutsPanel({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      event.preventDefault();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      id="reader-shortcuts-panel"
      role="region"
      aria-label="कुंजीपटल संकेत · Reader keyboard shortcuts"
      className="mt-3 rounded-2xl border border-amber-700/25 bg-amber-50/55 dark:border-amber-500/25 dark:bg-amber-950/25 p-3 text-xs"
    >
      <div className="mb-2 flex items-center justify-between gap-2 font-semibold text-dharma-text">
        <span className="min-w-0">
          <span lang="hi" data-bi="hi" className="font-devanagari">कुंजीपटल स्वाध्याय संकेत</span>
          <span data-bi="sep" aria-hidden="true"> · </span>
          <span data-bi="en">Keyboard Study Lenses</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="कुंजीपटल संकेत बंद करें · Close keyboard shortcuts"
          className="focus-ring inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl px-3 text-[11px] font-semibold text-dharma-muted hover:bg-amber-100/70 dark:hover:bg-amber-900/40 hover:text-dharma-text"
        >
          <span lang="hi" data-bi="hi" className="font-devanagari">बंद करें</span>
          <span data-bi="sep" aria-hidden="true"> · </span>
          <span data-bi="en">Close</span>
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3 text-[11px] text-dharma-muted">
        {KEYS.map(([k, label]) => (
          <span key={k} className="flex items-center gap-1.5">
            <kbd className="shrink-0 rounded border border-stone-300 dark:border-stone-700 bg-dharma-card px-1.5 py-0.5 font-mono text-dharma-text">
              {k}
            </kbd>
            <span>{label}</span>
          </span>
        ))}
      </div>
      <p className="mt-2 border-t border-amber-700/15 dark:border-amber-500/15 pt-1.5 text-[11px] text-dharma-muted">
        <span lang="hi" data-bi="hi" className="font-devanagari">हार्डवेयर कीबोर्ड हेतु · बंद करने के लिए Esc दबाएँ</span>
        <span data-bi="sep" aria-hidden="true"> · </span>
        <span data-bi="en">For hardware keyboard navigation · Press Esc to dismiss</span>
      </p>
    </div>
  );
}
