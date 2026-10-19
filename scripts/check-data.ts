/**
 * Pre-build data-integrity check.
 *
 * Catches the kinds of bugs that don't show up in `tsc --noEmit`:
 *   - duplicate or non-sequential chapter IDs (breaks prev/next navigation)
 *   - duplicate verse IDs within a chapter (React key warnings + dedup misses)
 *   - scriptureCatalog ↔ scriptureMap drift (a meta entry without verse data,
 *     or verse data not registered in the catalog)
 *   - missing OG image PNGs for any catalog entry
 *   - seeded JSON chapter numbers that don't align with curated chapter IDs
 *     (the FullChapterVerses dedup silently fails when these drift)
 *   - curated verses missing core fields
 *   - the same Sanskrit verse filed in two slots (strict for the Gita,
 *     ratcheted against a baseline for other texts)
 *   - Bhagavad Gita verse counts differing from the canonical 18-chapter shape
 *
 * Run: npm run check
 * Exit non-zero if any failure — wire into CI before `npm run build`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { scriptureCatalog } from "../data/scripture-meta";
import { SCRIPTURE_NAMES } from "../data/scripture-names";
import {
  getAllScriptures,
  getScripture,
  getScriptureChapters,
  getScriptureMeta,
} from "../data/scriptures";
import { bhagavadGita } from "../data/scriptures/bhagavadgita";
import type { Scripture, ScriptureMeta } from "../data/types";
import { GITA_CANONICAL_VERSE_COUNTS, normalizeVerseText } from "./lib/verse-identity";

const ROOT = resolve(__dirname, "..");
const OG_DIR = resolve(ROOT, "public/og");
const FULL_DIR = resolve(ROOT, "public/data/scriptures-full");

interface Issue {
  severity: "error" | "warn";
  scope: string;
  message: string;
}

const issues: Issue[] = [];

function error(scope: string, message: string): void {
  issues.push({ severity: "error", scope, message });
}
function warn(scope: string, message: string): void {
  issues.push({ severity: "warn", scope, message });
}

function uniqueValues<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function checkChapterIds(scripture: Scripture): void {
  const ids = scripture.chapters.map((c) => c.id);
  if (uniqueValues(ids).length !== ids.length) {
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    error(scripture.id, `duplicate chapter ids: ${uniqueValues(dupes).join(", ")}`);
  }
  // The reader's prev/next nav uses chapterId arithmetic (chapterId + 1),
  // so IDs must be a 1..N contiguous sequence — otherwise next-button 404s.
  const sorted = ids.slice().sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) {
      error(
        scripture.id,
        `chapter ids must be sequential 1..N; got [${sorted.join(", ")}]`,
      );
      break;
    }
  }
}

function checkVerseIds(scripture: Scripture): void {
  for (const chapter of scripture.chapters) {
    const ids = chapter.verses.map((v) => v.id);
    if (uniqueValues(ids).length !== ids.length) {
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      error(
        scripture.id,
        `chapter ${chapter.id}: duplicate verse ids: ${uniqueValues(dupes).join(", ")}`,
      );
    }
  }
}

function checkRequiredFields(scripture: Scripture): void {
  for (const chapter of scripture.chapters) {
    for (const verse of chapter.verses) {
      if (!verse.sanskrit || !verse.sanskrit.trim()) {
        error(scripture.id, `ch ${chapter.id} verse ${verse.id}: missing sanskrit`);
      }
      if (!verse.translation && !verse.hindi) {
        warn(
          scripture.id,
          `ch ${chapter.id} verse ${verse.id}: neither translation nor hindi present`,
        );
      }
      if (!verse.explanation || !verse.explanation.trim()) {
        warn(scripture.id, `ch ${chapter.id} verse ${verse.id}: empty explanation`);
      }
    }
  }
}

function checkCatalogAlignment(): void {
  const catalogIds = scriptureCatalog.map((m) => m.id);
  const mappedIds = getAllScriptures().map((m) => m.id);
  const mappedSet = new Set(mappedIds);
  const catalogSet = new Set(catalogIds);
  for (const id of catalogIds) {
    if (!mappedSet.has(id)) {
      error(id, "in scriptureCatalog but not produced by getAllScriptures()");
    }
  }
  // getAllScriptures derives from scriptureCatalog so the reverse drift can't
  // happen — but check anyway as a sanity belt.
  for (const id of mappedIds) {
    if (!catalogSet.has(id)) {
      error(id, "produced by getAllScriptures() but missing from scriptureCatalog");
    }
  }
  // Every meta entry must be backed by a Scripture object.
  for (const meta of scriptureCatalog) {
    if (!getScripture(meta.id)) {
      error(meta.id, "in scriptureCatalog but no Scripture object registered in index.ts");
    }
  }
}

function checkOgImages(): void {
  for (const meta of scriptureCatalog) {
    const png = resolve(OG_DIR, `${meta.id}.png`);
    if (!existsSync(png)) {
      error(meta.id, `missing OG image at public/og/${meta.id}.png — run \`npm run og:build\``);
    }
  }
}

interface FullScriptureJson {
  id: string;
  chapters: Array<{
    number: number;
    verses: Array<{ number: number | string; sanskrit?: string; hindi?: string }>;
  }>;
}

/** Shorter normalized texts (refrains, "ॐ शान्तिः…") legitimately recur. */
const MIN_DUPLICATE_TEXT_LENGTH = 24;

