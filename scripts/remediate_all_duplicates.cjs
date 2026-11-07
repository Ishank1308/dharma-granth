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

function shouldRemoveVerse(file, range, content) {
  const isBadKw = /keywords:\s*\[\s*\]/.test(range.text);
  if (!isBadKw) return false;

  if (file === 'chandogya.ts') {
    const ch8Pos = content.indexOf("title: 'Adhyāya 8'");
    return range.start < ch8Pos;
  }
  if (file === 'kena.ts') {
    return true;
  }
  if (file === 'prashna.ts') {
    return true;
  }
  if (file === 'brihadaranyaka.ts') {
    const ch6Pos = content.indexOf("title: 'Chapter 6 — Janaka and the Light Within'");
    if (range.start < ch6Pos) {
      return true;
    }
    const ch8Pos = content.indexOf("title: 'Adhyāya 8'");
    if (range.start < ch8Pos) {
      if (/id:\s*1,/.test(range.text)) {
        return true;
      }
    }
    return false;
  }
  if (file === 'samaveda.ts') {
    return true;
  }
  if (file === 'ramayana.ts') {
    return true;
  }
  if (file === 'rigveda.ts') {
    return true;
  }
  return false;
}

function removeRanges(content, rangesToRemove) {
  rangesToRemove.sort((a, b) => b.start - a.start);
  let res = content;
  for (const r of rangesToRemove) {
    let start = r.start;
    let end = r.end + 1;
    while (end < res.length && (res[end] === ' ' || res[end] === '\t' || res[end] === ',')) {
      end++;
    }
    while (start > 0 && (res[start - 1] === ' ' || res[start - 1] === '\t')) {
      start--;
    }
    if (start > 0 && res[start - 1] === '\n') {
      start--;
    }
    res = res.slice(0, start) + res.slice(end);
  }
  return res;
}

const files = ['chandogya.ts', 'kena.ts', 'prashna.ts', 'brihadaranyaka.ts', 'samaveda.ts', 'ramayana.ts', 'rigveda.ts'];
const summary = {};

for (const file of files) {
  const filePath = path.join(__dirname, '..', 'data', 'scriptures', file);
  const content = fs.readFileSync(filePath, 'utf8');
  const ranges = splitScriptureByVerses(content);
  const toRemove = ranges.filter(r => shouldRemoveVerse(file, r, content));
  
  let cleaned = removeRanges(content, toRemove);
  
  // Re-parse remaining verses
  const newRanges = splitScriptureByVerses(cleaned);
  
  // Update totalVerses in the scripture object header
  cleaned = cleaned.replace(/totalVerses:\s*\d+/, `totalVerses: ${newRanges.length}`);
  
  fs.writeFileSync(filePath, cleaned, 'utf8');
  
  summary[file] = {
    before: ranges.length,
    removed: toRemove.length,
    after: newRanges.length
  };
}

console.log('Remediation Summary:');
console.table(summary);
