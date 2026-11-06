/**
 * Intent-aware search. A question such as "difference between Atman and
 * Brahman" or "What does the Gita teach about failure?" is reduced to the
 * things it asks about, and each is looked up with the ordinary search. The
 * layer never writes an answer: it only routes the reader to concept pages
 * and verified passages, and says how it read the question.
 */
import { searchIndex } from '@/lib/search';
import { getAllConceptDetails } from '@/data/concept-details';
import { SEARCH_GROUPS, type SearchOptions, type SearchResponse, type SearchResultGroup, type SearchResultItem } from '@/lib/search-types';

export type Intent =
  | { kind: 'compare'; terms: [string, string] }
  | { kind: 'define'; term: string }
  | { kind: 'semantic_theme'; key: string; title: string; terms: string[] }
  | { kind: 'about'; term: string };

const clean = (s: string) => s.replace(/[?.!]+$/g, '').replace(/^(the|a|an)\s+/i, '').trim();

export const SEMANTIC_THEMES: Record<
  string,
  {
    title: string;
    terms: string[];
    primaryVerses: Array<{ href: string; title: string; subtitle: string; text: string }>;
  }
> = {
  anxiety: {
    title: 'Anxiety, Fear & Restlessness (उद्वेग एवं भय निवारण)',
    terms: ['fear', 'peace', 'उद्वेग', 'भय', 'शोक', 'अशान्ति', 'मन'],
    primaryVerses: [
      {
        href: '/scripture/bhagavadgita/chapter/12/verse/15/',
        title: 'Bhagavad Gita 12.15',
        subtitle: 'यस्मान्नोद्विजते लोको लोकान्नोद्विजते च यः',
        text: 'He by whom the world is not agitated and who is not agitated by the world, freed from joy, fear, and anxiety—he is dear to Me. (जिससे किसी को उद्वेग नहीं होता और जो स्वयं किसी से उद्विग्न नहीं होता)',
      },
      {
        href: '/scripture/bhagavadgita/chapter/2/verse/56/',
        title: 'Bhagavad Gita 2.56',
        subtitle: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः',
        text: 'One whose mind is undisturbed amidst sorrow, who does not crave after pleasure, and who is free from passion, fear, and anger, is a sage of steady wisdom.',
      },
      {
        href: '/scripture/bhagavadgita/chapter/6/verse/35/',
        title: 'Bhagavad Gita 6.35',
        subtitle: 'अभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते',
        text: 'The restless mind is undoubtedly difficult to subdue, but by sustained practice (abhyasa) and dispassion (vairagya), it is brought under mastery.',
      },
    ],
  },
  leadership: {
    title: 'Leadership, Duty & Exemplary Conduct (नेतृत्व एवं लोकसंग्रह)',
    terms: ['leadership', 'king', 'श्रेष्ठ', 'लोकसंग्रह', 'कर्तव्य', 'आचरण'],
    primaryVerses: [
      {
        href: '/scripture/bhagavadgita/chapter/3/verse/21/',
        title: 'Bhagavad Gita 3.21',
        subtitle: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जनः',
        text: 'Whatever action a great leader performs, common people follow. Whatever standard they establish by their example, all the world pursues.',
      },
      {
        href: '/scripture/bhagavadgita/chapter/3/verse/20/',
        title: 'Bhagavad Gita 3.20',
        subtitle: 'लोकसंग्रहमेवापि संपश्यन्कर्तुमर्हसि',
        text: 'You should perform your work with dedication, with a view to the welfare and social guidance of humanity (lokasangraha).',
      },
    ],
  },
  discipline: {
    title: 'Self-Discipline, Focus & Regulation (संयम, नियम एवं तपस्)',
    terms: ['discipline', 'संयम', 'तपस्', 'नियम', 'इन्द्रियनिग्रह', 'युक्त'],
    primaryVerses: [
      {
        href: '/scripture/bhagavadgita/chapter/6/verse/17/',
        title: 'Bhagavad Gita 6.17',
        subtitle: 'युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु',
        text: 'For one who is disciplined and balanced in eating, recreation, work, and sleep, spiritual contemplation destroys all suffering.',
      },
      {
        href: '/scripture/bhagavadgita/chapter/6/verse/5/',
        title: 'Bhagavad Gita 6.5',
        subtitle: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत्',
        text: 'Let a person elevate themselves through their own disciplined self; do not let the self degrade. The mastered self is your greatest ally.',
      },
    ],
  },
  'krishna discusses dharma': {
    title: 'Lord Krishna on Dharma & Cosmic Order (धर्म-संस्थापन)',
    terms: ['dharma', 'धर्म', 'स्वधर्म', 'सत्य', 'शरणागति'],
    primaryVerses: [
      {
        href: '/scripture/bhagavadgita/chapter/4/verse/7/',
        title: 'Bhagavad Gita 4.7',
        subtitle: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत',
        text: 'Whenever and wherever there is a decline in righteousness (Dharma) and an uprising of unrighteousness, at that time I manifest Myself.',
      },
      {
        href: '/scripture/bhagavadgita/chapter/4/verse/8/',
        title: 'Bhagavad Gita 4.8',
        subtitle: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम्',
        text: 'To protect the noble, to dissolve disharmony, and to firmly establish the foundations of Dharma, I appear millennium after millennium.',
      },
      {
        href: '/scripture/bhagavadgita/chapter/18/verse/66/',
        title: 'Bhagavad Gita 18.66',
        subtitle: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज',
        text: 'Setting aside all secondary duties, surrender unto Me alone as the Supreme Refuge. I shall deliver you from all sorrow; do not fear.',
      },
      {
        href: '/scripture/bhagavadgita/chapter/2/verse/31/',
        title: 'Bhagavad Gita 2.31',
        subtitle: 'स्वधर्ममपि चावेक्ष्य न विकम्पितुमर्हसि',
        text: 'Considering your innate duty (svadharma), you should never waver; for there is nothing nobler than standing firmly for righteousness.',
      },
    ],
  },
};

