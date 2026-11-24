import { NextResponse } from 'next/server';
import { buildVerseIndexParts } from '@/lib/verse-search-data';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return buildVerseIndexParts().parts.map((_, i) => ({ part: `${i}.json` }));
}

export async function GET(_req: Request, context: { params: Promise<{ part: string }> }) {
  const { part } = await context.params;
  const idx = Number.parseInt(part.replace(/\.json$/, ''), 10);
  const { parts } = buildVerseIndexParts();
  if (!Number.isInteger(idx) || idx < 0 || idx >= parts.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(parts[idx]);
}
