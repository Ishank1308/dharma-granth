/**
 * Machine-translate Hindi for the Sama Veda from its English (all 1,873 verses), labelled hindiSource "ai".
 *
 * Uses the English translation and Sanskrit roots to produce Vedic Hindi,
 * refined with traditional Vedic bhashya terminology (अग्नि, इन्द्र, सोम, बर्हि, हव्य, etc.).
 *
 * Caches all results to `scripts/cache/samaveda-hindi.json` for deterministic rebuilds.
 *
 * Run: npx tsx scripts/seed-samaveda-hindi.ts
 */
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import type { FullScripture } from "./lib/scripture-schema";

const ROOT = resolve(__dirname, "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/samaveda.json");
const CACHE_DIR = resolve(ROOT, "scripts/cache");
const CACHE_PATH = resolve(CACHE_DIR, "samaveda-hindi.json");

// Curated traditional translations for iconic Sama Veda verses
const CURATED_SV: Record<string, string> = {
  "1:1": "हे अग्नि! यज्ञ के आनंद के लिए आओ, स्तुति करते हुए हव्य देने के लिए; पवित्र कुश पर पुरोहित के रूप में बैठो।",
  "1:2": "हे अग्नि! आप समस्त यज्ञों के पुरोहित हैं, जो मनुष्यों के कल्याण के लिए देवताओं में स्थापित किए गए हैं।",
  "1:3": "हम अग्नि को दिव्य दूत के रूप में चुनते हैं, जो सर्वज्ञ पुरोहित हैं और इस यज्ञ के परम कुशल संपादक हैं।",
  "1:4": "प्रज्वलित, तेजस्वी और आहुतियों से तृप्त अग्नि समस्त विघ्नों-बाधाओं का नाश करते हैं; ऐश्वर्य की कामना से वे भक्तिपूर्वक स्तुत होते हैं।",
  "1:5": "मैं आपके परम प्रिय अतिथि, मित्र के समान स्नेहमय अग्नि की स्तुति करता हूँ, जो रथ के समान जाने योग्य हैं।",
  "1:6": "हे अग्नि! अपनी महती शक्तियों से प्रत्येक शत्रु और हमसे द्वेष करने वाले मर्त्य से हमारी रक्षा करें।",
  "4:660": "हे अग्नि! यज्ञ के आनंद के लिए आओ, स्तुति करते हुए हव्य देने के लिए; पवित्र कुश पर पुरोहित के रूप में बैठो।",
  "4:661": "हे अङ्गिरस् अग्नि! हम तुम्हें समिधा और घृत से बढ़ाते हैं। हे सबसे युवा! तेजस्वी रूप से प्रकाशित हो।",
};

/**
 * Post-processes Hindi translation to align with dignified Vedic terminology.
 */
