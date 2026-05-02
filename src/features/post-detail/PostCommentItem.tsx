import { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';

import type { Comment } from '@/src/api/types';
import { HeartLikeFilledIcon } from '@/src/components/icons/HeartLikeFilledIcon';
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
  const iconColor = useMemo(() => {
    if (liked) return palette['rose-500'];
    return isDark ? theme.colors.textSecondary : palette['gray-500'];
  }, [isDark, liked, theme.colors.textSecondary]);

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
        onPress={() => onToggleLike(comment.id)}
        accessibilityRole="button"
        accessibilityLabel="Лайк комментария"
        style={styles.likeButton}>
        <HeartLikeFilledIcon color={iconColor} size={16} />
        {likeCount > 0 ? (
          <Text style={[styles.likeCount, { color: iconColor }]}>{likeCount}</Text>
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
