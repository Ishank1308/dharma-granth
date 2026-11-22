import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact & Feedback · संपर्क',
  description:
    'How to check edition provenance, methodology, and upcoming feedback channels for textual corrections on the Dharma Granth scripture library.',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-8">
        <p lang="hi" className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-300">संपर्क और प्रतिक्रिया</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">Contact &amp; Feedback</h1>
      </header>
      <p className="leading-relaxed text-dharma-muted">
        Thank you for wanting to help. Dharma Granth does not have a public channel for corrections and feedback yet. As soon as one is ready, it will be listed here.
      </p>
      <p lang="hi" className="mt-4 font-devanagari leading-relaxed text-dharma-muted">
        सहयोग की इस भावना के लिए धन्यवाद। पाठ-सुधार और सुझाव भेजने का सार्वजनिक माध्यम अभी उपलब्ध नहीं है। तैयार होते ही उसकी जानकारी यहीं दी जाएगी।
      </p>
      <section className="mt-8 rounded-2xl border border-dharma-border bg-dharma-card/70 p-5 text-sm leading-relaxed text-dharma-muted">
        <h2 className="font-serif text-base font-bold text-dharma-text">Source Editions &amp; Editorial Transparency</h2>
        <p className="mt-2">
          While a public correction form is being prepared, you can inspect every scripture&apos;s printed edition, translator attribution, and verification status on our{' '}
          <Link href="/sources/" className="font-semibold text-saffron-700 underline underline-offset-2 dark:text-saffron-300">Sources</Link> and{' '}
          <Link href="/methodology/" className="font-semibold text-saffron-700 underline underline-offset-2 dark:text-saffron-300">Methodology</Link> pages.
        </p>
      </section>
    </main>
  );
}
