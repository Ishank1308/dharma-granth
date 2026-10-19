import { getAllScriptures, getLibraryCounts } from '../data/scriptures';
import { countLabel, plural } from '../lib/library';

const s = getAllScriptures().filter(x => x.category === 'upanishad');
for (const u of s) {
  const held = getLibraryCounts(u.id);
  const hasCanonical = u.canonicalTotalVerses != null && u.canonicalTotalVerses !== held.verses;
  const chapterLabel = hasCanonical ? `${plural(held.chapters, 'chapter')} indexed` : countLabel({ ...u, totalChapters: held.chapters, totalVerses: held.verses }).chapters;
  console.log(`${u.id}: held.chapters=${held.chapters}, label="${chapterLabel}"`);
}
