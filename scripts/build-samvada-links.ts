/**
 * Samvada: cross-scripture parallel verses, built from the library's own text.
 *
 *   npx tsx scripts/build-samvada-links.ts          # writes public/data/samvada-parallels.json
 *
 * Two kinds of link, both derived from data already in the repo, nothing is invented:
 *
 *   direct_quote   Two verses in different scriptures share a long run of identical letters (for example
 *                  Gita 2.19 and Katha 1.2.19). Found by comparing normalized Devanagari letters; a pair needs at
 *                  least MIN_SHARED shared letters, covering at least MIN_COVER of the shorter verse.
 *   thematic_echo  Two verses that the reviewed "Wisdom for Life" topics (data/wisdom-for-life.ts) file under the
 *                  same topic but in different scriptures. Those verses are already checked against the library
 *                  by scripts/check-wisdom.ts.
 *
 *   (curated)      A short list of parallels that the commentarial tradition itself names, each checked against the
 *                  library at build time and skipped if either verse is missing. Marked thematic_echo.
 *
 * Output: { [verseKey]: Parallel[] } where verseKey is "<scriptureId>:<chapter>:<verse>" in library numbering.
 */
import fs from 'node:fs';
import path from 'node:path';
import { wisdomTopics } from '../data/wisdom-for-life';
import { getScriptureMeta } from '../data/scriptures';
import { libraryLocation } from '../lib/wisdom-links';

const ROOT = path.resolve(__dirname, '..');
const FULL = path.join(ROOT, 'public/data/scriptures-full');

/** Scriptures compared with each other. Large epics are left out: their length makes every pair a coincidence risk. */
const CORPUS = [
  'bhagavadgita', 'katha', 'mundaka', 'ishavasya', 'kena', 'mandukya', 'prashna', 'shvetashvatara', 'taittiriya',
  'aitareya', 'chandogya', 'brihadaranyaka', 'kaivalya', 'mahanarayana', 'maitri', 'jabala', 'muktika', 'niralamba',
  'ashtavakra', 'yogasutra',
];

const SHINGLE = 20; // letters per index key
const MIN_SHARED = 28; // shared letters needed for a direct quote
const MIN_COVER = 0.4; // share of the shorter verse that must be common
const MAX_PER_VERSE = 6;
const SNIPPET = 70;

interface Verse {
  key: string;
  scriptureId: string;
  chapter: number;
  verse: string;
  sanskrit: string;
  letters: string;
}

export interface Parallel {
  targetVerseId: string;
  scriptureName: string;
  reference: string;
  sanskritSnippet: string;
  relationshipType: 'direct_quote' | 'thematic_echo';
}

/** Echoes named in the commentarial tradition: [scripture, chapter, verse] pairs in library numbering. */
const CURATED: [[string, number, string], [string, number, string]][] = [
  [['bhagavadgita', 2, '29'], ['katha', 2, '7']], // the wondrous speaker and hearer of the Self (Katha 1.2.7)
  [['bhagavadgita', 3, '42'], ['katha', 3, '10']], // senses, mind, intellect, Self (Katha 1.3.10)
  [['bhagavadgita', 15, '1'], ['katha', 6, '1']], // the inverted tree (Katha 2.3.1)
  [['bhagavadgita', 8, '11'], ['katha', 2, '15']], // the goal all the Vedas declare (Katha 1.2.15)
];

/** Letters and marks only; candrabindu folded to anusvara, as scripts/check-wisdom.ts does. */
const letters = (s: string) =>
  (s ?? '')
    .normalize('NFC')
    .replace(/ँ/g, 'ं')
    .replace(/[^\p{L}\p{M}]/gu, '');

function loadVerses(scriptureId: string): Verse[] {
  const dir = path.join(FULL, scriptureId);
  if (!fs.existsSync(dir)) return [];
  const out: Verse[] = [];
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^ch-(\d+)\.json$/);
    if (!m) continue;
    const chapter = Number(m[1]);
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) as { chapter: { verses: { number: number | string; sanskrit?: string }[] } };
    for (const v of j.chapter.verses ?? []) {
      const sk = v.sanskrit ?? '';
      const l = letters(sk);
      if (l.length < MIN_SHARED) continue;
      out.push({ key: `${scriptureId}:${chapter}:${v.number}`, scriptureId, chapter, verse: String(v.number), sanskrit: sk, letters: l });
    }
  }
  return out;
}

/** Length of the longest common substring of a and b (dynamic programming over one rolling row). */
function longestCommon(a: string, b: string): number {
  let best = 0;
  let prev = new Uint16Array(b.length + 1);
  for (let i = 1; i <= a.length; i++) {
    const cur = new Uint16Array(b.length + 1);
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        cur[j] = prev[j - 1] + 1;
        if (cur[j] > best) best = cur[j];
      }
    }
    prev = cur;
  }
  return best;
}

function reference(v: Verse): string {
  return `${v.chapter}.${v.verse}`;
}

function snippetOf(sanskrit: string): string {
  const t = sanskrit.replace(/\s+/g, ' ').trim();
  if (t.length <= SNIPPET) return t;
  return `${t.slice(0, SNIPPET).replace(/\s+\S*$/, '')} …`;
}

/** Display references taken from the reviewed topics, where the library's chapter numbering differs from the traditional citation. */
const DISPLAY = new Map<string, string>();

