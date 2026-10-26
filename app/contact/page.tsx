import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Feedback · संपर्क',
  description: 'Corrections and feedback for Dharma Granth.',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-8"><p lang="hi" className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-300">संपर्क और प्रतिक्रिया</p><h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">Contact &amp; Feedback</h1></header>
      <p className="leading-relaxed text-dharma-muted">Dharma Granth does not have a public channel for corrections and feedback yet. Once one is set up, it will be listed here.</p>
      <p lang="hi" className="mt-4 font-devanagari leading-relaxed text-dharma-muted">पाठ-सुधार और सुझाव भेजने का सार्वजनिक माध्यम अभी उपलब्ध नहीं है। उपलब्ध होने पर उसकी जानकारी यहीं दी जाएगी।</p>
    </main>
  );
}
