import type { FeedTab } from '@/src/features/feed/useFeedTabs';
import { FEED_TABS } from '@/src/features/feed/useFeedTabs';
import { useAppTheme } from '@/src/theme/useAppTheme';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type FeedTopTabsProps = {
  value: FeedTab;
  onChange: (value: FeedTab) => void;
};

export function FeedTopTabs({ value, onChange }: FeedTopTabsProps) {
  const theme = useAppTheme();
  const { colors, spacing, radii, typography } = theme;

  return (
    <View
      style={[
        {
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md,
          borderBottomColor: colors.border,
          backgroundColor: colors.background,
        },
      ]}>
      <View
        style={[
          styles.topTabsContainer,
          {
            backgroundColor: colors.surface,
            borderRadius: radii.pill,
            borderColor: colors.borderSubtle,
          },
        ]}>
        {FEED_TABS.map((tab) => {
          const isActive = tab.key === value;

          return (
            <Pressable
              key={tab.key}
              style={({ pressed }) => [
                styles.topTabButton,
                {
                  backgroundColor: isActive ? colors.accentViolet : 'transparent',
                  borderRadius: radii.pill,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => onChange(tab.key)}>
              <Text
                style={[
                  styles.topTabLabel,
                  typography.body,
                  { color: isActive ? colors.surface : colors.textSecondary },
                ]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topTabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
    borderWidth: 1,
    overflow: 'hidden',
  },
  topTabButton: {
    flex: 1,
    minHeight: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  topTabLabel: {
    fontWeight: '700',
  },
});
