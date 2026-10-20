/**
 * Seed English translations for Brihadaranyaka Upanishad from Max Müller's SBE Vol. 15
 * (sacred-texts.com/hin/sbe15, public domain, 1884).
 *
 * Maps verses via bracket refs `[III.ix.28]` → SBE brâhmaṇa page + mantra number.
 * Chapters 1–6 keep curated highlights unless missing or `--force`.
 *
 * Superseded for Adhyāya 1: BRIHAD_BRAHMANA_PAGE_ENTRIES maps I,1 to page 54 (it is on 53) and the rebuilt text
 * has no bracket refs. scripts/fill-brihadaranyaka-adhyaya1-english.ts fills Adhyāya 1 by mantra number.
 *
 * Run: npx tsx scripts/seed-brihadaranyaka-translations.ts
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import {
  BRIHAD_SBE_PAGES,
  buildBrihadTranslationMap,
  extractBrihadRef,
  fetchSbeHtml,
  hasTranslation,
  lookupBrihadSubTranslation,
  lookupBrihadTranslation,
  mantraNumber,
  type BrihadRef,
} from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/brihadaranyaka.json");
const CACHE_DIR = resolve(ROOT, "scripts/cache/brihadaranyaka-sbe");
const SBE_BASE = "https://sacred-texts.com/hin/sbe15";
const FILE_PREFIX = "sbe15";
const CURATED_CHAPTER_END = 6;

const FORCE = process.argv.includes("--force");

interface ShlokaState {
  ref: BrihadRef;
  nextSub: number;
  nextCont: number;
}

async function main(): Promise<void> {
  log(`Seeding Brihadaranyaka from SBE Vol. 15${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const htmlByPage = new Map<number, string>();

  for (let i = 0; i < BRIHAD_SBE_PAGES.length; i++) {
    const pageNum = BRIHAD_SBE_PAGES[i];
    const html = fetchSbeHtml(SBE_BASE, FILE_PREFIX, pageNum, CACHE_DIR);
    htmlByPage.set(pageNum, html);

    if ((i + 1) % 10 === 0 || i === BRIHAD_SBE_PAGES.length - 1) {
      log(`  fetched ${i + 1}/${BRIHAD_SBE_PAGES.length} SBE pages`);
    }
  }

  const translationMap = buildBrihadTranslationMap(htmlByPage);
  const usedKeys = new Map<string, number>();
  log(`  indexed ${translationMap.size} SBE verse keys`);

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    let shlokaState: ShlokaState | null = null;

    chapter.verses.forEach((verse, idx) => {
      const ref = extractBrihadRef(verse.sanskrit, verse.transliteration);

      if (!ref) {
        if (shlokaState) {
          const contText = lookupBrihadSubTranslation(
            translationMap,
            shlokaState.ref,
            shlokaState.nextCont,
            "continuation",
            usedKeys,
          );
          if (contText) {
            shlokaState = { ...shlokaState, nextCont: shlokaState.nextCont + 1 };
            if (shouldFill(chapter.number, verse.translation)) {
              verse.translation = contText;
              filled++;
            } else {
              skipped++;
            }
            return;
          }

          const subText = lookupBrihadSubTranslation(
            translationMap,
            shlokaState.ref,
            shlokaState.nextSub,
            "shloka",
            usedKeys,
          );
          if (subText) {
            shlokaState = { ...shlokaState, nextSub: shlokaState.nextSub + 1 };
            if (shouldFill(chapter.number, verse.translation)) {
              verse.translation = subText;
              filled++;
            } else {
              skipped++;
            }
            return;
          }
        }
        if (!hasTranslation(verse.translation)) missing++;
        return;
      }

      const mantra = mantraNumber(verse.sanskrit ?? "", verse.number, idx);
      const lookupRef: BrihadRef = { ...ref, mantra };
      let text = lookupBrihadTranslation(translationMap, lookupRef, usedKeys);
      if (!text && mantra !== ref.mantra) {
        text = lookupBrihadTranslation(translationMap, ref, usedKeys);
      }

      if (text) {
        shlokaState = { ref: lookupRef, nextSub: 1, nextCont: 1 };
      } else {
        shlokaState = null;
      }

      if (!text) {
        if (!hasTranslation(verse.translation)) missing++;
        return;
      }

      if (!shouldFill(chapter.number, verse.translation)) {
        skipped++;
        return;
      }

      verse.translation = text;
      filled++;
    });
  }

  const total = scripture.chapters.reduce((n, c) => n + c.verses.length, 0);
  const translated = scripture.chapters.reduce(
    (n, c) => n + c.verses.filter((v) => hasTranslation(v.translation)).length,
    0,
  );

  scripture.source = {
    ...scripture.source,
    translationRepo: `${SBE_BASE}/index.htm`,
    translationLicense:
      "Max Müller translation (1884), Sacred Books of the East Vol. 15 — public domain.",
    translationFetchedAt: new Date().toISOString(),
  };

  const out = writeScripture(scripture);
  log(`✓ ${out}`);
  log(`  filled ${filled} · kept ${skipped} · still missing ${missing}`);
  log(`  coverage: ${translated}/${total} (${Math.round((translated / total) * 100)}%)`);
}

function shouldFill(chapterNumber: number, existing?: string): boolean {
  if (chapterNumber <= CURATED_CHAPTER_END) {
    return FORCE || !hasTranslation(existing);
  }
  return true;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});