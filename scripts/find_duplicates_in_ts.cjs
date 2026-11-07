const fs = require('fs');
const path = require('path');

const dir = path.resolve('data/scriptures');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'lazy.ts' && f !== 'yogavasistha.ts');

const dupReport = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  
  // Extract all verses by finding sanskrit blocks
  const sanskritRegex = /sanskrit:\s*['"]([^'"]+)['"]/g;
  const sanskritVerses = [];
  let m;
  while ((m = sanskritRegex.exec(content)) !== null) {
    const s = m[1].replace(/[\s\u200B-\u200D।॥]/g, '');
    if (s.length > 5) {
      sanskritVerses.push(s);
    }
  }

  // Count occurrences
  const counts = new Map();
  for (const s of sanskritVerses) {
    counts.set(s, (counts.get(s) || 0) + 1);
  }

  let dupCount = 0;
  for (const [s, count] of counts.entries()) {
    if (count > 1) {
      dupCount += (count - 1);
    }
  }

  if (dupCount > 0) {
    dupReport.push({ file: f, totalVerses: sanskritVerses.length, duplicateOccurrences: dupCount });
  }
}

console.log('Scriptures with duplicate Sanskrit verses:');
console.table(dupReport);
