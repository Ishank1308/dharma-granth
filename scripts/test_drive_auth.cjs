const fs = require('fs');

async function testDrive() {
  const googleCookies = JSON.parse(fs.readFileSync('scripts/decrypted_google_cookies.json', 'utf8'));

  // Clean cookies so only valid ASCII headers are included
  const cleanPairs = [];
  for (const [name, val] of Object.entries(googleCookies)) {
    // Only ASCII
    const cleanVal = val.replace(/[^\x20-\x7E]/g, '').trim();
    if (cleanVal.length > 0) {
      cleanPairs.push(`${name}=${cleanVal}`);
    }
  }

  const cookieHeader = cleanPairs.join('; ');

  const fileId = '1BLJEJzGBNc8YTVeGFp7OuXR9vx3Ej5NU';
  const url = `https://drive.google.com/file/d/${fileId}/view`;
  console.log(`Sending authenticated request to: ${url}`);
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Cookie': cookieHeader
    }
  });
  console.log('Drive HTTP status:', res.status);
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  console.log('Page title:', titleMatch ? titleMatch[1] : 'none');

  // Search for drive item data
  const dataMatch = html.match(/_drive_viewer_\.init\((.+)\);/);
  console.log('Viewer init found:', dataMatch ? 'YES' : 'NO');

  fs.writeFileSync('scripts/drive_page_authenticated.html', html);
  console.log('Saved to scripts/drive_page_authenticated.html');
}

testDrive();
