import { scriptureCatalog } from '@/data/scripture-meta';
import { DashboardClient } from './DashboardClient';

/** Titles only. The full catalogue stays on the server so the dashboard bundle does not ship every description. */
const titles = Object.fromEntries(scriptureCatalog.map((scripture) => [scripture.id, scripture.title]));

export default function DashboardPage() {
  return <DashboardClient titles={titles} />;
}
