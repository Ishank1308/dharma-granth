const fs = require('fs');
const path = require('path');

function main() {
  const targetPath = path.resolve('data/scriptures/harivanshpuran.ts');
  const data = JSON.parse(fs.readFileSync('scripts/harivansh_extracted.json', 'utf8'));

  const parvaMeta = [
    {
      id: 1,
      title: 'Harivamsha Parva — The Lineage of Hari',
      titleSanskrit: 'हरिवंशपर्व',
      summary: 'The opening Parva establishes the cosmic genealogy: from Brahma through the solar and lunar dynasties, down to Vasudeva and Devaki — the parents of Krishna. Narrates the stories of Prithu, the Manvantaras, and the divine preparation for Krishna\'s advent.'
    },
    {
      id: 2,
      title: 'Vishnu Parva — Krishna\'s Birth and Vrindavan',
      titleSanskrit: 'विष्णुपर्व',
      summary: 'The heart of the Harivamsha: Krishna\'s miraculous advent in Mathura, his transfer to Gokul, the childhood exploits (Bal Lila), the defeat of Putana and Kaliya, the lifting of Govardhana, the Rasa Lila, and the victory over Kamsa.'
    },
    {
      id: 3,
      title: 'Bhavishya Parva — Cosmic Vision and Prophecy',
      titleSanskrit: 'भविष्यपर्व',
      summary: 'The concluding Parva contains Vishnu\'s cosmic vision of the future — the prophecies concerning Kali Yuga, the assurance of divine avataric descent whenever dharma declines, and the sacred Harivamsha Mahatmya.'
    }
  ];

  let totalVerses = 0;
  let code = `import { Scripture } from '../types';

export const harivanshpuran: Scripture = {
  id: 'harivanshpuran',
  title: 'Harivamsha Purana',
  titleSanskrit: 'हरिवंशपुराण',
  category: 'purana',
  author: 'Vyasa',
  description: 'The celebrated Khila-bhāga (appendix) of the Mahabharata composed by Maharshi Vedavyasa in 16,374 verses across three Parvas. Chronicling the genealogy of the Vrishnis, Krishna’s childhood in Vrindavan, and cosmic prophecies. Hydrated with authentic Sanskrit verses, IAST transliteration, and Hindi translation from the official Gita Press Gorakhpur edition (Book Code 0038).',
  totalVerses: 16374,
  tags: ['Purana', 'Krishna', 'Harivamsha', 'Mahabharata', 'Vishnu', 'Vyasa', 'GitaPress'],
  chapters: [
`;

  for (const pm of parvaMeta) {
    const verses = data[pm.id] || [];
    totalVerses += verses.length;
    code += `    {
      id: ${pm.id},
      title: ${JSON.stringify(pm.title)},
      titleSanskrit: ${JSON.stringify(pm.titleSanskrit)},
      summary: ${JSON.stringify(pm.summary)},
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
  console.log(`Successfully hydrated ${targetPath} with ${totalVerses} authentic verses across all 3 Parvas!`);
}

main();
