import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '@/src/globals';
import type { Theme } from '@/src/theme/tokens';

import { AxolotlMascotIllustration } from './AxolotlMascotIllustration';
import { emptyStateStyles } from './emptyStateStyles';

type Props = {
  theme: Theme;
  message: string;
  actionLabel: string;
  onAction: () => void;
  contentBottomPadding?: number;
};


export function EmptyStateCentered({
  theme,
  message,
  actionLabel,
  onAction,
  contentBottomPadding = 0,
}: Props) {
  const { colors } = theme;
  const brand = palette['violet-600'];

  return (
    <View style={[emptyStateStyles.content, { paddingBottom: contentBottomPadding }]}>
      <AxolotlMascotIllustration width={220} />
      <Text style={[emptyStateStyles.message, { color: colors.textPrimary }]}>{message}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        onPress={onAction}
        style={({ pressed }) => [
          emptyStateStyles.button,
          { backgroundColor: brand, opacity: pressed ? 0.9 : 1 },
        ]}>
        <Text style={emptyStateStyles.buttonLabel}>{actionLabel}</Text>
      </Pressable>
    </View>
  );
}

export function EmptyStateCenteredWithInsets(props: Props) {
  const insets = useSafeAreaInsets();
  return (
    <EmptyStateCentered
      {...props}
      contentBottomPadding={Math.max(24, insets.bottom + 8)}
    />
  );
}
