import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Linking, StyleSheet, Text, View } from 'react-native';

import { DownloadCard } from '@/components/download-card';
import { Backdrop, GlassRow, Muted } from '@/components/ui';
import { CATEGORIES, getEntry, webUrl } from '@/content/catalog';
import { useDownloads } from '@/content/downloads';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { SPACE, TYPE } from '@/theme/themes';

export default function ScriptureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { palette } = useAppState();
  const entry = getEntry(String(id));
  const { installed } = useDownloads();

  if (!entry) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Muted>This scripture is not in the library.</Muted>
      </View>
    );
  }

  const cat = CATEGORIES.find((c) => c.key === entry.category);

  // Bundled books and downloaded books open in the app; the rest open on the website until downloaded.
  const offline = entry.bundled || Boolean(installed[entry.id]);

  const open = (chapter: number) => {
    if (offline) {
      router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: entry.id, chapter: String(chapter) } });
    } else {
      Linking.openURL(webUrl(entry.id, chapter)).catch(() => {});
    }
  };

  return (
    <Backdrop>
      <>
        <Stack.Screen options={{ title: entry.title }} />
        <FlatList
          style={{ backgroundColor: 'transparent' }}
          contentContainerStyle={{ padding: SPACE.lg, paddingBottom: SPACE.xxl * 2 }}
          data={entry.chapters}
          keyExtractor={(c) => String(c.number)}
          initialNumToRender={30}
          ListHeaderComponent={
            <View style={{ marginBottom: SPACE.lg, rowGap: SPACE.md }}>
              <View>
                <Text style={{ color: palette.text, fontSize: TYPE.title1, fontWeight: '800' }}>{entry.titleSanskrit ?? entry.title}</Text>
                <Text style={{ color: palette.muted, fontSize: TYPE.subhead, marginTop: 2 }}>
                  {entry.title}
                  {cat ? ` · ${cat.en}` : ''} · {entry.chapters.length} chapters · {entry.totalVerses.toLocaleString('en-IN')} verses
                </Text>
              </View>
              {!entry.bundled ? <DownloadCard entry={entry} /> : null}
            </View>
          }
          renderItem={({ item }) => (
            <GlassRow
              accessibilityRole={offline ? 'button' : 'link'}
              accessibilityLabel={`Chapter ${item.number}, ${item.title}`}
              onPress={() => open(item.number)}>
              <Text style={[styles.num, { color: palette.gold }]}>{toDevanagari(item.number)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>{item.titleSanskrit ?? item.title}</Text>
                <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                  {item.titleSanskrit ? item.title : `Chapter ${item.number}`}
                  {item.verseCount ? ` · ${item.verseCount} verses` : ''}
                </Text>
              </View>
              <Ionicons name={offline ? 'chevron-forward' : 'open-outline'} size={18} color={palette.muted} />
            </GlassRow>
          )}
        />
      </>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  num: { width: 32, fontSize: TYPE.title3, fontWeight: '700', textAlign: 'center' },
});
