const fs = require('fs');
const lines = fs.readFileSync('data/scriptures/brihadaranyaka.ts', 'utf8').split('\n');
lines.forEach((l, i) => {
  if (l.includes('title:') && i < 400) {
    console.log(`Line ${i + 1}: ${l.trim()}`);
  }
});
