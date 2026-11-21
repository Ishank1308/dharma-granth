import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { accentFill, Backdrop, Bilingual, Card, Chip, Eyebrow, glass, Muted, PageTitle, SectionTitle } from '@/components/ui';
import { CATALOG, SITE } from '@/content/catalog';
import { LANGUAGE_SETTINGS, S, useI18n, type LanguageSetting, type Msg } from '@/i18n';
import { BackupError, makeBackup, parseBackup } from '@/lib/backup';
import { useAppState } from '@/state/app-state';
import { RADIUS, SPACE, THEME_ORDER, THEMES, TYPE } from '@/theme/themes';

const SCALES = [0.9, 1, 1.15, 1.3, 1.5];

/** Language names are always shown in their own script, whatever the interface language. */
const LANGUAGE_NAMES: Record<Exclude<LanguageSetting, 'system'>, string> = { en: 'English', hi: 'हिन्दी' };

const BACKUP_ERRORS: Record<BackupError['code'], Msg> = {
  'not-json': S.backupNotJson,
  'wrong-file': S.backupWrongFile,
  'too-new': S.backupTooNew,
};

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings, updateSettings, exportData, importData, bookmarks } = useAppState();
  const { t, lang } = useI18n();
  const [busy, setBusy] = useState(false);
  const bundled = CATALOG.filter((b) => b.bundled).length;

  const toggles: { key: 'showTransliteration' | 'showHindi' | 'showEnglish' | 'showNotes'; label: Msg }[] = [
    { key: 'showTransliteration', label: S.showTransliteration },
    { key: 'showHindi', label: S.showHindi },
    { key: 'showEnglish', label: S.showEnglish },
    { key: 'showNotes', label: S.showNotes },
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
      file.write(JSON.stringify(makeBackup(exportData()), null, 2));
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
        contentContainerStyle={{ paddingTop: insets.top + SPACE.lg, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl * 3 }}>
        <Eyebrow {...S.settingsEyebrow} />
        <View style={{ marginTop: SPACE.sm }}>
          <PageTitle {...S.settingsTitle} />
        </View>

        <SectionTitle {...S.language} />
        <View style={styles.chips}>
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
        <View style={styles.themes}>
          {THEME_ORDER.map((name) => {
            const theme = THEMES[name];
            const active = settings.theme === name;
            return (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t(S.themeA11y(lang === 'hi' ? theme.labelHi : theme.label))}
                onPress={() => updateSettings({ theme: name })}
                style={[styles.theme, glass(theme, true), active && { borderColor: palette.accent, borderWidth: 2 }]}>
                <View style={[styles.swatch, { backgroundColor: theme.accent }]} />
                <Text style={{ color: theme.text, fontWeight: '700', fontSize: TYPE.footnote }}>{lang === 'hi' ? theme.labelHi : theme.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <SectionTitle {...S.textSize} />
        <View style={styles.scales}>
          {SCALES.map((s) => {
            const active = Math.abs(settings.textScale - s) < 0.01;
            return (
              <Pressable
                key={s}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={t(S.textSizeA11y(Math.round(s * 100)))}
                onPress={() => updateSettings({ textScale: s })}
                style={[styles.scale, active ? accentFill(palette) : glass(palette)]}>
                <Text style={{ color: active ? palette.onAccent : palette.text, fontSize: 14 * s, fontWeight: '700' }}>अ</Text>
              </Pressable>
            );
          })}
        </View>

        <SectionTitle {...S.showInVerses} />
        <Card style={{ paddingVertical: SPACE.xs }}>
          {toggles.map((row, i) => (
            <View key={row.key} style={[styles.toggle, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderColor: palette.border }]}>
              <Bilingual {...row.label} style={{ flex: 1 }} weight="500" />
              <Switch
                value={settings[row.key]}
                onValueChange={(v) => updateSettings({ [row.key]: v })}
                trackColor={{ true: palette.accent, false: palette.dark ? '#48484a' : palette.border }}
                thumbColor="#fff"
              {...({ activeThumbColor: '#fff' } as object)}
                accessibilityLabel={t(row.label)}
              />
            </View>
          ))}
        </Card>
        <Muted style={{ marginTop: SPACE.sm }}>{t(S.sanskritAlwaysFull)}</Muted>

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
        <Card style={{ rowGap: SPACE.sm }}>
          <Muted>{t(S.aboutBody(CATALOG.length, bundled))}</Muted>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(SITE).catch(() => {})}>
            <Text style={{ color: palette.accent, fontWeight: '600' }}>dharmagranth.dev</Text>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`${SITE}/privacy/`).catch(() => {})}>
            <Text style={{ color: palette.accent, fontWeight: '600' }}>{t(S.privacyPolicy)}</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  themes: { flexDirection: 'row', gap: SPACE.sm },
  theme: { flex: 1, borderRadius: RADIUS.control, padding: SPACE.sm, alignItems: 'center', rowGap: 2 },
  swatch: { width: 18, height: 18, borderRadius: 9, marginBottom: 2 },
  scales: { flexDirection: 'row', gap: SPACE.sm },
  scale: { width: 52, height: 46, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center' },
  toggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACE.md, columnGap: SPACE.md },
  btn: { flex: 1, borderRadius: RADIUS.pill, paddingVertical: SPACE.md, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
