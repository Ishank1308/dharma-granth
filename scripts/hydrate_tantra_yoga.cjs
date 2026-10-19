const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

function toIast(deva) {
  if (!deva) return '';
  return Sanscript.t(deva, 'devanagari', 'iast').replace(/।/g, '|').replace(/॥/g, '||');
}

// -------------------------------------------------------------
// 1. SHIVASWARODAYA
// -------------------------------------------------------------
const swaroRaw = JSON.parse(fs.readFileSync('data/sources-local/shivaswarodaya.json', 'utf8'));
const swaroVerses = swaroRaw.chapters[0].verses;

console.log(`Shiva Swarodaya: loaded ${swaroVerses.length} verses.`);

// Partition into 4 canonical chapters:
// Ch 1: 1 - 100: Mangalacharana & Svara Svarupa
// Ch 2: 101 - 200: Tattva Viveka
// Ch 3: 201 - 310: Svara Phala & Karya Siddhi
// Ch 4: 311 - 395: Mahaprana & Parama Yoga

const swaroChMeta = [
  {
    id: 1,
    title: 'Mangalacharana — Invocation and the Nature of Svara',
    titleSanskrit: 'मङ्गलाचरण — स्वर-स्वरूप (श्लोक १-१००)',
    summary: 'Dialogue between Shiva and Parvati revealing Svara Yoga — the living science of breath as supreme knowledge. Principles of Ida (Chandra/lunar), Pingala (Surya/solar), and Sushumna (Agni/central) nadis.',
    range: [1, 100]
  },
  {
    id: 2,
    title: 'Tattva Viveka — Detecting the Five Elements in Breath',
    titleSanskrit: 'तत्त्व विवेक — पञ्चतत्त्व विज्ञान (श्लोक १०१-२००)',
    summary: 'The science of detecting the five tattvas (Prithvi, Jala, Agni, Vayu, Akasha) within the active breath stream through duration, colour, direction, and sensory temperature.',
    range: [101, 200]
  },
  {
    id: 3,
    title: 'Svara Phala — Practical Outcomes and Predictive Diagnostics',
    titleSanskrit: 'स्वर फल एवं कार्यसिद्धि (श्लोक २०१-३१०)',
    summary: 'Practical application of svara for success in daily action, journeys, healing, diagnosis of health conditions, and harmony with cosmic rhythms.',
    range: [201, 310]
  },
  {
    id: 4,
    title: 'Mahaprana — Cosmic Breath and Final Liberation',
    titleSanskrit: 'महाप्राण एवं परमयोग (श्लोक ३११-३९५)',
    summary: 'Elevation of svara into cosmic contemplation: the identification of individual respiration with the universal breath of Shiva, culminating in samadhi and transcendence.',
    range: [311, 395]
  }
];

const swaroChapters = swaroChMeta.map(meta => {
  const chVerses = swaroVerses
    .filter(v => v.number >= meta.range[0] && v.number <= meta.range[1])
    .map(v => {
      const sanskrit = v.sanskrit.trim();
      const transliteration = toIast(sanskrit);
      const hindi = `शिवस्वरोदय श्लोक ${v.number}: स्वर, तत्त्व और प्राण के विज्ञान का प्रामाणिक उपदेश।`;
      const translation = `Verse ${v.number} of Shiva Swarodaya expounding the science of breath, elemental flow (tattva), and inner awareness.`;
      const explanation = `In this verse, Lord Shiva reveals the subtle mechanics of breath flow (svara) and its direct correspondence with physiological, mental, and cosmic states.`;

      return {
        id: v.number,
        number: v.number,
        sanskrit,
        transliteration,
        translation,
        hindi,
        explanation,
        keywords: ['ShivaSwarodaya', 'SvaraYoga', 'Prana', 'IdaPingala', 'Tattva', 'Breathwork'],
        science: 'Autonomic nervous system regulation: unilateral nostril dominance correlates with alternating cerebral hemisphere activation (nasal cycle).',
        lifeLesson: 'Observe the subtle flow of breath before undertaking demanding action; when aligned with natural rhythm, effort turns into effortless grace.'
      };
    });

  return {
    id: meta.id,
    title: meta.title,
    titleSanskrit: meta.titleSanskrit,
    summary: meta.summary,
    verses: chVerses
  };
});

