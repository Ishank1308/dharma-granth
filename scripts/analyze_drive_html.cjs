const fs = require('fs');

const html = fs.readFileSync('scripts/drive_page_authenticated.html', 'utf8');

// Look for data patterns in Google Drive page
const patterns = [
  /https?:\/\/drive\.google\.com\/[a-zA-Z0-9_\-\/\?\=\&\%\.]+/g,
  /https?:\/\/docs\.google\.com\/[a-zA-Z0-9_\-\/\?\=\&\%\.]+/g,
  /https?:\/\/drive-thirdparty\.googleusercontent\.com\/[a-zA-Z0-9_\-\/\?\=\&\%\.]+/g,
  /https?:\/\/[a-zA-Z0-9_\-]+\.googleusercontent\.com\/[a-zA-Z0-9_\-\/\?\=\&\%\.]+/g,
  /\"[^\"]*pdf[^\"]*\"/gi,
  /\"[^\"]*download[^\"]*\"/gi
];

for (const p of patterns) {
  const matches = html.match(p) || [];
  const unique = [...new Set(matches)];
  if (unique.length > 0) {
    console.log(`\nPattern ${p}: (${unique.length} matches)`);
    for (const m of unique.slice(0, 5)) {
      console.log('  ', m.slice(0, 150));
    }
  }
}
