import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Theme } from '@/src/theme/tokens';

type Props = {
  theme: Theme;
  onRetry: () => void;
};

export function FeedError({ theme, onRetry }: Props) {
  const { colors, spacing, radii: radius } = theme;

  return (
    <View style={[styles.wrap, { padding: spacing.xl, backgroundColor: colors.background }]}>
      <FontAwesome name="exclamation-circle" size={48} color={colors.iconMuted} />
      <Text style={[styles.message, { color: colors.textPrimary, marginTop: spacing.lg }]}>
        Не удалось загрузить публикации
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Повторить загрузку"
        onPress={onRetry}
        style={({ pressed }) => [
          styles.button,
          {
            marginTop: spacing.xl,
            backgroundColor: colors.accent,
            borderRadius: radius.md,
            opacity: pressed ? 0.85 : 1,
          },
        ]}>
        <Text style={[styles.buttonLabel, { color: paletteButtonText }]}>
          Повторить
        </Text>
      </Pressable>
    </View>
  );
}

const paletteButtonText = '#FFFFFF';

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
