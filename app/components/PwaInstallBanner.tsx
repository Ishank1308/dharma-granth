'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { PwaInstallCard } from './PwaInstallCard';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY = 'dharma.pwa-banner-dismissed-until';
const DISMISS_DAYS = 14;
// The offer waits for a returning reader: a first visit is for the texts, not an install prompt.
const VISITS_KEY = 'dharma.visit-count';
const VISIT_COUNTED_KEY = 'dharma.visit-counted';
const MIN_VISITS = 2;

/** Counts this browser session once and returns how many sessions this browser has had. */
function countVisit(): number {
  try {
    let visits = Number(localStorage.getItem(VISITS_KEY)) || 0;
    if (!sessionStorage.getItem(VISIT_COUNTED_KEY)) {
      visits += 1;
      localStorage.setItem(VISITS_KEY, String(visits));
      sessionStorage.setItem(VISIT_COUNTED_KEY, '1');
    }
    return visits;
  } catch {
    return 0;
  }
}

export function PwaInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  const [Card, setCard] = useState<typeof PwaInstallCard | null>(null);

  // The card's markup is fetched only once there is an offer to show. If the fetch fails
  // (offline), there is simply no offer this time.
  useEffect(() => {
    if (!visible) return;
    import('./PwaInstallCard').then((m) => setCard(() => m.PwaInstallCard)).catch(() => {});
  }, [visible]);

  useEffect(() => {
    // 1. Check if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return;
    }

    // 2. First visit, or recently dismissed: not now
    if (countVisit() < MIN_VISITS) {
      return;
    }
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

  // Never over the text being read: the offer waits for a non-reading page.
  const reading = /^\/scripture\/[^/]+\/chapter\//.test(pathname ?? '');
  if (!visible || reading || !Card) return null;

  return <Card isIos={isIos} showIosInstructions={showIosInstructions} onInstall={handleInstall} onDismiss={dismiss} />;
}
