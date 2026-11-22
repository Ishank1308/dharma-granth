import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NameSheet, useCollectionName } from '@/components/collection-sheet';
import { accentFill, Backdrop, GroupCard, GroupRow, IconButton, IconTile, LargeHeader, Muted } from '@/components/ui';
import { S, useI18n } from '@/i18n';
import { allCollections, collectionCounts, type VerseCollection } from '@/lib/journal';
import { useAppState } from '@/state/app-state';
import { useJournal } from '@/state/journal';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const BUILTIN_ICONS = {
  'read-later': 'time-outline',
  favourites: 'heart-outline',
  'study-carefully': 'school-outline',
  'daily-reflection': 'sunny-outline',
  'share-later': 'paper-plane-outline',
} as const;

/** Make, rename and delete verse collections. The five starting ones stay as they are. */
export default function CollectionsScreen() {
  const insets = useSafeAreaInsets();
  const { palette, bookmarks } = useAppState();
  const { journal, createCollection, renameCollection, deleteCollection } = useJournal();
  const { t } = useI18n();
  const nameOf = useCollectionName();
  const hues = huesFor(palette);
  const counts = useMemo(() => collectionCounts(journal, bookmarks), [journal, bookmarks]);
  const [editing, setEditing] = useState<VerseCollection | 'new' | null>(null);
  const tones = [hues.saffron, hues.lotus, hues.peacock, hues.indigo, hues.gold];

  const confirmDelete = (c: VerseCollection) =>
    Alert.alert(t(S.deleteCollectionTitle(c.name)), t(S.deleteCollectionBody), [
      { text: t(S.cancel), style: 'cancel' },
      { text: t(S.deleteBtn), style: 'destructive', onPress: () => deleteCollection(c.id) },
    ]);

  const list = allCollections(journal);
  return (
    <Backdrop>
      <Stack.Screen options={{ title: '' }} />
      <ScrollView style={{ backgroundColor: 'transparent' }} contentContainerStyle={{ paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + 120 }}>
        <LargeHeader title={S.collections} eyebrow={S.savedEyebrow} subtitle={t(S.savedSummary(bookmarks.length))} />
        <GroupCard>
          {list.map((c, i) => {
            const name = nameOf(c);
            const icon = c.builtin ? BUILTIN_ICONS[c.id as keyof typeof BUILTIN_ICONS] : 'folder-outline';
            return (
              <GroupRow key={c.id} standalone={i === 0} accessibilityLabel={`${name}, ${t(S.versesInCollection(counts[c.id] ?? 0))}`}>
                <IconTile icon={icon} color={tones[i % tones.length]} />
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                    {name}
                  </Text>
                  <Muted>{t(S.versesInCollection(counts[c.id] ?? 0))}</Muted>
                </View>
                {c.builtin ? (
                  <Ionicons name="lock-closed-outline" size={16} color={palette.muted} accessibilityElementsHidden importantForAccessibility="no" />
                ) : (
                  <>
                    <IconButton icon="pencil-outline" tone="clear" onPress={() => setEditing(c)} accessibilityLabel={t(S.renameCollectionA11y(c.name))} />
                    <IconButton icon="trash-outline" tone="clear" onPress={() => confirmDelete(c)} accessibilityLabel={t(S.deleteCollectionA11y(c.name))} />
                  </>
                )}
              </GroupRow>
            );
          })}
        </GroupCard>
        <Muted style={{ marginTop: SPACE.sm, paddingHorizontal: SPACE.xs }}>{t(S.builtinCollectionNote)}</Muted>
        <Pressable
          onPress={() => setEditing('new')}
          accessibilityRole="button"
          style={({ pressed }) => [styles.newBtn, accentFill(palette), pressed && { transform: [{ scale: 0.97 }] }]}>
          <Ionicons name="add" size={20} color={palette.onAccent} />
          <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
            {t(S.newCollection)}
          </Text>
        </Pressable>
      </ScrollView>
      <NameSheet
        visible={editing !== null}
        title={t(editing === 'new' || editing === null ? S.newCollection : S.renameCollection)}
        initial={editing && editing !== 'new' ? editing.name : ''}
        onClose={() => setEditing(null)}
        onSubmit={(name) => {
          const error = editing === 'new' ? createCollection(name).error : editing ? renameCollection(editing.id, name) : undefined;
          if (!error) setEditing(null);
          return error;
        }}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  newBtn: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.sm,
    marginTop: SPACE.xl,
    minHeight: TOUCH + 8,
    paddingHorizontal: SPACE.xl,
    borderRadius: RADIUS.pill,
  },
});
