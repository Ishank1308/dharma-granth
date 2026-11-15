'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface ShowcaseScripture {
  id: string;
  titleSa: string;
  titleEn: string;
  categoryTag: string;
  tradition: 'Śruti' | 'Smṛti' | 'Darśana' | 'Itihāsa';
  metrics: string;
  essenceQuote: string;
  essenceMeaning: string;
  colour: string;
  href: string;
}

const CATEGORY_TABS = [
  { id: 'featured', labelHi: 'प्रमुख ग्रन्थ', labelEn: 'Classics' },
  { id: 'upanishad', labelHi: 'उपनिषद्', labelEn: 'Upanishads' },
  { id: 'veda', labelHi: 'वेद संहिता', labelEn: 'Four Vedas' },
  { id: 'darshana', labelHi: 'गीता व दर्शन', labelEn: 'Philosophy' },
  { id: 'itihasa', labelHi: 'इतिहास व काव्‍य', labelEn: 'Itihāsa' },
  { id: 'purana', labelHi: 'पुराण', labelEn: 'Purāṇas' },
] as const;

type TabId = (typeof CATEGORY_TABS)[number]['id'];

const SHOWCASE_ITEMS: Record<TabId, ShowcaseScripture[]> = {
  featured: [
    {
      id: 'bhagavadgita',
      titleSa: 'श्रीमद्भगवद्गीता',
      titleEn: 'Bhagavad Gita',
      categoryTag: 'गीता',
      tradition: 'Smṛti',
      metrics: '18 अध्याय · 701 श्लोक',
      essenceQuote: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।',
      essenceMeaning: 'अधिकार केवल निष्काम कर्म में है, फल में कभी नहीं।',
      colour: '#c2410c',
      href: '/scripture/bhagavadgita/',
    },
    {
      id: 'ishavasya',
      titleSa: 'ईशावास्योपनिषद्',
      titleEn: 'Isha Upanishad',
      categoryTag: 'उपनिषद्',
      tradition: 'Śruti',
      metrics: '1 अध्याय · 18 मन्त्र',
      essenceQuote: 'ईशा वास्यमिदं सर्वं यत्किञ्च जगत्यां जगत् ।',
      essenceMeaning: 'इस सम्पूर्ण चराचर जगत् में जो कुछ भी है, वह सब ईश्वर से व्याप्त है।',
      colour: '#8a6a3c',
      href: '/scripture/ishavasya/',
    },
    {
      id: 'rigveda',
      titleSa: 'ऋग्वेद संहिता',
      titleEn: 'Rigveda',
      categoryTag: 'वेद',
      tradition: 'Śruti',
      metrics: '10 मण्डल · 1028 सूक्त',
      essenceQuote: 'एकं सद्विप्रा बहुधा वदन्ति ।',
      essenceMeaning: 'परमसत्य एक ही है, ज्ञानी जन उसे विभिन्न नामों से पुकारते हैं।',
      colour: '#2f6f5e',
      href: '/scripture/rigveda/',
    },
    {
      id: 'ramayana',
      titleSa: 'वाल्मीकि रामायण',
      titleEn: 'Valmiki Ramayana',
      categoryTag: 'इतिहास',
      tradition: 'Itihāsa',
      metrics: '7 काण्ड · 24000 श्लोक',
      essenceQuote: 'रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः ।',
      essenceMeaning: 'श्रीराम साक्षात् मूर्तिमान् धर्म हैं, साधु पुरुष और सत्य-पराक्रमी हैं।',
      colour: '#1f4e8c',
      href: '/scripture/ramayana/',
    },
    {
      id: 'yogasutra',
      titleSa: 'पातञ्जल योगसूत्र',
      titleEn: 'Patanjali Yoga Sutras',
      categoryTag: 'दर्शन',
      tradition: 'Darśana',
      metrics: '4 पाद · 195 सूत्र',
      essenceQuote: 'योगश्चित्तवृत्तिनिरोधः ।',
      essenceMeaning: 'चित्त की वृत्तियों का पूर्ण निरोध व शान्ति ही योग है।',
      colour: '#0d9488',
      href: '/scripture/yogasutra/',
    },
    {
      id: 'bhagavatapurana',
      titleSa: 'श्रीमद्भागवत पुराण',
      titleEn: 'Bhagavata Purana',
      categoryTag: 'पुराण',
      tradition: 'Smṛti',
      metrics: '12 स्कन्ध · 335 अध्याय',
      essenceQuote: 'सत्यं परं धीमहि ।',
      essenceMeaning: 'हम परम सत्यस्वरूप परमेश्वर का ध्यान करते हैं।',
      colour: '#6b3fa0',
      href: '/scripture/bhagavatapurana/',
    },
  ],
  upanishad: [
    {
      id: 'ishavasya',
      titleSa: 'ईशावास्योपनिषद्',
      titleEn: 'Isha Upanishad',
      categoryTag: 'शुक्ल यजुर्वेद',
      tradition: 'Śruti',
      metrics: '1 अध्याय · 18 मन्त्र',
      essenceQuote: 'तेन त्यक्तेन भुञ्जीथा मा गृधः कस्यस्विद्धनम् ।',
      essenceMeaning: 'त्यागभाव से भोग करो, किसी के धन की लालसा मत करो।',
      colour: '#8a6a3c',
      href: '/scripture/ishavasya/',
    },
    {
      id: 'katha',
      titleSa: 'कठोपनिषद्',
      titleEn: 'Katha Upanishad',
      categoryTag: 'कृष्ण यजुर्वेद',
      tradition: 'Śruti',
      metrics: '2 अध्याय · 119 मन्त्र',
      essenceQuote: 'उत्तिष्ठत जाग्रत प्राप्य वरान्निबोधत ।',
      essenceMeaning: 'उठो! जागो! और श्रेष्ठ आत्मज्ञानी महापुरुषों के सान्निध्य से बोध प्राप्त करो।',
      colour: '#b45309',
      href: '/scripture/katha/',
    },
    {
      id: 'mundaka',
      titleSa: 'मुण्डकोपनिषद्',
      titleEn: 'Mundaka Upanishad',
      categoryTag: 'अथर्ववेद',
      tradition: 'Śruti',
      metrics: '3 मुण्डक · 64 मन्त्र',
      essenceQuote: 'सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः ।',
      essenceMeaning: 'सत्य की ही जय होती है, असत्य की नहीं।',
      colour: '#0369a1',
      href: '/scripture/mundaka/',
    },
    {
      id: 'mandukya',
      titleSa: 'माण्डूक्योपनिषद्',
      titleEn: 'Mandukya Upanishad',
      categoryTag: 'अथर्ववेद',
      tradition: 'Śruti',
      metrics: '12 मन्त्र · ओंकार रहस्य',
      essenceQuote: 'सर्वं ह्येतद् ब्रह्म अयमात्मा ब्रह्म ।',
      essenceMeaning: 'यह सब कुछ ब्रह्म है, और यह आत्मा ही साक्षात् ब्रह्म है।',
      colour: '#4338ca',
      href: '/scripture/mandukya/',
    },
    {
      id: 'kena',
      titleSa: 'केनोपनिषद्',
      titleEn: 'Kena Upanishad',
      categoryTag: 'सामवेद',
      tradition: 'Śruti',
      metrics: '4 खण्ड · 35 मन्त्र',
      essenceQuote: 'केनेषितं पतति प्रेषितं मनः ।',
      essenceMeaning: 'किसकी प्रेरणा से यह मन अपने विषयों की ओर प्रेरित होकर दौड़ता है?',
      colour: '#0f766e',
      href: '/scripture/kena/',
    },
    {
      id: 'chandogya',
      titleSa: 'छान्दोग्योपनिषद्',
      titleEn: 'Chandogya Upanishad',
      categoryTag: 'सामवेद',
      tradition: 'Śruti',
      metrics: '8 प्रपाठक · महावाक्य',
      essenceQuote: 'तत्त्वमसि श्वेतकेतो ।',
      essenceMeaning: 'हे श्वेतकेतु! वह परमतत्त्व तुम ही हो।',
      colour: '#7e22ce',
      href: '/scripture/chandogya/',
    },
  ],
  veda: [
    {
      id: 'rigveda',
      titleSa: 'ऋग्वेद संहिता',
      titleEn: 'Rigveda Samhita',
      categoryTag: 'आदिम ज्ञान',
      tradition: 'Śruti',
      metrics: '10 मण्डल · 1028 सूक्त',
      essenceQuote: 'संगच्छध्वं संवदध्वं सं वो मनांसि जानताम् ।',
      essenceMeaning: 'साथ चलो, साथ मिलकर बोलो, तुम्हारे मनों में एकमत समन्वय हो।',
      colour: '#2f6f5e',
      href: '/scripture/rigveda/',
    },
    {
      id: 'samaveda',
      titleSa: 'सामवेद संहिता',
      titleEn: 'Samaveda Samhita',
      categoryTag: 'गान व नाद',
      tradition: 'Śruti',
      metrics: '2 आर्चिक · 1875 मन्त्र',
      essenceQuote: 'अग्न आयाहि वीतये गृणानो हव्यदातये ।',
      essenceMeaning: 'हे प्रकाशमान देव! हवि ग्रहण करने और ज्ञान का विस्तार करने पधारें।',
      colour: '#0891b2',
      href: '/scripture/samaveda/',
    },
    {
      id: 'yajurveda',
      titleSa: 'यजुर्वेद संहिता',
      titleEn: 'Yajurveda Samhita',
      categoryTag: 'यज्ञ व कर्म',
      tradition: 'Śruti',
      metrics: '40 अध्याय · 1975 मन्त्र',
      essenceQuote: 'मित्रस्य मा चक्षुषा सर्वाणि भूतानि समीक्षन्ताम् ।',
      essenceMeaning: 'संसार के समस्त प्राणी मुझे मित्र की दृष्टि से देखें और मैं सबको मित्र मानूं।',
      colour: '#d97706',
      href: '/scripture/yajurveda/',
    },
    {
      id: 'atharvaveda',
      titleSa: 'अथर्ववेद संहिता',
      titleEn: 'Atharvaveda Samhita',
      categoryTag: 'जीवन व शान्ति',
      tradition: 'Śruti',
      metrics: '20 काण्ड · 730 सूक्त',
      essenceQuote: 'माता भूमिः पुत्रोऽहं पृथिव्याः ।',
      essenceMeaning: 'यह पवित्र भूमि मेरी माता है और मैं इस पृथ्वी का पुत्र हूं।',
      colour: '#7c2d12',
      href: '/scripture/atharvaveda/',
    },
  ],
  darshana: [
    {
      id: 'bhagavadgita',
      titleSa: 'श्रीमद्भगवद्गीता',
      titleEn: 'Bhagavad Gita',
      categoryTag: 'योगशास्त्र',
      tradition: 'Smṛti',
      metrics: '18 अध्याय · 701 श्लोक',
      essenceQuote: 'योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।',
      essenceMeaning: 'आसक्ति छोड़कर समत्व योग में स्थिर होकर अपने कर्तव्य कर्म करो।',
      colour: '#c2410c',
      href: '/scripture/bhagavadgita/',
    },
    {
      id: 'yogasutra',
      titleSa: 'पातञ्जल योगसूत्र',
      titleEn: 'Patanjali Yoga Sutras',
      categoryTag: 'राजयोग',
      tradition: 'Darśana',
      metrics: '4 पाद · 195 सूत्र',
      essenceQuote: 'तदा द्रष्टुः स्वरूपेऽवस्थानम् ।',
      essenceMeaning: 'तब दृष्टा (आत्मा) अपने विशुद्ध स्वरूप में प्रतिष्ठित हो जाता है।',
      colour: '#0d9488',
      href: '/scripture/yogasutra/',
    },
    {
      id: 'vivekchudamani',
      titleSa: 'विवेकचूड़ामणि',
      titleEn: 'Vivekachudamani',
      categoryTag: 'अद्वैत वेदान्त',
      tradition: 'Darśana',
      metrics: 'शंकराचार्य विरचित · 580 श्लोक',
      essenceQuote: 'ब्रह्म सत्यं जगन्मिथ्या जीवो ब्रह्मैव नापरः ।',
      essenceMeaning: 'ब्रह्म ही एकमात्र सनातन सत्य है, और जीवात्मा साक्षात् ब्रह्म ही है।',
      colour: '#9333ea',
      href: '/scripture/vivekchudamani/',
    },
    {
      id: 'brahmasutra',
      titleSa: 'ब्रह्मसूत्र',
      titleEn: 'Brahma Sutras',
      categoryTag: 'वेदान्त दर्शन',
      tradition: 'Darśana',
      metrics: '4 अध्याय · 555 सूत्र',
      essenceQuote: 'अथातो ब्रह्मजिज्ञासा ।',
      essenceMeaning: 'अब इसके उपरान्त परम ब्रह्म को जानने की जिज्ञासा की जाती है।',
      colour: '#4f46e5',
      href: '/scripture/brahmasutra/',
    },
  ],
  itihasa: [
    {
      id: 'ramayana',
      titleSa: 'वाल्मीकि रामायण',
      titleEn: 'Valmiki Ramayana',
      categoryTag: 'आदिकाव्य',
      tradition: 'Itihāsa',
      metrics: '7 काण्ड · 24000 श्लोक',
      essenceQuote: 'जननी जन्मभूमिश्च स्वर्गादपि गरीयसी ।',
      essenceMeaning: 'माता और जन्मभूमि स्वर्ग से भी अधिक महान और पूज्य हैं।',
      colour: '#1f4e8c',
      href: '/scripture/ramayana/',
    },
    {
      id: 'mahabharata',
      titleSa: 'महाभारत',
      titleEn: 'Mahabharata',
      categoryTag: 'इतिहास',
      tradition: 'Itihāsa',
      metrics: '18 पर्व · 100000+ श्लोक',
      essenceQuote: 'यतो धर्मस्ततो जयः ।',
      essenceMeaning: 'जहां धर्म है, वहीं वास्तविक विजय है।',
      colour: '#334155',
      href: '/scripture/mahabharata/',
    },
    {
      id: 'ramcharitmanas',
      titleSa: 'श्रीरामचरितमानस',
      titleEn: 'Ramcharitmanas',
      categoryTag: 'भक्ति काव्य',
      tradition: 'Smṛti',
      metrics: '7 काण्ड · गोस्वामी तुलसीदास',
      essenceQuote: 'परहित सरिस धर्म नहिं भाई ।',
      essenceMeaning: 'दूसरों की भलाई करने के समान कोई दूसरा श्रेष्ठ धर्म नहीं है।',
      colour: '#ea580c',
      href: '/scripture/ramcharitmanas/',
    },
  ],
  purana: [
    {
      id: 'bhagavatapurana',
      titleSa: 'श्रीमद्भागवत महापुराण',
      titleEn: 'Bhagavata Purana',
      categoryTag: 'महापुराण',
      tradition: 'Smṛti',
      metrics: '12 स्कन्ध · 335 अध्याय',
      essenceQuote: 'धर्मः प्रोज्झितकैतवोऽत्र परमो निर्मत्सराणां सताम् ।',
      essenceMeaning: 'यहां निष्कपट परम धर्म का प्रतिपादन है जो मत्सर-रहित सज्जनों के लिए है।',
      colour: '#6b3fa0',
      href: '/scripture/bhagavatapurana/',
    },
    {
      id: 'vishnupurana',
      titleSa: 'विष्णु पुराण',
      titleEn: 'Vishnu Purana',
      categoryTag: 'महापुराण',
      tradition: 'Smṛti',
      metrics: '6 अंश · 126 अध्याय',
      essenceQuote: 'सा विद्या या विमुक्तये ।',
      essenceMeaning: 'वास्तविक विद्या वही है जो मनुष्य को समस्त बंधनों से मुक्त करे।',
      colour: '#2563eb',
      href: '/scripture/vishnupurana/',
    },
    {
      id: 'shivpurana',
      titleSa: 'शिव पुराण',
      titleEn: 'Shiva Purana',
      categoryTag: 'महापुराण',
      tradition: 'Smṛti',
      metrics: '7 संहिताएं · रुद्र महिमा',
      essenceQuote: 'शिवमेव प्रपद्यन्ते मुक्ता भवन्ति बन्धनात् ।',
      essenceMeaning: 'कल्याणकारी शिव की शरण में जाने से जीव भव-बंधन से मुक्त हो जाता है।',
      colour: '#475569',
      href: '/scripture/shivpurana/',
    },
  ],
};

