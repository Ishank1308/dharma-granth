'use client';

import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY = 'dharma.pwa-banner-dismissed-until';
const DISMISS_DAYS = 14;

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. Check if recently dismissed
    try {
      const dismissedUntil = localStorage.getItem(STORAGE_KEY);
      if (dismissedUntil && Date.now() < Number(dismissedUntil)) {
        return;
      }
    } catch {
      // Storage unavailable
    }

    // 3. Detect iOS Safari
    const ua = window.navigator.userAgent;
    const isIosDevice = /iPhone|iPad|iPod/i.test(ua);
    const isSafari =
      isIosDevice &&
      /WebKit/i.test(ua) &&
      !/CriOS|FxiOS|OPiOS|mercury/i.test(ua);

    if (isSafari) {
      setIsIos(true);
      // Delay prompt appearance so user gets context first
      const timer = setTimeout(() => setVisible(true), 4000);
      return () => clearTimeout(timer);
    }

    // 4. Listen for Chrome/Android/Edge beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 3 seconds before showing banner so page content settles
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      const expiry = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
      localStorage.setItem(STORAGE_KEY, String(expiry));
    } catch {
      // Storage unavailable
    }
  }

  async function handleInstall() {
    if (isIos) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setVisible(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('PWA install prompt error', err);
    }
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        role="region"
        aria-label="Install App Banner"
        className="fixed bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 rounded-2xl border border-amber-300/40 dark:border-amber-700/40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md p-4 shadow-xl shadow-amber-900/10 dark:shadow-black/40 text-dharma-text"
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
              १००% ऑफ़लाइन · विज्ञापन-मुक्त · बिना किसी स्टोरेज भार के सीधा फोन पर।
            </p>

            {/* iOS Step Guide Popup */}
            {showIosInstructions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-300/50 text-xs text-amber-900 dark:text-amber-200"
              >
                <p className="font-semibold flex items-center gap-1 mb-1">
                  <Share className="h-3.5 w-3.5" />
                  <span>Safari में जोड़ने की विधि:</span>
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-[11px] leading-relaxed">
                  <li>नीचे Safari मेनू में <strong>Share</strong> (साझा) बटन दबाएँ।</li>
                  <li>सूची में नीचे स्क्रॉल करके <strong>&apos;Add to Home Screen&apos;</strong> चुनें।</li>
                </ol>
              </motion.div>
            )}

            {/* Action Row */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleInstall}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-saffron-600 hover:bg-saffron-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isIos ? 'iPhone पर जोड़ें' : 'इंस्टॉल करें'}</span>
              </button>

              <button
                type="button"
                onClick={dismiss}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-dharma-muted hover:text-dharma-text transition"
              >
                बाद में
              </button>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-3 right-3 text-dharma-muted hover:text-dharma-text p-1 rounded-full transition"
            aria-label="बंद करें"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
