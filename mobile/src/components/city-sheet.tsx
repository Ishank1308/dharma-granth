import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView, Text, View } from 'react-native';

import { GroupRow, Muted } from '@/components/ui';
import { CITIES } from '@/content/explore';
import { S, useI18n } from '@/i18n';
import { Sheet } from '@/motion/sheet';
import { usePrefs } from '@/state/app-state';
import { SPACE, TITLE_FONT_CAP, TYPE } from '@/theme/themes';

/** The Panchang's city picker, the website's list of cities with verified coordinates, as a bottom sheet. */
export function CitySheet({ visible, selected, onClose, onPick }: { visible: boolean; selected: string; onClose: () => void; onPick: (id: string) => void }) {
  const { palette } = usePrefs();
  const { t, lang } = useI18n();
  return (
    <Sheet visible={visible} title={t(S.chooseCity)} onClose={onClose} maxHeight="80%">
      <ScrollView accessibilityRole="radiogroup">
        {CITIES.map((c, i) => {
          const active = c.id === selected;
          return (
            <GroupRow
              key={c.id}
              first={i === 0}
              last={i === CITIES.length - 1}
              inset={SPACE.lg}
              accessibilityRole="button"
              accessibilityLabel={lang === 'hi' ? c.nameHi : c.name}
              onPress={() => onPick(c.id)}
              highlight={active}>
              <View style={{ flex: 1 }}>
                <Text maxFontSizeMultiplier={TITLE_FONT_CAP} style={{ color: palette.text, fontSize: TYPE.body, fontWeight: active ? '700' : '500' }}>
                  {lang === 'hi' ? c.nameHi : c.name}
                </Text>
                <Muted style={{ fontSize: TYPE.caption }}>
                  {c.region}, {c.country}
                </Muted>
              </View>
              {active ? <Ionicons name="checkmark" size={20} color={palette.accent} /> : null}
            </GroupRow>
          );
        })}
      </ScrollView>
    </Sheet>
  );
}
