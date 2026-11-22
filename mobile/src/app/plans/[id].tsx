import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { accentFill, Backdrop, Eyebrow, GroupRow, Muted } from '@/components/ui';
import { getPlan } from '@/content/plans';
import { S, useI18n } from '@/i18n';
import { openReading } from '@/lib/open-reading';
import { toDevanagari } from '@/lib/verse-format';
import { usePrefs } from '@/state/app-state';
import { practice, usePractice } from '@/state/practice';
import { huesFor, quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/** One reading plan (website /learn/plans/): its days, each opening the reader, each ticked when read. */
export default function PlanScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const hues = huesFor(palette);
  const plan = getPlan(String(id));
  const progress = usePractice().plans[String(id)];
  const hi = lang === 'hi';

  if (!plan) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: t(S.notFoundTitle) }} />
        <Muted>{t(S.scriptureNotFound)}</Muted>
      </View>
    );
  }

  const done = new Set(progress?.done ?? []);
  const total = plan.days.length;
  const next = plan.days.find((d) => !done.has(d.day));
  const last = total - 1;

  return (
    <Backdrop quiet>
      <Stack.Screen options={{ title: t(S.readingPlans) }} />
      <FlatList
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ padding: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}
        data={plan.days}
        keyExtractor={(d) => String(d.day)}
        ListHeaderComponent={
          <View style={{ rowGap: SPACE.md, marginBottom: SPACE.lg }}>
            <Eyebrow {...S.planDays(total, plan.dailyMinutes)} />
            <Text accessibilityRole="header" maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.title1, fontWeight: '800' }}>
              {hi ? plan.titleHi : plan.title}
            </Text>
            <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.textSecondary, fontSize: TYPE.callout, lineHeight: TYPE.callout * 1.5 }}>
              {hi ? plan.descriptionHi : plan.description}
            </Text>
            {progress ? (
              <View style={{ rowGap: 6 }}>
                <View style={[styles.track, { backgroundColor: quietFill(palette) }]}>
                  <View style={[styles.fill, { backgroundColor: palette.accent, width: `${Math.max(3, Math.round((done.size / total) * 100))}%` }]} />
                </View>
                <Text style={{ color: palette.muted, fontSize: TYPE.footnote }}>{done.size === total ? t(S.planComplete) : t(S.planProgress(done.size, total))}</Text>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={() => practice.startPlan(plan.id)}
                style={({ pressed }) => [styles.primary, accentFill(palette), pressed && { opacity: 0.85 }]}>
                <Ionicons name="play" size={18} color={palette.onAccent} />
                <Text style={{ color: palette.onAccent, fontSize: TYPE.body, fontWeight: '700' }}>{t(S.startPlan)}</Text>
              </Pressable>
            )}
          </View>
        }
        ListFooterComponent={
          progress ? (
            <Pressable accessibilityRole="button" onPress={() => practice.resetPlan(plan.id)} style={({ pressed }) => [styles.reset, { borderColor: palette.border }, pressed && { opacity: 0.7 }]}>
              <Text style={{ color: palette.muted, fontSize: TYPE.subhead, fontWeight: '600' }}>{t(S.resetPlan)}</Text>
            </Pressable>
          ) : undefined
        }
        renderItem={({ item: d, index }) => {
          const isDone = done.has(d.day);
          const isNext = progress && next?.day === d.day;
          const title = hi ? d.titleHi : d.title;
          return (
            // The tick and the open button sit side by side, not nested: TalkBack cannot reach a button inside a button.
            <GroupRow first={index === 0} last={index === last} inset={68} highlight={isNext}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isDone }}
                accessibilityLabel={t(S.markDayA11y(d.day))}
                hitSlop={8}
                onPress={() => practice.toggleDay(plan.id, d.day)}
                style={[styles.check, isDone ? { backgroundColor: hues.tulsi, borderColor: hues.tulsi } : { borderColor: palette.border }]}>
                {isDone ? <Ionicons name="checkmark" size={20} color="#ffffff" /> : <Text style={{ color: palette.gold, fontWeight: '700' }}>{toDevanagari(d.day)}</Text>}
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t(S.planDayA11y(d.day, title))}
                onPress={() => openReading(d.scriptureId, d.chapter, d.verse)}
                style={({ pressed }) => [styles.open, pressed && { opacity: 0.6 }]}>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>{title}</Text>
                  <Text style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
                    {hi ? d.focusHi : d.focus} · {t(S.minutes(d.minutes))}
                  </Text>
                </View>
                <Ionicons name="book-outline" size={18} color={palette.muted} />
              </Pressable>
            </GroupRow>
          );
        }}
      />
    </Backdrop>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  track: { height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', columnGap: SPACE.sm, minHeight: TOUCH + 4, borderRadius: RADIUS.pill },
  check: { width: TOUCH - 4, height: TOUCH - 4, borderRadius: (TOUCH - 4) / 2, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  open: { flex: 1, flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md, minHeight: TOUCH },
  reset: { alignSelf: 'center', minHeight: TOUCH, paddingHorizontal: SPACE.lg, borderRadius: RADIUS.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
