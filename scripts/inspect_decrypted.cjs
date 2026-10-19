const fs = require('fs');
const crypto = require('crypto');

const data = JSON.parse(fs.readFileSync('scripts/extracted_cookies.json', 'utf8'));
const masterKey = Buffer.from(data.master_key_hex, 'hex');
const encBuf = Buffer.from(data.cookies[0].enc_hex, 'hex');

const nonce = encBuf.subarray(3, 15);
const tag = encBuf.subarray(encBuf.length - 16);
const ciphertext = encBuf.subarray(15, encBuf.length - 16);

const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, nonce);
decipher.setAuthTag(tag);
let decrypted = decipher.update(ciphertext);
decrypted = Buffer.concat([decrypted, decipher.final()]);

console.log('Decrypted buffer length:', decrypted.length);
console.log('First 64 bytes in hex:', decrypted.subarray(0, 64).toString('hex'));
console.log('First 64 bytes latin1:', decrypted.subarray(0, 64).toString('latin1'));

// Check if it's UTF-8, UTF-16, or compressed, or contains string
for (let i = 0; i < decrypted.length; i++) {
  if (decrypted[i] >= 32 && decrypted[i] < 127) {
    // print some ASCII
  }
}
fs.writeFileSync('scripts/decrypted_raw.bin', decrypted);
console.log('Saved raw bytes to scripts/decrypted_raw.bin');
