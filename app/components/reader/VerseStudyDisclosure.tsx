'use client';

import { useId, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';
import type { ReadingDepth } from '@/lib/reading-depth';
import { VersePageExtras } from '@/app/components/reader/VersePageExtras';

type StudyDepth = Exclude<ReadingDepth, 'read'>;

/** Keeps verse study in the chapter and mounts its heavier content only while open. */
export function VerseStudyDisclosure({
  depth,
  canDeepen = false,
  defaultOpen,
  versePageHref,
  loadFullStudy = false,
  children,
}: {
  depth: ReadingDepth;
  canDeepen?: boolean;
  defaultOpen?: boolean;
  versePageHref?: string;
  /** Preload additional verse-page context only when this exact verse was explicitly selected. */
  loadFullStudy?: boolean;
  children: (depth: StudyDepth) => ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? (depth !== 'read'));
  // Do not animate dozens of automatically expanded chapter panels during hydration.
  const [openedByReader, setOpenedByReader] = useState(false);
  // The extra questions/context are fetched from a standalone verse page only on explicit request.
  // Opening the local व्याख्या alone never triggers a network request for every card in the chapter.
  const [fullStudy, setFullStudy] = useState(loadFullStudy);
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
    <div className="mt-2.5 sm:mt-4">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpenedByReader(true);
          setOpen((value) => !value);
        }}
        className="flex min-h-11 w-full items-center justify-between gap-2 rounded-xl border border-dharma-border/60 bg-dharma-card-soft/50 px-3 py-2 text-left text-xs font-medium text-dharma-muted transition-colors hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
      >
        <span id={titleId}>
          <span lang="hi" className="font-devanagari">व्याख्या एवं संदर्भ</span>{' '}
          <span lang="en">· Verse study</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-dharma-muted transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={titleId} className={`verse-study-panel min-w-0 pt-2 sm:pt-3 ${openedByReader ? 'liquid-reveal' : ''}`}>
          {children(studyDepth)}
          {versePageHref && fullStudy && <VersePageExtras href={versePageHref} />}
          {/* Deliberately opt in to deeper word notes and questions from the verse page.
              The regular व्याख्या opens without fetching that separate document. */}
          {((versePageHref && !fullStudy) || (canDeepen && studyDepth === 'understand')) && (
            <div className="mt-3 sm:mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setStudyDepth('study');
                  setFullStudy(true);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dharma-border/70 px-3.5 py-2 text-xs font-semibold text-saffron-800 transition-colors hover:bg-dharma-card-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:text-saffron-300"
              >
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                <span><span lang="hi" className="font-devanagari">अधिक अध्ययन सामग्री देखें</span> · <span lang="en">Show more study details</span></span>
              </button>
            </div>
          )}

          <div className="mt-3 sm:mt-5 flex justify-center border-t border-dharma-border/50 pt-3">
            <button
              type="button"
              onClick={closeDetails}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold text-dharma-muted transition-colors hover:bg-dharma-card-soft hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
            >
              <ChevronUp className="h-4 w-4" aria-hidden="true" />
              <span><span lang="hi">व्याख्या छिपाएँ</span> · <span lang="en">Close details</span></span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
