const fs = require('fs');
const content = fs.readFileSync('data/scriptures/aitareya.ts', 'utf8');

const verses = [...content.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)['"]/g)];
console.log('Aitareya verses count:', verses.length);
const seen = new Map();
for (const v of verses) {
  const id = v[1];
  const s = v[2].trim().replace(/[\s\u200B-\u200D।॥]/g, '');
  if (seen.has(s)) {
    console.log(`Duplicate in Aitareya: id ${id} vs first id ${seen.get(s)}: "${v[2].slice(0, 30)}..."`);
  } else {
    seen.set(s, id);
  }
}
