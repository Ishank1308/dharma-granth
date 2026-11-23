'use client';

import { ReaderDialog } from '@/app/components/reader/ReaderDialog';
import { REVIEW_LABEL } from '@/data/study-review';
import type { LineExplanation } from '@/data/study-content';

export function ExplainLineDialog({
  open,
  onClose,
  selected,
  lines,
  verseLabel,
  fullTranslation,
  verified,
  partial,
}: {
  open: boolean;
  onClose: () => void;
  selected: { text: string; index: number } | null;
  lines: string[];
  verseLabel: string;
  fullTranslation?: string;
  verified?: LineExplanation;
  partial: boolean;
}) {
  return (
    <ReaderDialog open={open} onClose={onClose} title="Explain this line" titleHi="इस पंक्ति को समझें" variant="side">
      {selected && (
        <div className="space-y-4 text-left text-sm text-dharma-text">
          <section aria-labelledby="el-sel">
            <h3 id="el-sel" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">
              Selected text · original scripture
            </h3>
            <p
              lang="sa"
              className="mt-1 rounded-xl border-2 border-amber-700/35 bg-amber-50/70 p-3 text-center font-devanagari text-xl font-semibold dark:bg-amber-950/25"
            >
              {selected.text}
            </p>
          </section>

          {verified ? (
            <>
              <section aria-labelledby="el-simple">
                <h3 id="el-simple" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">
                  Simple meaning · editorial
                </h3>
                {partial && (
                  <p className="mt-1 text-sm text-dharma-muted">
                    This explains the whole line that contains your selection.
                  </p>
                )}
                <p className="mt-1">{verified.simpleEn}</p>
                <p lang="hi" className="font-devanagari text-dharma-muted">
                  {verified.simpleHi}
                </p>
              </section>
              {verified.terms.length > 0 && (
                <section aria-labelledby="el-terms">
                  <h3 id="el-terms" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">
                    Important terms
                  </h3>
                  <dl className="mt-1 space-y-1">
                    {verified.terms.map((t) => (
                      <div key={t.iast}>
                        <dt>
                          <span lang="sa" className="font-devanagari font-semibold">
                            {t.word}
                          </span>{' '}
                          <span className="italic text-dharma-muted">{t.iast}</span>
                        </dt>
                        <dd className="text-dharma-muted">{t.meaning}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              )}
              <section aria-labelledby="el-ctx">
                <h3 id="el-ctx" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">
                  Context
                </h3>
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
                There is no reviewed explanation for this line yet, so none is shown. The line is still part of the
                whole verse below.
              </p>
            </section>
          )}

          <section aria-labelledby="el-whole">
            <h3 id="el-whole" className="text-sm font-bold uppercase tracking-wide text-dharma-muted">
              In the complete verse · {verseLabel}
            </h3>
            <ol lang="sa" className="mt-1 space-y-0.5 font-devanagari">
              {lines.map((l, i) => (
                <li
                  key={i}
                  className={
                    i === selected.index ? 'rounded bg-amber-100 px-1 font-semibold dark:bg-amber-900/40' : 'px-1 text-dharma-muted'
                  }
                >
                  {l}
                  {i === selected.index && <span className="sr-only"> (selected line)</span>}
                </li>
              ))}
            </ol>
            {fullTranslation && <p className="mt-2 text-dharma-muted">{fullTranslation}</p>}
          </section>

          <p className="flex flex-wrap gap-3">
            <a
              href="#layer-tradition"
              onClick={onClose}
              className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300"
            >
              Traditional commentary
            </a>
            <a
              href="#layer-sanskrit"
              onClick={onClose}
              className="font-semibold text-saffron-800 underline underline-offset-2 dark:text-saffron-300"
            >
              Back to the complete verse
            </a>
          </p>
        </div>
      )}
    </ReaderDialog>
  );
}
