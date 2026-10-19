import * as fs from 'fs';
const text = fs.readFileSync('app/learn/page.tsx', 'utf8');
const lines = text.split('\n');
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
lines.forEach((line, idx) => {
  if (emojiRegex.test(line)) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
