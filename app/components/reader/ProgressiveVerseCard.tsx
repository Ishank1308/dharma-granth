'use client';

import { useId, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Bookmark, Check, Copy, Volume2 } from 'lucide-react';

/** Content that is fetched only after the reader opens a deeper study tab. */
export interface VerseDeepLayers {
  vyakhya?: { text: string; language: 'hi' | 'en' };
  vigyan?: {
    text: string;
    language: 'hi' | 'en';
    concepts?: string[];
  };
  modernContext?: {
    example: string;
    language: 'hi' | 'en';
  };
}

/** Lightweight verse payload suitable for passing with a chapter response. */
export interface ProgressiveVerse {
  id: string;
  number: number | string;
  shloka: string;
  iast?: string;
  anvaya?: string;
  arth: {
    hindi?: string;
    english?: string;
  };
}

export interface ProgressiveVerseCardProps {
  verse: ProgressiveVerse;
  /** Called only when a deeper tab is first opened. Cache the result in the parent if desired. */
  loadDeepLayers?: () => Promise<VerseDeepLayers>;
  bookmarked?: boolean;
  onToggleBookmark?: () => void;
  onListen?: () => void;
}

/** Illustrative props for a local preview or Storybook story. */
export const SAMPLE_PROGRESSIVE_VERSE: ProgressiveVerse = {
  id: 'sample-verse-1',
  number: '1.1',
  shloka: 'धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः।',
  iast: 'dharmakṣetre kurukṣetre samavetā yuyutsavaḥ',
  anvaya: 'धर्मक्षेत्रे कुरुक्षेत्रे युयुत्सवः समवेताः।',
  arth: {
    hindi: 'यह उदाहरण पाठ है। वास्तविक श्लोक, अन्वय और अर्थ अपने सत्यापित ग्रंथ डेटा से दें।',
    english: 'This is placeholder copy. Supply the verified verse, anvaya, and meaning from your scripture data.',
  },
};

/** Example detail loader keeps commentary out of the initial chapter payload. */
export async function loadSampleVerseDeepLayers(): Promise<VerseDeepLayers> {
  return {
    vyakhya: { text: 'यह उदाहरण दार्शनिक व्याख्या है।', language: 'hi' },
    vigyan: { text: 'यह उदाहरण मनोवैज्ञानिक संदर्भ है।', language: 'hi', concepts: ['ध्यान', 'निर्णय'] },
    modernContext: { example: 'यह उदाहरण आधुनिक जीवन में प्रयोग दिखाने के लिए है।', language: 'hi' },
  };
}

type TabId = 'arth' | 'vyakhya' | 'vigyan' | 'modern';

