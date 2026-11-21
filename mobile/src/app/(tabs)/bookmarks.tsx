import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, Eyebrow, Muted } from '@/components/ui';
import { getEntry, loadChapter } from '@/content/catalog';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { SPACE, TYPE } from '@/theme/themes';

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const { palette, bookmarks, removeBookmark } = useAppState();

  return (
    <Backdrop>
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + SPACE.lg, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl * 3 }}
        data={bookmarks}
        keyExtractor={(b) => `${b.id}:${b.chapter}:${b.verse}`}
        ListHeaderComponent={
          <View style={{ marginBottom: SPACE.lg, rowGap: SPACE.sm }}>
            <Eyebrow en="Your collection" hi="संग्रह" />
            <Text style={{ color: palette.text, fontSize: 34, fontWeight: '800', letterSpacing: -0.6 }}>Saved verses</Text>
            <Text style={{ color: palette.accent, fontSize: TYPE.title2, fontWeight: '600', marginTop: -SPACE.sm }}>सहेजे गए श्लोक</Text>
          </View>
        }
        ListEmptyComponent={
          <Muted style={{ textAlign: 'center', marginTop: SPACE.xl }}>
            Tap the bookmark on any verse to keep it here. Saved verses stay on this phone only.
          </Muted>
        }
        renderItem={({ item }) => {
          const entry = getEntry(item.id);
          const verse = loadChapter(item.id, item.chapter)?.verses.find((v) => String(v.number) === item.verse);
          const lines = sanskritLines(verse?.sanskrit);
          const ref = `${entry?.title ?? item.id} ${formatVerseRef(item.id, item.chapter, item.verse)}`;
          return (
            <Card style={styles.card}>
              {/* The remove button sits beside the open button, not inside it: TalkBack cannot reach a
                  button nested in another button, and nested touch targets misfire. */}
              <Pressable
                style={{ flex: 1 }}
                accessibilityRole="button"
                accessibilityLabel={`Open ${ref}`}
                onPress={() =>
                  router.push({
                    pathname: '/scripture/[id]/[chapter]',
                    params: { id: item.id, chapter: String(item.chapter), verse: item.verse },
                  })
                }>
                <Text style={{ color: palette.gold, fontWeight: '700', fontSize: TYPE.footnote, marginBottom: SPACE.sm }}>{ref}</Text>
                {/* The full verse, every line, as saved. */}
                {lines.map((l, i) => (
                  <Text key={i} style={{ color: palette.text, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.6 }}>
                    {l}
                  </Text>
                ))}
              </Pressable>
              <Pressable
                style={styles.remove}
                accessibilityRole="button"
                accessibilityLabel={`Remove bookmark ${ref}`}
                onPress={() => removeBookmark(item)}>
                <Ionicons name="trash-outline" size={18} color={palette.muted} />
              </Pressable>
            </Card>
          );
        }}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACE.md, flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.sm },
  // 48 dp touch target (Android accessibility minimum).
  remove: { width: 48, height: 48, marginTop: -SPACE.md, marginRight: -SPACE.md, alignItems: 'center', justifyContent: 'center' },
});
