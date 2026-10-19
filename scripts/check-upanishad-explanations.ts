import { getAllScriptures } from '../data/scriptures';
import { getBookExplanation } from '../data/book-explanations';

const upanishads = getAllScriptures().filter(x => x.category === 'upanishad');
for (const u of upanishads) {
  const exp = getBookExplanation(u.id);
  if (!exp) {
    console.log(`Missing entire explanation: ${u.id} (${u.title})`);
  } else if (!exp.overview?.hi) {
    console.log(`Missing Hindi overview: ${u.id} (${u.title})`);
  } else {
    console.log(`Has Hindi overview: ${u.id} -> ${exp.overview.hi.slice(0, 30)}...`);
  }
}
