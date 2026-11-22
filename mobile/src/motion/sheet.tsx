/**
 * A bottom sheet that moves like a sheet of paper: it rises on a spring, follows your finger when you drag
 * its top edge, and goes when you pull it far enough down or flick it. Let go short of that and it springs
 * back. The scrim behind it dims and clears with the sheet's position, so the page underneath is never cut
 * off by a flat grey cover.
 *
 * Tap the scrim, the Close button or Back to close it too: TalkBack users get the button and Back.
 *
 * With reduce motion the sheet simply appears and disappears; dragging still works, it just doesn't glide.
 *
 *   <Sheet visible={open} title={t(S.readingOptions)} onClose={() => setOpen(false)}>…</Sheet>
 */
import { useEffect, useState, type ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, Text, useWindowDimensions, View, type DimensionValue } from 'react-native';
import { GestureDetector, GestureHandlerRootView, usePanGesture } from 'react-native-gesture-handler';
import Animated, { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { IconButton } from '@/components/ui';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

import { hapticTap } from './haptics';
import { DURATION, SPRING } from './tokens';
import { useMotion } from './use-motion';

export interface SheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxHeight?: DimensionValue;
  /** Lift the sheet over the keyboard (sheets with a text field). */
  keyboard?: boolean;
}

/** Pulled down past this share of its height, or flicked faster than DISMISS_VELOCITY, the sheet goes. */
const DISMISS_SHARE = 0.28;
const DISMISS_VELOCITY = 900;

export function Sheet({ visible, onClose, title, children, maxHeight = '85%', keyboard }: SheetProps) {
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const { palette } = usePrefs();
  const { t } = useI18n();
  const { animate } = useMotion();

  // The Modal stays mounted until the sheet has slid away, so closing is seen, not just a cut.
  const [mounted, setMounted] = useState(visible);
  const height = useSharedValue(screenH);
  // How far below its resting place the sheet is: 0 is open, `height` is gone.
  const y = useSharedValue(screenH);
  const opened = useSharedValue(false);

  // Opening mounts at once; closing waits for the slide below (or unmounts at once with reduce motion).
  const [wasVisible, setWasVisible] = useState(visible);
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) setMounted(true);
    else if (!animate) setMounted(false);
  }

  useEffect(() => {
    if (visible || !animate) return;
    y.set(
      withTiming(height.get(), { duration: DURATION.quick + 40, easing: Easing.in(Easing.quad) }, (done) => {
        if (done) scheduleOnRN(setMounted, false);
      }),
    );
  }, [visible, animate, y, height]);

  useEffect(() => {
    if (mounted) return;
    opened.set(false);
    y.set(screenH);
  }, [mounted, opened, y, screenH]);

  const dismiss = () => {
    hapticTap();
    onClose();
  };

  const pan = usePanGesture({
    activeOffsetY: [-6, 6],
    failOffsetX: [-24, 24],
    onUpdate: (e) => {
      'worklet';
      // Down follows the finger; up gives a little, like paper held at the bottom.
      y.set(e.translationY > 0 ? e.translationY : e.translationY * 0.18);
    },
    onDeactivate: (e) => {
      'worklet';
      const h = height.get();
      if (e.translationY > h * DISMISS_SHARE || e.velocityY > DISMISS_VELOCITY) {
        y.set(
          withTiming(h, { duration: DURATION.quick, easing: Easing.out(Easing.quad) }, (done) => {
            if (done) scheduleOnRN(dismiss);
          }),
        );
      } else {
        y.set(animate ? withSpring(0, { ...SPRING.settle, velocity: e.velocityY }) : 0);
      }
    },
  });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  const scrimStyle = useAnimatedStyle(() => ({ opacity: interpolate(y.get(), [0, height.get()], [1, 0], Extrapolation.CLAMP) }));

  if (!mounted) return null;

  const sheet = (
    <Animated.View
      accessibilityViewIsModal
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        height.set(h);
        if (opened.get()) return;
        opened.set(true);
        if (animate) {
          y.set(h);
          y.set(withSpring(0, SPRING.sheet));
        } else {
          y.set(0);
        }
      }}
      style={[
        styles.sheet,
        { maxHeight, backgroundColor: palette.dark ? '#1c1c1e' : palette.card, paddingBottom: Math.max(insets.bottom, SPACE.lg) + SPACE.sm },
        !palette.lite && styles.lift,
        sheetStyle,
      ]}>
      {/* The top edge is the handle: grabber, title and Close. A drag starting anywhere on it moves the sheet. */}
      <GestureDetector gesture={pan}>
        <View>
          <View testID="sheet-grabber" style={styles.grabArea}>
            <View style={[styles.grabber, { backgroundColor: quietFill(palette) }]} />
          </View>
          <View style={styles.head}>
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flexShrink: 1, color: palette.text, fontSize: TYPE.title2, fontWeight: '700' }}>
              {title}
            </Text>
            <IconButton icon="close" onPress={onClose} accessibilityLabel={t(S.close)} color={palette.text} tone="quiet" />
          </View>
        </View>
      </GestureDetector>
      {children}
    </Animated.View>
  );

  return (
    <Modal visible transparent animationType="none" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      {/* A Modal is its own window on Android, so gestures inside it need their own root. */}
      <GestureHandlerRootView style={styles.fill}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.scrim, scrimStyle]}>
          {/* Tapping outside closes the sheet; screen readers use the Close button or Back instead. */}
          <Pressable style={styles.fill} onPress={onClose} accessible={false} importantForAccessibility="no" />
        </Animated.View>
        {keyboard ? (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboard} pointerEvents="box-none">
            {sheet}
          </KeyboardAvoidingView>
        ) : (
          <View style={styles.keyboard} pointerEvents="box-none">
            {sheet}
          </View>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scrim: { backgroundColor: 'rgba(0,0,0,0.38)' },
  keyboard: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: RADIUS.panel + 6,
    borderTopRightRadius: RADIUS.panel + 6,
    paddingHorizontal: SPACE.xl - 4,
  },
  lift: { boxShadow: '0 -8px 30px rgba(0,0,0,0.18)' },
  // A tall strip around the small grabber, so the drag is easy to start.
  grabArea: { alignItems: 'center', paddingTop: SPACE.sm, paddingBottom: SPACE.sm },
  grabber: { width: 40, height: 5, borderRadius: 3 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACE.sm },
});
