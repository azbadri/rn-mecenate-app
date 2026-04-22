import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Theme } from '@/src/theme/tokens';

import { EmptyStateCenteredWithInsets } from './EmptyStateCentered';
import { emptyStateStyles } from './emptyStateStyles';

type Props = {
  theme: Theme;
  onGoHome: () => void;
};

const MESSAGE = 'По вашему запросу ничего не найдено';
 
export function QueryNotFoundView({ theme, onGoHome }: Props) {
  const { colors } = theme;

  return (
    <SafeAreaView
      style={[emptyStateStyles.root, { backgroundColor: colors.background, flex: 1 }]}
      edges={['top', 'left', 'right']}>
      <View style={[emptyStateStyles.root, emptyStateStyles.rootCentered, { flex: 1 }]}>
        <EmptyStateCenteredWithInsets
          theme={theme}
          message={MESSAGE}
          actionLabel="На главную"
          onAction={onGoHome}
        />
      </View>
    </SafeAreaView>
  );
}
