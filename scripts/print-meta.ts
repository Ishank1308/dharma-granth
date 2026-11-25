import { scriptureCatalog } from "../data/scripture-meta";

const missingIds = [
  "brahmapuran",
  "padmapuran",
  "brahmandpuran",
  "shivasamhita",
  "yogavasistha",
  "yogarasayanam",
  "vinayapatrika",
  "brahmavaivartapuran",
  "vamanpuran",
  "varahapuran",
  "vayupuran",
  "viduraniti",
  "skandapuran"
];
const missingSet = new Set(missingIds);

const result = scriptureCatalog
  .filter(m => missingSet.has(m.id))
  .map(m => ({
    id: m.id,
    title: m.title,
    titleSanskrit: m.titleSanskrit,
    category: m.category,
    totalChapters: m.totalChapters
  }));

console.log(JSON.stringify(result, null, 2));
