const fs = require('fs');
const cat = JSON.parse(fs.readFileSync('data/sources-local/gitapress_ebooks_catalog.json', 'utf8'));
const allBooks = [...cat.freeBooks, ...cat.ebooks];

const keywords = ['padma', 'varah', 'brahmavai', 'kalki', 'puran', 'purana'];

for (const b of allBooks) {
  const t = (b.title || '').toLowerCase();
  for (const kw of keywords) {
    if (t.includes(kw)) {
      console.log(`Code ${b.code}: ${b.title}`);
      break;
    }
  }
}
