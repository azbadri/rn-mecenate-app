import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { Theme } from '@/src/theme/tokens';

import { EmptyStateCenteredWithInsets } from './EmptyStateCentered';
import { emptyStateStyles } from './emptyStateStyles';

type Author = {
  displayName: string;
  username: string;
  avatarUrl: string;
};

type Props = {
  theme: Theme;
  author: Author;
  onRetry: () => void;
};

const MESSAGE = 'Не удалось загрузить публикацию';

export function PublicationLoadErrorView({ theme, author, onRetry }: Props) {
  const { colors, radii: radius } = theme;
  const name = author.displayName || author.username;

  return (
    <SafeAreaView
      style={[emptyStateStyles.root, { backgroundColor: colors.background, flex: 1 }]}
      edges={['top', 'left', 'right']}>
      <View style={emptyStateStyles.authorRow}>
        <Image
          source={{ uri: author.avatarUrl }}
          style={[emptyStateStyles.avatar, { borderRadius: radius.pill, backgroundColor: colors.borderSubtle }]}
        />
        <Text style={[emptyStateStyles.authorName, { color: colors.textPrimary }]} numberOfLines={1}>
          {name}
        </Text>
      </View>
      <View style={[emptyStateStyles.root, emptyStateStyles.rootCentered]}>
        <EmptyStateCenteredWithInsets
          theme={theme}
          message={MESSAGE}
          actionLabel="Повторить"
          onAction={onRetry}
        />
      </View>
    </SafeAreaView>
  );
}