function toParallel(target: Verse, type: Parallel['relationshipType']): Parallel {
  const meta = getScriptureMeta(target.scriptureId);
  return {
    targetVerseId: target.key,
    scriptureName: meta?.title ?? target.scriptureId,
    reference: DISPLAY.get(target.key) ?? `${meta?.title ?? target.scriptureId} ${reference(target)}`,
    sanskritSnippet: snippetOf(target.sanskrit),
    relationshipType: type,
  };
}

function main() {
  const verses: Verse[] = CORPUS.flatMap(loadVerses);
  const byKey = new Map(verses.map((v) => [v.key, v]));
  console.log(`corpus: ${verses.length} verses from ${new Set(verses.map((v) => v.scriptureId)).size} scriptures`);

  // 1. Direct quotes: index every SHINGLE-letter window, then compare only verses that share one.
  const index = new Map<string, number[]>();
  verses.forEach((v, i) => {
    const seen = new Set<string>();
    for (let p = 0; p + SHINGLE <= v.letters.length; p++) {
      const s = v.letters.slice(p, p + SHINGLE);
      if (seen.has(s)) continue;
      seen.add(s);
      const list = index.get(s);
      if (list) list.push(i);
      else index.set(s, [i]);
    }
  });
  const pairs = new Set<string>();
  for (const list of index.values()) {
    if (list.length < 2 || list.length > 40) continue; // refrains shared by dozens of verses are formulae, not quotations
    for (let x = 0; x < list.length; x++) {
      for (let y = x + 1; y < list.length; y++) {
        const a = verses[list[x]];
        const b = verses[list[y]];
        if (a.scriptureId === b.scriptureId) continue;
        pairs.add(list[x] < list[y] ? `${list[x]}|${list[y]}` : `${list[y]}|${list[x]}`);
      }
    }
  }
  const links = new Map<string, Parallel[]>();
  const add = (from: Verse, to: Verse, type: Parallel['relationshipType']) => {
    const list = links.get(from.key) ?? [];
    if (list.some((p) => p.targetVerseId === to.key)) return;
    list.push(toParallel(to, type));
    links.set(from.key, list);
  };
  let direct = 0;
  for (const pair of pairs) {
    const [ia, ib] = pair.split('|').map(Number);
    const a = verses[ia];
    const b = verses[ib];
    const shared = longestCommon(a.letters, b.letters);
    const cover = shared / Math.min(a.letters.length, b.letters.length);
    if (shared >= MIN_SHARED && cover >= MIN_COVER) {
      add(a, b, 'direct_quote');
      add(b, a, 'direct_quote');
      direct++;
    }
  }

  // 2. Thematic echoes: verses filed under one reviewed Wisdom for Life topic, in different scriptures.
  let thematic = 0;
  for (const topic of wisdomTopics) {
    const members: Verse[] = [];
    for (const ref of topic.verses) {
      const loc = libraryLocation(ref);
      const key = `${ref.scriptureId}:${loc.chapter}:${loc.verse}`;
      const v = byKey.get(key) ?? loadSingle(ref.scriptureId, loc.chapter, String(loc.verse));
      if (v) {
        members.push(v);
        DISPLAY.set(v.key, ref.referenceDisplay);
      }
    }
    for (const a of members) {
      for (const b of members) {
        if (a.scriptureId === b.scriptureId) continue;
        const before = links.get(a.key)?.length ?? 0;
        add(a, b, 'thematic_echo');
        if ((links.get(a.key)?.length ?? 0) > before) thematic++;
      }
    }
  }

  // 2b. Curated, tradition-named echoes (kept only when both verses exist in the library).
  for (const [x, y] of CURATED) {
    const a = byKey.get(`${x[0]}:${x[1]}:${x[2]}`) ?? loadSingle(x[0], x[1], x[2]);
    const b = byKey.get(`${y[0]}:${y[1]}:${y[2]}`) ?? loadSingle(y[0], y[1], y[2]);
    if (!a || !b) continue;
    add(a, b, 'thematic_echo');
    add(b, a, 'thematic_echo');
    thematic += 2;
  }

  // 3. Write: direct quotes first, capped per verse, keys sorted for a stable diff.
  const out: Record<string, Parallel[]> = {};
  for (const key of [...links.keys()].sort()) {
    const list = links.get(key)!;
    list.sort((p, q) => (p.relationshipType === q.relationshipType ? 0 : p.relationshipType === 'direct_quote' ? -1 : 1));
    out[key] = list.slice(0, MAX_PER_VERSE);
  }
  const dest = path.join(ROOT, 'public/data/samvada-parallels.json');
  fs.writeFileSync(dest, JSON.stringify(out));
  console.log(`direct quote pairs: ${direct}; thematic links: ${thematic}; verses with parallels: ${Object.keys(out).length}`);
  console.log(`wrote ${path.relative(ROOT, dest)} (${(fs.statSync(dest).size / 1024).toFixed(1)} KB)`);
}

/** A cited verse in a scripture outside CORPUS (for example the Ramayana): load just that verse. */
function loadSingle(scriptureId: string, chapter: number, verse: string): Verse | undefined {
  const file = path.join(FULL, scriptureId, `ch-${chapter}.json`);
  if (!fs.existsSync(file)) return undefined;
  const j = JSON.parse(fs.readFileSync(file, 'utf8')) as { chapter: { verses: { number: number | string; sanskrit?: string }[] } };
  const v = j.chapter.verses.find((x) => String(x.number) === verse);
  if (!v) return undefined;
  const sk = v.sanskrit ?? '';
  return { key: `${scriptureId}:${chapter}:${verse}`, scriptureId, chapter, verse, sanskrit: sk, letters: letters(sk) };
}

main();
