/**
 * Register check for staged व्याख्या drafts (see docs/vyakhya-guide.md).
 * Prints every sentence that uses a colloquial, Urdu-Persian or English word
 * the guide replaces, then word-count stats. Exits 1 if anything needs fixing.
 *
 *   node scripts/check-hindi-register.mjs data/ai-commentary/staged/bhagavadgita-04.json [more.json …]
 */
import fs from "node:fs";

const WORDS = [
  "चीज़", "चीज", "ज़रूरत", "जरूरत", "ज़रूरी", "जरूरी", "जरूरतमंद", "कीमत", "खतरनाक", "दीवार", "बेकार", "दबाव",
  "शर्त", "बिल्कुल", "परवाह", "मेहनत", "बेचैन", "भरोसा", "पसंद", "सही", "गलत", "ग़लत", "पैदा", "आदत", "हिस्सा",
  "हिस्से", "आराम", "याद", "शुरू", "शुरुआत", "ज़िंदगी", "जिंदगी", "दुनिया", "मदद", "कोशिश", "फायदा", "नुकसान",
  "वजह", "खुद", "ख़ुद", "मुश्किल", "इस्तेमाल", "ज़्यादा", "ज्यादा", "सिर्फ", "सिर्फ़", "लेकिन", "हमेशा", "आसान",
  "तरीका", "तरीके", "खास", "ख़ास", "दिल", "खुश", "इंसान", "सवाल", "जवाब", "शायद", "मतलब", "पूरी तरह", "तस्वीर",
  "कमज़ोर", "कमजोर", "इशारा", "साफ", "बस", "जानबूझकर", "आखिर", "दरवाज", "ईमानदार", "ईमानदारी", "ज़बरदस्ती",
  "जबरदस्ती", "ज़ोर", "जोर", "बेहतर", "बहाना", "किस्मत", "मौका", "ताकत", "ताक़त",
  "नकल", "हावी", "सौदा", "सौदे", "ताज़गी", "मज़हब", "तनाव", "थकान",
];
const DEV = "ऀ-ॿ";
const PATTERNS = WORDS.map((w) => [w, new RegExp(`(^|[^${DEV}])${w}(ें|ों|ी|े|ा)?(?=$|[^${DEV}])`, "u")]);
// Informal address to the reader. Inside a quoted teaching (Bhagavan to Arjuna) it is fine; review by eye.
const INFORMAL = /(^|[^ऀ-ॿ])(तुम|तुम्हें|तुम्हारा|तुम्हारी|तुम्हारे)(?=$|[^ऀ-ॿ])/u;

const files = process.argv.slice(2);
if (!files.length) {
  console.error("usage: node scripts/check-hindi-register.mjs <staged.json> [more.json …]");
  process.exit(2);
}
const drafts = Object.assign({}, ...files.map((f) => JSON.parse(fs.readFileSync(f, "utf8"))));

const lengths = [];
let toFix = 0;
let informal = 0;
for (const [key, entry] of Object.entries(drafts)) {
  const text = entry.explanation ?? "";
  lengths.push(text.split(/\s+/).filter(Boolean).length);
  for (const sentence of text.split(/(?<=[।?!])\s+/)) {
    const hits = PATTERNS.filter(([, r]) => r.test(sentence)).map(([w]) => w);
    if (hits.length) {
      toFix++;
      console.log(`${key} [${hits.join(",")}] ${sentence.slice(0, 170)}`);
    }
    if (INFORMAL.test(sentence) && !/['‘"“]/.test(sentence)) {
      informal++;
      console.log(`${key} [तुम: check it is inside the teaching, not addressed to the reader] ${sentence.slice(0, 140)}`);
    }
  }
}
const avg = Math.round(lengths.reduce((a, b) => a + b, 0) / Math.max(1, lengths.length));
console.log(
  `verses ${lengths.length}, sentences to fix ${toFix}, तुम to check ${informal}, words min ${Math.min(...lengths)} max ${Math.max(...lengths)} avg ${avg}`,
);
const short = Object.entries(drafts).filter(([, e]) => (e.explanation ?? "").split(/\s+/).length < 150).map(([k]) => k);
if (short.length) console.log(`shorter than 150 words (the guide asks for about 200–280): ${short.join(", ")}`);
process.exit(toFix ? 1 : 0);
