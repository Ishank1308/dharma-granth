import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, Card, GroupCard, GroupRow, GroupTitle, IconTile, LargeHeader } from '@/components/ui';
import { gitaChapter, READING_PLANS } from '@/content/plans';
import { S, useI18n } from '@/i18n';
import { streaks, todayChapters } from '@/lib/sankalpa';
import { usePrefs } from '@/state/app-state';
import { usePractice } from '@/state/practice';
import { huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

const TILE = huesFor({ dark: false });

/** साधना: the Gita Sankalpa and the reading plans, as the website's /practice/ and /learn/plans/. */
export default function PracticeScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const { sankalpa, plans } = usePractice();
  const today = todayChapters(sankalpa);
  const streak = streaks(sankalpa.completedDates);
  const hi = lang === 'hi';

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView style={{ backgroundColor: 'transparent' }} contentContainerStyle={{ paddingTop: insets.top + 24, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}>
        <LargeHeader title={S.practiceTitle} eyebrow={S.practiceEyebrow} subtitle={t(S.practiceKeptLocal)} />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(S.sankalpaTitle)}
          onPress={() => router.push('/plans/sankalpa')}
          style={({ pressed }) => [{ marginBottom: SPACE.lg }, pressed && { transform: [{ scale: 0.985 }] }]}>
          <Card strong style={{ borderRadius: RADIUS.panel - 2, rowGap: SPACE.md }}>
            <View style={styles.row}>
              <IconTile icon="flame" color={TILE.saffron} />
              <View style={{ flex: 1 }}>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title3, fontWeight: '700' }}>
                  {t(S.sankalpaTitle)}
                </Text>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                  {sankalpa.isActive
                    ? today.done
                      ? t(S.todayDone)
                      : `${t(S.todayReading)}: ${today.chapters.map((c) => (hi ? gitaChapter(c)?.nameHi : gitaChapter(c)?.name) ?? c).join(', ')}`
                    : t(S.sankalpaIntro)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={palette.muted} />
            </View>
            {sankalpa.isActive ? (
              <View style={styles.stats}>
                <Stat value={streak.current} label={t(S.sankalpaStreakLabel)} />
                <Stat value={Math.max(sankalpa.bestStreak, streak.best)} label={t(S.bestStreak)} />
                <Stat value={sankalpa.cyclesCompleted} label={t(S.cyclesDone)} />
              </View>
            ) : null}
          </Card>
        </Pressable>

        <GroupTitle title={t(S.readingPlans)} detail={String(READING_PLANS.length)} />
        <GroupCard>
          {READING_PLANS.map((p, i) => {
            const done = plans[p.id]?.done.length ?? 0;
            const total = p.days.length;
            return (
              <GroupRow key={p.id} standalone={i === 0} inset={64} accessibilityLabel={hi ? p.titleHi : p.title} onPress={() => router.push({ pathname: '/plans/[id]', params: { id: p.id } })}>
                <IconTile icon={p.id.startsWith('gita') ? 'book' : 'leaf'} color={p.id.startsWith('gita') ? TILE.indigo : TILE.tulsi} />
                <View style={{ flex: 1, rowGap: 4 }}>
                  <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{hi ? p.titleHi : p.title}</Text>
                  <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>
                    {plans[p.id] ? t(S.planProgress(done, total)) : t(S.planDays(total, p.dailyMinutes))}
                  </Text>
                  {plans[p.id] ? (
                    <View style={[styles.track, { backgroundColor: quietFill(palette) }]}>
                      <View style={[styles.fill, { backgroundColor: palette.accent, width: `${Math.max(3, Math.round((done / total) * 100))}%` }]} />
                    </View>
                  ) : null}
                </View>
                <Ionicons name="chevron-forward" size={18} color={palette.muted} />
              </GroupRow>
            );
          })}
        </GroupCard>
      </ScrollView>
    </Backdrop>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  const { palette } = usePrefs();
  return (
    <View style={[styles.stat, { backgroundColor: quietFill(palette) }]}>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.title2, fontWeight: '800' }}>
        {value}
      </Text>
      <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  stats: { flexDirection: 'row', columnGap: SPACE.sm },
  stat: { flex: 1, alignItems: 'center', borderRadius: RADIUS.row, paddingVertical: SPACE.sm },
  track: { height: 5, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 5, borderRadius: 3 },
});
