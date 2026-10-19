const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
const crypto = webcrypto;

const DECRYPTED_DIR = path.resolve('data/sources-local/gitapress_decrypted_epubs');
if (!fs.existsSync(DECRYPTED_DIR)) {
  fs.mkdirSync(DECRYPTED_DIR, { recursive: true });
}

async function rsaDecrypt(b64Cipher, privateKey) {
  const raw = Buffer.from(b64Cipher, 'base64');
  const decryptedBuf = await crypto.subtle.decrypt(
    { name: 'RSA-OAEP' },
    privateKey,
    raw
  );
  return new TextDecoder().decode(decryptedBuf);
}

async function decryptBook(book, token, bearer, keyPair, exportedJwk) {
  const code = String(book.code).padStart(4, '0');
  const safeTitle = (book.title || 'book')
    .replace(/[\/\\:\*\?\"<>\|]/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 50);

  const outFile = path.join(DECRYPTED_DIR, `gitapress_${code}_${safeTitle}.epub`);
  if (fs.existsSync(outFile) && fs.statSync(outFile).size > 1000) {
    const head = fs.readFileSync(outFile, { length: 4 });
    if (head.toString('hex') === '504b0304') {
      console.log(`[EXISTS] Code ${book.code}: ${safeTitle}`);
      return outFile;
    }
  }

  // 1. Resolve ebookId
  let ebookId = book.ebookId || (typeof book.ebook === 'string' ? book.ebook : null);
  if (!ebookId && book.id) {
    const prodRes = await fetch('https://gitapress.org/api/web/product', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bearer}`,
        'Cookie': `__Secure-next-auth.session-token=${token}`
      },
      body: JSON.stringify({ slug: book.slug, id: book.id })
    });
    const prodJson = await prodRes.json();
    ebookId = prodJson.data?.ebook?._id || prodJson.data?.ebook || (typeof prodJson.data?.ebook === 'string' ? prodJson.data?.ebook : null);
  }

  if (!ebookId) {
    console.log(`[SKIP] Code ${book.code} has no ebookId.`);
    return null;
  }

  // 2. Request reader config with RSA public key
  const readerRes = await fetch('https://gitapress.org/api/web/reader/ebook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`,
      'Cookie': `__Secure-next-auth.session-token=${token}`
    },
    body: JSON.stringify({
      ebookId,
      ebook: ebookId,
      product: book.id,
      key: exportedJwk
    })
  });
  const readerJson = await readerRes.json();
  if (!readerJson.status || !readerJson.data?.file || !readerJson.data?.k || !readerJson.data?.i) {
    console.log(`[FAILED] Code ${book.code}: Missing keys or file (${readerJson.message || 'No k/i'})`);
    return null;
  }

  // 3. Decrypt AES Key and IV
  const aesKeyHex = await rsaDecrypt(readerJson.data.k, keyPair.privateKey);
  const aesIvHex = await rsaDecrypt(readerJson.data.i, keyPair.privateKey);

  // 4. Download encrypted file
  const fileUrl = readerJson.data.file.startsWith('http')
    ? readerJson.data.file
    : `https://gitapress.org${readerJson.data.file}`;
  
  const fileRes = await fetch(fileUrl);
  if (!fileRes.ok) {
    console.log(`[FAILED] Code ${book.code}: HTTP ${fileRes.status}`);
    return null;
  }
  const encArrayBuf = await fileRes.arrayBuffer();

  // 5. Decrypt using AES-CBC
  const aesKey = await crypto.subtle.importKey(
    'raw',
    Buffer.from(aesKeyHex, 'hex'),
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );
  const decryptedBuf = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: Buffer.from(aesIvHex, 'hex') },
    aesKey,
    encArrayBuf
  );

  const buf = Buffer.from(decryptedBuf);
  if (buf.subarray(0, 4).toString('hex') !== '504b0304') {
    console.error(`[ERROR] Code ${book.code}: Magic bytes mismatch: ${buf.subarray(0, 4).toString('hex')}`);
    return null;
  }

  fs.writeFileSync(outFile, buf);
  console.log(`[SUCCESS] Code ${book.code}: Decrypted and saved ${outFile} (${(buf.length / (1024*1024)).toFixed(2)} MB)`);
  return outFile;
}

async function main() {
  const targetCodes = process.argv.slice(2);
  console.log('Target codes filter:', targetCodes.length ? targetCodes : 'ALL priority scriptures');

  // Load cookies
  const cookieData = JSON.parse(fs.readFileSync('scripts/decrypted_session_cookies.json', 'utf8'));
  const rawToken = cookieData['__Secure-next-auth.session-token'];
  const token = rawToken.slice(rawToken.indexOf('eyJ'));

  // Get bearer session
  const sRes = await fetch('https://gitapress.org/api/auth/session', {
    headers: { 'Cookie': `__Secure-next-auth.session-token=${token}` }
  });
  const sData = await sRes.json();
  const bearer = sData.token;
  console.log(`Authenticated as: ${sData.user?.email}`);

  // Generate 4096-bit RSA key pair
  console.log('Generating RSA-OAEP 4096-bit key pair...');
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256'
    },
    true,
    ['encrypt', 'decrypt']
  );
  const exportedJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  console.log('RSA key pair ready.\n');

  // Load catalog
  const cat = JSON.parse(fs.readFileSync('data/sources-local/gitapress_ebooks_catalog.json', 'utf8'));
  const allBooks = [...cat.freeBooks, ...cat.ebooks];

  // Default priority codes if none specified
  const priorityCodes = targetCodes.length > 0 ? targetCodes : ['133', '385', '73', '70', '71', '65', '135', '26', '27', '38', '48', '61', '107', '108', '136', '1737'];

  const selectedBooks = [];
  const seen = new Set();
  for (const code of priorityCodes) {
    const found = allBooks.filter(b => String(b.code) === String(code));
    for (const f of found) {
      if (!seen.has(f.code)) {
        seen.add(f.code);
        selectedBooks.push(f);
      }
    }
  }

  console.log(`Processing ${selectedBooks.length} targeted scriptures...`);
  for (let i = 0; i < selectedBooks.length; i++) {
    const b = selectedBooks[i];
    console.log(`\n[${i + 1}/${selectedBooks.length}] Processing Book Code ${b.code}: ${b.title}...`);
    try {
      await decryptBook(b, token, bearer, keyPair, exportedJwk);
      await new Promise(r => setTimeout(r, 600)); // Gentle throttle
    } catch (e) {
      console.error(`Error on book ${b.code}:`, e.message);
    }
  }

  console.log('\n=== BATCH DECRYPTION COMPLETE ===');
}

main().catch(console.error);
