import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { File, Paths } from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useCallback, useState } from 'react';
import { Alert, Linking, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DownloadsSection } from '@/components/download-card';
import { accentFill, Backdrop, Bilingual, Card, Chip, glass, GroupCard, GroupRow, IconTile, LargeHeader, Muted, SectionTitle } from '@/components/ui';
import { CATALOG, SITE } from '@/content/catalog';
import { LANGUAGE_SETTINGS, S, useI18n, type LanguageSetting, type Msg } from '@/i18n';
import { BackupError, EFFECTS_SETTINGS, makeBackup, parseBackup, type EffectsSetting } from '@/lib/backup';
import {
  getReminderPermission,
  remindersSupported,
  requestReminderPermission,
  type ReminderPermission,
} from '@/lib/daily-notification';
import { formatReminderTime } from '@/lib/reminder';
import { useAppState } from '@/state/app-state';
import { exportPractice, importPractice } from '@/state/practice';
import { addWidgetToHomeScreen } from '@/widget/pin';
import { barClearance, huesFor, RADIUS, SPACE, switchOffTrack, TEXT_SCALES, THEME_ORDER, THEMES, TOUCH, TYPE } from '@/theme/themes';

/** Icon tiles keep the deep spectrum hues in every theme, so their white glyphs stay readable. */
const TILE = huesFor({ dark: false });

/** Language names are always shown in their own script, whatever the interface language. */
const LANGUAGE_NAMES: Record<Exclude<LanguageSetting, 'system'>, string> = { en: 'English', hi: 'हिन्दी' };

const EFFECTS_LABELS: Record<EffectsSetting, Msg> = { auto: S.effectsAuto, full: S.effectsFull, light: S.effectsLight };

const BACKUP_ERRORS: Record<BackupError['code'], Msg> = {
  'not-json': S.backupNotJson,
  'wrong-file': S.backupWrongFile,
  'too-new': S.backupTooNew,
};

/** Opt-in daily verse notification: a switch and a time. Scheduled on the phone, nothing sent anywhere. */
function DailyVerseSettings() {
  const { palette, settings, updateSettings } = useAppState();
  const { t } = useI18n();
  const [permission, setPermission] = useState<ReminderPermission>('undetermined');
  const time = new Date(2000, 0, 1, settings.reminderHour, settings.reminderMinute);

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
    const p = await requestReminderPermission().catch((): ReminderPermission => 'denied');
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

  const setTime = (d: Date) => updateSettings({ reminderHour: d.getHours(), reminderMinute: d.getMinutes() });

  const pickTime = () =>
    DateTimePickerAndroid.open({
      mode: 'time',
      value: time,
      onValueChange: (_e, d) => setTime(d),
    });

  const blocked = settings.dailyReminder && permission === 'denied';

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
            {Platform.OS === 'ios' ? (
              <DateTimePicker mode="time" display="compact" value={time} onValueChange={(_e, d) => setTime(d)} />
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t(S.reminderTimeA11y(formatReminderTime(settings.reminderHour, settings.reminderMinute)))}
                onPress={pickTime}
                style={[styles.timeBtn, glass(palette, true)]}>
                <Text style={{ color: palette.accent, fontWeight: '700', fontSize: TYPE.callout }}>
                  {formatReminderTime(settings.reminderHour, settings.reminderMinute)}
                </Text>
              </Pressable>
            )}
          </GroupRow>
        ) : null}
      </GroupCard>
      {blocked ? (
        <Pressable accessibilityRole="button" onPress={openSystemSettings} style={[styles.linkBtn, glass(palette, true)]}>
          <Ionicons name="alert-circle-outline" size={20} color={palette.accent} />
          <Text style={[styles.linkText, { color: palette.accent }]}>{t(S.notificationsBlocked)}</Text>
        </Pressable>
      ) : (
        <Muted style={{ marginTop: SPACE.sm }}>{t(S.dailyVerseNote)}</Muted>
      )}
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

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings, updateSettings, exportData, importData, bookmarks, lightEffects } = useAppState();
  // At large system font sizes the four theme names no longer fit in one row; show them two by two.
  const { fontScale } = useWindowDimensions();
  const themesInTwoRows = fontScale > 1.3;
  const { t, lang } = useI18n();
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
      // Practice (Gita Sankalpa, reading plans) is its own store; it rides along in the same file.
      file.write(JSON.stringify({ ...makeBackup(exportData()), practice: await exportPractice() }, null, 2));
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
      const text = await picked.result.text();
      const data = parseBackup(text);
      importData(data);
      await importPractice((JSON.parse(text) as { practice?: unknown }).practice);
      Alert.alert(t(S.backupRestored), t(S.backupRestoredBody(data.bookmarks.length)));
    } catch (e) {
      Alert.alert(t(S.importFailed), errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Backdrop>
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}>
        <LargeHeader title={S.settingsTitle} eyebrow={S.settingsEyebrow} />

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
                style={[styles.theme, themesInTwoRows && styles.themeHalf]}>
                {/* A small page in the theme's own colours: a title line and two lines of text. */}
                <View
                  style={[
                    styles.preview,
                    { backgroundColor: theme.bg, borderColor: active ? palette.accent : theme.border, borderWidth: active ? 2.5 : 1 },
                  ]}>
                  <View style={[styles.previewLine, { width: '60%', height: 6, backgroundColor: theme.text }]} />
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

        <SectionTitle {...S.textSize} />
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

        <SectionTitle {...S.effects} />
        <View style={styles.chips} accessibilityRole="radiogroup">
          {EFFECTS_SETTINGS.map((e) => (
            <Chip key={e} label={t(EFFECTS_LABELS[e])} active={settings.effects === e} onPress={() => updateSettings({ effects: e })} />
          ))}
        </View>
        <Muted style={{ marginTop: SPACE.sm }}>{t(S.effectsNote(lightEffects))}</Muted>

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

        <SectionTitle {...S.downloadsSection} />
        <DownloadsSection />

        <SectionTitle {...S.backup} />
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

        <SectionTitle {...S.about} />
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
        </GroupCard>
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  themes: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  themeHalf: { flexBasis: '45%' },
  theme: { flex: 1, alignItems: 'center', rowGap: 6, minHeight: TOUCH },
  preview: { alignSelf: 'stretch', height: 72, borderRadius: RADIUS.row, padding: 10, rowGap: 5 },
  previewLine: { height: 5, borderRadius: 3 },
  previewDot: { position: 'absolute', right: 8, bottom: 8, width: 10, height: 10, borderRadius: 5 },
  scales: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  // Minimum sizes, not fixed ones: the अ preview grows with the system font size and must not spill out.
  scale: { minWidth: 52, minHeight: TOUCH, paddingHorizontal: SPACE.xs, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center' },
  toggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACE.md, columnGap: SPACE.md },
  btn: { flex: 1, borderRadius: RADIUS.pill, minHeight: TOUCH, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  timeBtn: { borderRadius: RADIUS.pill, minHeight: TOUCH, justifyContent: 'center', paddingHorizontal: SPACE.lg },
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
