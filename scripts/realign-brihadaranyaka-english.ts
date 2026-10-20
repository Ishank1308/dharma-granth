/**
 * Re-aligns the Brihadaranyaka English with the Sanskrit, mantra by mantra, from Max Müller's translation
 * (SBE 15, 1884, public domain), the source of the book's English.
 *
 * scripts/seed-brihadaranyaka-translations.ts matched by bracket refs and a page table that was off for
 * Adhyāya 1; after the text was rebuilt from sanskritdocuments.org, much of the English sat on the wrong
 * mantras (3.2.9 carried 2.1.9) or stopped mid-passage. Here every SBE page is split at its ADHYÂYA and
 * BRÂHMANA headings; each numbered paragraph, with the unnumbered paragraphs that continue it, becomes mantra
 * A.B.n. A brāhmaṇa is written only when Müller's mantra count equals ours; the others are listed for review.
 *
 *   npx tsx scripts/realign-brihadaranyaka-english.ts                 # dry run: per-brāhmaṇa counts, changes
 *   npx tsx scripts/realign-brihadaranyaka-english.ts --write
 *   npx tsx scripts/realign-brihadaranyaka-english.ts --show 3.2.9,3.7.2
 */
import fs from 'node:fs';
import path from 'node:path';
import { stripSbeHtml } from './lib/sbe-parser';

const ROOT = process.cwd();
const FULL = path.join(ROOT, 'public/data/scriptures-full/brihadaranyaka.json');
const CACHE = path.join(ROOT, 'scripts/cache/brihadaranyaka-sbe');
const write = process.argv.includes('--write');
const ORDINALS = ['FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH', 'NINTH', 'TENTH',
  'ELEVENTH', 'TWELFTH', 'THIRTEENTH', 'FOURTEENTH', 'FIFTEENTH'];
const ordinal = (heading: string, word: string) =>
  ORDINALS.findIndex((o) => new RegExp(`\\b${o} ${word}`).test(heading)) + 1;

// A few spots in the HTML are double-encoded (&amp;Acirc;), so entities survive stripSbeHtml.
const NAMED: Record<string, string> = { amp: '&', quot: '"', nbsp: ' ', sect: '§', mdash: '—', ndash: '–' };
const decode = (s: string) =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([AaEeIiOoUu])(circ|uml|acute|grave);/g, (_, c, kind) =>
      (c + { circ: '̂', uml: '̈', acute: '́', grave: '̀' }[kind as string]).normalize('NFC'))
    .replace(/&([Nn])tilde;/g, (_, c) => (c === 'n' ? 'ñ' : 'Ñ'))
    .replace(/&(amp|quot|nbsp|sect|mdash|ndash);/g, (_, k) => NAMED[k]);

/** Misprinted paragraph numbers in the SBE HTML: "A.B:expected" → the number as printed. */
const MISPRINTS: Record<string, string> = { '3.1:3': '1' };
/** Paragraphs that open one of our mantras inside a Müller paragraph: "A.B" → opening words. */
const SPLITS: Record<string, string[]> = { '2.4': ["'For when there is as it were duality"] };

