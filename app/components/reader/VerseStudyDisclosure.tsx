'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Compass, Layers } from 'lucide-react';
import type { ReadingDepth } from '@/lib/reading-depth';

type StudyDepth = Exclude<ReadingDepth, 'read'>;

/** Keeps verse study in the chapter and mounts its heavier content only while open. */
export function VerseStudyDisclosure({
  depth,
  canDeepen = false,
  defaultOpen,
  children,
}: {
  depth: ReadingDepth;
  canDeepen?: boolean;
  defaultOpen?: boolean;
  children: (depth: StudyDepth) => ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? (depth !== 'read'));
  const [studyDepth, setStudyDepth] = useState<StudyDepth>(depth === 'understand' ? 'understand' : 'study');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const titleId = useId();

  function closeDetails() {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
    // The close action can sit below a long explanation. Return to its disclosure,
    // keeping the reader beside the same verse rather than at a removed scroll offset.
    requestAnimationFrame(() => triggerRef.current?.scrollIntoView({ block: 'nearest', behavior: 'auto' }));
  }

  return (
    <div className="mt-5 border-t border-dharma-border/60 pt-3">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-dharma-text transition-colors hover:bg-dharma-card-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <Compass className="h-4 w-4 shrink-0 text-saffron-700 dark:text-saffron-300" aria-hidden="true" />
          <span id={titleId} className="text-sm font-semibold">
            <span lang="hi" className="font-devanagari">व्याख्या एवं संदर्भ</span>{' '}
            <span className="ml-1.5 text-xs font-normal text-dharma-muted" lang="en">Verse study</span>
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-dharma-muted transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={titleId} className="pt-3">
          {studyDepth === 'understand' && canDeepen && (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStudyDepth('study')}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dharma-border/70 px-3.5 py-2 text-xs font-semibold text-saffron-800 transition-colors hover:bg-dharma-card-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:text-saffron-300"
              >
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                <span><span lang="hi">विस्तृत अध्ययन</span> · <span lang="en">Show full study</span></span>
              </button>
            </div>
          )}

          {children(studyDepth)}

          <div className="mt-5 flex justify-center border-t border-dharma-border/50 pt-3">
            <button
              type="button"
              onClick={closeDetails}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-dharma-muted transition-colors hover:bg-dharma-card-soft hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            >
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
              <span><span lang="hi">विवरण समेटें</span> · <span lang="en">Close details</span></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
