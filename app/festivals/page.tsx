'use client';

import { useMemo, useState } from 'react';
import { festivals, type Festival } from '@/data/festivals';
import Link from 'next/link';
import { RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PageCover } from '@/app/components/PagePhoto';
import { FestivalsOpening } from './FestivalsOpening';

const UNIQUE_CATEGORIES = Array.from(new Set(festivals.map((f) => f.category)));

const CATEGORY_EN: Record<string, string> = {
  'प्रकाश का त्योहार': 'Festival of Lights',
  'रंगों का त्योहार': 'Festival of Colours',
  'दुर्गा पूजा — नौ रातों का उत्सव': 'Nine Nights of Shakti',
  'कृष्ण जन्मोत्सव': 'Krishna Janmotsava',
  'शिव की रात्रि': 'Sacred Night of Shiva',
  'गणेश जन्मोत्सव': 'Ganesha Janmotsava',
  'राम जन्मोत्सव': 'Rama Janmotsava',
  'ज्ञान एवं शास्त्र पर्व': 'Scripture & Wisdom',
  'गुरु एवं ज्ञान पर्व': 'Guru & Tradition',
};

type LensId = 'all' | 'vasanta' | 'varsha' | 'sharad' | 'vrata';

const PARVA_LENSES: Array<{
  id: LensId;
  hi: string;
  en: string;
  match: (festival: Festival) => boolean;
}> = [
  { id: 'all', hi: 'संपूर्ण वर्ष', en: 'Full Year', match: () => true },
  {
    id: 'vasanta',
    hi: 'फाल्गुन–चैत्र (वसंत)',
    en: 'Phalguna–Chaitra · Spring',
    match: (f) => /(फाल्गुन|चैत्र)/.test(f.timing),
  },
  {
    id: 'varsha',
    hi: 'आषाढ़–भाद्रपद (चातुर्मास)',
    en: 'Ashadha–Bhadrapada · Chaturmas',
    match: (f) => /(आषाढ़|भाद्रपद)/.test(f.timing),
  },
  {
    id: 'sharad',
    hi: 'आश्विन–मार्गशीर्ष (शरद–हेमंत)',
    en: 'Ashwin–Margashirsha · Sharad',
    match: (f) => /(आश्विन|कार्तिक|मार्गशीर्ष)/.test(f.timing),
  },
  {
    id: 'vrata',
    hi: 'व्रत व रात्रि जागरण',
    en: 'Vrata & Night Vigil',
    match: (f) => f.traditionalPractices.some((p) => /(जागरण|व्रत|उपवास)/.test(p)),
  },
];

