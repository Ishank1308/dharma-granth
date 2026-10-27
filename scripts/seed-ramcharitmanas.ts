/**
 * Seed Goswami Tulsidas's Ramcharitmanas: all seven kandas, one record per chaupai, doha, soratha, chhand and
 * shloka, under its Gita Press section number.
 *
 *   npx tsx scripts/seed-ramcharitmanas.ts            # dry run: counts, cross-check, writes nothing
 *   npx tsx scripts/seed-ramcharitmanas.ts --write    # writes public/data/scriptures-full/ramcharitmanas.json
 *
 * Text. The main source is DharmicData (bhavykhatri/DharmicData), whose Ramcharitmanas is taken from IIT Kanpur's
 * Ramcharitmanas site (the Gita Press text). It stops one section short in six kandas (Ayodhya 326, Aranya 46,
 * Kishkindha 30, Sundar 60, Lanka 121, Uttar 130 and the closing shlokas); those sections come from a second,
 * independent transcription of the same text (pawanprakashpal/RamayanaPath). Every section both sources carry is
 * compared line by line, and the result is printed. Both are pinned to a commit so a re-run gives the same text.
 * Only the original text is taken from either source. Their Hindi and English are the editions' own or of unknown
 * provenance, so they are not used.
 *
 * Numbering (chapter = kanda). A section is the run of chaupais (and any chhand) that ends with doha N, as the
 * Gita Press edition prints it:
 *   "N.k"   chaupai k of section N (a chaupai is two lines; a lone last line is numbered on its own, as printed)
 *   "N"     doha or soratha N; "Na", "Nb" … for N(क), N(ख) …
 *   "N.chj" chhand j of section N        "N.slj" shloka j inside section N (Rudrashtakam in Uttar 108)
 *   "0.j"   opening shloka j             "0.dj" opening doha or soratha j
 *   "E.j"   closing shloka j after the last section (Uttar Kanda)
 *
 * Meanings come only from data/ramcharitmanas-meanings.json: Hindi and English that Claude translated from the
 * Awadhi for chosen verses, published with hindiSource / translationSource "ai" so readers see the AI badge. Every
 * other verse has no meaning (its "not yet available" line), never filler.
 */
import fs from 'node:fs';
import path from 'node:path';
import Sanscript from '@indic-transliteration/sanscript';
import { FullChapter, FullScripture, FullVerse, fetchJson, log, writeScripture } from './lib/scripture-schema';

const DHARMIC_SHA = '96b3bafd47ffbfe1902f3f0ef7a1928dd43c34d7';
const SECOND_SHA = '0a376835fc9bba517f107d201e54aabf208d9a0b';
const DHARMIC = `https://raw.githubusercontent.com/bhavykhatri/DharmicData/${DHARMIC_SHA}/Ramcharitmanas`;
const SECOND = `https://raw.githubusercontent.com/pawanprakashpal/RamayanaPath/${SECOND_SHA}/data/tulsidas`;
const write = process.argv.includes('--write');
const MEANINGS = path.resolve(__dirname, '../data/ramcharitmanas-meanings.json');

const KANDAS = [
  { number: 1, file: '1_बाल_काण्ड_data.json', second: 'bal-kand.json', title: 'Bal Kanda', titleSanskrit: 'बालकाण्ड' },
  { number: 2, file: '2_अयोध्या_काण्ड_data.json', second: 'ayodhya-kand.json', title: 'Ayodhya Kanda', titleSanskrit: 'अयोध्याकाण्ड' },
  { number: 3, file: '3_अरण्य_काण्ड_data.json', second: 'aranya-kand.json', title: 'Aranya Kanda', titleSanskrit: 'अरण्यकाण्ड' },
  { number: 4, file: '4_किष्किन्धा_काण्ड_data.json', second: 'kishkindha-kand.json', title: 'Kishkindha Kanda', titleSanskrit: 'किष्किन्धाकाण्ड' },
  { number: 5, file: '5_सुंदर_काण्ड_data.json', second: 'sundar-kand.json', title: 'Sundar Kanda', titleSanskrit: 'सुन्दरकाण्ड' },
  { number: 6, file: '6_लंका_काण्ड_data.json', second: 'lanka-kand.json', title: 'Lanka Kanda', titleSanskrit: 'लंकाकाण्ड' },
  { number: 7, file: '7_उत्तर_काण्ड_data.json', second: 'uttar-kand.json', title: 'Uttar Kanda', titleSanskrit: 'उत्तरकाण्ड' },
];
// Sections DharmicData does not carry (its files stop one section early), taken whole from the second source.
const LAST_SECTION: Record<number, number> = { 1: 361, 2: 326, 3: 46, 4: 30, 5: 60, 6: 121, 7: 130 };

