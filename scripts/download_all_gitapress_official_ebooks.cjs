const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'sources-local', 'gitapress_official_epubs');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function main() {
  console.log('=== GITA PRESS OFFICIAL ALL-IN-ONE EBOOK DOWNLOADER ===\n');

  // 1. Read catalog and session token
  const token = fs.readFileSync(path.join(__dirname, 'gitapress_session_token.txt'), 'utf8').trim();
  const cat = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'sources-local', 'gitapress_ebooks_catalog.json'), 'utf8'));

  // 2. Fetch fresh bearer token
  const sRes = await fetch('https://gitapress.org/api/auth/session', {
    headers: { 'Cookie': `__Secure-next-auth.session-token=${token}` }
  });
  const sData = await sRes.json();
  const bearer = sData.token;
  console.log(`Authenticated as: ${sData.user?.email} (User ID: ${sData.user?.id})`);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${bearer}`,
    'Cookie': `__Secure-next-auth.session-token=${token}`,
  };

  // Combine unique books from catalog
  const bookList = [];
  const seenCodes = new Set();

  for (const b of [...cat.freeBooks, ...cat.ebooks]) {
    const code = String(b.code || '');
    if (!code || seenCodes.has(code)) continue;
    seenCodes.add(code);
    bookList.push(b);
  }

  console.log(`\nCatalog contains ${bookList.length} unique book titles to process.`);
  
  const downloaded = [];
  const errors = [];

  for (let i = 0; i < bookList.length; i++) {
    const b = bookList[i];
    const code = String(b.code).padStart(4, '0');
    const safeTitle = (b.title || 'book')
      .replace(/[\/\\:\*\?\"<>\|]/g, '_')
      .replace(/\s+/g, '_')
      .slice(0, 50);

    const targetEpub = path.join(OUTPUT_DIR, `gitapress_${code}_${safeTitle}.epub`);

    if (fs.existsSync(targetEpub) && fs.statSync(targetEpub).size > 1000) {
      console.log(`[${i + 1}/${bookList.length}] [EXISTS] Code ${b.code}: ${safeTitle}`);
      downloaded.push({ code: b.code, title: b.title, file: targetEpub });
      continue;
    }

    try {
      // 1. Fetch product details to get ebookId if not present
      let ebookId = b.ebookId || (typeof b.ebook === 'string' ? b.ebook : null);
      if (!ebookId && b.id) {
        const pRes = await fetch('https://gitapress.org/api/web/product', {
          method: 'POST',
          headers,
          body: JSON.stringify({ slug: b.slug, id: b.id })
        });
        const pJson = await pRes.json();
        const pData = pJson.data || pJson;
        if (pData?.ebook) {
          ebookId = typeof pData.ebook === 'string' ? pData.ebook : pData.ebook._id;
        }
      }

      if (!ebookId) {
        // If has Google Drive PDF, note it
        if (b.pdf) {
          console.log(`[${i + 1}/${bookList.length}] [PDF LINK] Code ${b.code}: has Google Drive PDF: ${b.pdf}`);
        } else {
          console.log(`[${i + 1}/${bookList.length}] [NO EBOOK] Code ${b.code}: ${safeTitle}`);
        }
        continue;
      }

      // 2. Fetch reader config to get EPUB file URL
      const rRes = await fetch('https://gitapress.org/api/web/reader/ebook', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ebookId, ebook: ebookId })
      });
      const rJson = await rRes.json();

      if (!rJson.status || !rJson.data?.file) {
        console.log(`[${i + 1}/${bookList.length}] [UNAVAILABLE] Code ${b.code}: ${rJson.message || 'No file'}`);
        continue;
      }

      const fileRelative = rJson.data.file;
      const fileUrl = fileRelative.startsWith('http') ? fileRelative : `https://gitapress.org${fileRelative}`;

      // 3. Download official EPUB
      console.log(`[${i + 1}/${bookList.length}] [DOWNLOADING] Code ${b.code}: ${safeTitle} from ${fileUrl}...`);
      const fileRes = await fetch(fileUrl);
      if (!fileRes.ok) {
        console.log(`  Failed HTTP ${fileRes.status}`);
        continue;
      }

      const buf = Buffer.from(await fileRes.arrayBuffer());
      fs.writeFileSync(targetEpub, buf);
      console.log(`  Saved ${targetEpub} (${(buf.length / 1024).toFixed(1)} KB)`);
      downloaded.push({ code: b.code, title: b.title, file: targetEpub, bytes: buf.length });

      // Small throttle to be gentle on Gita Press servers
      await new Promise(r => setTimeout(r, 400));
    } catch (err) {
      console.error(`  Error processing code ${b.code}:`, err.message);
      errors.push({ code: b.code, error: err.message });
    }
  }

  // Summary
  console.log('\n=== DOWNLOAD SUMMARY ===');
  console.log(`Successfully downloaded: ${downloaded.length} official EPUBs.`);
  console.log(`Saved into: ${OUTPUT_DIR}`);

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'download_manifest.json'),
    JSON.stringify({ downloadedAt: new Date().toISOString(), total: downloaded.length, books: downloaded }, null, 2)
  );
}

main().catch(console.error);
