import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Card, IconTile } from '@/components/ui';
import { S, useI18n } from '@/i18n';
import { streaks } from '@/lib/sankalpa';
import { useAppState } from '@/state/app-state';
import { usePractice } from '@/state/practice';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

/** साधना's way in, on the Saved tab: the website keeps saved verses and daily practice together (/practice/). */
export function PracticeCard() {
  const { palette } = useAppState();
  const { t } = useI18n();
  const { sankalpa } = usePractice();
  const run = sankalpa.isActive ? streaks(sankalpa.completedDates).current : 0;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t(S.practiceEntry)}
      onPress={() => router.push('/plans')}
      style={({ pressed }) => [{ marginBottom: SPACE.lg }, pressed && { transform: [{ scale: 0.985 }] }]}>
      <Card style={{ borderRadius: RADIUS.panel - 2, flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
        <IconTile icon="flame" color={huesFor({ dark: false }).saffron} />
        <View style={{ flex: 1 }}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
            {t(S.practiceTitle)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
            {run > 0 ? `${t(S.sankalpaTitle)} · ${run} ${t(S.streakDays)}` : t(S.practiceEntryDetail)}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.muted} />
      </Card>
    </Pressable>
  );
}
