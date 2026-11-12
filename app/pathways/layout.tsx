import type { Metadata } from 'next';

// /pathways/ only forwards to /wisdom-pathways/ (Cloudflare answers it with a 301 first).
// If the fallback page is ever served, it points search engines at the real page.
export const metadata: Metadata = {
  title: 'Wisdom Pathways',
  alternates: { canonical: '/wisdom-pathways/' },
  robots: { index: false, follow: true },
};

export default function PathwaysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
