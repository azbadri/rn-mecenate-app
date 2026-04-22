import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Image, StyleSheet, Text, useColorScheme, View } from 'react-native';

import type { Post } from '@/src/api/types';
import { CommentBubbleFilledIcon } from '@/src/components/icons/CommentBubbleFilledIcon';
import { HeartLikeFilledIcon } from '@/src/components/icons/HeartLikeFilledIcon';
import { palette } from '@/src/globals';
import type { Theme } from '@/src/theme/tokens';

type Props = {
  post: Post;
  theme: Theme;
};

const PHOTO_ASPECT = 1;

export function PostCard({ post, theme }: Props) {
  const { colors, spacing, radii: radius, typography } = theme;
  const isDark = useColorScheme() === 'dark';
  const pillNeutralBg = isDark ? colors.borderSubtle : palette['gray-100'];
  const likeInactiveFg = isDark ? colors.textSecondary : palette['gray-600'];
  const commentIconFg = isDark ? colors.textSecondary : palette['gray-500'];

  const likeBg = post.isLiked ? palette['rose-500'] : pillNeutralBg;
  const likeFg = post.isLiked ? palette.white : likeInactiveFg;
  const isPaid = post.tier === 'paid';
  const hasText = Boolean(post.title) || (!isPaid && Boolean(post.preview || post.body));

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          marginBottom: spacing.md,
        },
      ]}>
      <View style={{ paddingHorizontal: spacing.lg, paddingTop: 12 }}>
        <View style={styles.authorRow}>
          <Image
            source={{ uri: post.author.avatarUrl }}
            style={[styles.avatar, { borderRadius: radius.pill, backgroundColor: colors.borderSubtle }]}
          />
          <Text style={[styles.authorName, { color: colors.textPrimary, flex: 1 }]} numberOfLines={1}>
            {post.author.displayName || post.author.username}
          </Text>
        </View>
      </View>

      <View style={[styles.photoFrame, { backgroundColor: colors.borderSubtle, marginTop: spacing.lg }]}>
        {post.coverUrl && !isPaid ? (
          <Image source={{ uri: post.coverUrl }} style={styles.cover} resizeMode="cover" />
        ) : null}
        {isPaid ? (
          <View style={[styles.paidOverlay, { backgroundColor: colors.paidSurface }]}>
            <FontAwesome name="lock" size={20} color={colors.paidText} style={{ marginBottom: spacing.sm }} />
            <Text
              style={[
                typography.caption,
                { color: colors.paidText, textAlign: 'center', paddingHorizontal: spacing.md },
              ]}>
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

      {hasText ? (
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm }}>
          {post.title ? (
            <Text style={[styles.postTitle, { color: colors.textPrimary }]} numberOfLines={2}>
              {post.title}
            </Text>
          ) : null}

          {!isPaid && (post.preview || post.body) ? (
            <Text style={[styles.postBody, { color: colors.textPrimary }]} numberOfLines={4}>
              {post.preview || post.body}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View
        style={[
          styles.metaRow,
          { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 12, gap: spacing.sm },
        ]}>
        <View
          style={[
            styles.metaPill,
            {
              backgroundColor: likeBg,
              borderRadius: radius.pill,
              paddingVertical: 6,
              paddingLeft: 6,
              paddingRight: 12,
              gap: spacing.xs,
            },
          ]}>
          <View style={styles.metaIconBox}>
            <HeartLikeFilledIcon color={likeFg} size={16} />
          </View>
          <Text style={[styles.actionCount, { color: likeFg }]}>{post.likesCount}</Text>
        </View>
        <View
          style={[
            styles.metaPill,
            {
              backgroundColor: pillNeutralBg,
              borderRadius: radius.pill,
              paddingVertical: 6,
              paddingLeft: 6,
              paddingRight: 12,
              gap: spacing.xs,
            },
          ]}>
          <View style={styles.metaIconBox}>
            <CommentBubbleFilledIcon color={commentIconFg} size={16} />
          </View>
          <Text style={[styles.actionCount, { color: commentIconFg }]}>{post.commentsCount}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    overflow: 'hidden',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  authorName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  postTitle: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
  },
  postBody: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '500',
  },
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
    minHeight: 36,
  },
  metaIconBox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionCount: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '700',
  },
});
