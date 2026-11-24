'use client';

const KEYS = [
  ['← / →', 'Prev / Next'],
  ['[ / ]', 'Pada Jump'],
  ['S', '4-Step Studio'],
  ['W', 'Word Lens'],
  ['I', 'IAST Toggle'],
  ['N', 'Study Note'],
  ['B', 'Save Verse'],
  ['F', 'Focus Mode'],
] as const;

export function ReaderShortcutsPanel({ onClose }: { onClose: () => void }) {
  return (
    <div
      role="region"
      aria-label="कुंजीपटल संकेत · Reader keyboard shortcuts"
      className="mt-3 rounded-2xl border border-amber-700/25 bg-amber-50/55 dark:border-amber-500/25 dark:bg-amber-950/25 p-3 text-xs"
    >
      <div className="mb-2 flex items-center justify-between gap-2 font-semibold text-dharma-text">
        <span>
          <span lang="hi" className="font-devanagari">कुंजीपटल स्वाध्याय संकेत</span> · Keyboard Study Lenses
        </span>
        <button
          type="button"
          onClick={onClose}
          className="focus-ring rounded px-2 py-0.5 text-[11px] text-dharma-muted hover:text-dharma-text"
        >
          Close
        </button>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-4 text-[11px] text-dharma-muted">
        {KEYS.map(([k, label]) => (
          <span key={k}>
            <kbd className="rounded border border-stone-300 dark:border-stone-700 bg-dharma-card px-1.5 py-0.5 font-mono text-dharma-text">
              {k}
            </kbd>{' '}
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
