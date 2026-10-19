const fs = require('fs');

const ts = fs.readFileSync('data/scriptures/chandogya.ts', 'utf8');
const json = JSON.parse(fs.readFileSync('public/data/scriptures-full/chandogya.json', 'utf8'));

console.log('--- CHANDOGYA IN FULL JSON ---');
console.log(`Chapters count in JSON: ${json.chapters.length}`);
console.log(`Total verses in JSON: ${json.totalVerses}`);
json.chapters.slice(0, 5).forEach(ch => {
  console.log(`  Ch ${ch.number} (${ch.title}): ${ch.verses ? ch.verses.length : 0} verses`);
});

console.log('\n--- CHANDOGYA IN TS ---');
const chapTitles = [...ts.matchAll(/id:\s*(\d+),\s*\n\s*title:\s*['"]([^'"]+)['"]/g)];
console.log(`Chapters in TS: ${chapTitles.length}`);
chapTitles.slice(0, 10).forEach(m => console.log(`  Ch ${m[1]}: ${m[2]}`));
if (chapTitles.length > 10) console.log(`  ... and ${chapTitles.length - 10} more`);

// Check duplicate IDs or verses in TS
const verseIds = [...ts.matchAll(/id:\s*(\d+)/g)].map(m => parseInt(m[1]));
console.log(`Total id matches in TS: ${verseIds.length}`);
