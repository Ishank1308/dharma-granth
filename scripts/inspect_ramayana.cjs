const fs = require('fs');
const content = fs.readFileSync('data/scriptures/ramayana.ts', 'utf8');

const chapSplits = content.split(/\{\s*id:\s*(\d+),\s*\n\s*title:/g);
console.log('Chapters in ramayana:', (chapSplits.length - 1) / 2);

for (let i = 1; i < chapSplits.length; i += 2) {
  const chNum = chapSplits[i];
  const body = chapSplits[i+1];
  const titleM = body.match(/^\s*['"]([^'"]+)['"]/);
  const vMatches = [...body.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)['']/g)];
  const highIds = vMatches.filter(m => parseInt(m[1]) >= 10000);
  const kwEmpty = [...body.matchAll(/keywords:\s*\[\s*\]/g)];
  console.log(`Ch ${chNum} (${titleM ? titleM[1] : ''}): ${vMatches.length} verses (High IDs: ${highIds.length}, Empty kw: ${kwEmpty.length})`);
  if (highIds.length > 0) {
    console.log(`  Normal IDs: ${vMatches.filter(m => parseInt(m[1]) < 10000).map(m => m[1]).join(', ')}`);
    console.log(`  High IDs: ${highIds.slice(0, 5).map(m => m[1]).join(', ')}...`);
  }
}
