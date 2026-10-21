/**
 * Rebuild Upanishads whose published JSON drifted from the source text
 * (invented / paraphrased verses, missing verses) directly from
 * sanskritdocuments.org, carrying over translations and commentary only for
 * verses whose Sanskrit still matches the source.
 *
 *   npx tsx scripts/rebuild-upanishads.ts <id> [--write]
 *
 * Without --write it prints a dry-run report. With --write it updates
 *   - public/data/scriptures-full/<id>.json
 *   - data/hi-commentary/<id>.ts       (keys re-mapped; entries for dropped verses removed)
 *   - data/scriptures/<id>.ts          (verse blocks for dropped verses removed; ids re-mapped)
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import Sanscript from "@indic-transliteration/sanscript";
import { cleanItx, extractVerses, itxToDevanagari, splitUpanishadChapters } from "./lib/itrans-parser";
import type { FullChapter, FullVerse } from "./lib/scripture-schema";
import { canonicalVerseId } from "../lib/canonical-verse-id";

/** The key the reader uses for commentary: "<chapter>:<verse within chapter>" (see FullChapterVerses). */
const readerKey = (chapter: number | string, verse: number | string) =>
  `${chapter}:${Number(canonicalVerseId(Number(chapter), verse))}`;

const SD = "https://sanskritdocuments.org/doc_upanishhat/";

type Builder = (body: string) => FullChapter[];

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const strip = (s: string) =>
  s.replace(/[^ऀ-ॿ]/g, "").replace(/[।-९ँंऽ्॑-॔]/g, "");

/** Fraction of `a`'s 10-char shingles that occur in `b`. */
function overlap(a: string, b: string): number {
  if (a.length < 10) return a.length > 0 && b.includes(a) ? 1 : 0;
  let n = 0;
  let hit = 0;
  for (let i = 0; i + 10 <= a.length; i += 5) {
    n++;
    if (b.includes(a.slice(i, i + 10))) hit++;
  }
  return hit / n;
}

// Sanscript writes chandrabindu as "~"; IAST uses m̐ (same as scripts/regenerate-iast.ts).
const toIast = (deva: string) => Sanscript.t(deva, "devanagari", "iast").replace(/~/g, "m̐").replace(/।/g, "|");

function mkVerse(number: number | string, itx: string): FullVerse | null {
  const clean = itx
    .replace(/\([^)]*\)/g, " ") // variant-reading notes such as "(yathA.achirAt)"
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return null;
  const sanskrit = itxToDevanagari(clean);
  if (strip(sanskrit).length < 4) return null;
  return { number, sanskrit, transliteration: toIast(sanskrit) };
}

/** Drop the invocation / header lines that precede the first numbered verse. */
function dropPreamble(itx: string): string {
  let t = itx;
  const shanti = [...t.matchAll(/sh?A?ntiH\s+shA?ntiH\s+shA?ntiH\s*(?:\|\|)?/gi)];
  if (shanti.length) {
    const last = shanti[shanti.length - 1];
    t = t.slice((last.index ?? 0) + last[0].length);
  }
  return t.replace(/^\s*\S*dhyAyaH\s*\|?/i, "").replace(/^\s*(?:OM|hariH OM)\s+(?=\S)/i, (m) => m).trim();
}

/** Remove a chapter-title fragment such as "dvitIyo.adhyAyaH |" or "hariH OM ||" from the start of a verse. */
function stripHeader(itx: string): string {
  return itx
    .replace(/^\s*hariH\s+OM\s*\|*/i, "")
    .replace(/^\s*\S*dhyAyaH\s*\|*/i, "")
    .trim();
}

const flat: Builder = (body) => {
  const raw = extractVerses(body);
  const verses: FullVerse[] = [];
  raw.forEach((v, i) => {
    const itx = i === 0 ? dropPreamble(v.itx) : v.itx;
    const fv = mkVerse(v.number, itx);
    if (fv) verses.push(fv);
  });
  return [{ number: 1, title: "", verses }];
};

/** Chapters are runs of ascending verse numbers; a number that does not increase starts a new chapter. */
const byNumberReset: Builder = (body) => {
  const raw = extractVerses(body);
  const chapters: FullChapter[] = [];
  let cur: FullChapter | null = null;
  let last = Infinity;
  raw.forEach((v, i) => {
    // "... iti prathamo.adhyAyaH || 1||" is a chapter colophon, not a verse; keep any unnumbered verse before it.
    const colophon = /\s*\biti\s+\S*dhyAyaH\s*$/i.exec(v.itx);
    if (colophon) {
      const rest = v.itx.slice(0, colophon.index).trim();
      const tail = rest && cur ? mkVerse(`${last + 1}`, rest) : null;
      if (tail && cur) cur.verses.push(tail);
      return;
    }
    const num = Number(v.number);
    if (!cur || !(num > last)) {
      cur = { number: chapters.length + 1, title: "", verses: [] };
      chapters.push(cur);
    }
    last = num;
    const first = cur.verses.length === 0;
    const fv = mkVerse(v.number, i === 0 ? stripHeader(dropPreamble(v.itx)) : first ? stripHeader(v.itx) : v.itx);
    if (fv) cur.verses.push(fv);
  });
  return chapters;
};

