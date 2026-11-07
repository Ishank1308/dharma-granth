const fs = require('fs');

const html = fs.readFileSync('scripts/drive_page_authenticated.html', 'utf8');

const startIdx = html.indexOf('window.viewerData =');
if (startIdx !== -1) {
  const endIdx = html.indexOf(';</script>', startIdx);
  const snippet = html.slice(startIdx, endIdx);
  console.log('Snippet length:', snippet.length);
  fs.writeFileSync('scripts/drive_viewer_data.js', snippet);
  console.log('Saved to scripts/drive_viewer_data.js');
  console.log(snippet.slice(0, 1000));
} else {
  console.log('window.viewerData not found');
}
