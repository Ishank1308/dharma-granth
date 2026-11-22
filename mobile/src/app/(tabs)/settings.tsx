import Ionicons from '@expo/vector-icons/Ionicons';
import { File, Paths } from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import { Alert, Linking, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DownloadsSection } from '@/components/download-card';
import { Disclosure, ReminderTimeButton, TextSizePicker, ThemePicker, WeekdayPicker } from '@/components/settings-ui';
import { accentFill, Backdrop, Bilingual, Card, Chip, glass, GroupCard, GroupRow, IconTile, LargeHeader, Muted, SectionTitle } from '@/components/ui';
import { CATALOG, getEntry, SITE } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { LANGUAGE_SETTINGS, S, useI18n, type LanguageSetting, type Msg } from '@/i18n';
import { BackupError, EFFECTS_SETTINGS, makeBackup, parseBackup, REMINDER_BOOKS, type EffectsSetting, type ReminderBook } from '@/lib/backup';
import {
  getReminderPermission,
  remindersSupported,
  requestReminderPermission,
  type ReminderPermission,
} from '@/lib/daily-notification';
import { useTabTop } from '@/lib/use-tab-top';
import { useScrollY } from '@/motion/parallax';
import { TitleBar } from '@/motion/title-bar';
import { useAppState } from '@/state/app-state';
import { useJournal } from '@/state/journal';
import { addWidgetToHomeScreen } from '@/widget/pin';
import { barClearance, huesFor, RADIUS, SPACE, switchOffTrack, TOUCH, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/** Icon tiles keep the deep spectrum hues in every theme, so their white glyphs stay readable. */
const TILE = huesFor({ dark: false });

/** Language names are always shown in their own script, whatever the interface language. */
const LANGUAGE_NAMES: Record<Exclude<LanguageSetting, 'system'>, string> = { en: 'English', hi: 'हिन्दी' };

const EFFECTS_LABELS: Record<EffectsSetting, Msg> = { auto: S.effectsAuto, full: S.effectsFull, light: S.effectsLight };

const REMINDER_BOOK_LABELS: Record<ReminderBook, Msg> = { gita: S.reminderBookGita, reading: S.reminderBookReading };

const BACKUP_ERRORS: Record<BackupError['code'], Msg> = {
  'not-json': S.backupNotJson,
  'wrong-file': S.backupWrongFile,
  'too-new': S.backupTooNew,
};

/**
 * Opt-in daily verse notification. The switch and the time are all most readers need; which book it comes
 * from and which days it arrives on open under "Book and days". Scheduled on the phone, nothing sent anywhere.
 */
function DailyVerseSettings() {
  const { palette, settings, updateSettings, lastRead } = useAppState();
  const { t, lang } = useI18n();
  const [permission, setPermission] = useState<ReminderPermission>('undetermined');

  // Re-check on every visit: the reader may have turned notifications off in Android settings.
  useFocusEffect(
    useCallback(() => {
      let alive = true;
      getReminderPermission()
        .then((p) => alive && setPermission(p))
        .catch(() => {});
      return () => {
        alive = false;
      };
    }, []),
  );

  const openSystemSettings = () => Linking.openSettings().catch(() => {});

  const toggle = async (on: boolean) => {
    if (!on) {
      updateSettings({ dailyReminder: false });
      return;
    }
    const p = await requestReminderPermission(lang).catch((): ReminderPermission => 'denied');
    setPermission(p);
    if (p === 'granted') {
      updateSettings({ dailyReminder: true });
    } else {
      Alert.alert(t(S.notificationsOffTitle), t(S.notificationsOffBody), [
        { text: t(S.notNow), style: 'cancel' },
        { text: t(S.openSettings), onPress: openSystemSettings },
      ]);
    }
  };

  const blocked = settings.dailyReminder && permission === 'denied';

  const reading = lastRead ? getEntry(lastRead.id) : undefined;
  const readingTitle = reading?.bundled ? ((lang === 'hi' ? reading.titleSanskrit : undefined) ?? reading.title) : undefined;
  const everyDay = settings.reminderDays.length === 7;
  const moreSummary = `${t(REMINDER_BOOK_LABELS[settings.reminderBook])} · ${t(everyDay ? S.reminderEveryDay : S.reminderDaysCount(settings.reminderDays.length))}`;

  return (
    <>
      <SectionTitle {...S.dailyVerse} />
      <GroupCard>
        <GroupRow standalone inset={60}>
          <IconTile icon="notifications" color={TILE.gold} />
          <View style={{ flex: 1 }}>
            <Bilingual {...S.dailyVerseNotification} weight="500" />
          </View>
          <Switch
            value={settings.dailyReminder}
            onValueChange={(v) => void toggle(v)}
            trackColor={{ true: palette.accent, false: switchOffTrack(palette) }}
            thumbColor="#fff"
            {...({ activeThumbColor: '#fff' } as object)}
            accessibilityLabel={t(S.dailyVerseNotification)}
          />
        </GroupRow>
        {settings.dailyReminder ? (
          <GroupRow inset={60}>
            <IconTile icon="time" color={TILE.indigo} />
            <Bilingual {...S.reminderTime} style={{ flex: 1 }} weight="500" />
            <ReminderTimeButton />
          </GroupRow>
        ) : null}
      </GroupCard>
      {blocked ? (
        <Pressable accessibilityRole="button" onPress={openSystemSettings} style={[styles.linkBtn, glass(palette, true)]}>
          <Ionicons name="alert-circle-outline" size={20} color={palette.accent} />
          <Text style={[styles.linkText, { color: palette.accent }]}>{t(S.notificationsBlocked)}</Text>
        </Pressable>
      ) : (
        <Muted style={{ marginTop: SPACE.sm }}>{t(settings.dailyReminder ? S.dailyVerseQuietNote : S.dailyVerseNote)}</Muted>
      )}
      {settings.dailyReminder ? (
        <Disclosure title={S.reminderMore} summary={moreSummary} icon="options" color={TILE.peacock}>
          <Card style={{ rowGap: SPACE.md }}>
            <Bilingual {...S.reminderBook} weight="600" size={TYPE.subhead} />
            <View style={styles.chips} accessibilityRole="radiogroup">
              {REMINDER_BOOKS.map((b) => (
                <Chip
                  key={b}
                  label={t(REMINDER_BOOK_LABELS[b])}
                  active={settings.reminderBook === b}
                  onPress={() => updateSettings({ reminderBook: b })}
                />
              ))}
            </View>
            {settings.reminderBook === 'reading' ? (
              <Muted>{t(readingTitle ? S.reminderBookReadingNote(readingTitle) : S.reminderBookFallbackNote)}</Muted>
            ) : null}
            <Bilingual {...S.reminderDays} weight="600" size={TYPE.subhead} />
            <WeekdayPicker
              days={settings.reminderDays}
              onChange={(days) => updateSettings({ reminderDays: days })}
              initials={t(S.weekdayInitials)}
              names={t(S.weekdayNames)}
            />
          </Card>
        </Disclosure>
      ) : null}
      {Platform.OS === 'android' ? (
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            void addWidgetToHomeScreen().then((pinned) => {
              if (!pinned) Alert.alert(t(S.widgetHowTitle), t(S.widgetHowBody));
            })
          }
          style={[styles.linkBtn, glass(palette, true)]}>
          <Ionicons name="apps-outline" size={20} color={palette.accent} />
          <Text style={[styles.linkText, { color: palette.accent }]}>{t(S.widgetAdd)}</Text>
        </Pressable>
      ) : null}
    </>
  );
}