/**
 * Cross-chapter duplicate verses that already existed when this check was
 * added (2026-09) — they predate the Gita repair and come from the original
 * seeds. Some are genuine repetitions (Vedic mantras, Upanishad passages
 * quoted in several places); many look like the same-slot copy bug that hit
 * the Gita (e.g. ramayana 1.1.21 = 2.1.2). This is a ratchet: counts may only
 * go down. Lower an entry when you fix a text; never raise one.
 */
const KNOWN_CROSS_CHAPTER_DUPLICATES: Record<string, number> = {
  agnipuran: 2,
  atharvaveda: 34,
  bhagavatapurana: 91,
  brahmandpuran: 5,
  brahmapuran: 4,
  brihadaranyaka: 15,
  chandogya: 26,
  devibhagavat: 89,
  garudpurana: 9,
  harivanshpuran: 2,
  kurmapuran: 7,
  lingapuran: 11,
  mahabharata: 37,
  mahanarayana: 1,
  mahaupanishad: 1, // the jivanmukta verse "ahankaramayim tyaktva…" repeats in ch. 2 and 6 of the source
  manusmriti: 2,
  markandeypuran: 8,
  matsyapuran: 27,
  naradapuran: 50,
  narasimhapuran: 13,
  ramayana: 57,
  ramcharitmanas: 21,
  rigveda: 39,
  samaveda: 194, // the Uttarārcika repeats many Pūrvārcika mantras in the source (full 1,873-mantra text)
  shandilyabhaktisutra: 5,
  shivpurana: 36,
  skandapuran: 16,
  taittiriya: 3,
  vamanpuran: 4,
  vayupuran: 20,
  vishnupurana: 3,
  yajurveda: 40,
};

/** Scriptures whose text must never repeat a verse anywhere, within a chapter or across. */
const STRICT_NO_DUPLICATES = new Set(["bhagavadgita"]);

function checkDuplicateVerses(id: string, data: FullScriptureJson): void {
  const firstSeen = new Map<string, { chapter: number; ref: string }>();
  const cross: string[] = [];
  const within: string[] = [];
  for (const chapter of data.chapters) {
    for (const verse of chapter.verses) {
      const text = normalizeVerseText(verse.sanskrit ?? "");
      if (text.length < MIN_DUPLICATE_TEXT_LENGTH) continue;
      const ref = `${chapter.number}.${verse.number}`;
      const prev = firstSeen.get(text);
      if (!prev) {
        firstSeen.set(text, { chapter: chapter.number, ref });
      } else if (prev.chapter === chapter.number) {
        within.push(`${prev.ref} = ${ref}`);
      } else {
        cross.push(`${prev.ref} = ${ref}`);
      }
    }
  }

  const sample = (list: string[]) =>
    list.slice(0, 5).join(", ") + (list.length > 5 ? ` … (+${list.length - 5})` : "");

  if (STRICT_NO_DUPLICATES.has(id)) {
    const all = cross.concat(within);
    if (all.length > 0) {
      error(id, `${all.length} verse(s) repeat the Sanskrit of another slot: ${sample(all)}`);
    }
    return;
  }
  const allowed = KNOWN_CROSS_CHAPTER_DUPLICATES[id] ?? 0;
  if (cross.length > allowed) {
    error(
      id,
      `${cross.length} cross-chapter duplicate verses (baseline ${allowed}) — the same Sanskrit ` +
        `appears in two chapters: ${sample(cross)}`,
    );
  } else if (cross.length < allowed) {
    warn(
      id,
      `cross-chapter duplicates dropped to ${cross.length} (baseline ${allowed}) — ` +
        `lower KNOWN_CROSS_CHAPTER_DUPLICATES.${id} in scripts/check-data.ts`,
    );
  }
}

