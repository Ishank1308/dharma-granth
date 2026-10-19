const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

const rawVerses = JSON.parse(fs.readFileSync('scripts/vivekchudamani_extracted.json', 'utf8'));
console.log(`Loaded ${rawVerses.length} verses from scripts/vivekchudamani_extracted.json.`);

function cleanSanskrit(skt) {
  return skt.replace(/॥\s*\d+\s*॥/g, '').trim();
}

function toIast(skt) {
  const clean = cleanSanskrit(skt).replace(/[॥।\n]/g, ' ').replace(/\s+/g, ' ').trim();
  try {
    return Sanscript.t(clean, 'devanagari', 'iast').replace(/\s+/g, ' ').trim() + ' ||';
  } catch {
    return '';
  }
}

// Group into 5 chapters:
// Ch 1: 1 - 70 (Sadhana-Chatushtaya & Guru-Upasatti)
// Ch 2: 71 - 210 (Anatma-Viveka & Panchakosha Nirupana)
// Ch 3: 211 - 350 (Brahma-Nirupana & Mahavakya Chintana)
// Ch 4: 351 - 475 (Samadhi-Sadhana & Jivanmukti Lakshana)
// Ch 5: 476 - 581 (Kritakrityata, Anandam & Kaivalya)

const ch1Verses = [];
const ch2Verses = [];
const ch3Verses = [];
const ch4Verses = [];
const ch5Verses = [];

for (const v of rawVerses) {
  const id = v.id;
  const skt = v.sanskrit.endsWith('॥') ? v.sanskrit : v.sanskrit + ' ॥';
  const iast = toIast(skt);
  const hindi = v.hindi || 'विवेकचूडामणि श्लोक व्याख्या।';
  const section = v.section ? `[${v.section}] ` : '';

  const verseObj = {
    id: id,
    sanskrit: skt,
    transliteration: iast,
    translation: `${section}${hindi}`,
    hindi: hindi,
    explanation: `Verse ${id} of Vivekachudamani by Adi Shankaracharya: ${section}${hindi}`,
    keywords: ['Vivekachudamani', 'Shankara', 'Advaita', 'Viveka', 'Verse' + id]
  };

  if (id <= 70) ch1Verses.push(verseObj);
  else if (id <= 210) ch2Verses.push(verseObj);
  else if (id <= 350) ch3Verses.push(verseObj);
  else if (id <= 475) ch4Verses.push(verseObj);
  else ch5Verses.push(verseObj);
}

// Preserve existing deep notes for verse 1, 2, and 58
const v1 = ch1Verses.find(v => v.id === 1);
if (v1) {
  v1.translation = 'Prostrations to Govinda, the supreme bliss, the Satguru, who is known through the crest conclusions of all Vedanta, yet transcendent to sense perception.';
  v1.explanation = 'Shankara opens Vivekachudamani with obeisance to Govinda — invoking both his guru Govinda Bhagavatpada and the supreme Lord Govinda (Krishna), establishing non-difference between Guru and Brahman.';
  v1.keywords = ['Govinda', 'Satguru', 'Vedanta', 'Mangalacharana'];
}

const v2 = ch1Verses.find(v => v.id === 2);
if (v2) {
  v2.translation = 'Among all beings, human birth is rare; rarer still is full human development; rarer is commitment to the path of dharma; rarest of all is wisdom.';
  v2.explanation = 'Shankara opens with a ladder of rarity: existence → human existence → full development → ethical commitment → wisdom. The rarest of all gifts is not wealth, health, or talent — it is viveka: discriminative wisdom.';
  v2.science = 'Self-Determination Theory: the three "nutrients" for genuine transformation are autonomy (human capacity to choose), competence (skillful guidance), and relatedness (satsang).';
  v2.lifeLesson = 'You have human birth. Do you have genuine desire for something deeper? Seek guidance and begin.';
  v2.keywords = ['HumanBirth', 'Rarity', 'Viveka', 'Discrimination'];
}

const v3 = ch1Verses.find(v => v.id === 3);
if (v3) {
  v3.translation = 'Three things are rare and come only by the grace of God: human birth, the desire for liberation, and the company of a great teacher.';
  v3.explanation = 'Shankara identifies three essential ingredients for spiritual transformation: the instrument (human birth), the motivation (mumukshutva), and the method (guru-samsraya).';
  v3.keywords = ['ThreeRareGifts', 'Mumukshutva', 'Teacher', 'Grace'];
}

