'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Network,
  Compass,
  BookOpen,
  Sparkles,
  Search,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Layers,
  Filter,
  Flame,
  Brain,
  Quote,
} from 'lucide-react';
import { VerseGraphNetwork } from '@/app/components/study/VerseGraphNetwork';
import { triggerTactileFeedback } from '@/lib/haptics';

interface SeedVerse {
  key: string;
  scriptureId: string;
  scriptureTitle: string;
  scriptureTitleHi: string;
  chapterId: number;
  verseId: number | string;
  theme: string;
  themeHi: string;
  sanskrit: string;
  translation: string;
  description: string;
}

const FEATURED_SEEDS: SeedVerse[] = [
  {
    key: 'bhagavadgita:2:47',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 2,
    verseId: 47,
    theme: 'Nishkama Karma (Selfless Action)',
    themeHi: 'निष्काम कर्मयोग',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन । मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    translation: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to inaction.',
    description: 'The crowning doctrine of Karma Yoga, echoing the foundational teaching of the ancient Isha Upanishad.',
  },
  {
    key: 'bhagavadgita:2:20',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 2,
    verseId: 20,
    theme: 'Immortality of the Conscious Witness (Atman)',
    themeHi: 'आत्मा की नित्यता व अवध्यता',
    sanskrit: 'न जायते म्रियते वा कदाचिन्नायं भूत्वा भविता वा न भूयः । अजो नित्यः शाश्वतोऽयं पुराणो न हन्यते हन्यमाने शरीरे ॥',
    translation: 'The soul is never born, nor does it die at any time; having once existed, it never ceases to be. It is unborn, eternal, ever-existing, and primeval; it is not slain when the body is slain.',
    description: 'Verbatim parallel to Katha Upanishad 2.18, proving the unbroken transmission of Vedic Vedanta into the Gita.',
  },
  {
    key: 'bhagavadgita:15:1',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 15,
    verseId: 1,
    theme: 'The Cosmic Ashvattha Tree (World Metaphor)',
    themeHi: 'संसार-वृक्ष रूपक',
    sanskrit: 'ऊर्ध्वमूलमधःशाखमश्वत्थं प्राहुरव्ययम् । छन्दांसि यस्य पर्णानि यस्तं वेद स वेदवित् ॥',
    translation: 'They speak of an eternal Ashvattha tree with its root above and branches below, whose leaves are the Vedic hymns. One who knows this tree knows the true essence of the Vedas.',
    description: 'Direct cosmological parallel to Katha Upanishad 2.3.1, describing the universe rooted in the Supreme transcendent Source.',
  },
  {
    key: 'bhagavadgita:6:34',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 6,
    verseId: 34,
    theme: 'Mastery of the Restless Mind',
    themeHi: 'मन का निग्रह व साधना',
    sanskrit: 'चञ्चलं हि मनः कृष्ण प्रमाथि बलवद् दृढम् । तस्याहं निग्रहं मन्ये वायोरिव सुदुष्करम् ॥',
    translation: 'The mind is restless, turbulent, obstinate, and very strong, O Krishna. To curb it, I think, is harder than controlling the wind.',
    description: 'Parallels Katha Upanishad 1.3.3–4 (The Chariot Metaphor), addressing the universal challenge of mental turbulence.',
  },
  {
    key: 'bhagavadgita:18:66',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 18,
    verseId: 66,
    theme: 'The Ultimate Surrender (Charama Shloka)',
    themeHi: 'चरम श्लोक — सर्वात्म-समर्पण',
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज । अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ॥',
    translation: 'Abandon all varieties of dharmas and simply surrender unto Me alone. I shall liberate you from all sinful reactions; do not grieve.',
    description: 'The highest synthesis of Bhakti, Jnana, and Sharanagati, transcending dualistic ritualism for direct union with the Divine.',
  },
  {
    key: 'bhagavadgita:13:13',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 13,
    verseId: 13,
    theme: 'The Omnipresent Reality (Brahman)',
    themeHi: 'सर्वव्यापी परब्रह्म तत्त्व',
    sanskrit: 'सर्वतःपाणिपादं तत्सर्वतोऽक्षिशिरोमुखम् । सर्वतःश्रुतिमल्लोके सर्वमावृत्य तिष्ठति ॥',
    translation: 'Everywhere are Its hands and feet, eyes, heads, and faces; everywhere are Its ears. Pervading everything in the universe, It exists.',
    description: 'Echoes Shvetashvatara Upanishad 3.16 and the Rigvedic Purusha Sukta, meditating upon the cosmic consciousness.',
  },
  {
    key: 'bhagavadgita:4:7',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 4,
    verseId: 7,
    theme: 'Descent of the Avatar for Dharma Restoration',
    themeHi: 'धर्म-संस्थापनार्थ अवतार',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत । अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    translation: 'Whenever and wherever there is a decline in righteousness, O descendant of Bharata, and an ascent of unrighteousness, at that time I manifest Myself.',
    description: 'The timeless spiritual law connecting the Gita to the Epics (Mahabharata and Ramayana), promising divine intervention.',
  },
  {
    key: 'bhagavadgita:2:56',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    scriptureTitleHi: 'श्रीमद्भगवद्गीता',
    chapterId: 2,
    verseId: 56,
    theme: 'The Sthitaprajna Ideal (Equanimous Sage)',
    themeHi: 'स्थितप्रज्ञ का स्वरूप',
    sanskrit: 'दुःखेष्वनुद्विग्नमनाः सुखेषु विगतस्पृहः । वीतरागभयक्रोधः स्थितधीर्मुनिरुच्यते ॥',
    translation: 'One whose mind is undisturbed amidst misery, who has no craving for pleasures, and is free from attachment, fear, and anger, is called a sage of steady contemplation.',
    description: 'Practical psychological framework for mastering inner tranquility, connected to Patanjali Yoga Sutra principles.',
  },
];

