import Link from 'next/link';
import { PerformanceToggle } from './PerformanceToggle';

/**
 * The site footer in the Apple idiom: small type on the page background, a hairline above,
 * one quiet line of the Shanti mantra, four short link columns and a bottom row.
 * English and Hindi labels are separate elements so crawlers never read them run together.
 */

interface FooterLink {
  href: string;
  en: string;
  hi: string;
}

const COLUMNS: Array<{ en: string; hi: string; links: FooterLink[] }> = [
  {
    en: 'Read',
    hi: 'पठन',
    links: [
      { href: '/scriptures/', en: 'Library', hi: 'ग्रन्थालय' },
      { href: '/scripture/bhagavadgita/', en: 'Bhagavad Gita', hi: 'भगवद्गीता' },
      { href: '/daily-verse/', en: 'Daily verse', hi: 'दैनिक श्लोक' },
      { href: '/ask/', en: 'Ask the scriptures', hi: 'ग्रन्थ से पूछिए' },
    ],
  },
  {
    en: 'Learn',
    hi: 'स्वाध्याय',
    links: [
      { href: '/learn/', en: 'Learning paths', hi: 'अध्ययन मार्ग' },
      { href: '/learn/journeys/', en: 'Guided journeys', hi: 'स्वाध्याय यात्राएँ' },
      { href: '/learn/plans/', en: 'Reading plans', hi: 'पठन योजनाएँ' },
      { href: '/learn/faq/', en: 'Scripture FAQs', hi: 'जिज्ञासा समाधान' },
    ],
  },
  {
    en: 'Practice',
    hi: 'साधना',
    links: [
      { href: '/practice/', en: 'Daily practice', hi: 'दैनिक साधना' },
      { href: '/panchang/', en: 'Panchang', hi: 'पञ्चाङ्ग' },
      { href: '/festivals/', en: 'Festivals', hi: 'उत्सव' },
      { href: '/wisdom-for-life/', en: 'Life guidance', hi: 'जीवन मार्गदर्शन' },
    ],
  },
  {
    en: 'About',
    hi: 'परिचय',
    links: [
      { href: '/sources/', en: 'Sources and editions', hi: 'स्रोत' },
      { href: '/methodology/', en: 'How this site is made', hi: 'पद्धति' },
      { href: '/about/funding/', en: 'How it is funded', hi: 'व्यय' },
      { href: '/contribute/', en: 'Contribute', hi: 'सहयोग' },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-dharma-text/10 bg-dharma-bg text-dharma-muted" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-[980px] px-5 pb-10 pt-8 text-xs leading-relaxed sm:px-6">
        <p className="border-b border-dharma-text/10 pb-5">
          <span lang="sa" className="text-[15px] text-dharma-text">
            सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ।
          </span>{' '}
          <span className="block sm:inline">May all be happy; may all be free from illness.</span>
        </p>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-6 py-6 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.en}>
              <h3 className="text-xs font-semibold text-dharma-text">
                <span>{col.en}</span>{' '}
                <span lang="hi" className="font-devanagari font-normal text-dharma-muted">
                  {col.hi}
                </span>
              </h3>
              <ul className="mt-1 sm:mt-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-block py-3 hover:text-dharma-text hover:underline sm:py-1"
                    >
                      <span>{link.en}</span>{' '}
                      <span lang="hi" className="font-devanagari">
                        {link.hi}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col gap-4 border-t border-dharma-text/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span>© {new Date().getFullYear()} Dharma Granth.</span>{' '}
            <span>Free, without ads or accounts. Your notes stay on your device.</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-5 [&>a]:inline-flex [&>a]:min-h-11 [&>a]:items-center sm:[&>a]:min-h-0">
            <Link href="/privacy/" className="hover:text-dharma-text hover:underline">
              Privacy
            </Link>
            <Link href="/terms/" className="hover:text-dharma-text hover:underline">
              Terms
            </Link>
            <Link href="/contact/" className="hover:text-dharma-text hover:underline">
              Contact
            </Link>
            <Link href="/how-dharma-granth-works/" className="hover:text-dharma-text hover:underline">
              How it works
            </Link>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <span>
            <span>Performance</span> <span aria-hidden="true">·</span>{' '}
            <span lang="hi" className="font-devanagari">कम डेटा या धीमे फ़ोन के लिए</span>
          </span>
          <PerformanceToggle />
        </div>
      </div>
    </footer>
  );
}
