/**
 * The "Verse of the day" home-screen widget (Android only), drawn with react-native-android-widget.
 * The widget is plain data in, widget tree out: no hooks or app state, because it is also rendered by a
 * headless task while the app is closed (see ./task-handler).
 */
import { FlexWidget, TextWidget, type ColorProp } from 'react-native-android-widget';

import { dailyVerse, getEntry, loadChapter } from '@/content/catalog';
import type { Lang } from '@/i18n/language';
import { S } from '@/i18n/strings';
import { formatVerseRef, sanskritLines } from '@/lib/verse-format';
import { THEMES, type Palette, type ThemeName } from '@/theme/themes';

/** Must match the widget `name` in app.json (the react-native-android-widget plugin). */
export const DAILY_VERSE_WIDGET = 'DailyVerse';

export interface DailyVerseWidgetData {
  /** Every line of the shloka: the widget shrinks the text to fit, it never cuts a verse short. */
  lines: string[];
  label: string;
  reference: string;
  /** Deep link into the reader, scrolled to the verse. */
  uri: string;
  a11y: string;
}

/** Today's verse as the widget shows it, or undefined if the Gita is not bundled. */
export function dailyVerseWidgetData(lang: Lang, date = new Date()): DailyVerseWidgetData | undefined {
  const pick = dailyVerse(date);
  if (!pick) return undefined;
  const verse = loadChapter(pick.id, pick.chapter)?.verses[pick.index];
  if (!verse) return undefined;
  const lines = sanskritLines(verse.sanskrit);
  if (lines.length === 0) return undefined;
  const ref = formatVerseRef(pick.id, pick.chapter, verse.number);
  const reference = pick.id === 'bhagavadgita' ? S.gitaRef(ref)[lang] : `${getEntry(pick.id)?.title ?? ''} ${ref}`.trim();
  return {
    lines,
    label: S.verseOfTheDay[lang],
    reference,
    uri: `dharmagranth://scripture/${pick.id}/${pick.chapter}?verse=${encodeURIComponent(String(verse.number))}`,
    a11y: S.verseOfTheDayA11y[lang],
  };
}

const PAD = 16;
const LABEL_SIZE = 12;
const REF_SIZE = 12;

/**
 * A starting size for the verse that suits the widget's height, so a two-line shloka on a big widget
 * is not tiny. Android's autosize then shrinks it further whenever a line wraps.
 */
function verseFontSize(lines: number, widthDp: number, heightDp: number): number {
  const room = heightDp - PAD * 2 - LABEL_SIZE * 1.6 - REF_SIZE * 1.6 - 12;
  const byHeight = room / (Math.max(1, lines) * 1.5);
  const byWidth = widthDp / 14;
  return Math.round(Math.max(10, Math.min(22, byHeight, byWidth)));
}

function hex(color: string): ColorProp {
  return color as ColorProp;
}

function Card({
  data,
  palette,
  width,
  height,
}: {
  data: DailyVerseWidgetData | undefined;
  palette: Palette;
  width: number;
  height: number;
}) {
  const uri = data?.uri ?? 'dharmagranth://';
  return (
    <FlexWidget
      clickAction="OPEN_URI"
      clickActionData={{ uri }}
      accessibilityLabel={data?.a11y ?? 'Dharma Granth'}
      style={{
        height: 'match_parent',
        width: 'match_parent',
        flexDirection: 'column',
        padding: PAD,
        backgroundColor: hex(palette.card),
        borderRadius: 24,
        borderWidth: 1,
        borderColor: hex(palette.border),
      }}>
      <TextWidget
        text={data?.label ?? 'Dharma Granth'}
        style={{ fontSize: LABEL_SIZE, fontWeight: '700', color: hex(palette.accent), letterSpacing: 0.04 }}
      />
      <FlexWidget style={{ flex: 1, width: 'match_parent', justifyContent: 'center', marginTop: 6, marginBottom: 6 }}>
        <TextWidget
          text={data ? data.lines.join('\n') : 'Open the library · ग्रन्थ खोलें'}
          style={{
            width: 'match_parent',
            height: 'match_parent',
            fontSize: data ? verseFontSize(data.lines.length, width, height) : 14,
            adjustsFontSizeToFit: true,
            lineSpacingExtra: 2,
            color: hex(palette.text),
          }}
        />
      </FlexWidget>
      {data ? <TextWidget text={data.reference} style={{ fontSize: REF_SIZE, color: hex(palette.muted) }} /> : null}
    </FlexWidget>
  );
}

/**
 * Light and dark versions; the launcher picks one from the phone's dark mode. The light version keeps
 * the reader's light theme (Day, Sunset or Paper), the dark one is always Dark.
 */
export function DailyVerseWidget({
  data,
  theme,
  width,
  height,
}: {
  data: DailyVerseWidgetData | undefined;
  theme: ThemeName;
  width: number;
  height: number;
}) {
  const light = THEMES[theme].dark ? THEMES.day : THEMES[theme];
  return {
    light: <Card data={data} palette={light} width={width} height={height} />,
    dark: <Card data={data} palette={THEMES.dark} width={width} height={height} />,
  };
}