/**
 * The Gita is the flagship text and was once silently corrupted by a
 * position-based merge (commit 3a17ed9: 8.28 showed Gita 1.28). Pin it to the
 * canonical shape, and require the curated .ts (not read at runtime, but the
 * source other scripts merge from) to carry the same verse in every slot as
 * the seeded JSON.
 */
function checkGitaCanonical(data: FullScriptureJson): void {
  const id = "bhagavadgita";
  const expected = GITA_CANONICAL_VERSE_COUNTS.join(",");
  const countsOf = (chapters: Array<{ verses: unknown[] }>) =>
    chapters.map((c) => c.verses.length).join(",");

  const jsonCounts = countsOf(data.chapters);
  if (jsonCounts !== expected) {
    error(id, `seeded JSON verse counts per chapter [${jsonCounts}] ≠ canonical [${expected}]`);
  }
  const misnumbered = data.chapters.filter((c) =>
    c.verses.some((v, i) => Number(v.number) !== i + 1),
  );
  if (misnumbered.length > 0) {
    error(
      id,
      `seeded JSON verses are not numbered 1..N in chapter(s) ${misnumbered.map((c) => c.number).join(", ")}`,
    );
  }

  const indexCounts = getScriptureChapters(id).map((c) => c.verseCount).join(",");
  if (indexCounts !== expected) {
    error(id, `public/data/chapters.json verse counts [${indexCounts}] ≠ canonical [${expected}]`);
  }

  const curated = bhagavadGita;
  const curatedCounts = countsOf(curated.chapters);
  if (curatedCounts !== expected) {
    error(id, `curated .ts verse counts per chapter [${curatedCounts}] ≠ canonical [${expected}]`);
  }
  const jsonText = new Map<string, string>();
  for (const c of data.chapters) {
    for (const v of c.verses) jsonText.set(`${c.number}:${v.number}`, normalizeVerseText(v.sanskrit ?? ""));
  }
  const mismatched: string[] = [];
  for (const c of curated.chapters) {
    for (const v of c.verses) {
      const key = `${c.id}:${v.id}`;
      if (jsonText.get(key) !== normalizeVerseText(v.sanskrit)) mismatched.push(key);
    }
  }
  if (mismatched.length > 0) {
    error(
      id,
      `${mismatched.length} curated verse(s) carry different Sanskrit than the seeded JSON at the same ` +
        `chapter:verse: ${mismatched.slice(0, 5).join(", ")}${mismatched.length > 5 ? " …" : ""}`,
    );
  }

  // Every verse needs a real Hindi meaning. The source text shipped with a
  // "।।2.47।।" label on each meaning, 18.2 carried only the translator credit
  // ("Hindi Translation By …") and 13.1 the placeholder "No Translation" —
  // readers saw all of them on the page.
  // 13.1 (Arjuna's question, absent from many editions) has no Hindi in the
  // source; it is left empty so the page simply omits the Hindi layer.
  const NO_HINDI_IN_SOURCE = new Set(["13.1"]);
  const badHindi: string[] = [];
  for (const c of data.chapters) {
    for (const v of c.verses) {
      const ref = `${c.number}.${v.number}`;
      const hindi = v.hindi?.trim() ?? "";
      if (NO_HINDI_IN_SOURCE.has(ref) && hindi === "") continue;
      const devanagari = hindi.match(/[ऀ-ॿ]/g)?.length ?? 0;
      if (
        devanagari < 20 ||
        /^[।|]{1,2}\s*\d/.test(hindi) ||
        /translation by|no translation/i.test(hindi) ||
        /^\(श्लोक (\d+)–\1\)/.test(hindi)
      ) {
        badHindi.push(ref);
      }
    }
  }
  if (badHindi.length > 0) {
    error(
      id,
      `${badHindi.length} verse(s) have a missing, credit-only or verse-labelled Hindi meaning: ` +
        `${badHindi.slice(0, 5).join(", ")}${badHindi.length > 5 ? " …" : ""}`,
    );
  }
}

