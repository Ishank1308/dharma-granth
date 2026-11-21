import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Card, CoverTile } from '@/components/ui';
import { ASHTAVAKRA_CHAPTERS, ASHTAVAKRA_VERSES } from '@/content/ashtavakra';
import { S, useI18n } from '@/i18n';
import { useAppState } from '@/state/app-state';
import { coverFor } from '@/theme/covers';
import { RADIUS, SPACE, TITLE_FONT_CAP, TOUCH, TYPE } from '@/theme/themes';

/** The Ashtavakra Gita lives outside the catalog (its own study edition), so the Library opens it from here. */
export function AshtavakraCard() {
  const { palette } = useAppState();
  const { t } = useI18n();
  const chapters = ASHTAVAKRA_CHAPTERS.filter((c) => c.verseCount > 0).length;
  if (!chapters) return null;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${t(S.ashtavakraTitle)}. ${t(S.ashtavakraLibraryLine(chapters, ASHTAVAKRA_VERSES))}`}
      onPress={() => router.push('/ashtavakra')}
      style={({ pressed }) => pressed && { transform: [{ scale: 0.985 }] }}>
      <Card style={{ borderRadius: RADIUS.panel - 2, flexDirection: 'row', alignItems: 'center', columnGap: SPACE.md }}>
        <CoverTile cover={coverFor('ashtavakra', 'vedanta')} letter="अ" size={TOUCH} />
        <View style={{ flex: 1 }}>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '700' }}>
            {t(S.ashtavakraTitle)}
          </Text>
          <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
            {t(S.ashtavakraLibraryLine(chapters, ASHTAVAKRA_VERSES))}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.muted} />
      </Card>
    </Pressable>
  );
}
