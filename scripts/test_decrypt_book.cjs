const fs = require('fs');
const path = require('path');
const { webcrypto } = require('crypto');
const crypto = webcrypto;

async function testDecrypt() {
  console.log('--- TESTING GITA PRESS EPUB DECRYPTION ---');

  // 1. Get auth token
  const cookieData = JSON.parse(fs.readFileSync('scripts/decrypted_session_cookies.json', 'utf8'));
  const rawToken = cookieData['__Secure-next-auth.session-token'];
  const token = rawToken.slice(rawToken.indexOf('eyJ'));

  // 2. Generate RSA-OAEP 4096-bit key pair
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
  console.log('RSA key pair generated successfully.');

  // 3. Find Vivek Chudamani in catalog
  const cat = JSON.parse(fs.readFileSync('data/sources-local/gitapress_ebooks_catalog.json', 'utf8'));
  const allBooks = [...cat.freeBooks, ...cat.ebooks];
  const book = allBooks.find(b => String(b.code) === '133' || b.title?.includes('Vivek Chudamani'));
  console.log('Target book:', book.code, book.title, 'Product ID:', book.id);

  // 4. Get product details to ensure ebookId
  const sRes = await fetch('https://gitapress.org/api/auth/session', {
    headers: { 'Cookie': `__Secure-next-auth.session-token=${token}` }
  });
  const sData = await sRes.json();
  const bearer = sData.token;

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
  const ebookId = prodJson.data?.ebook?._id || prodJson.data?.ebook || book.ebook;
  console.log('Resolved ebookId:', ebookId);

  // 5. Call /web/reader/ebook WITH public RSA key!
  console.log('Requesting reader config with RSA public key...');
  const readerRes = await fetch('https://gitapress.org/api/web/reader/ebook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${bearer}`,
      'Cookie': `__Secure-next-auth.session-token=${token}`
    },
    body: JSON.stringify({
      ebookId: ebookId,
      product: book.id,
      key: exportedJwk
    })
  });
  const readerJson = await readerRes.json();
  console.log('Reader response status:', readerJson.status);
  console.log('Reader data keys:', Object.keys(readerJson.data || {}));
  console.log('file:', readerJson.data?.file);
  console.log('k present:', !!readerJson.data?.k, 'length:', readerJson.data?.k?.length);
  console.log('i present:', !!readerJson.data?.i, 'length:', readerJson.data?.i?.length);

  if (!readerJson.data?.k || !readerJson.data?.i) {
    console.error('Missing k or i!');
    return;
  }

  // 6. Decrypt k and i with RSA private key
  async function rsaDecrypt(b64Cipher) {
    const raw = Buffer.from(b64Cipher, 'base64');
    const decryptedBuf = await crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      keyPair.privateKey,
      raw
    );
    return new TextDecoder().decode(decryptedBuf);
  }

  const aesKeyHex = await rsaDecrypt(readerJson.data.k);
  const aesIvHex = await rsaDecrypt(readerJson.data.i);
  console.log('Decrypted AES Key (hex):', aesKeyHex);
  console.log('Decrypted AES IV (hex):', aesIvHex);

  // 7. Fetch encrypted EPUB file
  const fileUrl = readerJson.data.file.startsWith('http')
    ? readerJson.data.file
    : `https://gitapress.org${readerJson.data.file}`;
  console.log('Fetching encrypted EPUB from:', fileUrl);
  const fileRes = await fetch(fileUrl);
  const encArrayBuf = await fileRes.arrayBuffer();
  console.log('Encrypted EPUB bytes:', encArrayBuf.byteLength);

  // 8. Decrypt EPUB with AES-CBC
  const aesKey = await crypto.subtle.importKey(
    'raw',
    Buffer.from(aesKeyHex, 'hex'),
    { name: 'AES-CBC' },
    false,
    ['decrypt']
  );
  const decryptedEpubBuf = await crypto.subtle.decrypt(
    { name: 'AES-CBC', iv: Buffer.from(aesIvHex, 'hex') },
    aesKey,
    encArrayBuf
  );
  console.log('Decrypted EPUB bytes:', decryptedEpubBuf.byteLength);

  const outPath = path.resolve('data/sources-local/test_decrypted_vivek_chudamani.epub');
  fs.writeFileSync(outPath, Buffer.from(decryptedEpubBuf));
  console.log('Saved decrypted EPUB to:', outPath);

  // Check if it starts with PK (standard zip magic bytes: 0x50 0x4B 0x03 0x04)
  const header = Buffer.from(decryptedEpubBuf.slice(0, 4));
  console.log('Magic bytes:', header.toString('hex'), 'ASCII:', header.toString());
  if (header.toString('hex') === '504b0304') {
    console.log('SUCCESS! REAL VALID ZIP/EPUB ARCHIVE UNLOCKED!');
  }
}

testDecrypt().catch(console.error);
