import { useScrollToTop } from 'expo-router';
import { useRef, type RefObject } from 'react';

/**
 * Tapping the tab you are already on scrolls its screen back to the top, as on iOS and One UI. Every tab
 * does this the same way: put the returned ref on the screen's main scroll view or list.
 */
export function useTabTop<T = unknown>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  // The hook finds scrollTo / scrollToOffset / getScrollResponder at runtime; its typings are narrower.
  useScrollToTop(ref as unknown as Parameters<typeof useScrollToTop>[0]);
  return ref;
}
