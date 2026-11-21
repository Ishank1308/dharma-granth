/**
 * A short confirmation that floats up above the bottom bar, with an optional Undo, then leaves on its own.
 *
 * Why a toast and not a dialog: an action that can be undone is better confirmed after the fact than
 * questioned before it (Nielsen's "user control and freedom"), and the reader never has to stop reading to
 * dismiss anything. TalkBack hears the message as an announcement.
 *
 * Timings follow NN/g: it enters in under 300 ms on a spring and leaves faster (180 ms) than it came. It stays
 * four seconds, long enough to reach Undo with a thumb. With reduce motion it appears and disappears without
 * moving.
 *
 *   const toast = useToast();
 *   toast.show(t(S.toastSaved), { action: { label: t(S.undo), onPress: undo }, icon: 'bookmark' });
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react';
import { AccessibilityInfo, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAppState } from '@/state/app-state';
import { BAR_GAP, BAR_HEIGHT, RADIUS, SPACE, TOUCH, TYPE, type Palette } from '@/theme/themes';

import { DURATION, SPRING } from './tokens';
import { useMotion } from './use-motion';

type IconName = ComponentProps<typeof Ionicons>['name'];

interface ToastOptions {
  action?: { label: string; onPress: () => void };
  icon?: IconName;
}

interface ToastApi {
  show: (message: string, options?: ToastOptions) => void;
}

interface Current extends ToastOptions {
  id: number;
  message: string;
}

const Ctx = createContext<ToastApi>({ show: () => {} });

const VISIBLE_MS = 4000;

export function useToast(): ToastApi {
  return useContext(Ctx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Current | null>(null);
  const seq = useRef(0);
  const show = useCallback((message: string, options?: ToastOptions) => {
    seq.current += 1;
    setCurrent({ id: seq.current, message, ...options });
    AccessibilityInfo.announceForAccessibility(message);
  }, []);
  const api = useMemo(() => ({ show }), [show]);
  return (
    <Ctx.Provider value={api}>
      {children}
      {current ? <ToastView key={current.id} toast={current} onDone={() => setCurrent((c) => (c?.id === current.id ? null : c))} /> : null}
    </Ctx.Provider>
  );
}

function ToastView({ toast, onDone }: { toast: Current; onDone: () => void }) {
  const { palette } = useAppState();
  const { animate } = useMotion();
  const insets = useSafeAreaInsets();
  const shown = useSharedValue(0);

  useEffect(() => {
    shown.set(animate ? withSpring(1, SPRING.settle) : withTiming(1, { duration: 0 }));
    const hide = setTimeout(() => {
      shown.set(withTiming(0, { duration: animate ? DURATION.quick : 0 }));
      setTimeout(onDone, animate ? DURATION.quick : 0);
    }, VISIBLE_MS);
    return () => clearTimeout(hide);
    // onDone changes identity each render of the provider; the timer belongs to this toast only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate, shown]);

  const style = useAnimatedStyle(() => ({
    opacity: shown.value,
    transform: [{ translateY: (1 - shown.value) * 24 }, { scale: 0.96 + shown.value * 0.04 }],
  }));

  const ink = toastInk(palette);
  // Above the floating tab bar or the reader's toolbar, wherever the screen keeps its bottom controls.
  const bottom = Math.max(insets.bottom, SPACE.sm) + BAR_GAP + BAR_HEIGHT + SPACE.sm;

  return (
    <View pointerEvents="box-none" style={[StyleSheet.absoluteFill, { justifyContent: 'flex-end', alignItems: 'center' }]}>
      <Animated.View
        accessibilityLiveRegion="polite"
        style={[
          styles.toast,
          { backgroundColor: ink.surface, bottom },
          !palette.lite && { boxShadow: palette.dark ? '0 12px 30px rgba(0,0,0,0.6)' : '0 12px 30px rgba(30,20,10,0.28)' },
          style,
        ]}>
        {toast.icon ? <Ionicons name={toast.icon} size={18} color={TOAST_GILT} /> : null}
        <Text maxFontSizeMultiplier={1.6} style={{ flexShrink: 1, color: ink.text, fontSize: TYPE.subhead, fontWeight: '500' }}>
          {toast.message}
        </Text>
        {toast.action ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={8}
            onPress={() => {
              toast.action?.onPress();
              shown.set(withTiming(0, { duration: animate ? DURATION.quick : 0 }));
              setTimeout(onDone, animate ? DURATION.quick : 0);
            }}
            style={({ pressed }) => [styles.action, { opacity: pressed ? 0.6 : 1 }]}>
            <Text maxFontSizeMultiplier={1.6} style={{ color: TOAST_ACTION, fontSize: TYPE.subhead, fontWeight: '700' }}>
              {toast.action.label}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

/**
 * The toast is drawn in ink, the reverse of the page, so it reads as news rather than as one more glass
 * surface stacked on the glass bar under it. Gilt icon and amber action, as on the book covers.
 */
const TOAST_GILT = '#f6c768';
const TOAST_ACTION = '#ffb340';
function toastInk(palette: Palette): { surface: string; text: string } {
  if (palette.dark) return { surface: 'rgba(58,58,60,0.97)', text: '#f5f5f7' };
  const hex = palette.text.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return { surface: `rgba(${r}, ${g}, ${b}, ${palette.lite ? 1 : 0.95})`, text: palette.card };
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: SPACE.lg,
    right: SPACE.lg,
    minHeight: TOUCH + 4,
    borderRadius: RADIUS.row,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    paddingLeft: SPACE.lg,
    paddingRight: SPACE.sm,
  },
  action: { minHeight: TOUCH, minWidth: TOUCH, paddingHorizontal: SPACE.md, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
});
