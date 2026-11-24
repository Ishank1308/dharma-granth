import { NextResponse } from 'next/server';
import { buildVerseIndexParts } from '@/lib/verse-search-data';

// Emitted as a static file by `output: 'export'`; the search dialog fetches it
// the first time search is opened and streams the <=10 MiB part shards it lists.
export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json(buildVerseIndexParts().manifest);
}
