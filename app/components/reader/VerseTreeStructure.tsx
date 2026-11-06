'use client';

/**
 * Knowledge tree for a verse: the shloka is the root, and its study layers
 * follow it in sacred reading order along one rail:
 *
 *   श्लोक (root, rendered by the card above)
 *     ├─ अर्थ  (open by default)
 *     ├─ व्याख्या
 *     ├─ आधुनिक संदर्भ
 *     └─ चिंतन
 *
 * Every node header stays visible so the reader can see how deep the verse
 * goes; a node's body unfolds on demand. All nodes share one level, so the
 * text never drifts right: on phones an open body takes the full width and the
 * rail resumes at the next node; from `sm` up the rail runs beside the body.
 * Colours come from the theme tokens (dharma-*, saffron/amber with dark
 * variants), so the tree follows Day, Sunset, Paper and Dark alike.
 *
 * Two body modes:
 *   - default: a folded body is unmounted (chapter cards, which are swapped in
 *     after hydration over server-rendered plain text);
 *   - `persistent`: native <details>, so every body is in the server HTML even
 *     while folded (verse pages, whose reader is the crawled render).
 */

import { useEffect, useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, type LucideIcon } from 'lucide-react';

export interface VerseTreeBranch {
  id: string;
  labelHi: string;
  labelEn: string;
  icon: LucideIcon;
  /** One short line shown on the node while it is folded. */
  hint?: string;
  defaultOpen?: boolean;
  content: ReactNode;
}

interface Props {
  branches: VerseTreeBranch[];
  /** Accessible name for the whole tree. */
  label?: string;
  /** Keep folded bodies in the DOM (native <details>) for server-rendered pages. */
  persistent?: boolean;
}

export function VerseTreeStructure({
  branches,
  label = 'श्लोक का ज्ञान-वृक्ष · Verse knowledge tree',
  persistent = false,
}: Props) {
  if (branches.length === 0) return null;
  return (
    <div className="verse-tree mt-5" role="group" aria-label={label}>
      {/* Stem from the shloka down to the first node */}
      <div aria-hidden="true" className="ml-[15px] h-4 w-0.5 rounded-full bg-amber-500/40 dark:bg-amber-400/30" />
      {branches.map((branch, i) => (
        <TreeNode key={branch.id} branch={branch} last={i === branches.length - 1} persistent={persistent} />
      ))}
    </div>
  );
}

const RAIL = 'rounded-full bg-amber-500/30 dark:bg-amber-400/25';

function TreeNode({ branch, last, persistent }: { branch: VerseTreeBranch; last: boolean; persistent: boolean }) {
  const reduce = useReducedMotion();
  const id = useId();
  const [open, setOpen] = useState(Boolean(branch.defaultOpen));
  // Follow the default when it changes (e.g. the reader switches mode or perspective).
  useEffect(() => setOpen(Boolean(branch.defaultOpen)), [branch.defaultOpen]);
  const Icon = branch.icon;
  const bodyId = `${id}-body`;

  const header = (
    <>
      <span
        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          open
            ? 'border-saffron-600 bg-saffron-600 text-white dark:border-saffron-500 dark:bg-saffron-500 dark:text-stone-950'
            : 'border-amber-500/60 bg-dharma-card text-saffron-700 group-hover/node:border-saffron-500 dark:text-saffron-300'
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span lang="hi" className="font-devanagari text-[15px] font-bold text-dharma-text">
            {branch.labelHi}
          </span>
          <span lang="en" className="text-[11px] font-semibold uppercase tracking-wider text-dharma-muted">
            {branch.labelEn}
          </span>
        </span>
        {!open && branch.hint && <span className="mt-0.5 block truncate text-xs text-dharma-muted">{branch.hint}</span>}
      </span>
      <ChevronDown
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 text-dharma-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      />
    </>
  );
  const headerCls =
    'group/node relative flex min-h-[44px] w-full items-center gap-3 rounded-2xl py-1.5 pr-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500/60';
  // Twig: short connector from the rail into the content (sm and up, where the body sits beside the rail)
  const body = (
    <div className="relative pb-4 pt-1 sm:pl-11">
      <span aria-hidden="true" className={`absolute left-[16px] top-5 hidden h-0.5 w-5 sm:block ${RAIL}`} />
      {branch.content}
    </div>
  );

  return (
    <div className="relative">
      <div className="relative">
        {/* Rail: from this node's circle down to the next node. On phones an open body
            spans the full width, so the rail stops at the header and resumes below. */}
        {(open || !last) && (
          <span
            aria-hidden="true"
            className={`absolute bottom-0 left-[15px] top-[22px] w-0.5 ${RAIL} ${open ? 'hidden sm:block' : ''}`}
          />
        )}
        {persistent ? (
          <details open={open} onToggle={(e) => setOpen(e.currentTarget.open)}>
            <summary className={`${headerCls} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>{header}</summary>
            {body}
          </details>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls={bodyId}
              className={headerCls}
            >
              {header}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="body"
                  id={bodyId}
                  role="region"
                  aria-label={`${branch.labelHi} · ${branch.labelEn}`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  {body}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
