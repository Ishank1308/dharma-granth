'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PageHeader } from '@/app/components/apple/PageHeader';
import { rituals, type Ritual } from '@/data/rituals';
import {
  X,
  BookOpen,
  Sparkles,
  MapPin,
  Lightbulb,
  HandHeart,
  AlertTriangle,
  ListChecks,
  Search,
  Share2,
  Check,
} from 'lucide-react';

type RitualCategory = 'all' | 'daily' | 'temple' | 'homa' | 'sacred-forms';

const CATEGORY_MAP: Record<string, Exclude<RitualCategory, 'all'>> = {
  puja: 'daily',
  arati: 'daily',
  prasada: 'daily',
  darshana: 'temple',
  abhisheka: 'temple',
  parikrama: 'temple',
  'temple-architecture': 'temple',
  'murti-puja': 'temple',
  homa: 'homa',
  samskara: 'homa',
  mantra: 'sacred-forms',
  mudra: 'sacred-forms',
  yantra: 'sacred-forms',
};

const CATEGORIES: Array<{ id: RitualCategory; labelHi: string; labelEn: string }> = [
  { id: 'all', labelHi: 'सभी अनुष्ठान', labelEn: 'All' },
  { id: 'daily', labelHi: 'दैनिक पूजा', labelEn: 'Daily Puja' },
  { id: 'temple', labelHi: 'मन्दिर व दर्शन', labelEn: 'Temple & Darshan' },
  { id: 'homa', labelHi: 'हवन व संस्कार', labelEn: 'Homa & Samskara' },
  { id: 'sacred-forms', labelHi: 'मन्त्र, मुद्रा व यन्त्र', labelEn: 'Sacred Forms' },
];

