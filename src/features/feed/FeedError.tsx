import { View } from 'react-native';

import { EmptyStateCenteredWithInsets } from '@/src/components/empty-states/EmptyStateCentered';
import type { Theme } from '@/src/theme/tokens';

type Props = {
  theme: Theme;
  onRetry: () => void;
};

export function FeedError({ theme, onRetry }: Props) {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <EmptyStateCenteredWithInsets
        theme={theme}
        message="Не удалось загрузить публикации"
        actionLabel="Повторить"
        onAction={onRetry}
      />
    </View>
  );
}
