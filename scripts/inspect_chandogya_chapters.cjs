const fs = require('fs');
const content = fs.readFileSync('data/scriptures/chandogya.ts', 'utf8');

// Parse chapters
const chapRegex = /\{\s*id:\s*(\d+),\s*\n\s*title:\s*['"]([^'"]+)['"],\s*\n\s*titleSanskrit:\s*['"]([^'"]+)['"],\s*\n\s*summary:\s*['"]([^'"]+)['"],\s*\n\s*verses:\s*\[([\s\S]*?)\]\s*,\s*\n\s*\}/g;

let m;
let totalChaps = 0;
while ((m = chapRegex.exec(content)) !== null) {
  totalChaps++;
  const chId = m[1];
  const title = m[2];
  const versesBlock = m[5];
  
  const vMatches = [...versesBlock.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)['"]/g)];
  const highIds = vMatches.filter(v => parseInt(v[1]) >= 10000);
  const kwEmpty = [...versesBlock.matchAll(/keywords:\s*\[\s*\]/g)];
  
  if (parseInt(chId) <= 10 || highIds.length > 0) {
    console.log(`Ch ${chId} ("${title}"): ${vMatches.length} verses (High IDs: ${highIds.length}, Empty keywords: ${kwEmpty.length})`);
    if (highIds.length > 0 && parseInt(chId) <= 7) {
      console.log(`  Normal IDs: ${vMatches.filter(v => parseInt(v[1]) < 10000).map(v => v[1]).join(', ')}`);
      console.log(`  High IDs: ${highIds.map(v => v[1]).join(', ')}`);
    }
  }
}
console.log(`Total chapters matched by regex: ${totalChaps}`);
