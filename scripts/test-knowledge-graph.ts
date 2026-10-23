/**
 * Milestone 1: the taxonomy stays a fixed list, and verse links come only
 * from stored citations or from fields on the verse.
 */
import assert from 'node:assert/strict';
import { GRAPH_CONCEPTS, graphPageIds } from '../data/knowledge-graph';
import { getWisdomTopic } from '../data/wisdom-for-life';
import { buildGraphPage, resolveVerseKnowledge } from '../lib/knowledge-graph';

const expected = [
  'dharma', 'karma', 'bhakti', 'jnana', 'moksha', 'mind', 'fear', 'anger', 'duty', 'discipline',
  'purpose', 'wisdom', 'detachment', 'attachment', 'compassion', 'self-control', 'patience',
  'meditation', 'truth', 'leadership', 'service', 'faith', 'reflection', 'equanimity', 'concentration',
];

assert.deepEqual(GRAPH_CONCEPTS.map((concept) => concept.id), expected);
assert.equal(new Set(expected).size, 25);

for (const concept of GRAPH_CONCEPTS) {
  for (const related of concept.related) {
    assert.ok(expected.includes(related), `${concept.id} relates to unknown ${related}`);
  }
}

const pages = ['karma', 'dharma', 'fear', 'anger', 'mind', 'discipline', 'attachment', 'detachment', 'bhakti', 'wisdom'];
assert.deepEqual([...graphPageIds()].sort(), [...pages].sort());

for (const id of pages) {
  const page = buildGraphPage(id);
  assert.ok(page, `missing page ${id}`);
  assert.ok(page.overviewHi.length > 0, `${id} has no stored overview`);
  assert.ok(page.concepts.length > 0, `${id} has no related concepts`);
}

const fear = buildGraphPage('fear');
const fearTopic = getWisdomTopic('fear-and-courage');
assert.equal(fear?.overviewHi, fearTopic?.shortDescHi);
assert.ok((fear?.verses.length ?? 0) > 0);
assert.ok(fear?.applications.some((item) => item.href.includes('/wisdom-for-life/fear-and-courage/')));

const karmaVerse = resolveVerseKnowledge('bhagavadgita', 2, 47);
assert.ok(karmaVerse.concepts.some((concept) => concept.id === 'karma'));
assert.ok(karmaVerse.verses.every((verse) => verse.href.includes('/scripture/')));
assert.ok(karmaVerse.verses.every((verse) => !verse.href.includes('2.47') && !verse.href.endsWith('/47') && !verse.href.endsWith('/47/')));

const attachmentVerse = resolveVerseKnowledge('bhagavadgita', 2, '62');
assert.ok(attachmentVerse.questions.some((question) => question.href.includes('/wisdom-for-life/attachment/')));

const untouched = resolveVerseKnowledge('bhagavadgita', 2, 99999);
assert.deepEqual(untouched, { concepts: [], questions: [], verses: [] });

const explicit = resolveVerseKnowledge('bhagavadgita', 2, 1, {
  concepts: ['truth'],
  relatedQuestions: [{ href: '/wisdom-for-life/fear-and-courage/', labelHi: 'भय', labelEn: 'Fear' }],
  relatedVerses: [{ scriptureId: 'bhagavadgita', chapterId: 2, verseId: 47 }],
});
assert.ok(explicit.concepts.some((concept) => concept.id === 'truth'));
assert.equal(explicit.questions[0]?.labelEn, 'Fear');
assert.ok(explicit.verses[0]?.href.includes('/scripture/bhagavadgita/'));

console.log('knowledge graph milestone 1: ok');
