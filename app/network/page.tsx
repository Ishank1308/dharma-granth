import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Compass, Layers, Network, Sparkles } from 'lucide-react';
import { NetworkViewClient } from './NetworkViewClient';

export const metadata: Metadata = {
  title: 'ज्ञान जाल · Sacred Knowledge Graph & Philosophical Network',
  description:
    'Interactive relational network mapping core Vedic concepts, sacred dialogues, and canonical scripture linkages. Ad-free, lightweight, and deeply interconnected.',
};

export default function NetworkPage() {
  return (
    <main className="min-h-screen bg-dharma-bg px-4 py-8 md:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb / Top Navigation */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-dharma-muted hover:text-dharma-text transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>मुख्य पृष्ठ (Home)</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full border border-saffron-300 bg-saffron-50 px-2.5 py-0.5 text-xs font-bold text-saffron-800 dark:bg-saffron-950/40 dark:text-saffron-300">
            <Sparkles className="h-3 w-3" />
            <span>चरण ६ · Phase 6 Live</span>
          </span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-saffron-100 text-saffron-700 dark:bg-saffron-950/60 dark:text-saffron-400 mb-3 shadow-sm">
          <Network className="h-6 w-6" />
        </div>
        <h1 className="font-devanagari text-2xl md:text-3xl font-bold text-dharma-text mb-2">
          ज्ञान जाल एवं संवाद संबंध
        </h1>
        <p className="text-xs md:text-sm text-dharma-muted leading-relaxed">
          वेदों, उपनिषदों, गीता और पुराणों के १७ मूल दार्शनिक सिद्धांतों और पवित्र गुरु-शिष्य संवादों का अंतर्संबंधित वैचारिक मानचित्र।
        </p>
      </div>

      {/* Network Client with Lazy-Loading, Static Placeholder, and 2D List Fallback */}
      <NetworkViewClient />
    </main>
  );
}