export function VerseNetworkClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramVerse = searchParams.get('verse');

  const initialSeed = useMemo(() => {
    if (paramVerse) {
      const found = FEATURED_SEEDS.find((s) => s.key === paramVerse);
      if (found) return found;
    }
    return FEATURED_SEEDS[0];
  }, [paramVerse]);

  const [selectedSeed, setSelectedSeed] = useState<SeedVerse>(initialSeed);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (paramVerse) {
      const found = FEATURED_SEEDS.find((s) => s.key === paramVerse);
      if (found && found.key !== selectedSeed.key) {
        setSelectedSeed(found);
      }
    }
  }, [paramVerse, selectedSeed.key]);

  const handleSelectSeed = (seed: SeedVerse) => {
    triggerTactileFeedback('selection', 'click');
    setSelectedSeed(seed);
    router.replace(`/network?verse=${encodeURIComponent(seed.key)}`, { scroll: false });
  };

  const filteredSeeds = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return FEATURED_SEEDS;
    return FEATURED_SEEDS.filter(
      (s) =>
        s.theme.toLowerCase().includes(q) ||
        s.themeHi.includes(q) ||
        s.sanskrit.includes(q) ||
        s.key.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 space-y-8">
      {/* ─── BREADCRUMB & HERO ────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-dharma-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="inline-flex min-h-[44px] items-center hover:text-dharma-text transition">
              Home
            </Link>
          </li>
          <li aria-hidden="true" className="opacity-40">/</li>
          <li>
            <Link href="/learn" className="inline-flex min-h-[44px] items-center hover:text-dharma-text transition">
              Learn
            </Link>
          </li>
          <li aria-hidden="true" className="opacity-40">/</li>
          <li aria-current="page" className="font-semibold text-saffron-600 dark:text-saffron-400">
            Verse Network · श्लोक संबंध जाल
          </li>
        </ol>
      </nav>

      {/* Hero Header */}
      <header className="rounded-3xl border border-saffron-500/20 bg-gradient-to-br from-saffron-500/10 via-amber-500/5 to-transparent p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-saffron-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-saffron-800 dark:text-saffron-300">
            <Network className="h-3.5 w-3.5 text-saffron-600" />
            <span>Interactive Verse Relationship Engine · ज्ञान-जाल</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-dharma-text">
            Exploring Scriptural Echoes & Connections
          </h1>
          <p className="text-sm sm:text-base leading-relaxed text-dharma-muted">
            Hindu scriptures do not exist in isolation. Every truth in the Bhagavad Gita echoes the Vedic Upanishads, roots itself in ancient hymns, and expands in the Epics and Puranas. Explore verified canonical relationships, supporting verses, parallel mantras, and contrasting philosophical perspectives.
          </p>
        </div>
      </header>

      {/* ─── SEED SELECTOR CAROUSEL ───────────────────────────────────────── */}
      <section aria-labelledby="seed-selector-heading" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 id="seed-selector-heading" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
              Select Canonical Verse Node <span lang="hi" className="font-devanagari text-base font-normal text-dharma-muted">· प्रमुख श्लोक केंद्र</span>
            </h2>
            <p className="text-xs sm:text-sm text-dharma-muted">
              Choose a celebrated verse below to explore its interconnected network across scriptures:
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-dharma-muted pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search theme or verse (e.g. Karma, 2.47)..."
              className="w-full rounded-2xl border border-dharma-border bg-dharma-card pl-9 pr-4 py-2 text-xs sm:text-sm text-dharma-text focus:outline-none focus:ring-2 focus:ring-saffron-500/50"
            />
          </div>
        </div>

        {/* Horizontal Ribbon of Seeds */}
        <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 no-scrollbar snap-x">
          {filteredSeeds.map((seed) => {
            const isSelected = seed.key === selectedSeed.key;
            return (
              <button
                key={seed.key}
                type="button"
                onClick={() => handleSelectSeed(seed)}
                className={`snap-start flex-shrink-0 w-72 rounded-2xl border p-4 text-left transition-all relative ${
                  isSelected
                    ? 'border-saffron-500 bg-saffron-500/10 shadow-md ring-2 ring-saffron-500/30'
                    : 'border-dharma-border/80 bg-dharma-card hover:border-saffron-400 hover:bg-dharma-panel'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-saffron-600 dark:text-saffron-400">
                    {seed.scriptureTitle} {seed.chapterId}.{seed.verseId}
                  </span>
                  <span className="text-[10px] font-devanagari opacity-70">
                    {seed.scriptureTitleHi}
                  </span>
                </div>
                <h3 className="font-serif text-sm font-bold text-dharma-text line-clamp-1">
                  {seed.theme}
                </h3>
                <p className="font-devanagari text-xs text-dharma-muted line-clamp-1 mt-0.5">
                  {seed.themeHi}
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-dharma-muted line-clamp-2">
                  {seed.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─── ACTIVE NODE HIGHLIGHT BAR ─────────────────────────────────────── */}
      <section className="rounded-2xl border border-saffron-500/30 bg-dharma-card p-5 sm:p-6 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-dharma-border/60 pb-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
              Active Network Center · वर्तमान केंद्र
            </div>
            <h2 className="font-serif text-2xl font-bold text-dharma-text mt-0.5">
              {selectedSeed.scriptureTitle} {selectedSeed.chapterId}.{selectedSeed.verseId}: {selectedSeed.theme}
            </h2>
          </div>
          <Link
            href={`/scripture/${selectedSeed.scriptureId}/chapter/${selectedSeed.chapterId}/verse/${selectedSeed.verseId}/`}
            className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-xl bg-saffron-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-saffron-700 transition"
          >
            <span>Read Full Chapter Verse</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>

        <blockquote className="border-l-4 border-saffron-500 pl-4 py-1 space-y-2">
          <p className="font-devanagari text-lg sm:text-xl font-medium leading-relaxed text-dharma-text">
            {selectedSeed.sanskrit}
          </p>
          <p className="text-sm leading-relaxed text-dharma-muted italic">
            &ldquo;{selectedSeed.translation}&rdquo;
          </p>
        </blockquote>
      </section>

      {/* ─── THE GRAPH NETWORK VISUALIZATION ───────────────────────────────── */}
      <VerseGraphNetwork
        scriptureId={selectedSeed.scriptureId}
        chapterId={selectedSeed.chapterId}
        verseId={selectedSeed.verseId}
        currentVerse={{
          number: selectedSeed.verseId,
          sanskrit: selectedSeed.sanskrit,
          translation: selectedSeed.translation,
        }}
      />

      {/* ─── EDUCATIONAL FOOTNOTE ─────────────────────────────────────────── */}
      <footer className="rounded-2xl border border-dharma-border bg-dharma-panel/60 p-5 text-xs sm:text-sm text-dharma-muted space-y-2">
        <h3 className="font-serif font-bold text-dharma-text text-sm">
          About the Verse Relationship Engine & Methodology · ज्ञान जाल शोध विधि
        </h3>
        <p className="leading-relaxed">
          The relationships shown in this network are compiled from classical bhashyas (commentaries by Shankaracharya, Ramanujacharya, Madhvacharya, and Vallabhacharya), cross-scriptural concordance indices, and peer-reviewed Vedic philology. No speculative links or machine guesses are shown—each connection represents a conscious thematic echo or direct scriptural citation.
        </p>
      </footer>
    </div>
  );
}
