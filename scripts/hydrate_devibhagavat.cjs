const fs = require('fs');
const path = require('path');

function main() {
  const targetPath = path.resolve('data/scriptures/devibhagavat.ts');
  const data = JSON.parse(fs.readFileSync('scripts/devibhagavat_extracted.json', 'utf8'));

  const skandhaMeta = [
    {
      id: 1,
      title: 'Skandha 1 — The Supreme Devi',
      titleSanskrit: 'प्रथम स्कन्ध',
      summary: 'The Devi Bhagavata establishes the Divine Mother as the ultimate reality — the primordial power (Shakti) without which no god, no creation, and no consciousness can function. Features Shaunaka\'s questions to Suta.'
    },
    {
      id: 2,
      title: 'Skandha 2 — Vyasa and the Pandavas',
      titleSanskrit: 'द्वितीय स्कन्ध',
      summary: 'The birth of Maharshi Vedavyasa, the origin of the Kurus, and the events of the Mahabharata viewed through the Shakta prism of cosmic karma.'
    },
    {
      id: 3,
      title: 'Skandha 3 — Shakti as Ground of All',
      titleSanskrit: 'तृतीय स्कन्ध',
      summary: 'Brahma, Vishnu, and Shiva travel to Manidvipa and witness the Supreme Devi as Bhuvaneshvari. The Trimurti praises Her: without Shakti, none can create, preserve, or dissolve.'
    },
    {
      id: 4,
      title: 'Skandha 4 — Avataric Descent',
      titleSanskrit: 'चतुर्थ स्कन्ध',
      summary: 'The philosophical exploration of avatar hood: how the divine descends to protect righteousness through the will of Adi Shakti. Explores Nara-Narayana and Krishna\'s advent.'
    },
    {
      id: 5,
      title: 'Skandha 5 — The Devi Mahatmya',
      titleSanskrit: 'पञ्चम स्कन्ध',
      summary: 'The cosmic battles of the Divine Mother: the manifestation of Mahalakshmi, the slaying of Mahishasura, and the destruction of Shumbha and Nishumbha.'
    },
    {
      id: 6,
      title: 'Skandha 6 — Stories of Devotion',
      titleSanskrit: 'षष्ठ स्कन्ध',
      summary: 'The slaying of Vritrasura, the story of King Nahusha, and the glories of Tripura Sundari revealing that devotion to the Mother transcends ritual barriers.'
    },
    {
      id: 7,
      title: 'Skandha 7 — The Devi Gita',
      titleSanskrit: 'सप्तम स्कन्ध — देवीगीता',
      summary: 'The crest jewel of the Devi Bhagavata: the Devi Gita revealed to King Himalaya, uniting Advaita Vedanta, Kundalini Yoga, and pure Bhakti into non-dual Mother worship.'
    },
    {
      id: 8,
      title: 'Skandha 8 — Cosmic Topography and Upasana',
      titleSanskrit: 'अष्टम स्कन्ध',
      summary: 'The sacred geography of the cosmos (Bhuvanakosha), the sacred rivers and mountains of Bharata, and the daily worship (upasana) of Jagadamba.'
    },
    {
      id: 9,
      title: 'Skandha 9 — The Nature of Prakriti',
      titleSanskrit: 'नवम स्कन्ध — प्रकृतिखण्ड',
      summary: 'The Prakriti Khanda: the manifestations of Mahalakshmi, Sarasvati, Ganga, Radha, and Durga, illustrating how every force in nature is an aspect of the Divine Mother.'
    },
    {
      id: 10,
      title: 'Skandha 10 — The Manvantaras and Vindhyavasini',
      titleSanskrit: 'दशम स्कन्ध',
      summary: 'The genealogy of the Manus and the glory of Mother Vindhyavasini, who took abode in the Vindhya mountains to bestow grace on sincere seekers.'
    },
    {
      id: 11,
      title: 'Skandha 11 — The Code of Right Conduct',
      titleSanskrit: 'एकादश स्कन्ध — सदाचार',
      summary: 'Sadachara, the inner significance of sacred ash (Bhasma), the sacred Rudraksha beads, and the inner purification required for divine communion.'
    },
    {
      id: 12,
      title: 'Skandha 12 — The Mystery of Gayatri and Manidvipa',
      titleSanskrit: 'द्वादश स्कन्ध — मणिद्वीप',
      summary: 'The esoteric meaning of the Gayatri Mantra, the celestial geography of Manidvipa (the island of jewels), and the eternal mahatmya of hearing the Devi Bhagavata.'
    }
  ];

  let totalVerses = 0;
  let code = `import { Scripture } from '../types';

export const devibhagavat: Scripture = {
  id: 'devibhagavat',
  title: 'Devi Bhagavata Purana',
  titleSanskrit: 'श्रीमद्देवीभागवतमहापुराणम्',
  category: 'purana',
  description: 'The supreme Mahapurana of the Shakta tradition — 18,000 verses across 12 Skandhas celebrating the Divine Mother as the ultimate, unconditioned reality (Para Brahman) and primordial Shakti. Hydrated with authentic Sanskrit text, IAST transliteration, and Hindi translation from the official Gita Press Gorakhpur Illustrated Edition (Book Codes 1897 & 1898).',
  totalVerses: 18000,
  tags: ['Purana', 'Devi', 'Shakti', 'DivineMother', 'Goddess', 'Creation', 'DeviGita', 'GitaPress'],
  chapters: [
`;

  for (const sm of skandhaMeta) {
    const verses = data[sm.id] || [];
    totalVerses += verses.length;
    code += `    {
      id: ${sm.id},
      title: ${JSON.stringify(sm.title)},
      titleSanskrit: ${JSON.stringify(sm.titleSanskrit)},
      summary: ${JSON.stringify(sm.summary)},
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
  console.log(`Successfully hydrated ${targetPath} with ${totalVerses} authentic verses across all 12 Skandhas!`);
}

main();
