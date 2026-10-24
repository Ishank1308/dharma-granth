import type { CSSProperties } from 'react';
import type { ScriptureCategory } from '@/data/types';

type VerseGraphicStyle = CSSProperties & {
  '--verse-bg-image': string;
  '--verse-bg-x': string;
  '--verse-bg-y': string;
};

function numericVerseSeed(verseId: number | string): number {
  if (typeof verseId === 'number') return verseId;

  return verseId
    .split('')
    .reduce((total, character) => total + character.charCodeAt(0), 0);
}

export function getVerseGraphicStyle({
  category,
  verseId,
}: {
  category: ScriptureCategory;
  verseId: number | string;
}): VerseGraphicStyle {
  const seed = numericVerseSeed(verseId);
  const isFirstVerse = String(verseId) === '1';

  return {
    // For verse 1 (initial mobile viewport), avoid raster image candidate so LCP uses the preloaded Sanskrit text (~400ms)
    '--verse-bg-image': isFirstVerse ? 'none' : `url('/verse-bg/${category}.webp')`,
    '--verse-bg-x': `${20 + ((seed * 17) % 60)}%`,
    '--verse-bg-y': `${15 + ((seed * 29) % 70)}%`,
  };
}

export function getVerseGraphicClass(category: ScriptureCategory): string {
  return `verse-graphic-card verse-graphic-${category}`;
}
