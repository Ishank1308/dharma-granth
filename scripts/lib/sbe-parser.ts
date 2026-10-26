import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

export interface SbeVerse {
  number: number;
  text: string;
  /** Shloka sub-verse under a parent mantra (e.g. 28.1 … 28.7). */
  subOf?: number;
  /** Unnumbered paragraph following a numbered mantra. */
  continuation?: boolean;
}

const DEVANAGARI_DIGITS = "०१२३४५६७८९";

export function parseDevanagariDigits(raw: string): number {
  const ascii = raw.replace(/[०-९]/g, (d) => {
    const idx = DEVANAGARI_DIGITS.indexOf(d);
    return idx >= 0 ? String(idx) : d;
  });
  const n = Number(ascii.replace(/[^\d]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

const ROMAN_VALUES: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
  x: 10,
  xi: 11,
  xii: 12,
  xiii: 13,
  xiv: 14,
  xv: 15,
};

export function parseRomanNumeral(raw: string): number {
  return ROMAN_VALUES[raw.toLowerCase()] ?? 0;
}

export interface BrihadRef {
  adhyaya: number;
  brahmana: number;
  mantra: number;
}

/** Parse refs like `[III.ix.28]`, `[IV.Ii.14]`, `[III.vIi.1]`. */
export function parseBrihadRef(raw: string): BrihadRef | null {
  const m = raw.match(/^([IVX]+)\.([a-zA-Z]+)\.(\d+)$/i);
  if (!m) return null;
  const adhyaya = parseRomanNumeral(m[1]);
  const brahmana = parseRomanNumeral(m[2]);
  const mantra = Number(m[3]);
  if (!adhyaya || !brahmana || !mantra) return null;
  return { adhyaya, brahmana, mantra };
}

/** Extract the first `[II.i.1]`-style ref from verse text. */
export function extractBrihadRef(...texts: Array<string | undefined>): BrihadRef | null {
  for (const text of texts) {
    if (!text) continue;
    const m = text.match(/\[([IVX]+\.[a-zA-Z]+\.\d+)\]/i);
    if (m) {
      const ref = parseBrihadRef(m[1]);
      if (ref) return ref;
    }
  }
  return null;
}

/** SBE page for each brâhmaṇa (skips I,3 and page 98). */
export const BRIHAD_SBE_PAGES: number[] = [
  53, 54, 55, 56, 57,
  58, 59, 60, 61, 62, 63,
  64, 65, 66, 67, 68, 69, 70, 71, 72,
  73, 74, 75, 76, 77, 78,
  79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93,
  94, 95, 96, 97, 99,
];

const BRIHAD_BRAHMANA_PAGE_ENTRIES: Array<[string, number, number]> = [
  ["I", 1, 54],
  ["I", 2, 55],
  ["I", 4, 56],
  ["I", 5, 57],
  ["II", 1, 58],
  ["II", 2, 59],
  ["II", 3, 60],
  ["II", 4, 61],
  ["II", 5, 62],
  ["II", 6, 63],
  ["III", 1, 64],
  ["III", 2, 65],
  ["III", 3, 66],
  ["III", 4, 67],
  ["III", 5, 68],
  ["III", 6, 69],
  ["III", 7, 70],
  ["III", 8, 71],
  ["III", 9, 72],
  ["IV", 1, 73],
  ["IV", 2, 74],
  ["IV", 3, 75],
  ["IV", 4, 76],
  ["IV", 5, 77],
  ["IV", 6, 78],
  ["V", 1, 79],
  ["V", 2, 80],
  ["V", 3, 81],
  ["V", 4, 82],
  ["V", 5, 83],
  ["V", 6, 84],
  ["V", 7, 85],
  ["V", 8, 86],
  ["V", 9, 87],
  ["V", 10, 88],
  ["V", 11, 89],
  ["V", 12, 90],
  ["V", 13, 91],
  ["V", 14, 92],
  ["V", 15, 93],
  ["VI", 1, 94],
  ["VI", 2, 95],
  ["VI", 3, 96],
  ["VI", 4, 97],
  ["VI", 5, 99],
];

const ADHYAYA_ROMAN = ["", "I", "II", "III", "IV", "V", "VI"];

export function brihadRefKey(
  ref: BrihadRef,
  sub?: number,
  kind: "shloka" | "continuation" = "shloka",
): string {
  const adhyaya = ADHYAYA_ROMAN[ref.adhyaya] ?? String(ref.adhyaya);
  const brahmana = Object.entries(ROMAN_VALUES).find(([, v]) => v === ref.brahmana)?.[0] ?? String(ref.brahmana);
  const base = `${adhyaya}.${brahmana}.${ref.mantra}`;
  if (!sub) return base;
  const suffix = kind === "continuation" ? "c" : "s";
  return `${base}.${suffix}${sub}`;
}

export function pageForBrihadRef(ref: BrihadRef): number | undefined {
  const adhyaya = ADHYAYA_ROMAN[ref.adhyaya];
  if (!adhyaya) return undefined;
  const hit = BRIHAD_BRAHMANA_PAGE_ENTRIES.find(
    ([a, b]) => a === adhyaya && b === ref.brahmana,
  );
  return hit?.[2];
}

export function mantraNumber(
  sanskrit: string,
  verseNumber: number | string,
  position: number,
): number {
  const m = sanskrit.match(/मन्त्र\s*([०-९\d]+)/);
  if (m) {
    const n = parseDevanagariDigits(m[1]);
    if (n > 0) return n;
  }
  const n = String(verseNumber);
  if (/^\d+$/.test(n)) return Number(n);
  return position + 1;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function decodeEntities(html: string): string {
  return html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&icirc;/g, "î")
    .replace(/&acirc;/g, "â")
    .replace(/&uuml;/g, "ü")
    .replace(/&agrave;/g, "à")
    .replace(/&eacute;/g, "é")
    .replace(/&ocirc;/g, "ô")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

export function stripSbeHtml(html: string): string {
  const text = html
    .replace(/<a[^>]*href="#fn[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
    .replace(/<a[^>]*name="fr_[^"]*"[^>]*>\s*<\/a>/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<i>([^<]*)<\/i>/gi, "$1")
    .replace(/<I>([^<]*)<\/I>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return decodeEntities(text);
}

export function fetchSbeHtml(
  baseUrl: string,
  filePrefix: string,
  pageNum: number,
  cacheDir: string,
): string {
  const file = `${filePrefix}${String(pageNum).padStart(3, "0")}.htm`;
  const cachePath = resolve(cacheDir, file);

  if (existsSync(cachePath) && !process.env.SBE_REFRESH_CACHE) {
    return readFileSync(cachePath, "utf8");
  }

  mkdirSync(cacheDir, { recursive: true });
  const url = `${baseUrl}/${file}`;
  const html = execFileSync(
    "curl.exe",
    ["-s", "-L", "-A", UA, url],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
  );

  if (!html.includes("<BODY>") && !html.includes("<body>")) {
    throw new Error(`Unexpected response for ${url} (${html.length} bytes)`);
  }

  writeFileSync(cachePath, html, "utf8");
  return html;
}

function isFootnoteParagraph(html: string): boolean {
  return /NAME="fn_/i.test(html);
}

function shouldSkipSbeParagraph(para: string): boolean {
  return (
    !para ||
    /^p\. \d+$/i.test(para) ||
    /sacred-texts\.com/i.test(para) ||
    /^Sacred Texts\b/i.test(para) ||
    /^Previous:/i.test(para) ||
    /^Next:/i.test(para)
  );
}

function cleanSbeParagraph(para: string): string {
  return para.replace(/\[paragraph continues\]/gi, "").replace(/\s+/g, " ").trim();
}

export function parseSbePage(html: string): SbeVerse[] {
  const bodyMatch = html.match(/<BODY[^>]*>([\s\S]*?)<\/BODY>/i);
  if (!bodyMatch) return [];

  let chunk = bodyMatch[1];
  const footIdx = chunk.search(/<H3[^>]*>\s*Footnotes\s*<\/H3>/i);
  if (footIdx >= 0) chunk = chunk.slice(0, footIdx);

  const paragraphs = [...chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .filter((m) => !isFootnoteParagraph(m[0]))
    .map((m) => stripSbeHtml(m[1]));

  const verses: SbeVerse[] = [];
  let current: SbeVerse | null = null;
  let shlokaParent: number | null = null;
  let lastNumbered = 0;
  let continuation: string[] = [];

  const flushContinuation = (upcomingNumber?: number): void => {
    if (!continuation.length || !lastNumbered) return;
    const nextTaken = upcomingNumber === lastNumbered + 1;
    if (nextTaken) {
      const contNum =
        verses.filter((v) => v.continuation && v.subOf === lastNumbered).length + 1;
      verses.push({
        number: contNum,
        text: continuation.join(" ").replace(/\s+/g, " ").trim(),
        subOf: lastNumbered,
        continuation: true,
      });
    } else {
      verses.push({
        number: lastNumbered + 1,
        text: continuation.join(" ").replace(/\s+/g, " ").trim(),
      });
    }
    continuation = [];
  };

  const pushCurrent = (upcomingNumber?: number): void => {
    flushContinuation(upcomingNumber);
    if (!current) return;
    verses.push(current);
    lastNumbered = current.subOf ?? current.number;
    if (/slokas/i.test(current.text)) {
      shlokaParent = current.number;
    } else if (!current.subOf) {
      shlokaParent = null;
    }
    current = null;
  };

  for (const rawPara of paragraphs) {
    if (shouldSkipSbeParagraph(rawPara)) continue;
    if (/^(Many questions|The great difficulty|Another curious|Again, there is)/i.test(rawPara)) {
      break;
    }

    const para = cleanSbeParagraph(rawPara);
    if (!para) continue;

    const multi = para.match(/^(\d+)\s*,\s*(\d+)\.\s*(.*)$/);
    if (multi) {
      pushCurrent(Number(multi[1]));
      current = { number: Number(multi[1]), text: multi[3].trim() };
      continue;
    }

    const colonNum = para.match(/^:(\d+)\.\s*(.*)$/);
    if (colonNum) {
      const num = Number(colonNum[1]);
      const text = colonNum[2].trim();

      if (shlokaParent !== null && num < shlokaParent) {
        pushCurrent(num);
        verses.push({ number: num, text, subOf: shlokaParent });
        continue;
      }

      pushCurrent(num);
      current = { number: num, text };
      continue;
    }

    const numbered = para.match(/^(\d+)(?:[.,]|\s+)\s*(.*)$/);
    if (numbered) {
      const num = Number(numbered[1]);
      const text = numbered[2].trim();

      if (shlokaParent !== null && num < shlokaParent) {
        pushCurrent(num);
        verses.push({ number: num, text, subOf: shlokaParent });
        continue;
      }

      pushCurrent(num);
      current = { number: num, text };
      continue;
    }

    if (current) {
      if (/^['"]/.test(para)) {
        pushCurrent();
        continuation.push(para);
      } else {
        current.text = `${current.text} ${para}`.replace(/\s+/g, " ").trim();
      }
    } else if (lastNumbered) {
      continuation.push(para);
    } else if (!verses.length) {
      verses.push({ number: 1, text: para });
      lastNumbered = 1;
    }
  }

  pushCurrent();
  flushContinuation();
  return verses;
}

export function buildBrihadTranslationMap(
  htmlByPage: Map<number, string>,
): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const [adhyayaRoman, brahmana, pageNum] of BRIHAD_BRAHMANA_PAGE_ENTRIES) {
    const html = htmlByPage.get(pageNum);
    if (!html) continue;

    const adhyaya = parseRomanNumeral(adhyayaRoman);
    const parsed = parseSbePage(html);

    for (const verse of parsed) {
      const key = verse.continuation && verse.subOf
        ? brihadRefKey({ adhyaya, brahmana, mantra: verse.subOf }, verse.number, "continuation")
        : verse.subOf
          ? brihadRefKey({ adhyaya, brahmana, mantra: verse.subOf }, verse.number, "shloka")
          : brihadRefKey({ adhyaya, brahmana, mantra: verse.number });
      const bucket = map.get(key) ?? [];
      bucket.push(verse.text);
      map.set(key, bucket);
    }
  }

  return map;
}

function takeFromBucket(
  map: Map<string, string[]>,
  key: string,
  used: Map<string, number>,
): string | undefined {
  const bucket = map.get(key);
  if (!bucket?.length) return undefined;
  const idx = used.get(key) ?? 0;
  if (idx >= bucket.length) return undefined;
  used.set(key, idx + 1);
  return bucket[idx];
}

export function lookupBrihadTranslation(
  map: Map<string, string[]>,
  ref: BrihadRef,
  used: Map<string, number>,
): string | undefined {
  for (let b = ref.brahmana; b <= ref.brahmana + 2; b++) {
    const text = takeFromBucket(map, brihadRefKey({ ...ref, brahmana: b }), used);
    if (text) return text;
  }
  return undefined;
}

export function lookupBrihadSubTranslation(
  map: Map<string, string[]>,
  ref: BrihadRef,
  sub: number,
  kind: "shloka" | "continuation",
  used: Map<string, number>,
): string | undefined {
  for (let b = ref.brahmana; b <= ref.brahmana + 2; b++) {
    const text = takeFromBucket(
      map,
      brihadRefKey({ ...ref, brahmana: b }, sub, kind),
      used,
    );
    if (text) return text;
  }
  return undefined;
}

/** Parse a sacred-texts.com Laws of Manu chapter page (Buhler). */
export function parseManuPage(html: string): Map<number, string> {
  const bodyMatch = html.match(/<BODY[^>]*>([\s\S]*?)<\/BODY>/i);
  if (!bodyMatch) return new Map();

  let chunk = bodyMatch[1];
  const footIdx = chunk.search(/<H3[^>]*>\s*Footnotes\s*<\/H3>/i);
  if (footIdx >= 0) chunk = chunk.slice(0, footIdx);

  const verses = new Map<number, string>();
  const paragraphs = [...chunk.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .filter((m) => !isFootnoteParagraph(m[0]))
    .map((m) => stripSbeHtml(m[1]));

  for (const para of paragraphs) {
    if (shouldSkipSbeParagraph(para)) continue;

    const range = para.match(/^(\d+)\s*-\s*(\d+)\s*(?:\([^)]*\))?\s*\.?\s*(.+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      const text = range[3].replace(/\s+/g, " ").trim();
      if (start > 0 && end >= start && text) {
        for (let n = start; n <= end; n++) verses.set(n, text);
      }
      continue;
    }

    const m = para.match(/^(\d+)\s*(?:\([^)]*\))?\s*\.?\s*(.+)$/);
    if (!m) continue;
    const num = Number(m[1]);
    const text = m[2].replace(/\s+/g, " ").trim();
    if (num > 0 && text) verses.set(num, text);
  }

  return verses;
}

export function fetchManuHtml(
  baseUrl: string,
  chapter: number,
  cacheDir: string,
): string {
  const file = `manu${String(chapter).padStart(2, "0")}.htm`;
  const cachePath = resolve(cacheDir, file);

  if (existsSync(cachePath) && !process.env.SBE_REFRESH_CACHE) {
    return readFileSync(cachePath, "utf8");
  }

  mkdirSync(cacheDir, { recursive: true });
  const url = `${baseUrl}/${file}`;
  const html = execFileSync(
    "curl.exe",
    ["-s", "-L", "-A", UA, url],
    { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 },
  );

  if (!html.includes("<BODY>") && !html.includes("<body>")) {
    throw new Error(`Unexpected response for ${url} (${html.length} bytes)`);
  }

  writeFileSync(cachePath, html, "utf8");
  return html;
}

/**
 * True when a translation field is usable for readers.
 * Rejects empty strings, bare page numbers, OCR fragments, and
 * "translation pending" placeholders (aligned with verse-audit.js).
 */
export function hasTranslation(text?: string): boolean {
  if (text == null) return false;
  const v = String(text).trim();
  if (v.length < 4) return false;
  const lower = v.toLowerCase();
  if (/^translation\s*(not available|pending|coming soon|todo|tbd)/i.test(v)) {
    return false;
  }
  if (/^commentary\s*(not available|pending|coming soon|todo|tbd)/i.test(v)) {
    return false;
  }
  // Bare page numbers / OCR debris ("181", "32.", "40.", "-", ").\"")
  if (/^\d{1,4}\.?$/.test(v)) return false;
  if (/^[-–—]+$/.test(v)) return false;
  if (/^[.)\]"'”’]+$/.test(v)) return false;
  // Isolated function words / fragments that are not real translations
  if (/^(and|or|the|of|to|in|a|an|me\.?|etc\.?)$/i.test(v)) return false;
  // Devanagari-only fragments (e.g. "चन") with no Latin content
  if (/^[\u0900-\u097F\s।॥]+$/.test(v) && v.length < 12) return false;
  return Boolean(lower);
}