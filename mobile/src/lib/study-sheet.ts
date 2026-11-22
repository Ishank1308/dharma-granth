/**
 * The study sheet (website /pack): chosen verses with chosen layers, laid out as a printable A4 page and
 * turned into a PDF on the phone (expo-print). Nothing is uploaded. Pure functions, no imports, so the
 * node tests can load this file as it is.
 *
 * Every verse is printed whole: each line of the Sanskrit, never cut to fit a page (a verse is kept on one
 * page where it fits, and runs on where it does not).
 */

export type SheetLayer = 'verse' | 'translit' | 'hindi' | 'english' | 'words' | 'notes';
export const SHEET_LAYERS: SheetLayer[] = ['verse', 'translit', 'hindi', 'english', 'words', 'notes'];
export const DEFAULT_LAYERS: Record<SheetLayer, boolean> = { verse: true, translit: true, hindi: true, english: true, words: false, notes: false };

export interface SheetVerse {
  /** "Bhagavad Gita 2.47" */
  label: string;
  sanskrit: string[];
  translit?: string;
  hindi?: string;
  hindiAi?: boolean;
  english?: string;
  englishAi?: boolean;
  words?: string;
  /** The reader's own reflections linked to this verse (only printed when that layer is on). */
  notes?: string[];
}

export interface SheetText {
  lang: 'en' | 'hi';
  prepared: string;
  hindi: string;
  english: string;
  words: string;
  note: string;
  ai: string;
  footer: string;
}

export const MAX_SHEET_TITLE = 80;

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const lines = (s: string) =>
  s
    .split('\n')
    .map((l) => escapeHtml(l.trim()))
    .filter(Boolean)
    .join('<br>');

export function sheetHtml(title: string, verses: SheetVerse[], layers: Record<SheetLayer, boolean>, text: SheetText): string {
  const body = verses
    .map((v) => {
      const parts: string[] = [`<h2>${escapeHtml(v.label)}</h2>`];
      if (layers.verse && v.sanskrit.length) {
        parts.push(`<p class="sa" lang="sa">${v.sanskrit.map((l) => `<span>${escapeHtml(l)}</span>`).join('')}</p>`);
      }
      if (layers.translit && v.translit) parts.push(`<p class="tr">${lines(v.translit)}</p>`);
      if (layers.hindi && v.hindi) {
        parts.push(`<p lang="hi"><b>${escapeHtml(text.hindi)}:</b> ${v.hindiAi ? `<i>(${escapeHtml(text.ai)})</i> ` : ''}${lines(v.hindi)}</p>`);
      }
      if (layers.english && v.english) {
        parts.push(`<p lang="en"><b>${escapeHtml(text.english)}:</b> ${v.englishAi ? `<i>(${escapeHtml(text.ai)})</i> ` : ''}${lines(v.english)}</p>`);
      }
      if (layers.words && v.words) parts.push(`<p class="w"><b>${escapeHtml(text.words)}:</b> ${lines(v.words)}</p>`);
      if (layers.notes && v.notes?.length) {
        for (const n of v.notes) parts.push(`<blockquote><b>${escapeHtml(text.note)}:</b> ${lines(n)}</blockquote>`);
      }
      return `<section>${parts.join('')}</section>`;
    })
    .join('');
  const safeTitle = escapeHtml(title.trim().slice(0, MAX_SHEET_TITLE) || 'Dharma Granth');
  return `<!doctype html><html lang="${text.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${safeTitle}</title><style>
@page { size: A4; margin: 18mm 16mm 20mm; }
body { font-family: "Noto Serif", Georgia, serif; color: #1c1917; font-size: 11.5pt; line-height: 1.55; margin: 0; }
h1 { font-size: 20pt; margin: 0 0 2pt; }
.sub { color: #57534e; font-size: 9.5pt; margin: 0 0 14pt; }
section { border-top: 1px solid #d6d3d1; padding-top: 10pt; margin-top: 12pt; break-inside: avoid; page-break-inside: avoid; }
h2 { font-size: 12.5pt; color: #9a3412; margin: 0 0 6pt; }
.sa { font-family: "Noto Serif Devanagari", "Noto Sans Devanagari", serif; font-size: 15pt; line-height: 1.9; margin: 0 0 6pt; }
.sa span { display: block; }
.tr { font-style: italic; color: #44403c; margin: 0 0 6pt; }
p { margin: 0 0 6pt; }
[lang="hi"] { font-family: "Noto Serif Devanagari", "Noto Sans Devanagari", serif; line-height: 1.8; }
.w { font-size: 10pt; color: #44403c; }
blockquote { margin: 6pt 0 0; padding-left: 8pt; border-left: 3pt solid #a8a29e; }
footer { margin-top: 18pt; border-top: 1px solid #d6d3d1; padding-top: 6pt; color: #57534e; font-size: 9pt; }
</style></head><body><h1>${safeTitle}</h1><p class="sub">${escapeHtml(text.prepared)}</p>${body}<footer>${escapeHtml(text.footer)}</footer></body></html>`;
}
