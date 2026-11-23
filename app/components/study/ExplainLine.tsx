'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import type { LineExplanation } from '@/data/study-content';
import { useEverTrue } from '@/lib/use-ever-true';

const ExplainLineDialog = dynamic(
  () => import('./ExplainLineDialog').then((m) => m.ExplainLineDialog),
  { ssr: false },
);

const norm = (s: string) => s.replace(/[\s|।॥0-9०-९.‌‍]+/g, '');

interface Props {
  /** The verse's Sanskrit lines, in order. */
  lines: string[];
  /** Id of the element holding the Sanskrit text, so a selection inside it can be explained. */
  scopeId: string;
  verseLabel: string;
  fullTranslation?: string;
  /** This verse's reviewed line explanations, passed in from the server page. */
  entries?: LineExplanation[];
}

export function ExplainLine({ lines, scopeId, verseLabel, fullTranslation, entries }: Props) {
  const [open, setOpen] = useState(false);
  const dialogLoaded = useEverTrue(open);
  const [selected, setSelected] = useState<{ text: string; index: number } | null>(null);
  const [pending, setPending] = useState<{ text: string; index: number } | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const indexOfText = useCallback(
    (text: string) => {
      const n = norm(text);
      if (!n) return -1;
      return lines.findIndex((l) => norm(l).includes(n) || n.includes(norm(l)));
    },
    [lines],
  );

  useEffect(() => {
    const onSelect = () => {
      const sel = window.getSelection();
      const scope = document.getElementById(scopeId);
      if (!sel || sel.isCollapsed || !scope || !sel.anchorNode || !scope.contains(sel.anchorNode)) {
        setPending(null);
        return;
      }
      const text = sel.toString().trim();
      const index = indexOfText(text);
      setPending(text && index >= 0 ? { text, index } : null);
    };
    document.addEventListener('selectionchange', onSelect);
    return () => document.removeEventListener('selectionchange', onSelect);
  }, [scopeId, indexOfText]);

  const openFor = (text: string, index: number, btn: HTMLButtonElement | null) => {
    opener.current = btn;
    setSelected({ text, index });
    setOpen(true);
  };

  const lineText = selected ? lines[selected.index] ?? '' : '';
  const verified = selected ? entries?.find((e) => norm(lineText).includes(norm(e.line))) : undefined;
  const partial = Boolean(selected && norm(selected.text) !== norm(lineText));

  if (!entries?.length) return null;

  return (
    <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 border-t border-amber-700/15 pt-2.5 text-center">
      <span className="mr-1 text-xs font-medium text-dharma-muted">
        <span>Explain line</span>{' '}
        <span lang="hi" className="font-devanagari">· पंक्ति-अर्थ:</span>
      </span>
      {lines.map((l, i) => (
        <button
          key={i}
          type="button"
          onClick={(e) => openFor(l, i, e.currentTarget)}
          aria-haspopup="dialog"
          className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-border bg-dharma-card px-3 text-xs font-semibold text-dharma-text transition hover:border-saffron-400"
        >
          <MessageSquareText className="h-3.5 w-3.5 text-saffron-700" aria-hidden="true" />
          Line {i + 1}
        </button>
      ))}
      {pending && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => openFor(pending.text, pending.index, e.currentTarget)}
          aria-haspopup="dialog"
          className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-saffron-700 px-3.5 text-xs font-semibold text-white"
        >
          Explain my selection
        </button>
      )}

      {dialogLoaded && (
        <ExplainLineDialog
          open={open}
          onClose={() => {
            setOpen(false);
            opener.current?.focus();
          }}
          selected={selected}
          lines={lines}
          verseLabel={verseLabel}
          fullTranslation={fullTranslation}
          verified={verified}
          partial={partial}
        />
      )}
    </div>
  );
}