/** Kaivalya: 24 verses in two khaNDas (1-19, 20-24); two verses lack the closing "||", and the khaNDa markers look like verses. */
const kaivalya: Builder = (body) => {
  const b = body
    .replace(/\|\|\s*prathamaH khaNDaH\s*\|\|\s*1\s*\|\|/, "")
    .replace(/dvitIyaH khaNDaH\s*\|\|\s*2\s*\|\|/, "")
    .replace(/(\|\|\s*\d+)[ \t]*(\r?\n)/g, "$1||$2");
  const verses = flat(b)[0].verses;
  return [
    { number: 1, title: "", verses: verses.filter((v) => Number(v.number) <= 19) },
    { number: 2, title: "", verses: verses.filter((v) => Number(v.number) >= 20) },
  ];
};

const byIti: Builder = (body) => {
  const chs = splitUpanishadChapters(body);
  const chapters: FullChapter[] = [];
  chs.forEach((c, ci) => {
    const verses: FullVerse[] = [];
    extractVerses(c.bodyItx).forEach((v, i) => {
      const fv = mkVerse(v.number, ci === 0 && i === 0 ? dropPreamble(v.itx) : v.itx);
      if (fv) verses.push(fv);
    });
    if (verses.length) chapters.push({ number: chapters.length + 1, title: "", verses });
  });
  return chapters;
};

/**
 * Prose Upanishads whose passages end in a double danda, optionally followed by a number (".. 12.."),
 * with chapter colophons (`footer`) between chapters. Numbered passages keep their source number; any
 * unnumbered text (leading invocation is dropped; trailing prose is kept) is chunked at sentence ends.
 */
function dotNumbered(footer: RegExp, opts: { dropInvocation?: boolean } = {}): Builder {
  return (body) => {
    const text = body
      .replace(/\\-\s*\n\s*/g, "")
      .split(/Encoded and proofread|Encoded by|Encoded NA|Please send corrections|\.\.\s*iti\s+sha~NkarAchArya/i)[0];
    const parts = text.split(new RegExp(footer.source, "gi"));
    const chapters: FullChapter[] = [];
    parts.forEach((part) => {
      let t = part;
      if (opts.dropInvocation && chapters.length === 0) {
        const s = [...t.matchAll(/sh?A?ntiH\s+shA?ntiH\s+shA?ntiH\s*\.*/gi)];
        // the opening peace-mantra invocation, if it sits near the start of the text
        if (s.length && (s[0].index ?? 0) < 900) t = t.slice((s[0].index ?? 0) + s[0][0].length);
      }
      t = t.replace(/^\s*\.?\s*(?:atha\s+)?prapAThaka\s*\d+\s*\.?/i, "");
      const verses: FullVerse[] = [];
      const marker = /\.\.\s*(\d+)\s*\.\./g;
      let from = 0;
      let last = 0;
      let m: RegExpExecArray | null;
      while ((m = marker.exec(t)) !== null) {
        const v = mkVerse(Number(m[1]), t.slice(from, m.index));
        if (v) verses.push(v);
        last = Number(m[1]);
        from = m.index + m[0].length;
      }
      passages(t.slice(from)).forEach((p, k) => {
        const v = mkVerse(last + 1 + k, p);
        if (v) verses.push(v);
      });
      const kept = verses.filter((v) => !isBoilerplate(v.transliteration ?? ""));
      // Source numbers that restart inside a chapter would collide; number such chapters sequentially instead.
      if (kept.some((v, i) => i > 0 && Number(v.number) <= Number(kept[i - 1].number))) {
        kept.forEach((v, i) => (v.number = i + 1));
      }
      if (kept.length) chapters.push({ number: chapters.length + 1, title: "", verses: kept });
    });
    return chapters;
  };
}

/** Closing colophons and stand-alone peace-mantra lines that are not part of the teaching. */
function isBoilerplate(iast: string): boolean {
  const s = iast.toLowerCase().replace(/[|\s.]/g, "");
  return /samāptā$|^(oṃ|om|ōṃ)?(śāntiḥ){1,3}$|^haṛiḥ?oṃtatsat|^hariḥoṃtatsat|^oṃāpyāyantviti/.test(s);
}

