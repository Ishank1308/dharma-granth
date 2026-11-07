const fs = require('fs');
const path = require('path');

function splitScriptureByVerses(content) {
  let i = 0;
  const verseRanges = [];
  while (i < content.length) {
    if (content[i] === '{') {
      const next100 = content.slice(i, i + 100);
      if (/^\{\s*id:\s*\d+,\s*\n\s*sanskrit:/.test(next100)) {
        let braceCount = 0;
        let start = i;
        let inStr = false;
        let strQuote = '';
        let isEsc = false;
        let end = -1;
        for (let j = start; j < content.length; j++) {
          const c = content[j];
          if (inStr) {
            if (isEsc) {
              isEsc = false;
            } else if (c === '\\') {
              isEsc = true;
            } else if (c === strQuote) {
              inStr = false;
            }
          } else {
            if (c === '\'' || c === '"' || c === '`') {
              inStr = true;
              strQuote = c;
            } else if (c === '{') {
              braceCount++;
            } else if (c === '}') {
              braceCount--;
              if (braceCount === 0) {
                end = j;
                break;
              }
            }
          }
        }
        if (end !== -1) {
          verseRanges.push({ start, end, text: content.slice(start, end + 1) });
          i = end + 1;
          continue;
        }
      }
    }
    i++;
  }
  return verseRanges;
}

const files = ['chandogya.ts', 'kena.ts', 'prashna.ts', 'brihadaranyaka.ts', 'samaveda.ts', 'ramayana.ts', 'rigveda.ts'];

for (const file of files) {
  const content = fs.readFileSync(path.join('data/scriptures', file), 'utf8');
  const ranges = splitScriptureByVerses(content);
  console.log(`\n=== ${file} ===`);
  console.log(`Total verses parsed: ${ranges.length}`);
}
