import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { DictionaryClient } from './DictionaryClient';
import { PageHeader } from '@/app/components/apple/PageHeader';

export const metadata: Metadata = {
  title: 'Terminology Dictionary (शब्दकोश)',
  description:
    'Dictionary of core Hindu terms: Dharma, Ṛta, Ātman, Brahman, Karma, Mokṣa and more, with Sanskrit, etymology, interpretations and related verses.',
  alternates: { canonical: '/dictionary/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Terminology Dictionary (शब्दकोश) — Dharma Granth',
    description:
      'A structured dictionary of fundamental Hindu terminology: Dharma, Ṛta, Satya, Ātman, Brahman, Mokṣa, and more.',
    url: 'https://dharmagranth.dev/dictionary',
  },
};

export default function DictionaryPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      <PageHeader
        width="wide"
        eyebrow="Dictionary"
        eyebrowHi="शब्दकोश"
        title="Terminology Dictionary"
        titleHi="हिन्दू पारिभाषिक शब्दकोश"
        lead={
          <p>
              A structured reference for foundational concepts of Hindu philosophy. Each term includes permanent identifiers, Sanskrit etymology, cross-tradition interpretations, and related scriptural verses.
            </p>
        }
      />

      {/* ── Interactive Terms Grid ───────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-6 relative z-10 pb-20">
        <DictionaryClient />
      </section>
    </main>
  );
}
