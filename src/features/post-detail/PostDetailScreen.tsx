import { useQueryClient } from '@tanstack/react-query';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Comment } from '@/src/api/types';
import { QueryNotFoundView } from '@/src/components/empty-states/QueryNotFoundView';
import { CommentBubbleFilledIcon } from '@/src/components/icons/CommentBubbleFilledIcon';
import { HeartLikeFilledIcon } from '@/src/components/icons/HeartLikeFilledIcon';
import { SendPlaneIcon } from '@/src/components/icons/SendPlaneIcon';
import { palette } from '@/src/globals';
import { usePostComments } from '@/src/hooks/usePostComments';
import { usePostDetail } from '@/src/hooks/usePostDetail';
import { useCreatePostComment, useTogglePostLike } from '@/src/hooks/usePostMutations';
import { usePostRealtime } from '@/src/hooks/usePostRealtime';
import { useAppTheme } from '@/src/theme/useAppTheme';
import { getRussianPlural } from '@/src/utils/pluralize';
import { PostCommentItem } from './PostCommentItem';

const INPUT_BAR_HEIGHT = 56;

export function PostDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [commentsOrder, setCommentsOrder] = useState<'new' | 'old'>('new');
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const [commentLikeCounts, setCommentLikeCounts] = useState<Record<string, number>>({});

  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
  } = usePostDetail(id);
  const {
    data: commentsData,
    isPending: isCommentsPending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostComments(id);

  const toggleLikeMutation = useTogglePostLike(id);
  const createCommentMutation = useCreatePostComment(id);
  const isDark = useColorScheme() === 'dark';

  usePostRealtime(id, queryClient);

  const comments = useMemo(
    () => commentsData?.pages.flatMap((page) => page.comments) ?? [],
    [commentsData],
  );
  const sortedComments = useMemo(() => {
    if (commentsOrder === 'new') return comments;
    return [...comments].reverse();
  }, [comments, commentsOrder]);

  const commentCountLabel = useMemo(() => {
    const count = post?.commentsCount ?? comments.length;
    const suffix = getRussianPlural(count, 'комментарий', 'комментария', 'комментариев');
    return `${count} ${suffix}`;
  }, [comments.length, post?.commentsCount]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height + 10);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  if (isPostPending) {
    return (
      <SafeAreaView style={[styles.root, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.accent} />
      </SafeAreaView>
    );
  }

  if (isPostError || !post) {
    return <QueryNotFoundView theme={theme} onGoHome={() => router.replace('/(tabs)')} />;
  }

  const pillNeutralBg = isDark ? theme.colors.borderSubtle : palette['gray-100'];
  const likeInactiveFg = isDark ? theme.colors.textSecondary : palette['gray-600'];
  const commentIconFg = isDark ? theme.colors.textSecondary : palette['gray-500'];
  const likeBg = post.isLiked ? palette['rose-500'] : pillNeutralBg;
  const likeFg = post.isLiked ? palette.white : likeInactiveFg;
  const sendDisabled = commentText.trim().length === 0 || createCommentMutation.isPending;
  const onSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || createCommentMutation.isPending) return;
    createCommentMutation.mutate(trimmed, {
      onSuccess: () => setCommentText(''),
    });
  };

  const onToggleCommentLike = (commentId: string) => {
    setCommentLikes((prevLikes) => {
      const nextLiked = !prevLikes[commentId];
      setCommentLikeCounts((prevCounts) => {
        const current = prevCounts[commentId] ?? 0;
        const nextValue = nextLiked ? current + 1 : Math.max(0, current - 1);
        return { ...prevCounts, [commentId]: nextValue };
      });
      return { ...prevLikes, [commentId]: nextLiked };
    });
  };

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.header, { paddingHorizontal: theme.spacing.lg }]}>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Назад">
        </Pressable>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.flex}>
        <FlatList
          data={sortedComments}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom:
                INPUT_BAR_HEIGHT + theme.spacing.xl + Math.max(theme.spacing.md, insets.bottom),
            },
          ]}
          renderItem={({ item }: { item: Comment }) => (
            <PostCommentItem
              comment={item}
              liked={Boolean(commentLikes[item.id])}
              likeCount={commentLikeCounts[item.id] ?? 0}
              onToggleLike={onToggleCommentLike}
            />
          )}
          ListHeaderComponent={
            <View style={styles.card}>
              <View style={styles.authorRow}>
                <Image
                  source={{ uri: post.author.avatarUrl }}
                  style={[
                    styles.avatar,
                    { backgroundColor: theme.colors.borderSubtle, borderRadius: theme.radii.pill },
                  ]}
                />
                <Text style={[styles.authorName, { color: theme.colors.textPrimary }]}>
                  {post.author.displayName || post.author.username}
                </Text>
              </View>

              {post.coverUrl ? (
                <View style={styles.coverWrapper}>
                  <Image source={{ uri: post.coverUrl }} style={styles.cover} resizeMode="cover" />
                </View>
              ) : null}

              <View style={styles.textBlock}>
                {post.title ? (
                  <Text style={[styles.postTitle, { color: theme.colors.textPrimary }]}>
                    {post.title}
                  </Text>
                ) : null}
                <Text style={[styles.postBody, { color: theme.colors.textSecondary }]}>
                  {post.body || post.preview}
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Pressable
                  onPress={() => toggleLikeMutation.mutate()}
                  style={[styles.metaPill, { backgroundColor: likeBg }]}
                  accessibilityRole="button"
                  accessibilityLabel="Лайк">
                  <View style={styles.metaIconBox}>
                    <HeartLikeFilledIcon color={likeFg} size={16} />
                  </View>
                  <Text style={[styles.actionCount, { color: likeFg }]}>{post.likesCount}</Text>
                </Pressable>
                <View style={[styles.metaPill, { backgroundColor: pillNeutralBg }]}>
                  <View style={styles.metaIconBox}>
                    <CommentBubbleFilledIcon color={commentIconFg} size={16} />
                  </View>
                  <Text style={[styles.actionCount, { color: commentIconFg }]}>
                    {post.commentsCount}
                  </Text>
                </View>
              </View>

              <View style={styles.commentsHeader}>
                <Text
                  style={[
                    styles.commentsTitle,
                    { color: theme.colors.textSubtle, fontFamily: 'manrope', fontWeight: '600' },
                  ]}>
                  {commentCountLabel}
                </Text>
                <Pressable
                  onPress={() =>
                    setCommentsOrder((prev) => (prev === 'new' ? 'old' : 'new'))
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Переключить сортировку комментариев">
                  <Text
                    style={[
                      styles.commentsSort,
                      { color: theme.colors.accentViolet, fontFamily: 'manrope', fontWeight: '500' },
                    ]}>
                    {commentsOrder === 'new' ? 'Сначала новые' : 'Сначала старые'}
                  </Text>
                </Pressable>
              </View>
            </View>
          }
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.25}
          ListFooterComponent={
            isCommentsPending || isFetchingNextPage ? (
              <View style={styles.commentsLoader}>
                <ActivityIndicator color={theme.colors.accent} />
              </View>
            ) : null
          }
        />

        <View
          style={[
            styles.inputBar,
            {
              borderTopColor: theme.colors.border,
              backgroundColor: theme.colors.surface,
              paddingHorizontal: theme.spacing.lg,
              paddingBottom: Math.max(theme.spacing.md, insets.bottom),
              bottom: keyboardHeight,
            },
          ]}>
          <TextInput
            placeholder="Ваш комментарий"
            placeholderTextColor={theme.colors.textTertiary}
            value={commentText}
            onChangeText={setCommentText}
            style={[
              styles.input,
              {
                color: theme.colors.textPrimary,
                // borderColor: theme.colors.borderSubtle,
                // backgroundColor: theme.colors.background,
                borderColor: theme.colors.background,
                borderWidth: 2,
                borderRadius: theme.radii.lg,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
              },
            ]}
          />
          <Pressable
            onPress={onSubmitComment}
            accessibilityRole="button"
            accessibilityLabel="Отправить комментарий"
            disabled={sendDisabled}
            style={({ pressed }) => [
              styles.sendButton,
              {
                opacity: sendDisabled ? 0.5 : pressed ? 0.85 : 1,
                color: sendDisabled ? theme.colors.accentViolet : theme.colors.iconMuted,
              },
            ]}>
            <SendPlaneIcon />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    paddingBottom: 16,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  cover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 0,
  },
  coverWrapper: {
    marginHorizontal: -16,
  },
  textBlock: {
    paddingTop: 12,
    gap: 6,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  postBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    paddingBottom: 16,
  },
  metaPill: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 63,
    height: 36,
    gap: 4,
    paddingTop: 6,
    paddingRight: 12,
    paddingBottom: 6,
    paddingLeft: 6,
    borderRadius: 9999,
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
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: -10,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  commentsSort: {
    fontSize: 13,
    fontWeight: '600',
  },
  commentsLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  inputBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    minHeight: INPUT_BAR_HEIGHT,
  },
  input: {
    fontSize: 14,
    flex: 1,
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
});
