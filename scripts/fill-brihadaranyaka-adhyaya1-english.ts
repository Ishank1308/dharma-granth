/**
 * Fills the empty English of Brihadaranyaka Adhyāya 1 from Max Müller's translation (SBE 15, 1884, public
 * domain), the source of the rest of the book's English.
 *
 * scripts/seed-brihadaranyaka-translations.ts maps Adhyāya 1 to the wrong SBE pages (I,1 to page 54; it is on
 * 53), so those mantras were never filled. Here each page is split at its BRÂHMANA headings and every numbered
 * paragraph, with the unnumbered paragraphs that continue it across a page break, becomes mantra I.b.n.
 * Only empty translations are filled, and only when Müller's count for the brāhmaṇa equals ours.
 *
 *   npx tsx scripts/fill-brihadaranyaka-adhyaya1-english.ts           # dry run
 *   npx tsx scripts/fill-brihadaranyaka-adhyaya1-english.ts --write
 */
import fs from 'node:fs';
import path from 'node:path';
import { stripSbeHtml } from './lib/sbe-parser';

const ROOT = process.cwd();
const FULL = path.join(ROOT, 'public/data/scriptures-full/brihadaranyaka.json');
const CACHE = path.join(ROOT, 'scripts/cache/brihadaranyaka-sbe');
const PAGES = [53, 54, 55, 56, 57]; // Adhyāya I, Brāhmaṇas 1–6 (2 and 3 share page 54)
const ORDINALS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH'];
const write = process.argv.includes('--write');

/** brāhmaṇa number → mantra number → text */
const sbe = new Map<number, Map<number, string>>();
let brahmana = 0;
let carry: string[] | null = null;
for (const page of PAGES) {
  let html = fs.readFileSync(path.join(CACHE, `sbe150${page}.htm`), 'utf8');
  const foot = html.search(/<H3[^>]*>\s*Footnotes\s*<\/H3>/i);
  if (foot >= 0) html = html.slice(0, foot);
  // Headings and paragraphs in document order.
  let mantra = 0;
  for (const m of html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>|<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    if (m[1] !== undefined) {
      const heading = stripSbeHtml(m[1]).toUpperCase();
      const ord = ORDINALS.findIndex((o) => heading.startsWith(`${o} BR`));
      if (ord >= 0) {
        brahmana = ord + 1;
        mantra = 0;
        sbe.set(brahmana, new Map());
      }
      continue;
    }
    const text = stripSbeHtml(m[2] ?? '');
    if (!text || /^p\. \d+( p\. \d+)*$/.test(text) || /sacred-texts\.com/.test(text) || !brahmana) continue;
    // "2 1." is a typo for 21 on page 54.
    const numbered = /^(\d[\d ]*)\.\s+([\s\S]*)$/.exec(text);
    const mantras = sbe.get(brahmana)!;
    // Müller prints the Abhyāroha ("Lead me from the unreal to the real") unnumbered before his I.3.28; in the
    // Kāṇva text it opens mantra 28, so it is held and put in front of 28.
    if (brahmana === 3 && /^Next follows the Abhy/.test(text)) carry = [];
    if (carry && !numbered) {
      carry.push(text);
      continue;
    }
    if (numbered && Number(numbered[1].replace(/ /g, '')) === mantra + 1) {
      mantra += 1;
      mantras.set(mantra, [...(carry ?? []), numbered[2].trim()].join(' ').replace(/\s+/g, ' '));
      carry = null;
    } else if (mantra > 0) {
      mantras.set(mantra, `${mantras.get(mantra)} ${text}`.replace(/\s+/g, ' ').trim());
    } else if (page !== PAGES[0] || brahmana > 1) {
      // Text before the first numbered paragraph continues the previous page's last mantra.
      const prev = sbe.get(brahmana - 1);
      if (prev?.size) prev.set(prev.size, `${prev.get(prev.size)} ${text}`);
    }
  }
}

// A few spots in the HTML are double-encoded (&amp;Acirc;), so entities survive stripSbeHtml.
const NAMED: Record<string, string> = { amp: '&', quot: '"', nbsp: ' ' };
const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([AaEeIiOoUu])(circ|uml|acute|grave);/g, (_, c, kind) =>
      (c + { circ: '̂', uml: '̈', acute: '́', grave: '̀' }[kind as string]).normalize('NFC'))
    .replace(/&(amp|quot|nbsp);/g, (_, k) => NAMED[k]);
for (const mantras of sbe.values()) for (const [n, text] of mantras) mantras.set(n, decode(text).replace(/\s+/g, ' ').trim());

const raw = fs.readFileSync(FULL, 'utf8');
const book = JSON.parse(raw) as { chapters: Array<{ number: number; verses: Array<{ number: string; translation?: string }> }> };
const ours = new Map<number, Array<{ number: string; translation?: string }>>();
for (const chapter of book.chapters) {
  for (const verse of chapter.verses) {
    const [a, b] = verse.number.split('.').map(Number);
    if (a !== 1) continue;
    if (!ours.has(b)) ours.set(b, []);
    ours.get(b)!.push(verse);
  }
}

let filled = 0;
for (const [b, verses] of ours) {
  const mantras = sbe.get(b) ?? new Map<number, string>();
  const ok = mantras.size === verses.length;
  console.log(`I.${b}: ours ${verses.length}, Müller ${mantras.size}${ok ? '' : '  ✗ count differs, skipped'}`);
  if (!ok) continue;
  for (const verse of verses) {
    const n = Number(verse.number.split('.')[2]);
    const text = mantras.get(n);
    if (!text || (verse.translation ?? '').trim()) continue;
    verse.translation = text;
    filled++;
  }
}
// --show 1.4.10,1.5.1 prints Müller's text for those mantras, to check against the Sanskrit.
const show = process.argv[process.argv.indexOf('--show') + 1];
if (process.argv.includes('--show') && show) {
  for (const ref of show.split(',')) {
    const [, b, n] = ref.split('.').map(Number);
    console.log(`  ${ref}: ${(sbe.get(b)?.get(n) ?? '').slice(0, 160)}`);
  }
}
console.log(`${write ? 'filled' : 'would fill'} ${filled} mantras`);
if (write) {
  const crlf = raw.includes('\r\n');
  const out = JSON.stringify(book, null, 2) + '\n';
  fs.writeFileSync(FULL, crlf ? out.split('\n').join('\r\n') : out);
}
