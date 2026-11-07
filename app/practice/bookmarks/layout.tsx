import type { Metadata } from 'next';

// Personal, device-local content — excluded from search indexes.
export const metadata: Metadata = {
  title: 'Saved Verses',
  description: 'Your bookmarked and liked verses, stored privately on this device.',
  robots: { index: false, follow: false },
};

export default function BookmarksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
