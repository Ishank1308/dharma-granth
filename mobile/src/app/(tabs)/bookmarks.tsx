import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTabTop } from '@/lib/use-tab-top';
import { CollectionSheet, useCollectionName } from '@/components/collection-sheet';
import { accentFill, Backdrop, Card, Chip, coverFill, GroupRow, groupSurface, IconButton, IconTile, LargeHeader, Muted } from '@/components/ui';
import { getEntry, loadChapter } from '@/content/catalog';
import { S, useI18n } from '@/i18n';
import { cleanVerseField, formatVerseRef, meaningState, MEANING_COPY, sanskritLines } from '@/lib/verse-format';
import { allCollections, collectionCounts, collectionOf, type VerseLink } from '@/lib/journal';
import { useScrollY } from '@/motion/parallax';
import { PressableScale } from '@/motion/pressable-scale';
import { TitleBar } from '@/motion/title-bar';
import { useToast } from '@/motion/toast';
import { toScript } from '@/lib/sanskrit-script';
import { useAppState } from '@/state/app-state';
import { useJournal } from '@/state/journal';
import { SANSKRIT_FONT, sanskritFont } from '@/theme/fonts';
import { coverFor } from '@/theme/covers';
import { barClearance, fontCap, huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

export default function BookmarksScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings, bookmarks, removeBookmark, toggleBookmark } = useAppState();
  const { journal, dropVerse } = useJournal();
  const { scrollY, onScroll } = useScrollY();
  const topRef = useTabTop();
  const toast = useToast();
  const scale = settings.textScale;
  const cap = fontCap(scale);
  const { t } = useI18n();
  const nameOf = useCollectionName();
  const hues = huesFor(palette);
  // Collections, as on the website: every saved verse is in one; unsorted ones are in Read Later.
  const [filter, setFilter] = useState<string | null>(null);
  const [moving, setMoving] = useState<{ link: VerseLink; label: string } | null>(null);
  const counts = useMemo(() => collectionCounts(journal, bookmarks), [journal, bookmarks]);
  const collections = allCollections(journal);
  const active = filter && collections.some((c) => c.id === filter) ? filter : null;
  const shown = useMemo(() => (active ? bookmarks.filter((b) => collectionOf(journal, b) === active) : bookmarks), [bookmarks, journal, active]);

  return (
    <Backdrop>
      <Animated.FlatList
        ref={topRef as never}
        style={{ backgroundColor: 'transparent' }}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ flexGrow: 1, paddingTop: insets.top, paddingHorizontal: SPACE.lg, paddingBottom: barClearance(insets.bottom) }}
        data={shown}
        keyExtractor={(b) => `${b.id}:${b.chapter}:${b.verse}`}
        ListHeaderComponent={
          <View>
            <LargeHeader
              title={S.savedTitle}
              scrollY={scrollY}
              eyebrow={S.savedEyebrow}
              subtitle={bookmarks.length ? t(S.savedSummary(bookmarks.length)) : undefined}
            />
            {/* The Svadhyaya journal lives beside the saved verses, as Practice does on the website. */}
            <GroupRow
              standalone
              onPress={() => router.push('/journal')}
              accessibilityLabel={`${t(S.journalTitle)}, ${t(S.journalRowDetail(journal.entries.length))}`}
              style={[styles.journalRow, groupSurface(palette)]}>
              <IconTile icon="leaf-outline" color={hues.saffron} />
              <View style={{ flex: 1 }}>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
                  {t(S.journalTitle)}
                </Text>
                <Muted>{t(S.journalRowDetail(journal.entries.length))}</Muted>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </GroupRow>
            {bookmarks.length ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                accessibilityRole="radiogroup"
                accessibilityLabel={t(S.collections)}
                style={{ marginHorizontal: -SPACE.lg, marginBottom: SPACE.md }}
                contentContainerStyle={styles.chipRow}>
                <Chip label={t(S.collectionAll(bookmarks.length))} active={!active} onPress={() => setFilter(null)} />
                {collections
                  .filter((c) => !c.builtin || counts[c.id] || c.id === active)
                  .map((c) => (
                    <Chip
                      key={c.id}
                      label={t(S.collectionChip(nameOf(c), counts[c.id] ?? 0))}
                      active={active === c.id}
                      onPress={() => setFilter(active === c.id ? null : c.id)}
                    />
                  ))}
                <Chip label={`＋ ${t(S.manageCollections)}`} accessibilityLabel={t(S.manageCollections)} onPress={() => router.push('/journal/collections')} />
              </ScrollView>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          active ? (
            <Muted style={{ textAlign: 'center', marginTop: SPACE.xl, fontSize: TYPE.callout }}>{t(S.collectionEmpty)}</Muted>
          ) : (
          <View style={styles.empty}>
            {/* The double danda that closes every verse, in gilt: the place where kept verses will gather. */}
            <View
              importantForAccessibility="no-hide-descendants"
              accessibilityElementsHidden
              style={[
                styles.emptyIcon,
                palette.lite
                  ? { backgroundColor: palette.dark ? 'rgba(229,193,88,0.12)' : 'rgba(198,146,52,0.12)' }
                  : { backgroundImage: `radial-gradient(circle at 50% 40%, ${palette.dark ? 'rgba(229,193,88,0.26)' : 'rgba(198,146,52,0.24)'} 0%, transparent 70%)` },
              ]}>
              <Text allowFontScaling={false} style={{ fontFamily: SANSKRIT_FONT, color: palette.gold, fontSize: 44, lineHeight: 70 }}>
                ॥
              </Text>
            </View>
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title2, fontWeight: '700', textAlign: 'center' }}>
              {t(S.savedEmptyTitle)}
            </Text>
            <Muted style={{ textAlign: 'center', fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.5 }}>{t(S.savedEmpty)}</Muted>
            {getEntry('bhagavadgita') ? (
              <PressableScale
                haptic
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/scripture/[id]', params: { id: 'bhagavadgita' } })}
                style={[styles.cta, accentFill(palette)]}>
                <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>
                  {t(S.startWithGita)}
                </Text>
              </PressableScale>
            ) : null}
          </View>
          )
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
          const inCollection = nameOf({ id: collectionOf(journal, item), name: collections.find((c) => c.id === collectionOf(journal, item))?.name ?? '' });
          const params = { id: item.id, chapter: String(item.chapter), verse: item.verse };
          return (
            <Card style={styles.card}>
              <View style={styles.cardTop}>
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
                <View style={[styles.ref, coverFill(coverFor(item.id, entry?.category ?? 'other'), palette, true)]}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: '#ffffff', fontWeight: '700', fontSize: TYPE.footnote }}>
                    {ref}
                  </Text>
                </View>
                {/* The full verse, every line, as saved. */}
                {lines.map((l, i) => (
                  <Text
                    key={i}
                    maxFontSizeMultiplier={cap}
                    style={[{ color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.7 }, sanskritFont(settings.sanskritScript)]}>
                    {toScript(l, settings.sanskritScript)}
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
                onPress={() => {
                  // Removing is instant; the toast offers Undo instead of asking first.
                  removeBookmark(item);
                  dropVerse(item);
                  toast.show(t(S.toastRemoved), {
                    icon: 'trash-outline',
                    action: { label: t(S.undo), onPress: () => toggleBookmark(item.id, item.chapter, item.verse) },
                  });
                }}>
                <Ionicons name="trash-outline" size={18} color={palette.muted} />
              </Pressable>
              </View>
              <View style={styles.footer}>
                <Pressable
                  onPress={() => setMoving({ link: item, label: ref })}
                  accessibilityRole="button"
                  accessibilityLabel={t(S.inCollectionA11y(ref, inCollection))}
                  style={({ pressed }) => [styles.collectionBtn, { backgroundColor: palette.dark ? 'rgba(255,255,255,0.08)' : 'rgba(60,40,20,0.06)' }, pressed && { opacity: 0.7 }]}>
                  <Ionicons name="folder-open-outline" size={16} color={palette.accent} />
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} numberOfLines={1} style={{ flexShrink: 1, color: palette.text, fontSize: TYPE.footnote, fontWeight: '600' }}>
                    {inCollection}
                  </Text>
                  <Ionicons name="chevron-down" size={14} color={palette.muted} />
                </Pressable>
                <View style={{ flexDirection: 'row' }}>
                  <IconButton icon="create-outline" tone="clear" onPress={() => router.push({ pathname: '/journal/edit', params })} accessibilityLabel={t(S.reflectVerseA11y(ref))} />
                  <IconButton icon="image-outline" tone="clear" onPress={() => router.push({ pathname: '/share', params })} accessibilityLabel={t(S.shareImageA11y(ref))} />
                </View>
              </View>
            </Card>
          );
        }}
      />
      <TitleBar scrollY={scrollY} title={S.savedTitle} />
      <CollectionSheet verse={moving?.link ?? null} verseLabel={moving?.label ?? ''} onClose={() => setMoving(null)} />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: SPACE.md },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.sm },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: SPACE.sm, marginTop: SPACE.sm, marginBottom: -SPACE.sm, marginRight: -SPACE.sm },
  collectionBtn: { flexShrink: 1, flexDirection: 'row', alignItems: 'center', columnGap: 6, minHeight: TOUCH - 8, marginVertical: 4, paddingHorizontal: SPACE.md, borderRadius: RADIUS.pill },
  journalRow: { borderRadius: RADIUS.group, marginBottom: SPACE.lg },
  chipRow: { columnGap: SPACE.sm, paddingHorizontal: SPACE.lg },
  ref: { alignSelf: 'flex-start', borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 4, marginBottom: SPACE.sm },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', rowGap: SPACE.md, paddingHorizontal: SPACE.lg, paddingBottom: SPACE.xxl },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', marginBottom: SPACE.sm },
  cta: { marginTop: SPACE.md, minHeight: TOUCH + 8, paddingHorizontal: SPACE.xl, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center' },
  // 48 dp touch target (Android accessibility minimum).
  remove: { width: TOUCH, height: TOUCH, marginTop: -SPACE.md, marginRight: -SPACE.md, alignItems: 'center', justifyContent: 'center' },
});
