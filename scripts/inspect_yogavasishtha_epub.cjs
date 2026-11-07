const AdmZip = require('adm-zip');
const path = require('path');

const epubPath = path.resolve('data/sources-local/gitapress_decrypted_epubs/gitapress_0574_Sankshipt_Yogavasishtha_–_A_Concise_Edition_of_the.epub');
const zip = new AdmZip(epubPath);
const entries = zip.getEntries();
const htmls = entries.filter(e => e.entryName.endsWith('.xhtml') || e.entryName.endsWith('.html'));

console.log(`Total HTML files in Yogavasishtha: ${htmls.length}`);
for (const h of htmls.slice(0, 10)) {
  const text = h.getData().toString('utf8');
  const clean = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 150);
  console.log(`- ${h.entryName}: ${clean}`);
}
