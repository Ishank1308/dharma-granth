/**
 * The first-run welcome: three short questions, one per page, so a new reader sets the app up without
 * meeting the whole Settings screen. Every page can be skipped, nothing is required, and each choice takes
 * effect at once (the page behind the buttons is already in the chosen language, theme and text size).
 *
 * Built for one hand: the choices sit in the lower half and Back / Next along the bottom edge. Android's
 * Back button goes to the previous page, and on the first page closes the welcome (the same as Skip).
 * Shown once; Settings → About can show it again.
 */
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ReminderTimeButton, TextSizePicker, ThemePicker } from '@/components/settings-ui';
import { accentFill, Backdrop, Chip, glass, Muted } from '@/components/ui';
import { LANGUAGE_SETTINGS, S, useI18n, type LanguageSetting } from '@/i18n';
import { remindersSupported, requestReminderPermission, type ReminderPermission } from '@/lib/daily-notification';
import { formatReminderTime } from '@/lib/reminder';
import { usePrefs } from '@/state/app-state';
import { SANSKRIT_FONT } from '@/theme/fonts';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

/** Language names are always shown in their own script, whatever the interface language. */
const LANGUAGE_NAMES: Record<Exclude<LanguageSetting, 'system'>, string> = { en: 'English', hi: 'हिन्दी' };

type Step = 'language' | 'look' | 'verse';

