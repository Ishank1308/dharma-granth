'use client';

import { useEffect } from 'react';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Registers /sw.js (production only) so opened pages keep working offline.
 * Automatically checks for updates and seamlessly reloads when a new version activates.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    // In automated testing environments (e.g. Playwright / WebDriver), never auto-reload
    if (typeof navigator !== 'undefined' && 'webdriver' in navigator && (navigator as { webdriver?: boolean }).webdriver) {
      navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch(() => {});
      return;
    }

    // Only reload on controllerchange if a previous service worker was already controlling
    // the page. On fresh installs (where controller was initially null), the page is already
    // rendering the latest assets and must not trigger an unexpected reload.
    const hadController = Boolean(navigator.serviceWorker.controller);

    let refreshing = false;
    const onControllerChange = () => {
      if (!hadController || refreshing) return;
      refreshing = true;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

    navigator.serviceWorker
      .register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` })
      .then((reg) => {
        // Check for updates on register and when user refocuses the tab
        reg.update().catch(() => {});

        const onVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            reg.update().catch(() => {});
          }
        };

        document.addEventListener('visibilitychange', onVisibilityChange);
        return () => document.removeEventListener('visibilitychange', onVisibilityChange);
      })
      .catch(() => {});

    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
    };
  }, []);

  return null;
}

