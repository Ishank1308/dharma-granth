import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { decodeVerse } from '@/components/compare-ui';
import { ActionButton } from '@/components/desk-ui';
import { Backdrop, GroupCard, GroupRow, GroupTitle, IconTile, LargeHeader, Muted } from '@/components/ui';
import { loadVerse, verseLabel } from '@/content/compare';
import { D, useI18n, type Msg } from '@/i18n';
import { addToQueue, EMPTY_DESK, queueKey, type QueueItem } from '@/lib/desk';
import { linkKey } from '@/lib/journal';
import { DEFAULT_LAYERS, MAX_SHEET_TITLE, sheetHtml, SHEET_LAYERS, type SheetLayer, type SheetVerse } from '@/lib/study-sheet';
import { cleanVerseField, sanskritLines } from '@/lib/verse-format';
import { useAppState } from '@/state/app-state';
import { useDesk } from '@/state/desk';
import { useJournal } from '@/state/journal';
import { switchOffTrack, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

const LAYER_LABELS: Record<SheetLayer, Msg> = {
  verse: D.layerVerse,
  translit: D.layerTranslit,
  hindi: D.layerHindi,
  english: D.layerEnglish,
  words: D.layerWords,
  notes: D.layerNotes,
};
const LAYER_ICONS: Record<SheetLayer, keyof typeof Ionicons.glyphMap> = {
  verse: 'book',
  translit: 'text',
  hindi: 'language',
  english: 'globe-outline',
  words: 'list',
  notes: 'leaf',
};

/** A4 at 72 points per inch, so the PDF matches the page the sheet is laid out for. */
const A4 = { width: 595, height: 842 };

/**
 * The study sheet, as the website's /pack: add verses (saved, queue, or a comparison), choose the layers,
 * and get a PDF to share or print. The PDF is built on the phone; reflections go in only when turned on.
 */
export default function SheetScreen() {
  const params = useLocalSearchParams<{ add?: string }>();
  const insets = useSafeAreaInsets();
  const { palette, bookmarks } = useAppState();
  const { desk } = useDesk();
  const { journal } = useJournal();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);

  // The sheet's own list reuses the queue's rules (no repeats, a cap), starting with any verses passed in.
  const [items, setItems] = useState<QueueItem[]>(() => {
    const passed = String(params.add ?? '')
      .split(',')
      .map((s) => decodeVerse(s))
      .filter((v): v is QueueItem => v !== null);
    return addToQueue(EMPTY_DESK, passed).desk.queue;
  });
  const [layers, setLayers] = useState(DEFAULT_LAYERS);
  const [title, setTitle] = useState('');
  const [busy, setBusy] = useState(false);

  const add = (list: QueueItem[]) => setItems((prev) => addToQueue({ ...EMPTY_DESK, queue: prev }, list).desk.queue);
  const saved = bookmarks.map((b) => ({ id: b.id, chapter: b.chapter, verse: b.verse }));

  const verses = useMemo(() => {
    const out: SheetVerse[] = [];
    let skipped = 0;
    for (const q of items) {
      const v = loadVerse(q.id, q.chapter, q.verse);
      if (!v) {
        skipped += 1;
        continue;
      }
      const notes = journal.entries
        .filter((e) => e.refs.some((r) => linkKey(r) === queueKey(q)))
        .map((e) => [e.title, e.body].filter(Boolean).join('\n'))
        .filter(Boolean);
      out.push({
        label: verseLabel(q.id, q.chapter, q.verse, lang),
        sanskrit: sanskritLines(cleanVerseField(v.sanskrit)),
        translit: cleanVerseField(v.transliteration) || undefined,
        hindi: cleanVerseField(v.hindi) || undefined,
        hindiAi: v.hindiSource === 'ai',
        english: cleanVerseField(v.translation) || undefined,
        englishAi: v.translationSource === 'ai',
        words: cleanVerseField(v.wordMeaning) || undefined,
        notes,
      });
    }
    return { out, skipped };
  }, [items, journal.entries, lang]);

  const html = () =>
    sheetHtml(title.trim() || t(D.sheetDefaultName), verses.out, layers, {
      lang,
      prepared: t(D.sheetPrepared(new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric', numberingSystem: 'latn' } as Intl.DateTimeFormatOptions))),
      hindi: t(D.sheetHindi),
      english: t(D.sheetEnglish),
      words: t(D.sheetWords),
      note: t(D.sheetNote),
      ai: t(D.sheetAi),
      footer: t(D.sheetFooter),
    });

  const share = async () => {
    setBusy(true);
    try {
      const { uri } = await Print.printToFileAsync({ html: html(), ...A4 });
      let target = uri;
      try {
        const dest = new File(Paths.cache, `dharma-granth-study-sheet-${new Date().toISOString().slice(0, 10)}.pdf`);
        if (dest.exists) dest.delete();
        await new File(uri).move(dest);
        target = dest.uri;
      } catch {
        // Keep the printer's own file name.
      }
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(target, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: t(D.sheetDialog) });
      } else {
        Alert.alert(t(D.sheetTitle), target);
      }
    } catch (e) {
      Alert.alert(t(D.sheetFailed), e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const print = async () => {
    setBusy(true);
    try {
      await Print.printAsync({ html: html(), ...A4 });
    } catch (e) {
      // Closing the print dialog is not an error worth a message.
      const msg = e instanceof Error ? e.message : String(e);
      if (!/cancel/i.test(msg)) Alert.alert(t(D.sheetFailed), msg);
    } finally {
      setBusy(false);
    }
  };

  const ready = verses.out.length > 0;

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.md }}>
        <LargeHeader title={D.sheetTitle} eyebrow={D.sheetEyebrow} subtitle={t(D.sheetSub)} />

        <GroupTitle title={t(D.sheetStepVerses)} />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <ActionButton icon="bookmark-outline" label={t(D.sheetAllSaved(saved.length))} disabled={saved.length === 0} onPress={() => add(saved)} />
          </View>
          <View style={{ flex: 1 }}>
            <ActionButton icon="list" label={t(D.sheetQueue(desk.queue.length))} disabled={desk.queue.length === 0} onPress={() => add(desk.queue)} />
          </View>
        </View>
        {items.length === 0 ? (
          <Muted style={{ paddingHorizontal: SPACE.xs }}>{saved.length || desk.queue.length ? t(D.sheetEmpty) : t(D.noSavedYet)}</Muted>
        ) : (
          <View style={styles.chips}>
            {items.map((q) => {
              const label = verseLabel(q.id, q.chapter, q.verse, lang);
              return (
                <Pressable
                  key={queueKey(q)}
                  onPress={() => setItems((prev) => prev.filter((x) => queueKey(x) !== queueKey(q)))}
                  accessibilityRole="button"
                  accessibilityLabel={t(D.sheetRemove(label))}
                  hitSlop={4}
                  style={({ pressed }) => [styles.pill, { backgroundColor: quietFill(palette), borderColor: palette.rim }, pressed && { opacity: 0.6 }]}>
                  <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.footnote, fontWeight: '600' }}>
                    {label}
                  </Text>
                  <Ionicons name="close" size={16} color={palette.muted} />
                </Pressable>
              );
            })}
            <Pressable onPress={() => setItems([])} accessibilityRole="button" style={({ pressed }) => [styles.pill, { opacity: pressed ? 0.6 : 1 }]}>
              <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.footnote, fontWeight: '700' }}>
                {t(D.sheetClear)}
              </Text>
            </Pressable>
          </View>
        )}

        <GroupTitle title={t(D.sheetStepLayers)} />
        <GroupCard>
          {SHEET_LAYERS.map((l, i) => (
            <GroupRow key={l} standalone={i === 0} inset={60}>
              <IconTile icon={LAYER_ICONS[l]} color={[hues.saffron, hues.gold, hues.peacock, hues.indigo, hues.lotus, hues.tulsi][i]} />
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body }}>
                {t(LAYER_LABELS[l])}
              </Text>
              <Switch
                value={layers[l]}
                onValueChange={(v) => setLayers((p) => ({ ...p, [l]: v }))}
                trackColor={{ true: palette.accent, false: switchOffTrack(palette) }}
                thumbColor="#fff"
                {...({ activeThumbColor: '#fff' } as object)}
                accessibilityLabel={t(LAYER_LABELS[l])}
              />
            </GroupRow>
          ))}
        </GroupCard>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, fontWeight: '600', paddingHorizontal: SPACE.xs }}>
          {t(D.sheetNameLabel)}
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          maxLength={MAX_SHEET_TITLE}
          placeholder={t(D.sheetDefaultName)}
          placeholderTextColor={palette.muted}
          accessibilityLabel={t(D.sheetNameLabel)}
          maxFontSizeMultiplier={UI_FONT_CAP}
          style={[styles.input, { color: palette.text, borderColor: palette.rim, backgroundColor: quietFill(palette) }]}
        />

        <GroupTitle title={t(D.sheetStepMake)} />
        <Text accessibilityLiveRegion="polite" maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead, paddingHorizontal: SPACE.xs }}>
          {ready ? t(D.sheetReady(verses.out.length)) : t(D.sheetEmpty)}
          {verses.skipped ? ` ${t(D.sheetSkipped(verses.skipped))}` : ''}
        </Text>
        <ActionButton primary icon="share-outline" label={t(D.sheetShare)} disabled={!ready || busy} onPress={share} />
        <ActionButton icon="print-outline" label={t(D.sheetPrint)} disabled={!ready || busy} onPress={print} />
      </ScrollView>
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', columnGap: SPACE.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: SPACE.xs,
    minHeight: 40,
    paddingHorizontal: SPACE.md,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  input: { minHeight: TOUCH, borderRadius: RADIUS.control, borderWidth: 1.5, paddingHorizontal: SPACE.md, fontSize: TYPE.body },
});
