import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { GroupRow, groupSurface, IconTile, Muted } from '@/components/ui';
import { S, useI18n } from '@/i18n';
import { streaks } from '@/lib/sankalpa';
import { usePrefs } from '@/state/app-state';
import { usePractice } from '@/state/practice';
import { huesFor, RADIUS, SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

/** साधना's way in, on the Saved tab: the website keeps saved verses and daily practice together (/practice/). */
export function PracticeCard() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const { sankalpa } = usePractice();
  const run = sankalpa.isActive ? streaks(sankalpa.completedDates).current : 0;
  const detail = run > 0 ? `${t(S.sankalpaTitle)} · ${t(S.sankalpaRun(run))}` : t(S.practiceEntryDetail);
  return (
    <GroupRow
      standalone
      onPress={() => router.push('/plans')}
      accessibilityLabel={`${t(S.practiceTitle)}, ${detail}`}
      style={[{ borderRadius: RADIUS.group, marginBottom: SPACE.lg }, groupSurface(palette)]}>
      <IconTile icon="flame-outline" color={huesFor(palette).vermilion} />
      <View style={{ flex: 1 }}>
        <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
          {t(S.practiceTitle)}
        </Text>
        <Muted>{detail}</Muted>
      </View>
      <Ionicons name="chevron-forward" size={18} color={palette.muted} />
    </GroupRow>
  );
}
