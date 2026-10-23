import type { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';

export const metadata: Metadata = {
  title: 'Private Practice Dashboard | Dharma Granth',
  description: 'A private, local view of your reading, reflection, and chosen study sessions.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
