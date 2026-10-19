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
      return true; // remove all keywords: [] in ch 1-5
    }
    // In Ch 6, remove verse id: 1
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
  // Sort descending by start position
  rangesToRemove.sort((a, b) => b.start - a.start);
  let res = content;
  for (const r of rangesToRemove) {
    // Also include any preceding whitespace or trailing comma/newline
    let start = r.start;
    let end = r.end + 1; // past closing brace
    // Look ahead for trailing comma
    while (end < res.length && (res[end] === ' ' || res[end] === '\t' || res[end] === ',')) {
      end++;
    }
    // Look behind for whitespace/newlines
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

for (const file of files) {
  const content = fs.readFileSync(path.join('data/scriptures', file), 'utf8');
  const ranges = splitScriptureByVerses(content);
  const toRemove = ranges.filter(r => shouldRemoveVerse(file, r, content));
  console.log(`\n=== ${file} ===`);
  console.log(`Total verses: ${ranges.length}, To remove: ${toRemove.length}, Remaining: ${ranges.length - toRemove.length}`);
  
  const cleaned = removeRanges(content, toRemove);
  // Re-parse remaining verses
  const newRanges = splitScriptureByVerses(cleaned);
  console.log(`Re-parsed remaining verses: ${newRanges.length}`);
  
  // Check duplicate Sanskrit in remaining
  const seen = new Map();
  let dups = 0;
  for (const r of newRanges) {
    const sMatch = r.text.match(/sanskrit:\s*['"]([^'"]+)['"]/);
    if (sMatch) {
      const s = sMatch[1].trim().replace(/[\s\u200B-\u200D।॥]/g, '');
      if (seen.has(s)) dups++;
      else seen.set(s, true);
    }
  }
  console.log(`Duplicate Sanskrit verses in cleaned: ${dups}`);
}
