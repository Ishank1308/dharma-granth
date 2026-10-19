/**
 * Taittiriya Upanishad (Shiksha, Brahmananda and Bhrigu vallis; 12 + 9 + 10 anuvakas) from sanskritdocuments.org
 * (doc_upanishhat/taitaccent.itx, the Vedic-accent file, with the accent marks removed).
 *
 *   npx tsx scripts/fetch-taittiriya.ts            # writes data/sources-local/taittiriya.json
 *   npx tsx scripts/rebuild-upanishads.ts taittiriya [--write]
 *
 * One chapter per valli, one verse per anuvaka (the traditional unit; the numbered mantras inside it are kept in the text).
 */
import fs from "node:fs";
import { itxToDevanagari } from "./lib/itrans-parser";

const URL = "https://sanskritdocuments.org/doc_upanishhat/taitaccent.itx";
const DEVA_DIGITS = "०१२३४५६७८९";
const dn = (n: number) => String(n).replace(/[0-9]/g, (d) => DEVA_DIGITS[Number(d)]);
const BS = String.fromCharCode(92);
const VALLIS = [
  { title: "Śīkṣā Vallī", sa: "शीक्षावल्ली" },
  { title: "Brahmānanda Vallī", sa: "ब्रह्मानन्दवल्ली" },
  { title: "Bhṛgu Vallī", sa: "भृगुवल्ली" },
];

async function main() {
  const raw = await (await fetch(URL)).text();
  const lines = raw.split(/\r?\n/);
  const chapters: { number: number; title: string; titleSanskrit: string; verses: { number: number; sanskrit: string }[] }[] = [];
  let cur: (typeof chapters)[number] | null = null;
  let buf: string[] = [];
  for (const line of lines) {
    if (line.startsWith(BS + "section{")) {
      cur = { number: chapters.length + 1, title: VALLIS[chapters.length].title, titleSanskrit: VALLIS[chapters.length].sa, verses: [] };
      chapters.push(cur);
      buf = [];
      continue;
    }
    if (!cur) continue;
    let t = line.trim();
    if (!t || t.startsWith("%") || t.startsWith(BS) || t.startsWith("#")) continue;
    if (/^\.\.\s*iti\s+\S+\s+samAptA/.test(t)) {
      buf = [];
      continue;
    }
    const closing = /(?:^|\s)(?:iti\s+)?\S*anuvAkaH\s*\.\.\s*$/.test(t);
    if (closing) {
      t = t.replace(/\s*(?:iti\s+)?\S*\.anuvAkaH\s*\.\.\s*$/, "").replace(/\s*(?:iti\s+)?\S*anuvAkaH\s*\.\.\s*$/, "");
      if (t) buf.push(t);
      const body = buf
        .join(" ")
        .replace(/##[^#]*##/g, "")
        .replace(/\.a\.a\.a \./g, "")
        .replace(/\{\\m\+\}/g, "M")
        .replace(/\\[`'"]/g, "")
        .replace(/[`'"]/g, "")
        .replace(/\.\.\s*(\d+)\s*\.\./g, (_m, n) => "|| " + n + " ||")
        .replace(/\s+/g, " ")
        .trim();
      buf = [];
      const dev = itxToDevanagari(body).replace(/\|\|\s*([0-9]+)\s*\|\|/g, (_m, n) => "॥ " + dn(Number(n)) + " ॥");
      const num = cur.verses.length + 1;
      cur.verses.push({ number: num, sanskrit: dev + " ॥ इति अनुवाकः ॥" });
    } else {
      buf.push(t);
    }
  }
  fs.writeFileSync(
    "data/sources-local/taittiriya.json",
    JSON.stringify({ note: "Taittiriya Upanishad (Sanskrit mula, accents removed) from sanskritdocuments.org; one verse per anuvaka.", chapters }, null, 1) + "\n",
  );
  console.log(chapters.map((c) => c.title + " " + c.verses.length).join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
