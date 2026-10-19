const fs = require('fs');
const path = require('path');

const logFile = 'C:\\Users\\ishan\\AppData\\Local\\Google\\Chrome SxS\\User Data\\Profile 1\\Local Storage\\leveldb\\000379.log';
const buf = fs.readFileSync(logFile);
const text = buf.toString('latin1');

let pos = 0;
while (true) {
  const idx = text.indexOf('gitapress.org', pos);
  if (idx === -1) break;
  const start = Math.max(0, idx - 100);
  const end = Math.min(text.length, idx + 300);
  console.log('--- MATCH AT', idx, '---');
  console.log(text.slice(start, end).replace(/[^\x20-\x7E\r\n\t]/g, '.'));
  pos = idx + 1;
}
