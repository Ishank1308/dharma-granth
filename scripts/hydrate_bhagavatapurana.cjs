const fs = require('fs');
const path = require('path');

function main() {
  const targetPath = path.resolve('data/scriptures/bhagavatapurana.ts');
  const data = JSON.parse(fs.readFileSync('scripts/bhagavata_extracted.json', 'utf8'));

  const chapterMeta = [
    {
      id: 1,
      title: 'Skandha 1 — Creation and First Steps',
      titleSanskrit: 'प्रथम स्कन्ध',
      summary: 'The opening Skandha: the framing of the Bhagavata\'s purpose and the highest dharma — devotion to God free from all motive. Features the Mangalacharana, the questions of the sages in Naimisharanya, and Suta Goswami\'s discourse.'
    },
    {
      id: 2,
      title: 'Skandha 2 — Cosmic Manifestation',
      titleSanskrit: 'द्वितीय स्कन्ध',
      summary: 'Shuka teaches Parikshit on the Virat Purusha and the path of devotion at the moment of death. The great teaching: remember God at the moment of death, and you attain liberation.'
    },
    {
      id: 3,
      title: 'Skandha 3 — Status Quo',
      titleSanskrit: 'तृतीय स्कन्ध',
      summary: 'Kapila\'s teaching on Samkhya — the analysis of nature and consciousness. The famous Kapilopadesha: a mother\'s son becomes a sage and teaches her the path of liberation.'
    },
    {
      id: 4,
      title: 'Skandha 4 — Creation of the Fourth Order',
      titleSanskrit: 'चतुर्थ स्कन्ध',
      summary: 'The story of Dhruva — a child who, rejected by his father, turns to God in complete intensity and receives the immovable star as his eternal seat. Also contains the life and allegories of King Prithu.'
    },
    {
      id: 5,
      title: 'Skandha 5 — Creative Impetus',
      titleSanskrit: 'पञ्चम स्कन्ध',
      summary: 'Rishabhadeva renounces everything and demonstrates the life of absolute non-attachment. The story of King Bharata and the cosmic topography of the universe.'
    },
    {
      id: 6,
      title: 'Skandha 6 — Prescribed Duties',
      titleSanskrit: 'षष्ठ स्कन्ध',
      summary: 'Ajamila accidentally calls his son Narayana at the moment of death and is liberated. The Bhagavata\'s radical declaration on the transformative power of the divine name.'
    },
    {
      id: 7,
      title: 'Skandha 7 — The Science of God (Prahlada)',
      titleSanskrit: 'सप्तम स्कन्ध — प्रह्लाद चरित',
      summary: 'The child Prahlada refuses to abandon his devotion to Vishnu despite his father Hiranyakashipu\'s tortures. Vishnu manifests as Narasimha to protect him. The supreme narrative of pure devotion.'
    },
    {
      id: 8,
      title: 'Skandha 8 — Withdrawal of Cosmic Creations',
      titleSanskrit: 'अष्टम स्कन्ध',
      summary: 'Gajendra Moksha — the king of elephants surrenders all ego and calls out to God with pure need. Also features the churning of the milk ocean (Samudra Manthana) and the Vamana incarnation.'
    },
    {
      id: 9,
      title: 'Skandha 9 — Liberation',
      titleSanskrit: 'नवम स्कन्ध',
      summary: 'The genealogy of the solar and lunar dynasties culminating in the advent of Rama and Krishna. Contains the Ambarisha-Durvasa story of steadfast devotion.'
    },
    {
      id: 10,
      title: 'Skandha 10 — Krishna\'s Lila (Part 1)',
      titleSanskrit: 'दशम स्कन्ध — कृष्ण लीला (पूर्वार्ध)',
      summary: 'The heart of the Bhagavata: Krishna\'s miraculous advent in Mathura, his childhood in Gokul and Vrindavan, defeating Putana and Kaliya, lifting Govardhana, and the sublime Rasa Lila.'
    },
    {
      id: 11,
      title: 'Skandha 10 — Krishna\'s Lila (Part 2)',
      titleSanskrit: 'दशम स्कन्ध — कृष्ण लीला (उत्तरार्ध)',
      summary: 'Krishna overcomes Kamsa, establishes Dwaraka, marries Rukmini and the eight principal queens, and receives Sudama with divine hospitality.'
    },
    {
      id: 12,
      title: 'Skandha 11 — Uddhava Gita',
      titleSanskrit: 'एकादश स्कन्ध — उद्धवगीता',
      summary: 'Krishna\'s final discourse to Uddhava before departure — the "Uddhava Gita" and the story of the Avadhuta and his 24 gurus in nature. The summit of Bhagavata jnana-bhakti.'
    },
    {
      id: 13,
      title: 'Skandha 12 — The Age of Deterioration',
      titleSanskrit: 'द्वादश स्कन्ध',
      summary: 'The prophecy of Kali Yuga; the dissolution of the universe; Parikshit attains fearless liberation through hearing the Bhagavata; the eternal glory of the Mahapurana.'
    }
  ];

  let totalVerses = 0;
  let code = `import { Scripture } from '../types';

export const bhagavatapurana: Scripture = {
  id: 'bhagavatapurana',
  title: 'Bhagavata Purana',
  titleSanskrit: 'श्रीमद्भागवतमहापुराणम्',
  category: 'purana',
  description: 'The crest jewel of the Puranas, containing 18,000 verses across 12 Skandhas composed by Maharshi Vyasa and expounded by Sri Shuka to King Parikshit. Hydrated with authentic Sanskrit text, IAST transliteration, and Hindi translations from Gita Press Gorakhpur (Book Codes 0026 & 0027).',
  totalVerses: 18000,
  tags: ['Purana', 'Krishna', 'Bhakti', 'Devotion', 'Vishnu', 'GitaPress', 'Vyasa', 'UddhavaGita'],
  chapters: [
`;

  for (const cm of chapterMeta) {
    const verses = data[cm.id] || [];
    totalVerses += verses.length;
    code += `    {
      id: ${cm.id},
      title: ${JSON.stringify(cm.title)},
      titleSanskrit: ${JSON.stringify(cm.titleSanskrit)},
      summary: ${JSON.stringify(cm.summary)},
      verses: [
`;
    for (const v of verses) {
      code += `        {
          id: ${v.id},
          number: ${v.number},
          sanskrit: ${JSON.stringify(v.sanskrit)},
          transliteration: ${JSON.stringify(v.transliteration)},
          translation: ${JSON.stringify(v.hindi)},
          hindi: ${JSON.stringify(v.hindi)},
          explanation: ${JSON.stringify(v.explanation)},
          keywords: ${JSON.stringify(v.keywords)}
        },
`;
    }
    code += `      ],
    },
`;
  }

  code += `  ],
};
`;

  fs.writeFileSync(targetPath, code, 'utf8');
  console.log(`Successfully hydrated ${targetPath} with ${totalVerses} authentic verses across all 13 Skandhas!`);
}

main();
