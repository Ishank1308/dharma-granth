import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { festivals, type Festival } from '@/data/festivals';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { FESTIVAL_PHOTOS } from '@/lib/page-photos';
import { HeroPhoto } from '@/app/components/PagePhoto';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Compass,
  FileText,
  Heart,
  HelpCircle,
  Leaf,
  MapPin,
  Music,
  Share2,
  Sparkles,
  Utensils,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { ShareCardButton } from '@/app/components/understand/ShareCard';
import { OnThisPage } from '@/app/components/OnThisPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return festivals.map((f) => ({ id: f.id }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const festival = festivals.find((f) => f.id === params.id);
  if (!festival) return { title: 'उत्सव नहीं मिला (Festival Not Found)' };

  const title = `${festival.name} (${festival.sanskrit}) — अर्थ, कथा, शास्त्रीय स्रोत व पूजा विधि`;
  const description = `${festival.shortDesc} ${festival.meaning}`.slice(0, 160);
  const canonical = `/festivals/${festival.id}/`;

  return {
    title: { absolute: `${title} | Dharma Granth` },
    description,
    keywords: [
      festival.name,
      festival.sanskrit,
      festival.transliteration,
      `${festival.name} meaning in hindi`,
      `${festival.name} katha`,
      `${festival.name} mantra`,
      `${festival.name} puja vidhi`,
      `${festival.name} timing`,
      'hindu festivals',
      'त्यौहार',
      'उत्सव',
    ],
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title: `${title} | Dharma Granth`,
      description,
      url: `https://dharmagranth.dev${canonical}`,
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Dharma Granth`,
      description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function FestivalDetailPage(props: PageProps) {
  const params = await props.params;
  const festival = festivals.find((f) => f.id === params.id);
  if (!festival) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.dev';
  const pageUrl = `${siteUrl}/festivals/${festival.id}/`;
  const photo = FESTIVAL_PHOTOS[festival.id];

  const faqItems = [
    {
      '@type': 'Question',
      name: `${festival.name} (${festival.sanskrit}) का क्या अर्थ और महत्व है?`,
      acceptedAnswer: { '@type': 'Answer', text: festival.meaning },
    },
    {
      '@type': 'Question',
      name: `${festival.name} का शास्त्रीय स्रोत क्या है?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `यह पर्व निम्नलिखित शास्त्रों में वर्णित है: ${festival.scripturalRefs.join(', ')}।`,
      },
    },
    {
      '@type': 'Question',
      name: `${festival.name} के प्रमुख मंत्र कौन से हैं?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: festival.commonChants
          .map((c) => `${c.sanskrit} (${c.translation})`)
          .join(' · '),
      },
    },
    {
      '@type': 'Question',
      name: `${festival.name} कब मनाया जाता है (Timing)?`,
      acceptedAnswer: { '@type': 'Answer', text: festival.timing },
    },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: `${festival.name} (${festival.sanskrit}) — अर्थ, कथा, शास्त्रीय स्रोत व पूजा विधि`,
        description: festival.shortDesc,
        inLanguage: ['hi', 'sa', 'en'],
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        publisher: {
          '@type': 'Organization',
          name: 'Dharma Granth',
          url: `${siteUrl}/`,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        mainEntity: faqItems,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: 'Festivals', item: `${siteUrl}/festivals/` },
          { '@type': 'ListItem', position: 3, name: festival.name, item: pageUrl },
        ],
      },
    ],
  };

  // WhatsApp share link with formatted text
  const shareText = encodeURIComponent(
    `🪔 *${festival.name} (${festival.sanskrit})*\n${festival.shortDesc}\n\n📖 *शास्त्रीय स्रोत:* ${festival.scripturalRefs.join(', ')}\n\n🔗 पूरा विवरण, मंत्र व कथा पढ़ें:\n${pageUrl}`
  );

  return (
    <main className="apple-scope long-read long-read-hi min-h-screen bg-dharma-bg pb-20 relative overflow-clip">
      {/* Sacred Festival Halo Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-full max-w-6xl rounded-full bg-radial from-amber-400/20 via-saffron-500/10 to-transparent blur-3xl"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section data-vt-hero className={`relative isolate overflow-hidden bg-gradient-to-br ${festival.gradient} text-white py-14 sm:py-20`}>
        {photo && <HeroPhoto photo={photo} />}
        <div className="absolute inset-0 mandala-bg opacity-15 pointer-events-none" />
        {/* Only the hero's foot fades into the page, so the timing card's white text stays on the hero's colour. */}
        <div className="absolute inset-x-0 bottom-0 h-12 sm:h-16 bg-gradient-to-t from-dharma-bg to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-gutter">
          <Link
            href="/festivals/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white text-xs sm:text-sm font-semibold mb-6 transition px-4 py-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/30 shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>सभी त्यौहार (All Festivals)</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{festival.category}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white/20 text-4xl sm:text-5xl backdrop-blur-md shadow-lg border border-white/20">
                  {festival.icon}
                </div>
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                    {festival.name}
                  </h1>
                  <p lang="sa" className="font-devanagari text-[clamp(1.125rem,calc(1rem+1vw),1.75rem)] leading-[1.9] [overflow-wrap:anywhere] opacity-90 font-medium">
                    {festival.sanskrit} <span className="text-sm opacity-75 font-serif">· {festival.transliteration}</span>
                  </p>
                </div>
              </div>

              <p className="text-base sm:text-lg opacity-90 leading-relaxed pt-2">
                {festival.shortDesc}
              </p>
            </div>

            {/* Timing Card & Quick Share */}
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md space-y-3.5 md:min-w-[280px] shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-200">
                <Clock className="h-4 w-4" />
                <span>पारंपरिक काल गणना (Timing)</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">{festival.timing}</p>

              <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-3">
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 px-3.5 py-1.5 text-xs font-bold text-white transition shadow-sm"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>WhatsApp Share</span>
                </a>
                <Link
                  href="/panchang/"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 hover:text-white px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>पंचांग देखें</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="relative mx-auto max-w-5xl px-gutter -mt-6 sm:-mt-8 space-y-8 z-10">
        <OnThisPage
          items={[
            { id: 'fest-meaning', hi: 'दार्शनिक अर्थ व महत्व', en: 'Spiritual Significance' },
            { id: 'fest-sources', hi: 'शास्त्रीय स्रोत व प्रमाण', en: 'Scriptural References' },
            { id: 'fest-deity', hi: 'संबंधित देवता व पावन कथा', en: 'Deity & Narrative' },
            festival.commonChants.length > 0 && { id: 'fest-chants', hi: 'जप और प्रार्थना', en: 'Chants & Prayers' },
            festival.scripturalVsCustom.length > 0 && { id: 'fest-custom', hi: 'शास्त्रीय बनाम सांस्कृतिक रिवाज़', en: 'Scripture and Custom' },
            festival.regionalTraditions.length > 0 && { id: 'fest-regions', hi: 'क्षेत्रीय विविधता', en: 'Regional Traditions' },
            festival.traditionalPractices.length > 0 && { id: 'fest-practices', hi: 'पारंपरिक अनुष्ठान', en: 'Ritual Practices' },
            festival.foodTraditions.length > 0 && { id: 'fest-food', hi: 'नैवेद्य व भोजन परंपरा', en: 'Sacred Food Offerings' },
            Boolean(festival.environmentalConsiderations) && { id: 'fest-nature', hi: 'प्रकृति व पर्यावरण संचेतना', en: 'Ecological Mindfulness' },
          ]}
        />
        {/* 1. Meaning & Core Philosophy */}
        <div className="fade-up-on-view card-sacred rounded-3xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-6 sm:p-8 shadow-soft space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            <Sparkles className="h-4 w-4" />
            <span>दार्शनिक अर्थ व महत्व (Spiritual Significance)</span>
          </div>
          <h2 id="fest-meaning" className="font-serif text-2xl font-bold text-dharma-text">
            {festival.name} क्यों मनाया जाता है?
          </h2>
          <p className="text-sm sm:text-base text-dharma-text leading-relaxed font-devanagari">
            {festival.meaning}
          </p>
        </div>

        {/* 2. Scriptural Authority & Sources */}
        <div className="fade-up-on-view card-sacred rounded-3xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-6 sm:p-8 shadow-soft space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            <BookOpen className="h-4 w-4" />
            <span>शास्त्रीय स्रोत व प्रमाण (Scriptural References)</span>
          </div>
          <h2 id="fest-sources" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
            किन शास्त्रों में इस पर्व का उल्लेख है?
          </h2>
          <div className="flex flex-wrap gap-2.5 pt-1">
            {festival.scripturalRefs.map((ref) => (
              <span
                key={ref}
                className="inline-flex items-center gap-1.5 rounded-xl border border-saffron-300 dark:border-saffron-800 bg-saffron-50 dark:bg-saffron-950/40 px-3.5 py-1.5 text-xs font-semibold text-saffron-800 dark:text-saffron-300"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-saffron-600" />
                <span>{ref}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 3. Sacred Narrative & Deities */}
        <div className="fade-up-on-view card-sacred rounded-3xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-6 sm:p-8 shadow-soft space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
            <Heart className="h-4 w-4" />
            <span>संबंधित देवता व पावन कथा (Deity & Narrative)</span>
          </div>
          <h2 id="fest-deity" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
            आराध्य देवता: {festival.relatedDeity}
          </h2>
          <div className="rounded-2xl border border-dharma-border/80 bg-dharma-panel/60 p-5">
            <p className="text-sm sm:text-base text-dharma-text leading-relaxed">
              {festival.relatedNarrative}
            </p>
          </div>
        </div>

        {/* 4. Common Chants & Mantras */}
        {festival.commonChants.length > 0 && (
          <div className="fade-up-on-view card-sacred rounded-3xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-6 sm:p-8 shadow-soft space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              <Music className="h-4 w-4" />
              <span>जप और प्रार्थना (Chants & Prayers)</span>
            </div>
            <h2 id="fest-chants" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
              पवित्र मंत्र और ध्यान
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {festival.commonChants.map((chant, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-dharma-border/80 bg-dharma-panel/60 p-5 space-y-2"
                >
                  <p lang="sa" className="font-devanagari text-[clamp(1.1rem,calc(1rem+0.75vw),1.5rem)] leading-[1.9] [overflow-wrap:anywhere] font-bold text-saffron-800 dark:text-saffron-400">
                    {chant.sanskrit}
                  </p>
                  <p className="text-xs text-dharma-muted italic font-mono">
                    {chant.transliteration}
                  </p>
                  <p className="text-xs sm:text-sm text-dharma-text pt-1 border-t border-dharma-border/60">
                    <strong>भावार्थ:</strong> {chant.translation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. Scriptural vs Cultural Distinction */}
        {festival.scripturalVsCustom.length > 0 && (
          <div className="fade-up-on-view card-sacred rounded-3xl border border-amber-300/80 dark:border-amber-900/60 bg-amber-500/5 backdrop-blur-xl p-6 sm:p-8 space-y-4 shadow-soft">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4" />
              <span>विवेक दर्शन: शास्त्रीय बनाम सांस्कृतिक रिवाज़</span>
            </div>
            <h2 id="fest-custom" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
              शास्त्र क्या कहते हैं और लोक-रिवाज़ क्या हैं?
            </h2>
            <p className="text-xs sm:text-sm text-dharma-muted">
              धर्म ग्रंथ का लक्ष्य अंधविश्वास मुक्त प्रामाणिक ज्ञान देना है। यहाँ शास्त्रीय निर्देशों और समय के साथ जुड़े लोक रिवाज़ों का स्पष्ट भेद प्रस्तुत है:
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              {festival.scripturalVsCustom.map((item, i) => (
                <div key={i} className="card-sacred rounded-2xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-md p-4 space-y-3">
                  <div className="rounded-xl border border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 p-3">
                    <p className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-300 mb-1">
                       शास्त्रीय मूल (Scriptural)
                    </p>
                    <p className="text-xs sm:text-sm text-dharma-text">{item.scriptural}</p>
                  </div>
                  <div className="rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-3">
                    <p className="text-xs font-bold uppercase text-amber-800 dark:text-amber-300 mb-1">
                      सांस्कृतिक / लोक रिवाज़ (Cultural Custom)
                    </p>
                    <p className="text-xs sm:text-sm text-dharma-text">{item.custom}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Regional Diversity & Traditions */}
        {festival.regionalTraditions.length > 0 && (
          <div className="fade-up-on-view card-sacred rounded-3xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-6 sm:p-8 shadow-soft space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              <MapPin className="h-4 w-4" />
              <span>क्षेत्रीय विविधता (Regional Traditions Across Bharat)</span>
            </div>
            <h2 id="fest-regions" className="font-serif text-xl sm:text-2xl font-bold text-dharma-text">
              भारत के विभिन्न क्षेत्रों में उत्सव का स्वरूप
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {festival.regionalTraditions.map((rt, i) => (
                <div key={i} className="rounded-2xl border border-dharma-border/80 bg-dharma-panel/60 p-4">
                  <p className="text-xs font-bold text-saffron-700 dark:text-saffron-400 mb-1">
                    {rt.region}
                  </p>
                  <p className="text-xs sm:text-sm text-dharma-text leading-relaxed">
                    {rt.tradition}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-dharma-muted italic pt-2">
              * सनातन धर्म में विविधता ही उसकी सुंदरता है; किसी एक क्षेत्रीय प्रथा को एकमात्र सार्वभौमिक नियम नहीं माना जाता।
            </p>
          </div>
        )}

        {/* 7. Traditional Practices & Food Traditions */}
        <div className="grid gap-6 md:grid-cols-2">
          {festival.traditionalPractices.length > 0 && (
            <div className="fade-up-on-view card-sacred rounded-3xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-6 sm:p-8 shadow-soft space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>पारंपरिक अनुष्ठान (Ritual Practices)</span>
              </div>
              <h3 id="fest-practices" className="font-serif text-lg font-bold text-dharma-text">साधना व विधि</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-dharma-text">
                {festival.traditionalPractices.map((practice, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-saffron-600 font-bold shrink-0">•</span>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {festival.foodTraditions.length > 0 && (
            <div className="fade-up-on-view card-sacred rounded-3xl border border-dharma-border/80 bg-dharma-card/85 backdrop-blur-xl p-6 sm:p-8 shadow-soft space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
                <Utensils className="h-4 w-4" />
                <span>नैवेद्य व भोजन परंपरा (Sacred Food Offerings)</span>
              </div>
              <h3 id="fest-food" className="font-serif text-lg font-bold text-dharma-text">पारंपरिक प्रसाद</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-dharma-text">
                {festival.foodTraditions.map((food, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-saffron-600 font-bold shrink-0">•</span>
                    <span>{food}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 8. Environmental Considerations */}
        {festival.environmentalConsiderations && (
          <div className="fade-up-on-view card-sacred rounded-3xl border border-emerald-300/80 dark:border-emerald-900/80 bg-emerald-500/5 backdrop-blur-xl p-6 sm:p-8 space-y-3 shadow-soft">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              <Leaf className="h-4 w-4" />
              <span>प्रकृति व पर्यावरण संचेतना (Ecological Mindfulness)</span>
            </div>
            <h3 id="fest-nature" className="font-serif text-lg font-bold text-dharma-text">
              उत्सव में प्रकृति संरक्षण
            </h3>
            <p className="text-xs sm:text-sm text-dharma-text leading-relaxed">
              {festival.environmentalConsiderations}
            </p>
          </div>
        )}

        {/* Footer Navigation Back to All Festivals & Panchang */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-dharma-border">
          <Link
            href="/festivals/"
            className="liquid-pill inline-flex items-center gap-2 text-sm font-semibold text-saffron-700 dark:text-saffron-400 hover:text-saffron-800 transition px-4 py-2 rounded-full border border-dharma-border/80 bg-dharma-card/80 backdrop-blur-md shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>सभी त्यौहार सूची (Browse All Festivals)</span>
          </Link>

          <Link
            href="/panchang/"
            className="liquid-pill inline-flex items-center gap-2 rounded-full bg-saffron-600 hover:bg-saffron-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition shadow-sm"
          >
            <Calendar className="h-4 w-4" />
            <span>दैनिक पंचांग देखें (View Daily Panchang) &rarr;</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