function normalizeLatin(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchesSearch(festival: Festival, rawQuery: string): boolean {
  const q = rawQuery.trim();
  if (!q) return true;
  const qLower = q.toLowerCase();
  const qAscii = normalizeLatin(q);
  const fields = [
    festival.name,
    festival.sanskrit,
    festival.shortDesc,
    festival.category,
    festival.transliteration,
    festival.relatedDeity,
  ];
  return fields.some(
    (field) => field.toLowerCase().includes(qLower) || normalizeLatin(field).includes(qAscii),
  );
}

export default function FestivalsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLens, setSelectedLens] = useState<LensId>('all');
  const [query, setQuery] = useState<string>('');

  const activeLens = PARVA_LENSES.find((lens) => lens.id === selectedLens) ?? PARVA_LENSES[0];
  const isFiltered = selectedCategory !== 'all' || selectedLens !== 'all' || query.trim().length > 0;

  const filteredFestivals = useMemo(() => {
    return festivals.filter((festival) => {
      if (selectedCategory !== 'all' && festival.category !== selectedCategory) return false;
      if (!activeLens.match(festival)) return false;
      return matchesSearch(festival, query);
    });
  }, [selectedCategory, activeLens, query]);

  const resetAll = () => {
    setSelectedCategory('all');
    setSelectedLens('all');
    setQuery('');
  };

  return (
    <main className="apple-scope min-h-screen bg-dharma-bg relative overflow-clip">
      {/* Festive Radiant Halos Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-6xl rounded-full bg-radial from-amber-400/22 via-saffron-500/12 to-transparent blur-3xl"
      />

      <div className="relative z-10">
        <PageHeader
          width="wide"
          eyebrow="Festivals"
          eyebrowHi="उत्सव"
          title="Festival Knowledge Centre"
          cover={<PageCover photo="ganga" />}
          titleHi="उत्सव ज्ञान केंद्र"
          lead={
            <p lang="hi" className="font-devanagari">
              {festivals.length} प्रमुख त्योहारों का विस्तृत ज्ञान — अर्थ, शास्त्रीय स्रोत, क्षेत्रीय परंपराएँ, संबंधित देवता, पारंपरिक अनुष्ठान, जप और प्रार्थना, भोजन परंपरा, पर्यावरणीय विचार, और शास्त्रीय बनाम सांस्कृतिक रिवाज़ों का भेद।
            </p>
          }
        />
      </div>

      {/* The next festival, large, beside the recurring vratas */}
      <FestivalsOpening />

      {/* Festival Grid */}
      <section aria-labelledby="festivals-all-heading" className="relative z-10 mx-auto max-w-7xl px-gutter pb-20 pt-14">
        <SectionTitle
          id="festivals-all-heading"
          title="The festivals"
          titleHi="प्रमुख पर्व"
          sub={<span lang="hi" className="font-devanagari">हर पर्व का अर्थ, कथा, विधि और मंत्र।</span>}
        />

        {/* Interactive Parva-Chakra Filter & Search Explorer */}
        <div className="rounded-card border border-dharma-border/80 bg-dharma-card/85 p-4 sm:p-5 mb-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-dharma-saffron">
              <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span data-bi="en">Parva-Chakra Explorer</span>
              <span data-bi="sep" aria-hidden="true">·</span>
              <span lang="hi" data-bi="hi" className="font-devanagari">पर्व-चक्र अन्वेषक</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-dharma-border/75 bg-dharma-bg/70 px-3 py-1 text-xs font-semibold text-dharma-text tabular-nums">
                <span>{filteredFestivals.length} / {festivals.length}</span>
                <span lang="hi" data-bi="hi" className="font-devanagari font-normal text-dharma-muted">पर्व</span>
                <span data-bi="en-only" className="font-normal text-dharma-muted">festivals</span>
              </span>
              {isFiltered && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-dharma-saffron/45 bg-dharma-saffron/12 px-3.5 py-2 text-xs font-semibold text-dharma-saffron transition-colors hover:bg-dharma-saffron/20"
                >
                  <RotateCcw className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span lang="hi" data-bi="hi" className="font-devanagari">रीसेट करें</span>
                  <span data-bi="sep" aria-hidden="true">·</span>
                  <span data-bi="en">Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Live Search Input */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dharma-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="पर्व, संस्कृत नाम या देवता खोजें — दीपावली, शिवरात्रि, गीता… · Search festivals…"
              aria-label="पर्व खोजें · Search festivals"
              className="apple-field focus-ring !pl-10 !pr-11 text-sm"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="खोज हटाएँ · Clear search"
                className="focus-ring absolute right-0.5 top-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full text-dharma-muted transition-colors hover:bg-dharma-bg/80 hover:text-dharma-text"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div
            role="group"
            aria-label="पर्व श्रेणियाँ · Festival categories"
            className="flex flex-wrap items-center gap-2"
          >
            <button
              type="button"
              aria-pressed={selectedCategory === 'all'}
              onClick={() => setSelectedCategory('all')}
              className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-dharma-saffron text-dharma-bg shadow-sm'
                  : 'border border-dharma-border/80 bg-dharma-bg/65 text-dharma-text hover:border-dharma-saffron/50 hover:text-dharma-saffron'
              }`}
            >
              <span lang="hi" data-bi="hi" className="font-devanagari">सभी</span>
              <span data-bi="sep" aria-hidden="true">·</span>
              <span data-bi="en">All</span>
              <span className="tabular-nums opacity-85">({festivals.length})</span>
            </button>

            {UNIQUE_CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(active ? 'all' : category)}
                  className={`focus-ring inline-flex min-h-[44px] items-center rounded-full px-3.5 py-2 text-left text-xs font-medium transition-colors ${
                    active
                      ? 'bg-dharma-saffron font-semibold text-dharma-bg shadow-sm'
                      : 'border border-dharma-border/80 bg-dharma-bg/65 text-dharma-text hover:border-dharma-saffron/50 hover:text-dharma-saffron'
                  }`}
                >
                  <span lang="hi" data-bi="hi" className="font-devanagari">{category}</span>
                  <span data-bi="en-only">{CATEGORY_EN[category] ?? category}</span>
                </button>
              );
            })}
          </div>

          {/* Interactive Season / Masa & Ritual Aspect Lens Strip */}
          <div className="border-t border-dharma-border/60 pt-3">
            <div
              role="group"
              aria-label="ऋतु व मास चक्र · Season & ritual lens"
              className="flex flex-wrap items-center gap-2"
            >
              {PARVA_LENSES.map((lens) => {
                const active = selectedLens === lens.id;
                const lensCount = festivals.filter((f) => lens.match(f)).length;
                return (
                  <button
                    key={lens.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedLens(active && lens.id !== 'all' ? 'all' : lens.id)}
                    className={`focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                      active
                        ? 'border border-dharma-saffron/60 bg-dharma-saffron/15 font-semibold text-dharma-text'
                        : 'border border-dharma-border/70 bg-dharma-bg/45 font-medium text-dharma-muted hover:border-dharma-saffron/40 hover:text-dharma-text'
                    }`}
                  >
                    {lens.id === 'all' ? (
                      <>
                        <span lang="hi" data-bi="hi" className="font-devanagari">{lens.hi}</span>
                        <span data-bi="sep" aria-hidden="true">·</span>
                        <span data-bi="en">{lens.en}</span>
                      </>
                    ) : (
                      <>
                        <span lang="hi" data-bi="hi" className="font-devanagari">{lens.hi}</span>
                        <span data-bi="en-only">{lens.en}</span>
                      </>
                    )}
                    <span className="tabular-nums text-[11px] text-dharma-saffron">{lensCount}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {filteredFestivals.length} of {festivals.length} festivals shown.
        </p>

        {filteredFestivals.length === 0 ? (
          <div className="rounded-card border border-dharma-border/80 bg-dharma-card/85 p-8 text-center space-y-3">
            <p lang="hi" className="font-devanagari text-base font-semibold text-dharma-text">
              इस चयन से मेल खाता कोई पर्व नहीं मिला।
            </p>
            <p className="text-xs text-dharma-muted">
              No festivals matched your active search or season filters.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="focus-ring inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-dharma-saffron px-4 py-2 text-xs font-semibold text-dharma-bg transition-opacity hover:opacity-90"
            >
              <span lang="hi" data-bi="hi" className="font-devanagari">सभी पर्व दिखाएँ</span>
              <span data-bi="sep" aria-hidden="true">·</span>
              <span data-bi="en">Show all festivals</span>
            </button>
          </div>
        ) : (
          /* The cards cascade in as they scroll into view (.reveal-grid, motion.css); the HTML is never hidden. */
          <div className="reveal-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFestivals.map((festival) => (
              <div key={festival.id}>
                <Link
                  href={`/festivals/${festival.id}/`}
                  data-vt="open"
                  className="focus-ring card-sacred group block relative overflow-hidden rounded-card border border-dharma-border/80 bg-dharma-card/85 p-6 text-left shadow-raised hover:shadow-lifted hover:border-saffron-400/50 hover:-translate-y-0.5 transition-all h-full"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${festival.gradient}`} />
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${festival.gradient} flex items-center justify-center text-3xl shrink-0 shadow-md`}>
                      {festival.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition">{festival.name}</h3>
                      <p className="text-sm text-saffron-700 dark:text-saffron-400 font-semibold">{festival.sanskrit}</p>
                    </div>
                  </div>
                  <p className="text-sm text-dharma-muted leading-relaxed mb-4">{festival.shortDesc}</p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-dharma-border/60">
                    <span className="text-dharma-muted">{festival.category}</span>
                    <span className="font-semibold text-saffron-700 dark:text-saffron-400 group-hover:translate-x-1 transition-transform">
                      पूरा विवरण व मंत्र देखें &rarr;
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
