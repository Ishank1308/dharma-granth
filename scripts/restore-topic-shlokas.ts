/**
 * data/topics.ts stored only the first quarter (pāda) of many shlokas. This restores the whole shloka
 * from the library JSON, but only when the stored text is a strict prefix of the library text, so a
 * different verse or a deliberate excerpt is never overwritten.
 *
 *   npx tsx scripts/restore-topic-shlokas.ts [--write]
 */
import fs from 'node:fs';
import { topics } from '../data/topics';

const WRITE = process.argv.includes('--write');
// Reviewed by hand: 16.1 is the same verse with a different sandhi; the stored 16.4 text is not in the Gita at all.
const FORCE = new Set(['Bhagavad Gita 16.1', 'Bhagavad Gita 16.4']);
// Letters only, with nasal-consonant+virama folded to anusvara (सम्पन्ने = संपन्ने) so spelling variants still match.
const squish = (s: string) =>
  s
    .replace(/[^ऀ-ॿ]/g, '')
    .replace(/[।॥०-९ऽ]/g, '')
    .replace(/[ङञणनम]्(?=[कखगघचछजझटठडढतथदधपफबभ])/g, 'ं')
    .replace(/म्(?=[यरलवशषसहम])/g, 'ं')
    .replace(/म्$/, 'ं')
    .replace(/ंम/g, 'म्म')
    .replace(/म्म/g, 'ंम');

function libraryVerse(id: string, chapter: number, verse: number | string) {
  const p = `public/data/scriptures-full/${id}/ch-${chapter}.json`;
  if (!fs.existsSync(p)) return null;
  const j = JSON.parse(fs.readFileSync(p, 'utf8'));
  return j.chapter.verses.find((v: { number: number | string }) => String(v.number) === String(verse)) ?? null;
}

/** "line1।\n\nline2।।3.21।।" -> "line1 ।\nline2 ॥" */
function cleanSanskrit(raw: string): string {
  const lines = raw
    .replace(/।।\s*[0-9.\-–]+\s*।।/g, '॥')
    .replace(/॥\s*[०-९0-9.\-–]+\s*॥/g, '॥')
    .split(/\n+/)
    .map((l) => l.trim().replace(/\s*[|।]\s*$/, '').replace(/\s*(?:॥|\|\|)\s*$/, '').trim())
    .filter(Boolean);
  return lines.map((l, i) => (i === lines.length - 1 ? `${l} ॥` : `${l} ।`)).join('\n');
}

const BS = String.fromCharCode(92);
const quote = (s: string) => "'" + s.split(BS).join(BS + BS).split("'").join(BS + "'").split(String.fromCharCode(10)).join(BS + 'n') + "'";

let src = fs.readFileSync('data/topics.ts', 'utf8');
const crlf = src.includes('\r\n');
src = src.replace(/\r\n/g, '\n');
let fixed = 0, skipped = 0;
for (const t of topics) {
  for (const v of t.verses) {
    if (v.chapterId == null || v.verseId == null) continue;
    if (/[।॥]\s*$/.test(v.sanskrit.trim())) continue;
    const lib = libraryVerse(v.scriptureId, v.chapterId, v.verseId);
    if (!lib?.sanskrit) { skipped++; console.log('no library verse', t.id, v.reference); continue; }
    const a = squish(v.sanskrit), b = squish(lib.sanskrit);
    if (!FORCE.has(v.reference) && !(b.length > a.length && b.includes(a))) { skipped++; console.log('not a prefix, left alone', t.id, v.reference); continue; }
    const full = cleanSanskrit(lib.sanskrit);
    const esc = quote;
    const oldLit = `sanskrit: ${esc(v.sanskrit)}`;
    if (!src.includes(oldLit)) { skipped++; console.log('literal not found', t.id, v.reference); continue; }
    src = src.replace(oldLit, `sanskrit: ${esc(full)}`);
    if (v.transliteration && lib.transliteration) {
      const tl = lib.transliteration.split(/\n+/).map((l: string) => l.trim()).filter(Boolean);
      const fullTl = tl.map((l: string, i: number) => (i === tl.length - 1 ? `${l} ||` : `${l} |`)).join('\n');
      const oldT = `transliteration: ${esc(v.transliteration)}`;
      if (src.includes(oldT)) src = src.replace(oldT, `transliteration: ${esc(fullTl)}`);
    }
    fixed++;
    console.log('restored', t.id, v.reference);
  }
}
console.log(`${fixed} restored, ${skipped} left alone`);
if (WRITE) fs.writeFileSync('data/topics.ts', crlf ? src.replace(/\n/g, '\r\n') : src);
