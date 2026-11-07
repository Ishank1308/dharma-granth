/**
 * Off-Main-Thread Search Web Worker for Dharma Granth
 * 
 * Performs phonetic normalization (normalizePhonetic), fuzzy matching,
 * and result ranking off the main thread to ensure Input Delay (INP) remains <35ms
 * even during rapid typing across thousands of verses and concepts.
 */

// Define phonetic normalization logic directly in the worker for zero-dependency isolation
const DEVANAGARI_DIGITS = '०१२३४५६७८९';

const CLASS_NASAL: Record<string, string> = {
  क: 'ङ', ख: 'ङ', ग: 'ङ', घ: 'ङ', ङ: 'ङ',
  च: 'ञ', छ: 'ञ', ज: 'ञ', झ: 'ञ', ञ: 'ञ',
  ट: 'ण', ठ: 'ण', ड: 'ण', ढ: 'ण', ण: 'ण',
  त: 'न', थ: 'न', द: 'न', ध: 'न', न: 'न',
  प: 'म', फ: 'म', ब: 'म', भ: 'म', म: 'म',
  य: 'न', र: 'न', ल: 'न', व: 'न', श: 'न', ष: 'न', स: 'न', ह: 'न',
};

function unifyAnusvara(value: string): string {
  if (!value) return '';
  const s = value.replace(/[।॥]/g, ' ');
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch !== 'ं' && ch !== 'ँ') {
      out += ch;
      continue;
    }
    let j = i + 1;
    while (j < s.length && (s[j] === '़' || s[j] === '\u200c' || s[j] === '\u200d')) j++;
    out += `${CLASS_NASAL[s[j]] ?? 'म'}्`;
  }
  return out;
}

const VOWELS: Record<string, string> = {
  अ: 'a', आ: 'a', इ: 'i', ई: 'i', उ: 'u', ऊ: 'u', ऋ: 'ri', ॠ: 'ri', ऌ: 'l', ए: 'e', ऐ: 'ai', ओ: 'o', औ: 'au',
};
const MATRAS: Record<string, string> = {
  'ा': 'a', 'ि': 'i', 'ी': 'i', 'ु': 'u', 'ू': 'u', 'ृ': 'ri', 'ॄ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
};
const CONS: Record<string, string> = {
  क: 'k', ख: 'kh', ग: 'g', घ: 'gh', ङ: 'n',
  च: 'ch', छ: 'chh', ज: 'j', झ: 'jh', ञ: 'n',
  ट: 't', ठ: 'th', ड: 'd', ढ: 'dh', ण: 'n',
  त: 't', थ: 'th', द: 'd', ध: 'dh', न: 'n',
  प: 'p', फ: 'ph', ब: 'b', भ: 'bh', म: 'm',
  य: 'y', र: 'r', ल: 'l', व: 'v', श: 'sh', ष: 'sh', स: 's', ह: 'h',
};

function transliterateDevanagari(input: string): string {
  const s = unifyAnusvara(input);
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    const digit = DEVANAGARI_DIGITS.indexOf(ch);
    if (digit >= 0) {
      out += String(digit);
      continue;
    }
    if (VOWELS[ch]) {
      out += VOWELS[ch];
      continue;
    }
    if (MATRAS[ch]) {
      out += MATRAS[ch];
      continue;
    }
    if (ch === '्' || ch === '़' || ch === 'ऽ' || ch === '\u200c' || ch === '\u200d') continue;
    if (ch === 'ः') {
      out += 'h';
      continue;
    }
    if (ch === 'ॐ') {
      out += 'om';
      continue;
    }
    const cons = CONS[ch];
    if (cons) {
      out += cons;
      const next = s[i + 1];
      if (!(next && (MATRAS[next] || next === '्'))) out += 'a';
      continue;
    }
    out += ch;
  }
  return out;
}

function mapIast(value: string): string {
  return value
    .replace(/[śṣŚṢ]/g, 'sh')
    .replace(/[ṛṝṚṜ]/g, 'ri')
    .replace(/[ṇñṅṆÑṄ]/g, 'n')
    .replace(/[āĀ]/g, 'a')
    .replace(/[īĪ]/g, 'i')
    .replace(/[ūŪ]/g, 'u')
    .replace(/[ṃṁṂṀ]/g, 'm')
    .replace(/[ḥḤ]/g, 'h')
    .replace(/[ṭṬ]/g, 't')
    .replace(/[ḍḌ]/g, 'd')
    .replace(/[ḷḶ]/g, 'l');
}

function foldLatin(value: string): string {
  let out = value.toLowerCase();
  out = out.replace(/aa/g, 'a').replace(/ee|ii/g, 'i').replace(/oo|uu/g, 'u');
  out = out.replace(/chh/g, 'c').replace(/shh/g, 's').replace(/ksh/g, 'ks');
  out = out.replace(/ch/g, 'c').replace(/sh/g, 's');
  out = out.replace(/bh/g, 'b').replace(/dh/g, 'd').replace(/th/g, 't').replace(/ph/g, 'p').replace(/kh/g, 'k').replace(/gh/g, 'g').replace(/jh/g, 'j');
  out = out.replace(/ri/g, 'r').replace(/w/g, 'v');
  out = out.replace(/[^a-z0-9]/g, '');
  return out.replace(/[nm](?=[kgcjtdpbsvly])/g, 'n');
}

function normalizePhonetic(value: string): string {
  if (!value) return '';
  return foldLatin(mapIast(transliterateDevanagari(value)));
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = cur;
    }
  }
  return row[b.length];
}

interface WorkerSearchMessage {
  id: string;
  type: 'SEARCH';
  query: string;
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    snippet?: string;
    group: string;
    groupLabel?: string;
    category?: string;
    href: string;
    keywords?: string[];
    phoneticKey?: string;
  }>;
  limit?: number;
}

self.onmessage = (e: MessageEvent<WorkerSearchMessage>) => {
  const { id, type, query, items, limit = 40 } = e.data;
  if (type !== 'SEARCH') return;

  const startTime = performance.now();
  const qPhonetic = normalizePhonetic(query);
  const qLower = query.toLowerCase().trim();

  const scored: Array<{ item: (typeof items)[0]; score: number }> = [];

  for (const item of items || []) {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const subLower = (item.subtitle || '').toLowerCase();
    const itemPhonetic = item.phoneticKey || normalizePhonetic(`${item.title} ${item.subtitle || ''}`);

    // Exact match
    if (titleLower === qLower) {
      score += 100;
    } else if (titleLower.startsWith(qLower)) {
      score += 60;
    } else if (titleLower.includes(qLower)) {
      score += 40;
    }

    // Phonetic match (Devanagari / Hinglish / IAST unification)
    if (qPhonetic && itemPhonetic.includes(qPhonetic)) {
      score += 50;
    }

    // Subtitle / snippet match
    if (subLower.includes(qLower)) {
      score += 25;
    }

    // Keyword match
    if (item.keywords?.some((k) => k.toLowerCase().includes(qLower))) {
      score += 30;
    }

    // Fuzzy distance fallback for short queries
    if (score === 0 && qPhonetic.length >= 3 && itemPhonetic.length >= 3) {
      const dist = levenshtein(qPhonetic, itemPhonetic.slice(0, qPhonetic.length + 2));
      if (dist <= 1) {
        score += 20;
      }
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  // Sort descending by score
  scored.sort((a, b) => b.score - a.score);

  const results = scored.slice(0, limit).map((s) => s.item);
  const latencyMs = Math.round(performance.now() - startTime);

  self.postMessage({
    id,
    type: 'SEARCH_RESULT',
    results,
    latencyMs,
  });
};
