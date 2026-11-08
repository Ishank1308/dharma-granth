#!/usr/bin/env node
/**
 * Picks a painting (app/styles/paintings/<id>.svg) for every chapter of every scripture:
 * adhyāya, kāṇḍa, khaṇḍa, parva, skandha, vallī, maṇḍala...
 *
 * 1. Hand-checked choices for the texts whose chapters are well known (Gītā,
 *    Rāmāyaṇa, Mahābhārata, the principal Upaniṣads, the Vedas, Bhāgavata
 *    episodes, Devī texts...), in CURATED below.
 * 2. Otherwise the chapter is read: its title (weighted heavily) and its verses
 *    (Sanskrit, and the English translation) are scored against each scene's
 *    vocabulary, and a clear winner is taken.
 * 3. Failing that, the scripture's category gives a scene, varied by chapter.
 *
 * Chapters with a hand-drawn scene in lib/chapter-scenes.ts keep it; lib/chapter-paintings.ts
 * checks that at runtime. Writes lib/chapter-paintings.generated.ts. Run again after content changes:
 *   node scripts/build-chapter-painting-map.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const SCENES = [
  'kurukshetra', 'vishvarupa', 'yogi', 'ashram', 'yajna', 'dawn', 'ganga', 'kailash', 'ocean', 'forest', 'palace',
  'lanka', 'vrindavan', 'devi', 'cosmos', 'lotus', 'temple', 'dusk', 'storm', 'stars', 'pillar', 'manuscript',
];
const CODE = Object.fromEntries(SCENES.map((s, i) => [s, String.fromCharCode(97 + i)]));

// ── vocabulary: [scene, weight, Devanagari stems / English words] ──────────
const VOCAB = {
  kurukshetra: [2, ['युद्ध', 'संग्राम', 'रणे', 'रणं', 'सेना', 'रथ', 'धनु', 'बाण', 'अस्त्र', 'कुरुक्षेत्र', 'योध', 'शस्त्र'], /\b(battle|war|army|armies|chariot|arrows?|bow|warriors?|fought|fight)\b/gi],
  lanka: [4, ['लङ्का', 'लंका', 'रावण', 'राक्षस', 'इन्द्रजि', 'कुम्भकर्ण', 'त्रिपुर'], /\b(lanka|ravana|rakshasas?|indrajit|tripura)\b/gi],
  palace: [1.2, ['सिंहासन', 'अभिषेक', 'अयोध्या', 'राजसूय', 'सभा', 'वंश', 'नृपति', 'राज्ये', 'द्वारका'], /\b(king|kingdom|coronation|palace|court|throne|dynasty|dynasties|royal|statecraft)\b/gi],
  forest: [2, ['वने', 'वनं', 'अरण्य', 'कानन', 'वनवास', 'मृग'], /\b(forest|woods|exile|deer)\b/gi],
  ashram: [1.5, ['आश्रम', 'नैमिष', 'मुनि', 'तपस', 'तपो', 'शिष्य', 'ऋषि'], /\b(sages?|hermitage|ascetics?|penance|austerit(y|ies)|disciples?|teacher|student|rishis?)\b/gi],
  yajna: [2, ['यज्ञ', 'होम', 'हवन', 'आहुति', 'अग्नि', 'वेदि', 'सोम', 'क्रतु', 'हविः'], /\b(sacrifices?|sacrificial|oblations?|fire|altar|agni|soma|homa)\b/gi],
  dawn: [2, ['उषस्', 'उषा', 'सवित', 'सूर्य', 'आदित्य', 'प्रभात', 'सन्ध्या', 'संध्या', 'भास्कर'], /\b(dawn|sun|surya|savitr|savitri|morning)\b/gi],
  ganga: [2, ['गङ्गा', 'गंगा', 'तीर्थ', 'स्नान', 'नदी', 'काशी', 'वाराणसी', 'प्रयाग', 'नर्मदा', 'पुष्कर', 'सरस्वती'], /\b(ganga|ganges|pilgrimage|tirthas?|sacred fords?|bath(e|ing)?|rivers?|kashi|varanasi)\b/gi],
  kailash: [2.5, ['शङ्कर', 'शंकर', 'महेश्वर', 'रुद्र', 'लिङ्ग', 'लिंग', 'कैलास', 'पार्वती', 'उमा', 'गिरीश', 'पिनाक', 'त्रिलोचन', 'महादेव', 'शिवं', 'शिवः', 'शिवाय'], /\b(shiva|siva|rudra|linga|kailasa|kailash|parvati|uma|mahadeva|himalaya)\b/gi],
  ocean: [2.5, ['समुद्र', 'सागर', 'अर्णव', 'मत्स्य', 'कूर्म', 'वराह', 'मन्थन', 'अमृत', 'क्षीर'], /\b(ocean|sea|fish|tortoise|boar|churning|nectar|waters of)\b/gi],
  vrindavan: [3, ['कृष्ण', 'गोप', 'गोकुल', 'वृन्दावन', 'यमुना', 'राधा', 'वेणु', 'मुरली', 'यशोदा', 'गोविन्द'], /\b(krishna|krsna|gopis?|cowherds?|vrindavan|vraja|yamuna|radha|flute|yashoda)\b/gi],
  devi: [3, ['देवी', 'दुर्गा', 'चण्डिका', 'अम्बिका', 'काली', 'महिष', 'भगवती', 'ललिता', 'चामुण्डा'], /\b(goddess|devi|durga|mahisha|chandika|ambika|kali\b(?! age| yuga)|lalita|shakti)\b/gi],
  cosmos: [2, ['सृष्टि', 'ब्रह्माण्ड', 'हिरण्यगर्भ', 'प्रकृति', 'मन्वन्तर', 'कल्पे', 'कल्पान्त'], /\b(creation|created the|universe|cosmic|cosmos|elements|prakriti|manvantara|kalpa)\b/gi],
  lotus: [2, ['भक्ति', 'भक्त', 'कीर्तन', 'शरण', 'प्रपत्ति', 'पद्म', 'कमल', 'लक्ष्मी'], /\b(devotion|devotees?|devotional|bhakti|surrender|refuge|lotus|lakshmi)\b/gi],
  temple: [1.5, ['पूजा', 'अर्चन', 'स्तोत्र', 'स्तुति', 'मूर्ति', 'प्रतिमा', 'प्रासाद', 'देवालय', 'व्रत', 'उत्सव', 'नमो', 'नमः'], /\b(worship|hymns?|praise|idols?|images?|temples?|vows?|vrata|festivals?|prayers?|mantras?)\b/gi],
  dusk: [3, ['प्रेत', 'यमलोक', 'यमदूत', 'यमस्य', 'मृत्यु', 'नरक', 'पितृ', 'श्राद्ध', 'वैतरणी', 'पिण्ड'], /\b(death|dead|ghosts?|preta|hells?|ancestors|funeral|yama|shraddha|departed)\b/gi],
  storm: [3, ['कलियुग', 'कलौ', 'युगान्त', 'प्रलय', 'कल्कि', 'म्लेच्छ', 'वृत्र'], /\b(kali (age|yuga)|dissolution|deluge|pralaya|kalki|storm|thunder|vritra)\b/gi],
  stars: [3, ['ध्रुव', 'नक्षत्र', 'ग्रहाः', 'ग्रहाणां', 'ज्योतिष', 'राशि', 'कालचक्र'], /\b(pole star|dhruva|planets?|constellations?|astrolog\w*|zodiac|stars?|moon)\b/gi],
  pillar: [5, ['नृसिंह', 'नरसिंह', 'नारसिंह', 'प्रह्लाद', 'हिरण्यकशिपु', 'स्तम्भ'], /\b(narasimha|nrsimha|nrisimha|prahlada|hiranyakashipu|pillar)\b/gi],
  yogi: [2.5, ['योग', 'ध्यान', 'समाधि', 'प्राण', 'आसन', 'नाडी', 'धारणा', 'स्वर', 'कुण्डलिनी', 'इन्द्रिय'], /\b(yoga|yogi|meditat\w*|breath|prana|samadhi|posture|nadis?|svara|kundalini|senses)\b/gi],
  vishvarupa: [6, ['विश्वरूप', 'विराट्', 'विराज', 'सहस्रशीर्ष', 'अनन्तरूप'], /\b(universal form|cosmic form|thousand heads|virat)\b/gi],
  manuscript: [1, ['धर्म', 'शास्त्र', 'विद्या', 'नीति', 'आचार', 'वर्ण', 'व्यवहार', 'दण्ड', 'विवाह'], /\b(law|laws|duty|duties|conduct|knowledge|scriptures?|ethics|wisdom|counsel|rules?)\b/gi],
};

function score(text, titleText) {
  const out = {};
  for (const [scene, [w, stems, en]] of Object.entries(VOCAB)) {
    let n = 0;
    for (const st of stems) {
      let i = text.indexOf(st);
      while (i !== -1) {
        n++;
        i = text.indexOf(st, i + st.length);
      }
    }
    n += (text.match(en) || []).length;
    let t = 0;
    for (const st of stems) if (titleText.includes(st)) t++;
    t += (titleText.match(en) || []).length;
    out[scene] = w * (n + t * 40);
  }
  return out;
}

// ── category fallbacks, varied by chapter ─────────────────────────────────
const BY_CATEGORY = {
  veda: ['yajna', 'dawn'],
  upanishad: ['ashram', 'yogi', 'dawn'],
  vedanta: ['manuscript', 'ashram'],
  sutra: ['ashram', 'manuscript'],
  shakta: ['devi'],
  purana: ['lotus', 'temple', 'cosmos', 'ashram'],
  itihasa: ['palace', 'forest'],
  smriti: ['manuscript', 'palace'],
  tantra: ['kailash', 'yogi', 'stars'],
  stotra: ['temple', 'lotus'],
  other: ['ashram', 'temple'],
};

// ── hand-checked choices ──────────────────────────────────────────────────
const list = (...xs) => Object.fromEntries(xs.map((s, i) => [i + 1, s]));
const range = (a, b, s) => Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, s]));

/** Chapter id → scene, or a function of the chapter's title for nested books. */
const CURATED = {
  bhagavadgita: list(
    'kurukshetra', // 1 Arjuna's despair on the field
    'kurukshetra', // 2 Sāṅkhya, still between the armies
    'yajna', // 3 Karma yoga: action as yajña
    'ashram', // 4 the lineage of knowledge
    'lotus', // 5 untouched like the lotus leaf (5.10)
    'yogi', // 6 dhyāna
    'dawn', // 7 "the light of the sun and moon" (7.8)
    'stars', // 8 the akṣara, the paths of light and dark
    'temple', // 9 a leaf, a flower, a fruit, water (9.26)
    'kailash', // 10 vibhūti: Himālaya, Śaṅkara among the Rudras
    'vishvarupa', // 11 the cosmic form
    'lotus', // 12 bhakti
    'manuscript', // 13 the field and its knower
    'cosmos', // 14 the guṇas: "my womb is the great Brahman"
    'ashram', // 15 the aśvattha tree
    'storm', // 16 the divine and the demonic
    'yajna', // 17 threefold faith, yajña, tapas, dāna
    'kurukshetra', // 18 "wherever there is Kṛṣṇa and Arjuna"
  ),
  ramayana: list('yajna', 'ganga', 'forest', 'storm', 'ocean', 'lanka', 'palace'),
  ramcharitmanas: list('palace', 'ganga', 'forest', 'storm', 'ocean', 'lanka', 'palace'),
  mahabharata: list(
    'palace', 'palace', 'forest', 'palace', 'palace', // Ādi, Sabhā, Vana, Virāṭa, Udyoga
    'kurukshetra', 'kurukshetra', 'kurukshetra', 'kurukshetra', // Bhīṣma, Droṇa, Karṇa, Śalya
    'storm', 'dusk', 'manuscript', 'ashram', // Sauptika, Strī, Śānti, Anuśāsana
    'yajna', 'forest', 'ocean', 'yogi', 'vishvarupa', // Aśvamedhika, Āśramavāsika, Mausala, Mahāprasthānika, Svargārohaṇa
  ),
  ishavasya: list('dawn'),
  kena: list('ashram', 'ashram', 'kailash', 'storm'),
  katha: list('dusk', 'ashram', 'yogi', 'yogi', 'dawn', 'ashram'),
  mundaka: list('ashram', 'yajna', 'cosmos', 'yogi', 'ashram', 'ocean'),
  mandukya: list('stars'),
  prashna: list('cosmos', 'yogi', 'yogi', 'stars', 'dawn', 'ocean'),
  taittiriya: list('ashram', 'cosmos', 'lotus'),
  shvetashvatara: list('cosmos', 'yogi', 'kailash', 'ashram', 'cosmos', 'lotus'),
  amritabindu: list('yogi'),
  tejobindu: range(1, 7, 'yogi'),
  rigveda: list('yajna', 'yajna', 'dawn', 'storm', 'dawn', 'storm', 'ocean', 'dawn', 'yajna', 'cosmos'),
  yajurveda: { ...range(1, 40, 'yajna'), 16: 'kailash', 31: 'vishvarupa', 32: 'cosmos', 34: 'yogi', 36: 'dawn', 40: 'dawn' },
  samaveda: list('yajna', 'ashram', 'stars', 'dawn'),
  atharvaveda: { 10: 'cosmos', 11: 'cosmos', 12: 'ashram', 13: 'dawn', 14: 'palace', 15: 'yogi', 18: 'dusk', 20: 'yajna' },
  durgasaptashati: list('ocean', 'devi', 'devi', 'devi', 'kailash', 'devi', 'storm', 'lanka', 'devi', 'storm', 'dawn', 'temple', 'ganga'),
  yogasutra: list('yogi', 'yogi', 'stars', 'dawn'),
  shivasamhita: range(1, 5, 'yogi'),
  shivaswarodaya: list('yogi', 'cosmos', 'yogi', 'stars'),
  yogarasayanam: range(1, 3, 'yogi'),
  brahmasutra: range(1, 4, 'manuscript'),
  vivekchudamani: list('manuscript'),
  manusmriti: { ...range(1, 12, 'manuscript'), 1: 'cosmos', 7: 'palace', 12: 'dusk' },
  viduraniti: { ...range(1, 8, 'palace'), 1: 'manuscript', 8: 'dawn' },
  naradabhaktisutra: list('lotus'),
  shandilyabhaktisutra: range(1, 3, 'lotus'),
  nityakarmakriya: list('dawn', 'yajna', 'temple', 'temple', 'dawn'),
  kalkipuran: list('storm', 'storm', 'dawn'),
  varahapuran: list('ocean', 'ashram', 'lotus'),
  brahmavaivartapuran: list('cosmos', 'devi', 'kailash', 'vrindavan'),
  padmapuran: list('cosmos', 'lotus', 'ganga', 'stars', 'kailash', 'temple', 'kailash', 'lotus'),
  shivpurana: list('kailash', 'cosmos', 'yajna', 'kailash', 'kurukshetra', 'lanka', 'kailash', 'temple', 'devi', 'kailash', 'yogi'),
  yogavasishtha: list('palace', 'ashram', 'cosmos', 'ashram', 'lotus', 'vishvarupa'),
  vamanpuran: { 1: 'yajna', 2: 'yajna', 3: 'lotus' },
  narasimhapuran: { 1: 'pillar', 2: 'pillar' },
};

