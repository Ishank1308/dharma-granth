/**
 * Devi Bhagavatam (Mahapurana, 12 skandhas, 18,000 shlokas) from sanskritdocuments.org
 * (doc_purana/devIbhAgavatam01..12.itx, encoded and proofread by Vishwas Bhide).
 *
 *   npx tsx scripts/fetch-devibhagavat.ts            # writes data/sources-local/devibhagavat.json
 *   npx tsx scripts/rebuild-upanishads.ts devibhagavat [--write]
 *
 * One library chapter per adhyāya, numbered 1..N across the skandhas; the title records skandha and adhyāya.
 * Verses are numbered per adhyāya as the source prints them. The Māhātmya (file 00) is a later add-on and is skipped.
 */
import fs from "node:fs";
import { itxToDevanagari } from "./lib/itrans-parser";

const BASE = "https://sanskritdocuments.org/doc_purana/devIbhAgavatam";
const SKANDHAS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const DEVA_DIGITS = "०१२३४५६७८९";
const dn = (n: number) => String(n).replace(/[0-9]/g, (d) => DEVA_DIGITS[Number(d)]);
const BS = String.fromCharCode(92);

async function get(url: string): Promise<string> {
  for (let i = 0; i < 4; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return await r.text();
    } catch {
      // retry
    }
    await new Promise((res) => setTimeout(res, 1500));
  }
  throw new Error("could not fetch " + url);
}

interface Chapter {
  number: number;
  title: string;
  verses: { number: number | string; sanskrit: string }[];
}

async function main() {
const chapters: Chapter[] = [];
let total = 0;
let skipped = 0;

for (const sk of SKANDHAS) {
  const raw = await get(BASE + sk + ".itx");
  const lines = raw.split(/\r?\n/);
  let cur: Chapter | null = null;
  let buf: string[] = [];
  for (const line of lines) {
    const sec = line.match(/^.section\{(\d+)\\?\.(\d+)\s+([^}]*)\}/);
    if (sec) {
      buf = [];
      cur = {
        number: chapters.length + 1,
        title: "Skandha " + Number(sec[1]) + ", Adhyāya " + Number(sec[2]),
        verses: [],
      };
      chapters.push(cur);
      continue;
    }
    if (!cur) continue;
    const t = line.trim();
    if (!t || t.startsWith("%") || t.startsWith(BS) || t.startsWith("#")) continue;
    // Colophon lines carry "|| <skandha>\.<adhyaya>||"; they end the adhyāya and are not verses.
    if (/^iti\s+shrI/i.test(t) || /adhyAyaH\s*\|\|\s*\d+\\?\.\d+\s*\|\|/.test(t) || /samAptaH\s*\|\|/.test(t)) {
      buf = [];
      continue;
    }
    const end = t.match(/\|\|\s*(\d+)(?:\\?-\d+)?\s*\|\|\s*$/);
    if (end) {
      const text = [...buf, t.replace(/\|\|\s*\d+(?:\\?-\d+)?\s*\|\|\s*$/, "").trim()]
        .filter((l) => !/uvAcha\s*\\?-?\s*$/i.test(l))
        .join(" ")
        .replace(/\([^)]*\)/g, " ")
        .replace(/\\-/g, "-")
        .replace(/\s+/g, " ")
        .trim();
      buf = [];
      const sanskrit = itxToDevanagari(text);
      const hasText = /[ऀ-ॿ]/.test(sanskrit) && sanskrit.replace(/[^ऀ-ॿ]/g, "").length >= 4;
      if (!hasText) {
        skipped++;
        continue;
      }
      const num = Number(end[1]);
      // The source repeats a verse number within an adhyāya in a few places; keep every verse and tell repeats apart (101, 101b, 101c).
      const seen = cur.verses.filter((v) => String(v.number).replace(/[a-z]$/, "") === String(num)).length;
      const label: number | string = seen === 0 ? num : String(num) + String.fromCharCode(97 + seen);
      cur.verses.push({ number: label, sanskrit: sanskrit + " ॥ " + dn(num) + " ॥" });
      total++;
    } else {
      buf.push(t);
    }
  }
  console.log("skandha " + sk + ": chapters so far " + chapters.length + ", verses so far " + total);
}

const kept = chapters.filter((c) => c.verses.length > 0);
kept.forEach((c, i) => {
  c.number = i + 1;
});
fs.mkdirSync("data/sources-local", { recursive: true });
fs.writeFileSync(
  "data/sources-local/devibhagavat.json",
  JSON.stringify(
    {
      note: "Sanskrit shlokas of the Devi Bhagavata Purana (skandhas 1-12) from sanskritdocuments.org, encoded and proofread by Vishwas Bhide. One chapter per adhyaya; verse numbers as printed in the source (restarting in each adhyaya). The Mahatmya is not included.",
      chapters: kept,
    },
    null,
    1,
  ) + "\n",
);
console.log("wrote " + kept.length + " chapters, " + total + " verses (" + skipped + " empty blocks skipped)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