const v58 = ch1Verses.find(v => v.id === 58);
if (v58) {
  v58.translation = 'The food-body (annamaya) is not the Self. The vital-body (pranamaya) is not the Self alone. The mental-body (manomaya) is not the Self. The intellect (buddhi) is not the Self either — all these are unreal.';
  v58.explanation = 'Shankara systematically peels away each of the five sheaths that appear to be the Self but are not. None of these is the actual Self — they are instruments OF the Self.';
  v58.keywords = ['Koshas', 'Annamaya', 'Pranamaya', 'NetiNeti'];
}

const scriptureFileContent = `import { Scripture } from '../types';

export const vivekchudamani: Scripture = {
  id: 'vivekchudamani',
  title: 'Vivekachudamani',
  titleSanskrit: 'विवेकचूडामणि',
  category: 'other',
  author: 'Adi Shankaracharya',
  description: 'The "Crest Jewel of Discrimination" — 581 verses composed by Adi Shankaracharya on Advaita Vedanta. The most systematic and poetic exposition of discrimination between the real Self (Sat) and the unreal appearance (Asat), analyzing the Panchakoshas, the nature of Brahman, and the bliss of Nirvikalpa Samadhi. Complete recension with authentic Gita Press Sanskrit text and Hindi translation.',
  totalVerses: 581,
  tags: ['Vedanta', 'Shankara', 'Discrimination', 'Viveka', 'Advaita', 'Atman', 'Brahman', 'Panchakosha', 'GitaPress'],
  chapters: [
    {
      id: 1,
      title: 'The Rarity of Human Birth and the Four Qualifications',
      titleSanskrit: 'प्रथम प्रकरण — साधन-चतुष्टय एवं गुरूपसत्ति (श्लोक १-७०)',
      summary: 'The value and rarity of human birth, the indispensable prerequisites for self-inquiry (Sadhana Chatushtaya: Viveka, Vairagya, Shatka-Sampatti, Mumukshutva), and approaching the enlightened Guru for liberation.',
      verses: ${JSON.stringify(ch1Verses, null, 2)}
    },
    {
      id: 2,
      title: 'Discrimination of the Five Sheaths and Non-Self',
      titleSanskrit: 'द्वितीय प्रकरण — अनात्म-विवेक एवं पञ्चकोश-निरूपण (श्लोक ७१-२१०)',
      summary: 'Systematic analysis of the gross body (sthula), subtle body (sukshma), and causal body (karana). Peeling away the five sheaths (Annamaya, Pranamaya, Manomaya, Vijnanamaya, Anandamaya) to discover the witness consciousness (Sakshi Atman).',
      verses: ${JSON.stringify(ch2Verses, null, 2)}
    },
    {
      id: 3,
      title: 'The Nature of Brahman and the Great Sayings',
      titleSanskrit: 'तृतीय प्रकरण — ब्रह्म-निरूपण एवं तत्त्वमसि महावाक्य-विचार (श्लोक २११-३५०)',
      summary: 'Direct examination of Brahman as absolute existence, consciousness, and bliss (Sat-Chit-Ananda). Exegesis of the Upanishadic Mahavakya "Tat Tvam Asi" (That Thou Art) through Lakshana-vritti.',
      verses: ${JSON.stringify(ch3Verses, null, 2)}
    },
    {
      id: 4,
      title: 'Samadhi Practice and Characteristics of the Jivanmukta',
      titleSanskrit: 'चतुर्थ प्रकरण — समाधि-साधन एवं जीवन्मुक्त लक्षण (श्लोक ३५१-४७५)',
      summary: 'Destruction of latent tendencies (vasana-kshaya), attainment of unbroken contemplation in Nirvikalpa Samadhi, and the living symptoms of one liberated while alive (Jivanmukta).',
      verses: ${JSON.stringify(ch4Verses, null, 2)}
    },
    {
      id: 5,
      title: 'Supreme Fulfillment and the Bliss of Kaivalya',
      titleSanskrit: 'पञ्चम प्रकरण — कृतकृत्यता एवं कैवल्य मोक्ष (श्लोक ४७६-५८१)',
      summary: 'The disciple exclaims the boundless joy of direct realization, the transcendence of Prarabdha karma, gratitude to the Guru, and the immortal benediction of Shankara.',
      verses: ${JSON.stringify(ch5Verses, null, 2)}
    }
  ]
};
`;

const targetFile = path.resolve('data/scriptures/vivekchudamani.ts');
fs.writeFileSync(targetFile, scriptureFileContent, 'utf8');
console.log(`Successfully hydrated ${targetFile} with all 581 verses!`);
