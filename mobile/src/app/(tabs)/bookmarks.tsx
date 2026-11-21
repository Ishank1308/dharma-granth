import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, Eyebrow, Muted, PageTitle } from '@/components/ui';
import { getEntry, loadChapter } from '@/content/catalog';
import { S, useI18n } from '@/i18n';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { SPACE, TYPE } from '@/theme/themes';

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const { palette, bookmarks, removeBookmark } = useAppState();
  const { t } = useI18n();

  return (
    <Backdrop>
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + SPACE.lg, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl * 3 }}
        data={bookmarks}
        keyExtractor={(b) => `${b.id}:${b.chapter}:${b.verse}`}
        ListHeaderComponent={
          <View style={{ marginBottom: SPACE.lg, rowGap: SPACE.sm }}>
            <Eyebrow {...S.savedEyebrow} />
            <PageTitle {...S.savedTitle} />
          </View>
        }
        ListEmptyComponent={
          <Muted style={{ textAlign: 'center', marginTop: SPACE.xl }}>
            {t(S.savedEmpty)}
          </Muted>
        }
        renderItem={({ item }) => {
          const entry = getEntry(item.id);
          const verse = loadChapter(item.id, item.chapter)?.verses.find((v) => String(v.number) === item.verse);
          const firstLines = sanskritLines(verse?.sanskrit);
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${entry?.title ?? item.id} ${formatVerseRef(item.id, item.chapter, item.verse)}`}
              onPress={() =>
                router.push({
                  pathname: '/scripture/[id]/[chapter]',
                  params: { id: item.id, chapter: String(item.chapter), verse: item.verse },
                })
              }>
              <Card style={{ marginBottom: SPACE.md }}>
                <View style={styles.head}>
                  <Text style={{ color: palette.gold, fontWeight: '700', fontSize: TYPE.footnote }}>
                    {entry?.title ?? item.id} {formatVerseRef(item.id, item.chapter, item.verse)}
                  </Text>
                  <Pressable
                    hitSlop={10}
                    accessibilityRole="button"
                    accessibilityLabel={t(S.removeBookmarkA11y)}
                    onPress={() => removeBookmark(item)}>
                    <Ionicons name="trash-outline" size={18} color={palette.muted} />
                  </Pressable>
                </View>
                {/* The full verse, every line, as saved. */}
                {firstLines.map((l, i) => (
                  <Text key={i} style={{ color: palette.text, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.6 }}>
                    {l}
                  </Text>
                ))}
              </Card>
            </Pressable>
          );
        }}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACE.sm },
});
