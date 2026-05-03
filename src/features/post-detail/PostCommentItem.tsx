import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useRef } from 'react';
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import type { Comment } from '@/src/api/types';
import { HeartLikeFilledIcon } from '@/src/components/icons/HeartLikeFilledIcon';
import { HeartLikeWholeIcon } from '@/src/components/icons/HeartLikeWholeIcon';
import { palette } from '@/src/globals';
import { useAppTheme } from '@/src/theme/useAppTheme';

type Props = {
  comment: Comment;
  liked: boolean;
  likeCount: number;
  onToggleLike: (commentId: string) => void;
};

export function PostCommentItem({ comment, liked, likeCount, onToggleLike }: Props) {
  const theme = useAppTheme();
  const isDark = useColorScheme() === 'dark';
  const likeScale = useSharedValue(1);
  const likeCountScale = useSharedValue(1);
  const prevLikeCountRef = useRef<number | null>(null);
  const iconColor = useMemo(() => {
    if (liked) return palette['rose-500'];
    return isDark ? theme.colors.textSecondary : palette['gray-500'];
  }, [isDark, liked, theme.colors.textSecondary]);

  useEffect(() => {
    if (prevLikeCountRef.current == null) {
      prevLikeCountRef.current = likeCount;
      return;
    }

    if (prevLikeCountRef.current !== likeCount) {
      likeScale.value = withSequence(
        withTiming(1.15, { duration: 140 }),
        withTiming(1, { duration: 180 }),
      );
      likeCountScale.value = withSequence(
        withTiming(1.2, { duration: 140 }),
        withTiming(1, { duration: 180 }),
      );
      prevLikeCountRef.current = likeCount;
    }
  }, [likeCount, likeCountScale, likeScale]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const countStyle = useAnimatedStyle(() => ({
    transform: [{ scale: likeCountScale.value }],
  }));

  const onPressLike = () => {
    onToggleLike(comment.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  };

  return (
    <View style={styles.row}>
      <Image
        source={{ uri: comment.author.avatarUrl }}
        style={[
          styles.avatar,
          { backgroundColor: theme.colors.borderSubtle, borderRadius: theme.radii.pill },
        ]}
      />
      <View style={styles.body}>
        <Text style={[styles.author, { color: theme.colors.textPrimary }]}>
          {comment.author.displayName || comment.author.username}
        </Text>
        <Text style={[styles.text, { color: theme.colors.textPrimary }]}>{comment.text}</Text>
      </View>
      <Pressable
        onPress={onPressLike}
        accessibilityRole="button"
        accessibilityLabel="Лайк комментария"
        style={styles.likeButton}>
        <Animated.View style={iconStyle}>
          {!liked ? (
            <HeartLikeFilledIcon color={iconColor} size={16} />
          ) : (
            <HeartLikeWholeIcon color={iconColor} size={16} />
          )}
        </Animated.View>
        {likeCount > 0 ? (
          <Animated.Text style={[styles.likeCount, countStyle]}>{likeCount}</Animated.Text>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  author: {
    fontSize: 13,
    fontWeight: '700',
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
  likeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 4,
  },
  likeCount: {
    fontSize: 12,
    fontWeight: '600',
  },
});
