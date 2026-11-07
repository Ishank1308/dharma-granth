import assert from 'node:assert/strict';
import { LIFE_DISCOVERY_INTENTS, LIFE_DISCOVERY_QUICK_PICKS, LIFE_DISCOVERY_SEO_INTENTS } from '../data/life-discovery-intents';
import { SEARCH_INTENTS, searchHeading } from '../data/search-intent';
import { wisdomTopics } from '../data/wisdom-for-life';

const topicBySlug = new Map(wisdomTopics.map((topic) => [topic.slug, topic]));
const intentSlugs = LIFE_DISCOVERY_INTENTS.map((intent) => intent.slug);
const normalizeCitationText = (value: string) => value
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[–—−]/g, '-')
  .toLowerCase();

assert.equal(new Set(intentSlugs).size, intentSlugs.length, 'Discovery topics must be unique.');
assert.ok(LIFE_DISCOVERY_INTENTS.length >= 20, 'Keep broad access to questions, situations, and practices.');
assert.equal(LIFE_DISCOVERY_QUICK_PICKS.length, 13, 'Quick picks are a curated subset, not a second label catalog.');
assert.deepEqual(
  [...new Set(LIFE_DISCOVERY_QUICK_PICKS.map((intent) => intent.kind))].sort(),
  ['emotion', 'practice', 'question', 'situation'],
  'Quick picks must represent each discovery mode.',
);
assert.equal(SEARCH_INTENTS.length, LIFE_DISCOVERY_SEO_INTENTS.length);

for (const intent of LIFE_DISCOVERY_INTENTS) {
  assert.ok(intent.labelEn.trim(), `${intent.slug} needs an English label.`);
  assert.ok(intent.labelHi.trim(), `${intent.slug} needs a Hindi label.`);
  assert.ok(intent.searchTerms.length > 0, `${intent.slug} needs discovery terms.`);
  assert.ok(intent.searchTerms.every((term) => term.trim()), `${intent.slug} has an empty search term.`);

  const topic = topicBySlug.get(intent.slug);
  assert.ok(topic, `${intent.slug} must resolve to an existing study topic.`);
  assert.ok(topic.shortDescEn.trim(), `${intent.slug} needs an English explanation of the selected study topic.`);
  assert.ok(topic.shortDescHi.trim(), `${intent.slug} needs a Hindi explanation of the selected study topic.`);
  assert.ok(topic.verses.length > 0, `${intent.slug} needs at least one mapped passage.`);
  assert.ok(topic.sources.length > 0, `${intent.slug} needs an explicit source citation.`);
  for (const source of topic.sources) {
    assert.ok(source.citation.trim(), `${intent.slug} has an empty source citation.`);
    assert.ok(source.textName.trim(), `${intent.slug} has an unnamed source.`);
    assert.ok(source.section.trim(), `${intent.slug} has no source location.`);
  }
  for (const verse of topic.verses) {
    const coordinates = verse.referenceDisplay.match(/\b\d+(?:\.\d+){0,2}(?:[–—−-]\d+(?:\.\d+)*)?/u)?.[0];
    assert.ok(coordinates, `${intent.slug} has a passage without coordinates: ${verse.referenceDisplay}`);
    const passageCoordinates = normalizeCitationText(coordinates!);
    const passageText = normalizeCitationText(verse.scriptureName);
    const hasSource = topic.sources.some((source) => {
      const sourceText = normalizeCitationText(source.textName);
      const citation = normalizeCitationText(source.citation);
      return (sourceText.includes(passageText) || passageText.includes(sourceText)) && citation.includes(passageCoordinates);
    });
    assert.ok(hasSource, `${intent.slug} source list does not cite ${verse.referenceDisplay}.`);
  }

  if (intent.seo) {
    const searchIntent = SEARCH_INTENTS.find((item) => item.slug === intent.slug);
    assert.ok(searchIntent, `${intent.slug} SEO metadata must be derived into search intents.`);
    const heading = searchHeading(intent.slug, topic.verses);
    assert.ok(heading);
    assert.equal(heading.hi, intent.seo.titleHi);
    const gitaOnly = topic.verses.every((verse) => verse.scriptureId === 'bhagavadgita');
    assert.equal(heading.en, gitaOnly ? intent.seo.gitaTitle : intent.seo.libraryTitle);
  }
}

assert.equal(searchHeading('unknown-topic', []), null);

const worry = topicBySlug.get('stress-and-worry');
assert.ok(worry);
assert.match(worry.traditionalContextOverview.bodyEn, /does not diagnose/i);
assert.match(worry.traditionalContextOverview.bodyEn, /6\.35/);
assert.doesNotMatch(worry.traditionalContextOverview.bodyEn, /diagnosed as|profound healing/i);
assert.ok(
  worry.sources.some((source) => source.citation.includes('6.35')),
  'The explanatory paragraph must cite Gita 6.35 in its source list.',
);

console.log(`life-discovery: ${LIFE_DISCOVERY_INTENTS.length} topics, ${LIFE_DISCOVERY_QUICK_PICKS.length} quick picks, and ${SEARCH_INTENTS.length} SEO labels validated.`);
