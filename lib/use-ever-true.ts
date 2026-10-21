'use client';

import { useState } from 'react';

/**
 * True from the first render in which `value` is true, and stays true afterwards.
 * Used to load a dialog's code the first time it opens and then keep it mounted, so its exit animation still plays.
 */
export function useEverTrue(value: boolean): boolean {
  const [ever, setEver] = useState(value);
  if (value && !ever) setEver(true);
  return ever || value;
}
