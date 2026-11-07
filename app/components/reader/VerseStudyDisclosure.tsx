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
  /** Load the verse page's full study as soon as the panel is open (the reader asked for this verse). */
  loadFullStudy?: boolean;
  children: (depth: StudyDepth) => ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen ?? (depth !== 'read'));
  // The full study is a fetch of the verse page, so it loads when the reader opens this panel or asks for it,
  // never for every panel a reading depth opens by default as the chapter scrolls by.
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
    <div className="mt-4">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (!open) setFullStudy(true);
          setOpen((value) => !value);
        }}
        className="flex min-h-11 items-center gap-1.5 rounded-full px-2 py-2 text-left text-xs font-medium text-dharma-muted transition-colors hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500"
      >
        <span id={titleId}>
          <span lang="hi" className="font-devanagari">व्याख्या एवं संदर्भ</span>{' '}
          <span lang="en">· Verse study</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-dharma-muted transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>

      {open && (
        <div id={panelId} role="region" aria-labelledby={titleId} className="verse-study-panel liquid-reveal pt-3">
          {children(studyDepth)}
          {versePageHref && fullStudy && <VersePageExtras href={versePageHref} />}
          {/* One "more" control under the explanation: it adds the word meanings and notes (study depth)
              and the verse page's own study, here in the chapter. */}
          {((versePageHref && !fullStudy) || (canDeepen && studyDepth === 'understand')) && (
            <div className="mt-5 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setStudyDepth('study');
                  setFullStudy(true);
                }}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-dharma-border/70 px-3.5 py-2 text-xs font-semibold text-saffron-800 transition-colors hover:bg-dharma-card-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 dark:text-saffron-300"
              >
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                <span><span lang="hi" className="font-devanagari">पूर्ण अध्ययन यहीं देखें</span> · <span lang="en">Show the full study here</span></span>
              </button>
            </div>
          )}

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
