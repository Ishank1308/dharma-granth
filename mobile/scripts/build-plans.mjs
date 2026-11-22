// Reading plans and the Gita Sankalpa chapter list for the app, from the website's own data:
//   ../data/reading-plans.ts   (READING_PLANS: the 18-day Gita and 7-day foundation plans, /learn/plans/)
//   ../lib/gita-sankalpa.ts    (GITA_CHAPTERS: names, verse counts, shatka and theme, /practice/gita-sankalpa/)
// Output: src/content/generated/plans.json (git-ignored, rebuilt with the rest of the content).
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '../..');
const OUT = resolve(HERE, '../src/content/generated/plans.json');

export async function buildPlans() {
  const { READING_PLANS } = await import(resolve(ROOT, 'data/reading-plans.ts'));
  const { GITA_CHAPTERS } = await import(resolve(ROOT, 'lib/gita-sankalpa.ts'));
  const plans = READING_PLANS.map((p) => ({
    id: p.id,
    title: p.title,
    titleHi: p.titleHi,
    category: p.category,
    dailyMinutes: p.dailyMinutes,
    description: p.description,
    descriptionHi: p.descriptionHi,
    days: p.days.map((d) => {
      // "/scripture/<id>/chapter/<n>/verse/<v>" → the verse to open, when the day is one verse.
      const verse = /\/verse\/([^/]+)/.exec(d.href)?.[1];
      return {
        day: d.dayNumber,
        title: d.title,
        titleHi: d.titleHi,
        scriptureId: d.scriptureId,
        chapter: d.chapterId,
        ...(verse ? { verse } : {}),
        minutes: d.estimatedMinutes,
        focus: d.focusTheme,
        focusHi: d.focusThemeHi,
      };
    }),
  }));
  const gita = GITA_CHAPTERS.map((c) => ({
    number: c.number,
    name: c.name,
    nameHi: c.nameHi,
    verses: c.verses,
    shatka: c.shatka,
    shatkaHi: c.shatkaHi,
    theme: c.theme,
    themeHi: c.themeHi,
  }));
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify({ plans, gita }));
  console.log(`[content] ${plans.length} reading plans, ${gita.length} Gita chapters for the Sankalpa`);
}

if (import.meta.url === `file://${process.argv[1]}`) await buildPlans();
