import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { CONCEPT_DETAILS } from '@/data/concept-details';
import { CONCEPT_RELATIONS, RELATION_LABEL } from '@/data/concept-relations';
import { readHref } from '@/lib/verse-paths';
import { REVIEW_LABEL } from '@/data/study-content';
import { RelationshipExplorer, type ExplorerConcept, type ExplorerRelation } from './RelationshipExplorer';

export const metadata: Metadata = {
  title: 'Concept relationships · अवधारणाओं के संबंध',
  description: 'How twelve central concepts relate to one another, each link with its type and the verse that supports it.',
  alternates: { canonical: '/concepts/relationships/' },
  openGraph: {
    title: 'Concept relationships · अवधारणाओं के संबंध',
    description:
      'How twelve central concepts relate to one another, each link with its type and the verse that supports it.',
    url: '/concepts/relationships/',
    images: [DEFAULT_OG_IMAGE],
  },
};

const IDS = ['dharma', 'karma', 'atman', 'brahman', 'moksha', 'bhakti', 'jnana', 'yoga', 'maya', 'ahimsa', 'samsara', 'vairagya'];

const PRACTICE: Record<string, { href: string; label: string }> = {
  dharma: { href: '/wisdom-for-life/duty-and-decision-making', label: 'कर्तव्य का जीवन-विषय' },
  karma: { href: '/learn/plans/#plan-karma-yoga', label: 'कर्मयोग का पढ़ने का क्रम' },
  atman: { href: '/wisdom-for-life/self-knowledge', label: 'आत्मज्ञान का जीवन-विषय' },
  brahman: { href: '/wisdom-for-life/self-knowledge', label: 'आत्मज्ञान का जीवन-विषय' },
  moksha: { href: '/wisdom-for-life/meaning-of-life', label: 'जीवन के अर्थ का विषय' },
  bhakti: { href: '/wisdom-for-life/devotion', label: 'भक्ति का जीवन-विषय' },
  jnana: { href: '/wisdom-for-life/self-knowledge', label: 'आत्मज्ञान का जीवन-विषय' },
  yoga: { href: '/learn/plans/#plan-meditation-journey', label: 'ध्यान का पढ़ने का क्रम' },
  samsara: { href: '/wisdom-for-life/death', label: 'मृत्यु का जीवन-विषय' },
  vairagya: { href: '/wisdom-for-life/detachment', label: 'अनासक्ति का जीवन-विषय' },
};

export default function RelationshipsPage() {
  const concepts: ExplorerConcept[] = IDS.filter((id) => CONCEPT_DETAILS[id]).map((id) => {
    const c = CONCEPT_DETAILS[id];
    const practice = PRACTICE[id];
    return {
      id,
      label: c.label,
      sanskrit: c.sanskrit,
      transliteration: c.transliteration,
      definition: c.simpleDefinition.en,
      practiceHref: practice?.href,
      practiceLabel: practice?.label,
    };
  });
  const relations: ExplorerRelation[] = CONCEPT_RELATIONS.map((r) => ({
    from: r.from,
    to: r.to,
    typeLabel: RELATION_LABEL[r.type],
    note: r.note,
    source: `Bhagavad Gita ${r.evidence.chapter}.${r.evidence.verse}`,
    href: readHref(r.evidence.scriptureId, r.evidence.chapter, r.evidence.verse),
    status: REVIEW_LABEL[r.review],
  }));
  return <RelationshipExplorer concepts={concepts} relations={relations} />;
}
