import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { accentFill, Backdrop, Card, Muted } from '@/components/ui';
import { gitaChapter, GITA_CHAPTERS, sankalpaInvocation } from '@/content/plans';
import { S, useI18n, type Msg } from '@/i18n';
import { openReading } from '@/lib/open-reading';
import { SANKALPA_MODES, streaks, todayChapters, type SankalpaMode } from '@/lib/sankalpa';
import { toDevanagari } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { practice, usePractice } from '@/state/practice';
import { fontCap, huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

const MODE_COPY: Record<SankalpaMode, { title: Msg; detail: Msg }> = {
  '18-days': { title: S.mode18, detail: S.mode18Detail },
  'daily-chapter': { title: S.modeDaily, detail: S.modeDailyDetail },
  'weekly-parayana': { title: S.modeWeekly, detail: S.modeWeeklyDetail },
};

/** गीता संकल्प साधना, as the website's /practice/gita-sankalpa/: take a pledge, read, keep the day. */
export default function SankalpaScreen() {
  const insets = useSafeAreaInsets();
  const { palette, settings } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const { sankalpa, ready } = usePractice();
  const [editing, setEditing] = useState(false);
  const [mode, setMode] = useState<SankalpaMode>(sankalpa.mode);
  const [chapter, setChapter] = useState(sankalpa.targetChapter);
  const scale = settings.textScale;
  const cap = fontCap(scale);
  const hi = lang === 'hi';
  const name = (n: number) => (hi ? gitaChapter(n)?.nameHi : gitaChapter(n)?.name) ?? String(n);
  const words = sankalpaInvocation();
  const choosing = ready && (!sankalpa.isActive || editing);
  const today = todayChapters(sankalpa);
  const streak = streaks(sankalpa.completedDates);
  const sunday = sankalpa.mode === 'weekly-parayana' && new Date().getDay() === 0;

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: t(S.sankalpaTitle) }} />
      <ScrollView style={{ backgroundColor: 'transparent' }} contentContainerStyle={{ padding: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2, rowGap: SPACE.lg }}>
        {choosing ? (
          <>
            <Text maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.5 }}>
              {t(S.sankalpaIntro)}
            </Text>
            {/* The traditional words, in a gilt panel like the website's invocation. */}
            <Card strong>
              <Text style={[styles.label, { color: palette.gold }]}>{t(S.sankalpaWords)}</Text>
              <Text selectable maxFontSizeMultiplier={cap} style={{ color: palette.text, fontSize: TYPE.callout * scale, lineHeight: TYPE.callout * scale * 1.75, textAlign: 'center' }}>
                {words.sanskrit}
              </Text>
              <View style={[styles.rule, { backgroundColor: palette.gold }]} />
              <Text selectable maxFontSizeMultiplier={cap} style={{ color: palette.textSecondary, fontSize: TYPE.subhead * scale, lineHeight: TYPE.subhead * scale * 1.6, textAlign: 'center' }}>
                {words.hindi}
              </Text>
            </Card>

            <View accessibilityRole="radiogroup" style={{ rowGap: SPACE.sm }}>
              <Text style={[styles.label, { color: palette.muted }]}>{t(S.sankalpaChooseMode)}</Text>
              {SANKALPA_MODES.map((m) => {
                const active = mode === m;
                return (
                  <Pressable
                    key={m}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    onPress={() => setMode(m)}
                    style={[styles.option, { borderColor: active ? palette.accent : palette.border, backgroundColor: active ? (palette.dark ? 'rgba(255,159,10,0.10)' : 'rgba(194,65,12,0.06)') : palette.glassStrong }]}>
                    <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={22} color={active ? palette.accent : palette.muted} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{t(MODE_COPY[m].title)}</Text>
                      <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{t(MODE_COPY[m].detail)}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            {mode === 'daily-chapter' ? (
              <View>
                <Text style={[styles.label, { color: palette.muted }]}>{t(S.pickChapter)}</Text>
                <View accessibilityRole="radiogroup" style={styles.grid}>
                  {GITA_CHAPTERS.map((c) => {
                    const active = chapter === c.number;
                    return (
                      <Pressable
                        key={c.number}
                        accessibilityRole="radio"
                        accessibilityState={{ checked: active }}
                        accessibilityLabel={t(S.chapterTickA11y(c.number, hi ? c.nameHi : c.name))}
                        onPress={() => setChapter(c.number)}
                        style={[styles.cell, active ? accentFill(palette) : { backgroundColor: quietFill(palette) }]}>
                        <Text style={{ color: active ? palette.onAccent : palette.text, fontSize: TYPE.body, fontWeight: '700' }}>{toDevanagari(c.number)}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Muted style={{ marginTop: SPACE.sm }}>{name(chapter)}</Muted>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                practice.takeSankalpa(mode, chapter);
                setEditing(false);
              }}
              style={({ pressed }) => [styles.primary, accentFill(palette), pressed && { opacity: 0.85 }]}>
              <Ionicons name="flame" size={18} color={palette.onAccent} />
              <Text style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>{t(S.takeSankalpa)}</Text>
            </Pressable>
          </>
        ) : ready ? (
          <>
            <Card strong style={{ rowGap: SPACE.md }}>
              <View style={styles.between}>
                <Text style={[styles.label, { color: hues.saffron, marginBottom: 0 }]}>{t(S.todayReading)}</Text>
                <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{t(S.dayOfCycle(today.dayInCycle, sankalpa.currentCycle))}</Text>
              </View>
              {sunday ? <Muted>{t(S.sundayReflection)}</Muted> : null}
              {today.chapters.map((c) => (
                <Pressable
                  key={c}
                  accessibilityRole="button"
                  accessibilityLabel={t(S.openChapter(c))}
                  onPress={() => openReading('bhagavadgita', c)}
                  style={({ pressed }) => [styles.chapterRow, { backgroundColor: quietFill(palette) }, pressed && { opacity: 0.7 }]}>
                  <Text style={{ color: palette.gold, fontSize: TYPE.title2, fontWeight: '700', minWidth: 36, textAlign: 'center' }}>{toDevanagari(c)}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{name(c)}</Text>
                    <Text style={{ color: palette.muted, fontSize: TYPE.footnote }} numberOfLines={2}>
                      {hi ? gitaChapter(c)?.themeHi : gitaChapter(c)?.theme}
                    </Text>
                  </View>
                  <Ionicons name="book-outline" size={20} color={palette.accent} />
                </Pressable>
              ))}
              {today.done ? (
                <View style={styles.doneRow}>
                  <Ionicons name="checkmark-circle" size={22} color={hues.tulsi} />
                  <Text style={{ flex: 1, color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>{t(S.todayDone)}</Text>
                </View>
              ) : (
                <Pressable accessibilityRole="button" onPress={practice.keepToday} style={({ pressed }) => [styles.primary, accentFill(palette), pressed && { opacity: 0.85 }]}>
                  <Ionicons name="checkmark" size={20} color={palette.onAccent} />
                  <Text style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>{t(S.markTodayDone)}</Text>
                </Pressable>
              )}
            </Card>

            <View style={styles.stats}>
              <Stat value={streak.current} label={t(S.sankalpaStreakLabel)} />
              <Stat value={Math.max(sankalpa.bestStreak, streak.best)} label={t(S.bestStreak)} />
              <Stat value={sankalpa.cyclesCompleted} label={t(S.cyclesDone)} />
              <Stat value={sankalpa.totalChaptersRead} label={t(S.chaptersRead)} />
            </View>

            {sankalpa.mode !== 'daily-chapter' ? (
              <Card>
                <Text style={[styles.label, { color: palette.muted }]}>{t(S.cycleGrid)}</Text>
                <View style={styles.grid}>
                  {GITA_CHAPTERS.map((c) => {
                    const read = sankalpa.cycleChapters.includes(c.number);
                    return (
                      <Pressable
                        key={c.number}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: read }}
                        accessibilityLabel={t(S.chapterTickA11y(c.number, hi ? c.nameHi : c.name))}
                        onPress={() => practice.toggleChapter(c.number)}
                        style={[styles.cell, read ? { backgroundColor: hues.tulsi } : { backgroundColor: quietFill(palette) }]}>
                        <Text style={{ color: read ? '#ffffff' : palette.text, fontSize: TYPE.body, fontWeight: '700' }}>{toDevanagari(c.number)}</Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Muted style={{ marginTop: SPACE.sm }}>{t(S.cycleGridHint)}</Muted>
              </Card>
            ) : null}

            <View style={styles.between}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  setMode(sankalpa.mode);
                  setChapter(sankalpa.targetChapter);
                  setEditing(true);
                }}
                style={({ pressed }) => [styles.secondary, { borderColor: palette.border }, pressed && { opacity: 0.7 }]}>
                <Text style={{ color: palette.accent, fontSize: TYPE.subhead, fontWeight: '600' }}>{t(S.changeSankalpa)}</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={practice.pauseSankalpa} style={({ pressed }) => [styles.secondary, { borderColor: palette.border }, pressed && { opacity: 0.7 }]}>
                <Text style={{ color: palette.muted, fontSize: TYPE.subhead, fontWeight: '600' }}>{t(S.pauseSankalpa)}</Text>
              </Pressable>
            </View>
          </>
        ) : null}
        <Muted style={{ textAlign: 'center' }}>{t(S.practiceKeptLocal)}</Muted>
      </ScrollView>
    </Backdrop>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  const { palette } = usePrefs();
  return (
    <View style={[styles.stat, { backgroundColor: palette.glassStrong, borderColor: palette.rim }]}>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.title2, fontWeight: '800' }}>
        {value}
      </Text>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: TYPE.footnote, fontWeight: '700', marginBottom: SPACE.sm },
  rule: { height: 1, width: '50%', alignSelf: 'center', opacity: 0.5, marginVertical: SPACE.md },
  option: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, borderWidth: 1.5, borderRadius: RADIUS.row, padding: SPACE.md, minHeight: TOUCH + 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACE.sm },
  cell: { width: TOUCH, height: TOUCH, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: SPACE.sm, minHeight: TOUCH + 4, borderRadius: RADIUS.pill },
  secondary: { minHeight: TOUCH, paddingHorizontal: SPACE.lg, borderRadius: RADIUS.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  between: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', columnGap: SPACE.sm },
  chapterRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, borderRadius: RADIUS.row, padding: SPACE.md, minHeight: TOUCH + 8 },
  doneRow: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.sm, minHeight: TOUCH },
  stats: { flexDirection: 'row', columnGap: SPACE.sm },
  stat: { flex: 1, alignItems: 'center', borderRadius: RADIUS.row, borderWidth: 1, paddingVertical: SPACE.md, paddingHorizontal: 4 },
});
