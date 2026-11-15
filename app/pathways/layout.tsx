import type { Metadata } from 'next';

// /pathways/ redirects to /wisdom-pathways/; this metadata protects the
// static fallback from being indexed as a duplicate page.
export const metadata: Metadata = {
  title: 'Wisdom Pathways',
  alternates: { canonical: '/wisdom-pathways/' },
  robots: { index: false, follow: true },
};

export default function PathwaysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
