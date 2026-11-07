const fs = require('fs');
const content = fs.readFileSync('data/scriptures/ramayana.ts', 'utf8');

const matches = [...content.matchAll(/id:\s*(\d+),[\s\S]*?sanskrit:\s*['"]([^'"]+)[''][\s\S]*?keywords:\s*\[([^\]]*)\]/g)];
console.log('Total verses in ramayana.ts:', matches.length);

const normal = matches.filter(m => parseInt(m[1]) < 10000);
const high = matches.filter(m => parseInt(m[1]) >= 10000);

console.log(`Normal verses: ${normal.length}, High ID verses: ${high.length}`);
console.log(`Normal verses with empty keywords: ${normal.filter(m => m[3].trim() === '').length}`);
console.log(`High ID verses with empty keywords: ${high.filter(m => m[3].trim() === '').length}`);
