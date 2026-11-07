// Direct citation jump. Runs before the verse index is fetched.
// A hit is returned only when that verse is in the published library.
// Rigveda references (rv 1.164.46) open the mandala at that verse: the library numbers its verses sukta.rik.

import { chapterVerseHref, versePageHref } from '@/lib/verse-paths';
import { CITATION_SCHEMES, type CitationScheme } from '@/lib/citation-schemes';
import { CITATION_MAP, type CitationChapterEntry } from '@/lib/citation-map.generated';
import RIGVEDA_COUNTS from '@/data/rigveda-hymn-verses.json';

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
  const verses = RIGVEDA_COUNTS.mandalas[mandala - 1]?.[sukta - 1];
  if (!verses || rik < 1 || rik > verses || (mandala === 8 && sukta === 67)) return null;
  return {
    scriptureId: 'rigveda',
    title: `Rigveda ${mandala}.${sukta}.${rik}`,
    subtitle: `ऋग्वेद · मण्डल ${mandala}, सूक्त ${sukta}, ऋचा ${rik}`,
    href: chapterVerseHref('rigveda', mandala, `${sukta}.${rik}`),
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
 * Returns null when the reference is not a published verse.
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

  return schemeCitation(q);
}

/* ── Every other text in lib/citation-schemes.ts, checked against the generated verse map ── */

const ALIASES = CITATION_SCHEMES.flatMap((s) => s.aliases.map((a) => [a, s] as const)).sort((x, y) => y[0].length - x[0].length);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '\\s*');
const SCHEME_RE = new RegExp(
  `^(${ALIASES.map(([a]) => escape(a)).join('|')})\\s*(?:chapter|ch|adhyaya|अध्याय|valli|वल्ली|pada|पाद|sutra|सूत्र|mantra|मन्त्र)?\\s*` +
    `(\\d+(?:\\s*(?:[.:]|\\s|verse|v|shloka|श्लोक)\\s*\\d+){0,2})$`,
);

function labelsOf(entry: CitationChapterEntry): string[] {
  if (typeof entry === 'number') return Array.from({ length: entry }, (_, i) => String(i + 1));
  if (entry.length === 2 && typeof entry[1] === 'number') return Array.from({ length: entry[1] }, (_, i) => `${entry[0]}.${i + 1}`);
  return entry as string[];
}

function verseHit(scheme: CitationScheme, chapter: string, label: string, shown: string): DirectCitation {
  const href = versePageHref(scheme.id, Number(chapter), label) ?? `/scripture/${scheme.id}/chapter/${chapter}/#verse-${label}`;
  return {
    scriptureId: scheme.id,
    title: `${scheme.title} ${shown}`,
    subtitle: `${scheme.titleHi} · exact verse`,
    href,
    matchReason: 'Exact reference',
  };
}

function schemeCitation(q: string): DirectCitation | null {
  const m = SCHEME_RE.exec(q);
  if (!m) return null;
  const scheme = ALIASES.find(([a]) => new RegExp(`^${escape(a)}$`).test(m[1]))?.[1];
  const chapters = scheme && CITATION_MAP[scheme.id];
  if (!scheme || !chapters) return null;
  const n = m[2].split(/\s*(?:[.:]|\s|verse|v|shloka|श्लोक)\s*/).filter(Boolean).map((x) => String(Number(x)));
  const shown = n.join('.');
  const ids = Object.keys(chapters);
  const has = (chapter: string, label: string) => chapters[chapter] !== undefined && labelsOf(chapters[chapter]).includes(label);

  // 1. The whole reference is a verse label (Chandogya 6.8.7, Brahma Sutra 1.1.1).
  if (n.length >= 2) {
    const owners = ids.filter((c) => has(c, shown));
    if (owners.length === 1) return verseHit(scheme, owners[0], shown, shown);
  }
  // 2. Traditional three-part numbering folded into library chapters (Mundaka 3.1.1, Aitareya 1.2.3).
  if (n.length === 3 && scheme.groups) {
    const [a, b, v] = n.map(Number);
    if (a >= 1 && a <= scheme.groups.length && b >= 1 && b <= scheme.groups[a - 1]) {
      const chapter = String(scheme.groups.slice(0, a - 1).reduce((s, g) => s + g, 0) + b);
      if (has(chapter, String(v))) return verseHit(scheme, chapter, String(v), shown);
    }
    return null;
  }
  // 3. Taittiriya 2.4.1: anuvaka 4 of valli 2 is one library verse.
  if (n.length === 3 && scheme.subPartsInVerse && has(n[0], n[1])) return verseHit(scheme, n[0], n[1], `${n[0]}.${n[1]}`);
  // 4. Chapter and verse; the label may also carry the chapter (Prashna "2.3").
  if (n.length === 2) {
    for (const label of [n[1], `${n[0]}.${n[1]}`]) if (has(n[0], label)) return verseHit(scheme, n[0], label, shown);
    return null;
  }
  // 5. One number: a verse of a one-chapter text, or a chapter.
  if (n.length === 1) {
    if (ids.length === 1 && has(ids[0], n[0])) return verseHit(scheme, ids[0], n[0], n[0]);
    if (chapters[n[0]] !== undefined && ids.length > 1) {
      return {
        scriptureId: scheme.id,
        title: `${scheme.title}, chapter ${n[0]}`,
        subtitle: `${scheme.titleHi} · अध्याय ${n[0]}`,
        href: `/scripture/${scheme.id}/chapter/${n[0]}/`,
        matchReason: 'Exact reference',
      };
    }
  }
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
  const q = clean(raw);
  const first = q.split(/[\s.:]+/)[0] ?? '';
  return HINTS[first.replace(/\s+/g, '')] ?? ALIASES.find(([a]) => new RegExp(`^${escape(a)}(?:\\s|\\d|$)`).test(q))?.[1].id ?? null;
}
