import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, StyleSheet, Text, View } from 'react-native';

import type { Post } from '@/src/api/types';
import type { Theme } from '@/src/theme/tokens';

type Props = {
  post: Post;
  theme: Theme;
};

const PHOTO_ASPECT = 3 / 3;

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
      <View style={[styles.authorRow, { padding: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm }]}>
        <Image
          source={{ uri: post.author.avatarUrl }}
          style={[styles.avatar, { borderRadius: radius.pill, backgroundColor: colors.borderSubtle }]}
        />
        <Text
          style={[styles.authorName, typography.authorName, { color: colors.textPrimary, flex: 1 }]}
          numberOfLines={1}>
          {post.author.displayName || post.author.username}
        </Text>
      </View>

      <View style={[styles.photoFrame, { backgroundColor: colors.borderSubtle }]}>
        {post.coverUrl && !isPaid ? (
          <Image
            source={{ uri: post.coverUrl }}
            style={styles.cover}
            resizeMode="cover"
          />
        ) : null}
        {isPaid ? (
          <View style={[styles.paidOverlay, { backgroundColor: colors.paidSurface }]}>
            <FontAwesome name="lock" size={20} color={colors.paidText} style={{ marginBottom: spacing.sm }} />
            <Text style={[typography.caption, { color: colors.paidText, textAlign: 'center', paddingHorizontal: spacing.md }]}>
              Контент доступен по подписке
            </Text>
          </View>
        ) : null}
        {!post.coverUrl && !isPaid ? (
          <View style={styles.noCoverPlaceholder}>
            <FontAwesome name="image" size={32} color={colors.iconMuted} />
          </View>
        ) : null}
      </View>

      {post.title ? (
        <Text
          style={[
            styles.title,
            typography.title,
            { color: colors.textPrimary, paddingHorizontal: spacing.md, marginTop: spacing.md, marginBottom: spacing.sm },
          ]}
          numberOfLines={2}>
          {post.title}
        </Text>
      ) : null}

      {!isPaid ? (
        <Text
          style={[
            typography.body,
            { color: colors.textSecondary, paddingHorizontal: spacing.md, marginBottom: spacing.md },
          ]}
          numberOfLines={4}>
          {post.preview || post.body}
        </Text>
      ) : null}

      <View style={[styles.metaRow, { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm }]}>
        <View
          style={[
            styles.metaPill,
            {
              backgroundColor: colors.borderSubtle,
              borderRadius: radius.pill,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
            },
          ]}>
          <FontAwesome
            name={post.isLiked ? 'heart' : 'heart-o'}
            size={14}
            color={post.isLiked ? colors.error : colors.iconMuted}
          />
          <Text style={[typography.meta, { color: colors.textSecondary, marginLeft: spacing.xs }]}>
            {post.likesCount}
          </Text>
        </View>
        <View
          style={[
            styles.metaPill,
            {
              backgroundColor: colors.borderSubtle,
              borderRadius: radius.pill,
              paddingVertical: spacing.sm,
              paddingHorizontal: spacing.md,
            },
          ]}>
          <FontAwesome name="comment-o" size={14} color={colors.iconMuted} />
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
  photoFrame: {
    width: '100%',
    aspectRatio: PHOTO_ASPECT,
    overflow: 'hidden',
  },
  cover: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  paidOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noCoverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
