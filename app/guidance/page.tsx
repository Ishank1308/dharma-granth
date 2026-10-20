import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Heart,
  Shield,
  BookOpen,
  Brain,
  HelpCircle,
} from 'lucide-react';
import { FadeUp } from '@/app/components/motion/primitives';
import { wisdomTopics } from '@/data/wisdom-for-life';
import { DEFAULT_OG_IMAGE } from '@/lib/og';

export const metadata: Metadata = {
  title: 'Dharmic Life Guidance — जीवन की हर चुनौती के लिए शास्त्रीय समाधान',
  description:
    'Exact Sanskrit verses from the Bhagavad Gita and Upanishads for everyday dilemmas: stress, anger, anxiety, grief, duty, relationships and focus.',
  alternates: { canonical: '/guidance/' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Dharmic Life Guidance — जीवन की हर चुनौती के लिए शास्त्रीय समाधान — Dharma Granth',
    description:
      'Explore verses for stress, fear, anger, decision-making, grief, and purpose from the Bhagavad Gita and Upanishads.',
    url: 'https://dharmagranth.in/guidance',
  },
};

const HIGH_INTENT_GUIDES = [
  {
    titleHi: 'तनाव और चिंता से मुक्ति',
    titleEn: 'Overcoming Stress & Worry',
    slug: 'stress-and-worry',
    descHi: 'अनियंत्रित परिणामों की व्यग्रता छोड़कर वर्तमान सजगता और कर्मयोग में स्थिर होना।',
    accent: 'border-teal-500/30 hover:border-teal-500 bg-teal-500/5',
    tag: 'मन की शांति',
  },
  {
    titleHi: 'क्रोध पर नियंत्रण',
    titleEn: 'Mastering Anger',
    slug: 'anger',
    descHi: 'अपेक्षाओं और काम-क्रोध के चक्र को समझकर आंतरिक विवेक को जाग्रत करना।',
    accent: 'border-rose-500/30 hover:border-rose-500 bg-rose-500/5',
    tag: 'संवेग प्रबंधन',
  },
  {
    titleHi: 'भय और साहस',
    titleEn: 'Fear & Inner Courage',
    slug: 'fear-and-courage',
    descHi: 'मृत्यु, हानि और अज्ञात के भय से परे आत्मा की अमरता और निर्भयता का बोध।',
    accent: 'border-amber-500/30 hover:border-amber-500 bg-amber-500/5',
    tag: 'अभय',
  },
  {
    titleHi: 'कर्तव्य और निर्णय (धर्मसंकट)',
    titleEn: 'Duty & Hard Choices',
    slug: 'duty-and-decision-making',
    descHi: 'जब दो सही या दो कठिन रास्तों में चयन करना हो — निष्काम कर्म की स्पष्टता।',
    accent: 'border-blue-500/30 hover:border-blue-500 bg-blue-500/5',
    tag: 'धर्म व कर्म',
  },
  {
    titleHi: 'शोक, वियोग और विछोह',
    titleEn: 'Healing from Grief & Loss',
    slug: 'grief-and-loss',
    descHi: 'प्रियजनों के बिछोह या अप्रत्याशित क्षति में शांत, करुणामयी शास्त्रीय संबल।',
    accent: 'border-indigo-500/30 hover:border-indigo-500 bg-indigo-500/5',
    tag: 'सांत्वना',
  },
  {
    titleHi: 'एकाग्रता और अनुशासन',
    titleEn: 'Concentration & Focus',
    slug: 'concentration',
    descHi: 'चंचल मन को निरंतर अभ्यास और वैराग्य से लक्ष्य पर केंद्रित करने की विधि।',
    accent: 'border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5',
    tag: 'चित्त-एकाग्रता',
  },
  {
    titleHi: 'असफलता और निराशा से उबरना',
    titleEn: 'Rising Above Failure',
    slug: 'failure-and-setbacks',
    descHi: 'प्रयास और परिणाम के भेद को समझकर नए उत्साह से कर्तव्य-पथ पर अग्रसर होना।',
    accent: 'border-purple-500/30 hover:border-purple-500 bg-purple-500/5',
    tag: 'धैर्य',
  },
  {
    titleHi: 'संबंधों में प्रेम और सामंजस्य',
    titleEn: 'Harmonious Relationships',
    slug: 'relationships',
    descHi: 'स्वार्थ और अहंकार से परे आत्मीयता, क्षमा और परोपकार की दृष्टि।',
    accent: 'border-pink-500/30 hover:border-pink-500 bg-pink-500/5',
    tag: 'पारस्परिक स्नेह',
  },
];