/**
 * Verses stored in text order (73.1, 73.10, 73.11, 73.2 …) — how some seeds
 * sorted "section.verse" numbers. Fixed by scripts/fix-verse-order.mjs; this
 * keeps a re-seed from bringing it back. Same rule as that script: only
 * chapters with one numbering shape whose backward steps stay in a section.
 */
function checkVerseOrder(id: string, data: FullScriptureJson): void {
  const parts = (n: number | string) => String(n).split('.');
  const shape = (n: number | string) => {
    const p = parts(n);
    return p.every((x, i) => (i === p.length - 1 ? /^\d+(-\d+)?$/ : /^\d+$/).test(x)) ? p.length : -1;
  };
  const key = (n: number | string) => parts(n).map((x) => Number.parseInt(x, 10));
  const before = (a: number | string, b: number | string) => {
    const x = key(a);
    const y = key(b);
    for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i];
    return false;
  };
  const bad: string[] = [];
  for (const chapter of data.chapters) {
    const nums = chapter.verses.map((v) => v.number);
    const shapes = new Set(nums.map(shape));
    if (shapes.size !== 1 || shapes.has(-1)) continue;
    let textSorted = false;
    let crossSection = false;
    for (let i = 1; i < nums.length; i++) {
      if (!before(nums[i], nums[i - 1])) continue;
      if (key(nums[i])[0] === key(nums[i - 1])[0]) textSorted = true;
      else crossSection = true;
    }
    if (textSorted && !crossSection) bad.push(String(chapter.number));
  }
  if (bad.length > 0) {
    error(
      id,
      `chapter(s) ${bad.join(', ')} list verses in text order (x.10 before x.2) — run node scripts/fix-verse-order.mjs --write`,
    );
  }
}

/**
 * Hard-coded scripture references in app/, data/ and lib/ (`scriptureId:
 * '…'`, `/scripture/…` paths) must name a real scripture — made-up ids like
 * 'isha-upanishad' or 'upanishads' produced links to pages that don't exist.
 */
