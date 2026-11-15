import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { CharacterMap } from '@/app/components/CharacterMap';
import { characters } from '@/data/characters';
import { PageHeader } from '@/app/components/apple/PageHeader';

export const metadata: Metadata = {
  title: 'Hindu Scriptural Characters & Lineages (पात्र ज्ञान ग्राफ)',
  description:
    'Explore family trees, spiritual lineages, dialogues, and moral dilemmas of key characters from the Mahabharata, Ramayana, Upanishads, and Puranas.',
  keywords: [
    'Mahabharata characters',
    'Ramayana characters',
    'Upanishad rishis',
    'Arjuna Krishna Bhishma Vidura',
    'Hindu character lineages',
    'पात्र ज्ञान ग्राफ',
    'dharma granth',
  ],
  alternates: { canonical: '/characters/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Hindu Scriptural Characters & Lineages (पात्र ज्ञान ग्राफ) — Dharma Granth',
    description:
      'Explore family trees, spiritual lineages, dialogues, and moral dilemmas of key characters from the Mahabharata, Ramayana, Upanishads, and Puranas.',
    url: 'https://dharmagranth.dev/characters/',
  },
};

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      <PageHeader
        width="wide"
        eyebrow="Characters"
        eyebrowHi="पात्र एवं संबंध"
        title="Character Knowledge Graph"
        titleHi="पात्र ज्ञान ग्राफ"
        lead={
          <p lang="hi" className="font-devanagari">
              महाभारत, रामायण, पुराण, गुरु-शिष्य परंपरा, राजवंशों, ऋषियों और देवताओं के {characters.length} पात्रों के गहरे अंतरसंबंधों का अन्वेषण करें। किसी भी पात्र पर क्लिक कर उसकी जीवनी, परिवार, प्रमुख घटनाओं, संवादों, नैतिक दुविधाओं, संबंधित श्लोकों और परंपरा-विशिष्ट व्याख्याओं को जानें।
            </p>
        }
      />

      {/* ── Interactive Map ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pt-6 relative z-10 pb-20">
        <div className="bg-dharma-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-dharma-border p-4 sm:p-6 md:p-8">
          <CharacterMap />
        </div>
      </section>
    </main>
  );
}
