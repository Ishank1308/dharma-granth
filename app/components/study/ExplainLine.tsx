'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import { ReaderDialog } from '@/app/components/reader/ReaderDialog';
import { REVIEW_LABEL, type LineExplanation } from '@/data/study-content';

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

/**
 * "Explain this line". Every line has a button (works with keyboard and touch),
 * and selecting text inside the Sanskrit also offers it. The explanation comes
 * only from reviewed data; with none, the drawer says editorial review is
 * required and keeps the line inside its verse.
 */
export function ExplainLine({ lines, scopeId, verseLabel, fullTranslation, entries }: Props) {
  const [open, setOpen] = useState(false);
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

  // Offer the action when text inside the Sanskrit layer is selected.
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

  // Only verses with reviewed line explanations get the buttons; elsewhere every
  // button would open a dialog that only says no explanation exists.
  if (!entries?.length) return null;

  return (
    <div className="mt-4 border-t border-amber-700/20 pt-3 text-center">
      <p className="text-sm font-semibold text-dharma-muted">
        Explain this line <span lang="hi" className="font-devanagari font-normal">· इस पंक्ति को सरल भाषा में समझें</span>
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {lines.map((l, i) => (
          <button
            key={i}
            type="button"
            onClick={(e) => openFor(l, i, e.currentTarget)}
            aria-haspopup="dialog"
            className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-4 text-sm font-semibold text-dharma-text transition hover:border-saffron-400"
          >
            <MessageSquareText className="h-4 w-4 text-saffron-700" aria-hidden="true" />
            Line {i + 1}
          </button>
        ))}
        {pending && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => openFor(pending.text, pending.index, e.currentTarget)}
            aria-haspopup="dialog"
            className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-saffron-700 px-4 text-sm font-semibold text-white"
          >
            Explain my selection
          </button>
        )}
      </div>

      <ReaderDialog open={open} onClose={() => { setOpen(false); opener.current?.focus(); }} title="Explain this line" titleHi="इस पंक्ति को समझें" variant="side">
        {selected && (
          <div className="space-y-4 text-left text-sm text-dharma-text">
            <section aria-labelledby="el-sel">
              <h3 id="el-sel" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">Selected text · original scripture</h3>
              <p lang="sa" className="mt-1 rounded-xl border-2 border-amber-700/35 bg-amber-50/70 p-3 text-center font-devanagari text-xl font-semibold dark:bg-amber-950/25">
                {selected.text}
              </p>
            </section>

            {verified ? (
              <>
                <section aria-labelledby="el-simple">
                  <h3 id="el-simple" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">Simple meaning · editorial</h3>
                  {partial && <p className="mt-1 text-sm text-dharma-muted">This explains the whole line that contains your selection.</p>}
                  <p className="mt-1">{verified.simpleEn}</p>
                  <p lang="hi" className="font-devanagari text-dharma-muted">{verified.simpleHi}</p>
                </section>
                {verified.terms.length > 0 && (
                  <section aria-labelledby="el-terms">
                    <h3 id="el-terms" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">Important terms</h3>
                    <dl className="mt-1 space-y-1">
                      {verified.terms.map((t) => (
                        <div key={t.iast}>
                          <dt><span lang="sa" className="font-devanagari font-semibold">{t.word}</span> <span className="italic text-dharma-muted">{t.iast}</span></dt>
                          <dd className="text-dharma-muted">{t.meaning}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}
                <section aria-labelledby="el-ctx">
                  <h3 id="el-ctx" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">Context</h3>
                  <p className="mt-1">{verified.context}</p>
                </section>
                <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm text-sky-950 dark:bg-sky-950/30 dark:text-sky-100">
                  Editorial explanation, not scripture. Status: {REVIEW_LABEL[verified.review]}.
                </p>
              </>
            ) : (
              <section role="note" className="rounded-xl border border-amber-500/40 bg-amber-50/70 p-3 dark:bg-amber-950/20">
                <p className="font-semibold">Editorial review required</p>
                <p className="mt-1 text-dharma-muted">
                  There is no reviewed explanation for this line yet, so none is shown. The line is still part of the whole verse below.
                </p>
              </section>
            )}

            <section aria-labelledby="el-whole">
              <h3 id="el-whole" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">In the complete verse · {verseLabel}</h3>
              <ol lang="sa" className="mt-1 space-y-0.5 font-devanagari">
                {lines.map((l, i) => (
                  <li key={i} className={i === selected.index ? 'rounded bg-amber-100 px-1 font-semibold dark:bg-amber-900/40' : 'px-1 text-dharma-muted'}>
                    {l}
                    {i === selected.index && <span className="sr-only"> (selected line)</span>}
                  </li>
                ))}
              </ol>
              {fullTranslation && <p className="mt-2 text-dharma-muted">{fullTranslation}</p>}
            </section>

            <p className="flex flex-wrap gap-3">
              <a href="#layer-tradition" onClick={() => setOpen(false)} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">Traditional commentary</a>
              <a href="#layer-sanskrit" onClick={() => setOpen(false)} className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300">Back to the complete verse</a>
            </p>
          </div>
        )}
      </ReaderDialog>
    </div>
  );
}
