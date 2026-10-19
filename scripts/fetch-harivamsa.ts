/**
 * Harivamsa (the khila of the Mahabharata: Harivamsha, Vishnu and Bhavishya parvas) from sanskritdocuments.org
 * (doc_purana/harivanshapurANam.itx).
 *
 *   npx tsx scripts/fetch-harivamsa.ts                # writes data/sources-local/harivanshpuran.json
 *   npx tsx scripts/rebuild-upanishads.ts harivanshpuran [--write]
 *
 * One library chapter per adhyāya, numbered 1..N across the three parvas; the title records parva and adhyāya.
 * Verse numbers are the source's own and restart in each adhyāya. The short appendix sections that follow the
 * main text (santānagopāla mantra and similar, "(1) …") are not part of the Harivamsa and are skipped.
 */
import fs from "node:fs";
import { itxToDevanagari } from "./lib/itrans-parser";

const URL = "https://sanskritdocuments.org/doc_purana/harivanshapurANam.itx";
const DEVA_DIGITS = "०१२३४५६७८९";
const dn = (n: number) => String(n).replace(/[0-9]/g, (d) => DEVA_DIGITS[Number(d)]);
const BS = String.fromCharCode(92);

interface Chapter {
  number: number;
  title: string;
  verses: { number: number | string; sanskrit: string }[];
}

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

async function main() {
  const raw = await get(URL);
  const chapters: Chapter[] = [];
  let cur: Chapter | null = null;
  let buf: string[] = [];
  let total = 0;
  let skipped = 0;
  for (const line of raw.split(/\r?\n/)) {
    const sec = line.match(/^[\\]section[{](\d+)[\\]?[.](\d+)\s/);
    if (sec) {
      buf = [];
      cur = { number: chapters.length + 1, title: "Parva " + Number(sec[1]) + ", Adhyāya " + Number(sec[2]), verses: [] };
      chapters.push(cur);
      continue;
    }
    if (/^[\\]section[{]/.test(line)) {
      cur = null; // parva heading or appendix section
      buf = [];
      continue;
    }
    if (!cur) continue;
    const t = line.trim();
    if (!t || t.startsWith("%") || t.startsWith(BS) || t.startsWith("#") || t.includes("##")) continue;
    // Colophon: "iti shrImahAbhArate … adhyAyaH || N||" ends the adhyāya and is not a verse.
    if (/adhy[Aa]+yaH\s*[|][|]\s*\d+\s*[|][|]/.test(t) || /parvaNi\s*$/i.test(t)) {
      buf = [];
      continue;
    }
    // "|| 12||" normally; every tenth verse is printed "|| 1\.1\.10||" (parva.adhyāya.verse).
    const end = t.match(/[|][|]\s*(?:\d+[\\]?[.]\d+[\\]?[.])?(\d+)(?:[\\]?-\d+)?\s*[|][|]\s*$/);
    if (end) {
      const text = [...buf, t.replace(/[|][|]\s*(?:\d+[\\]?[.]\d+[\\]?[.])?\d+(?:[\\]?-\d+)?\s*[|][|]\s*$/, "").trim()]
        .filter((l) => !/(?:uvAcha|UchuH)\s*[|]*\s*$/i.test(l))
        .join(" ")
        .replace(/\([^)]*\)/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      buf = [];
      const sanskrit = itxToDevanagari(text);
      if (!/[ऀ-ॿ]/.test(sanskrit) || sanskrit.replace(/[^ऀ-ॿ]/g, "").length < 4) {
        skipped++;
        continue;
      }
      const num = Number(end[1]);
      // A few verse numbers repeat within an adhyāya; keep every verse and tell repeats apart (101, 101b, 101c).
      const seen = cur.verses.filter((v) => String(v.number).replace(/[a-z]$/, "") === String(num)).length;
      const label: number | string = seen === 0 ? num : String(num) + String.fromCharCode(97 + seen);
      cur.verses.push({ number: label, sanskrit: sanskrit + " ॥ " + dn(num) + " ॥" });
      total++;
    } else {
      buf.push(t);
    }
  }
  // "Parva 0" is the Māhātmya appendix at the end of the file, not part of the three parvas.
  const kept = chapters.filter((c) => c.verses.length > 0 && !/^Parva 0,/.test(c.title));
  kept.forEach((c, i) => {
    c.number = i + 1;
  });
  fs.mkdirSync("data/sources-local", { recursive: true });
  fs.writeFileSync(
    "data/sources-local/harivanshpuran.json",
    JSON.stringify(
      {
        note: "Sanskrit shlokas of the Harivamsa (Harivamsha, Vishnu and Bhavishya parvas) from sanskritdocuments.org. One chapter per adhyaya; verse numbers as printed in the source (restarting in each adhyaya). Appendix sections are not included.",
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
