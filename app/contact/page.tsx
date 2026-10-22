import type { Metadata } from 'next';
import { ExternalLink, MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact & Feedback · संपर्क',
  description: 'Send a correction, source suggestion, or general feedback about Dharma Granth.',
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-8"><p lang="hi" className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-300">संपर्क और प्रतिक्रिया</p><h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">Contact &amp; Feedback</h1><p className="mt-3 leading-relaxed text-dharma-muted">Share a correction, a source reference, an accessibility concern, or a suggestion for the site.</p></header>
      <a href="https://github.com/Ishank567/dharma-granth/issues" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-saffron-700 px-5 py-3 font-semibold text-white transition hover:bg-saffron-800">
        <MessageSquare className="size-4" aria-hidden="true" /> Open a feedback issue <ExternalLink className="size-4" aria-hidden="true" />
      </a>
      <p lang="hi" className="mt-6 font-devanagari leading-relaxed text-dharma-muted">श्लोक-स्रोत या पाठ-सुधार भेजते समय ग्रंथ का नाम, अध्याय और श्लोक संख्या लिखें। कृपया सार्वजनिक प्रतिक्रिया में निजी जानकारी साझा न करें।</p>
      <p className="mt-4 text-sm leading-relaxed text-dharma-muted">The site and its source code are maintained in the <a href="https://github.com/Ishank567/dharma-granth" target="_blank" rel="noreferrer" className="underline decoration-saffron-500 underline-offset-2">open-source repository</a>. Feedback is handled through GitHub Issues; please do not include private data in a public report.</p>
    </main>
  );
}
