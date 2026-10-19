import { devanagariToInt, fixPrebaseI, suspicionFlags, toIast } from './devanagari';
import type { OcrPage, OcrVerse } from './types';

const VERSE_MARK = /॥\s*([०-९0-9]+(?:\.[०-९0-9]+)?)\s*॥/g;
const PROSE_SRC = '(?:^|[\\s,(“"])(?:अथवा|करके|किया|किये|किए|गया|गये|गई|हुए|हुई|हुआ|द्वारा|नहीं|कहा|उन|यह|वह|और|ओर)(?=[\\s,।॥)”"]|$)|(?:के|की|का|को|में|से)(?=[\\s,।॥]|$)|है(?=[\\s,।॥]|$)|हैं(?=[\\s,।॥]|$)|वाल[ाोे]';
const PRECISE_RE = /(?:अथवा|करके|किया|किये|किए|गया|गये|द्वारा|नहीं|कहा)|है(?=[\s,।॥]|$)|हैं(?=[\s,।॥]|$)/;

type LineKind = 'english' | 'hindi' | 'sanskrit' | 'padaccheda' | 'noise';

export function lineKind(line: string): LineKind {
  const stripped = line.trim();
  const latin = (stripped.match(/[A-Za-z]/g) ?? []).length;
  const dev = (stripped.match(/[\u0900-\u097F]/g) ?? []).length;
  if (latin > 8 && latin > dev) return 'english';
  if (/^[\u0900-\u097F]{1,2}\.?$/.test(stripped)) return 'noise';
  const odd = (stripped.match(/[^\u0900-\u097F\s।॥,\-–—'\"“”()०-९0-9.]/g) ?? []).length;
  if (odd >= 2 && dev < 15) return 'noise';
  if (/^[\u0900-\u097F]{2,}-[\u0900-\u097F]{2,}$/.test(stripped)) return 'hindi';
  const dashes = (stripped.match(/[–—-]/g) ?? []).length;
  if (dashes >= 2 && dev > 0 && latin === 0) return 'padaccheda';
  const prose = stripped.match(new RegExp(PROSE_SRC, 'g')) ?? [];
  if (prose.length >= 2 || PRECISE_RE.test(stripped) || (prose.length === 1 && !/[।॥]/.test(stripped))) return 'hindi';
  if (dev > 0) return 'sanskrit';
  return 'english';
}

function chapterHeading(text: string): { number: number | null; title: string } | null {
  const match = text.match(/(?:अध्यायः?|अध्याय|खण्डः?|काण्डः?)\s*([०-९0-9]+)?[^\n]{0,80}/);
  if (!match) return null;
  return { number: match[1] ? devanagariToInt(match[1]) : null, title: match[0].replace(/\s+/g, ' ').trim() };
}

function classifyBody(body: string): Pick<OcrVerse, 'sanskrit_raw' | 'padaccheda' | 'word_meanings' | 'bhashya_hi' | 'english'> {
  const buckets = { sanskrit: [] as string[], padaccheda: [] as string[], hindi: [] as string[], english: [] as string[] };
  for (const rawLine of body.split(/\n+/)) {
    const line = rawLine.trim();
    if (!line || /^(?:अध्यायः?|अध्याय|खण्डः?|काण्डः?)\s*[०-९0-9]*\s*$/.test(line)) continue;
    const kind = lineKind(line);
    if (kind === 'noise') continue;
    if (kind === 'padaccheda') buckets.padaccheda.push(line);
    else if (kind === 'hindi') buckets.hindi.push(line);
    else if (kind === 'english') buckets.english.push(line);
    else buckets.sanskrit.push(line);
  }
  return {
    sanskrit_raw: buckets.sanskrit.join(' ').replace(/\s+/g, ' ').trim(),
    padaccheda: buckets.padaccheda.join(' ').replace(/\s+/g, ' ').trim(),
    word_meanings: buckets.padaccheda.join(' ').replace(/\s+/g, ' ').trim(),
    bhashya_hi: buckets.hindi.join(' ').replace(/\s+/g, ' ').trim(),
    english: buckets.english.join(' ').replace(/\s+/g, ' ').trim(),
  };
}

export function parsePageText(raw: string, fallbackChapter: number | null): { verses: OcrVerse[]; trailing_fragment: string; adhyaya: OcrPage['adhyaya_or_khanda'] } {
  const text = raw.replace(/\r/g, '');
  const adhyaya = chapterHeading(text);
  const chapterFromHeading = adhyaya?.number ?? fallbackChapter;
  const verses: OcrVerse[] = [];
  const mark = new RegExp(VERSE_MARK.source, 'g');
  let from = 0;
  let match: RegExpExecArray | null;
  while ((match = mark.exec(text)) !== null) {
    const body = text.slice(from, match.index);
    from = match.index + match[0].length;
    const lines = body.split(/\n+/).map((line) => line.trim()).filter(Boolean);
    const sanskritLines: string[] = [];
    const leading: string[] = [];
    let seenSanskrit = false;
    for (const line of lines) {
      if (/^(?:अध्यायः?|अध्याय|खण्डः?|काण्डः?)\s*[०-९0-9]*\s*$/.test(line)) continue;
      const kind = lineKind(line);
      if (!seenSanskrit && kind !== 'sanskrit') leading.push(line);
      else {
        seenSanskrit = true;
        sanskritLines.push(line);
      }
    }
    if (verses.length && leading.length) {
      const extra = classifyBody(leading.join('\n'));
      const prev = verses[verses.length - 1];
      prev.bhashya_hi = [prev.bhashya_hi, extra.bhashya_hi].filter(Boolean).join(' ');
      prev.english = [prev.english, extra.english].filter(Boolean).join(' ');
      prev.padaccheda = [prev.padaccheda, extra.padaccheda].filter(Boolean).join(' ');
      prev.word_meanings = prev.padaccheda;
    }
    const layers = classifyBody(sanskritLines.join('\n'));
    if (!layers.sanskrit_raw && !layers.bhashya_hi && !layers.english && !leading.length) continue;
    const fixed = fixPrebaseI(layers.sanskrit_raw);
    const numberRaw = match[0].replace(/\s+/g, ' ').trim();
    const parts = match[1].split('.');
    const major = devanagariToInt(parts[0] ?? '');
    const minor = parts[1] ? devanagariToInt(parts[1]) : null;
    const chapter = minor != null ? major : chapterFromHeading;
    const verse = minor != null ? minor : major;
    const flags = suspicionFlags(fixed.text);
    if (!/[।॥]/.test(fixed.text) && fixed.text) flags.push('sanskrit has no danda');
    if (fixed.corrections.length) flags.push('i-matra reordered');
    if (fixed.text || layers.sanskrit_raw) {
      verses.push({
        verse_number_raw: numberRaw,
        chapter,
        verse,
        sanskrit_raw: layers.sanskrit_raw,
        sanskrit_devanagari: fixed.text,
        sanskrit_iast: toIast(fixed.text),
        padaccheda: layers.padaccheda,
        word_meanings: layers.word_meanings,
        bhashya_hi: layers.bhashya_hi,
        english: layers.english,
        ocr_confidence: flags.length ? 'needs_review' : 'ok',
        flags,
        corrections: fixed.corrections,
      });
    }
  }
  const trailingLines = text.slice(from).split(/\n+/).map((line) => line.trim()).filter(Boolean);
  if (verses.length && trailingLines.length) {
    const extra = classifyBody(trailingLines.join('\n'));
    const prev = verses[verses.length - 1];
    if (extra.bhashya_hi || extra.english) {
      prev.bhashya_hi = [prev.bhashya_hi, extra.bhashya_hi].filter(Boolean).join(' ');
      prev.english = [prev.english, extra.english].filter(Boolean).join(' ');
    }
  }
  const trailing = trailingLines.some((line) => lineKind(line) === 'sanskrit')
    ? text.slice(from).replace(/\s+/g, ' ').trim()
    : '';
  return { verses, trailing_fragment: trailing, adhyaya };
}

export function mergePageVerses(pages: OcrPage[]): OcrVerse[] {
  const out: OcrVerse[] = [];
  let carry = '';
  for (const page of pages) {
    const verses = page.verses.map((verse) => ({ ...verse, corrections: [...verse.corrections], flags: [...verse.flags] }));
    if (carry) {
      if (verses.length) {
        const joined = `${carry} ${verses[0].sanskrit_raw}`.replace(/\s+/g, ' ').trim();
        const fixed = fixPrebaseI(joined);
        verses[0].sanskrit_raw = joined;
        verses[0].sanskrit_devanagari = fixed.text;
        verses[0].sanskrit_iast = toIast(fixed.text);
        verses[0].corrections.push(...fixed.corrections);
        verses[0].continues_from_previous_page = true;
        if (!verses[0].flags.includes('continued from previous page')) verses[0].flags.push('continued from previous page');
      } else {
        carry = `${carry} ${page.trailing_fragment}`.trim();
        continue;
      }
      carry = '';
    }
    out.push(...verses);
    carry = page.trailing_fragment;
  }
  return out;
}
