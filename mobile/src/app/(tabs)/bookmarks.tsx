import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, Eyebrow, Muted, PageTitle } from '@/components/ui';
import { getEntry, loadChapter } from '@/content/catalog';
import { S, useI18n } from '@/i18n';
import { cleanVerseField, formatVerseRef, meaningState, MEANING_COPY, sanskritLines } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { fontCap, SPACE, TYPE } from '@/theme/themes';

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings, bookmarks, removeBookmark } = useAppState();
  const scale = settings.textScale;
  const cap = fontCap(scale);
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
          const lines = sanskritLines(verse?.sanskrit);
          // The meaning follows the reader's "Show in verses" choices, as in the chapter reader.
          const state = verse ? meaningState(verse) : null;
          const hindi =
            !verse || !state || !settings.showHindi
              ? ''
              : state.hi === 'text'
                ? cleanVerseField(verse.hindi)
                : state.hi === 'with'
                  ? MEANING_COPY.hiWith(verse.hindiSeeVerse!)
                  : '';
          const english =
            !verse || !state || !settings.showEnglish
              ? ''
              : state.en === 'text'
                ? cleanVerseField(verse.translation)
                : state.en === 'with'
                  ? MEANING_COPY.enWith(verse.translationSeeVerse!)
                  : '';
          const ref = `${entry?.title ?? item.id} ${formatVerseRef(item.id, item.chapter, item.verse)}`;
          return (
            <Card style={styles.card}>
              {/* The remove button sits beside the open button, not inside it: TalkBack cannot reach a
                  button nested in another button, and nested touch targets misfire. */}
              <Pressable
                style={{ flex: 1 }}
                accessibilityRole="button"
                accessibilityLabel={t(S.openSavedA11y(ref))}
                onPress={() =>
                  router.push({
                    pathname: '/scripture/[id]/[chapter]',
                    params: { id: item.id, chapter: String(item.chapter), verse: item.verse },
                  })
                }>
                <Text style={{ color: palette.gold, fontWeight: '700', fontSize: TYPE.footnote, marginBottom: SPACE.sm }}>{ref}</Text>
                {/* The full verse, every line, as saved. */}
                {lines.map((l, i) => (
                  <Text
                    key={i}
                    maxFontSizeMultiplier={cap}
                    style={{ color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.6 }}>
                    {l}
                  </Text>
                ))}
                {hindi ? (
                  <Text
                    maxFontSizeMultiplier={cap}
                    style={{
                      color: state?.hi === 'text' ? palette.textSecondary : palette.muted,
                      fontSize: TYPE.subhead * scale,
                      lineHeight: TYPE.subhead * scale * 1.55,
                      marginTop: SPACE.sm,
                    }}>
                    {hindi}
                  </Text>
                ) : null}
                {english ? (
                  <Text
                    maxFontSizeMultiplier={cap}
                    style={{
                      color: state?.en === 'text' ? palette.textSecondary : palette.muted,
                      fontSize: TYPE.subhead * scale,
                      lineHeight: TYPE.subhead * scale * 1.5,
                      marginTop: SPACE.sm,
                    }}>
                    {english}
                  </Text>
                ) : null}
              </Pressable>
              <Pressable
                style={styles.remove}
                accessibilityRole="button"
                accessibilityLabel={t(S.removeSavedA11y(ref))}
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
