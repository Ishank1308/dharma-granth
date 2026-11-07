const fs = require('fs');
const path = require('path');

const dir = path.resolve('data/scriptures');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts' && f !== 'lazy.ts');

const catalog = JSON.parse(fs.readFileSync('data/sources-local/gitapress_ebooks_catalog.json', 'utf8'));
const allGpBooks = [...catalog.freeBooks, ...catalog.ebooks];

const decryptedDir = path.resolve('data/sources-local/gitapress_decrypted_epubs');
const downloadedDir = path.resolve('data/sources-local/gitapress_official_epubs');
const pdfDir = path.resolve('data/sources-local');

const results = [];

for (const f of files) {
  const content = fs.readFileSync(path.join(dir, f), 'utf8');
  
  const idMatch = content.match(/id:\s*['"]([^'"]+)['"]/);
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
  const tvMatch = content.match(/totalVerses:\s*(\d+)/);
  
  const id = idMatch ? idMatch[1] : f.replace('.ts', '');
  const title = titleMatch ? titleMatch[1] : id;
  const declared = tvMatch ? parseInt(tvMatch[1]) : 0;
  
  const matches = content.match(/["']?sanskrit["']?\s*:\s*['"`]/g) || [];
  const actual = matches.length;
  
  const chMatches = content.match(/verses:\s*\[\s*\]/g) || [];
  const emptyChapters = chMatches.length;

  if (actual < declared || emptyChapters > 0 || actual === 0) {
    // Check if we have a matching Gita press asset
    const gpMatch = allGpBooks.find(b => {
      const bt = (b.title || '').toLowerCase();
      const bs = (b.slug || '').toLowerCase();
      const tid = id.toLowerCase();
      const tt = title.toLowerCase();
      return bt.includes(tid) || bs.includes(tid) || tt.includes(bt);
    });

    // Check if we have a PDF in data/sources-local
    const pdfs = fs.readdirSync(pdfDir).filter(p => p.endsWith('.pdf'));
    const matchedPdf = pdfs.find(p => p.toLowerCase().includes(id.toLowerCase()));

    results.push({
      file: f,
      id,
      title,
      declared,
      actual,
      missing: Math.max(0, declared - actual),
      pctComplete: declared > 0 ? ((actual / declared) * 100).toFixed(1) + '%' : '0%',
      emptyChapters,
      gpCode: gpMatch?.code,
      gpTitle: gpMatch?.title?.slice(0, 40),
      hasPdf: !!matchedPdf
    });
  }
}

// Sort by largest missing
results.sort((a, b) => b.missing - a.missing);

console.log(`\n=== INCOMPLETE SCRIPTURES AUDIT (${results.length} scriptures found) ===\n`);
console.table(results.map(r => ({
  Scripture: r.title,
  Declared: r.declared,
  Actual: r.actual,
  Missing: r.missing,
  Complete: r.pctComplete,
  EmptyChs: r.emptyChapters,
  GP_Code: r.gpCode || (r.hasPdf ? 'PDF Scans' : '-')
})));
