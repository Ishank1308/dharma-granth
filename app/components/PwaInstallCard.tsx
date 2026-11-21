'use client';

import { Download, Share, X } from 'lucide-react';
import Image from 'next/image';

/**
 * The install offer itself. PwaInstallBanner decides when there is an offer to make and fetches
 * this file only then, so no page carries the card's markup for a banner most visits never show.
 */
export function PwaInstallCard({
  isIos,
  showIosInstructions,
  onInstall,
  onDismiss,
}: {
  isIos: boolean;
  showIosInstructions: boolean;
  onInstall: () => void;
  onDismiss: () => void;
}) {
  return (
    <aside
      role="region"
      aria-label="Install App Banner"
      className="chrome-rise fixed bottom-[calc(4.25rem+env(safe-area-inset-bottom,0px))] left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md lg:bottom-4 z-40 rounded-2xl border border-amber-300/40 dark:border-amber-700/40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-4 shadow-xl shadow-amber-900/10 dark:shadow-black/40 text-dharma-text"
    >
      <div className="flex items-start gap-3.5">
        {/* App Icon */}
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl border border-amber-400/50 shadow-sm bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xl">
          <Image
            src="/icons/icon-192.png"
            alt="Dharma Granth Logo"
            width={48}
            height={48}
            className="object-cover"
            onError={(e) => {
              // Fallback to stylized Om if image fails
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <span className="absolute font-devanagari text-2xl text-amber-100 drop-shadow">
            ॐ
          </span>
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 pr-5">
          <h4 className="text-sm font-semibold font-serif text-dharma-text flex items-center gap-1.5">
            <span>Dharma Granth ऍप इंस्टॉल करें</span>
          </h4>
          <p className="text-xs text-dharma-muted mt-0.5 leading-snug">
            100% ऑफ़लाइन · विज्ञापन-मुक्त · बिना किसी स्टोरेज भार के सीधा फोन पर।
          </p>

          {/* iOS Step Guide Popup */}
          {showIosInstructions && (
            <div
              className="chrome-fade mt-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300/50 text-xs text-amber-900 dark:text-amber-200"
            >
              <p className="font-semibold flex items-center gap-1 mb-1">
                <Share className="h-3.5 w-3.5" />
                <span>Safari में जोड़ने की विधि:</span>
              </p>
              <ol className="list-decimal list-inside space-y-0.5 text-[11px] leading-relaxed">
                <li>नीचे Safari मेनू में <strong>Share</strong> (साझा) बटन दबाएँ।</li>
                <li>सूची में नीचे स्क्रॉल करके <strong>&apos;Add to Home Screen&apos;</strong> चुनें।</li>
              </ol>
            </div>
          )}

          {/* Action Row */}
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onInstall}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isIos ? 'iPhone पर जोड़ें' : 'इंस्टॉल करें'}</span>
            </button>

            <button
              type="button"
              onClick={onDismiss}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-dharma-muted hover:text-dharma-text transition"
            >
              बाद में
            </button>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          type="button"
          onClick={onDismiss}
          className="absolute top-3 right-3 text-dharma-muted hover:text-dharma-text p-1 rounded-full transition"
          aria-label="बंद करें"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
