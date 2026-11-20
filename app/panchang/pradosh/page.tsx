import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';
import { PanchangLimbSwitcher } from '@/app/panchang/components/PanchangLimbSwitcher';
import { JsonLd } from '@/app/components/JsonLd';
import { BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'प्रदोष व्रत तिथियाँ 2026–2028 · Pradosh Vrat Dates & Shiva Mahatmya',
  description:
    'वर्ष 2026, 2027 एवं 2028 की समस्त प्रदोष व्रत तिथियाँ, प्रदोष काल समय, शिव पुराण के अनुसार व्रत विधि, मंत्र एवं महात्म्य।',
  keywords: [
    'प्रदोष व्रत',
    'Pradosh Vrat dates 2026',
    'Pradosh dates 2027',
    'सोम प्रदोष',
    'भौम प्रदोष',
    'शनि प्रदोष',
    'प्रदोष काल मुहूर्त',
    'Shiva Purana Pradosh',
    'Dharma Granth Panchang',
  ],
  alternates: { canonical: '/panchang/pradosh/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'प्रदोष व्रत तिथियाँ 2026–2028 · Pradosh Vrat Dates & Shiva Mahatmya — Dharma Granth',
    description:
      'त्रयोदशी तिथि पर पड़ने वाले प्रदोष व्रत की तिथियाँ, प्रदोष काल समय, शिव पुराण के अनुसार व्रत विधि, मंत्र एवं महात्म्य।',
    url: 'https://dharmagranth.dev/panchang/pradosh/',
  },
};

const PRADOSH_DATES = [
  { name: 'मार्गशीर्ष कृष्ण प्रदोष (शनि प्रदोष)', paksha: 'कृष्ण पक्ष', day: 'शनिवार', date: '07 दिसंबर 2026', dateEn: '2026-12-07', type: 'शनि प्रदोष' },
  { name: 'मार्गशीर्ष शुक्ल प्रदोष (सोम प्रदोष)', paksha: 'शुक्ल पक्ष', day: 'सोमवार', date: '21 दिसंबर 2026', dateEn: '2026-12-21', type: 'सोम प्रदोष' },
  { name: 'पौष कृष्ण प्रदोष (बुध प्रदोष)', paksha: 'कृष्ण पक्ष', day: 'बुधवार', date: '06 जनवरी 2027', dateEn: '2027-01-06' },
  { name: 'पौष शुक्ल प्रदोष (बुध प्रदोष)', paksha: 'शुक्ल पक्ष', day: 'बुधवार', date: '20 जनवरी 2027', dateEn: '2027-01-20' },
  { name: 'माघ कृष्ण प्रदोष (गुरु प्रदोष)', paksha: 'कृष्ण पक्ष', day: 'गुरुवार', date: '04 फरवरी 2027', dateEn: '2027-02-04' },
  { name: 'माघ शुक्ल प्रदोष (शुक्र प्रदोष)', paksha: 'शुक्ल पक्ष', day: 'शुक्रवार', date: '19 फरवरी 2027', dateEn: '2027-02-19' },
  { name: 'फाल्गुन कृष्ण प्रदोष (शनि प्रदोष)', paksha: 'कृष्ण पक्ष', day: 'शनिवार', date: '06 मार्च 2027', dateEn: '2027-03-06', type: 'शनि प्रदोष' },
  { name: 'फाल्गुन शुक्ल प्रदोष (रविवार प्रदोष)', paksha: 'शुक्ल पक्ष', day: 'रविवार', date: '21 मार्च 2027', dateEn: '2027-03-21' },
  { name: 'चैत्र कृष्ण प्रदोष (सोम प्रदोष)', paksha: 'कृष्ण पक्ष', day: 'सोमवार', date: '05 अप्रैल 2027', dateEn: '2027-04-05', type: 'सोम प्रदोष' },
  { name: 'चैत्र शुक्ल प्रदोष (सोम प्रदोष)', paksha: 'शुक्ल पक्ष', day: 'सोमवार', date: '19 अप्रैल 2027', dateEn: '2027-04-19', type: 'सोम प्रदोष' },
];

