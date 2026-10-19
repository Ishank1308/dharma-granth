/**
 * Patanjali Yoga Sutras (196 sutras, 4 padas) from sanskritdocuments.org (doc_yoga/yogasuutra.itx, the unaccented
 * second half of the file), written as the full-scripture JSON the site reads.
 *
 *   npx tsx scripts/fetch-yogasutra.ts            # writes public/data/scriptures-full/yogasutra.json
 *   npm run shard:scriptures                      # shards it into per-chapter files
 *
 * Sanskrit mula only (public domain); no translation or commentary is copied from any modern edition.
 */
import fs from "node:fs";
import Sanscript from "@indic-transliteration/sanscript";
import { itxToDevanagari } from "./lib/itrans-parser";

const URL = "https://sanskritdocuments.org/doc_yoga/yogasuutra.itx";
const DEVA_DIGITS = "०१२३४५६७८९";
const dn = (n: number) => String(n).replace(/[0-9]/g, (d) => DEVA_DIGITS[Number(d)]);
const BS = String.fromCharCode(92);

const PADAS = [
  { title: "Samādhi Pāda", sa: "समाधिपादः" },
  { title: "Sādhana Pāda", sa: "साधनपादः" },
  { title: "Vibhūti Pāda", sa: "विभूतिपादः" },
  { title: "Kaivalya Pāda", sa: "कैवल्यपादः" },
];

async function main() {
  const raw = await (await fetch(URL)).text();
  const lines = raw.split(/\r?\n/);
  // The file holds the accented text first and the plain text second; the second set of \section lines starts the plain text.
  const sections = lines.map((l, i) => (l.startsWith(BS + "section{") ? i : -1)).filter((i) => i >= 0);
  const start = sections[4];
  if (start === undefined) throw new Error("plain text block not found");
  const sec = (name: string) => name;
  void sec;

  const chapters: { number: number; title: string; titleSanskrit: string; verses: any[] }[] = [];
  let cur: (typeof chapters)[number] | null = null;
  let buf: string[] = [];
  let total = 0;
  for (const line of lines.slice(start)) {
    if (line.startsWith(BS + "section{")) {
      cur = {
        number: chapters.length + 1,
        title: PADAS[chapters.length].title,
        titleSanskrit: PADAS[chapters.length].sa,
        verses: [],
      };
      chapters.push(cur);
      buf = [];
      continue;
    }
    if (!cur) continue;
    const t = line.replace(/\([^)]*\)\s*$/, "").trim(); // drop trailing variant-reading notes
    if (!t || t.startsWith("%") || t.startsWith("#")) continue;
    if (/^[|][|]\s*iti\s/.test(t)) {
      buf = [];
      continue;
    }
    const end = t.match(/[|][|]\s*(\d+)[\\]?[.](\d+)\s*[|][|]\s*$/);
    if (end) {
      const body = [...buf, t.replace(/[|][|]\s*\d+[\\]?[.]\d+\s*[|][|]\s*$/, "")].join(" ").replace(/[\\]-\s*/g, "").replace(/\s+/g, " ").trim();
      buf = [];
      const sanskrit = itxToDevanagari(body);
      const num = Number(end[2]);
      cur.verses.push({
        number: num,
        sanskrit: sanskrit + " ॥ " + dn(num) + " ॥",
        transliteration: Sanscript.t(sanskrit, "devanagari", "iast") + " ||",
      });
      total++;
    } else {
      buf.push(t);
    }
  }
  const out = {
    id: "yogasutra",
    title: "Patanjali Yoga Sutras",
    titleSanskrit: "पातञ्जल योगसूत्र",
    category: "other",
    totalVerses: total,
    totalChapters: chapters.length,
    source: {
      repo: "https://sanskritdocuments.org/doc_yoga/",
      license: "Sanskrit mūla — public domain. sanskritdocuments.org publishes digitized text under permissive terms.",
      fetchedAt: new Date().toISOString(),
    },
    chapters,
  };
  fs.writeFileSync("public/data/scriptures-full/yogasutra.json", JSON.stringify(out));
  console.log(chapters.map((c) => c.title + " " + c.verses.length).join(", "), "total", total);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
