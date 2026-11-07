import type { Metadata } from 'next';

// Personal, device-local content — excluded from search indexes.
export const metadata: Metadata = {
  title: 'Your Reading Dashboard',
  description: 'Your private reading progress, streaks, and study stats.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