type Form = 'chaupai' | 'doha' | 'chhand' | 'shloka';
interface Unit { form: Form; lines: string[]; letter?: string }

/**
 * The only text not taken from a source file: what neither source carries, typed from the Gita Press edition.
 * Listed in the pull request for checking against a printed copy.
 */
const HAND_ENTERED: Record<string, { why: string; units: Unit[] }> = {
  '3.46': {
    why: 'the second source stops after the chaupais of Aranya 46',
    units: [
      {
        form: 'chhand',
        lines: [
          'कहि सक न सारद सेष नारद सुनत पद पंकज गहे।',
          'अस दीनबंधु कृपाल अपने भगत गुन निज मुख कहे॥',
          'सिरु नाइ बारहिं बार चरनन्हि ब्रह्मपुर नारद गए।',
          'ते धन्य तुलसीदास आस बिहाइ जे हरि रँग रँए॥',
        ],
      },
      { form: 'doha', letter: 'क', lines: ['रावनारि जसु पावन गावहिं सुनहिं जे लोग।', 'राम भगति दृढ़ पावहिं बिनु बिराग जप जोग॥'] },
      { form: 'doha', letter: 'ख', lines: ['दीप सिखा सम जुबति तन मन जनि होसि पतंग।', 'भजहि राम तजि काम मद करहि सदा सतसंग॥'] },
    ],
  },
  '7.E': {
    why: 'the second source runs the two closing shlokas together, with misspellings (श्रॆमद्, भाषाबद्ध्मिदम)',
    units: [
      {
        form: 'shloka',
        lines: [
          'यत्पूर्वं प्रभुणा कृतं सुकविना श्रीशम्भुना दुर्गमं',
          'श्रीमद्रामपदाब्जभक्तिमनिशं प्राप्त्यै तु रामायणम्।',
          'मत्वा तद्रघुनाथनामनिरतं स्वान्तस्तमःशान्तये',
          'भाषाबद्धमिदं चकार तुलसीदासस्तथा मानसम्॥',
        ],
      },
      {
        form: 'shloka',
        lines: [
          'पुण्यं पापहरं सदा शिवकरं विज्ञानभक्तिप्रदं',
          'मायामोहमलापहं सुविमलं प्रेमाम्बुपूरं शुभम्।',
          'श्रीमद्रामचरित्रमानसमिदं भक्त्यावगाहन्ति ये',
          'ते संसारपतङ्गघोरकिरणैर्दह्यन्ति नो मानवाः॥',
        ],
      },
    ],
  },
};
interface Section { n: number; units: Unit[]; from: 'dharmic' | 'second'; inferred?: boolean }

interface DharmicRecord { type?: string; content?: string }
interface SecondVerse { id: string; type: string; original: string }
interface SecondGroup { dohaNumber: number; verses: SecondVerse[] }

const LETTERS = ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ'];
// The section mark at a line's end: "।।57क।।", "।।3(ख)।।", and the source's slips "।।122 ।", "। 165।।".
const MARK = /\s*[।|]{1,2}\s*([0-9०-९]+)\s*\(?\s*([कखगघङचछ])?\s*\)?\s*[।|]{1,2}\s*$/;
const toAscii = (s: string) => s.replace(/[०-९]/g, (d) => String('०१२३४५६७८९'.indexOf(d)));

function cleanLine(line: string): string {
  return line.replace(/\s+/g, ' ').replace(/\s*।\s*।/g, '॥').replace(/\s*।(?!।)/g, '।').replace(/॥+/g, '॥').trim();
}

function linesOf(content: string): string[] {
  return content.split(/\n+/).map((l) => l.trim()).filter(Boolean);
}

/** Splits a record into pieces that each end with a numbered mark; text after the last mark is one more piece. */
function splitAtMarks(lines: string[]): { lines: string[]; n?: number; letter?: string }[] {
  const out: { lines: string[]; n?: number; letter?: string }[] = [];
  let cur: string[] = [];
  for (const line of lines) {
    const m = MARK.exec(line);
    if (m) {
      cur.push(line.slice(0, m.index) + '॥');
      out.push({ lines: cur, n: Number(toAscii(m[1])), letter: m[2] });
      cur = [];
    } else cur.push(line);
  }
  if (cur.length) out.push({ lines: cur });
  return out;
}

