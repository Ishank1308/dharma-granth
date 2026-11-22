import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Backdrop, GroupCard, GroupRow, GroupTitle, LargeHeader, Muted } from '@/components/ui';
import { daysBetween, festivalById, FESTIVALS, formatDay, isoDate, nextDateOf, todayForLocation, upcomingFestivals } from '@/content/explore';
import { S, useI18n } from '@/i18n';
import { usePanchangCity } from '@/lib/panchang-city';
import { usePrefs } from '@/state/app-state';
import { festivalColors } from '@/theme/festival-colors';
import { SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

export { ErrorBoundary } from '@/components/error-boundary';

/**
 * Festivals, as dharmagranth.dev/festivals/: the dated calendar of the coming months, then a guide to each
 * major festival (meaning, story, practices, chants and regional customs) from the website's data/festivals.ts.
 */
export default function FestivalsScreen() {
  const insets = useSafeAreaInsets();
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  const [city] = usePanchangCity();
  const today = isoDate(todayForLocation(city));
  const upcoming = upcomingFestivals(today, 12);

  return (
    <Backdrop>
      <Stack.Screen options={{ title: '', headerTransparent: true, headerStyle: { backgroundColor: 'transparent' } }} />
      <ScrollView
        style={{ backgroundColor: 'transparent' }}
        contentContainerStyle={{ paddingTop: insets.top + 56, paddingHorizontal: SPACE.lg, paddingBottom: insets.bottom + SPACE.xxl * 2 }}>
        <LargeHeader title={S.festivalsTitle} eyebrow={S.festivalsEyebrow} />

        <GroupTitle title={t(S.upcoming)} />
        <GroupCard>
          {upcoming.map((f, i) => {
            const page = f.festivalId ? festivalById(f.festivalId) : undefined;
            const name = lang === 'hi' ? (f.nameHindi ?? f.name) : f.name;
            const when = daysBetween(today, f.date);
            const body = (
              <>
                <View style={styles.dateBox}>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.title3, fontWeight: '800' }}>
                    {Number(f.date.slice(8, 10))}
                  </Text>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: 11, fontWeight: '600' }}>
                    {formatMonth(f.date, lang)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.callout, fontWeight: '600' }}>
                    {name}
                  </Text>
                  <Muted style={{ fontSize: TYPE.caption, marginTop: 1 }}>
                    {formatDay(f.date, lang)} · {t(S.inDays(when))}
                  </Muted>
                  {f.note && lang === 'en' ? <Muted style={{ fontSize: TYPE.caption, marginTop: 2 }}>{f.note}</Muted> : null}
                </View>
                {page ? <Ionicons name="chevron-forward" size={18} color={palette.muted} /> : null}
              </>
            );
            return (
              <GroupRow
                key={f.date + f.name}
                standalone={i === 0}
                inset={72}
                highlight={when <= 7}
                accessibilityLabel={t(S.festivalA11y(name, formatDay(f.date, lang)))}
                onPress={page ? () => router.push({ pathname: '/explore/festivals/[id]', params: { id: page.id } }) : undefined}>
                {body}
              </GroupRow>
            );
          })}
        </GroupCard>
        <Muted style={{ fontSize: TYPE.caption, marginTop: SPACE.sm, paddingHorizontal: SPACE.xs }}>{t(S.festivalDatesNote)}</Muted>

        <GroupTitle title={t(S.allFestivals)} />
        <GroupCard>
          {FESTIVALS.map((f, i) => {
            const next = nextDateOf(f.id, today);
            const [from, to] = festivalColors(f.gradient);
            return (
              <GroupRow
                key={f.id}
                standalone={i === 0}
                inset={72}
                accessibilityLabel={`${f.name}, ${f.sanskrit}. ${f.shortDesc}`}
                onPress={() => router.push({ pathname: '/explore/festivals/[id]', params: { id: f.id } })}>
                <View style={[styles.icon, { backgroundColor: from }, !palette.lite && { backgroundImage: `linear-gradient(140deg, ${from} 0%, ${to} 100%)` }]}>
                  <Text allowFontScaling={false} style={{ fontSize: 24 }}>
                    {f.icon}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
                    {lang === 'hi' ? f.sanskrit : `${f.name} · ${f.sanskrit}`}
                  </Text>
                  <Muted style={{ fontSize: TYPE.footnote, marginTop: 1 }}>{f.shortDesc}</Muted>
                  {next ? (
                    <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.accent, fontSize: TYPE.caption, fontWeight: '700', marginTop: 3 }}>
                      {t(S.festivalNext(formatDay(next.date, lang)))}
                    </Text>
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

function formatMonth(iso: string, lang: 'en' | 'hi'): string {
  try {
    const [y, m, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat(lang === 'hi' ? 'hi-IN' : 'en-IN', { month: 'short' }).format(new Date(y, m - 1, d, 12));
  } catch {
    return iso.slice(5, 7);
  }
}

const styles = StyleSheet.create({
  dateBox: { width: 44, alignItems: 'center' },
  icon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
});
