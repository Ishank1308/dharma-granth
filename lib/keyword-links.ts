import { dictionary } from '@/data/dictionary';
import { topics } from '@/data/topics';
import { topicHref } from '@/lib/topic-links';
import { concepts } from '@/data/concepts';

export interface KeywordTarget {
  href: string;
  type: 'dictionary' | 'topic' | 'concept' | 'search';
  label: string;
  tooltip: string;
}

/**
 * Resolves a scripture keyword tag into the most relevant internal destination:
 * 1. Philosophical dictionary term (/dictionary/[id])
 * 2. Life topic / thematic guide (its /wisdom-for-life page)
 * 3. Metaphysical concept graph (/concepts#[id])
 * 4. General dictionary search fallback (/dictionary?q=...)
 */
export function resolveKeywordTarget(rawKeyword: string): KeywordTarget {
  const clean = rawKeyword.trim().toLowerCase().replace(/^#+/, '');

  // 1. Direct dictionary match by id, term, transliteration, or sanskrit
  const dictTerm = dictionary.find(
    (d) =>
      d.id.toLowerCase() === clean ||
      d.term.toLowerCase() === clean ||
      d.sanskrit.trim() === clean ||
      d.transliteration.toLowerCase() === clean,
  );
  if (dictTerm) {
    return {
      href: `/dictionary/${dictTerm.id}`,
      type: 'dictionary',
      label: dictTerm.term,
      tooltip: `शब्दकोश: ${dictTerm.term} (${dictTerm.sanskrit}) की परिभाषा और संदर्भ`,
    };
  }

  // 2. Direct topic match by id or title
  const topic = topics.find(
    (t) =>
      t.id.toLowerCase() === clean ||
      t.title.toLowerCase() === clean ||
      t.title.toLowerCase().includes(clean),
  );
  if (topic) {
    return {
      href: topicHref(topic.id),
      type: 'topic',
      label: topic.title,
      tooltip: `विषय: ${topic.title} — जीवन दर्शन व व्यावहारिक मार्गदर्शन`,
    };
  }

  // 3. Direct concept match by id or label
  const concept = concepts.find(
    (c) =>
      c.id.toLowerCase() === clean ||
      c.label.toLowerCase() === clean ||
      c.sanskrit.trim() === clean ||
      c.transliteration.toLowerCase() === clean,
  );
  if (concept) {
    return {
      href: `/concepts#${concept.id}`,
      type: 'concept',
      label: concept.label,
      tooltip: `अवधारणा: ${concept.label} (${concept.sanskrit}) ज्ञान ग्राफ में देखें`,
    };
  }

  // 4. Default fallback: search dictionary
  return {
    href: `/dictionary?q=${encodeURIComponent(clean)}`,
    type: 'search',
    label: clean,
    tooltip: `शब्दकोश में '${clean}' खोजें`,
  };
}
