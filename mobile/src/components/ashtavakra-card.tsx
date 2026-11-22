import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { CoverBook } from '@/components/art/cover-book';
import { coverArt } from '@/components/art/cover-art';
import { GroupCard, GroupRow } from '@/components/ui';
import { ASHTAVAKRA_CHAPTERS, ASHTAVAKRA_VERSES } from '@/content/ashtavakra';
import { S, useI18n } from '@/i18n';
import { usePrefs } from '@/state/app-state';
import { coverFor } from '@/theme/covers';
import { TYPE, UI_FONT_CAP } from '@/theme/themes';

/** The Ashtavakra Gita lives outside the catalog (its own study edition), so the Library opens it from here. */
export function AshtavakraCard() {
  const { palette } = usePrefs();
  const { t } = useI18n();
  const chapters = ASHTAVAKRA_CHAPTERS.filter((c) => c.verseCount > 0).length;
  if (!chapters) return null;
  const line = t(S.ashtavakraLibraryLine(chapters, ASHTAVAKRA_VERSES));
  return (
    <GroupCard>
      <GroupRow standalone inset={60} accessibilityLabel={`${t(S.ashtavakraTitle)}. ${line}`} onPress={() => router.push('/ashtavakra')}>
        <CoverBook cover={coverFor('ashtavakra', 'vedanta')} art={coverArt('ashtavakra', 'vedanta')} width={40} turn={0} />
        <View style={{ flex: 1 }}>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: '600' }}>
            {t(S.ashtavakraTitle)}
          </Text>
          <Text maxFontSizeMultiplier={UI_FONT_CAP} style={{ color: palette.muted, fontSize: TYPE.footnote, marginTop: 2 }}>
            {line}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={palette.muted} />
      </GroupRow>
    </GroupCard>
  );
}
