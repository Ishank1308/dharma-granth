import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle2, Lock, Server, ShieldCheck, Wallet } from 'lucide-react';
import { PageHeader, SectionTitle } from '@/app/components/apple/PageHeader';

export const metadata: Metadata = {
  title: { absolute: 'How Dharma Granth Is Funded · व्यय और सहयोग | Dharma Granth' },
  description:
    'What keeps Dharma Granth free: no fees, no advertising, no accounts, and voluntary contributions by UPI. What contributions pay for, and what is not yet published.',
  alternates: { canonical: '/about/funding/' },
};

/**
 * Trust page (audit 2026-10-22, Phase 8). Every statement here is checkable in this repository:
 * the contribute page, the privacy page, public/_headers (Content-Security-Policy) and the
 * localStorage-only study features. Nothing is claimed that the code does not show.
 */
const PILLARS = [
  { metric: '₹0', en: 'Reader fee', hi: 'निःशुल्क स्वाध्याय' },
  { metric: '0', en: 'Advertisements', hi: 'शून्य विज्ञापन' },
  { metric: '0', en: 'User accounts', hi: 'खाता-मुक्त गोपनीयता' },
  { metric: 'UPI', en: 'Direct bank transfer', hi: 'सीधा स्वैच्छिक सहयोग' },
] as const;

const SECTIONS = [
  {
    num: '01',
    Icon: BookOpen,
    en: 'Reading is free, and will stay free',
    hi: 'स्वाध्याय निःशुल्क है और निःशुल्क ही रहेगा',
    bodyEn:
      'No scripture, verse, translation, explanation or study tool on Dharma Granth is behind a fee. Contributions are voluntary and change nothing about what you can read.',
    bodyHi:
      'धर्म ग्रंथ पर कोई भी ग्रन्थ, श्लोक, अनुवाद, व्याख्या अथवा अध्ययन-साधन शुल्क के पीछे नहीं है। सहयोग पूर्णतः ऐच्छिक है और उससे आपके पढ़ने के अधिकार में कोई अन्तर नहीं आता।',
  },
  {
    num: '02',
    Icon: Lock,
    en: 'No advertising, no sale of data, no accounts',
    hi: 'न विज्ञापन, न डेटा का विक्रय, न खाता',
    bodyEn:
      'The site shows no advertisements. There is no sign-in: bookmarks, notes, progress and practice records stay in your own browser, with a JSON export so you can keep a copy. The site’s security policy allows exactly one outside script, Cloudflare Web Analytics, which counts visits in aggregate.',
    bodyHi:
      'इस साइट पर कोई विज्ञापन नहीं है। कोई खाता नहीं बनाना पड़ता: बुकमार्क, टिप्पणियाँ, पठन-प्रगति और साधना का लेखा आपके अपने ब्राउज़र में रहता है, और आप उसकी JSON प्रति सुरक्षित रख सकते हैं। साइट की सुरक्षा-नीति केवल एक बाहरी स्क्रिप्ट की अनुमति देती है, Cloudflare Web Analytics, जो केवल कुल संख्या के रूप में आगमन गिनती है।',
  },
  {
    num: '03',
    Icon: Server,
    en: 'What contributions pay for',
    hi: 'सहयोग का उपयोग किसमें होता है',
    bodyEn:
      'Contributions go toward keeping the site running: hosting, the domain and the technical upkeep of the library. Dharma Granth is not registered under section 80G of the Income Tax Act, so a contribution is a personal, voluntary gift and is not tax-deductible.',
    bodyHi:
      'सहयोग साइट को चलाए रखने में लगता है: होस्टिंग, डोमेन और ग्रन्थालय का तकनीकी रखरखाव। धर्म ग्रंथ आयकर अधिनियम की धारा 80G के अन्तर्गत पंजीकृत नहीं है; अतः यह सहयोग व्यक्तिगत, ऐच्छिक सहायता है और इस पर कर-छूट नहीं मिलती।',
  },
  {
    num: '04',
    Icon: Wallet,
    en: 'How the money moves',
    hi: 'राशि कैसे पहुँचती है',
    bodyEn:
      'Contributions are made by UPI, directly from your bank to the account shown on the contribute page. Dharma Granth never sees or stores your banking details. Your UPI transaction reference (UTR) is your receipt.',
    bodyHi:
      'सहयोग UPI द्वारा, आपके बैंक से सीधे सहयोग-पृष्ठ पर दिखाए गए खाते में जाता है। धर्म ग्रंथ आपकी बैंकिंग जानकारी को न देखता है, न संग्रहीत करता है। आपके UPI लेनदेन का सन्दर्भ-क्रमांक (UTR) ही आपका प्राप्ति-प्रमाण है।',
  },
  {
    num: '05',
    Icon: ShieldCheck,
    en: 'What is not published yet',
    hi: 'जो अभी प्रकाशित नहीं है',
    bodyEn:
      'A monthly ledger of contributions received and money spent has not been published yet. Until it is, please judge the project by what you can check: the open source code, the sources page and the methodology page.',
    bodyHi:
      'प्राप्त सहयोग और व्यय का मासिक लेखा अभी प्रकाशित नहीं हुआ है। जब तक वह प्रकाशित न हो, कृपया इस परियोजना को उन बातों से परखें जिनकी आप स्वयं जाँच कर सकते हैं: खुला स्रोत-कोड, स्रोत-पृष्ठ और कार्यपद्धति-पृष्ठ।',
  },
] as const;