/** Books nested inside a chapter list: "Skandha 8, Adhyāya 7", "Book 5 - Adhyaya 3", "Parva 2, Adhyāya 9". */
function nested(title) {
  const m = /(?:skandha|book|parva)\s*(\d+)\D+(\d+)/i.exec(title || '');
  return m ? [Number(m[1]), Number(m[2])] : null;
}
const NESTED = {
  bhagavatapurana: (b, a) => {
    if (b === 1) return a >= 17 ? 'ganga' : 'ashram'; // Naimiṣa; Parīkṣit by the Gaṅgā
    if (b === 2) return 'vishvarupa'; // the Virāṭ Puruṣa
    if (b === 3) return a >= 13 && a <= 19 ? 'ocean' : 'cosmos'; // Varāha; creation, Kapila
    if (b === 4) return a >= 8 && a <= 12 ? 'stars' : a >= 2 && a <= 7 ? 'yajna' : 'ashram'; // Dhruva; Dakṣa's yajña
    if (b === 5) return a >= 16 ? 'cosmos' : 'ashram'; // bhuvana-kośa; Ṛṣabha, Jaḍa Bharata
    if (b === 6) return a <= 3 ? 'dusk' : a >= 9 && a <= 13 ? 'storm' : 'temple'; // Ajāmila; Vṛtra
    if (b === 7) return a <= 10 ? 'pillar' : 'manuscript'; // Prahlāda and Nṛsiṃha; varṇāśrama
    if (b === 8) return a >= 2 && a <= 4 ? 'lotus' : a >= 15 && a <= 23 ? 'yajna' : 'ocean'; // Gajendra; Vāmana at Bali's yajña; churning, Matsya
    if (b === 9) return a >= 10 && a <= 11 ? 'lanka' : 'palace'; // Rāma; the dynasties
    if (b === 10) return a <= 45 ? 'vrindavan' : 'palace'; // Vraja; Mathurā and Dvārakā
    if (b === 11) return a >= 30 ? 'ocean' : 'ashram'; // Dvārakā's end; Uddhava Gītā
    if (b === 12) return a >= 8 && a <= 10 ? 'ocean' : 'storm'; // Mārkaṇḍeya and the deluge; Kali-yuga
    return null;
  },
  devibhagavat: (b) => ({ 1: 'ashram', 2: 'palace', 3: 'devi', 4: 'ashram', 5: 'devi', 6: 'storm', 7: 'kailash', 8: 'cosmos', 9: 'ganga', 10: 'stars', 11: 'temple', 12: 'devi' })[b] ?? null,
  // Viṣṇu Parva is Kṛṣṇa's; the Harivaṃśa and Bhaviṣya Parvas range widely, so their chapters are read.
  harivanshpuran: (b) => (b === 2 ? 'vrindavan' : null),
  vishnupurana: (b, a) => {
    if (b === 1) return a >= 16 && a <= 20 ? 'pillar' : a >= 11 && a <= 12 ? 'stars' : 'cosmos';
    return ({ 2: 'stars', 3: 'manuscript', 4: 'palace', 5: 'vrindavan', 6: a >= 6 ? 'yogi' : 'storm' })[b] ?? null;
  },
};

