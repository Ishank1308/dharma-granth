import { BookOpen, Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Path Not Found',
  description: 'The page you are looking for is not part of the library yet.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-dharma-bg flex items-center justify-center px-6 py-24">
      <div className="max-w-2xl w-full text-center">
        <div
          lang="sa"
          className="font-devanagari text-7xl text-saffron-700 opacity-90 mb-6 leading-none"
        >
          ॐ
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-saffron-700 font-semibold mb-3">
          पृष्ठ नहीं मिला · Page Not Found
        </p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-dharma-text mb-4">
          यह पथ ग्रंथालय में उपलब्ध नहीं है
        </h1>
        <p className="mb-3 text-base font-semibold text-dharma-text" lang="en">This path is not in the library.</p>
        <p className="text-base text-dharma-muted mb-10 max-w-lg mx-auto leading-relaxed">
          आपके द्वारा खोजा गया पृष्ठ उपलब्ध नहीं है, अथवा यह श्लोक अभी संकलित नहीं हुआ है। ग्रंथालय पर लौटें या भगवद्गीता से आरम्भ करें।
          <span className="mt-2 block" lang="en">The page you requested does not exist, or its text is not available yet. Return to the library or begin with the Bhagavad Gita.</span>
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-saffron-600 text-white px-5 py-3 rounded-full font-semibold hover:bg-saffron-700 transition"
          >
            <Home className="w-4 h-4" />
            मुख्य पृष्ठ · Home
          </a>
          <a
            href="/scriptures/"
            className="inline-flex items-center gap-2 bg-dharma-card border border-dharma-border text-dharma-text px-5 py-3 rounded-full font-semibold hover:bg-dharma-bg transition"
          >
            <Search className="w-4 h-4" />
            ग्रंथालय · Browse the Library
          </a>
          <a
            href="/scripture/bhagavadgita/"
            className="inline-flex items-center gap-2 bg-dharma-card border border-dharma-border text-dharma-text px-5 py-3 rounded-full font-semibold hover:bg-dharma-bg transition"
          >
            <BookOpen className="w-4 h-4" />
            गीता पढ़ें · Read the Gita
          </a>
        </div>
      </div>
    </main>
  );
}
