const fs = require('fs');
const meta = fs.readFileSync('data/scripture-meta.ts', 'utf8');
const ids = [...meta.matchAll(/id:\s*["']([^"']+)["']/g)].map(m => m[1]);
console.log('Total catalog entries:', ids.length);
console.log('IDs in catalog:', ids.join(', '));