// ── run ───────────────────────────────────────────────────────────────────
const chaptersIndex = JSON.parse(readFileSync(join(ROOT, 'public/data/chapters.json'), 'utf8'));
const fullDir = join(ROOT, 'public/data/scriptures-full');
const result = {};
const tally = {};

for (const [sid, chapters] of Object.entries(chaptersIndex)) {
  const fullPath = join(fullDir, `${sid}.json`);
  let full = null;
  if (existsSync(fullPath)) {
    const raw = readFileSync(fullPath, 'utf8');
    if (raw.startsWith('{')) full = JSON.parse(raw);
  }
  const category = full?.category ?? 'other';
  const verseText = new Map();
  for (const ch of full?.chapters ?? []) {
    verseText.set(
      ch.number ?? ch.id,
      (ch.verses || []).map((v) => `${v.sanskrit || ''} ${v.translation || ''}`).join(' '),
    );
  }
  const maxId = Math.max(...chapters.map((c) => c.id));
  const codes = Array(maxId + 1).fill('-');
  for (const ch of chapters) {
    let scene = CURATED[sid]?.[ch.id] ?? null;
    const n = nested(ch.title);
    if (!scene && n && NESTED[sid]) scene = NESTED[sid](n[0], n[1]);
    let how = scene ? 'curated' : '';
    if (!scene) {
      const titleText = `${ch.title || ''} ${ch.titleSanskrit || ''}`;
      const s = score(verseText.get(ch.id) || '', titleText);
      const ranked = Object.entries(s).sort((a, b) => b[1] - a[1]);
      const [best, top] = ranked[0];
      const second = ranked[1][1];
      if (top >= 12 && top >= second * 1.25) {
        scene = best;
        how = 'read';
      }
    }
    if (!scene) {
      const pool = BY_CATEGORY[category] ?? BY_CATEGORY.other;
      scene = pool[ch.id % pool.length];
      how = 'category';
    }
    codes[ch.id] = CODE[scene];
    tally[how] = (tally[how] || 0) + 1;
  }
  result[sid] = codes.join('');
}

const body = `// Generated by scripts/build-chapter-painting-map.mjs. Do not edit by hand.
// One letter per chapter id (index 0 unused, '-' = no chapter): see PAINTING_IDS for the alphabet.
export const PAINTING_IDS = ${JSON.stringify(SCENES)} as const;

export const CHAPTER_PAINTING_CODES: Record<string, string> = ${JSON.stringify(result, null, 2)};
`;
writeFileSync(join(ROOT, 'lib/chapter-paintings.generated.ts'), body);
console.log('chapters:', tally);
const dist = {};
for (const s of Object.values(result)) for (const c of s) if (c !== '-') dist[SCENES[c.charCodeAt(0) - 97]] = (dist[SCENES[c.charCodeAt(0) - 97]] || 0) + 1;
console.log('scenes:', dist);
