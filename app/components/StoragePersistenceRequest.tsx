'use client';

import { useEffect } from 'react';

/** Ask the browser to preserve the reader's local progress when it supports the Storage API. */
export function StoragePersistenceRequest() {
  useEffect(() => {
    if (!navigator.storage?.persist) return;
    void navigator.storage.persist().catch(() => false);
  }, []);

  return null;
}