const FAQS = [
  {
    q: 'प्रदोष काल (Pradosha Kaala) किसे कहते हैं?',
    a: 'सूर्यास्त से लगभग 45 मिनट पूर्व और सूर्यास्त के 45 मिनट बाद (कुल लगभग डेढ़ घंटे या 3 मुहूर्त) की संध्या-बेला को "प्रदोष काल" कहा जाता है। शिव पुराण के अनुसार इसी समय भगवान शिव कैलाश पर आनंद तांडव करते हैं और समस्त देवता उनकी स्तुति करते हैं।',
  },
  {
    q: 'सोम, भौम और शनि प्रदोष का क्या विशेष फल है?',
    a: 'सोमवार को पड़ने वाला सोम प्रदोष शांति व आरोग्य देता है; मंगलवार का भौम प्रदोष ऋण-मुक्ति और संकट-निवारण के लिए प्रसिद्ध है; और शनिवार को पड़ने वाला शनि प्रदोष संतान-सुख व दीर्घायु की कामना हेतु विशेष रूप से फलदायी माना जाता है।',
  },
  {
    q: 'प्रदोष व्रत में क्या खाना चाहिए?',
    a: 'प्रदोष व्रत में दिनभर निराहार अथवा फलाहार रहा जाता है। प्रदोष काल में भगवान शिव की पूजा और जलाभिषेक के बाद सात्विक हविष्यान्न अथवा फलाहार ग्रहण किया जाता है।',
  },
];

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://dharmagranth.dev/panchang/pradosh/#webpage',
      url: 'https://dharmagranth.dev/panchang/pradosh/',
      name: 'प्रदोष व्रत तिथियाँ 2026–2028 · Pradosh Vrat Dates & Shiva Mahatmya',
      description:
        'त्रयोदशी तिथि पर पड़ने वाले प्रदोष व्रत की तिथियाँ, प्रदोष काल समय, शिव पुराण के अनुसार व्रत विधि, मंत्र एवं महात्म्य।',
      inLanguage: ['hi', 'sa', 'en'],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://dharmagranth.dev/panchang/pradosh/#faq',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

function getIstTodayIso(): string {
  const ist = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  return `${ist.getFullYear()}-${String(ist.getMonth() + 1).padStart(2, '0')}-${String(ist.getDate()).padStart(2, '0')}`;
}