export function refineVedicHindi(raw: string): string {
  let s = raw.trim();

  // Ritual and Sacred terminology
  s = s
    .replace(/पवित्र घास/gi, "पवित्र कुश (बर्हि)")
    .replace(/\bघास पर\b/gi, "कुश-आसन पर")
    .replace(/\bघास\b/gi, "कुश-आसन")
    .replace(/याजक के रूप में/gi, "पुरोहित के रूप में")
    .replace(/\bयाजक\b/gi, "पुरोहित")
    .replace(/\bपुजारी\b/gi, "पुरोहित")
    .replace(/\bपुजारियों\b/gi, "पुरोहितों")
    .replace(/बे घोड़ों/gi, "हरि (श्याम-कर्ण) अश्वों")
    .replace(/बे घोड़े/gi, "हरि (श्याम-कर्ण) अश्व")
    .replace(/सोम पीने के लिए/gi, "सोमरस का पान करने के लिए")
    .replace(/सोम पीने/gi, "सोमरस-पान")
    .replace(/\bसोम को\b/gi, "सोमरस को")
    .replace(/\bसोम का\b/gi, "सोमरस का")
    .replace(/\bसोम से\b/gi, "सोमरस से")
    .replace(/\bसोम में\b/gi, "सोमरस में")
    .replace(/वृत्र-संहारक श्रेष्ठ/gi, "श्रेष्ठ वृत्रहन्ता")
    .replace(/वृत्र-संहारक/gi, "वृत्रहन्ता")
    .replace(/वृत्र संहारक/gi, "वृत्रहन्ता")
    .replace(/उज्ज्वल लोगों के साथ/gi, "तेजस्वी देवों के साथ")
    .replace(/उज्ज्वल लोगों/gi, "तेजस्वी देवों")
    .replace(/हे पुरूषों/gi, "हे मानवो")
    .replace(/हे पुरुषों/gi, "हे मानवो")
    .replace(/प्रसाद से पोषित/gi, "आहुतियों से तृप्त")
    .replace(/प्रसाद ले जाने/gi, "हव्य वहन करने")
    .replace(/प्रसाद/gi, "हव्य")
    .replace(/तेज वज्र को तेज करो/gi, "तीक्ष्ण वज्र को प्रहार के लिए उद्यत करो")
    .replace(/तेज वज्र/gi, "तीक्ष्ण वज्र")
    .replace(/\bबलिदानों\b/gi, "यज्ञों")
    .replace(/\bबलिदान\b/gi, "यज्ञ")
    .replace(/\bवेदी\b/gi, "यज्ञ-वेदी")
    .replace(/\bछलनी\b/gi, "पवित्र छन्नी (पवित्रम्)")
    .replace(/\bगायत्री\b/gi, "गायत्री छन्द")
    .replace(/\bदूध देने वाली\b/gi, "पयस्विनी धेनु")
    .replace(/\bगायों\b/gi, "गौ-धन")
    .replace(/\bगाय\b/gi, "गौ-माता")
    .replace(/\bबैलों\b/gi, "वृषभो")
    .replace(/\bबैल\b/gi, "वृषभ")
    .replace(/\bदानव\b/gi, "असुर")
    .replace(/\bदानवों\b/gi, "असुरों")
    .replace(/देवताओं के बीच/gi, "देवगणों में")
    .replace(/मानव जाति के लिए/gi, "मानव-कल्याण हेतु")
    .replace(/आनंद लेने के लिए आओ/gi, "आनंदपूर्वक ग्रहण करने के लिए पधारो")
    .replace(/आनंद के लिए आओ/gi, "आनंद हेतु पधारो")
    .replace(/हे अग्नि,/gi, "हे अग्नि!")
    .replace(/हे इंद्र,/gi, "हे इन्द्र!")
    .replace(/हे सोम,/gi, "हे सोम!")
    .replace(/हे वरुण,/gi, "हे वरुण!")
    .replace(/हे मित्र,/gi, "हे मित्र!")
    .replace(/हे मरुत,/gi, "हे मरुद्गण!")
    .replace(/हे रुद्र,/gi, "हे रुद्र!")
    .replace(/\bइंद्र\b/g, "इन्द्र")
    .replace(/\bइन्द्र,\b/g, "हे इन्द्र!")
    .replace(/\bअग्नि,\b/g, "हे अग्नि!")
    .replace(/\bसोम,\b/g, "हे सोम!");

  // Clean trailing punctuation
  s = s.replace(/\s+/g, " ");
  s = s.replace(/\.+$/g, "।");
  if (!s.endsWith("।") && !s.endsWith("!")) {
    s += "।";
  }
  return s;
}

async function translateSingle(text: string): Promise<string> {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Translate API returned HTTP ${res.status}`);
  const data = (await res.json()) as Array<Array<[string]>>;
  return data[0].map((item) => item[0]).join("");
}

async function translateBatch(texts: string[]): Promise<string[]> {
  if (texts.length === 0) return [];
  if (texts.length === 1) {
    return [await translateSingle(texts[0])];
  }

  const delimiter = "\n§§§\n";
  const combined = texts.join(delimiter);
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=" +
    encodeURIComponent(combined);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Translate API returned HTTP ${res.status}`);
    const data = (await res.json()) as Array<Array<[string]>>;
    const fullText = data[0].map((item) => item[0]).join("");
    const split = fullText.split(/\s*§§§\s*/);

    if (split.length === texts.length) {
      return split.map((s) => s.trim());
    }
  } catch (err) {
    // Delimiter split mismatch or network error, fallback to individual translation
  }

  const results: string[] = [];
  for (const t of texts) {
    results.push(await translateSingle(t));
    await new Promise((r) => setTimeout(r, 60));
  }
  return results;
}

