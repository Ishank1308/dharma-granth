const fs = require('fs');

const content = fs.readFileSync('data/scriptures/kena.ts', 'utf8');
const badVerseRegex = /\s*\{\s*id:\s*\d+,[\s\S]*?keywords:\s*\[\s*\]\s*,?\s*\},?/g;

const matches = [...content.matchAll(badVerseRegex)];
console.log(`Found ${matches.length} bad verses in Kena`);

const cleaned = content.replace(badVerseRegex, '');

// Check verse matches
const vMatches = [...cleaned.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)['']/g)];
console.log(`Verses found in cleaned Kena: ${vMatches.length}`);

// Check unique sanskrit
const seen = new Set();
let dups = 0;
vMatches.forEach(m => {
  const s = m[2].trim().replace(/[\s\u200B-\u200D।॥]/g, '');
  if (seen.has(s)) dups++;
  else seen.add(s);
});
console.log(`Duplicates in cleaned Kena: ${dups}`);
