import FontAwesome from '@expo/vector-icons/FontAwesome';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import Animated from 'react-native-reanimated';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import type { Post } from '@/src/api/types';
import { CommentBubbleFilledIcon } from '@/src/components/icons/CommentBubbleFilledIcon';
import { HeartLikeFilledIcon } from '@/src/components/icons/HeartLikeFilledIcon';
import { palette } from '@/src/globals';
import { useLikeAnimation } from '@/src/hooks/useLikeAnimation';
import { useTogglePostLike } from '@/src/hooks/usePostMutations';
import type { Theme } from '@/src/theme/tokens';

import {
  HiddenDonationCallout,
  HiddenFooterSkeleton,
  HiddenSubscriptionCallout,
} from './post-card';

type Props = {
  post: Post;
  theme: Theme;
};

const PHOTO_ASPECT = 1;
const HIDDEN_BLUR = 80;

export function PostCard({ post, theme }: Props) {
  const { colors, spacing, radii: radius } = theme;
  const isDark = useColorScheme() === 'dark';
  const toggleLikeMutation = useTogglePostLike(post.id);
  const pillNeutralBg = isDark ? colors.borderSubtle : palette['gray-100'];
  const likeInactiveFg = isDark ? colors.textSecondary : palette['gray-600'];
  const commentIconFg = isDark ? colors.textSecondary : palette['gray-500'];
  const brand = palette['violet-500'];
  const skeletonTrack = isDark ? colors.borderSubtle : palette['gray-100'];

  const likeBg = post.isLiked ? palette['rose-500'] : pillNeutralBg;
  const likeFg = post.isLiked ? palette.white : likeInactiveFg;
  const isPaid = post.tier === 'paid';
  const isDonation = post.isContentHidden === true;
  /** Платные и скрытые по донату — блюр, CTA и скелетон, без превью и actions */
  const isLocked = isPaid || isDonation;
  const hasText =
    !isLocked && (Boolean(post.title) || (!isPaid && Boolean(post.preview || post.body)));

  const { iconStyle: likeIconStyle, countStyle: likeCountStyle } = useLikeAnimation(
    post.likesCount,
  );

  const onLikePress = () => {
    toggleLikeMutation.mutate();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

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

      <View
        style={[
          styles.photoFrame,
          { backgroundColor: colors.borderSubtle, marginTop: spacing.lg },
        ]}>
        {isLocked ? (
          <>
            {post.coverUrl ? (
              <Image source={{ uri: post.coverUrl }} style={styles.cover} resizeMode="cover" />
            ) : null}
            {post.coverUrl ? (
              <BlurView
                intensity={HIDDEN_BLUR}
                style={StyleSheet.absoluteFill}
                tint="dark"
                experimentalBlurMethod="dimezisBlurView"
              />
            ) : null}
            <View style={[StyleSheet.absoluteFill, styles.hiddenDim]} />
            <View style={[StyleSheet.absoluteFill, styles.hiddenOverlayCenter, { padding: spacing.lg }]}>
              {isDonation ? (
                <HiddenDonationCallout accent={brand} />
              ) : (
                <HiddenSubscriptionCallout />
              )}
              {isDonation ? (
                <>
                  <Text style={styles.hiddenLine}>Контент скрыт пользователем.</Text>
                  <Text style={styles.hiddenSubline}>Доступ откроется после доната</Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.donateButton,
                      { backgroundColor: brand, opacity: pressed ? 0.9 : 1 },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Отправить донат"
                    onPress={() => {}}>
                    <Text style={styles.donateButtonText}>Отправить донат</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <Text style={styles.hiddenLine}>Контент скрыт пользователем.</Text>
                  <Text style={styles.hiddenLine}>
                  Доступ откроется после доната
                  </Text>
                  <Pressable
                    style={({ pressed }) => [
                      styles.donateButton,
                      { backgroundColor: brand, opacity: pressed ? 0.9 : 1, marginTop: spacing.sm },
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Отправить донат"
                    onPress={() => {}}>
                    <Text style={styles.donateButtonText}>Отправить донат</Text>
                  </Pressable>
                </>
              )}
            </View>
          </>
        ) : (
          <>
            {post.coverUrl ? (
              <Image source={{ uri: post.coverUrl }} style={styles.cover} resizeMode="cover" />
            ) : null}
            {!post.coverUrl ? (
              <View style={styles.noCoverPlaceholder}>
                <FontAwesome name="image" size={32} color={colors.iconMuted} />
              </View>
            ) : null}
          </>
        )}
      </View>

      {isLocked ? (
        <HiddenFooterSkeleton barColor={skeletonTrack} />
      ) : hasText ? (
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

      {isLocked ? null : (
        <View
          style={[
            styles.metaRow,
            { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 12, gap: spacing.sm },
          ]}>
          <Pressable
            onPress={onLikePress}
            accessibilityRole="button"
            accessibilityLabel="Лайк"
            style={({ pressed }) => [
              styles.metaPill,
              {
                backgroundColor: likeBg,
                borderRadius: radius.pill,
                paddingVertical: 6,
                paddingLeft: 6,
                paddingRight: 12,
                gap: spacing.xs,
                opacity: pressed ? 0.85 : 1,
              },
            ]}>
            <Animated.View style={[styles.metaIconBox, likeIconStyle]}>
              <HeartLikeFilledIcon color={likeFg} size={16} />
            </Animated.View>
            <Animated.Text style={[styles.actionCount, { color: likeFg }, likeCountStyle]}>
              {post.likesCount}
            </Animated.Text>
          </Pressable>
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
      )}
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
  hiddenDim: {
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  hiddenOverlayCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  hiddenLine: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  hiddenSubline: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 20,
  },
  donateButton: {
    width: 240,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
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
