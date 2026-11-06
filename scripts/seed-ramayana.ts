/**
 * Seed Valmiki Ramayana from the public DharmicData dataset.
 *
 * Source: https://github.com/bhavykhatri/DharmicData (community-maintained Sanskrit corpus)
 * Output: public/data/scriptures-full/ramayana.json
 *
 * One chapter per kanda; verse numbers are "sarga.shloka". The meanings already
 * published for the Ramayana are carried over (scripts/lib/realign-meanings.ts):
 *
 *   npm run seed:ramayana
 *   npm run seed:ramayana -- --previous <old ramayana.json> --realign data/realign/<table>.json
 *
 * `--previous` defaults to the current output file, so a plain re-run keeps the
 * meanings where they are. Give `--realign` only when the numbering changes.
 */
import {
  FullChapter,
  FullScripture,
  FullVerse,
  fetchJson,
  log,
  writeScripture,
} from "./lib/scripture-schema";
import {
  carryOverMeanings,
  iastFromDevanagari,
  readPreviousScripture,
  readRealignment,
  uniqueVerseNumbers,
} from "./lib/realign-meanings";

const BASE = "https://raw.githubusercontent.com/bhavykhatri/DharmicData/master/ValmikiRamayana";
const OUTPUT = "public/data/scriptures-full/ramayana.json";

const KANDAS: { file: string; number: number; title: string; titleSanskrit: string }[] = [
  { file: "1_balakanda.json", number: 1, title: "Bala Kanda", titleSanskrit: "बालकाण्ड" },
  { file: "2_ayodhyakanda.json", number: 2, title: "Ayodhya Kanda", titleSanskrit: "अयोध्याकाण्ड" },
  { file: "3_aranyakanda.json", number: 3, title: "Aranya Kanda", titleSanskrit: "अरण्यकाण्ड" },
  { file: "4_kishkindhakanda.json", number: 4, title: "Kishkindha Kanda", titleSanskrit: "किष्किन्धाकाण्ड" },
  { file: "5_sundarakanda.json", number: 5, title: "Sundara Kanda", titleSanskrit: "सुन्दरकाण्ड" },
  { file: "6_yudhhakanda.json", number: 6, title: "Yuddha Kanda", titleSanskrit: "युद्धकाण्ड" },
  { file: "7_uttarakanda.json", number: 7, title: "Uttara Kanda", titleSanskrit: "उत्तरकाण्ड" },
];

// Source schema (verified against DharmicData/ValmikiRamayana on 2026-10-25):
//   { kaanda: string, sarg: number, shloka: number, text: string }
// `text` holds the Sanskrit mūla verse, ending in a reference marker such as
// "॥१-१-२॥" (kanda-sarga-shloka). There is no Hindi/English translation field
// in this corpus — translations need a separate source.
interface RawVerse {
  kaanda?: string;
  sarg?: number;
  shloka?: number;
  text?: string;
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

/**
 * Drops the trailing "॥१-१-२॥" / "।। ६.६५.३५ ।।" reference and ends the shloka with "॥".
 * Visarga typed as ":" (much of the Ayodhya Kanda) becomes "ः".
 */
function cleanShloka(text: string): string {
  const body = text
    .replace(/([ऀ-ॿ]):/g, "$1ः")
    .replace(/।।/g, "॥")
    .replace(/\s*[।॥|]+\s*[०-९0-9]+(?:\s*[-.]\s*[०-९0-9]+)*\s*[।॥|]*\s*$/, "")
    .replace(/[\s।॥|]+$/, "")
    .replace(/।(?=\S)/g, "। ")
    .replace(/\s+/g, " ")
    .trim();
  return body ? `${body} ॥` : "";
}

async function main(): Promise<void> {
  const previousPath = arg("--previous") ?? OUTPUT;
  const realignPath = arg("--realign");
  const previous = readPreviousScripture(previousPath);
  const realign = realignPath ? readRealignment(realignPath, "ramayana") : undefined;

  log("Fetching Valmiki Ramayana from DharmicData...");

  const chapters: FullChapter[] = [];
  let totalVerses = 0;

  for (const k of KANDAS) {
    const raw = await fetchJson<RawVerse[]>(`${BASE}/${k.file}`);

    const verses: FullVerse[] = raw.map((v, i) => {
      const sanskrit = typeof v.text === "string" ? cleanShloka(v.text) : "";
      return {
        // "sarga.shloka" keeps verses unique within a kanda even though shloka counts reset each sarga.
        number:
          typeof v.sarg === "number" && typeof v.shloka === "number" ? `${v.sarg}.${v.shloka}` : i + 1,
        sanskrit,
        transliteration: sanskrit ? iastFromDevanagari(sanskrit) : "",
      };
    });
    // The source repeats some sarga.shloka pairs (e.g. verses of Aranya 24 filed under sarga 34).
    const renamed = uniqueVerseNumbers(verses);

    chapters.push({
      number: k.number,
      title: k.title,
      titleSanskrit: k.titleSanskrit,
      verses,
    });
    totalVerses += verses.length;
    log(`  ${k.title}: ${verses.length} verses${renamed ? ` (${renamed} repeated numbers suffixed)` : ""}`);
  }

  if (previous) {
    const { carried, dropped } = carryOverMeanings(previous.chapters, chapters, realign);
    log(`Meanings carried over from ${previousPath}: ${carried.length}`);
    for (const line of dropped) log(`  not carried: ${line}`);
  }

  const scripture: FullScripture = {
    id: "ramayana",
    title: "Valmiki Ramayana",
    titleSanskrit: "वाल्मीकि रामायण",
    category: "itihasa",
    source: {
      repo: "https://github.com/bhavykhatri/DharmicData",
      license: "Community dataset — verify license terms at source repo before redistribution.",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };

  const outPath = writeScripture(scripture);
  log(`Wrote ${totalVerses} verses across ${chapters.length} kandas -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