export default function RitualsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [category, setCategory] = useState<RitualCategory>('all');
  const [query, setQuery] = useState('');

  // Support shareable ?ritual=<id> or #<id> links on client mount without breaking static export
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get('ritual');
      const fromHash = window.location.hash.replace(/^#/, '');
      const candidate = fromQuery || fromHash;
      if (candidate && rituals.some((r) => r.id === candidate)) {
        setSelectedId(candidate);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSelectRitual = (id: string | null) => {
    setSelectedId(id);
    try {
      const url = new URL(window.location.href);
      if (id) url.searchParams.set('ritual', id);
      else url.searchParams.delete('ritual');
      window.history.replaceState(null, '', url.toString());
    } catch {
      // ignore
    }
  };

  const filteredRituals = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rituals.filter((r) => {
      if (category !== 'all') {
        const cat = CATEGORY_MAP[r.id] ?? 'daily';
        if (cat !== category) return false;
      }
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.sanskrit.toLowerCase().includes(q) ||
        r.transliteration.toLowerCase().includes(q) ||
        r.shortDesc.toLowerCase().includes(q) ||
        r.meaning.toLowerCase().includes(q)
      );
    });
  }, [category, query]);

  const selected = rituals.find((r) => r.id === selectedId) ?? null;

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text">
      <PageHeader
        eyebrow="Āgama & Saṃskāra"
        eyebrowHi="आगम एवं संस्कार"
        title="Temple & Ritual Explainer"
        titleHi="मंदिर एवं अनुष्ठान विवरण"
        width="wide"
        lead={
          <>
            <span lang="hi" className="font-devanagari block">
              {rituals.length} प्रमुख वैदिक व मन्दिर अनुष्ठानों का सरल शास्त्रीय परिचय — पूजा, आरती, अभिषेक, दर्शन, होम, संस्कार, मन्त्र, मुद्रा, यन्त्र और परिक्रमा का अर्थ, प्रतीकवाद तथा व्यावहारिक शिष्टाचार।
            </span>
            <span className="mt-1.5 block text-subhead">
              Clear explanations of {rituals.length} core Hindu temple and household practices — their scriptural roots, symbolism, regional diversity, etiquette, and initiation guidance.
            </span>
          </>
        }
      />

      {/* Featured Upakarma Deep-Dive Guide */}
      <section className="mx-auto max-w-7xl px-gutter pt-4 pb-6">
        <Link
          href="/rituals/upakarma/"
          className="apple-card group block rounded-card border border-saffron-500/35 bg-gradient-to-r from-amber-500/10 via-saffron-500/5 to-dharma-card p-5 sm:p-6 shadow-xs hover:border-saffron-500 transition-all"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-500/15 text-saffron-800 dark:text-saffron-300 font-semibold text-xs">
                विशेष वैदिक दर्शिका · Featured Vedic Manual
              </span>
              <h2 className="text-title-3 font-serif font-bold text-dharma-text group-hover:text-dharma-saffron transition">
                श्रावणी उपाकर्म एवं यज्ञोपवीत संस्कार विधान (Upakarma Guide)
              </h2>
              <p lang="hi" className="font-devanagari text-xs sm:text-sm text-dharma-muted max-w-2xl leading-relaxed">
                कामोऽकार्षीत् प्रायश्चित्त जप (108 आवर्तन), ब्रह्म-यज्ञ, नूतन जनेऊ धारण-विसर्जन मन्त्र और 9 तन्तुओं का रहस्य।
              </p>
            </div>
            <div className="shrink-0 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-saffron-500/30 bg-saffron-500/10 px-4 py-2 text-xs font-bold text-saffron-800 dark:text-saffron-300 group-hover:translate-x-0.5 transition-transform">
              <span>सम्पूर्ण विधान देखें</span>
              <span aria-hidden="true">&rarr;</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Search & Category Filter Bar */}
      <section aria-label="अनुष्ठान खोज व श्रेणी" className="mx-auto max-w-7xl px-gutter pb-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(cat.id)}
                  className={`focus-ring inline-flex min-h-[44px] shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    active
                      ? 'border-saffron-600 bg-dharma-saffron text-dharma-bg shadow-xs'
                      : 'border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-400 hover:text-dharma-text'
                  }`}
                >
                  <span lang="hi" className="font-devanagari">{cat.labelHi}</span>
                  <span aria-hidden="true" className="opacity-60">·</span>
                  <span>{cat.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dharma-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="पूजा, आरती, हवन खोजें…"
              aria-label="अनुष्ठान खोजें (Search rituals)"
              className="focus-ring min-h-[44px] w-full rounded-full border border-dharma-border bg-dharma-card pl-10 pr-9 py-2 text-sm text-dharma-text placeholder:text-dharma-muted"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="खोज साफ़ करें"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Ritual Grid */}
      <section className="mx-auto max-w-7xl px-gutter pb-20">
        {filteredRituals.length === 0 ? (
          <div className="rounded-card border border-dharma-border bg-dharma-card p-8 text-center">
            <p lang="hi" className="font-devanagari text-base font-semibold text-dharma-text">
              इस खोज से मेल खाता कोई अनुष्ठान नहीं मिला।
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setCategory('all');
              }}
              className="mt-3 inline-flex min-h-[44px] items-center rounded-full border border-dharma-border bg-dharma-bg px-4 py-2 text-xs font-semibold text-dharma-saffron hover:underline"
            >
              सभी {rituals.length} अनुष्ठान दिखाएँ
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRituals.map((ritual, i) => (
              <button
                type="button"
                key={ritual.id}
                onClick={() => handleSelectRitual(ritual.id)}
                style={{ animationDelay: `${Math.min(i, 12) * 35}ms` }}
                className="fade-up-in apple-card group relative flex flex-col justify-between overflow-hidden rounded-card border border-dharma-border bg-dharma-card p-6 text-left hover:border-saffron-500/50 hover:shadow-raised transition-all"
              >
                <div>
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${ritual.gradient}`} />
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={`w-13 h-13 min-w-[52px] min-h-[52px] rounded-2xl bg-gradient-to-br ${ritual.gradient} flex items-center justify-center text-2xl shrink-0 shadow-xs`}
                      aria-hidden="true"
                    >
                      {ritual.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-dharma-saffron transition">
                        {ritual.name}
                      </h3>
                      <p lang="hi" className="font-devanagari text-sm text-saffron-700 dark:text-saffron-300 font-semibold">
                        {ritual.sanskrit}
                      </p>
                    </div>
                  </div>
                  <p lang="hi" className="font-devanagari text-sm text-dharma-muted leading-relaxed mb-4">
                    {ritual.shortDesc}
                  </p>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-dharma-border/60">
                  {ritual.requiresInitiation && (
                    <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-200 bg-amber-500/10 border border-amber-500/30 rounded-lg px-2.5 py-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                      <span className="font-semibold">दीक्षा/निर्देशन आवश्यक</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="italic text-dharma-muted">{ritual.transliteration}</span>
                    <span className="font-semibold text-saffron-700 dark:text-saffron-300 group-hover:translate-x-1 transition-transform">
                      विवरण देखें &rarr;
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Accessible Detail Modal */}
      <AnimatePresence>
        {selected && <RitualDetail ritual={selected} onClose={() => handleSelectRitual(null)} />}
      </AnimatePresence>
    </main>
  );
}

function RitualDetail({ ritual, onClose }: { ritual: Ritual; onClose: () => void }) {
  const reduce = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const prevActive = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => closeBtnRef.current?.focus(), 40);

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
      prevActive?.focus?.();
    };
  }, [onClose]);

  const handleCopyLink = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('ritual', ritual.id);
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ritual-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.24 }}
        className="bg-dharma-bg text-dharma-text rounded-3xl shadow-2xl border border-dharma-border max-w-3xl w-full max-h-[90dvh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Modal Header */}
        <div className={`relative shrink-0 bg-gradient-to-br ${ritual.gradient} text-white px-5 py-5 sm:px-6`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4 min-w-0">
              <div className="text-4xl sm:text-5xl shrink-0" aria-hidden="true">
                {ritual.icon}
              </div>
              <div className="min-w-0">
                <h2 id="ritual-dialog-title" className="text-xl sm:text-2xl font-serif font-bold">
                  {ritual.name}
                </h2>
                <p lang="hi" className="font-devanagari text-base sm:text-lg opacity-95">
                  {ritual.sanskrit}
                </p>
                <p className="text-xs sm:text-sm opacity-80 italic mt-0.5">{ritual.transliteration}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="अनुष्ठान लिंक कॉपी करें (Copy link)"
                title="लिंक कॉपी करें"
                className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/20 text-white/90 hover:bg-black/30 hover:text-white transition"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              </button>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="विवरण बंद करें (Close ritual details)"
                className="focus-ring inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/20 text-white/90 hover:bg-black/30 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* Initiation Warning */}
          {ritual.requiresInitiation && ritual.initiationWarning && (
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/35 rounded-2xl p-4">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase mb-1">
                  चेतावनी: दीक्षा/निर्देशन आवश्यक (Initiation Guidance)
                </p>
                <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
                  {ritual.initiationWarning}
                </p>
              </div>
            </div>
          )}

          <Section icon={Sparkles} title="अर्थ (Meaning)">
            <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
              {ritual.meaning}
            </p>
          </Section>

          <Section icon={BookOpen} title="शास्त्रीय एवं पारंपरिक आधार (Scriptural Basis)">
            <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
              {ritual.scripturalBasis}
            </p>
          </Section>

          <Section icon={Lightbulb} title="प्रतीकवाद (Symbolism)">
            <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
              {ritual.symbolism}
            </p>
          </Section>

          <Section icon={MapPin} title="क्षेत्रीय विविधता (Regional Variations)">
            <div className="grid sm:grid-cols-2 gap-3">
              {ritual.regionalVariations.map((rv, i) => (
                <div key={i} className="bg-dharma-card border border-dharma-border rounded-xl p-3.5">
                  <p lang="hi" className="font-devanagari text-xs font-bold text-saffron-700 dark:text-saffron-300 mb-1">
                    {rv.region}
                  </p>
                  <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
                    {rv.variation}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Sparkles} title="दार्शनिक व्याख्या (Philosophical Interpretation)">
            <p lang="hi" className="font-devanagari text-sm text-dharma-text leading-relaxed">
              {ritual.philosophicalInterpretation}
            </p>
          </Section>

          <Section icon={HandHeart} title="व्यावहारिक शिष्टाचार (Practical Etiquette)">
            <ul className="space-y-2">
              {ritual.practicalEtiquette.map((item, i) => (
                <li key={i} lang="hi" className="font-devanagari text-sm text-dharma-text flex items-start gap-2.5">
                  <span className="text-dharma-saffron shrink-0 mt-0.5" aria-hidden="true">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {ritual.steps && ritual.steps.length > 0 && (
            <Section icon={ListChecks} title="विधि चरण (Steps)">
              <ol className="space-y-2.5">
                {ritual.steps.map((step, i) => (
                  <li key={i} lang="hi" className="font-devanagari text-sm text-dharma-text flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-saffron-500/15 text-saffron-800 dark:text-saffron-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Section>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ icon: Icon, title, children }: { icon: typeof BookOpen; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-dharma-border/70 bg-dharma-card/50 p-4">
      <h3 className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-dharma-saffron" aria-hidden="true" />
        <span>{title}</span>
      </h3>
      {children}
    </section>
  );
}
