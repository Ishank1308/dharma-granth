import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Use · उपयोग की शर्तें',
  description: 'Terms for using the Dharma Granth scripture library and study tools.',
  alternates: { canonical: '/terms/' },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 lg:py-16">
      <header className="mb-10"><p lang="hi" className="font-devanagari text-sm font-semibold text-saffron-700 dark:text-saffron-300">उपयोग की शर्तें</p><h1 className="mt-2 font-serif text-3xl font-bold text-dharma-text">Terms of Use</h1><p className="mt-3 text-sm text-dharma-muted">Last reviewed: October 22, 2026</p></header>
      <div className="space-y-8 leading-relaxed text-dharma-muted">
        <section><h2 className="font-serif text-xl font-bold text-dharma-text">Purpose</h2><p className="mt-2">Dharma Granth offers scripture texts, editions, translations, and study tools for personal learning. Editorial explanations are identified where shown and do not replace the source text, a teacher, or a scholarly edition.</p></section>
        <section><h2 className="font-serif text-xl font-bold text-dharma-text">Respect sources and rights</h2><p className="mt-2">Use scripture materials and project content in accordance with their displayed source notes, applicable licenses, and the terms of the relevant edition. Please retain attribution when sharing material and do not imply that a modern editorial explanation is a canonical scripture passage.</p></section>
        <section><h2 className="font-serif text-xl font-bold text-dharma-text">Local tools and backups</h2><p className="mt-2">Practice and study tools may save data in your browser. You are responsible for keeping any backup files you export. Importing a file can merge with or replace locally stored Dharma Granth data, according to the option you choose.</p></section>
        <section><h2 className="font-serif text-xl font-bold text-dharma-text">No professional advice</h2><p className="mt-2">The site is educational and reflective. It does not provide medical, mental-health, legal, or financial advice. Seek a qualified professional for decisions that require it.</p></section>
        <section lang="hi"><h2 className="font-devanagari text-xl font-bold text-dharma-text">उपयोग का उद्देश्य</h2><p className="mt-2 font-devanagari">यह ग्रंथालय व्यक्तिगत अध्ययन के लिए है। आधुनिक व्याख्या को मूल शास्त्रीय पाठ से अलग समझें। स्रोत-सूचनाओं और संबंधित संस्करणों के उपयोगाधिकार का सम्मान करें। अध्ययन-साधना के उपकरणों में स्थानीय जानकारी आपके ब्राउज़र में रह सकती है।</p></section>
      </div>
    </main>
  );
}
