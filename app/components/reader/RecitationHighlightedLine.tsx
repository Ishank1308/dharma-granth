'use client';

import React from 'react';

export interface RecitationHighlightedLineProps {
  line: string;
  activeWordIndex?: number | null;
  wordIndexOffset?: number;
}

/**
 * Highlights the actively recited Sanskrit word during audio playback.
 * Preserves all sacred dandas, punctuation, and whitespace without layout shift.
 */
export function RecitationHighlightedLine({
  line,
  activeWordIndex,
  wordIndexOffset = 0,
}: RecitationHighlightedLineProps) {
  if (activeWordIndex == null) return <>{line}</>;

  // Retain tokens including whitespace and punctuation delimiters
  const tokens = line.split(/(\s+|[।॥])/);
  let wordIndex = wordIndexOffset;

  return (
    <>
      {tokens.map((token, idx) => {
        const cleanToken = token.replace(/[।॥\s]/g, '');
        const tokenWordIndex = cleanToken ? wordIndex++ : null;
        const isMatch = tokenWordIndex === activeWordIndex;

        if (isMatch) {
          return (
            <span
              key={idx}
              className="inline-block rounded-md bg-amber-500/25 px-1 py-0.5 text-amber-900 dark:text-amber-100 ring-1 ring-amber-400/70 shadow-xs transition-all duration-150 font-bold scale-[1.02]"
            >
              {token}
            </span>
          );
        }
        return <span key={idx}>{token}</span>;
      })}
    </>
  );
}

export function countRecitationWords(line: string) {
  return line
    .split(/(\s+|[।॥])/)
    .filter((token) => token.replace(/[।॥\s]/g, '').length > 0).length;
}