/** Chapters introduced by a header line ("prathamo.anuvAkaH |"); verses are the usual "|| N ||" ones. */
const byAnuvaka: Builder = (body) => {
  const text = body.replace(/\{\\m\+\}/g, ".N");
  const parts = text.split(/^\s*\S+\.anuvAkaH\s*\|\s*$/im).slice(1); // drop the invocation before anuvAka 1
  const chapters: FullChapter[] = [];
  for (const part of parts) {
    const raw = extractVerses(part);
    const verses: FullVerse[] = [];
    raw.forEach((v) => {
      const fv = mkVerse(v.number, v.itx);
      if (fv && !isBoilerplate(fv.transliteration ?? "")) verses.push(fv);
    });
    if (verses.some((v, i) => i > 0 && Number(v.number) <= Number(verses[i - 1].number))) {
      verses.forEach((v, i) => (v.number = i + 1)); // the source restarts numbering inside this anuvAka
    }
    if (verses.length) chapters.push({ number: chapters.length + 1, title: "", verses });
  }
  return chapters;
};

/** Split unnumbered prose at double dandas and break long passages at sentence ends. */
function passages(segment: string): string[] {
  const MIN = 220;
  const MAX = 400;
  return segment
    .split(/\s*\.\.(?=\s|$)/)
    .map((s) => s.trim())
    .filter(Boolean)
    .flatMap((p) => {
      if (p.length <= MAX) return [p];
      const chunks: string[] = [];
      let cur = "";
      for (const sentence of p.split(/\s\.(?=\s)/)) {
        cur = cur ? `${cur} . ${sentence.trim()}` : sentence.trim();
        if (cur.length >= MIN) {
          chunks.push(cur);
          cur = "";
        }
      }
      if (cur) chunks.push(cur);
      return chunks;
    });
}

/**
 * Kaushitaki: four adhyāyas, each closed by an "iti <n>o.adhyAyaH" colophon (the last colophon of one
 * adhyāya can share a block with the first verse of the next). Verse numbers are kept as printed;
 * the source has no "|| 2||" in adhyāya 2 (its second passage is numbered 3), so that number is absent.
 */
const kaushitaki: Builder = (body) => {
  const raw = extractVerses(body);
  const chapters: FullChapter[] = [];
  let cur: FullChapter | null = null;
  raw.forEach((v, i) => {
    let itx = v.itx.trim();
    const lead = /^iti\s+\S*dhyAyaH\s*\|*\s*/i.exec(itx);
    if (lead) {
      cur = null;
      itx = itx.slice(lead[0].length).trim();
    }
    if (/^(?:iti\s+)?\S*dhyAyaH$/i.test(itx) || !itx) {
      cur = null; // bare colophon block, closes the adhyāya
      return;
    }
    if (!cur) {
      cur = { number: chapters.length + 1, title: "", verses: [] };
      chapters.push(cur);
    }
    const fv = mkVerse(v.number, i === 0 ? stripHeader(dropPreamble(itx)) : itx);
    if (fv) cur.verses.push(fv);
  });
  return chapters;
};

/**
 * Shiva Samhita (sanskritdocuments.org): five paṭalas, every verse closed by "|| <paṭala>\.<verse>||", with
 * variant readings in "(...)" after a line. Numbers are the book's own (chapter.verse).
 */
const shivaSamhita: Builder = (body) => {
  const re = /\|\|\s*(\d+)[\\]?\.(\d+)\s*\|\|/g;
  const chapters: FullChapter[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    const pat = Number(m[1]);
    const num = Number(m[2]);
    // A paṭala's first verse is preceded by the previous paṭala's colophon and its own heading; drop
    // everything up to the last such line (the verse lines themselves never contain these words).
    const lines = body.slice(last, m.index).split("\n");
    let from = 0;
    lines.forEach((ln, i) => {
      if (/paTalaH|prakaraNa|iti shrI/i.test(ln)) from = i + 1;
    });
    let verseLines = lines.slice(from).filter((ln) => ln.trim());
    // A short "atha <heading> |" or "<speaker> uvAcha |" line in front of a multi-line verse is not part of it.
    while (verseLines.length >= 3 && verseLines[0].trim().split(/\s+/).length <= 3 && /^(?:atha\s|.*uvAcha)/i.test(verseLines[0].trim())) {
      verseLines = verseLines.slice(1);
    }
    const chunk = verseLines
      .join(" ")
      .replace(/\([^)]*\)/g, " ") // variant readings
      .replace(/\s+/g, " ")
      .trim();
    last = re.lastIndex;
    const fv = mkVerse(num, chunk);
    if (!fv) continue;
    let ch = chapters.find((c) => c.number === pat);
    if (!ch) {
      ch = { number: pat, title: "", verses: [] };
      chapters.push(ch);
    }
    ch.verses.push(fv);
  }
  return chapters.sort((x, y) => x.number - y.number);
};

const ROMAN: Record<string, number> = { i: 1, v: 5, x: 10 };
function roman(s: string): number {
  const r = s.toLowerCase();
  let n = 0;
  for (let i = 0; i < r.length; i++) {
    const a = ROMAN[r[i]] ?? 0;
    const b = ROMAN[r[i + 1]] ?? 0;
    n += a < b ? -a : a;
  }
  return n;
}