export function HomeScriptureTabs() {
  const [activeTab, setActiveTab] = useState<TabId>('featured');
  const tabsId = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = CATEGORY_TABS.length - 1;
    let next: number;
    switch (event.key) {
      case 'ArrowLeft': next = index === 0 ? last : index - 1; break;
      case 'ArrowRight': next = index === last ? 0 : index + 1; break;
      case 'Home': next = 0; break;
      case 'End': next = last; break;
      default: return;
    }
    event.preventDefault();
    setActiveTab(CATEGORY_TABS[next].id);
    tabs.current[next]?.focus({ preventScroll: true });
    tabs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };

  const currentItems = SHOWCASE_ITEMS[activeTab];

  return (
    <div className="w-full">
      <div
        role="tablist"
        aria-label="ग्रन्थ श्रेणियां · Scripture Categories"
        className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 scrollbar-none sm:flex-wrap sm:justify-center"
      >
        {CATEGORY_TABS.map((tab, index) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(element) => { tabs.current[index] = element; }}
              id={`${tabsId}-${tab.id}`}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`${tabsId}-panel`}
              tabIndex={isSelected ? 0 : -1}
              onKeyDown={(event) => handleTabKey(event, index)}
              onClick={() => {
                if (isSelected) return;
                triggerTactileFeedback('selection', 'softTap');
                setActiveTab(tab.id);
              }}
              className={`library-category-tab focus-ring relative isolate inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold ${
                isSelected
                  ? 'border-dharma-saffron text-dharma-text'
                  : 'border-dharma-border/80 bg-dharma-card/80 text-dharma-muted hover:border-dharma-saffron/40 hover:text-dharma-text'
              }`}
            >
              {isSelected && (
                // A CSS pop-in (colour.css), not a framer-motion layout animation: framer was the
                // only thing that made the home page load its 42 KB library.
                <span
                  aria-hidden="true"
                  className="library-category-indicator pointer-events-none absolute inset-0 -z-10 rounded-full"
                />
              )}
              <span lang="hi" className="font-devanagari text-sm">
                {tab.labelHi}
              </span>
              <span className="text-[11px] font-normal">({tab.labelEn})</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${tabsId}-panel`}
        role="tabpanel"
        aria-labelledby={`${tabsId}-${activeTab}`}
        data-library-category={activeTab}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {currentItems.map((book) => (
          <article
            key={`${activeTab}-${book.id}`}
            className="library-showcase-book group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-dharma-border/80 bg-dharma-card/90 p-5 shadow-raised backdrop-blur-xs transition-all hover:border-dharma-saffron/40 hover:shadow-hover sm:p-6"
            style={{ borderLeftWidth: '5px', borderLeftColor: book.colour }}
          >
            {/* Top row: Tags & Tradition */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-md bg-dharma-bg px-2 py-0.5 text-xs font-medium text-dharma-muted border border-dharma-border/60">
                  {book.categoryTag}
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-dharma-saffron">
                  {book.tradition}
                </span>
              </div>

              {/* Title Header */}
              <div className="mt-3.5">
                <h3 lang="sa" className="font-devanagari text-2xl font-bold tracking-tight text-dharma-text sm:text-[26px]">
                  {book.titleSa}
                </h3>
                <p className="text-xs font-medium text-dharma-muted">
                  {book.titleEn} · <span className="tabular-nums font-sans">{book.metrics}</span>
                </p>
              </div>

              {/* Mahāvākya / Essence Preview */}
              <div className="mt-4 rounded-xl border border-dharma-border/50 bg-dharma-bg/60 p-3">
                <p lang="sa" className="font-devanagari text-sm font-medium text-dharma-saffron/90 leading-relaxed">
                  « {book.essenceQuote} »
                </p>
                <p lang="hi" className="mt-1 font-devanagari text-xs text-dharma-muted leading-relaxed">
                  {book.essenceMeaning}
                </p>
              </div>
            </div>

            {/* Bottom: Read Action */}
            <div className="mt-5 pt-3 border-t border-dharma-border/50">
              <Link
                href={book.href}
                className="library-showcase-link chevron-nudge flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-xl border border-dharma-border bg-dharma-bg/80 py-2.5 text-xs font-semibold text-dharma-text transition-all group-hover:border-dharma-saffron/50 group-hover:bg-dharma-saffron/10 group-hover:text-dharma-saffron focus-ring"
              >
                <span>अध्ययन आरम्भ करें</span>
                <span aria-hidden="true">· Read ›</span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