/** "A.B" → mantra number → text */
const sbe = new Map<string, Map<number, string>>();
let adhyaya = 0;
let brahmana = 0;
let mantra = 0;
let carry: string[] | null = null;
const preface = new Map<string, string[]>();
const pages = fs.readdirSync(CACHE).filter((f) => /^sbe150\d\d\.htm$/.test(f)).sort();
for (const file of pages) {
  // Footnote blocks sit between printed pages, with text continuing after them, so only the notes are removed.
  const body = /<BODY[^>]*>([\s\S]*?)(<\/BODY>|$)/i.exec(fs.readFileSync(path.join(CACHE, file), 'utf8'))?.[1] ?? '';
  // A block runs from the "Footnotes" heading to the next printed-page marker (<p><a name="page_…">), and a
  // footnote can span several plain paragraphs, so the whole block goes.
  // At a file's end the notes can also come without a heading, so single notes (<p><a name="fn_…">) go too.
  const html = body
    .replace(/<h3[^>]*>\s*Footnotes\s*<\/h3>[\s\S]*?(?=<p>\s*<a name="page_|$)/gi, '')
    .replace(/<p>\s*<a name="fn_[\s\S]*?(?=<p[\s>]|<hr|<h[123][\s>]|$)/gi, '');
  let headingOnPage = false;
  // A paragraph also ends at the next <p> or heading: page 94 leaves §10 unclosed, which swallowed §11–14.
  for (const m of html.matchAll(/<h[123][^>]*>([\s\S]*?)<\/h[123]>|<p[^>]*>([\s\S]*?)(?=<p[\s>]|<\/p>|<h[123][\s>])/gi)) {
    if (m[1] !== undefined) {
      const heading = decode(stripSbeHtml(m[1])).toUpperCase().replace(/Â/g, 'A');
      const a = ordinal(heading, 'ADHYAYA');
      const b = ordinal(heading, 'BRAHMANA');
      if (a) adhyaya = a;
      if (b) {
        brahmana = b;
        mantra = 0;
        carry = null;
        headingOnPage = true;
        sbe.set(`${adhyaya}.${brahmana}`, new Map());
      }
      continue;
    }
    const text = decode(stripSbeHtml(m[2] ?? '')).replace(/\s+/g, ' ').trim();
    if (!text || /^(p\. \d+ ?)+$/.test(text) || /sacred-texts\.com/.test(text) || !brahmana) continue;
    const mantras = sbe.get(`${adhyaya}.${brahmana}`)!;
    // "2 1." on page 54 is a typo for 21, "8.," on page 61 for 8.
    let numbered = /^(\d[\d ]*)\.,?\s+([\s\S]*)$/.exec(text);
    const ab = `${adhyaya}.${brahmana}`;
    if (numbered && MISPRINTS[`${ab}:${mantra + 1}`] === numbered[1]) numbered[1] = String(mantra + 1);
    if (!numbered && SPLITS[ab]?.some((start) => text.startsWith(start))) {
      numbered = [text, String(mantra + 1), text] as unknown as RegExpExecArray;
    }
    // Müller prints the Abhyāroha ("Lead me from the unreal to the real") unnumbered before his I.3.28; in the
    // Kāṇva text it opens mantra 28, so it is held and put in front of 28.
    if (adhyaya === 1 && brahmana === 3 && /^Next follows the Abhy/.test(text)) carry = [];
    if (carry && !numbered) {
      carry.push(text);
      continue;
    }
    if (numbered && Number(numbered[1].replace(/ /g, '')) === mantra + 1) {
      mantra += 1;
      mantras.set(mantra, [...(carry ?? []), numbered[2]].join(' ').trim());
      carry = null;
    } else if (mantra > 0) {
      mantras.set(mantra, `${mantras.get(mantra)} ${text}`);
    } else if (!headingOnPage) {
      // Page top, before any heading: continues the previous page's last mantra.
      const prev = [...sbe.values()].at(-2);
      if (prev?.size) prev.set(prev.size, `${prev.get(prev.size)} ${text}`);
    }
    // After a heading and before "1.": an invocation ("Adoration to the Highest Self"), unless the brāhmaṇa
    // has no numbered paragraphs at all (V.11), in which case it is the one mantra.
    else preface.set(ab, [...(preface.get(ab) ?? []), text]);
  }
}
for (const [ab, texts] of preface) {
  if (sbe.get(ab)?.size === 0) sbe.get(ab)!.set(1, texts.join(' '));
}
// VI.5 lineage: list item "2. Kâtyâyanîputra…" opens a paragraph and reads as mantra 2; Müller marks mantra 2
// inside the list instead ("12. Kâpîputra 2. from Âtreyîputra"), which is where the Sanskrit 6.5.1 ends.
{
  const vi5 = sbe.get('6.5');
  const joined = `${vi5?.get(1) ?? ''} ${vi5?.get(2) ?? ''}`;
  const at = joined.indexOf(' 2. from Âtreyîputra');
  if (vi5 && at > 0) {
    vi5.set(1, joined.slice(0, at).trim());
    vi5.set(2, joined.slice(at + ' 2. '.length).trim());
  }
}
// Where Müller's paragraph runs past the end of a Kāṇva mantra: the words from `at` on open the next mantra.
const MOVES: Array<{ ref: string; at: string }> = [
  { ref: '1.3.17', at: "The Devas said: 'Verily, thus far" }, // devā abruvan… opens 1.3.18
  { ref: '1.3.21', at: 'He (breath) is also Sâman' }, // eṣa u eva sāma opens 1.3.22
  { ref: '3.9.18', at: "Sâkalya said: 'Yâgñavalkya, because thou hast decried" }, // yājñavalkyeti hovāca śākalyo opens 3.9.19
];
for (const { ref, at } of MOVES) {
  const [a, b, n] = ref.split('.');
  const mantras = sbe.get(`${a}.${b}`);
  const text = mantras?.get(Number(n)) ?? '';
  const i = text.indexOf(at);
  if (!mantras || i < 0) throw new Error(`${ref}: "${at}" not found`);
  mantras.set(Number(n), text.slice(0, i).trim());
  mantras.set(Number(n) + 1, `${text.slice(i)} ${mantras.get(Number(n) + 1) ?? ''}`.trim());
}
for (const mantras of sbe.values()) {
  for (const [n, text] of mantras) {
    mantras.set(
      n,
      text
        // The sacred-texts footer ("Next: III, 1 Sacred Texts | Hinduism") follows the last paragraph of a page.
        .replace(/\s*Next: [^]*?Sacred Texts \| Hinduism.*$/, '')
        // Printed-page markers and the transcriber's note where a paragraph crosses a page.
        .replace(/\s*\[paragraph continues\]\s*/g, ' ')
        .replace(/(^|\s)p\. \d+[a-z]?(?=\s|$)/g, ' ')
        // A lone SBE footnote digit between a word (or closing bracket) and punctuation: "waking 1 .", "No, no 1 !".
        // Lineage lists are left alone: their digits follow ":" or "," ("stem : 1 . Pautimâshya", ", 21 . Kausikâyani").
        .replace(/(?<=[A-Za-zâîûêôñ)\]])\s+\d\s+(?=[.,;:!?'])/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    );
  }
}

const raw = fs.readFileSync(FULL, 'utf8');
const book = JSON.parse(raw) as { chapters: Array<{ number: number; verses: Array<{ number: string; translation?: string }> }> };
const ours = new Map<string, Array<{ number: string; translation?: string }>>();
for (const chapter of book.chapters) {
  for (const verse of chapter.verses) {
    const ab = verse.number.split('.').slice(0, 2).join('.');
    if (!ours.has(ab)) ours.set(ab, []);
    ours.get(ab)!.push(verse);
  }
}

let changed = 0;
let filled = 0;
const skipped: string[] = [];
for (const [ab, verses] of ours) {
  let mantras = sbe.get(ab) ?? new Map<number, string>();
  // One mantra in the Kāṇva text, several numbered verses in Müller (V.15): the verses together are that mantra.
  if (verses.length === 1 && mantras.size > 1) mantras = new Map([[1, [...mantras.values()].join(' ')]]);
  if (mantras.size !== verses.length) {
    skipped.push(`${ab} (ours ${verses.length}, Müller ${mantras.size})`);
    continue;
  }
  for (const verse of verses) {
    const text = mantras.get(Number(verse.number.split('.')[2]));
    if (!text) continue;
    const before = (verse.translation ?? '').trim();
    if (before === text) continue;
    if (before) changed++;
    else filled++;
    verse.translation = text;
  }
}
const show = process.argv.includes('--show') ? process.argv[process.argv.indexOf('--show') + 1] : '';
for (const ref of show ? show.split(',') : []) {
  const [a, b, n] = ref.split('.');
  console.log(`  ${ref}: ${(sbe.get(`${a}.${b}`)?.get(Number(n)) ?? '').slice(0, 220)}`);
}
console.log(`brāhmaṇas aligned: ${ours.size - skipped.length}/${ours.size}`);
if (skipped.length) console.log(`count differs, left as is: ${skipped.join('; ')}`);
console.log(`${write ? '' : 'would '}replace ${changed}, fill ${filled}`);
// "commentary" and "wordMeaning" were "Sense: " plus a copy of the previous (misaligned) English; with the
// English re-aligned they only repeat or contradict it, so they go.
let senseCopies = 0;
for (const chapter of book.chapters) {
  for (const verse of chapter.verses as Array<Record<string, unknown>>) {
    for (const field of ['commentary', 'wordMeaning']) {
      if (typeof verse[field] === 'string' && (verse[field] as string).startsWith('Sense: ')) {
        delete verse[field];
        senseCopies++;
      }
    }
  }
}
console.log(`${write ? 'removed' : 'would remove'} ${senseCopies} "Sense: " copies`);

if (write) {
  const out = JSON.stringify(book, null, 2) + '\n';
  fs.writeFileSync(FULL, raw.includes('\r\n') ? out.split('\n').join('\r\n') : out);

  // The curated mirror (data/scriptures/brihadaranyaka.ts, one JSON property per line) gets the same English
  // and loses its "Sense: " explanation copies, so a later seed run cannot bring the old text back.
  const english = new Map<string, string>();
  for (const chapter of book.chapters) for (const v of chapter.verses) english.set(v.number, v.translation ?? '');
  const CURATED = path.join(ROOT, 'data/scriptures/brihadaranyaka.ts');
  let current = '';
  const lines = fs.readFileSync(CURATED, 'utf8').split(/(?<=\n)/).flatMap((line) => {
    const num = /^\s*"number": "([\d.]+)",?\r?\n?$/.exec(line);
    if (num) current = num[1];
    // The curated Verse type requires "explanation", so it is kept empty; the other two are optional.
    const sense = /^(\s*)"(explanation|commentary|wordMeaning)": "Sense: .*",(\r?\n?)$/.exec(line);
    if (sense) return sense[2] === 'explanation' ? [`${sense[1]}"explanation": "",${sense[3]}`] : [];
    const tr = /^(\s*"translation": ).*?(,?)(\r?\n?)$/.exec(line);
    if (tr && english.has(current)) return [`${tr[1]}${JSON.stringify(english.get(current))}${tr[2]}${tr[3]}`];
    return [line];
  });
  fs.writeFileSync(CURATED, lines.join(''));
}