export default function FundingPage() {
  return (
    <main className="apple-scope min-h-screen bg-dharma-bg pb-24 text-dharma-text">
      <div data-vt-hero>
        <PageHeader
          eyebrow="Stewardship & Transparency"
          eyebrowHi="व्यय, सहयोग और पारदर्शिता"
          title="How Dharma Granth is funded"
          titleHi="निःशुल्क स्वाध्याय एवं पारदर्शिता"
          lead={
            <p>
              A plain, verifiable account of what keeps this library free, how voluntary UPI support works, what contributions pay for, and what has not been published yet.
            </p>
          }
        />
      </div>

      {/* High-Fidelity At-a-Glance Stewardship Strip */}
      <section aria-label="Stewardship summary" className="mx-auto max-w-content px-gutter pt-2">
        <dl className="fluid-grid-xs reveal-grid">
          {PILLARS.map((item) => (
            <div key={item.en} className="apple-card flex flex-col justify-between p-4 sm:p-5">
              <dt className="text-footnote font-medium text-dharma-muted">
                <span>{item.en}</span>{' '}
                <span lang="hi" className="mt-0.5 block font-devanagari text-caption text-dharma-muted">
                  {item.hi}
                </span>
              </dt>
              <dd className="apple-stat mt-3 text-title-1 font-semibold tracking-tight text-dharma-saffron">
                {item.metric}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Bilingual High-Fidelity Fluid Cards */}
      <section aria-labelledby="funding-commitments" className="mx-auto max-w-content px-gutter pt-12 sm:pt-16">
        <SectionTitle
          id="funding-commitments"
          title="Five verifiable commitments"
          titleHi="पाँच सत्यापनीय सिद्धांत"
          sub="Every statement below can be checked directly against the open repository, HTTP security headers, and client storage."
        />

        <div className="reveal-grid fluid-grid-lg mt-6">
          {SECTIONS.map((s) => {
            const Icon = s.Icon;
            return (
              <section key={s.en} className="apple-card fluid-cq flex flex-col justify-between p-5 sm:p-6">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-field bg-dharma-saffron/12 text-dharma-saffron">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="apple-stat rounded-pill border border-separator bg-fill-quaternary px-2.5 py-0.5 font-mono text-caption font-semibold text-label-secondary">
                      {s.num}
                    </span>
                  </div>

                  <h2 className="text-title-3 font-semibold leading-snug text-dharma-text">
                    <span lang="en">{s.en}</span>{' '}
                    <span lang="hi" className="mt-1 block font-devanagari text-base font-semibold text-saffron-800 dark:text-saffron-300">
                      {s.hi}
                    </span>
                  </h2>

                  <p className="mt-3 text-subhead leading-relaxed text-dharma-text-secondary">
                    {s.bodyEn}
                  </p>
                </div>

                <p lang="hi" className="mt-4 border-t border-separator pt-3.5 font-devanagari text-subhead leading-relaxed text-dharma-muted">
                  {s.bodyHi}
                </p>
              </section>
            );
          })}
        </div>

        {/* High-Fidelity Action & Verification Dock */}
        <section aria-label="Support and verification links" className="apple-card mt-10 flex flex-col justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
          <div className="max-w-2xl space-y-1.5">
            <p className="inline-flex items-center gap-1.5 text-footnote font-semibold text-dharma-saffron">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              <span>Voluntary support</span>{' '}
              <span aria-hidden="true">·</span>{' '}
              <span lang="hi" className="font-devanagari">ऐच्छिक सहयोग</span>
            </p>
            <p className="text-body font-medium text-dharma-text">
              <span lang="en">If the library is useful to you, you can help keep it free.</span>{' '}
              <span lang="hi" className="mt-1 block font-devanagari text-subhead font-normal text-dharma-muted">
                यदि यह ग्रन्थालय आपके लिए उपयोगी है, तो इसे निःशुल्क बनाए रखने में सहयोग करें।
              </span>
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link href="/contribute/" data-vt="open" className="apple-pill">
              <span lang="hi" className="font-devanagari">सहयोग करें</span>
              <span aria-hidden="true">·</span>
              <span lang="en">Contribute</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/sources/"
              data-vt="open"
              className="focus-ring inline-flex min-h-tap items-center rounded-pill border border-separator-strong bg-surface-raised px-5 text-subhead font-semibold text-dharma-text transition hover:border-dharma-saffron/50"
            >
              Sources
            </Link>
            <Link
              href="/methodology/"
              data-vt="open"
              className="focus-ring inline-flex min-h-tap items-center rounded-pill border border-separator-strong bg-surface-raised px-5 text-subhead font-semibold text-dharma-text transition hover:border-dharma-saffron/50"
            >
              Methodology
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
