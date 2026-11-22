import { BookOpen, Home, Search } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: 'Sorry, the page you are looking for is not in the library yet.',
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
          <span lang="hi">पृष्ठ नहीं मिला</span> · Page Not Found
        </p>
        <h1 lang="hi" className="text-4xl md:text-5xl font-serif font-bold text-dharma-text mb-4">
          यह पथ ग्रंथालय में उपलब्ध नहीं है
        </h1>
        <p className="mb-3 text-base font-semibold text-dharma-text" lang="en">This path is not in the library.</p>
        <p className="text-base text-dharma-muted mb-10 max-w-lg mx-auto leading-relaxed">
          क्षमा करें, यह पृष्ठ हमें नहीं मिला। हो सकता है यह कहीं और चला गया हो, या यह श्लोक अभी संकलित न हुआ हो। आप ग्रंथालय में लौट सकते हैं या भगवद्गीता से आरम्भ कर सकते हैं।
          <span className="mt-2 block" lang="en">Sorry, we couldn’t find this page. It may have moved, or its text isn’t in the library yet. You’re welcome to browse the library or begin with the Bhagavad Gita.</span>
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
