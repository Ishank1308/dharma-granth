import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import Link from 'next/link';
import { SCRIPTURE_COMPARISONS } from '@/data/scripture-comparisons';

export const metadata: Metadata = {
  title: 'शास्त्र साथ-साथ · Scripture pages side by side',
  description: 'Existing library pages listed beside each other. These notes do not decide a school.',
  alternates: { canonical: '/compare/' },
  openGraph: {
    title: 'शास्त्र साथ-साथ · Scripture pages side by side',
    description:
      'Existing library pages listed beside each other. These notes do not decide a school.',
    url: '/compare/',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ComparePage() {
  return (
    <main id="main" className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">शास्त्र साथ-साथ</span>
      </h1>
      <p className="mt-1 text-dharma-text-secondary">Scripture pages side by side</p>
      <p lang="hi" className="mt-3 text-sm leading-relaxed text-dharma-text">
        ये पृष्ठ साथ रखे गए हैं। कोई मत यहाँ तय नहीं किया गया। जो बात इस पुस्तकालय में नहीं है, वह यहाँ नहीं लिखी गई।
      </p>

      <div className="mt-8 space-y-6">
        {SCRIPTURE_COMPARISONS.map((item) => (
          <section key={item.id} id={item.id} className="scroll-mt-24 rounded-2xl border border-dharma-border bg-dharma-card p-5">
            <h2 className="font-serif text-xl font-bold text-dharma-text">
              <span lang="hi" className="font-devanagari">{item.titleHi}</span>
              <span className="font-normal text-dharma-text-secondary"> · {item.titleEn}</span>
            </h2>
            <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">{item.blurbHi}</p>
            <p className="mt-1 text-sm leading-relaxed text-dharma-text-secondary">{item.blurbEn}</p>
            <ul className="mt-4 space-y-3">
              {item.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-semibold text-saffron-600 underline underline-offset-2">
                    <span lang="hi" className="font-devanagari">{link.titleHi}</span>
                    <span className="font-normal text-dharma-text-secondary"> · {link.titleEn}</span>
                  </Link>
                  <p lang="hi" className="text-sm text-dharma-text">{link.noteHi}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
