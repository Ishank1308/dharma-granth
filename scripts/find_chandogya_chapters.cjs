const fs = require('fs');
const content = fs.readFileSync('data/scriptures/chandogya.ts', 'utf8');

const lines = content.split('\n');
console.log(`Total lines: ${lines.length}`);

// Find lines that declare chapters
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('title:') && lines[i-1] && lines[i-1].includes('id:')) {
    const chId = lines[i-1].trim();
    const chTitle = lines[i].trim();
    const lineNum = i;
    if (i < 500) {
      console.log(`Line ${lineNum}: ${chId} | ${chTitle}`);
    }
  }
}