const NOT_IN_LIBRARY = new Set(['maha-upanishad']); // cited, deliberately unlinked
function checkScriptureReferences(): void {
  const known = new Set(scriptureCatalog.map((m) => m.id));
  const bad = new Set<string>();
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const path = resolve(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(ts|tsx)$/.test(name)) {
        const src = readFileSync(path, 'utf8');
        const rel = path.slice(resolve(__dirname, '..').length + 1);
        for (const m of src.matchAll(/scriptureId:\s*['"]([a-z0-9-]+)['"]/g)) {
          if (!known.has(m[1]) && !NOT_IN_LIBRARY.has(m[1])) bad.add(`${rel}: ${m[1]}`);
        }
        for (const m of src.matchAll(/['"`]\/scripture\/([a-z0-9-]+)(?=[/'"`?#])/g)) {
          if (!known.has(m[1])) bad.add(`${rel}: /scripture/${m[1]}`);
        }
      }
    }
  };
  for (const dir of ['app', 'data', 'lib']) walk(resolve(__dirname, '..', dir));
  if (bad.size > 0) {
    error('references', `${bad.size} link(s) to scriptures that don't exist: ${[...bad].slice(0, 5).join('; ')}`);
  }
}

function checkSeededJsonAlignment(): void {
  for (const meta of scriptureCatalog) {
    const path = resolve(FULL_DIR, `${meta.id}.json`);
    if (!existsSync(path)) continue; // seeded JSON is optional per-scripture

    let data: FullScriptureJson;
    try {
      data = JSON.parse(readFileSync(path, "utf8"));
    } catch (err) {
      error(meta.id, `${path} is not valid JSON: ${(err as Error).message}`);
      continue;
    }

    checkDuplicateVerses(meta.id, data);
    checkVerseOrder(meta.id, data);
    if (meta.id === "bhagavadgita") checkGitaCanonical(data);

    const curated = getScripture(meta.id);
    if (!curated) continue;

    const curatedChapterIds = curated.chapters.map((c) => c.id);
    const jsonChapterNumbers = data.chapters.map((c) => c.number);
    const jsonChapterSet = new Set(jsonChapterNumbers);

    // Curated chapter without a matching JSON chapter = the "Load full
    // chapter text" button on that page will show "no extras." That's the
    // real bug we want to catch.
    for (const id of curatedChapterIds) {
      if (!jsonChapterSet.has(id)) {
        warn(
          meta.id,
          `curated chapter id ${id} has no matching chapter in seeded JSON (chapters present: ${jsonChapterNumbers.slice().sort((a, b) => Number(a) - Number(b)).join(", ")})`,
        );
      }
    }
    // The reverse — JSON chapter not in curated — is NOT a bug. The curated
    // .ts files are intentionally a subset of canonical chapters; visiting
    // those chapter routes is impossible because they aren't generated as
    // static pages. So we don't warn on that direction.
  }
}

function checkScriptureMeta(meta: ScriptureMeta): void {
  if (!meta.title.trim()) error(meta.id, "empty title");
  if (!meta.titleSanskrit.trim()) error(meta.id, "empty titleSanskrit");
  if (meta.totalChapters < 1) warn(meta.id, "totalChapters < 1");
}

function checkScriptureNames(): void {
  const catalogIds = new Set(scriptureCatalog.map((meta) => meta.id));
  for (const meta of scriptureCatalog) {
    const name = SCRIPTURE_NAMES[meta.id];
    if (!name) {
      error(meta.id, "missing from data/scripture-names.ts");
      continue;
    }
    if (name.title !== meta.title) error(meta.id, "scripture-names title does not match the catalog");
    if (name.titleSanskrit !== meta.titleSanskrit) {
      error(meta.id, "scripture-names Sanskrit title does not match the catalog");
    }
  }
  for (const id of Object.keys(SCRIPTURE_NAMES)) {
    if (!catalogIds.has(id)) error(id, "scripture-names entry is not in the catalog");
  }
}

function main(): void {
  for (const meta of scriptureCatalog) {
    checkScriptureMeta(meta);
    const scripture = getScripture(meta.id);
    if (!scripture) continue;
    checkChapterIds(scripture);
    checkVerseIds(scripture);
    checkRequiredFields(scripture);
  }
  checkCatalogAlignment();
  checkScriptureNames();
  checkOgImages();
  checkSeededJsonAlignment();
  checkScriptureReferences();

  const errors = issues.filter((i) => i.severity === "error");
  const warns = issues.filter((i) => i.severity === "warn");

  // Group output by scripture for readability.
  const byScope = new Map<string, Issue[]>();
  for (const issue of issues) {
    const list = byScope.get(issue.scope) ?? [];
    list.push(issue);
    byScope.set(issue.scope, list);
  }

  if (issues.length === 0) {
    console.log("✓ All checks passed.");
    console.log(
      `  ${scriptureCatalog.length} scriptures · ${countCurated()} curated verses · ${countSeeded()} seeded full-text verses`,
    );
    return;
  }

  byScope.forEach((list, scope) => {
    console.log(`\n[${scope}]`);
    for (const issue of list) {
      const tag = issue.severity === "error" ? "✗ ERR " : "! WARN";
      console.log(`  ${tag} ${issue.message}`);
    }
  });
  console.log(`\n${errors.length} error(s), ${warns.length} warning(s)`);
  if (errors.length > 0) process.exit(1);
}

function countCurated(): number {
  let n = 0;
  for (const meta of scriptureCatalog) {
    const s = getScripture(meta.id);
    if (!s) continue;
    for (const c of s.chapters) n += c.verses.length;
  }
  return n;
}

function countSeeded(): number {
  let n = 0;
  for (const meta of scriptureCatalog) {
    const path = resolve(FULL_DIR, `${meta.id}.json`);
    if (!existsSync(path)) continue;
    try {
      const data = JSON.parse(readFileSync(path, "utf8")) as FullScriptureJson;
      for (const c of data.chapters) n += c.verses.length;
    } catch {
      // already reported as error above
    }
  }
  return n;
}

// silence unused-import lint
void getScriptureMeta;

main();
