/**
 * Small building blocks for settings-like screens (Settings and the first-run welcome), kept out of
 * components/ui.tsx so the visual layers that restyle the shared kit and these behaviour pieces can change
 * independently.
 *
 * - Disclosure: a row that opens to show the rarely used part of a screen (progressive disclosure). The
 *   row says what is inside and the current value, so most readers never need to open it.
 * - WeekdayPicker: seven day toggles, read by TalkBack as checkboxes.
 * - ThemePicker, TextSizePicker, ReminderTimeButton: the same controls in Settings and in the welcome, so a
 *   choice looks and behaves the same wherever the reader meets it.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { accentFill, Bilingual, glass, GroupCard, GroupRow, IconTile } from '@/components/ui';
import { S, useI18n, type Msg } from '@/i18n';
import { formatReminderTime } from '@/lib/reminder';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { hapticSelect } from '@/motion/haptics';
import { useMotion } from '@/motion/use-motion';
import { usePrefs } from '@/state/app-state';
import { RADIUS, scriptSize, SPACE, TEXT_SCALES, THEME_ORDER, THEMES, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

type IconName = ComponentProps<typeof Ionicons>['name'];

export function Disclosure({
  title,
  summary,
  icon,
  color,
  children,
  initiallyOpen = false,
}: {
  title: Msg;
  /** The current state in a few words ("Automatic", "3 saved"), shown under the title while closed. */
  summary?: string;
  icon: IconName;
  color: string;
  children: ReactNode;
  initiallyOpen?: boolean;
}) {
  const { palette, lang } = usePrefs();
  const { animate } = useMotion();
  const [open, setOpen] = useState(initiallyOpen);
  const label = lang === 'hi' ? title.hi : title.en;
  return (
    <View style={styles.disclosure}>
      <GroupCard>
        <GroupRow
          standalone
          inset={60}
          onPress={() => {
            hapticSelect();
            setOpen((o) => !o);
          }}
          accessibilityLabel={summary ? `${label}. ${summary}` : label}
          // TalkBack says "expanded" or "collapsed", so the row is understood without seeing the chevron.
          {...({ accessibilityState: { expanded: open } } as object)}>
          <IconTile icon={icon} color={color} />
          <View style={{ flex: 1, rowGap: 2 }}>
            <Bilingual {...title} weight="500" />
            {summary && !open ? (
              <Text maxFontSizeMultiplier={UI_FONT_CAP} numberOfLines={1} style={{ color: palette.muted, fontSize: scriptSize(TYPE.footnote, lang) }}>
                {summary}
              </Text>
            ) : null}
          </View>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={palette.muted} />
        </GroupRow>
      </GroupCard>
      {open ? (
        <Animated.View entering={animate ? FadeIn.duration(180) : undefined} style={styles.body}>
          {children}
        </Animated.View>
      ) : null}
    </View>
  );
}

