import { chapterScene } from './chapter-scenes';
import { CHAPTER_PAINTING_CODES, PAINTING_IDS } from './chapter-paintings.generated';

/**
 * A full-colour moving picture of a chapter's setting, for every adhyāya, kāṇḍa
 * and khaṇḍa that has no hand-drawn scene in lib/chapter-scenes.ts. The pictures
 * are app/styles/paintings/*.svg (scripts/build-scene-paintings.mjs); which one a
 * chapter gets is decided by scripts/build-chapter-painting-map.mjs, from
 * hand-checked choices, then from reading the chapter's own verses, then from the
 * kind of text. Pages put it on their wrapper as data-painting; colour.css paints
 * it behind the chapter's opening and each verse's Sanskrit panel.
 */
export type PaintingId = (typeof PAINTING_IDS)[number];

export function chapterPainting(scriptureId: string, chapterId: number): PaintingId | undefined {
  if (chapterScene(scriptureId, chapterId)) return undefined;
  const code = CHAPTER_PAINTING_CODES[scriptureId]?.[chapterId];
  if (!code || code === '-') return undefined;
  return PAINTING_IDS[code.charCodeAt(0) - 97];
}
