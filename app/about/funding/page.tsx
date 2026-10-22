import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How Dharma Granth Is Funded · धर्म ग्रंथ का व्यय और सहयोग',
  description:
    'What keeps Dharma Granth free: no fees, no advertising, no accounts, and voluntary contributions by UPI. What contributions pay for, and what is not yet published.',
  alternates: { canonical: '/about/funding/' },
};

/**
 * Trust page (audit 2026-10-22, Phase 8). Every statement here is checkable in this repository:
 * the contribute page, the privacy page, public/_headers (Content-Security-Policy) and the
 * localStorage-only study features. Nothing is claimed that the code does not show.
 */
const SECTIONS: Array<{ en: string; hi: string; bodyEn: string; bodyHi: string }> = [
  {
    en: 'Reading is free, and will stay free',
    hi: 'स्वाध्याय निःशुल्क है और निःशुल्क ही रहेगा',
    bodyEn:
      'No scripture, verse, translation, explanation or study tool on Dharma Granth is behind a fee. Contributions are voluntary and change nothing about what you can read.',
    bodyHi:
      'धर्म ग्रंथ पर कोई भी ग्रन्थ, श्लोक, अनुवाद, व्याख्या अथवा अध्ययन-साधन शुल्क के पीछे नहीं है। सहयोग पूर्णतः ऐच्छिक है और उससे आपके पढ़ने के अधिकार में कोई अन्तर नहीं आता।',
  },
  {
    en: 'No advertising, no sale of data, no accounts',
    hi: 'न विज्ञापन, न डेटा का विक्रय, न खाता',
    bodyEn:
      'The site shows no advertisements. There is no sign-in: bookmarks, notes, progress and practice records stay in your own browser, with a JSON export so you can keep a copy. The site’s security policy allows exactly one outside script, Cloudflare Web Analytics, which counts visits in aggregate.',
    bodyHi:
      'इस साइट पर कोई विज्ञापन नहीं है। कोई खाता नहीं बनाना पड़ता: बुकमार्क, टिप्पणियाँ, पठन-प्रगति और साधना का लेखा आपके अपने ब्राउज़र में रहता है, और आप उसकी JSON प्रति सुरक्षित रख सकते हैं। साइट की सुरक्षा-नीति केवल एक बाहरी स्क्रिप्ट की अनुमति देती है, Cloudflare Web Analytics, जो केवल कुल संख्या के रूप में आगमन गिनती है।',
  },
  {
    en: 'What contributions pay for',
    hi: 'सहयोग का उपयोग किसमें होता है',
    bodyEn:
      'Contributions go toward keeping the site running: hosting, the domain and the technical upkeep of the library. Dharma Granth is not registered under section 80G of the Income Tax Act, so a contribution is a personal, voluntary gift and is not tax-deductible.',
    bodyHi:
      'सहयोग साइट को चलाए रखने में लगता है: होस्टिंग, डोमेन और ग्रन्थालय का तकनीकी रखरखाव। धर्म ग्रंथ आयकर अधिनियम की धारा 80G के अन्तर्गत पंजीकृत नहीं है; अतः यह सहयोग व्यक्तिगत, ऐच्छिक सहायता है और इस पर कर-छूट नहीं मिलती।',
  },
  {
    en: 'How the money moves',
    hi: 'राशि कैसे पहुँचती है',
    bodyEn:
      'Contributions are made by UPI, directly from your bank to the account shown on the contribute page. Dharma Granth never sees or stores your banking details. Your UPI transaction reference (UTR) is your receipt.',
    bodyHi:
      'सहयोग UPI द्वारा, आपके बैंक से सीधे सहयोग-पृष्ठ पर दिखाए गए खाते में जाता है। धर्म ग्रंथ आपकी बैंकिंग जानकारी को न देखता है, न संग्रहीत करता है। आपके UPI लेनदेन का सन्दर्भ-क्रमांक (UTR) ही आपका प्राप्ति-प्रमाण है।',
  },
  {
    en: 'What is not published yet',
    hi: 'जो अभी प्रकाशित नहीं है',
    bodyEn:
      'A monthly ledger of contributions received and money spent has not been published yet. Until it is, please judge the project by what you can check: the open source code, the sources page and the methodology page.',
    bodyHi:
      'प्राप्त सहयोग और व्यय का मासिक लेखा अभी प्रकाशित नहीं हुआ है। जब तक वह प्रकाशित न हो, कृपया इस परियोजना को उन बातों से परखें जिनकी आप स्वयं जाँच कर सकते हैं: खुला स्रोत-कोड, स्रोत-पृष्ठ और कार्यपद्धति-पृष्ठ।',
  },
];

export default function FundingPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-10">
        <p lang="hi" className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-300">
          व्यय, सहयोग और पारदर्शिता
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">How Dharma Granth is funded</h1>
        <p className="mt-3 leading-relaxed text-dharma-muted">
          A plain account of what keeps this library free, what contributions pay for, and what has not been published yet.
        </p>
      </header>

      <div className="space-y-8 leading-relaxed text-dharma-muted">
        {SECTIONS.map((s) => (
          <section key={s.en}>
            <h2 className="font-serif text-xl font-bold text-dharma-text">
              <span lang="en">{s.en}</span>{' '}
              <span lang="hi" className="mt-1 block font-devanagari text-base font-semibold text-saffron-800 dark:text-saffron-300">
                {s.hi}
              </span>
            </h2>
            <p className="mt-2">{s.bodyEn}</p>
            <p lang="hi" className="mt-2 font-devanagari">
              {s.bodyHi}
            </p>
          </section>
        ))}

        <section className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
          <p className="text-dharma-text">
            <span lang="en">If the library is useful to you, you can help keep it free.</span>{' '}
            <span lang="hi" className="font-devanagari">यदि यह ग्रन्थालय आपके लिए उपयोगी है, तो इसे निःशुल्क बनाए रखने में सहयोग करें।</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/contribute/"
              className="inline-flex min-h-11 items-center rounded-full bg-saffron-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-saffron-800"
            >
              <span lang="hi" className="font-devanagari">सहयोग करें</span>
              <span aria-hidden="true" className="mx-1.5">·</span>
              <span lang="en">Contribute</span>
            </Link>
            <a
              href="https://github.com/Ishank567/dharma-granth"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-dharma-border px-5 py-2.5 text-sm font-semibold text-dharma-text transition hover:border-saffron-400"
            >
              Source code
            </a>
            <Link
              href="/sources/"
              className="inline-flex min-h-11 items-center rounded-full border border-dharma-border px-5 py-2.5 text-sm font-semibold text-dharma-text transition hover:border-saffron-400"
            >
              Sources
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
