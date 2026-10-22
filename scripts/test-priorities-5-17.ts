/**
 * Priorities 5–17 stay on pages and verses that already exist.
 * Run from the repo root:
 * node .\node_modules\tsx\dist\cli.mjs scripts\test-priorities-5-17.ts
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ACADEMY_COURSES, ACADEMY_ORDERS } from '../data/academy-index';
import { CONCEPT_DETAILS } from '../data/concept-details';
import { SCRIPTURE_COMPARISONS } from '../data/scripture-comparisons';
import { SEARCH_INTENTS, searchHeading } from '../data/search-intent';
import { STUDY_PLANS } from '../data/study-plans';
import { STUDY_PLAYLISTS } from '../data/study-playlists';
import { timelines } from '../data/timelines';
import { getWisdomTopic, wisdomTopics } from '../data/wisdom-for-life';
import { learningPaths } from '../data/learning-paths';
import { VERSE_PAGE_SCRIPTURE_IDS } from '../lib/verse-paths';
import { buildVerseGraphData } from '../lib/verse-relationship-engine';
import { entryText, readEntry } from '../app/components/practice/reflection-entry';

const wisdomSlugs = new Set(wisdomTopics.map((topic) => topic.slug));
const verseScriptures = new Set<string>(VERSE_PAGE_SCRIPTURE_IDS);
const timelineIds = new Set(timelines.map((timeline) => timeline.id));
const planIds = new Set(STUDY_PLANS.map((plan) => plan.id));

for (const intent of SEARCH_INTENTS) {
  const topic = getWisdomTopic(intent.slug);
  assert.ok(topic, intent.slug);
  const heading = searchHeading(intent.slug, topic.verses);
  assert.ok(heading);
  const gitaOnly = topic.verses.length > 0 && topic.verses.every((verse) => verse.scriptureId === 'bhagavadgita');
  assert.equal(heading.en, gitaOnly ? intent.gitaTitle : intent.libraryTitle);
  assert.equal(heading.hi, intent.titleHi);
}
assert.equal(searchHeading('missing', []), null);

const fear = getWisdomTopic('fear-and-courage');
assert.ok(fear);
assert.equal(fear.verses.every((verse) => verse.scriptureId === 'bhagavadgita'), false);
const success = getWisdomTopic('success');
assert.ok(success);
assert.equal(success.verses.every((verse) => verse.scriptureId === 'bhagavadgita'), true);

for (const item of [...SCRIPTURE_COMPARISONS.flatMap((comparison) => comparison.links), ...STUDY_PLAYLISTS.flatMap((playlist) => playlist.links)]) {
  assertHref(item.href);
}

for (const course of ACADEMY_COURSES) {
  const found = learningPaths.find((path) => path.id === course.id);
  assert.ok(found, course.id);
  assert.equal(found.difficulty, course.level, course.id);
}
for (const order of ACADEMY_ORDERS) {
  const id = order.href.split('#')[1];
  assert.ok(id && planIds.has(id), order.href);
}

for (const id of ['academic-chronology', 'ramayana-narrative', 'mahabharata-narrative', 'commentarial-tradition', 'acharyas-saints']) {
  assert.equal(timelineIds.has(id), true, id);
}

assert.equal(fs.existsSync(path.join('app', 'compare', 'page.tsx')), true);
assert.equal(fs.existsSync(path.join('app', 'learn', 'academy', 'page.tsx')), true);
const sitemap = fs.readFileSync(path.join('lib', 'sitemap-sections.ts'), 'utf8');
assert.equal(sitemap.includes("'/compare'"), true);
assert.equal(sitemap.includes("'/learn/academy'"), true);

const engine = fs.readFileSync(path.join('lib', 'verse-relationship-engine.ts'), 'utf8');
assert.equal(engine.includes('Preceding verse'), false);
assert.equal(engine.includes('bridge:'), false);

const sparse = buildVerseGraphData('bhagavadgita', 2, 27, { number: 27, translation: 'x' });
for (const node of sparse.nodes) {
  assert.equal(node.id.startsWith('bridge:'), false, node.id);
  assert.equal(node.relationshipReason.includes('Preceding verse'), false, node.relationshipReason);
  assert.equal(node.relationshipReason.includes('succeeding verse unfolds'), false, node.relationshipReason);
}

const effort = buildVerseGraphData('bhagavadgita', 2, 47, { number: 47, translation: 'x' });
assert.ok(effort.nodes.some((node) => node.scriptureId === 'ishavasya' || node.reference.includes('Isha')));

const oldNote = readEntry('पुरानी टिप्पणी');
assert.equal(oldNote.note, 'पुरानी टिप्पणी');
assert.equal(oldNote.learned, '');
assert.equal(entryText(oldNote), 'पुरानी टिप्पणी');
const tagged = readEntry({ learned: 'सीखा', tag: 'not-a-concept' });
assert.equal(tagged.tag, '');
assert.equal(tagged.learned, 'सीखा');

console.log('priority 5-17 tests passed');

function assertHref(href: string): void {
  if (href.startsWith('/concepts/')) {
    const id = href.slice('/concepts/'.length);
    assert.ok(CONCEPT_DETAILS[id], href);
    return;
  }
  if (href.startsWith('/wisdom-for-life/')) {
    const slug = href.slice('/wisdom-for-life/'.length).replace(/\/$/, '');
    assert.ok(wisdomSlugs.has(slug), href);
    return;
  }
  const verse = href.match(/^\/scripture\/([a-z0-9]+)\/chapter\/(\d+)\/verse\/(\d+)$/);
  if (verse) {
    const scriptureId = verse[1] as string;
    const chapter = verse[2] as string;
    const verseNumber = verse[3] as string;
    assert.ok(verseScriptures.has(scriptureId), href);
    const file = path.join('public', 'data', 'scriptures-full', scriptureId, `ch-${chapter}.json`);
    const data = JSON.parse(fs.readFileSync(file, 'utf8')) as {
      chapter: { verses: Array<{ number: number | string }> };
    };
    assert.equal(data.chapter.verses.some((item) => String(item.number) === verseNumber), true, href);
    return;
  }
  const chapter = href.match(/^\/scripture\/([a-z0-9]+)\/chapter\/(\d+)$/);
  if (chapter) {
    const file = path.join('public', 'data', 'scriptures-full', chapter[1] as string, `ch-${chapter[2]}.json`);
    assert.equal(fs.existsSync(file), true, href);
    return;
  }
  const scripture = href.match(/^\/scripture\/([a-z0-9]+)$/);
  if (scripture) {
    const file = path.join('public', 'data', 'scriptures-full', `${scripture[1]}.json`);
    assert.equal(fs.existsSync(file), true, href);
    return;
  }
  const plan = href.match(/^\/learn\/paths\/#([a-z0-9-]+)$/);
  if (plan) {
    assert.ok(planIds.has(plan[1] as string), href);
    return;
  }
  const timeline = href.match(/^\/timelines\/#([a-z0-9-]+)$/);
  if (timeline) {
    assert.ok(timelineIds.has(timeline[1] as string), href);
    return;
  }
  if (href === '/practice/bookmarks/' || href === '/daily' || href === '/practice') {
    assert.equal(fs.existsSync(path.join('app', href.slice(1), 'page.tsx')), true, href);
    return;
  }
  assert.fail(href);
}
