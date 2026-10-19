/**
 * Turns the proofread transcription data/sources-local/vinayapatrika.txt ("@N" starts pada N; each stanza ends
 * with its number between double dandas) into data/sources-local/vinayapatrika.json, one chapter per pada.
 *
 *   node scripts/parse-vinayapatrika.mjs
 *   npx tsx scripts/rebuild-upanishads.ts vinayapatrika [--write]
 *
 * The text is Tulsidas's Brajbhasha, read from the page images of a printed edition; the editor's Hindi bhavartha is not reproduced.
 */
import fs from "node:fs";

const DEVA = "०१२३४५६७८९";
const dn = (n) => String(n).replace(/[0-9]/g, (d) => DEVA[Number(d)]);
const fromDeva = (s) => Number(s.replace(/[०-९]/g, (d) => DEVA.indexOf(d)));

const lines = fs.readFileSync("data/sources-local/vinayapatrika.txt", "utf8").split(/\r?\n/);
const chapters = [];
let cur = null;
let buf = [];
const warn = [];
for (const raw of lines) {
  const l = raw.trim();
  if (!l) continue;
  const m = l.match(/^@(\d+)$/);
  if (m) {
    if (buf.length) warn.push(`pada ${cur.number}: dangling text "${buf.join(" ").slice(0, 40)}"`);
    buf = [];
    cur = { number: Number(m[1]), title: `पद ${dn(m[1])}`, verses: [] };
    chapters.push(cur);
    continue;
  }
  if (!cur) continue;
  // A stanza ends with its number between double dandas; some printed lines carry several stanzas.
  const parts = l.split(/(॥\s*[०-९]+\s*॥)/).filter((p) => p !== "");
  for (const p of parts) {
    const e = p.match(/^॥\s*([०-९]+)\s*॥$/);
    if (e) {
      const num = fromDeva(e[1]);
      const text = buf.join(" ").replace(/\s+/g, " ").trim();
      buf = [];
      if (!text) continue;
      cur.verses.push({ number: num, sanskrit: `${text} ॥ ${dn(num)} ॥` });
    } else {
      buf.push(p.trim());
    }
  }
}
if (buf.length) warn.push(`pada ${cur.number}: dangling text "${buf.join(" ").slice(0, 40)}"`);
for (const c of chapters) {
  c.verses.forEach((v, i) => {
    if (v.number !== i + 1) warn.push(`pada ${c.number}: stanza ${i + 1} is numbered ${v.number}`);
  });
  if (!c.verses.length) warn.push(`pada ${c.number}: no stanzas`);
}
fs.writeFileSync(
  "data/sources-local/vinayapatrika.json",
  JSON.stringify(
    {
      note: "Tulsidas's Vinaya Patrika (279 padas), read from page images of a printed edition and proofread. One chapter per pada, stanza numbers as printed. The editor's Hindi bhavartha is not reproduced.",
      chapters,
    },
    null,
    1,
  ) + "\n",
);
console.log(`${chapters.length} padas, ${chapters.reduce((a, c) => a + c.verses.length, 0)} stanzas`);
console.log(warn.length ? warn.join("\n") : "no warnings");
