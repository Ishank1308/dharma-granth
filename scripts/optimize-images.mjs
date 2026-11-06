import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const DIRS = ['public/og', 'public/icons'];
let totalSaved = 0;
let totalOriginal = 0;

console.log('🖼️  Optimizing public images with Sharp (quantized palette + compression)...');

for (const dir of DIRS) {
  try {
    const files = readdirSync(dir);
    for (const file of files) {
      if (!file.endsWith('.png')) continue;
      const path = join(dir, file);
      const stat = statSync(path);
      if (stat.isDirectory()) continue;

      const inBuf = readFileSync(path);
      totalOriginal += inBuf.length;

      const outBuf = await sharp(inBuf)
        .png({ quality: 85, compressionLevel: 9, palette: true })
        .toBuffer();

      if (outBuf.length < inBuf.length) {
        const saved = inBuf.length - outBuf.length;
        totalSaved += saved;
        writeFileSync(path, outBuf);
        console.log(
          `  ✓ ${file}: ${(inBuf.length / 1024).toFixed(1)} KB → ${(outBuf.length / 1024).toFixed(1)} KB (-${((saved / inBuf.length) * 100).toFixed(0)}%)`
        );
      }
    }
  } catch (err) {
    console.error(`Error in ${dir}:`, err);
  }
}

// Also check og-default.png
try {
  const path = 'public/og-default.png';
  const inBuf = readFileSync(path);
  totalOriginal += inBuf.length;
  const outBuf = await sharp(inBuf)
    .png({ quality: 85, compressionLevel: 9, palette: true })
    .toBuffer();
  if (outBuf.length < inBuf.length) {
    const saved = inBuf.length - outBuf.length;
    totalSaved += saved;
    writeFileSync(path, outBuf);
    console.log(
      `  ✓ og-default.png: ${(inBuf.length / 1024).toFixed(1)} KB → ${(outBuf.length / 1024).toFixed(1)} KB (-${((saved / inBuf.length) * 100).toFixed(0)}%)`
    );
  }
} catch (err) {
  console.error('Error in og-default.png:', err);
}

console.log(
  `\n🎉 Optimization complete: Saved ${(totalSaved / (1024 * 1024)).toFixed(2)} MB ` +
    `(${(totalOriginal / (1024 * 1024)).toFixed(2)} MB → ${((totalOriginal - totalSaved) / (1024 * 1024)).toFixed(2)} MB, ` +
    `-${((totalSaved / totalOriginal) * 100).toFixed(1)}% reduction)`
);
