'use client';

import { useState } from 'react';
import type { SacredMantra } from '@/data/mantras';
import { Copy, Check, MessageCircle } from 'lucide-react';

export function MantraDetailClient({ mantra, pageUrl }: { mantra: SacredMantra; pageUrl: string }) {
  const [copied, setCopied] = useState(false);

  const fullShareText = `${mantra.titleHi} (${mantra.title})\n\n${mantra.sanskrit}\n\nभावार्थ: ${mantra.hindiMeaning}\n\nEnglish: ${mantra.englishMeaning}\n\nस्त्रोत: ${mantra.sourceCoordinates}\n${pageUrl}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(fullShareText)}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullShareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <section aria-labelledby="shloka-heading" className="my-5 rounded-3xl border border-dharma-border bg-dharma-card p-4 sm:p-8 shadow-sm">
      <h2 id="shloka-heading" className="sr-only">मन्त्र मूल पाठ व अर्थ</h2>

      {/* Sanskrit Shloka Box */}
      <div className="rounded-2xl bg-amber-50/70 dark:bg-amber-950/25 border border-amber-300/40 dark:border-amber-800/40 p-4 sm:p-6 text-center shadow-xs">
        <p
          lang="sa"
          className="font-devanagari text-xl sm:text-2xl md:text-3xl font-bold leading-[1.8] text-amber-950 dark:text-amber-100 selection:bg-saffron-500/30 whitespace-pre-line"
        >
          {mantra.sanskrit}
        </p>
        <p className="mt-2 font-serif text-xs sm:text-sm italic text-dharma-muted whitespace-pre-line">
          {mantra.transliteration}
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-b border-dharma-border/60 pb-4">
        <button
          type="button"
          onClick={onCopy}
          aria-label="Copy mantra and meaning"
          className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-bg px-4 text-xs sm:text-sm font-semibold text-dharma-text transition hover:border-saffron-400"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied to Clipboard!' : 'Copy Shloka'}</span>
        </button>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="focus-ring inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-50/60 dark:bg-emerald-950/20 px-4 text-xs sm:text-sm font-semibold text-emerald-800 dark:text-emerald-300 transition hover:bg-emerald-100/80"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Share on WhatsApp</span>
        </a>
      </div>

      {/* Translations */}
      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border border-dharma-border bg-dharma-bg/60 p-3.5 sm:p-5">
          <span className="font-devanagari text-xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-400 block mb-1.5">
            हिन्दी भावार्थ
          </span>
          <p lang="hi" className="font-devanagari text-base sm:text-lg leading-relaxed text-dharma-text">
            {mantra.hindiMeaning}
          </p>
        </div>

        <div className="rounded-2xl border border-dharma-border bg-dharma-bg/60 p-3.5 sm:p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-dharma-muted block mb-1.5">
            English Translation
          </span>
          <p className="font-serif text-sm sm:text-base italic leading-relaxed text-dharma-muted">
            &ldquo;{mantra.englishMeaning}&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