export default function PradoshPage() {
  const todayIso = getIstTodayIso();
  const nextUpcomingDateEn = PRADOSH_DATES.find((d) => d.dateEn >= todayIso)?.dateEn;

  return (
    <main className="apple-scope panchang-scope panchang-limb min-h-screen bg-dharma-bg text-dharma-text pb-20 relative overflow-hidden" data-limb="tithis">
      {/* Twilight Shiva Sandhya Aura Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[440px] w-full max-w-5xl rounded-full bg-radial from-indigo-500/22 via-blue-600/12 to-transparent blur-3xl"
      />
      <JsonLd data={JSON_LD} />

      <div className="mx-auto max-w-7xl px-gutter pt-6 relative z-10">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Panchang', href: '/panchang/' },
            { label: 'Pradosh Dates' },
          ]}
        />
      </div>

      <PageHeader
        eyebrow="Trayodashi & Shiva Sandhya"
        eyebrowHi="शिव सायुज्य एवं प्रदोष काल"
        title="Pradosh Vrat Dates (2026–2027)"
        titleHi="प्रदोष व्रत तिथियाँ व शिव महात्म्य"
        lead="शिव पुराण एवं स्कंद पुराण के अनुसार प्रत्येक पक्ष की त्रयोदशी तिथि का प्रदोष काल आशुतोष भगवान शिव की कृपा प्राप्त करने का सर्वश्रेष्ठ मुहूर्त है।"
        width="wide"
      />

      <PanchangLimbSwitcher activeLimb="tithis" />

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 mt-10 space-y-12 relative z-10">
        {/* Core Principles Bento */}
        <section aria-labelledby="pradosh-meaning" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-sacred rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-5 shadow-soft transition hover:border-indigo-400/40 hover:shadow-md">
            <span className="text-2xl mb-2 block">🌙</span>
            <h3 className="font-serif font-bold text-base text-dharma-text">त्रयोदशी तिथि (13th Lunar Day)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-dharma-muted">
              पूर्णिमा और अमावस्या से दो दिन पूर्व, जब चित्त की वृत्तियों को शांत करना अत्यंत सहज होता है।
            </p>
          </div>
          <div className="card-sacred rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-5 shadow-soft transition hover:border-indigo-400/40 hover:shadow-md">
            <span className="text-2xl mb-2 block">🔱</span>
            <h3 className="font-serif font-bold text-base text-dharma-text">कैलाश तांडव (Divine Twilight)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-dharma-muted">
              संध्याकाल में शिवजी का नृत्य — समस्त नकारात्मक ऊर्जा व क्लेशों के भस्म होने की पावन बेला।
            </p>
          </div>
          <div className="card-sacred rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-5 shadow-soft transition hover:border-indigo-400/40 hover:shadow-md">
            <span className="text-2xl mb-2 block">🔔</span>
            <h3 className="font-serif font-bold text-base text-dharma-text">महामृत्युंजय साधना (Japa &amp; Peace)</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-dharma-muted">
              महामृत्युंजय मंत्र, रुद्राष्टकम् और शिव पंचाक्षर स्तोत्र के जप से अंतःकरण की शुद्धि।
            </p>
          </div>
        </section>

        {/* Dates Table */}
        <section aria-labelledby="dates-heading" className="card-sacred rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl overflow-hidden shadow-soft">
          <div className="p-5 sm:p-6 border-b border-dharma-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-surface-elevated/40">
            <div>
              <h2 id="dates-heading" className="font-serif text-xl font-bold text-dharma-text">
                आगामी प्रदोष व्रत तिथियाँ (2026–2027)
              </h2>
              <p className="text-xs text-dharma-muted mt-0.5">
                सूर्यास्त समय अनुसार प्रदोष काल पूजा मुहूर्त
              </p>
            </div>
            <Link
              href="/panchang/"
              className="inline-flex items-center gap-1 text-xs font-semibold text-saffron-700 hover:text-saffron-800 dark:text-saffron-300"
            >
              दैनिक पंचांग देखें &rarr;
            </Link>
          </div>

          <div className="divide-y divide-dharma-border/60">
            {PRADOSH_DATES.map((item) => {
              const isNextUpcoming = item.dateEn === nextUpcomingDateEn;
              return (
                <div
                  key={item.dateEn}
                  className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition hover:bg-surface-elevated/70 ${
                    isNextUpcoming ? 'border-l-4 border-l-saffron-500 bg-saffron-500/[0.08]' : ''
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif font-bold text-sm sm:text-base text-dharma-text">
                        {item.name}
                      </span>
                      {isNextUpcoming && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500/15 border border-saffron-500/40 px-2.5 py-0.5 text-[11px] font-bold text-saffron-800 dark:text-saffron-200 shadow-xs">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-saffron-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-saffron-500" />
                          </span>
                          आगामी व्रत · Next Upcoming
                        </span>
                      )}
                      {item.type && (
                        <span className="text-2xs rounded-full bg-blue-100/90 dark:bg-blue-900/60 px-2 py-0.5 font-bold text-blue-800 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50">
                          {item.type}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-dharma-muted mt-0.5">
                      {item.paksha} · {item.day}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="font-mono text-sm font-semibold text-blue-800 dark:text-blue-300 block">
                      {item.date}
                    </span>
                    <span className="text-2xs text-dharma-muted">{item.dateEn}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sacred Mantra & Scriptural Citation */}
        <section aria-labelledby="mantra-heading" className="card-sacred rounded-2xl border border-dharma-border/80 bg-gradient-to-br from-indigo-500/10 via-dharma-card/85 to-dharma-bg/80 backdrop-blur-xl p-6 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-3">
            <BookOpen className="h-4 w-4" />
            <span>शिव पंचाक्षर व महामृत्युंजय मंत्र</span>
          </div>
          <p lang="sa" className="font-devanagari text-lg sm:text-xl font-bold leading-relaxed text-dharma-text text-center py-3">
            ॐ नमः शिवाय ॥<br />
            ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥
          </p>
          <p className="text-xs text-center text-dharma-muted max-w-xl mx-auto mt-2 leading-relaxed">
            शिव पुराण में महर्षि सूत कहते हैं: &quot;जो मनुष्य दोनों पक्षों की त्रयोदशी को प्रदोष काल में भगवान शिव की आराधना करता है, उसके समस्त पाप, व्याधियां और ऋण विनष्ट हो जाते हैं।&quot;
          </p>
        </section>

        {/* FAQ Accordion */}
        <section aria-labelledby="faq-heading">
          <SectionTitle id="faq-heading" title="जिज्ञासा एवं समाधान" titleHi="FAQ" />
          <div className="apple-group mt-6">
            {FAQS.map((f) => (
              <details key={f.q} className="apple-row group block !py-0 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-3 text-callout font-medium text-dharma-text">
                  <span>{f.q}</span>
                  <span aria-hidden="true" className="apple-chevron transition group-open:rotate-90">›</span>
                </summary>
                <p className="pb-4 text-subhead leading-relaxed text-dharma-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Related Hub Navigation */}
        <section className="flex flex-wrap gap-4 pt-6 border-t border-dharma-border">
          <Link
            href="/panchang/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-dharma-border/80 bg-dharma-card/80 backdrop-blur-md px-5 py-2.5 text-xs font-semibold text-dharma-text hover:border-saffron-400 hover:bg-dharma-card transition shadow-xs"
          >
            &larr; मुख्य पंचांग
          </Link>
          <Link
            href="/festivals/shivaratri/"
            className="liquid-pill inline-flex min-h-11 items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-md px-5 py-2.5 text-xs font-semibold text-blue-800 dark:text-blue-300 hover:bg-blue-500/20 transition shadow-xs"
          >
            महाशिवरात्रि दर्शन &rarr;
          </Link>
        </section>
      </div>
    </main>
  );
}