const FAQS = [
  {
    q: 'भगवद्गीता से मानसिक शांति (Inner Peace) कैसे प्राप्त करें?',
    a: 'गीता का उपदेश है कि मन की अशांति भविष्य के परिणामों की चिंता और नियंत्रण की इच्छा से उत्पन्न होती है। श्लोक 2.47 में श्रीकृष्ण कहते हैं कि मनुष्य का अधिकार केवल वर्तमान कर्तव्य पर है, फल पर नहीं। जब हम फल की आसक्ति त्यागकर निष्काम भाव से कार्य करते हैं, तो मन स्वतः शांत और प्रसन्न हो जाता है।',
  },
  {
    q: 'क्रोध पर नियंत्रण के लिए शास्त्रों का क्या मार्गदर्शन है?',
    a: 'गीता (2.62-63) में क्रोध की उत्पत्ति का मनोवैज्ञानिक विश्लेषण है: विषयों का चिंतन $\\to$ आसक्ति $\\to$ कामना $\\to$ कामना में बाधा आने पर क्रोध $\\to$ सम्मोह $\\to$ बुद्धि का नाश। क्रोध से बचने के लिए इच्छाओं के प्रति सजगता और श्वास व ध्यान द्वारा विवेक को सक्रिय रखना चाहिए।',
  },
  {
    q: 'जब जीवन में धर्मसंकट हो, तो सही निर्णय कैसे लें?',
    a: 'शास्त्रों के अनुसार निर्णय लेते समय तीन कसौटियों का ध्यान रखें: (1) स्वार्थ की जगह समग्र कल्याण (लोकसंग्रह), (2) तात्कालिक सुख (प्रेय) की जगह दीर्घकालिक कल्याण (श्रेय), और (3) अंतरात्मा और कर्तव्य (स्वधर्म) के प्रति निष्ठा।',
  },
];

export default function GuidancePortalPage() {
  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <main className="min-h-screen bg-dharma-bg text-dharma-text pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-saffron-950 via-stone-900 to-amber-950 text-white py-16 sm:py-24 overflow-hidden border-b border-amber-900/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-300 text-xs font-semibold mb-6">
              <Compass className="w-3.5 h-3.5" />
              <span>जीवन के लिए शास्त्रीय मार्गदर्शन · Scriptural Guidance</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-white mb-4 leading-tight">
              जीवन की हर परिस्थिति में <br />
              <span className="text-amber-300">शाश्वत समाधान</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base sm:text-lg text-amber-100/90 leading-relaxed font-light mb-8">
              तनाव, भय, क्रोध, वियोग या धर्मसंकट — किसी भी स्थिति में शास्त्रों के मूल संस्कृत श्लोक, प्रामाणिक अर्थ और व्यावहारिक चिंतन से मन को स्पष्टता दें।
            </p>

            {/* Quick Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {HIGH_INTENT_GUIDES.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/wisdom-for-life/${guide.slug}`}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-xs text-amber-100 hover:text-white transition font-medium"
                >
                  {guide.titleHi}
                </Link>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Core Situation Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dharma-text">
            अपनी वर्तमान स्थिति चुनें
          </h2>
          <p className="text-xs sm:text-sm text-dharma-muted mt-1.5">
            बिना किसी अध्याय या श्लोक संख्या को याद रखे, सीधे अपनी आवश्यकतानुसार मार्गदर्शन प्राप्त करें।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HIGH_INTENT_GUIDES.map((item) => (
            <Link
              key={item.slug}
              href={`/wisdom-for-life/${item.slug}`}
              className={`group flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 hover:shadow-lg ${item.accent}`}
            >
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                  {item.tag}
                </span>
                <h3 className="text-lg font-serif font-bold text-dharma-text mt-1 group-hover:text-saffron-700 transition">
                  {item.titleHi}
                </h3>
                <p className="text-xs text-dharma-muted font-medium mb-3">
                  {item.titleEn}
                </p>
                <p className="text-xs text-dharma-text/80 leading-relaxed line-clamp-3">
                  {item.descHi}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-dharma-border/50 flex items-center justify-between text-xs font-semibold text-saffron-700 dark:text-saffron-300">
                <span>श्लोक व अर्थ पढ़ें</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Frequently Asked Spiritual Questions (FAQ Section) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 border-t border-dharma-border/60">
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-saffron-600" />
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-dharma-text">
            अक्सर पूछे जाने वाले शास्त्रीय प्रश्न (FAQ)
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-dharma-border bg-dharma-card"
            >
              <h3 className="font-serif font-bold text-base text-dharma-text mb-2 flex items-start gap-2">
                <span className="text-saffron-600 text-sm">प्र.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-dharma-muted leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Explore all topics banner */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-saffron-500/10 to-amber-500/10 border border-saffron-300/40 text-center">
          <h3 className="text-lg font-serif font-bold text-dharma-text">
            सभी 15 जीवन-विषयों का अध्ययन करें
          </h3>
          <p className="text-xs sm:text-sm text-dharma-muted max-w-lg mx-auto mt-1 mb-4">
            आध्यात्मिक साधना, पारिवारिक उत्तरदायित्व, नेतृत्व, आत्मज्ञान और जीवन का वास्तविक उद्देश्य।
          </p>
          <Link
            href="/wisdom-for-life"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-saffron-600 hover:bg-saffron-700 text-white font-semibold text-xs sm:text-sm shadow-md transition active:scale-95"
          >
            <span>सम्पूर्ण निर्देशिका देखें (Wisdom for Life)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