/** A doha / soratha ends at a line closed by a double danda; a record may hold several. */
function splitDohas(lines: string[]): { lines: string[]; n?: number; letter?: string }[] {
  const out: { lines: string[]; n?: number; letter?: string }[] = [];
  for (const piece of splitAtMarks(lines)) {
    let cur: string[] = [];
    piece.lines.forEach((line, i) => {
      cur.push(line);
      const last = i === piece.lines.length - 1;
      if (last) out.push({ lines: cur, n: piece.n, letter: piece.letter });
      else if (/(?:।।|॥)\s*$/.test(line) && cur.length >= 2) {
        out.push({ lines: cur });
        cur = [];
      }
    });
  }
  return out;
}

function parseDharmic(records: DharmicRecord[]): { sections: Section[]; opening: Unit[]; problems: string[] } {
  const sections: Section[] = [];
  const opening: Unit[] = [];
  const problems: string[] = [];
  let pending: Unit[] = [];
  let seenChaupai = false;
  let lastN = 0;
  for (const rec of records) {
    const lines = linesOf(rec.content ?? '');
    const type = (rec.type ?? '').trim();
    if (type === 'चौपाई') {
      seenChaupai = true;
      for (let i = 0; i < lines.length; i += 2) pending.push({ form: 'chaupai', lines: lines.slice(i, i + 2) });
    } else if (type === 'छंद' || type === 'श्लोक') {
      const form: Form = type === 'छंद' ? 'chhand' : 'shloka';
      // A record that numbers its stanzas 1, 2 … is one stanza per mark. An unnumbered run of chhands is cut into
      // stanzas: two lines where each line holds two charanas ("नमामि भक्त वत्सलं। कृपालु शील कोमलं॥"), else four.
      for (const p of splitAtMarks(lines)) {
        const size = form === 'chhand' && p.n == null ? (p.lines.every((l) => /।\s*\S/.test(l)) ? 2 : 4) : p.lines.length;
        for (let i = 0; i < p.lines.length; i += size) (seenChaupai ? pending : opening).push({ form, lines: p.lines.slice(i, i + size) });
      }
    } else if (type === 'दोहा/सोरठा') {
      const dohas = splitDohas(lines);
      if (!seenChaupai) {
        for (const d of dohas) opening.push({ form: 'doha', lines: d.lines });
        continue;
      }
      const numbered = dohas.filter((d) => d.n != null);
      let n: number;
      let inferred = false;
      if (numbered.length) n = numbered[numbered.length - 1].n!;
      else {
        n = lastN + 1;
        inferred = true;
      }
      if (numbered.some((d) => d.n !== n)) problems.push(`one record holds dohas ${numbered.map((d) => d.n).join(', ')}`);
      if (n !== lastN + 1) problems.push(`section ${n} follows ${lastN}`);
      const units = [...pending, ...dohas.map((d) => ({ form: 'doha' as const, lines: d.lines, letter: d.letter }))];
      sections.push({ n, units, from: 'dharmic', inferred });
      pending = [];
      lastN = n;
    } else problems.push(`unknown record type "${type}"`);
  }
  if (pending.length) problems.push(`${pending.length} units after the last doha`);
  return { sections, opening, problems };
}

const SECOND_FORM: Record<string, Form> = { chaupai: 'chaupai', doha: 'doha', soratha: 'doha', chhand: 'chhand', shloka: 'shloka' };

function secondUnits(group: SecondGroup): Unit[] {
  return group.verses.map((v) => {
    const form = SECOND_FORM[v.type];
    if (!form) throw new Error(`unknown form ${v.type} in ${v.id}`);
    const lines = linesOf(v.original);
    const mark = lines.length ? MARK.exec(lines[lines.length - 1]) : null;
    if (mark) lines[lines.length - 1] = lines[lines.length - 1].slice(0, mark.index) + '॥';
    return { form, lines, letter: mark?.[2] };
  });
}

/** Letters and vowel signs only, for comparing two transcriptions (punctuation, spacing, chandrabindu and nukta aside). */
function norm(s: string): string {
  return s.replace(/[ँं]/g, 'ं').replace(/़/g, '').replace(/[^ऀ-ॿ]/g, '').replace(/[।॥०-९]/g, '');
}

