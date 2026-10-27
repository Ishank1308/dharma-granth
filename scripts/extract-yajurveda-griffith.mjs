/**
 * Extract Griffith's White Yajur Veda (1899, public domain) verse by verse from the sacred-texts pages cached
 * in scripts/cache/yajurveda-griffith/wyvbkNN.htm (books 5–40; books 1–4 are not cached).
 *
 *   node scripts/extract-yajurveda-griffith.mjs
 *
 * Output: data/yajurveda-griffith.json, {"books": {"16": {"1": "HOMAGE be paid…", …}}}.
 *
 * Griffith numbers each verse at the start of a printed line ("<br> 2 With that auspicious form…"). A line
 * starts a new verse only when its number follows the last one (or skips at most two, where Griffith omits
 * a verse), so stray digits inside the text are not read as verse numbers.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CACHE = path.join(ROOT, 'scripts/cache/yajurveda-griffith');
const OUT = path.join(ROOT, 'data/yajurveda-griffith.json');

const ENTITIES = { amp: '&', quot: '"', lt: '<', gt: '>', nbsp: ' ', laquo: '«', raquo: '»' };
const ACCENTED = { acirc: 'â', ecirc: 'ê', icirc: 'î', ocirc: 'ô', ucirc: 'û', egrave: 'è', eacute: 'é', agrave: 'à', aacute: 'á', iacute: 'í', uacute: 'ú', oacute: 'ó', ntilde: 'ñ', uuml: 'ü', auml: 'ä', ouml: 'ö' };

function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => (Number(n) === 151 ? '—' : Number(n) === 150 ? '–' : String.fromCodePoint(Number(n))))
    .replace(/&([A-Za-z]+);/g, (m, name) => ENTITIES[name] ?? ACCENTED[name] ?? (ACCENTED[name.toLowerCase()]?.toUpperCase() ?? m));
}

/** The printed lines of a book, from its heading to the end of the text. */
function bookLines(html) {
  const start = html.search(/<h3[^>]*>\s*BOOK THE/i);
  if (start < 0) throw new Error('no BOOK heading');
  const rest = html.slice(start);
  const end = rest.search(/<HR|<nav|Next:/i);
  return decode(
    rest
      .slice(0, end > 0 ? end : undefined)
      .replace(/<h3[^>]*>.*?<\/h3>/gis, '')
      .replace(/<A NAME="page_\d+">.*?<\/A>/gis, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?p[^>]*>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      // Griffith leaves out some passages, marked with a row of dots; the next verse follows on the same line.
      .replace(/(?:\. ){3,}\.?\s*(?=\d)/g, '. . .\n'),
  )
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

/** A verse number misread by OCR: same length as the expected one, one digit different ("14" for 44). */
function ocrVariant(found, expected) {
  const a = String(found);
  const b = String(expected);
  return a.length === b.length && [...a].filter((d, i) => d !== b[i]).length === 1;
}

function parseBook(html) {
  const verses = new Map();
  let n = 1;
  let cur = [];
  const flush = () => {
    const text = cur
      .join(' ')
      .replace(/(\w)- (\w)/g, '$1$2')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) verses.set(n, text);
  };
  const lines = bookLines(html).map((raw) => raw.replace(/^S(\d)\b/, '8$1')); // OCR reads 8 as S ("S5")
  // "40, 41 Return again, etc.": two verses given together; the text goes with the first.
  const lead = (line) => /^(\d{1,3})\.?(?:,\s*\d{1,3})?\s+(?=\S)(.*)$/.exec(line);
  lines.forEach((line, i) => {
    const m = lead(line);
    let next = m ? Number(m[1]) : 0;
    // A misread number counts as the expected one when the next numbered line confirms it.
    const after = lines.slice(i + 1).map(lead).find(Boolean);
    if (m && next !== n + 1 && ocrVariant(next, n + 1) && after && Number(after[1]) === n + 2) {
      next = n + 1;
    }
    // After a passage Griffith leaves out (". . ."), numbering resumes wherever it does.
    const omitted = cur.join(' ').endsWith('. . .');
    if (m && next > n && (next <= n + 3 || omitted)) {
      flush();
      n = next;
      cur = [m[2]];
    } else {
      cur.push(line);
    }
  });
  flush();
  return verses;
}

/**
 * Verses printed without a readable number, run on into the verse before: where the next verse starts, and
 * the misread number to drop ("O Self-made" is "6 Self-made", "21 Through" is "24 Through").
 */
const RUN_ON = {
  '7.5': /O (?=Self-made art thou)/,
  '15.1': /(?=Drive off with might)/,
  '15.55': /6 56 (?=This is thine)/,
  '16.50': /I (?=Most bounteous)/,
  '33.2': /(?=Bring to us Mitra)/,
  '36.3': /(?=With what help)/,
  '36.23': /21 (?=Through hundred autumns)/,
};

function splitRunOns(books) {
  for (const [ref, marker] of Object.entries(RUN_ON)) {
    const [b, n] = ref.split('.').map(Number);
    const m = marker.exec(books[b][n] ?? '');
    if (!m || books[b][n + 1]) throw new Error(`run-on ${ref} not found`);
    books[b][n + 1] = books[b][n].slice(m.index + m[0].length).trim();
    books[b][n] = books[b][n].slice(0, m.index).trim();
  }
  // Book 12 prints verse 101 ("Most excellent of all art thou, O Plant") a second time as 97, so from there
  // Griffith's numbers run one ahead of the Samhita's.
  const b12 = books[12];
  if (!b12[97].startsWith('Most excellent of all') || !b12[102].startsWith('Most excellent of all')) {
    throw new Error('book 12 numbering changed');
  }
  for (let n = 97; n <= 117; n++) b12[n] = b12[n + 1];
  delete b12[118];
}

function main() {
  const books = {};
  for (let b = 5; b <= 40; b++) {
    const file = path.join(CACHE, `wyvbk${String(b).padStart(2, '0')}.htm`);
    if (!fs.existsSync(file)) continue;
    books[b] = Object.fromEntries(parseBook(fs.readFileSync(file, 'utf8')));
  }
  splitRunOns(books);
  const note =
    "R. T. H. Griffith, The Texts of the White Yajurveda (1899), public domain, from sacred-texts.com (books 5–40). " +
    'Keyed by book and verse as Griffith numbers them. Regenerate with scripts/extract-yajurveda-griffith.mjs.';
  fs.writeFileSync(OUT, `${JSON.stringify({ note, books }, null, 2)}\n`);
  const total = Object.values(books).reduce((s, v) => s + Object.keys(v).length, 0);
  console.log(`wrote ${path.relative(ROOT, OUT)}: ${total} verses in ${Object.keys(books).length} books`);
}

main();
