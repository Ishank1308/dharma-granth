const fs = require('fs');
const content = fs.readFileSync('data/scripture-meta.ts', 'utf8');

const ids = [
  'aitareya', 'chandogya', 'brihadaranyaka', 'yogarasayanam', 'viduraniti', 'ramcharitmanas'
];

for (const id of ids) {
  const re = new RegExp(`id:\\s*["']${id}["'][\\s\\S]*?totalChapters:\\s*(\\d+)[\\s\\S]*?totalVerses:\\s*(\\d+)`);
  const m = content.match(re);
  if (m) {
    console.log(`${id.padEnd(22)}: totalChapters = ${m[1]}, totalVerses = ${m[2]}`);
  } else {
    console.log(`${id.padEnd(22)}: not matched`);
  }
}
