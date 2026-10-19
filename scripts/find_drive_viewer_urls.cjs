const fs = require('fs');

const html = fs.readFileSync('scripts/drive_page_authenticated.html', 'utf8');
const rx = /drive-viewer\/([^\"]+)/g;
let m;
const set = new Set();
while ((m = rx.exec(html)) !== null) {
  set.add(m[0]);
}
console.log('drive-viewer occurrences:', set.size);
for (const item of set) {
  console.log('  ', item);
}
