import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy · गोपनीयता',
  description: 'How Dharma Granth handles browser storage, privacy and reader data.',
  alternates: { canonical: '/privacy/' },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-10"><p lang="hi" className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-300">गोपनीयता नीति</p><h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">Privacy</h1><p className="mt-3 text-sm text-dharma-muted">Last reviewed: October 22, 2026</p></header>
      <div className="space-y-8 leading-relaxed text-dharma-muted">
        <section><h2 className="font-serif text-xl font-bold text-dharma-text">Your study data stays in your browser</h2><p className="mt-2">Bookmarks, reading progress, notes, japa and meditation logs, reflections, vows, and study preferences are stored locally in your browser. Dharma Granth does not require an account and these features do not send that personal study data to a Dharma Granth account or synchronization server.</p><p className="mt-2">Clearing browser storage or changing devices can remove this data. You can export a JSON backup from Practice, Learn, or Settings and keep that file somewhere you control. Browser storage persistence is requested where supported, but the browser decides whether to grant it.</p></section>
        <section><h2 className="font-serif text-xl font-bold text-dharma-text">Website requests</h2><p className="mt-2">The site loads public pages, scripture text, and static assets from its hosting provider. The host may process ordinary technical request data such as IP address, browser details, and requested URLs to deliver and protect the service. No advertising trackers are used by the reading experience.</p></section>
        <section><h2 className="font-serif text-xl font-bold text-dharma-text">Open-source work and sources</h2><p className="mt-2">The project source and its contribution history are available in the <a className="underline decoration-saffron-500 underline-offset-2" href="https://github.com/Ishank567/dharma-granth" target="_blank" rel="noreferrer">Dharma Granth repository</a>. Scripture editions, translations, and editorial methods are described on the <a className="underline decoration-saffron-500 underline-offset-2" href="/sources/">Sources</a> and <a className="underline decoration-saffron-500 underline-offset-2" href="/methodology/">Methodology</a> pages.</p></section>
        <section><h2 className="font-serif text-xl font-bold text-dharma-text">Your choices</h2><p className="mt-2">You can clear this site’s browser data through your browser settings. Exported backup files are under your control; protect or delete them as you would other personal files.</p></section>
        <section lang="hi"><h2 className="font-devanagari text-xl font-bold text-dharma-text">आपका अध्ययन-डेटा आपके उपकरण पर रहता है</h2><p className="mt-2 font-devanagari">बुकमार्क, पठन-प्रगति, टिप्पणियाँ, जप-ध्यान का लेखा और अध्ययन-विकल्प आपके ब्राउज़र में सुरक्षित रहते हैं। खाता आवश्यक नहीं है। JSON बैकअप अपने नियंत्रण में रखें; ब्राउज़र का संग्रह मिटाने पर स्थानीय जानकारी भी हट सकती है।</p></section>
      </div>
    </main>
  );
}