export function parseIntent(raw: string): Intent | null {
  const q = raw.trim().replace(/\s+/g, ' ');
  const qLower = q.toLowerCase();

  // 1. Direct semantic theme check
  for (const [key, theme] of Object.entries(SEMANTIC_THEMES)) {
    if (
      qLower === key ||
      qLower.includes(key) ||
      qLower === `show verses about ${key}` ||
      qLower === `show verses where ${key}` ||
      qLower === `verses about ${key}`
    ) {
      return { kind: 'semantic_theme', key, title: theme.title, terms: theme.terms };
    }
  }

  const cmp =
    /^(?:what(?:'s| is) the )?(?:difference|differences|distinction|comparison)s? between (.+?) (?:and|&|vs\.?|versus) (.+)$/i.exec(q) ||
    /^(?:compare )?(.+?) (?:vs\.?|versus) (.+)$/i.exec(q);
  if (cmp) return { kind: 'compare', terms: [clean(cmp[1]), clean(cmp[2])] };

  const rel = /^how (?:does|do) (.+?) relate to (.+)$/i.exec(q);
  if (rel) return { kind: 'compare', terms: [clean(rel[1]), clean(rel[2])] };

  const about =
    /^(?:show(?: me)?\s+)?(?:verses|shlokas|slokas|teachings|wisdom|quotes|passages)\s+(?:on|about|for|regarding|related to|where)\s+(.+)$/i.exec(q) ||
    /^what does (?:the )?[\w\s]+? (?:teach|say)(?: to us)? about (.+)$/i.exec(q) ||
    /^(?:what|which) (?:verses|shlokas|teachings) (?:talk|speak) (?:about|of) (.+)$/i.exec(q);
  if (about) {
    const termClean = clean(about[1]).toLowerCase();
    for (const [key, theme] of Object.entries(SEMANTIC_THEMES)) {
      if (termClean.includes(key) || key.includes(termClean)) {
        return { kind: 'semantic_theme', key, title: theme.title, terms: theme.terms };
      }
    }
    return { kind: 'about', term: clean(about[1]) };
  }

  const def = /^(?:what (?:is|are|does)|meaning of|define|explain)\s+(?:the\s+)?(.+?)(?:\s+mean)?$/i.exec(q);
  if (def) return { kind: 'define', term: clean(def[1]) };

  return null;
}

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ऀ-ॿ ]/g, ' ').replace(/\s+/g, ' ').trim();

/** Concept pages whose name, transliteration or Sanskrit equals (or is a word of) the term. */
function conceptsNamed(term: string): SearchResultItem[] {
  const t = norm(term);
  if (!t) return [];
  const words = new Set(t.split(' '));
  return getAllConceptDetails()
    .filter((c) => {
      const names = [norm(c.label), norm(c.transliteration), norm(c.sanskrit)];
      return names.some((n) => n === t || (n !== '' && (words.has(n) || t.includes(n))));
    })
    .map((c) => ({
      id: `intent-concept-${c.id}`,
      title: `${c.label} · ${c.sanskrit}`,
      subtitle: c.transliteration,
      group: 'concept' as SearchResultGroup,
      groupLabel: 'अवधारणाएँ · Concepts',
      category: 'concept' as SearchResultItem['category'],
      categoryLabel: 'अवधारणाएँ · Concepts',
      href: `/concepts/${c.id}`,
      matchingText: c.simpleDefinition.en,
      matchReason: `Concept named in your question: “${term}”`,
      languageLabel: 'Concept',
      actionLabel: 'Open concept →',
    }));
}

