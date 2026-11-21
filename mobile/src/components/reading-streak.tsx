import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui';
import { S, useI18n } from '@/i18n';
import { dayKey, streakInfo } from '@/lib/progress';
import { dateFromDayKey, useToday } from '@/lib/use-today';
import { useAppState } from '@/state/app-state';
import { quietFill, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

const DOT = 30;

/**
 * The gentle daily reading streak: days in a row, the best run, and the last seven days as dots. It never
 * scolds: a missed day just invites the reader to start again. Hidden until the first verse is read, and
 * when the reader turns it off in Settings. One element for TalkBack, read as a single sentence.
 */
export function ReadingStreakCard() {
  const { palette, progress, settings } = useAppState();
  const { t } = useI18n();
  // useToday() changes at midnight, so the card turns over even if the app stays open.
  const today = dayKey(dateFromDayKey(useToday()));
  const info = useMemo(() => streakInfo(progress, today), [progress, today]);
  if (!settings.showStreak || progress.days.length === 0) return null;

  const initials = t(S.weekdayInitials).split(',');
  const alive = info.current > 0;
  const note = info.readToday ? S.streakReadToday : alive ? S.streakKeepGoing : S.streakFresh;
  const readThisWeek = info.week.filter((d) => d.read).length;
  const accentWash = palette.dark ? 'rgba(255,159,10,0.16)' : 'rgba(194,65,12,0.10)';

  return (
    // One stop for TalkBack: the same facts as a sentence, instead of fourteen separate letters and dots.
    <View accessible accessibilityRole="summary" accessibilityLabel={t(S.streakA11y(info.current, info.best, info.readToday, readThisWeek))}>
    <Card style={{ borderRadius: RADIUS.panel - 2, rowGap: SPACE.md }}>
      <View style={styles.head}>
        <View style={[styles.flame, { backgroundColor: accentWash }]}>
          <Ionicons name={alive ? 'flame' : 'flame-outline'} size={22} color={palette.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
            {alive ? t(S.streakDays(info.current)) : t(S.streakStart)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
            {t(note)}
          </Text>
        </View>
        {info.best > 1 ? (
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.caption, fontWeight: '600' }}>
            {t(S.streakBest(info.best))}
          </Text>
        ) : null}
      </View>
      <View style={styles.week}>
        {info.week.map((d) => {
          const isToday = d.day === today;
          const weekday = dateFromDayKey(d.day).getDay();
          return (
            <View key={d.day} style={styles.dayCol}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: d.read ? palette.accent : quietFill(palette) },
                  isToday && !d.read && { borderWidth: 2, borderColor: palette.accent, backgroundColor: 'transparent' },
                ]}>
                {d.read ? <Ionicons name="checkmark" size={16} color={palette.onAccent} /> : null}
              </View>
              <Text
                maxFontSizeMultiplier={TITLE_FONT_CAP}
                style={{ color: isToday ? palette.accent : palette.muted, fontSize: TYPE.caption, fontWeight: isToday ? '700' : '500' }}>
                {initials[weekday] ?? ''}
              </Text>
            </View>
          );
        })}
      </View>
    </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md },
  flame: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  week: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center', rowGap: SPACE.xs, minWidth: DOT },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2, alignItems: 'center', justifyContent: 'center' },
});
