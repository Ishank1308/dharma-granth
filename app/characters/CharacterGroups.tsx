import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Bento, BentoCell } from '@/app/components/bento/Bento';
import { SectionTitle } from '@/app/components/apple/PageHeader';
import { characters, type Character, type CharacterCategory } from '@/data/characters';

/**
 * The characters by epic: four groups, each led by one large tile, with a link to every
 * character's own page. A server component, so all 25 links are in the exported HTML (the
 * relationship map below it draws its nodes in SVG, which a crawler cannot follow).
 *
 * The lead of a group is simply its first character in data/characters.ts. The lead tile sits
 * on the left in one group and on the right in the next, so the page does not read as one
 * repeated block.
 */

export const CHARACTER_GROUPS: Array<{
  id: string;
  title: string;
  titleHi: string;
  categories: CharacterCategory[];
  chip: string;
}> = [
  { id: 'mahabharata', title: 'Mahābhārata', titleHi: 'महाभारत', categories: ['mahabharata'], chip: '#b45309' },
  { id: 'ramayana', title: 'Rāmāyaṇa', titleHi: 'रामायण', categories: ['ramayana'], chip: '#1f4e8c' },
  { id: 'deities', title: 'Deities and the Purāṇas', titleHi: 'देवता एवं पुराण', categories: ['deity', 'purana', 'dynasty'], chip: '#6b3fa0' },
  { id: 'teachers', title: 'Rishis and teachers', titleHi: 'ऋषि एवं आचार्य', categories: ['rishi', 'guru-shishya'], chip: '#15803d' },
];

/** How many of a group's smaller tiles go wide (2 × 1) so its last row is full on a 4-column grid. */
const widesFor = (others: number) => (4 - (others % 4)) % 4;

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function LeadTile({ character }: { character: Character }) {
  const facts = [
    character.events.length > 0 && count(character.events.length, 'event', 'events'),
    character.dialogues.length > 0 && count(character.dialogues.length, 'dialogue', 'dialogues'),
    character.dilemmas.length > 0 && count(character.dilemmas.length, 'dilemma', 'dilemmas'),
  ].filter(Boolean);
  return (
    <div className="apple-card bento-tile bento-lead" style={{ '--bento-lead-min': '15rem' } as CSSProperties}>
      <span className="bento-glyph" aria-hidden="true">{character.icon}</span>
      <div className="mt-auto min-w-0">
        <h3 className="text-title-2 font-semibold leading-tight text-dharma-text [overflow-wrap:anywhere]">
          <Link href={`/characters/${character.id}/`} className="bento-link">
            <span>{character.name}</span>{' '}
            <span lang="hi" className="mt-1 block font-devanagari text-title-3 font-normal text-dharma-muted">{character.sanskrit}</span>
          </Link>
        </h3>
        <p className="mt-2 max-w-[38ch] text-subhead leading-snug text-dharma-text-secondary">{character.shortDesc}</p>
        {facts.length > 0 && <p className="mt-2 text-footnote tabular-nums text-dharma-muted">{facts.join(' · ')}</p>}
      </div>
      <div className="bento-actions">
        <span className="apple-pill" aria-hidden="true">Life and teachings</span>
      </div>
    </div>
  );
}

function Tile({ character, wide }: { character: Character; wide: boolean }) {
  return (
    <Link href={`/characters/${character.id}/`} className="apple-card bento-tile">
      <span className="bento-emblem" aria-hidden="true">{character.icon}</span>
      <span className="mt-auto min-w-0 pt-1 leading-tight">
        <span className="block text-subhead font-semibold tracking-[-0.01em] text-dharma-text sm:text-body">{character.name}</span>{' '}
        <span lang="hi" className="block font-devanagari text-footnote text-dharma-muted">{character.sanskrit}</span>
        {wide && (
          <>
            {' '}
            <span className="mt-1 block text-[14px] leading-snug text-dharma-muted">{character.shortDesc}</span>
          </>
        )}
      </span>
    </Link>
  );
}

export function CharacterGroups() {
  const groups = CHARACTER_GROUPS.map((group) => ({
    ...group,
    members: characters.filter((c) => group.categories.includes(c.category)),
  })).filter((group) => group.members.length > 0);

  return (
    <>
      <nav aria-label="Character groups" className="relative z-10 mx-auto max-w-7xl px-gutter pt-6">
        <ul className="flex flex-wrap gap-2">
          {groups.map((group) => (
            <li key={group.id}>
              <a href={`#characters-${group.id}`} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-dharma-text/[0.06] px-4 text-subhead text-dharma-text hover:bg-dharma-text/[0.1]">
                <span>{group.title}</span>
                <span className="tabular-nums text-dharma-muted">{group.members.length}</span>
              </a>
            </li>
          ))}
          <li>
            <a href="#characters-map" className="inline-flex min-h-11 items-center rounded-full bg-dharma-text/[0.06] px-4 text-subhead text-dharma-text hover:bg-dharma-text/[0.1]">
              <span>Relationship map</span>
            </a>
          </li>
        </ul>
      </nav>

      {groups.map((group, index) => {
        const [lead, ...others] = group.members;
        const wides = widesFor(others.length);
        return (
          <section
            key={group.id}
            id={`characters-${group.id}`}
            aria-labelledby={`characters-${group.id}-heading`}
            className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-gutter pt-12"
            style={{ '--chip': group.chip } as CSSProperties}
          >
            <SectionTitle
              id={`characters-${group.id}-heading`}
              title={group.title}
              titleHi={group.titleHi}
              sub={count(group.members.length, 'character', 'characters')}
            />
            <Bento lead={index % 2 === 1 ? 'end' : 'start'}>
              <BentoCell tile="lead">
                <LeadTile character={lead} />
              </BentoCell>
              {others.map((character, i) => (
                <BentoCell key={character.id} tile={i < wides ? 'wide' : undefined}>
                  <Tile character={character} wide={i < wides} />
                </BentoCell>
              ))}
            </Bento>
          </section>
        );
      })}
    </>
  );
}
