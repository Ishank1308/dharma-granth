// Draws a verse card to a high-DPI PNG in the browser. No canvas library.

export interface VerseCardImage {
  reference: string;
  sanskrit?: string;
  translation?: string;
  fileName?: string;
}

const W = 1080;
const H = 1350;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    if (line) lines.push(line);
  }
  return lines;
}

function draw(canvas: HTMLCanvasElement, input: VerseCardImage) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas');
  const scale = 2;
  canvas.width = W * scale;
  canvas.height = H * scale;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  ctx.fillStyle = '#f6eddc';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#b08a4a';
  ctx.lineWidth = 3;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  const dev = 'Noto Sans Devanagari, Nirmala UI, serif';
  ctx.fillStyle = '#8a4b12';
  ctx.font = `600 28px ${dev}`;
  ctx.textAlign = 'center';
  ctx.fillText(input.reference, W / 2, 140);

  ctx.fillStyle = '#c2691a';
  ctx.font = `500 22px ${dev}`;
  ctx.fillText('✦  ❁  ✦', W / 2, 190);

  ctx.fillStyle = '#2b1d10';
  ctx.font = `700 40px ${dev}`;
  const sanskrit = (input.sanskrit ?? '').trim();
  const verseLines = sanskrit ? wrap(ctx, sanskrit, W - 200).slice(0, 8) : [];
  let y = 280;
  for (const line of verseLines) {
    ctx.fillText(line, W / 2, y);
    y += 58;
  }

  const meaning = (input.translation ?? '').trim();
  if (meaning) {
    y += 20;
    ctx.strokeStyle = 'rgba(180,83,9,0.45)';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 70, y);
    ctx.lineTo(W / 2 + 70, y);
    ctx.stroke();
    y += 56;
    ctx.fillStyle = '#3d2d1c';
    ctx.font = `500 28px ${dev}`;
    for (const line of wrap(ctx, meaning, W - 220).slice(0, 6)) {
      ctx.fillText(line, W / 2, y);
      y += 42;
    }
  }

  ctx.fillStyle = '#8a4b12';
  ctx.font = `700 26px ${dev}`;
  ctx.fillText('dharmagranth.dev', W / 2, H - 110);
}

/** Saves a PNG of the verse card. Rejects when the browser cannot draw or save it. */
export async function downloadVerseCardPng(input: VerseCardImage): Promise<void> {
  await document.fonts?.ready;
  const canvas = document.createElement('canvas');
  draw(canvas, input);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
  if (!blob) throw new Error('png');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = input.fileName || 'dharmagranth-verse.png';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
