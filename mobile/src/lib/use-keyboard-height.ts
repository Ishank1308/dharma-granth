import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

/**
 * The on-screen keyboard's height above the navigation bar, or 0 while it is hidden. The app draws edge to
 * edge, so Android no longer shrinks the window for the keyboard: a bar pinned to the bottom lifts itself by
 * this much (plus the navigation bar inset) to stay just above the keys.
 */
export function useKeyboardHeight(): number {
  const [height, setHeight] = useState(() => (Keyboard.isVisible() ? (Keyboard.metrics()?.height ?? 0) : 0));
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return height;
}
