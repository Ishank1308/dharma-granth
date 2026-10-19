const fs = require('fs');
const crypto = require('crypto');

function decryptCookie(encHex, masterKeyHex) {
  const encBuf = Buffer.from(encHex, 'hex');
  const masterKey = Buffer.from(masterKeyHex, 'hex');

  // Check prefix
  const prefix = encBuf.subarray(0, 3).toString('utf8');
  if (prefix !== 'v10' && prefix !== 'v20') {
    return null;
  }

  const nonce = encBuf.subarray(3, 15);
  const tag = encBuf.subarray(encBuf.length - 16);
  const ciphertext = encBuf.subarray(15, encBuf.length - 16);

  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, nonce);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(ciphertext);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString('utf8');
  } catch (e) {
    console.error('Decryption failed for prefix', prefix, e.message);
    return null;
  }
}

async function main() {
  if (!fs.existsSync('scripts/extracted_cookies.json')) {
    console.error('scripts/extracted_cookies.json not found!');
    return;
  }

  const data = JSON.parse(fs.readFileSync('scripts/extracted_cookies.json', 'utf8'));
  const masterKeyHex = data.master_key_hex;

  console.log(`Decrypting ${data.cookies.length} cookies...`);
  const decryptedCookies = {};
  for (const c of data.cookies) {
    const val = decryptCookie(c.enc_hex, masterKeyHex);
    if (val) {
      decryptedCookies[c.name] = val;
      console.log(`[DECRYPTED] ${c.name} = ${val.slice(0, 30)}... (length: ${val.length})`);
    } else {
      console.log(`[FAILED] ${c.name}`);
    }
  }

  fs.writeFileSync('scripts/decrypted_session_cookies.json', JSON.stringify(decryptedCookies, null, 2));

  // Build Cookie header
  const cookieHeader = Object.entries(decryptedCookies)
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');

  console.log('\nTesting authenticated reader API on gitapress.org...');
  try {
    const res = await fetch('https://gitapress.org/api/web/reader/ebook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
      },
      body: JSON.stringify({ id: '673f25be07174db38a58753e' }) // Book 1
    });
    const text = await res.text();
    console.log('Reader API HTTP status:', res.status);
    console.log('Reader API response sample:', text.slice(0, 300));
  } catch (e) {
    console.error('Reader test failed:', e);
  }
}

main();