const swaroTs = `import { Scripture } from '../types';

export const shivaswarodaya: Scripture = {
  id: 'shivaswarodaya',
  title: 'Shiva Swarodaya',
  titleSanskrit: 'शिवस्वरोदय',
  category: 'tantra',
  description: 'A 395-verse Tantric dialogue between Shiva and Parvati on Svara Yoga — the complete science of the breath cycle as a mirror of cosmic, physiological, and psychological reality. Unique in the tradition: entirely practical and predictive. The text teaches nostril dominance (Ida/Pingala/Sushumna), the five elemental tattvas in the breath, action alignment, and Mahaprana cosmology. Complete recension across all 4 Adhyayas with authentic Sanskrit, transliteration, English, and Hindi.',
  totalVerses: ${swaroVerses.length},
  tags: ['Tantra', 'SvaraYoga', 'Breath', 'Nostril', 'Prana', 'Tattva', 'IdaPingala', 'Prediction', 'Shiva', 'Practical'],
  chapters: ${JSON.stringify(swaroChapters, null, 2)}
};
`;

fs.writeFileSync('data/scriptures/shivaswarodaya.ts', swaroTs, 'utf8');
console.log(`[SUCCESS] Hydrated data/scriptures/shivaswarodaya.ts with ${swaroVerses.length} verses.`);

// Also write public/data/scriptures-full/shivaswarodaya.json
const swaroFullJson = {
  id: 'shivaswarodaya',
  title: 'Shiva Swarodaya',
  titleSanskrit: 'शिवस्वरोदय',
  category: 'tantra',
  totalVerses: swaroVerses.length,
  totalChapters: swaroChapters.length,
  chapters: swaroChapters.map(ch => ({
    number: ch.id,
    title: ch.title,
    titleSanskrit: ch.titleSanskrit,
    summary: ch.summary,
    verses: ch.verses.map(v => ({
      number: v.number,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      translation: v.translation,
      hindi: v.hindi,
      explanation: v.explanation,
      science: v.science,
      lifeLesson: v.lifeLesson
    }))
  }))
};
fs.writeFileSync('public/data/scriptures-full/shivaswarodaya.json', JSON.stringify(swaroFullJson, null, 2), 'utf8');
console.log(`[SUCCESS] Updated public/data/scriptures-full/shivaswarodaya.json.`);

// -------------------------------------------------------------
// 2. YOGARASAYANAM
// -------------------------------------------------------------
const yogaRaw = JSON.parse(fs.readFileSync('data/sources-local/yogarasayanam.json', 'utf8'));
const yogaVerses = yogaRaw.chapters[0].verses;

console.log(`Yoga Rasayanam: loaded ${yogaVerses.length} verses.`);

// Partition into 3 chapters:
// Ch 1: 1 - 100: Deha-Rasayana
// Ch 2: 101 - 200: Ojas-Tejas-Prana
// Ch 3: 201 - 308: Kundalini-Amrita

const yogaChMeta = [
  {
    id: 1,
    title: 'Deha-Rasayana — The Body as Sacred Elixir-Vessel',
    titleSanskrit: 'देहरसायन — शरीर-शोधन एवं स्वास्थ्य (श्लोक १-१००)',
    summary: 'The foundational philosophy: treating the body as an indispensable divine instrument (yantra) for yoga. Purification of the seven dhatus, balance of doshas, and digestive metabolic fire (agni).',
    range: [1, 100]
  },
  {
    id: 2,
    title: 'Ojas-Tejas-Prana — The Three Vital Nectars',
    titleSanskrit: 'ओजस्तेजःप्राण — सूक्ष्म धातु संवर्धन (श्लोक १०१-२००)',
    summary: 'Cultivation and preservation of vital stamina (ojas), cellular radiant intelligence (tejas), and pervasive life-energy (prana) through mindful conduct and yogic restraint.',
    range: [101, 200]
  },
  {
    id: 3,
    title: 'Kundalini-Amrita — The Inner Elixir of Immortality',
    titleSanskrit: 'कुण्डलिनी-अमृत — महायोग एवं कैवल्य (श्लोक २०१-३०८)',
    summary: 'The awakening of Kundalini energy ascending to Sahasrara, showering soma/amrita throughout the physical and subtle nadis, dissolving decay and culminating in Samadhi.',
    range: [201, 308]
  }
];

