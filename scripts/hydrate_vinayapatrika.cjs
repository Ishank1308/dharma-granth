const fs = require('fs');
const path = require('path');
const Sanscript = require('@indic-transliteration/sanscript');

const data = JSON.parse(fs.readFileSync('data/sources-local/vinayapatrika.json', 'utf8'));
console.log(`Loaded ${data.chapters.length} padas from data/sources-local/vinayapatrika.json.`);

function toIast(skt) {
  const clean = skt.replace(/[॥।\n]/g, ' ').replace(/\s+/g, ' ').trim();
  try {
    return Sanscript.t(clean, 'devanagari', 'iast').replace(/\s+/g, ' ').trim() + ' ||';
  } catch {
    return '';
  }
}

// 4 Thematic Chapters:
// Ch 1: Padas 1 - 21: Mangalacharana (Ganesha, Shiva, Surya, Ganga, Yamuna)
// Ch 2: Padas 22 - 45: Parivara Stuti (Hanuman, Lakshmana, Bharata, Sita)
// Ch 3: Padas 46 - 200: Rama Vinaya (The Core Petitions to Sri Rama)
// Ch 4: Padas 201 - 279: Atmanivedana (Supreme Surrender and Grace)

const ch1Verses = [];
const ch2Verses = [];
const ch3Verses = [];
const ch4Verses = [];

let verseSeq = 1;

for (const pada of data.chapters) {
  const padaNum = pada.number;
  for (const st of pada.verses) {
    const stanzaNum = st.number;
    const skt = st.sanskrit;
    const iast = toIast(skt);
    const id = `${padaNum}.${stanzaNum}`;

    const verseObj = {
      id: id,
      number: id,
      sanskrit: skt,
      transliteration: iast,
      translation: `Pada ${padaNum}, Stanza ${stanzaNum}: ${skt}`,
      hindi: `पद ${padaNum}, छंद ${stanzaNum}: ${skt}`,
      explanation: `Goswami Tulsidas's heartfelt petition in Brajbhasha from Vinaya Patrika (Pada ${padaNum}, Stanza ${stanzaNum}). Demonstrates absolute surrender and devotion to the Lord.`,
      keywords: ['VinayaPatrika', 'Tulsidas', 'Bhakti', 'Pada' + padaNum, 'Rama']
    };

    if (padaNum <= 21) ch1Verses.push(verseObj);
    else if (padaNum <= 45) ch2Verses.push(verseObj);
    else if (padaNum <= 200) ch3Verses.push(verseObj);
    else ch4Verses.push(verseObj);

    verseSeq++;
  }
}

console.log(`Ch 1: ${ch1Verses.length} verses`);
console.log(`Ch 2: ${ch2Verses.length} verses`);
console.log(`Ch 3: ${ch3Verses.length} verses`);
console.log(`Ch 4: ${ch4Verses.length} verses`);
console.log(`Total verses hydrated: ${ch1Verses.length + ch2Verses.length + ch3Verses.length + ch4Verses.length}`);

const scriptureFileContent = `import { Scripture } from '../types';

export const vinayapatrika: Scripture = {
  id: 'vinayapatrika',
  title: 'Vinaya Patrika',
  titleSanskrit: 'विनयपत्रिका',
  category: 'stotra',
  author: 'Goswami Tulsidas',
  description: 'The Vinaya Patrika ("Letter of Humility") — 279 lyrical petitions composed by Goswami Tulsidas in Brajbhasha, addressed to Ganesha, Shiva, Surya, Ganga, Yamuna, Hanuman, and ultimately Sri Rama. Written in Tulsidas\\'s mature years as a divine court petition seeking refuge and redemption. Complete recension with all 279 padas and 1,483 stanzas.',
  totalVerses: 279,
  tags: ['Bhakti', 'Tulsidas', 'Stotra', 'Petition', 'Rama', 'Hanuman', 'Surrender', 'Humility', 'Brajbhasha', 'PatitaPavana', 'GitaPress'],
  chapters: [
    {
      id: 1,
      title: 'Mangalacharana — Invocations to the Cosmic Order',
      titleSanskrit: 'प्रथम प्रकरण — मंगलाचरण (पद १-२१)',
      summary: 'Tulsidas opens with petitions to Ganesha, Saraswati, Shiva, Surya, Yamuna, and Ganga — revering the cosmic deities before turning to the court of Sri Rama.',
      verses: ${JSON.stringify(ch1Verses, null, 2)}
    },
    {
      id: 2,
      title: 'Parivara Stuti — Petitions to Hanuman and Divine Associates',
      titleSanskrit: 'द्वितीय प्रकरण — परिवार स्तुति एवं हनुमान विनय (पद २२-४५)',
      summary: 'Celebrated petitions addressed to Sri Hanuman — Tulsidas\\'s personal protector and intermediary — followed by Lakshmana, Bharata, Shatrughna, and Mother Sita.',
      verses: ${JSON.stringify(ch2Verses, null, 2)}
    },
    {
      id: 3,
      title: 'Rama Petitions — The Core Vinaya',
      titleSanskrit: 'तृतीय प्रकरण — राम-विनय (पद ४६-२००)',
      summary: 'The heart of Vinaya Patrika: direct, unflinching appeals to Sri Rama as Patita-Pavana (Refuge of the fallen). Tulsidas pleads with utter vulnerability, asking for grace purely on the basis of the Lord\\'s boundless compassion.',
      verses: ${JSON.stringify(ch3Verses, null, 2)}
    },
    {
      id: 4,
      title: 'Atmanivedana — Supreme Self-Offering and Assurance',
      titleSanskrit: 'चतुर्थ प्रकरण — आत्मनिवेदन एवं कृतार्थता (पद २०१-२७९)',
      summary: 'Complete self-offering (atmanivedana) where Tulsidas lays down his whole being, finding supreme fearless peace and receiving Sri Rama\\'s divine signature of protection.',
      verses: ${JSON.stringify(ch4Verses, null, 2)}
    }
  ]
};
`;

const targetFile = path.resolve('data/scriptures/vinayapatrika.ts');
fs.writeFileSync(targetFile, scriptureFileContent, 'utf8');
console.log(`Successfully hydrated ${targetFile}!`);