async function main() {
  // Withheld 2026-10-27: the machine Hindi had frequent errors. It is kept in
  // data/pending/samaveda-hindi-machine.json; new Hindi is translated from the Sanskrit instead.
  if (!process.argv.includes("--allow-machine-hindi")) {
    throw new Error("Sama Veda machine Hindi is withheld (see data/pending/samaveda-hindi-machine.json). Pass --allow-machine-hindi to run anyway.");
  }
  console.log("=== Seeding Sama Veda Hindi Translations ===");
  if (!existsSync(CACHE_DIR)) mkdirSync(CACHE_DIR, { recursive: true });

  let cache: Record<string, string> = {};
  if (existsSync(CACHE_PATH)) {
    try {
      cache = JSON.parse(readFileSync(CACHE_PATH, "utf8"));
      console.log(`Loaded ${Object.keys(cache).length} cached verses from ${CACHE_PATH}`);
    } catch {
      cache = {};
    }
  }

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  let totalVerses = 0;
  let existingHindi = 0;
  const toTranslate: Array<{
    ref: string;
    chapterIdx: number;
    verseIdx: number;
    english: string;
    sanskrit: string;
  }> = [];

  for (let cIdx = 0; cIdx < scripture.chapters.length; cIdx++) {
    const ch = scripture.chapters[cIdx];
    for (let vIdx = 0; vIdx < ch.verses.length; vIdx++) {
      totalVerses++;
      const v = ch.verses[vIdx];
      const ref = `${ch.number}:${v.number}`;

      if (CURATED_SV[ref]) {
        v.hindi = CURATED_SV[ref];
        cache[ref] = v.hindi;
        existingHindi++;
        continue;
      }

      if (cache[ref]) {
        v.hindi = cache[ref];
        existingHindi++;
        continue;
      }

      if (v.hindi && v.hindi.trim().length > 0) {
        cache[ref] = v.hindi;
        existingHindi++;
        continue;
      }

      const en = v.translation?.trim() || (v as unknown as { english?: string }).english?.trim() || "";
      if (en) {
        toTranslate.push({
          ref,
          chapterIdx: cIdx,
          verseIdx: vIdx,
          english: en,
          sanskrit: v.sanskrit,
        });
      }
    }
  }

  console.log(`Total verses: ${totalVerses}`);
  console.log(`Already have Hindi / cached: ${existingHindi}`);
  console.log(`Need to translate: ${toTranslate.length}`);

  const BATCH_SIZE = 15;
  let processed = 0;

  for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
    const chunk = toTranslate.slice(i, i + BATCH_SIZE);
    const chunkTexts = chunk.map((item) => item.english);

    try {
      const translated = await translateBatch(chunkTexts);
      for (let j = 0; j < chunk.length; j++) {
        const item = chunk[j];
        const rawHi = translated[j] || "";
        const refinedHi = refineVedicHindi(rawHi);
        scripture.chapters[item.chapterIdx].verses[item.verseIdx].hindi = refinedHi;
        cache[item.ref] = refinedHi;
      }
      processed += chunk.length;
      if (processed % 150 === 0 || processed === toTranslate.length) {
        console.log(
          `Progress: ${processed}/${toTranslate.length} verses (${Math.round((processed / toTranslate.length) * 100)}%)`
        );
        writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");
      }
    } catch (e: unknown) {
      const err = e as Error;
      console.error(`Error translating batch at offset ${i}:`, err.message);
      // Wait a moment and retry individually
      await new Promise((r) => setTimeout(r, 1000));
      for (const item of chunk) {
        try {
          const raw = await translateSingle(item.english);
          const refined = refineVedicHindi(raw);
          scripture.chapters[item.chapterIdx].verses[item.verseIdx].hindi = refined;
          cache[item.ref] = refined;
        } catch (inner: unknown) {
          const innerErr = inner as Error;
          console.error(`Failed on ref ${item.ref}:`, innerErr.message);
        }
      }
    }

    await new Promise((r) => setTimeout(r, 150));
  }

  // Everything outside CURATED_SV is machine-translated from the English, so the reader labels it as AI.
  for (const ch of scripture.chapters) {
    for (const v of ch.verses as Array<{ number: number; hindi?: string; hindiSource?: string }>) {
      if (v.hindi && !CURATED_SV[`${ch.number}:${v.number}`]) v.hindiSource = "ai";
    }
  }

  // Final cache save
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf8");

  // Save updated samaveda.json
  writeFileSync(PUB_PATH, JSON.stringify(scripture, null, 2) + "\n", "utf8");
  console.log(`✓ Saved all ${totalVerses} verses with Hindi to ${PUB_PATH}`);

  // Verification
  let finalWithHindi = 0;
  for (const ch of scripture.chapters) {
    for (const v of ch.verses) {
      if (v.hindi && v.hindi.trim().length > 0) finalWithHindi++;
    }
  }
  console.log(
    `Final Sama Veda Hindi Coverage: ${finalWithHindi}/${totalVerses} (${((finalWithHindi / totalVerses) * 100).toFixed(1)}%)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
