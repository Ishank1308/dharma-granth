import { scriptureCatalog } from '../data/scripture-meta';
const m: Record<string, number> = {};
for (const s of scriptureCatalog) {
  m[s.category] = (m[s.category] || 0) + 1;
}
console.log(m);
console.log('Total scriptures:', scriptureCatalog.length);
