import type { Metadata } from 'next';
import { scriptureCatalog } from '@/data/scripture-meta';
import { SharedListClient } from './SharedListClient';

export const metadata: Metadata = {
  title: 'A shared list of verses · साझा श्लोक-सूची',
  description: 'A list of verses someone shared with you. Read them, or save them to this browser.',
  alternates: { canonical: '/practice/shared/' },
  // The list lives in the link; there is nothing here for a search index.
  robots: { index: false, follow: true },
};

/** Titles only, so the client bundle does not carry the whole catalogue. */
const titles = Object.fromEntries(scriptureCatalog.map((s) => [s.id, s.title]));

export default function SharedListPage() {
  return <SharedListClient titles={titles} />;
}
