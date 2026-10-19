const fs = require('fs');

const content = fs.readFileSync('data/scriptures/rigveda.ts', 'utf8');

// Find all normal verses in rigveda (id < 10000)
const matches = [...content.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)['']/g)];
const normal = matches.filter(m => parseInt(m[1]) < 10000);

const seen = new Map();
for (const v of normal) {
  const s = v[2].trim().replace(/[\s\u200B-\u200D।॥]/g, '');
  if (seen.has(s)) {
    console.log(`Duplicate in normal verses: id ${v[1]} vs id ${seen.get(s)}: "${v[2]}"`);
  } else {
    seen.set(s, v[1]);
  }
}