/**
 * Brihadaranyaka (sanskritdocuments.org bribasic.itx, Kanva recension, no accents): every mantra is tagged
 * "mantra N ##[I.ii.3]##" (adhyāya in capitals, brāhmaṇa in lower-case Roman numerals, mantra). The tag is the
 * only reference used; headings ("atha dvitIyaM brAhmaNam |", "iti ... adhyAyaH ||") and other ##...## notes are
 * removed from the mantra text. Chapters are brāhmaṇas, numbered in reading order; verses are "A.B.M".
 */
const brihadaranyaka: Builder = (body) => {
  // Tolerates the source's malformed tags: "[I.v.5.]", "[.I.v.8]", "[##III.ii.12]##", and V.xii.1, which has no
  // "mantra 1" before its tag.
  const tag = /(?:mantra\s*\d+\s*)?(?:##)?\s*\[\s*(?:##)?\s*\.?\s*([IVXivx]+)\.([IVXivx]+)\.(\d+)\s*\.?\s*(?:##)?\s*\]\s*(?:##)?/g;
  const marks = [...body.matchAll(tag)];
  const chapters: FullChapter[] = [];
  const seen = new Set<string>();
  let curA = 0;
  let curB = 0;
  marks.forEach((m, i) => {
    let a = roman(m[1]);
    let b = roman(m[2]);
    const n = Number(m[3]);
    // A new brāhmaṇa starts at mantra 1. A tag that jumps to another section mid-sequence is a typo in the
    // source (e.g. III.ii.9 is printed "[II.ii.9]"): keep the running section and report it.
    if ((a !== curA || b !== curB) && n !== 1 && curA) {
      console.warn(`  source tag typo: "${m[0].replace(/\s+/g, " ").trim()}" read as ${curA}.${curB}.${n}`);
      a = curA;
      b = curB;
    }
    curA = a;
    curB = b;
    const end = i + 1 < marks.length ? marks[i + 1].index ?? body.length : body.length;
    let itx = body.slice((m.index ?? 0) + m[0].length, end);
    // Section colophons ("iti madhukANDam") end a mantra's slice. Only the last mantra runs into the closing
    // peace invocation; V.i.1 itself begins "OM pUrNamadaH", so that cut must not apply anywhere else.
    itx = itx.split(/iti\s+bR\^?ihadAraNyakopaniShat|iti\s+\S+\s+kANDaH?/i)[0];
    if (i === marks.length - 1) itx = itx.split(/iti\s+vAjasaneyake|OM\s+pUrNamadaH|Encoded and proofread/i)[0];
    const ordinal =
      "(?:prathamaM|dvitIyaM|tR\\^?itIyaM|ch?aturthaM|pa~nchamaM|paj~nchamaM|ShaShThaM|saptamaM|aShTamaM|athAShTamaM|navamaM|dashamaM|ekAdashaM|dvAdashaM|trayodashaM|ch?aturdashaM|pa~nchadashaM)";
    itx = itx
      .replace(/\{\\m\+\}/g, ".N") // source chandrabindu marker -> ITRANS chandrabindu
      .replace(/##[^#]*##/g, " ") // untransliterated notes, e.g. ##[ ... ]##
      // A stray "mantra N" glued to the end of a mantra (I.iv.10 ends "vidyurmantra 11"): drop it and restore the visarga.
      .replace(/(\S)r?mantra\s*\d+\s*$/, (m, ch: string) => (/rmantra/.test(m) ? `${ch}H` : ch))
      // Brāhmaṇa headings and colophons: "atha dvitIyaM brAhmaNam |", "ityaShTamaM brAhmaNam ||", "ekAdashaM brAhmaNam |".
      // Only with an ordinal, so an ordinary accusative "brAhmaNam" (a Brahmin) inside a mantra is never touched.
      .replace(new RegExp(`(?:atha\\s+|iti\\s*|ity)?${ordinal}\\s+brAh\\w*Nam\\s*\\|*`, "gi"), " ")
      .replace(/(?:atha|iti)\s+\S*?\.?a?dhyAyaH\s*\|*/gi, " ")
      .replace(/\|\|\s*\d+\s*\|\|/g, "||")
      .trim();
    const key = `${a}.${b}.${n}`;
    if (seen.has(key)) throw new Error(`duplicate mantra reference ${key}`);
    seen.add(key);
    const fv = mkVerse(key, itx);
    if (!fv) return;
    // Zero-width joiners from the source's conjunct hints are invisible formatting, not text.
    fv.sanskrit = (fv.sanskrit ?? "").replace(/[‌‍]/g, "");
    fv.transliteration = toIast(fv.sanskrit);
    let ch = chapters[chapters.length - 1];
    if (!ch || ch.title !== `Adhyāya ${a} · Brāhmaṇa ${b}`) {
      ch = { number: chapters.length + 1, title: `Adhyāya ${a} · Brāhmaṇa ${b}`, verses: [] };
      chapters.push(ch);
    }
    ch.verses.push(fv);
  });
  return chapters;
};

interface Target {
  /** Builder sets its own chapter titles; do not replace them with "<chapterUnit> N". */
  keepTitles?: boolean;
  /** The curated data/scriptures/<id>.ts mirrors every chapter and verse; regenerate it from the rebuilt JSON. */
  curatedMirrors?: boolean;
  /** Reads a source reference left inside an old record's text, as the new verse number, for exact carry-over. */
  refOf?: (sanskrit: string) => string | null;
  files: string[];
  /** Proofread local source (data/sources-local/<id>.json): { note, chapters: [{ number, title, verses: [{ number, sanskrit }] }] }. */
  local?: boolean;
  build: Builder;
  chapterUnit: string;
}

const TARGETS: Record<string, Target> = {
  kaivalya: { files: ["kaivalya.itx"], build: kaivalya, chapterUnit: "Khaṇḍa" },
  jabala: { files: ["jabala.itx"], build: flat, chapterUnit: "" },
  mahanarayana: { files: ["mahAnArAyaNa.itx", "mahanarayana.itx"], build: byAnuvaka, chapterUnit: "Anuvāka" },
  // Not an Upanishad, but the same ".. N .." numbered-passage format; the original seeder missed the
  // markers and kept only the first 580 lines (187 of 581 ślokas, each split into fragments).
  vivekchudamani: {
    files: ["https://sanskritdocuments.org/doc_z_misc_shankara/viveknew.itx"],
    build: (body) => dotNumbered(/(?!)/)(body.replace(/##\s*var\s*##[^\n]*/g, " ")),
    chapterUnit: "",
  },
  niralamba: { files: ["nirAlamba.itx", "niralamba.itx"], build: dotNumbered(/(?!)/, { dropInvocation: true }), chapterUnit: "" },
  maitri: { files: ["maitrI.itx", "maitri.itx"], build: dotNumbered(/(?:iti\s+)?(?:\S+\s+)?prapAThakaH\s*\.\.|\.?\s*atha\s+prapAThaka\s*\d+\s*\./, { dropInvocation: true }), chapterUnit: "Prapāṭhaka" },
  muktika: { files: ["muktikA.itx", "muktika.itx"], build: dotNumbered(/iti\s+\S*dhyAyaH\s*\.\.\s*\d+\s*\.\.|iti\s+muktikopaniShatsamAptA\s*\.\./, { dropInvocation: true }), chapterUnit: "Adhyāya" },
  shvetashvatara: { files: ["shveta.itx"], build: byNumberReset, chapterUnit: "Adhyāya" },
  tejobindu: { files: ["tejobindu.itx"], build: byNumberReset, chapterUnit: "Part" },
  naradabhaktisutra: { files: [], local: true, build: () => [], chapterUnit: "" },
  harivanshpuran: { files: [], local: true, build: () => [], chapterUnit: "" },
  bhagavatapurana: { files: [], local: true, build: () => [], chapterUnit: "" },
  devibhagavat: { files: [], local: true, build: () => [], chapterUnit: "" },
  yogarasayanam: { files: [], local: true, build: () => [], chapterUnit: "" },
  vinayapatrika: { files: [], local: true, build: () => [], chapterUnit: "" },
  taittiriya: { files: [], local: true, build: () => [], chapterUnit: "" },
  shivasamhita: { files: ["https://sanskritdocuments.org/doc_shiva/shivasaMhitA.itx"], build: shivaSamhita, chapterUnit: "Paṭala" },
  shivaswarodaya: { files: [], local: true, build: () => [], chapterUnit: "" },
  shandilyabhaktisutra: { files: [], local: true, build: () => [], chapterUnit: "" },
  kaushitaki: { files: ["kaushhiitaki.itx"], build: kaushitaki, chapterUnit: "Adhyāya" },
  // The file name in the old source record (brihadaaraNyaka.itx) no longer exists on the site.
  brihadaranyaka: {
    files: ["bribasic.itx"],
    build: brihadaranyaka,
    chapterUnit: "",
    keepTitles: true,
    curatedMirrors: true,
    // Old records still contain their "[II.v.1]" tag; use the first one as the exact reference.
    refOf: (s) => {
      const m = /\[\s*\.?([IVXivx]+)\.([IVXivx]+)\.(\d+)/.exec(s);
      return m ? `${roman(m[1])}.${roman(m[2])}.${Number(m[3])}` : null;
    },
  },
};

// ---------------------------------------------------------------------------
// annotation carry-over
// ---------------------------------------------------------------------------

const META_KEYS = new Set(["number", "sanskrit", "transliteration"]);

interface Mapping {
  oldKey: string; // "c:v"
  newKey: string;
  /** The same two verses in the key format the commentary files use (readerKey). */
  readerOld: string;
  readerNew: string;
  score: number;
}

function carryOver(oldCh: FullChapter[], newCh: FullChapter[], refOf?: (sanskrit: string) => string | null) {
  const olds = oldCh.flatMap((c) => c.verses.map((v) => ({ c: c.number, v, fp: strip(v.sanskrit ?? "") })));
  const used = new Set<number>();
  const maps: Mapping[] = [];
  const done = new Set<FullVerse>();
  const take = (i: number, c: FullChapter, v: FullVerse, score: number) => {
    used.add(i);
    done.add(v);
    const o = olds[i];
    for (const [k, val] of Object.entries(o.v)) {
      if (!META_KEYS.has(k) && val !== undefined && val !== "") (v as unknown as Record<string, unknown>)[k] = val;
    }
    maps.push({
      oldKey: `${o.c}:${o.v.number}`,
      newKey: `${c.number}:${v.number}`,
      readerOld: readerKey(o.c, o.v.number),
      readerNew: readerKey(c.number, v.number),
      score,
    });
  };
  // First pass: old records that still carry their own source reference (e.g. "[II.v.1]") map to that verse
  // directly, provided the texts still largely agree.
  if (refOf) {
    const byNumber = new Map(newCh.flatMap((c) => c.verses.map((v) => [String(v.number), { c, v }] as const)));
    olds.forEach((o, i) => {
      const ref = refOf(o.v.sanskrit ?? "");
      const hit = ref ? byNumber.get(ref) : undefined;
      if (!hit || done.has(hit.v)) return;
      const nf = strip(hit.v.sanskrit ?? "");
      const s = Math.max(overlap(o.fp, nf), overlap(nf, o.fp));
      if (s >= 0.5) take(i, hit.c, hit.v, s);
    });
  }
  for (const c of newCh) {
    for (const v of c.verses) {
      if (done.has(v)) continue;
      const nf = strip(v.sanskrit ?? "");
      let best = -1;
      let bestScore = 0;
      let second = 0;
      olds.forEach((o, i) => {
        if (used.has(i) || !o.fp) return;
        const s = Math.max(overlap(o.fp, nf), overlap(nf, o.fp) * 0.95);
        // prefer the same slot on ties
        const slot = o.c === c.number && String(o.v.number) === String(v.number) ? 0.01 : 0;
        if (s + slot > bestScore) {
          second = bestScore;
          bestScore = s + slot;
          best = i;
        } else if (s + slot > second) second = s + slot;
      });
      // A weaker match (0.6 to 0.75) is accepted only when it clearly beats every other candidate; near-ties are not guessed.
      const strong = bestScore >= 0.75 || (bestScore >= 0.6 && bestScore - second >= 0.15);
      // An annotation written for a short fragment must not be attached to a much longer verse that merely contains it.
      if (best >= 0 && strong && olds[best].fp.length >= nf.length * 0.5) take(best, c, v, bestScore);
    }
  }
  const dropped = olds.filter((_, i) => !used.has(i)).map((o) => `${o.c}:${o.v.number}`);
  const droppedReader = olds.filter((_, i) => !used.has(i)).map((o) => readerKey(o.c, o.v.number));
  return { maps, dropped, droppedReader };
}

// ---------------------------------------------------------------------------
// curated / commentary rewriting
// ---------------------------------------------------------------------------

function rewriteHi(id: string, maps: Mapping[], dropped: string[]): { kept: number; removed: number } {
  const p = `data/hi-commentary/${id}.ts`;
  if (!fs.existsSync(p)) return { kept: 0, removed: 0 };
  const t = fs.readFileSync(p, "utf8");
  const nl = t.includes("\r\n") ? "\r\n" : "\n";
  const L = t.split(/\r?\n/);
  // Commentary files are keyed the way the reader looks them up (readerKey), not by the raw verse number.
  const remap = new Map(maps.map((m) => [m.readerOld, m.readerNew]));
  const drop = new Set(dropped);
  const out: string[] = [];
  let kept = 0;
  let removed = 0;
  for (let i = 0; i < L.length; i++) {
    const m = /^  '([^']+)':\s*\{$/.exec(L[i]);
    if (m) {
      let k = i + 1;
      while (k < L.length && !/^  \},?$/.test(L[k])) k++;
      if (k >= L.length) throw new Error(`unterminated block at ${p}:${i + 1}`);
      if (drop.has(m[1]) || !remap.has(m[1])) {
        removed++;
      } else {
        kept++;
        out.push(`  '${remap.get(m[1])}': {`, ...L.slice(i + 1, k + 1));
      }
      i = k;
      continue;
    }
    out.push(L[i]);
  }
  fs.writeFileSync(p, out.join(nl));
  return { kept, removed };
}

/** data/hi-commentary/<id>-rest.json is keyed "c:v" like the .ts fragment; remap it the same way and drop the rest. */
function rewriteRest(id: string, maps: Mapping[]): { kept: number; removed: number } {
  const p = `data/hi-commentary/${id}-rest.json`;
  if (!fs.existsSync(p)) return { kept: 0, removed: 0 };
  const raw = fs.readFileSync(p, "utf8");
  const data = JSON.parse(raw) as Record<string, unknown>;
  const remap = new Map(maps.map((m) => [m.readerOld, m.readerNew]));
  const out: Record<string, unknown> = {};
  let kept = 0;
  let removed = 0;
  for (const [k, v] of Object.entries(data)) {
    const nk = remap.get(k);
    if (nk) {
      out[nk] = v;
      kept++;
    } else removed++;
  }
  const crlf = raw.includes("\r\n");
  const s = JSON.stringify(out, null, raw.startsWith("{\n") || raw.startsWith("{\r\n") ? 2 : undefined);
  fs.writeFileSync(p, crlf ? s.replace(/\n/g, "\r\n") : s);
  return { kept, removed };
}

const DEV_DIGITS = "०१२३४५६७८९";
const toDev = (n: number) => String(n).replace(/\d/g, (d) => DEV_DIGITS[Number(d)]);

/**
 * For a curated module that mirrors the whole text (every chapter and verse), rebuild its chapter list from the
 * rebuilt JSON. A chapter keeps its authored title and summary only when the title names the same
 * "Adhyāya A · Brāhmaṇa B" as the rebuilt chapter; verses (and their carried annotations) come from the JSON.
 */
async function regenerateCurated(id: string, chapters: FullChapter[]): Promise<{ chapters: number; keptTitles: number }> {
  const p = `data/scriptures/${id}.ts`;
  const t = fs.readFileSync(p, "utf8");
  const nl = t.includes("\r\n") ? "\r\n" : "\n";
  const mod = await import(pathToFileURL(path.resolve(p)).href);
  const cur = (mod[id] ?? Object.values(mod)[0]) as { chapters: { id: number; title?: string; titleSanskrit?: string; summary?: string }[] };
  let keptTitles = 0;
  const out = chapters.map((c) => {
    const m = /^Adhyāya (\d+) · Brāhmaṇa (\d+)/.exec(c.title ?? "");
    const old = cur.chapters.find((x) => x.id === c.number);
    const same = m && old?.title?.startsWith(`Adhyāya ${m[1]} · Brāhmaṇa ${m[2]}`);
    if (same) keptTitles++;
    return {
      id: c.number,
      title: same ? old!.title : c.title,
      titleSanskrit: m ? `अध्याय ${toDev(Number(m[1]))} · ब्राह्मण ${toDev(Number(m[2]))}` : old?.titleSanskrit ?? "",
      summary: same && old?.summary ? old.summary : m ? `Brāhmaṇa ${m[2]} of Adhyāya ${m[1]} of the Brihadaranyaka Upanishad.` : "",
      // Only the fields of the curated Verse type. Verses new to the text have no meaning yet; the type requires
      // translation and explanation, so they stay empty. The JSON keeps its exposition under "commentary".
      verses: c.verses.map((v, i) => {
        const x = v as unknown as Record<string, unknown>;
        const out: Record<string, unknown> = {
          id: i + 1,
          number: v.number,
          sanskrit: v.sanskrit,
          transliteration: v.transliteration,
          translation: (x.translation as string) ?? "",
          explanation: ((x.explanation ?? x.commentary) as string) ?? "",
        };
        for (const k of ["hindi", "science", "lifeLesson", "keywords"]) if (x[k] !== undefined) out[k] = x[k];
        return out;
      }),
    };
  });
  const total = out.reduce((a, c) => a + c.verses.length, 0);
  const start = t.indexOf("  chapters: [");
  if (start < 0) throw new Error(`${p}: no "chapters: [" line`);
  const head = t.slice(0, start).replace(/totalVerses:\s*\d+/, `totalVerses: ${total}`);
  const body = `  chapters: ${JSON.stringify(out, null, 2).replace(/\n/g, "\n  ")}\n};\n`;
  fs.writeFileSync(p, (head + body).replace(/\r?\n/g, nl));
  return { chapters: out.length, keptTitles };
}

function rewriteCurated(id: string, maps: Mapping[]): { kept: number; removed: number; moved: number } {
  const p = `data/scriptures/${id}.ts`;
  if (!fs.existsSync(p)) return { kept: 0, removed: 0, moved: 0 };
  const t = fs.readFileSync(p, "utf8");
  const nl = t.includes("\r\n") ? "\r\n" : "\n";
  const L = t.split(/\r?\n/);
  const remap = new Map(maps.map((m) => [m.oldKey, m.newKey]));
  const out: string[] = [];
  let chap = "";
  let kept = 0;
  let removed = 0;
  let moved = 0;
  for (let i = 0; i < L.length; i++) {
    const cm = /^      id: (\d+),$/.exec(L[i]);
    if (cm) chap = cm[1];
    const idm = /^          id: (\d+),$/.exec(L[i + 1] ?? "");
    if (/^        \{$/.test(L[i]) && idm) {
      let k = i + 1;
      while (k < L.length && !/^        \},?(\],)?$/.test(L[k])) k++;
      if (k >= L.length) throw new Error(`unterminated block at ${p}:${i + 1}`);
      // A malformed "},]," closer also ends the verses array; keep the array closer when dropping the block.
      const closesArray = L[k].includes("]");
      const nk = remap.get(`${chap}:${idm[1]}`);
      const [nc, nv] = (nk ?? "").split(":");
      if (!nk || nc !== chap) {
        // dropped verse, or one that changed chapter (cannot be re-homed in place)
        if (nk) moved++;
        removed++;
        if (closesArray) out.push("      ],");
      } else {
        kept++;
        const body = L.slice(i + 2, k);
        out.push(L[i], L[i + 1].replace(/id: \d+,/, `id: ${nv},`), ...body, "        },");
        if (closesArray) out.push("      ],");
      }
      i = k;
      continue;
    }
    out.push(L[i]);
  }
  fs.writeFileSync(p, out.join(nl));
  return { kept, removed, moved };
}

// ---------------------------------------------------------------------------

async function main() {
  const id = process.argv[2];
  const write = process.argv.includes("--write");
  const target = TARGETS[id];
  if (!target) throw new Error(`Unknown id "${id}". Known: ${Object.keys(TARGETS).join(", ")}`);

  let raw = "";
  let used = "";
  let localChapters: FullChapter[] | null = null;
  if (target.local) {
    const src = JSON.parse(fs.readFileSync(`data/sources-local/${id}.json`, "utf8"));
    used = `local proofread transcription: ${src.note}`;
    localChapters = src.chapters.map((c: { number: number; title: string; verses: { number: number; sanskrit: string }[] }) => ({
      number: c.number,
      title: c.title,
      verses: c.verses.map((v) => ({ number: v.number, sanskrit: v.sanskrit, transliteration: toIast(v.sanskrit) })),
    }));
  }
  // REBUILD_SOURCE_FILE: use an already-downloaded copy of the first source file instead of fetching it.
  const localCopy = process.env.REBUILD_SOURCE_FILE;
  if (localCopy && !target.local) {
    raw = fs.readFileSync(localCopy, "utf8");
    const f = target.files[0];
    used = f.startsWith("http") ? f : SD + f;
  }
  for (const f of target.local || raw ? [] : target.files) {
    const r = await fetch(f.startsWith("http") ? f : SD + f);
    if (r.ok) {
      raw = await r.text();
      used = f.startsWith("http") ? f : SD + f;
      break;
    }
  }
  if (!raw && !localChapters) throw new Error("no source found");
  const chapters = localChapters ?? target.build(cleanItx(raw));
  if (!localChapters) {
    chapters.forEach((c, i) => {
      c.number = i + 1;
      if (!target.keepTitles) c.title = target.chapterUnit ? `${target.chapterUnit} ${c.number}` : "";
    });
  }

  const jp = `public/data/scriptures-full/${id}.json`;
  const old = JSON.parse(fs.readFileSync(jp, "utf8"));
  const { maps, dropped, droppedReader } = carryOver(old.chapters, chapters, target.refOf);
  const total = chapters.reduce((a, c) => a + c.verses.length, 0);

  console.log(`${id}: source ${used}`);
  console.log(`  old ${old.totalVerses} verses -> new ${total} verses in ${chapters.length} chapter(s): ${chapters.map((c) => c.verses.length).join(",")}`);
  console.log(`  annotations carried: ${maps.length}; moved slot: ${maps.filter((m) => m.oldKey !== m.newKey).map((m) => `${m.oldKey}->${m.newKey}`).join(" ") || "none"}`);
  console.log(`  old verses dropped (not in source): ${dropped.length} ${dropped.join(" ")}`);
  for (const c of chapters) {
    const f = c.verses[0];
    const l = c.verses[c.verses.length - 1];
    console.log(`  ch${c.number} [${c.verses.length}] first ${f.number}: ${f.sanskrit?.slice(0, 50)} | last ${l.number}: ${l.sanskrit?.slice(0, 40)}`);
  }
  if (!write) return;

  const crlf = fs.readFileSync(jp, "utf8").includes("\r\n");
  const out = { ...old, source: { ...old.source, repo: used, fetchedAt: new Date().toISOString() }, totalVerses: total, totalChapters: chapters.length, chapters };
  let s = JSON.stringify(out, null, 2);
  if (crlf) s = s.replace(/\n/g, "\r\n");
  fs.writeFileSync(jp, s + (crlf ? "\r\n" : "\n"));
  console.log("  hi-commentary:", rewriteHi(id, maps, droppedReader));
  console.log("  hi-commentary rest:", rewriteRest(id, maps));
  console.log("  curated ts:", target.curatedMirrors ? await regenerateCurated(id, chapters) : rewriteCurated(id, maps));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