/** The streak switch and a way to start over. Progress itself is kept on the phone and in the backup. */
function ReadingProgressSettings() {
  const { palette, settings, updateSettings, clearProgress, progress } = useAppState();
  const { t } = useI18n();
  const hasProgress = progress.days.length > 0 || Object.keys(progress.verses).length > 0;

  const confirmClear = () =>
    Alert.alert(t(S.clearProgressTitle), t(S.clearProgressBody), [
      { text: t(S.cancel), style: 'cancel' },
      { text: t(S.clearBtn), style: 'destructive', onPress: clearProgress },
    ]);

  return (
    <>
      <GroupCard>
        <GroupRow standalone inset={60}>
          <IconTile icon="flame" color={TILE.saffron} />
          <Bilingual {...S.showStreak} style={{ flex: 1 }} weight="500" />
          <Switch
            value={settings.showStreak}
            onValueChange={(v) => updateSettings({ showStreak: v })}
            trackColor={{ true: palette.accent, false: switchOffTrack(palette) }}
            thumbColor="#fff"
            {...({ activeThumbColor: '#fff' } as object)}
            accessibilityLabel={t(S.showStreak)}
          />
        </GroupRow>
        {hasProgress ? (
          <GroupRow inset={60} onPress={confirmClear} accessibilityLabel={t(S.clearProgress)}>
            <IconTile icon="refresh" color={TILE.vermilion} />
            <Bilingual {...S.clearProgress} style={{ flex: 1 }} weight="500" />
          </GroupRow>
        ) : null}
      </GroupCard>
      <Muted style={{ marginTop: SPACE.sm }}>{t(S.readingProgressNote)}</Muted>
    </>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { scrollY, onScroll } = useScrollY();
  const topRef = useTabTop();
  const { installed } = useDownloads();
  const { palette, settings, updateSettings, exportData, importData, bookmarks, lightEffects } = useAppState();
  const { journal, importJournal } = useJournal();
  const { t } = useI18n();
  const [busy, setBusy] = useState(false);
  const bundled = CATALOG.filter((b) => b.bundled).length;

  // Each layer keeps its website hue: अर्थ peacock, English indigo, notes saffron.
  const toggles: {
    key: 'showTransliteration' | 'showHindi' | 'showEnglish' | 'showNotes';
    label: Msg;
    icon: 'text' | 'language' | 'globe-outline' | 'reader';
    color: string;
  }[] = [
    { key: 'showTransliteration', label: S.showTransliteration, icon: 'text', color: TILE.gold },
    { key: 'showHindi', label: S.showHindi, icon: 'language', color: TILE.peacock },
    { key: 'showEnglish', label: S.showEnglish, icon: 'globe-outline', color: TILE.indigo },
    { key: 'showNotes', label: S.showNotes, icon: 'reader', color: TILE.saffron },
  ];

  const errorText = (e: unknown) =>
    e instanceof BackupError ? t(BACKUP_ERRORS[e.code]) : e instanceof Error ? e.message : String(e);

  const doExport = async () => {
    setBusy(true);
    try {
      const date = new Date().toISOString().slice(0, 10);
      const file = new File(Paths.cache, `dharma-granth-backup-${date}.json`);
      if (file.exists) file.delete();
      file.create();
      file.write(JSON.stringify(makeBackup(exportData(), new Date(), { journal }), null, 2));
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: t(S.saveBackupDialog) });
      } else {
        Alert.alert(t(S.backupSaved), file.uri);
      }
    } catch (e) {
      Alert.alert(t(S.exportFailed), errorText(e));
    } finally {
      setBusy(false);
    }
  };

  const doImport = async () => {
    setBusy(true);
    try {
      const picked = await File.pickFileAsync({ mimeTypes: ['application/json', 'text/plain', '*/*'] });
      if (picked.canceled) return;
      const data = parseBackup(await picked.result.text());
      importData(data);
      const reflections = data.journal === undefined ? 0 : importJournal(data.journal);
      Alert.alert(t(S.backupRestored), t(S.backupRestoredBody(data.bookmarks.length)) + (reflections ? t(S.backupJournalAdded(reflections)) : ''));
    } catch (e) {
      Alert.alert(t(S.importFailed), errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Backdrop>
      <Animated.ScrollView
        ref={topRef as never}
        style={{ backgroundColor: 'transparent' }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}>
        <LargeHeader title={S.settingsTitle} eyebrow={S.settingsEyebrow} scrollY={scrollY} />

        <SectionTitle {...S.language} />
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
        <Muted style={{ marginTop: SPACE.sm }}>{t(S.languageNote)}</Muted>

        <SectionTitle {...S.theme} />
        <ThemePicker />

        <SectionTitle {...S.textSize} />
        <TextSizePicker />

        <SectionTitle {...S.showInVerses} />
        <GroupCard>
          {toggles.map((row, i) => (
            <GroupRow key={row.key} standalone={i === 0} inset={60}>
              <IconTile icon={row.icon} color={row.color} />
              <Bilingual {...row.label} style={{ flex: 1 }} weight="500" />
              <Switch
                value={settings[row.key]}
                onValueChange={(v) => updateSettings({ [row.key]: v })}
                trackColor={{ true: palette.accent, false: switchOffTrack(palette) }}
                thumbColor="#fff"
              {...({ activeThumbColor: '#fff' } as object)}
                accessibilityLabel={t(row.label)}
              />
            </GroupRow>
          ))}
        </GroupCard>
        <Muted style={{ marginTop: SPACE.sm }}>{t(S.sanskritAlwaysFull)}</Muted>

        {remindersSupported ? <DailyVerseSettings /> : null}

        {/* Everything below is set once, if ever. Each row says what it holds and opens on a tap. */}
        <SectionTitle {...S.settingsMore} />
        <Disclosure title={S.effects} summary={t(EFFECTS_LABELS[settings.effects])} icon="sparkles" color={TILE.indigo}>
          <View style={styles.chips} accessibilityRole="radiogroup">
            {EFFECTS_SETTINGS.map((e) => (
              <Chip key={e} label={t(EFFECTS_LABELS[e])} active={settings.effects === e} onPress={() => updateSettings({ effects: e })} />
            ))}
          </View>
          <Muted style={{ marginTop: SPACE.sm }}>{t(S.effectsNote(lightEffects))}</Muted>
        </Disclosure>

        <Disclosure
          title={S.readingProgressSection}
          summary={t(settings.showStreak ? S.streakOn : S.streakOff)}
          icon="flame"
          color={TILE.saffron}>
          <ReadingProgressSettings />
        </Disclosure>

        <Disclosure title={S.downloadsSection} summary={t(S.onPhoneCount(Object.keys(installed).length))} icon="cloud-download" color={TILE.peacock}>
          <DownloadsSection />
        </Disclosure>

        <Disclosure title={S.backup} summary={t(S.backupSummary(bookmarks.length))} icon="save" color={TILE.tulsi}>
          <Card style={{ rowGap: SPACE.md }}>
            <Muted>{t(S.backupBody(bookmarks.length))}</Muted>
            <View style={{ flexDirection: 'row', columnGap: SPACE.md }}>
              <Pressable disabled={busy} onPress={doExport} accessibilityRole="button" style={[styles.btn, accentFill(palette)]}>
                <Text style={[styles.btnText, { color: palette.onAccent }]}>{t(S.exportBtn)}</Text>
              </Pressable>
              <Pressable disabled={busy} onPress={doImport} accessibilityRole="button" style={[styles.btn, glass(palette, true)]}>
                <Text style={[styles.btnText, { color: palette.text }]}>{t(S.importBtn)}</Text>
              </Pressable>
            </View>
          </Card>
        </Disclosure>

        <Disclosure title={S.about} summary={t(S.aboutSummary(CATALOG.length, bundled))} icon="information-circle" color={TILE.gold}>
          <Muted style={{ marginBottom: SPACE.sm, paddingHorizontal: SPACE.xs }}>{t(S.aboutBody(CATALOG.length, bundled))}</Muted>
          <GroupCard>
            <GroupRow standalone inset={60} accessibilityRole="link" onPress={() => Linking.openURL(SITE).catch(() => {})}>
              <IconTile icon="globe" color={TILE.saffron} />
              <Text style={{ flex: 1, color: palette.text, fontSize: TYPE.body }}>dharmagranth.dev</Text>
              <Ionicons name="open-outline" size={18} color={palette.muted} />
            </GroupRow>
            <GroupRow inset={60} accessibilityRole="link" onPress={() => Linking.openURL(`${SITE}/privacy/`).catch(() => {})}>
              <IconTile icon="shield-checkmark" color={TILE.tulsi} />
              <Text style={{ flex: 1, color: palette.text, fontSize: TYPE.body }}>{t(S.privacyPolicy)}</Text>
              <Ionicons name="open-outline" size={18} color={palette.muted} />
            </GroupRow>
            <GroupRow inset={60} onPress={() => updateSettings({ onboarded: false })}>
              <IconTile icon="hand-left" color={TILE.indigo} />
              <Text style={{ flex: 1, color: palette.text, fontSize: TYPE.body }}>{t(S.showWelcomeAgain)}</Text>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </GroupRow>
          </GroupCard>
        </Disclosure>
      </Animated.ScrollView>
      <TitleBar scrollY={scrollY} title={S.settingsTitle} />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  btn: { flex: 1, borderRadius: RADIUS.pill, minHeight: TOUCH, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  // Text actions get a full-height glass capsule: a 48 dp target, and the accent text sits on glass, not on the aurora.
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    minHeight: TOUCH,
    marginTop: SPACE.md,
    paddingHorizontal: SPACE.lg,
    paddingVertical: SPACE.sm,
    borderRadius: RADIUS.row,
  },
  linkText: { flexShrink: 1, fontWeight: '600', fontSize: TYPE.subhead },
});
