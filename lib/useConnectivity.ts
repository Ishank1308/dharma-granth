'use client';

import { useEffect, useState } from 'react';

const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH || '').replace(/\/$/, '');

/** null means the browser's initial connection status is still being checked. */
export function useConnectivity(): boolean | null {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    let controller: AbortController | null = null;

    const confirmConnection = async () => {
      controller?.abort();
      const requestController = new AbortController();
      controller = requestController;
      const timeout = window.setTimeout(() => requestController.abort(), 5000);
      try {
        const response = await fetch(`${BASE_PATH}/`, {
          method: 'HEAD',
          cache: 'no-store',
          signal: requestController.signal,
        });
        if (active && controller === requestController) setIsOnline(response.status < 500);
      } catch {
        if (active && controller === requestController) setIsOnline(false);
      } finally {
        window.clearTimeout(timeout);
      }
    };

    const handleOnline = () => {
      controller?.abort();
      controller = null;
      setIsOnline(true);
    };
    const handleOffline = () => {
      setIsOnline(null);
      void confirmConnection();
    };

    if (navigator.onLine) setIsOnline(true);
    else void confirmConnection();

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      active = false;
      controller?.abort();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
