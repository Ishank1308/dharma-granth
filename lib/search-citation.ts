// Direct citation jump. Runs before the verse index is fetched.
// A hit is returned only when that verse is in the published library.
// Rigveda 1.1.1 is not in the curated selection (mandala 1, verse 1 is a different hymn),
// so that query opens the mandala and says the rik is not in the selection.

import { versePageHref } from '@/lib/verse-paths';

export interface DirectCitation {
  scriptureId: string;
  title: string;
  subtitle: string;
  href: string;
  matchReason: string;
}

const DIGITS = '०१२३४५६७८९';

/** Verses per Bhagavad Gita chapter in this library (700, plus no invented extra). */
const GITA_VERSES = [47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78];

/** Katha library chapters are the six vallis, in traditional order. */
const KATHA_VALLI_VERSES = [29, 25, 17, 15, 15, 18];

/** Rigveda mandalas present as chapters. Counts are the curated selection, not the full Veda. */
const RIGVEDA_MANDALAS = 10;

function clean(raw: string): string {
  return raw
    .replace(/[०-९]/g, (d) => String(DIGITS.indexOf(d)))
    .toLowerCase()
    .replace(/[।॥,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function gita(chapter: number, verse: number): DirectCitation | null {
  const max = GITA_VERSES[chapter - 1];
  if (!max || verse < 1 || verse > max) return null;
  const href = versePageHref('bhagavadgita', chapter, verse);
  if (!href) return null;
  return {
    scriptureId: 'bhagavadgita',
    title: `Bhagavad Gita ${chapter}.${verse}`,
    subtitle: 'भगवद्गीता · exact verse',
    href,
    matchReason: 'Exact reference',
  };
}

function kathaTraditional(adhyaya: number, valli: number, verse: number): DirectCitation | null {
  if (adhyaya < 1 || adhyaya > 2 || valli < 1 || valli > 3) return null;
  const chapter = (adhyaya - 1) * 3 + valli;
  const max = KATHA_VALLI_VERSES[chapter - 1];
  if (!max || verse < 1 || verse > max) return null;
  const href = versePageHref('katha', chapter, verse);
  if (!href) return null;
  return {
    scriptureId: 'katha',
    title: `Katha Upanishad ${adhyaya}.${valli}.${verse}`,
    subtitle: `कठोपनिषद् · अध्याय ${adhyaya}, वल्ली ${valli}, श्लोक ${verse}`,
    href,
    matchReason: 'Exact reference',
  };
}

function kathaLibrary(chapter: number, verse: number): DirectCitation | null {
  const max = KATHA_VALLI_VERSES[chapter - 1];
  if (!max || verse < 1 || verse > max) return null;
  const href = versePageHref('katha', chapter, verse);
  if (!href) return null;
  return {
    scriptureId: 'katha',
    title: `Katha Upanishad ${chapter}.${verse}`,
    subtitle: `कठोपनिषद् · वल्ली ${chapter}, श्लोक ${verse}`,
    href,
    matchReason: 'Exact reference',
  };
}

function rigveda(mandala: number, sukta: number, rik: number): DirectCitation | null {
  if (mandala < 1 || mandala > RIGVEDA_MANDALAS || sukta < 1 || rik < 1) return null;
  return {
    scriptureId: 'rigveda',
    title: `Rigveda ${mandala}.${sukta}.${rik}`,
    subtitle: `This rik is not numbered in the library selection. Mandala ${mandala} is a short selection, not the full maṇḍala.`,
    href: `/scripture/rigveda/chapter/${mandala}`,
    matchReason: 'Exact reference',
  };
}

function ashtavakra(chapter: number, verse: number): DirectCitation | null {
  if (chapter < 1 || chapter > 20 || verse < 1) return null;
  const href = versePageHref('ashtavakra', chapter, verse);
  if (!href) return null;
  return {
    scriptureId: 'ashtavakra',
    title: `Ashtavakra Gita ${chapter}.${verse}`,
    subtitle: 'अष्टावक्रगीता · exact verse',
    href,
    matchReason: 'Exact reference',
  };
}

/**
 * `bg 2.47`, `gita 6.16`, `katha 1.3.3`, `rv 1.1.1`, `av 1.1`.
 * Returns null when the reference is not a published verse (or, for the Rigveda, not a real mandala).
 */
export function parseDirectCitation(raw: string): DirectCitation | null {
  const q = clean(raw);
  if (!q) return null;

  const gitaMatch = /^(?:bg|gita|geeta|bhagavad gita|bhagavadgita|गीता|भगवद्गीता|श्रीमद्भगवद्गीता)\s*(?:chapter|ch|adhyaya|अध्याय)?\s*(\d+)\s*(?:verse|shloka|śloka|v|श्लोक)?\s*[.: ]\s*(\d+)$/.exec(q);
  if (gitaMatch) return gita(Number(gitaMatch[1]), Number(gitaMatch[2]));

  const avMatch = /^(?:av|ashtavakra|ashtavakragita|अष्टावक्र|अष्टावक्रगीता)\s*(?:chapter|ch|adhyaya|अध्याय)?\s*(\d+)\s*(?:verse|shloka|śloka|v|श्लोक)?\s*[.: ]\s*(\d+)$/.exec(q);
  if (avMatch) return ashtavakra(Number(avMatch[1]), Number(avMatch[2]));

  const kathaThree = /^(?:katha|kathopanishad|katha upanishad|कठ|कठोपनिषद्)\s*(\d+)\s*[.:]\s*(\d+)\s*[.:]\s*(\d+)$/.exec(q);
  if (kathaThree) return kathaTraditional(Number(kathaThree[1]), Number(kathaThree[2]), Number(kathaThree[3]));

  const kathaTwo = /^(?:katha|kathopanishad|katha upanishad|कठ|कठोपनिषद्)\s*(?:chapter|ch|valli|अध्याय)?\s*(\d+)\s*(?:verse|v|श्लोक)?\s*[.: ]\s*(\d+)$/.exec(q);
  if (kathaTwo) return kathaLibrary(Number(kathaTwo[1]), Number(kathaTwo[2]));

  const rig = /^(?:rv|rigveda|rig veda|ऋग्वेद)\s*(\d+)\s*[.:]\s*(\d+)\s*[.:]\s*(\d+)$/.exec(q);
  if (rig) return rigveda(Number(rig[1]), Number(rig[2]), Number(rig[3]));

  return null;
}

const HINTS: Record<string, string> = {
  bg: 'bhagavadgita',
  gita: 'bhagavadgita',
  geeta: 'bhagavadgita',
  bhagavadgita: 'bhagavadgita',
  av: 'ashtavakra',
  ashtavakra: 'ashtavakra',
  katha: 'katha',
  kathopanishad: 'katha',
  rv: 'rigveda',
  rigveda: 'rigveda',
  rig: 'rigveda',
};

/** Scripture id a query is obviously about, used to lazy-load one shard. */
export function citationScriptureHint(raw: string): string | null {
  const direct = parseDirectCitation(raw);
  if (direct) return direct.scriptureId;
  const first = clean(raw).split(/[\s.:]+/)[0] ?? '';
  return HINTS[first.replace(/\s+/g, '')] ?? null;
}
