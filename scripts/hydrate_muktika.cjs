const fs = require('fs');
const path = require('path');

const jsonPath = path.resolve('public/data/scriptures-full/muktika.json');
const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Loaded Muktika with ${raw.chapters.length} chapters.`);

const chaptersData = raw.chapters.map((ch, idx) => {
  const chNum = ch.number || idx + 1;
  const verses = (ch.verses || []).map((v, vIdx) => {
    const vNum = v.number || vIdx + 1;
    return {
      id: vNum,
      number: vNum,
      sanskrit: v.sanskrit || '',
      transliteration: v.transliteration || '',
      translation: v.translation || '',
      hindi: v.hindi || '',
      explanation: v.hindi || v.translation || '',
      keywords: ['Muktika', 'Upanishad', 'Liberation', 'Mandukya', 'Hanuman', 'Rama'],
      lifeLesson: 'True liberation (jivanmukti) begins with the stilling of mental chatter (vritti) and finding freedom while engaged in daily duty.'
    };
  });

  return {
    id: chNum,
    title: chNum === 1 ? 'Hanuman Asks — The Canon of 108 Upanishads' : 'Jivanmukti and Videhamukti — Nature of Liberation',
    titleSanskrit: chNum === 1 ? 'हनुमान का प्रश्न एवं १०८ उपनिषदों की नामावली' : 'जीवन्मुक्ति एवं विदेहमुक्ति का स्वरूप',
    summary: chNum === 1
      ? 'Hanuman asks Sri Rama about the ultimate means to liberation. Rama reveals that the Mandukya Upanishad alone suffices; for deeper inquiry, the 10 Principal, 32, and all 108 Upanishads are expounded with their Vedic affiliations.'
      : 'Sri Rama expounds the science of Jivanmukti (liberation while living) and Videhamukti. Explains the dissolution of latent impressions (vasana-kshaya), the destruction of mental clinging (mano-nasha), and supreme peace.',
    verses
  };
});

const tsContent = `import { Scripture } from '../types';

export const muktika: Scripture = {
  id: 'muktika',
  title: 'Muktika Upanishad',
  titleSanskrit: 'मुक्तिकोपनिषद्',
  category: 'upanishad',
  description: 'The "Upanishad of liberation." A dialogue between Rama and Hanuman — uniquely, Rama is the guru and Hanuman the disciple. The Muktika is the canonical meta-Upanishad: it lists all 108 Upanishads, establishes their authority, and makes two audacious claims: (1) the Mandukya Upanishad alone is sufficient for liberation, and (2) the study of all 108 Upanishads is equivalent to reading the entire Vedas. Complete recension across both Adhyayas with authentic Sanskrit, transliteration, English, and Hindi translations.',
  totalVerses: ${chaptersData.reduce((acc, c) => acc + c.verses.length, 0)},
  tags: ['Upanishad', 'Muktika', 'Rama', 'Hanuman', 'Mandukya', '108Upanishads', 'Liberation', 'Jivanmukti'],
  chapters: ${JSON.stringify(chaptersData, null, 2)}
};
`;

const targetTs = path.resolve('data/scriptures/muktika.ts');
fs.writeFileSync(targetTs, tsContent, 'utf8');
console.log(`Successfully hydrated ${targetTs} with ${chaptersData.reduce((acc, c) => acc + c.verses.length, 0)} verses!`);