export function Welcome() {
  const { ready, settings, palette, reduceMotion, updateSettings } = usePrefs();
  const { t, lang } = useI18n();
  const insets = useSafeAreaInsets();
  // Gilt on the dark theme; the deep saffron hue where gold would be too pale to read.
  const gold = palette.dark ? palette.gold : huesFor(palette).saffron;
  // The web preview has no notification scheduler, so it has two pages.
  const steps: Step[] = remindersSupported ? ['language', 'look', 'verse'] : ['language', 'look'];
  const [index, setIndex] = useState(0);
  const [asking, setAsking] = useState(false);

  if (!ready || settings.onboarded) return null;

  const step = steps[Math.min(index, steps.length - 1)];
  const last = index >= steps.length - 1;
  const finish = () => {
    setIndex(0);
    updateSettings({ onboarded: true });
  };
  const back = () => (index === 0 ? finish() : setIndex(index - 1));
  const next = () => (last ? finish() : setIndex(index + 1));

  const turnOnDailyVerse = async () => {
    setAsking(true);
    const p = await requestReminderPermission(lang).catch((): ReminderPermission => 'denied');
    setAsking(false);
    if (p === 'granted') {
      updateSettings({ dailyReminder: true });
    } else {
      Alert.alert(t(S.notificationsOffTitle), t(S.notificationsOffBody), [
        { text: t(S.notNow), style: 'cancel' },
        { text: t(S.openSettings), onPress: () => void Linking.openSettings().catch(() => {}) },
      ]);
    }
  };

  const title = step === 'language' ? S.welcomeLanguageTitle : step === 'look' ? S.welcomeLookTitle : S.welcomeVerseTitle;
  const body = step === 'language' ? S.welcomeLanguageBody : step === 'look' ? S.welcomeLookBody : S.welcomeVerseBody;

  return (
    <Modal visible animationType={reduceMotion ? 'none' : 'fade'} onRequestClose={back} statusBarTranslucent navigationBarTranslucent>
      <Backdrop>
        <View style={[styles.top, { paddingTop: insets.top + SPACE.sm }]}>
          {/* Progress as text and dots: where you are, and that it is short. */}
          <View
            style={styles.progress}
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={t(S.welcomeStep(index + 1, steps.length))}
            accessibilityValue={{ min: 1, max: steps.length, now: index + 1 }}>
            {steps.map((s, i) => (
              <View key={s} style={[styles.dot, { backgroundColor: i <= index ? palette.accent : palette.border, width: i === index ? 22 : 8 }]} />
            ))}
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginLeft: SPACE.xs }}>
              {t(S.welcomeStep(index + 1, steps.length))}
            </Text>
          </View>
          <Pressable accessibilityRole="button" onPress={finish} hitSlop={8} style={styles.skip}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.callout, fontWeight: '600' }}>
              {t(S.welcomeSkip)}
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.page} style={{ backgroundColor: 'transparent' }}>
          {/* The welcome opens as a reading does: ॐ, and the Upanishad's word on svadhyaya. Quiet, and the same on every page. */}
          <View style={styles.invocation} accessible accessibilityLabel={t(S.welcomeInvocationA11y)}>
            <Text allowFontScaling={false} style={{ fontFamily: SANSKRIT_FONT, color: gold, fontSize: 64, lineHeight: 92 }}>
              ॐ
            </Text>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ fontFamily: SANSKRIT_FONT, color: palette.text, fontSize: TYPE.title3, lineHeight: TYPE.title3 * 1.7, textAlign: 'center' }}>
              ॥ स्वाध्यायान्मा प्रमदः ॥
            </Text>
            <Muted style={{ textAlign: 'center' }}>{t(S.welcomeInvocationMeaning)}</Muted>
          </View>
          <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={[styles.title, { color: palette.text, letterSpacing: lang === 'hi' ? 0 : -0.4 }]}>
            {t(title)}
          </Text>
          <Muted style={styles.body}>{t(body)}</Muted>

          {step === 'language' ? (
            <View style={styles.chips} accessibilityRole="radiogroup">
              {LANGUAGE_SETTINGS.map((l) => (
                <Chip
                  key={l}
                  label={l === 'system' ? t(S.languageSystem) : LANGUAGE_NAMES[l]}
                  active={settings.language === l}
                  onPress={() => updateSettings({ language: l })}
                />
              ))}
            </View>
          ) : null}

          {step === 'look' ? (
            <View style={{ rowGap: SPACE.xl }}>
              <ThemePicker />
              <TextSizePicker />
            </View>
          ) : null}

          {step === 'verse' ? (
            settings.dailyReminder ? (
              <View style={[styles.on, glass(palette, true)]}>
                <Ionicons name="checkmark-circle" size={24} color={palette.accent} />
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
                  {t(S.welcomeVerseOn(formatReminderTime(settings.reminderHour, settings.reminderMinute)))}
                </Text>
                <ReminderTimeButton />
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                disabled={asking}
                onPress={() => void turnOnDailyVerse()}
                style={({ pressed }) => [styles.choice, glass(palette, true), pressed && { opacity: 0.8 }]}>
                <Ionicons name="notifications-outline" size={22} color={palette.accent} />
                <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
                  {t(S.welcomeVerseYes)}
                </Text>
              </Pressable>
            )
          ) : null}
        </ScrollView>

        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, SPACE.md) + SPACE.sm }]}>
          {index > 0 ? (
            <Pressable accessibilityRole="button" onPress={back} style={({ pressed }) => [styles.btn, glass(palette, true), pressed && { opacity: 0.8 }]}>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                {t(S.welcomeBack)}
              </Text>
            </Pressable>
          ) : null}
          <Pressable
            accessibilityRole="button"
            onPress={next}
            style={({ pressed }) => [styles.btn, styles.primary, accentFill(palette), pressed && { transform: [{ scale: 0.98 }] }]}>
            <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
              {t(last ? S.welcomeDone : S.welcomeNext)}
            </Text>
          </Pressable>
        </View>
      </Backdrop>
    </Modal>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACE.lg },
  progress: { flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH },
  dot: { height: 8, borderRadius: 4 },
  skip: { minHeight: TOUCH, minWidth: TOUCH, alignItems: 'flex-end', justifyContent: 'center' },
  // Content is pushed to the lower half, where a thumb reaches without shifting grip.
  // The invocation takes the space above and centres in it; the question and choices stay at the bottom.
  invocation: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', rowGap: SPACE.xs, paddingVertical: SPACE.xl },
  page: { flexGrow: 1, justifyContent: 'flex-end', paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xl, rowGap: SPACE.md },
  title: { fontSize: TYPE.largeTitle - 4, fontWeight: '800' },
  body: { fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.45, marginBottom: SPACE.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  choice: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH + 12, paddingHorizontal: SPACE.lg, borderRadius: RADIUS.row },
  on: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH + 12, paddingHorizontal: SPACE.lg, paddingVertical: SPACE.sm, borderRadius: RADIUS.row },
  actions: { flexDirection: 'row', columnGap: SPACE.md, paddingHorizontal: SPACE.lg, paddingTop: SPACE.sm },
  btn: { flex: 1, minHeight: TOUCH + 6, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACE.lg },
  primary: { flex: 2 },
});