/** Seven day toggles, Sunday first. At least one day always stays on (turning the reminder off is its own switch). */
export function WeekdayPicker({
  days,
  onChange,
  initials,
  names,
}: {
  days: number[];
  onChange: (days: number[]) => void;
  /** Comma-separated initials, Sunday first (S.weekdayInitials). */
  initials: string;
  /** Comma-separated full day names, Sunday first, for TalkBack. */
  names: string;
}) {
  const { palette, lang } = usePrefs();
  const letters = initials.split(',');
  const full = names.split(',');
  const on = new Set(days);
  return (
    <View style={styles.week}>
      {letters.map((letter, d) => {
        const checked = on.has(d);
        const lastOne = checked && on.size === 1;
        return (
          <Pressable
            key={d}
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled: lastOne }}
            accessibilityLabel={full[d]}
            disabled={lastOne}
            hitSlop={{ left: 2, right: 2 }}
            onPress={() => {
              hapticSelect();
              const next = new Set(on);
              if (checked) next.delete(d);
              else next.add(d);
              onChange([...next].sort((a, b) => a - b));
            }}
            style={({ pressed }) => [
              styles.day,
              checked ? { backgroundColor: palette.text } : glass(palette),
              { opacity: pressed ? 0.75 : 1 },
            ]}>
            <Text
              maxFontSizeMultiplier={UI_FONT_CAP}
              style={{ color: checked ? palette.bg : palette.text, fontWeight: '700', fontSize: scriptSize(TYPE.footnote, lang) }}>
              {letter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** The four themes as small pages in their own colours. */
export function ThemePicker() {
  const { palette, settings, updateSettings, lang } = usePrefs();
  const { t } = useI18n();
  // At large system font sizes the four theme names no longer fit in one row; show them two by two.
  const { fontScale } = useWindowDimensions();
  const twoRows = fontScale > 1.3;
  return (
    <View style={styles.themes} accessibilityRole="radiogroup">
      {THEME_ORDER.map((name) => {
        const theme = THEMES[name];
        const active = settings.theme === name;
        return (
          <Pressable
            key={name}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={t(S.themeA11y(lang === 'hi' ? theme.labelHi : theme.label))}
            onPress={() => updateSettings({ theme: name })}
            style={[styles.theme, twoRows && styles.themeHalf]}>
            {/* A small page in the theme's own colours: the Gita's first word in the shloka face, then two lines of text. */}
            <View
              style={[
                styles.preview,
                { backgroundColor: theme.bg, borderColor: active ? palette.accent : theme.border, borderWidth: active ? 2.5 : 1 },
              ]}>
              <Text allowFontScaling={false} numberOfLines={1} style={{ fontFamily: SANSKRIT_FONT, color: theme.dark ? theme.gold : theme.text, fontSize: 15, lineHeight: 24 }}>
                धर्मक्षेत्रे
              </Text>
              <View style={[styles.previewLine, { backgroundColor: theme.border }]} />
              <View style={[styles.previewLine, { width: '80%', backgroundColor: theme.border }]} />
              <View style={[styles.previewDot, { backgroundColor: theme.accent }]} />
            </View>
            <Text style={{ color: active ? palette.accent : palette.text, fontWeight: active ? '700' : '500', fontSize: TYPE.footnote }}>
              {lang === 'hi' ? theme.labelHi : theme.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** The reader's text sizes, each shown as an अ at that size. */
export function TextSizePicker() {
  const { palette, settings, updateSettings } = usePrefs();
  const { t } = useI18n();
  return (
    <View style={styles.scales} accessibilityRole="radiogroup">
      {TEXT_SCALES.map((s) => {
        const active = Math.abs(settings.textScale - s) < 0.01;
        return (
          <Pressable
            key={s}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={t(S.textSizeA11y(Math.round(s * 100)))}
            onPress={() => updateSettings({ textScale: s })}
            style={[styles.scale, active ? accentFill(palette) : glass(palette)]}>
            <Text style={{ color: active ? palette.onAccent : palette.text, fontSize: 14 * s, fontWeight: '700' }}>अ</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/** The daily verse time as a capsule that opens the phone's own clock picker. */
export function ReminderTimeButton() {
  const { palette, settings, updateSettings } = usePrefs();
  const { t } = useI18n();
  const time = new Date(2000, 0, 1, settings.reminderHour, settings.reminderMinute);
  const setTime = (d: Date) => updateSettings({ reminderHour: d.getHours(), reminderMinute: d.getMinutes() });
  const label = formatReminderTime(settings.reminderHour, settings.reminderMinute);
  if (Platform.OS === 'ios') {
    return <DateTimePicker mode="time" display="compact" value={time} onValueChange={(_e, d) => setTime(d)} />;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(S.reminderTimeA11y(label))}
      onPress={() => DateTimePickerAndroid.open({ mode: 'time', value: time, onValueChange: (_e, d) => setTime(d) })}
      style={[styles.timeBtn, glass(palette, true)]}>
      <Text style={{ color: palette.accent, fontWeight: '700', fontSize: TYPE.callout }}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  themes: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  themeHalf: { flexBasis: '45%' },
  theme: { flex: 1, alignItems: 'center', rowGap: 6, minHeight: TOUCH },
  preview: { alignSelf: 'stretch', height: 72, borderRadius: RADIUS.row, padding: 10, rowGap: 5 },
  previewLine: { height: 5, borderRadius: 3 },
  previewDot: { position: 'absolute', right: 8, bottom: 8, width: 10, height: 10, borderRadius: 5 },
  scales: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  // Minimum sizes, not fixed ones: the अ preview grows with the system font size and must not spill out.
  scale: { minWidth: 52, minHeight: TOUCH, paddingHorizontal: SPACE.xs, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center' },
  timeBtn: { borderRadius: RADIUS.pill, minHeight: TOUCH, justifyContent: 'center', paddingHorizontal: SPACE.lg },
  disclosure: { marginTop: SPACE.md },
  body: { marginTop: SPACE.sm },
  week: { flexDirection: 'row', columnGap: SPACE.xs },
  // Seven share the row, each a full 48 dp tall; on a 360 dp phone they come out about 43 dp wide.
  day: { flex: 1, minHeight: TOUCH, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center' },
});
