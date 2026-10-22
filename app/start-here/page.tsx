import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Start Here · अपना अध्ययन मार्ग खोजें',
  description: 'This older onboarding URL has moved to the canonical Start page.',
  alternates: { canonical: '/start/' },
  robots: { index: false, follow: true },
};

export default function StartHerePage() {
  return (
    <main className="mx-auto flex min-h-[55vh] max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
      <meta httpEquiv="refresh" content="0;url=/start/" />
      <h1 className="font-serif text-3xl font-bold text-dharma-text">अब एक ही आरम्भ पृष्ठ है</h1>
      <p lang="en" className="mt-3 text-dharma-muted">This onboarding page has moved. Continue to the canonical start page.</p>
      <Link href="/start/" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-saffron-700 px-5 py-2.5 font-semibold text-white">आरम्भ करें · Continue</Link>
    </main>
  );
}
