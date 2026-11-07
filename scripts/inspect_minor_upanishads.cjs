const fs = require('fs');
const path = require('path');

const ids = ['jabala', 'niralamba', 'maitri', 'tejobindu', 'mahanarayana', 'kaushitaki'];

for (const id of ids) {
  const p = path.resolve('public/data/scriptures-full', `${id}.json`);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  console.log(`\n=== ${id.toUpperCase()} ===`);
  console.log(`Chapters: ${data.chapters.length}, Total Verses in json: ${data.totalVerses}`);
  data.chapters.slice(0, 3).forEach((ch, i) => {
    console.log(`  Ch ${ch.number || i + 1} (${ch.title || 'no title'}): ${ch.verses ? ch.verses.length : 0} verses`);
  });
  if (data.chapters.length > 3) {
    console.log(`  ... and ${data.chapters.length - 3} more chapters`);
  }
}
