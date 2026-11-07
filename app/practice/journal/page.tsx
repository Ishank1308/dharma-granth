import type { Metadata } from 'next';
import { JournalClient } from './JournalClient';

export const metadata: Metadata = {
  title: 'व्यक्तिगत स्वाध्याय डायरी · Private Local Journal | Dharma Granth',
  description: '100% Client-side, account-free private contemplation and reflection journal for daily scriptural study.',
  alternates: { canonical: '/practice/journal/' },
  // A private tool that renders only in the reader's browser: nothing here for a search result.
  robots: { index: false, follow: true },
};

export default function JournalPage() {
  return <JournalClient />;
}
