import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, Chip, coverFill, glass, GroupTitle, IconButton, Muted } from '@/components/ui';
import { getEntry, loadChapter } from '@/content/catalog';
import { MOOD_LABELS, S, useI18n } from '@/i18n';
import { cleanTags, DEFAULT_MOOD, entriesForVerse, formatDay, linkKey, MOODS, type JournalMood, type VerseLink } from '@/lib/journal';
import { formatVerseRef, sanskritLines, toDevanagari, verseMarkNumber } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { useJournal } from '@/state/journal';
import { coverFor } from '@/theme/covers';
import { fontCap, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/**
 * Write or edit one reflection. Opened blank from the journal, or from the pen on a verse with that verse
 * linked. What is typed is saved when the screen closes, so a reflection is never lost to the Back button.
 */
export default function EditReflectionScreen() {
  const params = useLocalSearchParams<{ entry?: string; id?: string; chapter?: string; verse?: string }>();
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { journal, saveEntry, deleteEntry } = useJournal();
  const { t, lang } = useI18n();
  const cap = fontCap(settings.textScale);

  const existing = useMemo(() => (params.entry ? journal.entries.find((e) => e.id === params.entry) : undefined), [params.entry]); // eslint-disable-line react-hooks/exhaustive-deps
  const linked: VerseLink | undefined =
    params.id && params.chapter && params.verse ? { id: String(params.id), chapter: Number(params.chapter), verse: String(params.verse) } : undefined;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [body, setBody] = useState(existing?.body ?? '');
  const [mood, setMood] = useState<JournalMood>(existing?.mood ?? DEFAULT_MOOD);
  const [refs, setRefs] = useState<VerseLink[]>(existing?.refs ?? (linked ? [linked] : []));
  const [tags, setTags] = useState(existing?.tags.join(', ') ?? '');

  // Earlier reflections on the verse this one is about, so the reader can go back to them.
  const earlier = useMemo(
    () => (!existing && linked ? entriesForVerse(journal, linked) : []),
    [journal, existing?.id, linked?.id, linked?.chapter, linked?.verse], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Save when the screen closes (Back, the back gesture or the Save button). Deleting skips it.
  const entryId = useRef(existing?.id);
  const skip = useRef(false);
  const [initial] = useState(() => JSON.stringify({ title, body, mood, refs, tags }));
  const draft = useRef({ title, body, mood, refs, tags });
  const save = useRef(saveEntry);
  useEffect(() => {
    draft.current = { title, body, mood, refs, tags };
    save.current = saveEntry;
  });
  useEffect(
    () => () => {
      if (skip.current) return;
      if (JSON.stringify(draft.current) === initial) return;
      save.current({ ...draft.current, tags: cleanTags(draft.current.tags) }, entryId.current);
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onDelete = () => {
    if (!existing) return;
    Alert.alert(t(S.deleteReflectionTitle), t(S.deleteReflectionBody), [
      { text: t(S.cancel), style: 'cancel' },
      {
        text: t(S.deleteBtn),
        style: 'destructive',
        onPress: () => {
          skip.current = true;
          deleteEntry(existing.id);
          router.back();
        },
      },
    ]);
  };

  const field = [styles.field, glass(palette, true), { color: palette.text }];

  return (
    <Backdrop>
      <Stack.Screen
        options={{
          title: t(existing ? S.editReflection : S.newReflection),
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {existing ? <IconButton icon="trash-outline" tone="clear" onPress={onDelete} accessibilityLabel={t(S.deleteReflectionTitle)} /> : null}
              <Pressable onPress={() => router.back()} accessibilityRole="button" style={styles.saveBtn}>
                <Text maxFontSizeMultiplier={1.4} style={{ color: palette.accent, fontSize: TYPE.body, fontWeight: '700' }}>
                  {t(S.saveBtn)}
                </Text>
              </Pressable>
            </View>
          ),
        }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={{ backgroundColor: 'transparent' }}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl, rowGap: SPACE.md }}>
          {existing ? <Muted>{t(S.writtenOn(formatDay(existing.createdAt, lang)))}</Muted> : null}

          {refs.map((r) => (
            <LinkedVerse key={linkKey(r)} link={r} onRemove={() => setRefs((list) => list.filter((x) => linkKey(x) !== linkKey(r)))} />
          ))}

          <View>
            <Text style={[styles.label, { color: palette.muted }]}>{t(S.titleLabel)}</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t(S.titlePlaceholder)}
              placeholderTextColor={palette.muted}
              accessibilityLabel={t(S.titleLabel)}
              maxLength={120}
              maxFontSizeMultiplier={cap}
              style={[...field, { fontSize: TYPE.title3, fontWeight: '700', minHeight: TOUCH + 4 }]}
            />
          </View>

          <View>
            <Text style={[styles.label, { color: palette.muted }]}>{t(S.bodyLabel)}</Text>
            <TextInput
              value={body}
              onChangeText={setBody}
              placeholder={t(S.bodyPlaceholder)}
              placeholderTextColor={palette.muted}
              accessibilityLabel={t(S.bodyLabel)}
              multiline
              textAlignVertical="top"
              maxFontSizeMultiplier={cap}
              autoFocus={!existing && !linked}
              style={[...field, { fontSize: TYPE.body * settings.textScale, lineHeight: TYPE.body * settings.textScale * 1.55, minHeight: 200 }]}
            />
          </View>

          <View>
            <GroupTitle title={t(S.moodLabel)} />
            <View accessibilityRole="radiogroup" accessibilityLabel={t(S.moodLabel)} style={styles.chips}>
              {MOODS.map((m) => (
                <Chip
                  key={m.id}
                  label={`${m.emoji} ${t(MOOD_LABELS[m.id])}`}
                  accessibilityLabel={t(MOOD_LABELS[m.id])}
                  active={mood === m.id}
                  onPress={() => setMood(m.id)}
                />
              ))}
            </View>
          </View>

          <View>
            <Text style={[styles.label, { color: palette.muted, marginTop: SPACE.md }]}>{t(S.tagsLabel)}</Text>
            <TextInput
              value={tags}
              onChangeText={setTags}
              placeholder={t(S.tagsPlaceholder)}
              placeholderTextColor={palette.muted}
              accessibilityLabel={t(S.tagsLabel)}
              accessibilityHint={t(S.tagsHint)}
              autoCapitalize="none"
              maxFontSizeMultiplier={cap}
              style={[...field, { fontSize: TYPE.callout, minHeight: TOUCH }]}
            />
            <Muted style={{ marginTop: SPACE.xs }}>{t(S.tagsHint)}</Muted>
          </View>

          {earlier.length ? (
            <View>
              <GroupTitle title={t(S.reflectionsOnVerse(earlier.length))} />
              {earlier.slice(0, 5).map((e) => (
                <Pressable
                  key={e.id}
                  onPress={() => router.replace({ pathname: '/journal/edit', params: { entry: e.id } })}
                  accessibilityRole="button"
                  accessibilityLabel={t(S.openReflectionA11y(e.title || t(S.untitled)))}
                  style={({ pressed }) => [styles.earlier, glass(palette), pressed && { opacity: 0.8 }]}>
                  <View style={{ flex: 1 }}>
                    <Text maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
                      {e.title || t(S.untitled)}
                    </Text>
                    <Muted>{formatDay(e.createdAt, lang)}</Muted>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={palette.muted} />
                </Pressable>
              ))}
            </View>
          ) : null}

          <View style={styles.private}>
            <Ionicons name="lock-closed-outline" size={14} color={palette.muted} />
            <Muted style={{ flex: 1 }}>{t(S.privateNote)}</Muted>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Backdrop>
  );
}

/** The verse a reflection is about, every line of it, in the book's colours. */
function LinkedVerse({ link, onRemove }: { link: VerseLink; onRemove: () => void }) {
  const { palette, settings } = usePrefs();
  const { t } = useI18n();
  const book = getEntry(link.id);
  const verse = loadChapter(link.id, link.chapter)?.verses.find((v) => String(v.number) === link.verse);
  const lines = sanskritLines(verse?.sanskrit);
  const ref = `${book?.title ?? link.id} ${formatVerseRef(link.id, link.chapter, link.verse)}`;
  const cover = coverFor(link.id, book?.category ?? 'other');
  const scale = settings.textScale;
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'flex-start', columnGap: SPACE.sm }}>
      <Pressable
        style={{ flex: 1 }}
        accessibilityRole="link"
        accessibilityLabel={t(S.openLinkedA11y(ref))}
        onPress={() => router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: link.id, chapter: String(link.chapter), verse: link.verse } })}>
        <Text style={[styles.label, { color: palette.muted }]}>{t(S.linkedVerse)}</Text>
        <View style={[styles.refPill, coverFill(cover, palette, true)]}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: '#ffffff', fontWeight: '700', fontSize: TYPE.footnote }}>
            {ref}
          </Text>
        </View>
        {lines.map((l, i) => (
          <Text
            key={i}
            maxFontSizeMultiplier={fontCap(scale)}
            style={{ color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.6 }}>
            {l}
            {i === lines.length - 1 && verse ? (
              <Text style={{ color: palette.gold }}>{` ॥ ${toDevanagari(verseMarkNumber(verse.number))} ॥`}</Text>
            ) : null}
          </Text>
        ))}
      </Pressable>
      <IconButton icon="close" tone="clear" onPress={onRemove} accessibilityLabel={t(S.unlinkVerseA11y(ref))} />
    </Card>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: TYPE.footnote, fontWeight: '600', marginBottom: SPACE.xs, marginLeft: SPACE.xs },
  field: { borderRadius: RADIUS.control, paddingHorizontal: SPACE.lg, paddingVertical: SPACE.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  refPill: { alignSelf: 'flex-start', borderRadius: RADIUS.pill, paddingHorizontal: SPACE.md, paddingVertical: 4, marginBottom: SPACE.sm },
  saveBtn: { minHeight: TOUCH, minWidth: TOUCH, paddingHorizontal: SPACE.md, alignItems: 'center', justifyContent: 'center' },
  earlier: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, borderRadius: RADIUS.row, padding: SPACE.md, marginBottom: SPACE.sm, minHeight: TOUCH },
  private: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.xs, marginTop: SPACE.md },
});
