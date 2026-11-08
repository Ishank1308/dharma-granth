import type { Metadata } from 'next';
import Link from 'next/link';
import { Compass, Sparkles, ShieldCheck, ChevronRight, BookOpen } from 'lucide-react';
import { calculateEducationalPanchang, PRESET_LOCATIONS, todayForLocation } from '@/lib/panchang';
import { MUHURTA_FAQS } from '@/data/muhurta-data';
import { MuhurtaMatrixClient } from './MuhurtaMatrixClient';

export const metadata: Metadata = {
  title: 'मुहूर्त कैलेंडर · Muhurta Calendar | Dharma Granth',
  description:
    'तिथि और शहर चुनकर राहुकाल, अभिजीत मुहूर्त और पञ्चाङ्ग के पाँच अङ्ग देखें। पारम्परिक मुहूर्त नियमों का अध्ययन करें।',
  alternates: {
    canonical: 'https://dharmagranth.dev/panchang/muhurta/',
  },
  openGraph: {
    title: 'मुहूर्त कैलेंडर · Muhurta Calendar',
    description:
      'चुनी हुई तिथि और शहर के लिए अनुमानित राहुकाल, अभिजीत मुहूर्त और पारम्परिक पञ्चाङ्ग नियम देखें।',
    url: 'https://dharmagranth.dev/panchang/muhurta/',
    siteName: 'Dharma Granth',
    images: [
      {
        url: 'https://dharmagranth.dev/og/muhurta.png',
        width: 1200,
        height: 630,
        alt: 'Vedic Muhurta Decision Matrix',
      },
    ],
    locale: 'hi_IN',
    type: 'article',
  },
};

