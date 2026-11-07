import type { Metadata } from 'next';
import { OfflineLibraryManager } from '@/app/components/scripture/OfflineLibraryManager';

export const metadata: Metadata = {
  title: 'Saved offline',
  description: 'Scriptures saved on this device for reading without a network. Nothing leaves your device.',
  alternates: { canonical: '/practice/saved/' },
  robots: { index: false, follow: true },
};

export default function SavedPage() {
  return (
    <main className="min-h-screen bg-dharma-bg px-5 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
          <span lang="hi" className="font-devanagari">ऑफ़लाइन ग्रंथालय</span> · Offline library
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text sm:text-4xl">Saved on this device</h1>
        <p className="mt-2 text-dharma-muted">
          Scriptures you save for offline reading live in this browser only. Use the button in a scripture&apos;s header to add one.
          Your bookmarks and notes are on the <a className="font-semibold underline" href="/practice/bookmarks/">bookmarks page</a>.
        </p>
        <OfflineLibraryManager />
      </div>
    </main>
  );
}
