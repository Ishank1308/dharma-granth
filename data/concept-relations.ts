/**
 * Typed relationships between concepts. Each one names its type, points to a
 * verse that supports it, and says in a sentence what that verse shows. The
 * verse is checked against the library text by scripts/check-concept-relations.ts.
 * A relationship is a study aid, not a doctrine: where traditions read a verse
 * differently, the note says so. All are drafts until an editor reviews them.
 */
import type { ReviewStatus } from './study-content';

export type RelationType =
  | 'appears-in'
  | 'spoken-by'
  | 'explains'
  | 'develops'
  | 'contrasts-with'
  | 'related'
  | 'commentary-on'
  | 'narrative-example'
  | 'cross-reference';

export const RELATION_LABEL: Record<RelationType, string> = {
  'appears-in': 'Appears in',
  'spoken-by': 'Spoken by',
  explains: 'Explains',
  develops: 'Develops',
  'contrasts-with': 'Contrasts with',
  related: 'Related concept',
  'commentary-on': 'Commentary on',
  'narrative-example': 'Narrative example',
  'cross-reference': 'Cross-reference',
};

export interface ConceptRelation {
  from: string;
  to: string;
  type: RelationType;
  /** What the cited verse shows about the two concepts. */
  note: string;
  evidence: { scriptureId: string; chapter: number; verse: number; expect: string };
  review: ReviewStatus;
}

const GITA = 'bhagavadgita';

export const CONCEPT_RELATIONS: ConceptRelation[] = [
  { from: 'karma', to: 'yoga', type: 'develops', note: 'Verse 2.48 joins the two: act, established in yoga, and give up attachment.', evidence: { scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः' }, review: 'draft' },
  { from: 'vairagya', to: 'yoga', type: 'related', note: 'Verse 6.35 names practice and non-attachment together as what makes it possible to steady the mind.', evidence: { scriptureId: GITA, chapter: 6, verse: 35, expect: 'वैराग्येण' }, review: 'draft' },
  { from: 'bhakti', to: 'jnana', type: 'develops', note: 'Verse 18.55 says that by devotion one comes to know in truth, and having known, enters.', evidence: { scriptureId: GITA, chapter: 18, verse: 55, expect: 'भक्त्या मामभिजानाति' }, review: 'draft' },
  { from: 'jnana', to: 'karma', type: 'related', note: 'Verse 4.33 says all action reaches its completion in knowledge.', evidence: { scriptureId: GITA, chapter: 4, verse: 33, expect: 'सर्वं कर्माखिलं' }, review: 'draft' },
  { from: 'atman', to: 'samsara', type: 'explains', note: 'Verse 2.22 compares the embodied self taking new bodies to a person changing worn clothes.', evidence: { scriptureId: GITA, chapter: 2, verse: 22, expect: 'वासांसि जीर्णानि' }, review: 'draft' },
  { from: 'maya', to: 'bhakti', type: 'related', note: 'Verse 7.14 calls this divine power hard to cross and says those who take refuge in him cross it. Traditions interpret “maya” differently.', evidence: { scriptureId: GITA, chapter: 7, verse: 14, expect: 'मामेव ये प्रपद्यन्ते' }, review: 'draft' },
  { from: 'dharma', to: 'karma', type: 'related', note: 'Verse 3.35 speaks of one’s own duty (svadharma) as the ground for action. How to understand svadharma is read in several ways.', evidence: { scriptureId: GITA, chapter: 3, verse: 35, expect: 'श्रेयान्स्वधर्मो' }, review: 'draft' },
  { from: 'moksha', to: 'bhakti', type: 'related', note: 'Verse 18.66 speaks of taking refuge and being freed from sin. Commentators differ on how it relates to liberation.', evidence: { scriptureId: GITA, chapter: 18, verse: 66, expect: 'मोक्षयिष्यामि' }, review: 'draft' },
  { from: 'brahman', to: 'moksha', type: 'related', note: 'Verse 18.53 speaks of becoming fit for oneness with Brahman. Traditions describe that state differently.', evidence: { scriptureId: GITA, chapter: 18, verse: 53, expect: 'ब्रह्मभूयाय' }, review: 'draft' },
  { from: 'ahimsa', to: 'dharma', type: 'related', note: 'Verse 16.2 lists non-violence first among the qualities the chapter calls divine. How it relates to dharma is read in different ways.', evidence: { scriptureId: GITA, chapter: 16, verse: 2, expect: 'अहिंसा सत्यमक्रोध' }, review: 'draft' },
  { from: 'yajna', to: 'karma', type: 'develops', note: 'Verse 3.9 links action with sacrifice, teaching that work performed for yajna frees rather than binds.', evidence: { scriptureId: GITA, chapter: 3, verse: 9, expect: 'यज्ञार्थात्कर्मणो' }, review: 'draft' },
];

export const relationsFor = (conceptId: string): ConceptRelation[] => CONCEPT_RELATIONS.filter((r) => r.from === conceptId || r.to === conceptId);
