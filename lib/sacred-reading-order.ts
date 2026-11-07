/**
 * The single sacred reading order for every scripture surface.
 *
 * Verse, Arth, Vyakhya, Modern Context, Reflection, Related Wisdom — with zero
 * exceptions. The chapter reader (VerseCard), the verse reader (ReaderLayers),
 * and the Ashtavakra reader (VerseFull) all render this order by referencing
 * this module, so the order can never drift apart again.
 *
 * - Verse answers "what does the scripture say" (scripture is the hero).
 * - Arth answers "what does it mean, literally" (Hindi + English translation).
 * - Vyakhya answers "what does it mean, explained" (commentary, traditional
 *   bhashya, and what the verse does NOT mean).
 * - Modern Context answers "how does it appear in life today".
 * - Reflection asks one contemplation question and offers one small practice.
 * - Related Wisdom links approved editorial connections, never generated ones.
 */
export const SACRED_READING_ORDER = [
  'verse',
  'arth',
  'vyakhya',
  'modern',
  'reflection',
  'related',
] as const;

export type SacredReadingSection = (typeof SACRED_READING_ORDER)[number];

export const SACRED_SECTION_LABEL: Record<
  SacredReadingSection,
  { hi: string; en: string }
> = {
  verse: { hi: 'श्लोक', en: 'Verse' },
  arth: { hi: 'अर्थ', en: 'Arth' },
  vyakhya: { hi: 'व्याख्या', en: 'Vyakhya' },
  modern: { hi: 'आधुनिक संदर्भ', en: 'Modern Context' },
  reflection: { hi: 'चिंतन', en: 'Reflection' },
  related: { hi: 'संबंधित ज्ञान', en: 'Related Wisdom' },
};