const TAB_META: Array<{ id: TabId; hindi: string; english: string }> = [
  { id: 'arth', hindi: 'भावार्थ', english: 'Arth' },
  { id: 'vyakhya', hindi: 'दार्शनिक व्याख्या', english: 'Vyakhya' },
  { id: 'vigyan', hindi: 'चेतना विज्ञान', english: 'Vigyan' },
  { id: 'modern', hindi: 'व्यावहारिक जीवन', english: 'Modern Context' },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Example JSON payload:
 * {
 *   "id": "bhagavadgita-2-47", "number": "2.47",
 *   "shloka": "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
 *   "iast": "karmaṇy evādhikāras te mā phaleṣu kadācana",
 *   "anvaya": "ते कर्मणि एव अधिकारः, फलेषु कदाचन न।",
 *   "arth": { "hindi": "तुम्हारा अधिकार केवल कर्म करने में है...", "english": "Your right is to action alone..." }
 * }
 */
export function ProgressiveVerseCard({
  verse,
  loadDeepLayers,
  bookmarked = false,
  onToggleBookmark,
  onListen,
}: ProgressiveVerseCardProps) {
  const reduceMotion = useReducedMotion();
  const tabsId = useId();
  const [activeTab, setActiveTab] = useState<TabId>('arth');
  const [deepLayers, setDeepLayers] = useState<VerseDeepLayers | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);

  const selectTab = async (tab: TabId) => {
    setActiveTab(tab);
    if (tab === 'arth' || deepLayers || !loadDeepLayers || loading) return;
    setLoading(true);
    setLoadError(false);
    try {
      setDeepLayers(await loadDeepLayers());
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verse.shloka);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = -1;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % TAB_META.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + TAB_META.length) % TAB_META.length;
    if (event.key === 'ArrowDown') nextIndex = (index + 2) % TAB_META.length;
    if (event.key === 'ArrowUp') nextIndex = (index - 2 + TAB_META.length) % TAB_META.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = TAB_META.length - 1;
    if (nextIndex < 0) return;
    event.preventDefault();
    const next = TAB_META[nextIndex];
    void selectTab(next.id);
    document.getElementById(`${tabsId}-tab-${next.id}`)?.focus();
  };

  const panelMotion = reduceMotion
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -5 },
        transition: { duration: 0.2, ease: EASE },
      };

  return (
    <motion.article
      id={`verse-${verse.id}`}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={reduceMotion ? { duration: 0 } : { duration: 0.65, ease: EASE }}
      className="relative overflow-hidden rounded-[28px] border border-[#514238] bg-[#1A1614] text-[#E6D5B8] shadow-[0_18px_55px_rgba(0,0,0,0.28)]"
      aria-label={`श्लोक ${verse.number}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D97706]/70 to-transparent" aria-hidden="true" />
      <div className="p-5 sm:p-7 lg:p-8">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="font-devanagari text-xs font-semibold tracking-wide text-[#D97706]">श्लोक · Verse</p>
            <h2 className="mt-1 font-serif text-lg font-semibold text-[#F4E8D2]">{verse.number}</h2>
          </div>
          <div className="flex items-center gap-2" role="toolbar" aria-label="Verse actions">
            <button type="button" onClick={handleCopy} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#514238] text-[#D8C7AF] transition hover:border-[#D97706] hover:text-[#F3A53B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706]" aria-label={copied ? 'Copied Sanskrit verse' : 'Copy Sanskrit verse'} title={copied ? 'Copied' : 'Copy Sanskrit'}>
              {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            </button>
            <button type="button" onClick={onListen} disabled={!onListen} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#514238] text-[#D8C7AF] transition hover:border-[#D97706] hover:text-[#F3A53B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] disabled:cursor-not-allowed disabled:opacity-45" aria-label="Listen to verse" title={onListen ? 'Listen to verse' : 'Audio coming soon'}>
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={onToggleBookmark} disabled={!onToggleBookmark} aria-pressed={bookmarked} className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D97706] disabled:cursor-not-allowed disabled:opacity-45 ${bookmarked ? 'border-[#D97706] bg-[#D97706]/15 text-[#F3A53B]' : 'border-[#514238] text-[#D8C7AF] hover:border-[#D97706] hover:text-[#F3A53B]'}`} aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark verse'} title={bookmarked ? 'Bookmarked' : 'Bookmark'}>
              <Bookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="space-y-3 border-b border-[#514238]/80 pb-6 text-center">
          <p lang="sa" className="mx-auto max-w-4xl whitespace-pre-line font-devanagari text-2xl leading-[2.1] text-[#F4E8D2] sm:text-3xl sm:leading-[2.15]">
            {verse.shloka}
          </p>
          {verse.iast && <p lang="sa-Latn" className="mx-auto max-w-3xl font-serif text-sm italic leading-relaxed text-[#B8A894] sm:text-base">{verse.iast}</p>}
        </div>

        <div className="mt-6">
          <div role="tablist" aria-label="Verse study layers" aria-orientation="horizontal" className="-mx-1 grid grid-cols-2 gap-2 px-1 pb-2 sm:flex sm:flex-wrap">
            {TAB_META.map((tab, index) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`${tabsId}-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`${tabsId}-panel`}
                  tabIndex={selected ? 0 : -1}
                  aria-label={`${tab.hindi} / ${tab.english}`}
                  onClick={() => void selectTab(tab.id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`relative isolate flex min-h-[3.25rem] w-full flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-center text-[11px] font-semibold leading-tight transition-colors sm:min-h-10 sm:w-auto sm:flex-row sm:gap-1 sm:rounded-full sm:px-4 sm:text-sm ${selected ? 'text-[#1A1614]' : 'text-[#C8B8A4] hover:text-[#F4E8D2]'}`}
                >
                  {selected && <motion.span layoutId={`${tabsId}-active-pill`} className="absolute inset-0 -z-10 rounded-full bg-[#D97706]" transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 480, damping: 36 }} />}
                  <span lang="hi" className="font-devanagari">{tab.hindi}</span>
                  <span lang="en" className="font-serif text-[10px] font-medium sm:text-sm">{tab.english}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={activeTab}
              id={`${tabsId}-panel`}
              role="tabpanel"
              aria-labelledby={`${tabsId}-tab-${activeTab}`}
              tabIndex={0}
              {...panelMotion}
              className="mt-4 min-h-32 rounded-2xl border border-[#514238]/80 bg-[#0F0D0C]/70 p-4 sm:p-5"
            >
              {activeTab === 'arth' && (
                <div className="space-y-4">
                  {verse.anvaya && <div><h3 className="mb-1 font-devanagari text-xs font-bold text-[#D97706]">अन्वय · Anvaya</h3><p lang="sa" className="font-devanagari text-base leading-[2] text-[#D8C7AF]">{verse.anvaya}</p></div>}
                  {verse.arth.hindi && <p lang="hi" className="font-devanagari text-base leading-[2] text-[#F0E2CC] sm:text-lg">{verse.arth.hindi}</p>}
                  {verse.arth.english && <p lang="en" className="font-serif text-sm leading-relaxed text-[#C8B8A4] sm:text-base">{verse.arth.english}</p>}
                </div>
              )}

              {activeTab !== 'arth' && loading && <p className="text-sm text-[#B8A894]" role="status">अध्ययन सामग्री लोड हो रही है…</p>}
              {activeTab !== 'arth' && loadError && <p className="text-sm text-[#E6B8A0]" role="alert">यह सामग्री अभी उपलब्ध नहीं है। कृपया फिर प्रयास करें।</p>}
              {activeTab !== 'arth' && !loadDeepLayers && !deepLayers && !loading && <p className="text-sm text-[#B8A894]">इस अध्ययन खंड की सामग्री अभी उपलब्ध नहीं है।</p>}

              {activeTab === 'vyakhya' && !loading && deepLayers?.vyakhya && (
                <p lang={deepLayers.vyakhya.language} className={`${deepLayers.vyakhya.language === 'hi' ? 'font-devanagari leading-[2]' : 'font-serif leading-relaxed'} text-sm text-[#E6D5B8] sm:text-base`}>{deepLayers.vyakhya.text}</p>
              )}
              {activeTab === 'vigyan' && !loading && deepLayers?.vigyan && (
                <div className="space-y-4">
                  {deepLayers.vigyan.concepts && deepLayers.vigyan.concepts.length > 0 && <div className="flex flex-wrap gap-2">{deepLayers.vigyan.concepts.map((concept) => <span key={concept} className="rounded-full border border-[#D97706]/45 bg-[#D97706]/10 px-3 py-1 text-xs font-medium text-[#F3A53B]">{concept}</span>)}</div>}
                  <p lang={deepLayers.vigyan.language} className={`${deepLayers.vigyan.language === 'hi' ? 'font-devanagari leading-[2]' : 'font-serif leading-relaxed'} text-sm text-[#E6D5B8] sm:text-base`}>{deepLayers.vigyan.text}</p>
                </div>
              )}
              {activeTab === 'modern' && !loading && deepLayers?.modernContext && (
                <aside className="rounded-xl border-l-2 border-[#D97706] bg-[#D97706]/[0.07] p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-[#F3A53B]">जीवन में प्रयोग · In practice</p>
                  <p lang={deepLayers.modernContext.language} className={`${deepLayers.modernContext.language === 'hi' ? 'font-devanagari leading-[2]' : 'font-serif leading-relaxed'} text-sm text-[#E6D5B8] sm:text-base`}>{deepLayers.modernContext.example}</p>
                </aside>
              )}
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}
