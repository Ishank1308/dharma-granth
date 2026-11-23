'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Accessible disclosure for deep philosophical commentary inside Ashtavakra Vyakhya.
 * Uses a button (`aria-expanded`) + `hidden` panel instead of a nested `<details>` so the
 * outer study-tree `<summary>` remains unambiguous, while keeping all SSR/no-JS text attached.
 */
export function DeepNoteDisclosure({ id, children }: { id: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-dharma-border/70 bg-dharma-card-soft/50">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex min-h-[48px] w-full cursor-pointer items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-left text-sm font-semibold text-dharma-text transition hover:bg-dharma-bg/60"
      >
        <span>
          <span lang="hi" data-bi="hi" className="font-devanagari">गहरी दार्शनिक व्याख्या व भ्रम-निवारण</span>
          <span data-bi="sep"> · </span>
          <span data-bi="en">Deep philosophical note</span>
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-dharma-muted transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div id={id} hidden={!open} className="space-y-4 border-t border-dharma-border/60 p-4">
        {children}
      </div>
    </div>
  );
}
