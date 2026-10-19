const fs = require('fs');

const ts = fs.readFileSync('data/scriptures/chandogya.ts', 'utf8');

// Match chapter blocks: id: X, title: '...', verses: [ ... ]
const chaps = [...ts.matchAll(/id:\s*(\d+),\s*\n\s*title:\s*['"]([^'"]+)['"],\s*\n\s*titleSanskrit:\s*['"]([^'"]+)['"]/g)];

console.log(`Found ${chaps.length} chapters in chandogya.ts:`);
for (const ch of chaps.slice(0, 15)) {
  console.log(`Ch ${ch[1].padStart(3)}: ${ch[2]} (${ch[3]})`);
}
