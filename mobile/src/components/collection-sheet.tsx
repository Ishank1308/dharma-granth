import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { accentFill } from '@/components/ui';
import { COLLECTION_LABELS, S, useI18n, type Msg } from '@/i18n';
import { allCollections, collectionOf, isBuiltin, MAX_COLLECTION_NAME, type CollectionError, type VerseCollection, type VerseLink } from '@/lib/journal';
import { PressableScale } from '@/motion/pressable-scale';
import { Sheet as MotionSheet } from '@/motion/sheet';
import { usePrefs } from '@/state/app-state';
import { useJournal } from '@/state/journal';
import { quietFill, RADIUS, separator, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

export const COLLECTION_ERRORS: Record<CollectionError, Msg> = {
  empty: S.collectionErrorEmpty,
  taken: S.collectionErrorTaken,
  builtin: S.builtinCollectionNote,
  missing: S.collectionErrorEmpty,
};

/** A collection's name in the reader's language: built-ins are translated, custom names are as typed. */
export function useCollectionName(): (c: Pick<VerseCollection, 'id' | 'name'>) => string {
  const { t } = useI18n();
  return (c) => (isBuiltin(c.id) ? t(COLLECTION_LABELS[c.id]) : c.name);
}

/** The bottom sheet's frame (src/motion/sheet), lifted over the keyboard for the name field. */
function Sheet(props: { visible: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  return <MotionSheet {...props} keyboard />;
}

/** A name field with Save, for a new collection or a rename. */
export function NameField({ initial = '', onSubmit, autoFocus }: { initial?: string; onSubmit: (name: string) => CollectionError | undefined; autoFocus?: boolean }) {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const [name, setName] = useState(initial);
  const [error, setError] = useState<CollectionError | undefined>();
  const submit = () => setError(onSubmit(name));
  return (
    <View style={{ rowGap: SPACE.xs }}>
      <View style={styles.nameRow}>
        <TextInput
          value={name}
          onChangeText={(v) => {
            setName(v);
            setError(undefined);
          }}
          onSubmitEditing={submit}
          autoFocus={autoFocus}
          maxLength={MAX_COLLECTION_NAME}
          placeholder={t(S.collectionNamePlaceholder)}
          placeholderTextColor={palette.muted}
          accessibilityLabel={t(S.collectionName)}
          returnKeyType="done"
          style={[styles.input, { color: palette.text, backgroundColor: quietFill(palette), borderColor: error ? '#dc2626' : 'transparent' }]}
        />
        <PressableScale scaleTo={0.94} onPress={submit} accessibilityRole="button" style={[styles.save, accentFill(palette)]}>
          <Text maxFontSizeMultiplier={1.4} style={{ color: palette.onAccent, fontWeight: '700', fontSize: TYPE.callout }}>
            {t(S.saveBtn)}
          </Text>
        </PressableScale>
      </View>
      {error ? (
        <Text accessibilityLiveRegion="polite" style={{ color: palette.dark ? '#f87171' : '#b91c1c', fontSize: TYPE.footnote }}>
          {t(COLLECTION_ERRORS[error])}
        </Text>
      ) : null}
    </View>
  );
}

/** Move one saved verse to a collection, or make a new one for it. */
export function CollectionSheet({ verse, verseLabel, onClose }: { verse: VerseLink | null; verseLabel: string; onClose: () => void }) {
  const { palette } = usePrefs();
  const { journal, moveVerse, createCollection } = useJournal();
  const { t } = useI18n();
  const nameOf = useCollectionName();
  // The new-collection field closes again when the sheet opens for another verse.
  const [adding, setAdding] = useState<VerseLink | null>(null);
  if (!verse) return null;
  const current = collectionOf(journal, verse);
  const pick = (id: string) => {
    moveVerse(verse, id);
    onClose();
  };
  return (
    <Sheet visible={!!verse} title={t(S.moveToCollection)} onClose={onClose}>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginBottom: SPACE.sm, paddingHorizontal: SPACE.xs }}>
        {verseLabel}
      </Text>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View accessibilityRole="radiogroup" accessibilityLabel={t(S.collections)} style={[styles.group, { backgroundColor: quietFill(palette) }]}>
          {allCollections(journal).map((c, i) => {
            const active = c.id === current;
            return (
              <Pressable
                key={c.id}
                onPress={() => pick(c.id)}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                style={({ pressed }) => [styles.row, pressed && { backgroundColor: quietFill(palette) }]}>
                {i ? <View style={[styles.hairline, { backgroundColor: separator(palette) }]} /> : null}
                <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={active ? palette.accent : palette.muted} />
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ flex: 1, color: palette.text, fontSize: TYPE.body, fontWeight: active ? '700' : '400' }}>
                  {nameOf(c)}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ marginTop: SPACE.md }}>
          {adding === verse ? (
            <NameField
              autoFocus
              onSubmit={(name) => {
                const res = createCollection(name);
                if (res.id) pick(res.id);
                return res.error;
              }}
            />
          ) : (
            <Pressable onPress={() => setAdding(verse)} accessibilityRole="button" style={({ pressed }) => [styles.addRow, pressed && { opacity: 0.7 }]}>
              <Ionicons name="add-circle-outline" size={22} color={palette.accent} />
              <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.body, fontWeight: '600' }}>
                {t(S.newCollection)}
              </Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </Sheet>
  );
}

/** Name a new collection, or rename a custom one. */
export function NameSheet({ visible, title, initial, onSubmit, onClose }: { visible: boolean; title: string; initial?: string; onSubmit: (name: string) => CollectionError | undefined; onClose: () => void }) {
  return (
    <Sheet visible={visible} title={title} onClose={onClose}>
      {/* Keyed, so the field starts from the right name each time the sheet opens. */}
      <NameField key={visible ? `open:${initial ?? ''}` : 'closed'} initial={initial} autoFocus onSubmit={onSubmit} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  group: { borderRadius: RADIUS.row, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH + 4, paddingHorizontal: SPACE.lg },
  hairline: { position: 'absolute', top: 0, left: 52, right: 0, height: StyleSheet.hairlineWidth * 2 },
  addRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, minHeight: TOUCH, paddingHorizontal: SPACE.sm },
  nameRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm },
  input: { flex: 1, minHeight: TOUCH, borderRadius: RADIUS.control, paddingHorizontal: SPACE.md, fontSize: TYPE.body, borderWidth: 1.5 },
  save: { minHeight: TOUCH, paddingHorizontal: SPACE.lg, borderRadius: RADIUS.pill, alignItems: 'center', justifyContent: 'center' },
});
