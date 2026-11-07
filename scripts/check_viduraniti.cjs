const fs = require('fs');
const c = fs.readFileSync('data/scriptures/viduraniti.ts', 'utf8');

const chMatches = c.match(/id:\s*(\d+)[\s\S]*?title:\s*['"]([^'"]+)['"]/g) || [];
console.log('Chapters found:');
for (const ch of chMatches) {
  const m = ch.match(/id:\s*(\d+)[\s\S]*?title:\s*['"]([^'"]+)['"]/);
  if (m) console.log(`  Chapter ${m[1]}: ${m[2]}`);
}
