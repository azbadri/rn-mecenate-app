import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { Post } from '@/src/api/types';
import type { Theme } from '@/src/theme/tokens';

type Props = {
  post: Post;
  theme: Theme;
};

export function PostCard({ post, theme }: Props) {
  const { colors, spacing, radii: radius, typography } = theme;
  const isPaid = post.tier === 'paid';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          marginHorizontal: spacing.lg,
          marginBottom: spacing.md,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: colors.border,
        },
      ]}>
      <View style={[styles.authorRow, { padding: spacing.md, gap: spacing.sm }]}>
        <Image
          source={{ uri: post.author.avatarUrl }}
          style={[styles.avatar, { borderRadius: radius.pill, backgroundColor: colors.borderSubtle }]}
        />
        <Text style={[styles.authorName, typography.authorName, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>
          {post.author.displayName || post.author.username}
        </Text>
      </View>

      {post.title ? (
        <Text style={[styles.title, typography.title, { color: colors.textPrimary, paddingHorizontal: spacing.md, marginBottom: spacing.sm }]} numberOfLines={2}>
          {post.title}
        </Text>
      ) : null}

      {isPaid ? (
        <View
          style={[
            styles.paidBox,
            {
              marginHorizontal: spacing.md,
              marginBottom: spacing.md,
              padding: spacing.md,
              backgroundColor: colors.paidSurface,
              borderRadius: radius.md,
            },
          ]}>
          <FontAwesome name="lock" size={14} color={colors.paidText} style={{ marginRight: spacing.sm }} />
          <Text style={[typography.caption, { color: colors.paidText, flex: 1 }]}>
            Контент доступен по подписке
          </Text>
        </View>
      ) : (
        <Text
          style={[typography.body, { color: colors.textSecondary, paddingHorizontal: spacing.md, marginBottom: spacing.md }]}
          numberOfLines={4}>
          {post.preview || post.body}
        </Text>
      )}

      {post.coverUrl ? (
        <Image
          source={{ uri: post.coverUrl }}
          style={[styles.cover, { backgroundColor: colors.borderSubtle }]}
          resizeMode="cover"
        />
      ) : null}

      <View style={[styles.metaRow, { padding: spacing.md, gap: spacing.lg }]}>
        <View style={styles.metaItem}>
          <FontAwesome name={post.isLiked ? 'heart' : 'heart-o'} size={16} color={post.isLiked ? colors.error : colors.iconMuted} />
          <Text style={[typography.meta, { color: colors.textSecondary, marginLeft: spacing.xs }]}>
            {post.likesCount}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <FontAwesome name="comment-o" size={16} color={colors.iconMuted} />
          <Text style={[typography.meta, { color: colors.textSecondary, marginLeft: spacing.xs }]}>
            {post.commentsCount}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
  },
  authorName: {},
  title: {},
  paidBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
