const fs = require('fs');
const path = require('path');

const dir = path.resolve('data/scriptures');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'lazy.ts' && f !== 'yogavasistha.ts');

const polluted = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  
  // Look for 1010xx or similar appended patterns
  const matches = [...content.matchAll(/id:\s*(10[1-9]\d{2,4})/g)];
  if (matches.length > 0) {
    polluted.push({ file: f, count: matches.length, sample: matches.slice(0, 5).map(m => m[1]).join(', ') });
  }
}

console.log('Scriptures containing 10xxxx IDs:');
console.table(polluted);
