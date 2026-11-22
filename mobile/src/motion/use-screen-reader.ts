import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/** Whether TalkBack (or another screen reader) is on, so motion that hides controls can keep them in place. */
export function useScreenReader(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    // The web preview can't tell, and react-native-web always answers yes.
    if (Platform.OS === 'web') return;
    let live = true;
    AccessibilityInfo.isScreenReaderEnabled()
      .then((v) => live && setOn(v))
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener('screenReaderChanged', setOn);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return on;
}
