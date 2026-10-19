import * as fs from 'fs';
const lines = fs.readFileSync('data/scripture-meta.ts', 'utf8').split('\n');
lines.forEach((line, idx) => {
  if (line.includes('naradapuran')) {
    console.log(`Line ${idx + 1}: ${line}`);
  }
});