function toIast(deva: string): string {
  // Sanscript has no ड़ / ढ़ (it writes "baḍa़e" for बड़े). The text never uses ळ or ऴ, so they stand in for them.
  return Sanscript.t(deva.replace(/ड़/g, 'ळ').replace(/ढ़/g, 'ऴ').replace(/़/g, ''), 'devanagari', 'iast')
    .replace(/l̤/g, 'ṛ')
    .replace(/ḻ/g, 'ṛh')
    .replace(/~/g, 'm̐')
    .replace(/।/g, '|')
    .replace(/॥/g, '||');
}

function numberUnits(sectionN: number | 'opening' | 'closing', units: Unit[]): { number: string; unit: Unit }[] {
  const out: { number: string; unit: Unit }[] = [];
  const count: Record<Form, number> = { chaupai: 0, doha: 0, chhand: 0, shloka: 0 };
  const dohas = units.filter((u) => u.form === 'doha');
  for (const unit of units) {
    const k = ++count[unit.form];
    let number: string;
    if (sectionN === 'opening') number = unit.form === 'doha' ? `0.d${k}` : `0.${k}`;
    else if (sectionN === 'closing') number = `E.${k}`;
    else if (unit.form === 'chaupai') number = `${sectionN}.${k}`;
    else if (unit.form === 'chhand') number = `${sectionN}.ch${k}`;
    else if (unit.form === 'shloka') number = `${sectionN}.sl${k}`;
    else if (dohas.length === 1) number = `${sectionN}`;
    else {
      const letter = unit.letter ? LETTERS.indexOf(unit.letter) : k - 1;
      number = `${sectionN}${'abcdefg'[letter >= 0 ? letter : k - 1]}`;
    }
    out.push({ number, unit });
  }
  return out;
}

