const fs = require('fs');
const content = fs.readFileSync('data/scriptures/prashna.ts', 'utf8');

const chapSplits = content.split(/\{\s*id:\s*(\d+),\s*\n\s*title:/g);
console.log('Total chapter splits:', (chapSplits.length - 1) / 2);

for (let i = 1; i < chapSplits.length; i += 2) {
  const chNum = chapSplits[i];
  const body = chapSplits[i+1];
  const vMatches = [...body.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)['"]/g)];
  console.log(`\nChapter ${chNum}: ${vMatches.length} verses`);
  vMatches.forEach(m => {
    const id = m[1];
    const s = m[2].slice(0, 30);
    const hasKw = body.includes('keywords: []');
    console.log(`  id: ${id} -> "${s}..."`);
  });
}
