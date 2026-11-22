import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { openEntry, VerseBlock } from '@/components/knowledge-ui';
import { GroupRow, IconTile } from '@/components/ui';
import { getEntry, SITE } from '@/content/catalog';
import { loadVerse, verseLabel, type CompareLink, type CompareTarget } from '@/content/compare';
import { useDownloads } from '@/content/downloads';
import type { KnowledgeKind } from '@/content/knowledge-types';
import { D, useI18n } from '@/i18n';
import type { QueueItem } from '@/lib/desk';
import { cleanVerseField, MEANING_COPY } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE, UI_FONT_CAP, type Hues } from '@/theme/themes';

/** "bhagavadgita:2:47" <-> a verse, for the pair screen's route params. */
export function encodeVerse(q: QueueItem): string {
  return `${q.id}:${q.chapter}:${q.verse}`;
}
export function decodeVerse(raw: string | string[] | undefined): QueueItem | null {
  const s = Array.isArray(raw) ? raw[0] : raw;
  const m = s ? /^([a-z0-9-]+):(\d+):([^:]+)$/.exec(s) : null;
  return m ? { id: m[1], chapter: Number(m[2]), verse: m[3] } : null;
}

/**
 * One verse of a comparison, always whole (every line of the Sanskrit), with the meaning in the reader's
 * language and an AI mark where the translation was machine-drafted. A book that is not on the phone says
 * so and offers the website.
 */
export function CompareVerse({ item, hue, slot }: { item: QueueItem; hue: keyof Hues; slot?: string }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { installed } = useDownloads();
  const entry = getEntry(item.id);
  const label = `${slot ? `${slot} · ` : ''}${verseLabel(item.id, item.chapter, item.verse, lang)}`;
  const onPhone = Boolean(entry && (entry.bundled || installed[entry.id]));
  const verse = onPhone ? loadVerse(item.id, item.chapter, item.verse) : undefined;

  if (!verse) {
    const url = `${SITE}/scripture/${item.id}/chapter/${item.chapter}/verse/${item.verse}/`;
    return (
      <View style={[styles.missing, { backgroundColor: quietFill(palette), borderLeftColor: huesFor(palette)[hue] }]}>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: huesFor(palette)[hue], fontSize: TYPE.footnote, fontWeight: '700' }}>
          {label}
        </Text>
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.subhead }}>
          {t(onPhone ? D.compareMissing : D.compareNotOnPhone)}
        </Text>
        <Pressable onPress={() => Linking.openURL(url).catch(() => {})} accessibilityRole="link" style={({ pressed }) => [styles.web, { opacity: pressed ? 0.6 : 1 }]}>
          <Ionicons name="open-outline" size={16} color={palette.accent} />
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>
            {t(D.compareOpenWeb)}
          </Text>
        </Pressable>
      </View>
    );
  }

  const hi = cleanVerseField(verse.hindi);
  const en = cleanVerseField(verse.translation);
  const useHi = lang === 'hi' ? Boolean(hi) : !en && Boolean(hi);
  const translation = useHi ? hi : en;
  const ai = useHi ? verse.hindiSource === 'ai' : verse.translationSource === 'ai';
  return (
    <VerseBlock
      sanskrit={cleanVerseField(verse.sanskrit)}
      translit={cleanVerseField(verse.transliteration)}
      translation={translation || undefined}
      reference={label}
      hue={hue}
      target={{ id: item.id, chapter: item.chapter, verse: item.verse }}>
      {translation && ai ? (
        <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
          {useHi ? MEANING_COPY.aiLabelHi : MEANING_COPY.aiLabelEn}
        </Text>
      ) : null}
    </VerseBlock>
  );
}

/** Where a non-verse link of a comparison set opens: the reader, a knowledge or Wisdom page, or the website. */
export function openTarget(target: CompareTarget) {
  switch (target.kind) {
    case 'verse':
      router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: target.id, chapter: String(target.chapter), verse: target.verse } });
      return;
    case 'chapter':
      router.push({ pathname: '/scripture/[id]/[chapter]', params: { id: target.id, chapter: String(target.chapter) } });
      return;
    case 'book':
      router.push({ pathname: '/scripture/[id]', params: { id: target.id } });
      return;
    case 'knowledge':
      openEntry(target.section as KnowledgeKind, target.id);
      return;
    case 'wisdom':
      router.push({ pathname: '/wisdom/[slug]', params: { slug: target.id } });
      return;
    case 'web':
      Linking.openURL(target.url).catch(() => {});
  }
}

const ICONS: Record<CompareTarget['kind'], keyof typeof Ionicons.glyphMap> = {
  verse: 'book',
  chapter: 'book',
  book: 'library',
  knowledge: 'bulb',
  wisdom: 'leaf',
  web: 'globe',
};

/** A link of a comparison set that is not a single verse: a row with its note. */
export function CompareLinkRow({ link, first, hue }: { link: CompareLink; first: boolean; hue: string }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const web = link.target.kind === 'web';
  return (
    <GroupRow standalone={first} accessibilityRole="link" onPress={() => openTarget(link.target)} accessibilityLabel={`${t(link.title)}. ${t(link.note)}`}>
      <IconTile icon={ICONS[link.target.kind]} color={hue} />
      <View style={{ flex: 1 }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
          {lang === 'hi' ? link.title.hi : link.title.en}
        </Text>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote }}>
          {t(link.note)}
        </Text>
      </View>
      <Ionicons name={web ? 'open-outline' : 'chevron-forward'} size={18} color={palette.muted} />
    </GroupRow>
  );
}

const styles = StyleSheet.create({
  missing: { borderLeftWidth: 3, borderRadius: RADIUS.row, padding: SPACE.md, rowGap: SPACE.xs },
  web: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.xs, minHeight: TOUCH },
});
