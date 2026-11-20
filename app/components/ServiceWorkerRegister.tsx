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

    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
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