const EMPTY = (): Record<SearchResultGroup, SearchResultItem[]> =>
  Object.fromEntries(SEARCH_GROUPS.map((g) => [g.id, [] as SearchResultItem[]])) as Record<SearchResultGroup, SearchResultItem[]>;

export interface IntentResponse extends SearchResponse {
  /** How the question was read, in plain words. Shown above the results. */
  intentNote?: string;
}

export function searchWithIntent(raw: string, options: SearchOptions = {}): IntentResponse {
  const intent = parseIntent(raw);
  if (!intent) return searchIndex(raw, options);

  const terms =
    intent.kind === 'compare'
      ? intent.terms
      : intent.kind === 'semantic_theme'
        ? intent.terms
        : [intent.term];

  const perTerm = terms.map((t) => searchIndex(t, { ...options, group: null, limit: 20 }));
  const concepts = terms.flatMap(conceptsNamed);

  // Concept pages first, then the best results from each term in turn.
  const seen = new Set<string>();
  const seenHref = new Set<string>();
  const ordered: SearchResultItem[] = [];
  const push = (item: SearchResultItem) => {
    if (!seen.has(item.id) && !seenHref.has(item.href)) {
      seen.add(item.id);
      seenHref.add(item.href);
      ordered.push(item);
    }
  };

  // If this is a recognized semantic theme, prioritize its curated primary verses
  if (intent.kind === 'semantic_theme') {
    const themeData = SEMANTIC_THEMES[intent.key];
    if (themeData) {
      themeData.primaryVerses.forEach((pv, idx) => {
        push({
          id: `semantic-theme-${intent.key}-${idx}`,
          title: pv.title,
          subtitle: pv.subtitle,
          group: 'verse' as SearchResultGroup,
          groupLabel: 'श्लोक · Verses',
          category: 'verse' as SearchResultItem['category'],
          categoryLabel: 'श्लोक · Verses',
          href: pv.href,
          matchingText: pv.text,
          matchReason: `Key scripture teaching on ${themeData.title}`,
          languageLabel: 'Sanskrit & Meaning',
          actionLabel: 'Read in context →',
        });
      });
    }
  }

  concepts.forEach(push);
  for (let i = 0; i < 20; i++) {
    perTerm.forEach((r, k) => {
      const it = r.results[i];
      if (it)
        push({
          ...it,
          matchReason: terms.length > 1 ? `${it.matchReason} (for “${terms[k]}”)` : it.matchReason,
        });
    });
  }

  if (ordered.length === 0) return searchIndex(raw, options);

  const groupCounts: Partial<Record<SearchResultGroup, number>> = {};
  const grouped = EMPTY();
  for (const item of ordered) {
    groupCounts[item.group] = (groupCounts[item.group] ?? 0) + 1;
    grouped[item.group].push(item);
  }
  const active = options.group ?? options.category ?? null;
  const filtered = active ? ordered.filter((i) => i.group === active || i.category === active) : ordered;
  for (const g of Object.keys(grouped) as SearchResultGroup[]) grouped[g] = grouped[g].slice(0, 10);

  const quoted = terms.map((t) => `“${t}”`).join(' and ');
  return {
    results: filtered.slice(0, options.limit ?? 40),
    groupedResults: grouped,
    totalMatches: filtered.length,
    groupCounts,
    categoryCounts: { ...groupCounts },
    suggestion: null,
    didYouMean: null,
    isTypoCorrected: false,
    matchedTheme: perTerm[0]?.matchedTheme ?? null,
    intentNote:
      intent.kind === 'semantic_theme'
        ? `Revealing verified teachings and shlokas on ${intent.title}. Each passage directly illuminates this spiritual and psychological dimension.`
        : intent.kind === 'compare'
          ? `Read as a comparison of ${quoted}. Open each result to compare them; this search does not write an answer.`
          : intent.kind === 'define'
            ? `Read as a question about the meaning of ${quoted}. These are the concept pages and passages that cover it.`
            : `Read as a request for teachings about ${quoted}. These are verified passages and pages; open one to read it in context.`,
  };
}
