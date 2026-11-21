import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Linking, StyleSheet, Text, View } from 'react-native';

import { Backdrop, Card, GlassRow, Muted } from '@/components/ui';
import { CATEGORIES, getEntry, webUrl } from '@/content/catalog';
import { S, useI18n } from '@/i18n';
import { toDevanagari } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { SPACE, TYPE } from '@/theme/themes';

export default function ScriptureScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { palette } = useAppState();
  const { t } = useI18n();
  const entry = getEntry(String(id));

  if (!entry) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted>{t(S.scriptureNotFound)}</Muted>
      </View>
    );
  }

  const cat = CATEGORIES.find((c) => c.key === entry.category);

  const open = (chapter: number) => {
    if (entry.bundled) {
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
                  {cat ? ` · ${t(cat)}` : ''} · {t(S.chaptersVerses(entry.chapters.length, entry.totalVerses))}
                </Text>
              </View>
              {!entry.bundled ? (
                <Card style={{ flexDirection: 'row', columnGap: SPACE.md, alignItems: 'center' }}>
                  <Ionicons name="globe-outline" size={22} color={palette.accent} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>{t(S.readOnWebsite)}</Text>
                    <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>{t(S.readOnWebsiteBody)}</Text>
                  </View>
                </Card>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <GlassRow
              accessibilityRole={entry.bundled ? 'button' : 'link'}
              accessibilityLabel={t(S.chapterA11y(item.number, item.title))}
              onPress={() => open(item.number)}>
              <Text style={[styles.num, { color: palette.gold }]}>{toDevanagari(item.number)}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>{item.titleSanskrit ?? item.title}</Text>
                <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                  {item.titleSanskrit ? item.title : t(S.chapterN(item.number))}
                  {item.verseCount ? ` · ${t(S.verseCount(item.verseCount))}` : ''}
                </Text>
              </View>
              <Ionicons name={entry.bundled ? 'chevron-forward' : 'open-outline'} size={18} color={palette.muted} />
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
