import Link from 'next/link';
import { BookOpen, ExternalLink, Flame, Heart, MessageSquare, ShieldCheck } from 'lucide-react';
import { PerformanceToggle } from './PerformanceToggle';

export function SiteFooter() {
  return (
    <footer className="border-t border-dharma-border bg-dharma-card text-dharma-text" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      
      {/* Sacred Shanti Mantra Header */}
      <div className="border-b border-dharma-border/60 bg-dharma-card-soft py-10">
        <div className="mx-auto max-w-6xl px-5 text-center sm:px-6">
          <p lang="sa" className="font-devanagari text-xl font-bold leading-relaxed text-saffron-800 dark:text-saffron-300 sm:text-2xl">
            ॐ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।<br className="hidden sm:inline" /> सर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत् ॥
          </p>
          <p className="mt-3 text-xs italic text-dharma-muted">
            May all sentient beings be happy; may all be healthy; may all see good; may no one suffer sorrow. — Brihadaranyaka Upanishad
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Col 1: Identity & Ethos */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-saffron-600 text-white font-devanagari font-bold text-lg shadow-sm">
                ॐ
              </span>
              <span className="font-serif text-xl font-bold text-dharma-text">
                धर्म ग्रंथ · Dharma Granth
              </span>
            </div>
            <p className="text-sm leading-relaxed text-dharma-muted">
              An open, ad-free digital sanctuary dedicated to the reverent study of timeless Hindu scriptures in original Sanskrit, Hindi, and English.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              <span>100% Private · Zero tracking · Ad-free</span>
            </div>
          </div>

          {/* Col 2: Textual Sources & Editions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              Textual Sources & Editions
            </h3>
            <ul className="space-y-2 text-sm text-dharma-muted">
              <li>
                <span className="font-semibold text-dharma-text">Gita Press, Gorakhpur</span>
                <p className="text-xs">Primary editions for Sanskrit texts and traditional Hindi bhashya.</p>
              </li>
              <li>
                <span className="font-semibold text-dharma-text">BORI Critical Editions</span>
                <p className="text-xs">Bhandarkar Oriental Research Institute scholarly references.</p>
              </li>
              <li>
                <span className="font-semibold text-dharma-text">Sanskrit Documents Archive</span>
                <p className="text-xs">Standardized Devanagari encoding & IAST transliteration.</p>
              </li>
            </ul>
          </div>

          {/* Col 3: Methodology & Editorial Integrity */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              Methodology & Ethics
            </h3>
            <ul className="space-y-2 text-xs leading-relaxed text-dharma-muted">
              <li>
                <strong className="text-dharma-text">Canonical Distinction:</strong> Original Sanskrit root text (संहिता) is always kept distinct from translations, classical bhashya, and modern reflections.
              </li>
              <li>
                <strong className="text-dharma-text">Scholarly Transparency:</strong> AI-assisted translations and commentaries are flagged where they appear. They are not yet independently reviewed.
              </li>
              <li>
                <Link href="/methodology" className="inline-flex min-h-11 items-center font-semibold text-saffron-700 sm:min-h-0 underline-offset-2 hover:underline dark:text-saffron-400">
                  How this site is made →
                </Link>
              </li>
              <li>
                <strong className="text-dharma-text">Non-Sectarian:</strong> Honoring Advaita, Dvaita, Vishishtadvaita, and Bhakti commentaries with equal reverence.
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation & Corrections */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400">
              Navigation & Corrections
            </h3>
            {/* 44px rows on touch screens; the desktop list keeps its tight spacing. */}
            <nav className="flex flex-col text-sm text-dharma-muted [&>a]:py-3 sm:space-y-2 sm:[&>a]:py-0">
              <Link href="/scriptures" className="transition hover:text-saffron-700">
                ग्रंथालय (Scripture Library)
              </Link>
              <Link href="/scripture/bhagavadgita" className="transition hover:text-saffron-700">
                श्रीमद्भगवद्गीता (Bhagavad Gita)
              </Link>
              <Link href="/practice" className="transition hover:text-saffron-700">
                दैनिक साधना (Daily Sadhana)
              </Link>
              <Link href="/panchang" className="transition hover:text-saffron-700">
                वैदिक पंचांग (Vedic Panchang)
              </Link>
              <Link href="/festivals" className="transition hover:text-saffron-700">
                उत्सव ज्ञान केंद्र (Festivals)
              </Link>
              <Link href="/wisdom-for-life/" className="transition hover:text-saffron-700 font-medium text-saffron-700 dark:text-saffron-300">
                शास्त्रीय मार्गदर्शन (Life Guidance)
              </Link>
              <Link href="/wisdom-for-life" className="transition hover:text-saffron-700">
                जीवन स्थितियाँ (Life Situations)
              </Link>
              <Link href="/daily-verse" className="transition hover:text-saffron-700">
                दैनिक श्लोक (Daily Verse for WhatsApp)
              </Link>
              <Link href="/learn/paths" className="transition hover:text-saffron-700">
                स्वाध्याय मार्ग (Guided Paths)
              </Link>
              <Link href="/learn/plans" className="transition hover:text-saffron-700">
                पठन योजनाएँ (Reading Plans)
              </Link>
              <Link href="/learn/faq" className="transition hover:text-saffron-700">
                जिज्ञासा समाधान (Scripture FAQs)
              </Link>
              <Link href="/sources" className="transition hover:text-saffron-700">
                स्रोत पारदर्शिता (Sources & Editions)
              </Link>
              <Link href="/learn" className="transition hover:text-saffron-700">
                अध्ययन केंद्र (Learning Hub)
              </Link>
              <Link href="/contribute" className="transition hover:text-saffron-700 font-medium text-saffron-700 dark:text-saffron-400">
                ऐच्छिक सहयोग (Contribute & Support)
              </Link>
            </nav>

            <div className="pt-2">
              <a
                href="https://github.com/Ishank567/dharma-granth/issues"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-dharma-border bg-dharma-panel px-3 py-2 text-xs font-semibold text-dharma-text transition hover:border-saffron-400 hover:text-saffron-700"
              >
                <MessageSquare className="h-3.5 w-3.5 text-saffron-600" aria-hidden="true" />
                <span>Report a Correction / त्रुटि सुधार</span>
                <ExternalLink className="h-3 w-3 opacity-60" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Performance Mode & Data-Saver Controls */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-dharma-border/60 pt-6">
          <div className="text-xs text-dharma-muted">
            <span className="font-semibold text-dharma-text">कार्यक्षमता व अनुकूलन (Performance):</span> कम डेटा अथवा धीमी डिवाइस के लिए मोड चुनें।
          </div>
          <PerformanceToggle />
        </div>

        {/* Bottom bar */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-dharma-border/80 pt-6 text-xs text-dharma-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} Dharma Granth. Dedicated to knowledge and spiritual self-discovery.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center sm:gap-y-0 sm:[&>a]:min-h-0">
            <Link href="/privacy/" className="transition hover:text-dharma-text">Privacy · गोपनीयता</Link>
            <Link href="/terms/" className="transition hover:text-dharma-text">Terms · शर्तें</Link>
            <Link href="/contact/" className="transition hover:text-dharma-text">Contact · संपर्क</Link>
            <Link href="/practice" className="transition hover:text-dharma-text">
              Private Sadhana
            </Link>
            <Link href="/practice/dashboard/" className="transition hover:text-dharma-text">
              Personal Study
            </Link>
            <Link
              href="/contribute"
              className="inline-flex items-center gap-1 font-semibold text-saffron-700 dark:text-saffron-400 hover:underline"
            >
              <Heart className="h-3.5 w-3.5 text-saffron-600 fill-saffron-500/20" aria-hidden="true" />
              <span>सहयोग (Contribute)</span>
            </Link>
            <a
              href="https://github.com/Ishank567/dharma-granth"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-saffron-700 hover:underline"
            >
              Open Source
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
