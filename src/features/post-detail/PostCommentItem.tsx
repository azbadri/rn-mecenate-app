import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Animated from 'react-native-reanimated';

import type { Comment } from '@/src/api/types';
import { HeartLikeFilledIcon } from '@/src/components/icons/HeartLikeFilledIcon';
import { HeartLikeWholeIcon } from '@/src/components/icons/HeartLikeWholeIcon';
import { palette } from '@/src/globals';
import { useLikeAnimation } from '@/src/hooks/useLikeAnimation';
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
  const iconColor = useMemo(() => {
    if (liked) return palette['rose-500'];
    return isDark ? theme.colors.textSecondary : palette['gray-500'];
  }, [isDark, liked, theme.colors.textSecondary]);
  const { iconStyle, countStyle } = useLikeAnimation(likeCount);

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
