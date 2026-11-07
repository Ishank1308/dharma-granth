'use client';

import React from 'react';

export interface RecitationHighlightedLineProps {
  line: string;
  activeWordIndex?: number | null;
  wordIndexOffset?: number;
  activeCharacterRange?: { start: number; length: number } | null;
}

/**
 * Highlights the actively recited Sanskrit word during audio playback.
 * Preserves all sacred dandas, punctuation, and whitespace without layout shift.
 */
export function RecitationHighlightedLine({
  line,
  activeWordIndex,
  wordIndexOffset = 0,
  activeCharacterRange,
}: RecitationHighlightedLineProps) {
  const tokens = line.split(/(\s+|[।॥])/);
  const wordCount = tokens.filter((token) => token.replace(/[।॥\s]/g, '').length > 0).length;
  if (activeWordIndex == null && activeCharacterRange == null) return <>{line}</>;
  if (
    activeCharacterRange == null &&
    activeWordIndex != null &&
    (activeWordIndex < wordIndexOffset || activeWordIndex >= wordIndexOffset + wordCount)
  ) {
    return <>{line}</>;
  }
  let wordIndex = wordIndexOffset;
  let charIndex = 0;

  return (
    <>
      {tokens.map((token, idx) => {
        const cleanToken = token.replace(/[।॥\s]/g, '');
        const isWord = cleanToken.length > 0;
        const tokenStart = charIndex;
        const tokenEnd = tokenStart + token.length;
        charIndex = tokenEnd;
        const isMatch = isWord && (
          (activeWordIndex != null && wordIndex === activeWordIndex) ||
          (activeCharacterRange != null &&
            tokenStart < activeCharacterRange.start + activeCharacterRange.length &&
            tokenEnd > activeCharacterRange.start)
        );
        if (isWord) wordIndex++;

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