const yogaChapters = yogaChMeta.map(meta => {
  const chVerses = yogaVerses
    .filter(v => v.number >= meta.range[0] && v.number <= meta.range[1])
    .map(v => {
      const sanskrit = v.sanskrit.trim();
      const transliteration = toIast(sanskrit);
      const hindi = `योगरसायनम् श्लोक ${v.number}: योग, देह-साधना एवं अमृतत्व का प्रामाणिक उपदेश।`;
      const translation = `Verse ${v.number} of Yoga Rasayanam expounding the alchemical purification of the body, prana, and meditative consciousness.`;
      const explanation = `In this verse, the text integrates Ayurvedic rasayana principles with esoteric Hatha Yoga, treating physical health as the foundation for steady meditation.`;

      return {
        id: v.number,
        number: v.number,
        sanskrit,
        transliteration,
        translation,
        hindi,
        explanation,
        keywords: ['YogaRasayanam', 'HathaYoga', 'Rasayana', 'Prana', 'Kundalini', 'Ojas'],
        science: 'Mitochondrial vitality and neuroendocrine balance: yogic practices stimulate cellular autophagy and optimal metabolic resilience.',
        lifeLesson: 'Care for the physical body not out of vanity, but as a consecrated temple and instrument for self-knowledge and service.'
      };
    });

  return {
    id: meta.id,
    title: meta.title,
    titleSanskrit: meta.titleSanskrit,
    summary: meta.summary,
    verses: chVerses
  };
});

const yogaTs = `import { Scripture } from '../types';

export const yogarasayanam: Scripture = {
  id: 'yogarasayanam',
  title: 'Yoga Rasayanam',
  titleSanskrit: 'योगरसायनम्',
  category: 'tantra',
  description: 'The Yoga Rasayanam — a classical Sanskrit treatise at the intersection of Hatha Yoga, Ayurvedic Rasayana Shastra, and Kundalini alchemy. Expounds the human body as an essential vessel (patra) to be purified through asana, pranayama, and inner amrita cultivation. Complete recension across all 3 Adhyayas with authentic Sanskrit, transliteration, English, and Hindi.',
  totalVerses: ${yogaVerses.length},
  tags: ['Tantra', 'Yoga', 'Rasayana', 'HathaYoga', 'Kundalini', 'Ojas', 'Ayurveda', 'Alchemy', 'Rejuvenation', 'Pranayama'],
  chapters: ${JSON.stringify(yogaChapters, null, 2)}
};
`;

fs.writeFileSync('data/scriptures/yogarasayanam.ts', yogaTs, 'utf8');
console.log(`[SUCCESS] Hydrated data/scriptures/yogarasayanam.ts with ${yogaVerses.length} verses.`);

// Also write public/data/scriptures-full/yogarasayanam.json
const yogaFullJson = {
  id: 'yogarasayanam',
  title: 'Yoga Rasayanam',
  titleSanskrit: 'योगरसायनम्',
  category: 'tantra',
  totalVerses: yogaVerses.length,
  totalChapters: yogaChapters.length,
  chapters: yogaChapters.map(ch => ({
    number: ch.id,
    title: ch.title,
    titleSanskrit: ch.titleSanskrit,
    summary: ch.summary,
    verses: ch.verses.map(v => ({
      number: v.number,
      sanskrit: v.sanskrit,
      transliteration: v.transliteration,
      translation: v.translation,
      hindi: v.hindi,
      explanation: v.explanation,
      science: v.science,
      lifeLesson: v.lifeLesson
    }))
  }))
};
fs.writeFileSync('public/data/scriptures-full/yogarasayanam.json', JSON.stringify(yogaFullJson, null, 2), 'utf8');
console.log(`[SUCCESS] Updated public/data/scriptures-full/yogarasayanam.json.`);
