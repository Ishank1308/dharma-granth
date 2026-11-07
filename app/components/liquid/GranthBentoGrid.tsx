import { getAllScriptures, getScriptureMeta } from '@/data/scriptures';
import type { ScriptureCategory } from '@/data/types';
import { GranthCard3D, type GranthCardData } from './GranthCard3D';

const SHRUTI = { hi: 'श्रुति', en: 'Śruti' };
const SMRITI = { hi: 'स्मृति', en: 'Smṛti' };

function chapters(id: string, word = 'chapters'): string | undefined {
  const meta = getScriptureMeta(id);
  return meta?.totalChapters ? `${meta.totalChapters} ${word}` : undefined;
}

/**
 * The library as an asymmetric Bento grid: Śruti (the four Vedas and the
 * Upanishads) and Smṛti (the Gita, the Itihāsas, the Purāṇas). A server
 * component: the cards' text and links are in the exported HTML; only the
 * tilt is a client island (GranthCard3D).
 */
export function GranthBentoGrid() {
  const all = getAllScriptures();
  const count = (c: ScriptureCategory) => all.filter((s) => s.category === c).length;

  const cards: GranthCardData[] = [
    {
      href: '/scripture/bhagavadgita/',
      titleSa: 'श्रीमद्भगवद्गीता',
      titleEn: 'Bhagavad Gita',
      tradition: SMRITI,
      description: 'Krishna’s counsel to Arjuna on the field of Kurukshetra: duty, devotion and the Self, in 700 verses.',
      facts: '18 chapters · 700 verses',
      tint: ['#2563eb', '#0d9488'],
      size: 'hero',
    },
    {
      href: '/scripture/rigveda/',
      titleSa: 'ऋग्वेद',
      titleEn: 'Rigveda',
      tradition: SHRUTI,
      description: 'The oldest Veda: hymns to Agni, Indra and the cosmic order.',
      facts: chapters('rigveda', 'maṇḍalas'),
      tint: ['#f97316', '#b91c1c'],
      size: 'small',
    },
    {
      href: '/scriptures/?category=upanishad',
      titleSa: 'उपनिषद्',
      titleEn: 'Upanishads',
      tradition: SHRUTI,
      description: 'The Vedānta of the Vedas: dialogues on Brahman and Ātman, from the Īśa to the Chāndogya.',
      facts: `${count('upanishad')} in the library`,
      tint: ['#14b8a6', '#84cc16'],
      size: 'tall',
    },
    {
      href: '/scripture/yajurveda/',
      titleSa: 'यजुर्वेद',
      titleEn: 'Yajurveda',
      tradition: SHRUTI,
      description: 'Formulas of the sacrifice.',
      facts: chapters('yajurveda', 'adhyāyas'),
      tint: ['#eab308', '#f97316'],
      size: 'small',
    },
    {
      href: '/scripture/samaveda/',
      titleSa: 'सामवेद',
      titleEn: 'Samaveda',
      tradition: SHRUTI,
      description: 'The Veda of chant.',
      tint: ['#f59e0b', '#ef4444'],
      size: 'small',
    },
    {
      href: '/scripture/atharvaveda/',
      titleSa: 'अथर्ववेद',
      titleEn: 'Atharvaveda',
      tradition: SHRUTI,
      description: 'Hymns for daily life.',
      facts: chapters('atharvaveda', 'kāṇḍas'),
      tint: ['#b45309', '#7c2d12'],
      size: 'small',
    },
    {
      href: '/scriptures/?category=itihasa',
      titleSa: 'इतिहास',
      titleEn: 'Itihāsa',
      tradition: SMRITI,
      description: 'The epics: Vālmīki’s Rāmāyaṇa, the Mahābhārata, and Tulsīdās’s Rāmcharitmānas.',
      facts: `${count('itihasa')} texts`,
      tint: ['#ea580c', '#7c3aed'],
      size: 'wide',
    },
    {
      href: '/scriptures/?category=purana',
      titleSa: 'पुराण',
      titleEn: 'Purāṇas',
      tradition: SMRITI,
      description: 'The old stories of creation, the avatāras and the devotees, from the Viṣṇu to the Bhāgavata.',
      facts: `${count('purana')} in the library`,
      tint: ['#3b82f6', '#ec4899'],
      size: 'wide',
    },
    {
      href: '/scriptures/',
      titleSa: 'ग्रन्थालय',
      titleEn: 'The whole library',
      tradition: { hi: 'सर्व', en: 'All texts' },
      description: 'Sūtras, Smṛtis, Tantras and Stotras too, searchable by name, tradition and language.',
      facts: `${all.length} texts`,
      tint: ['#e5c158', '#c84b31'],
      size: 'wide',
    },
  ];

  return (
    <section aria-labelledby="granth-bento-heading" className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
        <div>
          <p lang="hi" className="font-devanagari text-sm text-[color:var(--dharma-accent)]">ग्रन्थ</p>
          <h2 id="granth-bento-heading" className="mt-1 font-serif text-3xl font-medium tracking-tight text-dharma-text sm:text-4xl">
            Śruti &amp; Smṛti
          </h2>
        </div>
        <p className="max-w-sm font-serif text-dharma-muted">
          What was heard by the ṛṣis, and what was remembered and handed down.
        </p>
      </div>
      <div className="grid auto-rows-[minmax(168px,auto)] grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[minmax(190px,auto)]">
        {cards.map((card) => (
          <GranthCard3D key={card.href} card={card} />
        ))}
      </div>
    </section>
  );
}