export default function MuhurtaPage() {
  const panchang = calculateEducationalPanchang(todayForLocation(PRESET_LOCATIONS[0]), PRESET_LOCATIONS[0]);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://dharmagranth.dev/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Panchang',
            item: 'https://dharmagranth.dev/panchang/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Muhurta Decision Matrix',
            item: 'https://dharmagranth.dev/panchang/muhurta/',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: MUHURTA_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.questionHi,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answerHi,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-dharma-border bg-gradient-to-b from-saffron-500/10 via-amber-500/5 to-transparent pt-10 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-dharma-muted mb-4">
            <Link href="/" className="hover:text-saffron-600 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/panchang/" className="hover:text-saffron-600 transition">
              पञ्चाङ्ग (Panchang)
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-dharma-text font-medium">मुहूर्त निर्णय (Muhurta Matrix)</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-500/10 border border-saffron-500/20 text-xs font-semibold text-saffron-700 dark:text-saffron-300 mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>पञ्चाङ्ग शुद्धि एवं काल-विज्ञान · Vedic Timing Shastra</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-dharma-text tracking-tight leading-tight mb-4">
              मुहूर्त कैलेंडर
              <span className="block text-xl sm:text-2xl font-serif text-saffron-700 dark:text-saffron-400 font-normal mt-1">
                Muhurta Calendar & Panchang Study
              </span>
            </h1>

            <p className="text-sm sm:text-base text-dharma-muted leading-relaxed mb-6">
              आप तिथि और शहर चुनकर राहुकाल, अभिजीत मुहूर्त और उस दिन के पञ्चाङ्ग को एक साथ देख सकते हैं। विद्यारम्भ, गृहप्रवेश, यात्रा, नवीन कार्य और साधना से जुड़े पारम्परिक नियमों को उदाहरणों के साथ समझें।
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-dharma-muted">
              <span className="inline-flex items-center gap-1.5 bg-dharma-card px-3 py-1.5 rounded-lg border border-dharma-border">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>पञ्चाङ्ग शुद्धि सिद्धान्त</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-dharma-card px-3 py-1.5 rounded-lg border border-dharma-border">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>5 पारम्परिक कार्य-श्रेणियाँ</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-dharma-card px-3 py-1.5 rounded-lg border border-dharma-border">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>संवादात्मक सिम्युलेटर</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Matrix */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <MuhurtaMatrixClient
          initialPanchang={{
            isoDate: panchang.isoDate,
            dayOfWeekIndex: panchang.date.getDay(),
            dayOfWeek: panchang.dayOfWeek,
            dayOfWeekHi: panchang.dayOfWeekHi,
            tithiNumber: panchang.tithi.number,
            tithiName: panchang.tithi.name,
            tithiNameHi: panchang.tithi.nameHi,
            paksha: panchang.paksha.name,
            pakshaHi: panchang.paksha.nameHi,
            nakshatraIndex: panchang.nakshatra.index,
            nakshatraName: panchang.nakshatra.name,
            nakshatraNameHi: panchang.nakshatra.nameHi,
            karanaName: panchang.karana.name,
            karanaNameHi: panchang.karana.nameHi,
            yogaIndex: panchang.yoga.index,
            yogaName: panchang.yoga.name,
            yogaNameHi: panchang.yoga.nameHi,
            solarTimes: panchang.solarTimes,
          }}
        />

        {/* Educational Disclaimer */}
        <div className="mt-12 p-4 rounded-xl border border-dharma-border/60 bg-dharma-card/60 text-xs text-dharma-muted leading-relaxed">
          <p>
            <strong>अध्ययन और गणना · Study and calculation</strong>। इस पृष्ठ पर समय अनुमानित हैं और अनुकूलता अंक पारम्परिक नियमों के अध्ययन के लिए हैं। विवाह, मन्दिर प्रतिष्ठा और अन्य संस्कारों के लिए स्थानीय दृक-पञ्चाङ्ग और अपने आचार्य से समय की पुष्टि करें।
          </p>
          <p className="mt-2">
            <a className="underline underline-offset-2 hover:text-dharma-text" href="https://www.drikpanchang.com/panchang/rahu-kaal.html">राहुकाल की गणना · Rahu Kalam method</a>
            <span aria-hidden="true"> · </span>
            <a className="underline underline-offset-2 hover:text-dharma-text" href="https://www.drikpanchang.com/muhurat/daily/abhijit-muhurat.html">अभिजीत की गणना · Abhijit method</a>
            <span aria-hidden="true"> · </span>
            <a className="underline underline-offset-2 hover:text-dharma-text" href="https://gml.noaa.gov/grad/solcalc/solareqns.PDF">सौर गणना · NOAA solar equations</a>
          </p>
        </div>

        {/* Cross Links to Panchang Limbs */}
        <div className="mt-8 pt-8 border-t border-dharma-border">
          <h4 className="text-sm font-serif font-bold text-dharma-text mb-3">
            पञ्चाङ्ग के पाँचों अङ्गों का विस्तृत अध्ययन करें:
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <Link
              href="/panchang/tithis/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center"
            >
              <strong className="block text-dharma-text">तिथि दर्शिका</strong>
              <span className="text-dharma-muted text-[11px]">30 Tithi Archetypes</span>
            </Link>
            <Link
              href="/panchang/varas/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center"
            >
              <strong className="block text-dharma-text">वार दर्शिका</strong>
              <span className="text-dharma-muted text-[11px]">7 Planetary Weekdays</span>
            </Link>
            <Link
              href="/panchang/nakshatras/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center"
            >
              <strong className="block text-dharma-text">नक्षत्र दर्शिका</strong>
              <span className="text-dharma-muted text-[11px]">27 Lunar Mansions</span>
            </Link>
            <Link
              href="/panchang/karanas/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center"
            >
              <strong className="block text-dharma-text">करण दर्शिका</strong>
              <span className="text-dharma-muted text-[11px]">11 Karana Energies</span>
            </Link>
            <Link
              href="/panchang/yogas/"
              className="p-3 rounded-xl border border-dharma-border bg-dharma-card hover:border-saffron-500/50 transition text-center col-span-2 sm:col-span-1"
            >
              <strong className="block text-dharma-text">योग दर्शिका</strong>
              <span className="text-dharma-muted text-[11px]">27 Solar-Lunar Yogas</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
