import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { CharacterMap } from '@/app/components/CharacterMap';
import { FadeUp } from '@/app/components/motion/primitives';
import { characters } from '@/data/characters';

export const metadata: Metadata = {
  title: 'पात्र एवं संबंध मानचित्र (Character Knowledge Graph)',
  description:
    'महाभारत, रामायण, पुराण, गुरु-शिष्य परंपरा और देवताओं के पात्रों के अंतरसंबंधों का अन्वेषण करें — परिवार, गुरु-शिष्य और मित्रता के संबंध-मानचित्र के साथ।',
  alternates: { canonical: '/characters/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'पात्र एवं संबंध मानचित्र (Character Knowledge Graph) — Dharma Granth',
    description:
      'महाभारत, रामायण, पुराण, गुरु-शिष्य परंपरा और देवताओं के पात्रों के अंतरसंबंधों का अन्वेषण करें।',
    url: 'https://dharmagranth.dev/characters',
  },
};

export default function CharactersPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-violet-200 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              पात्र एवं संबंध मानचित्र (Character & Relationship Maps)
            </p>
            <h1 className="text-5xl font-serif font-bold mb-4">
              पात्र ज्ञान ग्राफ (Character Knowledge Graph)
            </h1>
            <p className="text-xl opacity-90 max-w-2xl">
              महाभारत, रामायण, पुराण, गुरु-शिष्य परंपरा, राजवंशों, ऋषियों और देवताओं के {characters.length} पात्रों के गहरे अंतरसंबंधों का अन्वेषण करें। किसी भी पात्र पर क्लिक कर उसकी जीवनी, परिवार, प्रमुख घटनाओं, संवादों, नैतिक दुविधाओं, संबंधित श्लोकों और परंपरा-विशिष्ट व्याख्याओं को जानें।
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── Interactive Map ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 pb-20">
        <div className="bg-dharma-card/50 backdrop-blur-sm rounded-3xl shadow-2xl border border-dharma-border p-4 sm:p-6 md:p-8">
          <CharacterMap />
        </div>
      </section>
    </main>
  );
}
