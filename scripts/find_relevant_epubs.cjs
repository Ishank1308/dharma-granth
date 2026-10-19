const fs = require('fs');
const path = require('path');

const dir = path.resolve('data/sources-local/gitapress_official_epubs');
const files = fs.readdirSync(dir);

const keywords = ['upanishad', 'upnishad', 'swarodaya', 'svara', 'yoga', 'puran', 'samhita', 'sukta', 'stotra', 'kaushitaki', 'narayana', 'maitri', 'muktika', 'tejobindu', 'jabala', 'niralamba'];

console.log('Matching EPUBs in gitapress_official_epubs:');
for (const f of files) {
  const lower = f.toLowerCase();
  for (const kw of keywords) {
    if (lower.includes(kw)) {
      console.log(`- ${f}`);
      break;
    }
  }
}
