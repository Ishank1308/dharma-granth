import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { PDFParse } from 'pdf-parse';

const TESSERACT = process.env.TESSERACT_CMD || 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe';
const TESSDATA = process.env.TESSDATA_DIR || (existsSync('C:\\Users\\ishan\\tessdata\\san.traineddata')
  ? 'C:\\Users\\ishan\\tessdata'
  : 'C:\\Program Files\\Tesseract-OCR\\tessdata');

export async function openPdf(file: string): Promise<PDFParse> {
  const data = new Uint8Array(await import('node:fs/promises').then((fs) => fs.readFile(file)));
  return new PDFParse({ data });
}

export async function pageCount(parser: PDFParse): Promise<number> {
  const info = await parser.getInfo();
  return info.total ?? 0;
}

export async function pageText(parser: PDFParse, page: number): Promise<string> {
  const result = await parser.getText({ partial: [page], pageJoiner: '' });
  return result.text ?? '';
}

/** PDF user space is 72 DPI. scale = dpi/72 renders at the requested DPI. */
export async function renderPagePng(parser: PDFParse, page: number, dpi: number, pngPath: string): Promise<void> {
  const shot = await parser.getScreenshot({
    partial: [page],
    scale: dpi / 72,
    imageBuffer: true,
  });
  const bytes = shot.pages[0]?.data;
  if (!bytes?.length) throw new Error(`Page ${page} rendered empty`);
  mkdirSync(dirname(pngPath), { recursive: true });
  writeFileSync(pngPath, Buffer.from(bytes));
}

function ensureTsvConfig(): void {
  const file = join(TESSDATA, 'configs', 'tsv');
  if (existsSync(file)) return;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, 'tessedit_create_tsv 1\n');
}

export function recognize(pngPath: string): { text: string; meanConfidence: number | null } {
  if (!existsSync(TESSERACT)) {
    throw new Error(`Tesseract not found at ${TESSERACT}. Set TESSERACT_CMD.`);
  }
  ensureTsvConfig();
  const args = [pngPath, 'stdout', '-l', 'san+hin', '--tessdata-dir', TESSDATA, '--psm', '6'];
  const text = execFileSync(TESSERACT, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });
  let meanConfidence: number | null = null;
  try {
    const tsv = execFileSync(TESSERACT, [...args, 'tsv'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    const scores: number[] = [];
    for (const line of tsv.split(/\n/).slice(1)) {
      const cells = line.split('\t');
      const conf = Number(cells[10]);
      if (Number.isFinite(conf) && conf >= 0) scores.push(conf);
    }
    if (scores.length) meanConfidence = scores.reduce((sum, n) => sum + n, 0) / scores.length;
  } catch {
    meanConfidence = null;
  }
  return { text, meanConfidence };
}
