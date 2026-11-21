import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconButton } from '@/components/ui';
import { S, useI18n, type Msg } from '@/i18n';
import { useAppState } from '@/state/app-state';
import { huesFor, quietFill, RADIUS, SPACE, TEXT_SCALES, THEME_ORDER, THEMES, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

type ShowKey = 'showTransliteration' | 'showHindi' | 'showEnglish' | 'showNotes';

/**
 * Every reading choice in one place, as the website's Aa sheet: text size, theme and what each verse shows.
 * It writes the same settings as the Settings tab, so the two always agree.
 */
export function ReadingSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const insets = useSafeAreaInsets();
  const { palette, settings, updateSettings } = useAppState();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const layers: { key: ShowKey; label: Msg; dot?: string }[] = [
    { key: 'showTransliteration', label: S.showTransliteration },
    { key: 'showHindi', label: S.showHindi, dot: hues.peacock },
    { key: 'showEnglish', label: S.showEnglish, dot: hues.indigo },
    { key: 'showNotes', label: S.showNotes, dot: hues.saffron },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent navigationBarTranslucent onRequestClose={onClose}>
      {/* Tapping outside closes the sheet; screen readers use the Close button or Back instead. */}
      <Pressable style={styles.scrim} onPress={onClose} accessible={false} importantForAccessibility="no" />
      <View
        accessibilityViewIsModal
        style={[
          styles.sheet,
          { backgroundColor: palette.dark ? '#1c1c1e' : palette.card, paddingBottom: Math.max(insets.bottom, SPACE.lg) + SPACE.sm },
        ]}>
        <View style={[styles.grabber, { backgroundColor: quietFill(palette) }]} />
        <View style={styles.head}>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '700' }}>
            {t(S.readingOptions)}
          </Text>
          <IconButton icon="close" onPress={onClose} accessibilityLabel={t(S.close)} color={palette.text} tone="quiet" />
        </View>
        <ScrollView contentContainerStyle={{ rowGap: SPACE.lg }}>
          <View>
            <Text style={[styles.label, { color: palette.muted }]}>{t(S.textSize)}</Text>
            <View style={[styles.segment, { backgroundColor: quietFill(palette) }]}>
              {TEXT_SCALES.map((s, i) => {
                const active = Math.abs(settings.textScale - s) < 0.01;
                return (
                  <Pressable
                    key={s}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={t(S.textSizeA11y(Math.round(s * 100)))}
                    onPress={() => updateSettings({ textScale: s })}
                    style={[styles.segmentItem, active && { backgroundColor: palette.dark ? '#3a3a3c' : '#ffffff' }]}>
                    <Text allowFontScaling={false} style={{ color: active ? palette.accent : palette.text, fontSize: 13 + i * 3, fontWeight: '600' }}>
                      अ
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: palette.muted }]}>{t(S.theme)}</Text>
            <View style={styles.themes}>
              {THEME_ORDER.map((name) => {
                const theme = THEMES[name];
                const active = settings.theme === name;
                const label = lang === 'hi' ? theme.labelHi : theme.label;
                return (
                  <Pressable
                    key={name}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    accessibilityLabel={t(S.themeA11y(label))}
                    onPress={() => updateSettings({ theme: name })}
                    style={[
                      styles.theme,
                      { backgroundColor: theme.bg, borderColor: active ? palette.accent : theme.border, borderWidth: active ? 2.5 : 1 },
                    ]}>
                    <Text maxFontSizeMultiplier={1.4} style={{ color: active ? theme.accent : theme.text, fontSize: TYPE.footnote, fontWeight: '700' }}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: palette.muted }]}>{t(S.showInVerses)}</Text>
            <View style={styles.layers}>
              {layers.map((l) => {
                const on = settings[l.key];
                return (
                  <Pressable
                    key={l.key}
                    accessibilityRole="switch"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={t(l.label)}
                    onPress={() => updateSettings({ [l.key]: !on })}
                    style={[
                      styles.layer,
                      on ? { backgroundColor: palette.text } : { borderWidth: 1, borderColor: palette.border },
                    ]}>
                    {l.dot ? <View style={[styles.dot, { backgroundColor: l.dot }]} /> : null}
                    <Text maxFontSizeMultiplier={1.5} style={{ color: on ? palette.bg : palette.text, fontSize: TYPE.subhead, fontWeight: on ? '700' : '500' }}>
                      {t(l.label)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: SPACE.sm }}>{t(S.sanskritAlwaysFull)}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    maxHeight: '85%',
    borderTopLeftRadius: RADIUS.panel + 6,
    borderTopRightRadius: RADIUS.panel + 6,
    paddingHorizontal: SPACE.xl - 4,
    paddingTop: SPACE.sm,
  },
  grabber: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, marginBottom: SPACE.sm },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACE.sm },
  label: { fontSize: TYPE.footnote, fontWeight: '600', marginBottom: SPACE.sm, paddingHorizontal: SPACE.xs },
  segment: { flexDirection: 'row', borderRadius: RADIUS.control + 4, padding: 4 },
  segmentItem: { flex: 1, minHeight: TOUCH, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center' },
  themes: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  theme: { flexGrow: 1, flexBasis: '22%', minHeight: TOUCH + 8, borderRadius: RADIUS.row, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACE.xs },
  layers: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  layer: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH - 4, paddingHorizontal: SPACE.md + 2, borderRadius: RADIUS.pill },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
