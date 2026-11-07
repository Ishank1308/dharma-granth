const fs = require('fs');
const path = require('path');
const ids = ['jabala', 'kaushitaki', 'mahanarayana', 'maitri', 'muktika', 'niralamba', 'shivaswarodaya', 'tejobindu', 'yogarasayanam'];

for (const id of ids) {
  const p = path.resolve('public/data/scriptures-full', id + '.json');
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    let vCount = 0;
    let chCount = (data.chapters || []).length;
    let withHindi = 0;
    let withTrans = 0;
    for (const ch of data.chapters || []) {
      for (const v of ch.verses || []) {
        vCount++;
        if (v.hindi) withHindi++;
        if (v.translation) withTrans++;
      }
    }
    console.log(`${id.padEnd(16)}: ${chCount} chaps, ${vCount} verses (withHindi: ${withHindi}, withEng: ${withTrans})`);
  } else {
    console.log(`${id.padEnd(16)}: NOT FOUND`);
  }
}