async function main(): Promise<void> {
  const chapters: FullChapter[] = [];
  let total = 0;
  let compared = 0;
  let agreed = 0;
  const differences: string[] = [];
  const numbering: string[] = [];
  const meanings: Record<string, { hindi: string; english: string }> = fs.existsSync(MEANINGS) ? JSON.parse(fs.readFileSync(MEANINGS, 'utf8')).meanings : {};
  let applied = 0;

  const loaded = [];
  for (const k of KANDAS) {
    const records = await fetchJson<DharmicRecord[]>(`${DHARMIC}/${encodeURIComponent(k.file)}`);
    const second = (await fetchJson<{ dohaGroups: SecondGroup[] }>(`${SECOND}/${k.second}`)).dohaGroups;
    loaded.push({ k, parsed: parseDharmic(records), secondBy: new Map(second.map((g) => [g.dohaNumber, g])) });
  }
  // Every line DharmicData carries, in any kanda: the second source repeats the next kanda's opening sorathas at
  // the end of the previous one (Ayodhya 326, Sundar 60), and those must not be published twice.
  const known = new Set(loaded.flatMap(({ parsed }) => [...parsed.opening, ...parsed.sections.flatMap((s) => s.units)].flatMap((u) => u.lines.map(norm))));

  for (const { k, parsed, secondBy } of loaded) {
    const { sections, opening, problems } = parsed;
    for (const p of problems) log(`  ${k.title}: ${p}`);

    // Fill the sections DharmicData stops short of, and the closing shlokas the second source keeps in its last group.
    let closing: Unit[] = [];
    for (let n = sections.length + 1; n <= LAST_SECTION[k.number]; n++) {
      const g = secondBy.get(n);
      if (!g) throw new Error(`${k.title}: section ${n} is in neither source`);
      const units = secondUnits(g).filter((u) => {
        const repeated = u.lines.every((l) => known.has(norm(l)));
        if (repeated) log(`  ${k.title} ${n}: left out a ${u.form} the main source has elsewhere (${u.lines[0].slice(0, 40)}…)`);
        return !repeated;
      });
      const lastDoha = units.map((u) => u.form).lastIndexOf('doha');
      const body = lastDoha >= 0 ? units.slice(0, lastDoha + 1) : units.filter((u) => u.form !== 'shloka');
      closing = units.slice(lastDoha + 1).filter((u) => u.form === 'shloka');
      const hand = HAND_ENTERED[`${k.number}.${n}`];
      if (hand) {
        body.push(...hand.units);
        log(`  ${k.title} ${n}: ${hand.units.length} unit(s) entered by hand: ${hand.why}`);
      }
      if (!body.some((u) => u.form === 'doha')) throw new Error(`${k.title}: section ${n} has no doha`);
      sections.push({ n, units: body, from: 'second' });
    }
    const handClosing = HAND_ENTERED[`${k.number}.E`];
    if (handClosing) {
      log(`  ${k.title} closing: ${handClosing.units.length} shloka(s) entered by hand: ${handClosing.why}`);
      closing = handClosing.units;
    }
    if (sections.length !== LAST_SECTION[k.number] || sections.some((s, i) => s.n !== i + 1)) {
      throw new Error(`${k.title}: sections are not 1…${LAST_SECTION[k.number]} in order`);
    }

    // Cross-check every section both sources carry: the same lines, and the same count of each form.
    for (const s of sections) {
      if (s.from !== 'dharmic') continue;
      const g = secondBy.get(s.n);
      if (!g) continue;
      const theirs = secondUnits(g);
      const a = s.units.flatMap((u) => u.lines.map(norm));
      const b = new Set(theirs.flatMap((u) => u.lines.map(norm)));
      for (const line of a) {
        compared++;
        if (b.has(line)) agreed++;
        else if (differences.length < 4000) differences.push(`${k.number}.${s.n}: ${line}`);
      }
      const forms = (us: Unit[]) => (['chaupai', 'doha', 'chhand'] as Form[]).map((f) => us.filter((u) => u.form === f).length).join('/');
      if (forms(s.units) !== forms(theirs)) numbering.push(`${k.number}.${s.n} chaupai/doha/chhand ${forms(s.units)} vs ${forms(theirs)}`);
    }

    const verses: FullVerse[] = [];
    const push = (number: string, unit: Unit) => {
      // A doha's first line closes with a single danda; the source sometimes doubles it.
      const lines = unit.lines.map(cleanLine).map((l, i, all) => (unit.form === 'doha' && i < all.length - 1 ? l.replace(/॥$/, '।') : l));
      verses.push({ number, sanskrit: lines.join('\n'), transliteration: lines.map(toIast).join('\n') });
    };
    for (const { number, unit } of numberUnits('opening', opening)) push(number, unit);
    for (const s of sections) for (const { number, unit } of numberUnits(s.n, s.units)) push(number, unit);
    for (const { number, unit } of numberUnits('closing', closing)) push(number, unit);

    const seen = new Set<string>();
    for (const v of verses) {
      if (seen.has(String(v.number))) throw new Error(`${k.title}: duplicate number ${v.number}`);
      seen.add(String(v.number));
      const meaning = meanings[`${k.number}:${v.number}`];
      if (!meaning) continue;
      v.hindi = meaning.hindi;
      v.hindiSource = 'ai';
      v.translation = meaning.english;
      v.translationSource = 'ai';
      applied++;
    }
    chapters.push({ number: k.number, title: k.title, titleSanskrit: k.titleSanskrit, verses });
    total += verses.length;
    const filled = sections.filter((s) => s.from === 'second').map((s) => s.n);
    log(`${k.title}: ${verses.length} records, ${sections.length} sections${filled.length ? `, section ${filled.join(', ')} from the second source` : ''}${closing.length ? `, ${closing.length} closing shloka(s)` : ''}`);
  }

  if (applied !== Object.keys(meanings).length) throw new Error(`${Object.keys(meanings).length - applied} meaning(s) name a verse that does not exist`);
  log(`Meanings (AI, badged): ${applied}`);
  log(`Cross-check: ${agreed} of ${compared} lines (${((agreed / compared) * 100).toFixed(1)}%) read the same in both sources`);
  log(`Sections whose form counts differ between the sources: ${numbering.length}`);
  if (process.argv.includes('--report')) {
    for (const n of numbering) console.log(`  ${n}`);
    for (const d of differences) console.log(`  ${d}`);
  }

  const scripture: FullScripture = {
    id: 'ramcharitmanas',
    title: 'Shri Ramcharitmanas',
    titleSanskrit: 'श्रीरामचरितमानस',
    category: 'itihasa',
    source: {
      repo: `Awadhi text: https://github.com/bhavykhatri/DharmicData (from IIT Kanpur's Ramcharitmanas site, Gita Press text) @ ${DHARMIC_SHA.slice(0, 7)}; last sections of kandas 2–7: https://github.com/pawanprakashpal/RamayanaPath @ ${SECOND_SHA.slice(0, 7)}`,
      license: "Tulsidas's Awadhi text (16th century) is in the public domain. No translation from either source is used.",
      // The sources are pinned to commits, so the date they were taken is fixed too (a re-run changes nothing).
      fetchedAt: '2026-10-27T00:00:00.000Z',
    },
    totalVerses: total,
    totalChapters: chapters.length,
    chapters,
  };
  if (write) log(`Wrote ${total} records -> ${writeScripture(scripture)}`);
  else log(`Dry run: ${total} records. Pass --write to save.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
