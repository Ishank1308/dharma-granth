import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { accentFill, Backdrop, Bilingual, Card, Eyebrow, glass, Muted, SectionTitle } from '@/components/ui';
import { CATALOG, SITE } from '@/content/catalog';
import { makeBackup, parseBackup } from '@/lib/backup';
import { useAppState } from '@/state/app-state';
import { RADIUS, SPACE, THEME_ORDER, THEMES, TYPE } from '@/theme/themes';

const SCALES = [0.9, 1, 1.15, 1.3, 1.5];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings, updateSettings, exportData, importData, bookmarks } = useAppState();
  const [busy, setBusy] = useState(false);
  const bundled = CATALOG.filter((b) => b.bundled).length;

  const toggles: { key: 'showTransliteration' | 'showHindi' | 'showEnglish' | 'showNotes'; en: string; hi: string }[] = [
    { key: 'showTransliteration', en: 'Transliteration', hi: 'लिप्यन्तरण' },
    { key: 'showHindi', en: 'Hindi meaning', hi: 'हिन्दी अर्थ' },
    { key: 'showEnglish', en: 'English translation', hi: 'अंग्रेज़ी अनुवाद' },
    { key: 'showNotes', en: 'Open notes by default', hi: 'टिप्पणी खुली रखें' },
  ];

  const doExport = async () => {
    setBusy(true);
    try {
      const date = new Date().toISOString().slice(0, 10);
      const file = new File(Paths.cache, `dharma-granth-backup-${date}.json`);
      if (file.exists) file.delete();
      file.create();
      file.write(JSON.stringify(makeBackup(exportData()), null, 2));
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Save backup' });
      } else {
        Alert.alert('Backup saved', file.uri);
      }
    } catch (e) {
      Alert.alert('Could not export', e instanceof Error ? e.message : String(e));
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
      Alert.alert('Backup restored', `${data.bookmarks.length} saved verses added. Settings restored.`);
    } catch (e) {
      Alert.alert('Could not import', e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Backdrop>
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + SPACE.lg, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl * 3 }}>
        <Eyebrow en="Preferences" hi="पसंद" />
        <Text style={{ color: palette.text, fontSize: 34, fontWeight: '800', letterSpacing: -0.6, marginTop: SPACE.sm }}>Settings</Text>
        <Text style={{ color: palette.accent, fontSize: TYPE.title2, fontWeight: '600' }}>सेटिंग्स</Text>

        <SectionTitle en="Theme" hi="रंग-रूप" />
        <View style={styles.themes}>
          {THEME_ORDER.map((name) => {
            const t = THEMES[name];
            const active = settings.theme === name;
            return (
              <Pressable
                key={name}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${t.label} theme`}
                onPress={() => updateSettings({ theme: name })}
                style={[styles.theme, glass(t, true), active && { borderColor: palette.accent, borderWidth: 2 }]}>
                <View style={[styles.swatch, { backgroundColor: t.accent }]} />
                <Text style={{ color: t.text, fontWeight: '700', fontSize: TYPE.footnote }}>{t.label}</Text>
                <Text style={{ color: t.muted, fontSize: TYPE.caption }}>{t.labelHi}</Text>
              </Pressable>
            );
          })}
        </View>

        <SectionTitle en="Text size" hi="अक्षर आकार" />
        <View style={styles.scales}>
          {SCALES.map((s) => {
            const active = Math.abs(settings.textScale - s) < 0.01;
            return (
              <Pressable
                key={s}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`Text size ${Math.round(s * 100)} percent`}
                onPress={() => updateSettings({ textScale: s })}
                style={[styles.scale, active ? accentFill(palette) : glass(palette)]}>
                <Text style={{ color: active ? palette.onAccent : palette.text, fontSize: 14 * s, fontWeight: '700' }}>अ</Text>
              </Pressable>
            );
          })}
        </View>

        <SectionTitle en="Show in verses" hi="श्लोक में दिखाएँ" />
        <Card style={{ paddingVertical: SPACE.xs }}>
          {toggles.map((t, i) => (
            <View key={t.key} style={[styles.toggle, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderColor: palette.border }]}>
              <Bilingual en={t.en} hi={t.hi} style={{ flex: 1 }} weight="500" />
              <Switch
                value={settings[t.key]}
                onValueChange={(v) => updateSettings({ [t.key]: v })}
                trackColor={{ true: palette.accent, false: palette.dark ? '#48484a' : palette.border }}
                thumbColor="#fff"
              {...({ activeThumbColor: '#fff' } as object)}
                accessibilityLabel={t.en}
              />
            </View>
          ))}
        </Card>
        <Muted style={{ marginTop: SPACE.sm }}>The Sanskrit text is always shown in full.</Muted>

        <SectionTitle en="Backup" hi="बैकअप" />
        <Card style={{ rowGap: SPACE.md }}>
          <Muted>
            No account, nothing uploaded. Your {bookmarks.length} saved verses and settings live only on this phone. Export a JSON file to
            keep a copy, and import it on a new phone.
          </Muted>
          <View style={{ flexDirection: 'row', columnGap: SPACE.md }}>
            <Pressable disabled={busy} onPress={doExport} accessibilityRole="button" style={[styles.btn, accentFill(palette)]}>
              <Text style={[styles.btnText, { color: palette.onAccent }]}>Export · निर्यात</Text>
            </Pressable>
            <Pressable disabled={busy} onPress={doImport} accessibilityRole="button" style={[styles.btn, glass(palette, true)]}>
              <Text style={[styles.btnText, { color: palette.text }]}>Import · आयात</Text>
            </Pressable>
          </View>
        </Card>

        <SectionTitle en="About" hi="परिचय" />
        <Card style={{ rowGap: SPACE.sm }}>
          <Muted>
            {CATALOG.length} scriptures in the library, {bundled} readable offline. Larger texts (epics, Puranas, Rig Veda) open on the
            website.
          </Muted>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(SITE).catch(() => {})}>
            <Text style={{ color: palette.accent, fontWeight: '600' }}>dharmagranth.dev</Text>
          </Pressable>
          <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`${SITE}/privacy/`).catch(() => {})}>
            <Text style={{ color: palette.accent, fontWeight: '600' }}>Privacy policy · गोपनीयता नीति</Text>
          </Pressable>
        </Card>
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  themes: { flexDirection: 'row', gap: SPACE.sm },
  theme: { flex: 1, borderRadius: RADIUS.control, padding: SPACE.sm, alignItems: 'center', rowGap: 2 },
  swatch: { width: 18, height: 18, borderRadius: 9, marginBottom: 2 },
  scales: { flexDirection: 'row', gap: SPACE.sm },
  scale: { width: 52, height: 46, borderRadius: RADIUS.control, alignItems: 'center', justifyContent: 'center' },
  toggle: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACE.md, columnGap: SPACE.md },
  btn: { flex: 1, borderRadius: RADIUS.pill, paddingVertical: SPACE.md, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
