const fs = require('fs');
const crypto = require('crypto');

function decryptCookie(encHex, masterKeyHex) {
  const encBuf = Buffer.from(encHex, 'hex');
  const masterKey = Buffer.from(masterKeyHex, 'hex');

  const prefix = encBuf.subarray(0, 3).toString('utf8');
  if (prefix !== 'v10' && prefix !== 'v20') return null;

  const nonce = encBuf.subarray(3, 15);
  const tag = encBuf.subarray(encBuf.length - 16);
  const ciphertext = encBuf.subarray(15, encBuf.length - 16);

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, nonce);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    // Check if there is a 32-byte hash prefix
    if (decrypted.length > 32) {
      // Find where printable ASCII starts
      let start = 0;
      while (start < decrypted.length && (decrypted[start] < 32 || decrypted[start] > 126)) {
        start++;
      }
      return decrypted.subarray(start).toString('utf8');
    }
    return decrypted.toString('utf8');
  } catch (e) {
    return null;
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync('scripts/extracted_google_cookies.json', 'utf8'));
  const masterKeyHex = data.master_key_hex;

  const googleCookies = {};
  for (const c of data.cookies) {
    const val = decryptCookie(c.enc_hex, masterKeyHex);
    if (val && !googleCookies[c.name]) {
      googleCookies[c.name] = val;
    }
  }

  console.log(`Successfully decrypted ${Object.keys(googleCookies).length} Google cookies!`);
  console.log('Key names:', Object.keys(googleCookies));

  fs.writeFileSync('scripts/decrypted_google_cookies.json', JSON.stringify(googleCookies, null, 2));

  // Build cookie header
  const cookieHeader = Object.entries(googleCookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');

  // Test accessing the Drive file page with authenticated Google session
  const fileId = '1BLJEJzGBNc8YTVeGFp7OuXR9vx3Ej5NU';
  const url = `https://drive.google.com/file/d/${fileId}/view`;
  console.log('\nTesting authenticated access to Google Drive view-only URL...');
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'Cookie': cookieHeader
    }
  });
  console.log('Drive HTTP status:', res.status);
  const html = await res.text();
  console.log('Drive HTML size:', html.length);
  
  // Search for page stream or PDF token or Drive viewer JSON
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  console.log('Page Title:', titleMatch ? titleMatch[1] : 'none');
  
  const tokenMatch = html.match(/\"downloadUrl\"\:\"([^\"]+)\"/);
  console.log('Download URL in page JSON:', tokenMatch ? tokenMatch[1] : 'none');
}

main();
