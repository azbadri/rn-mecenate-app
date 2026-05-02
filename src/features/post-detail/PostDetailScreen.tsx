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
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Comment } from '@/src/api/types';
import { QueryNotFoundView } from '@/src/components/empty-states/QueryNotFoundView';
import { CommentBubbleFilledIcon } from '@/src/components/icons/CommentBubbleFilledIcon';
import { HeartLikeFilledIcon } from '@/src/components/icons/HeartLikeFilledIcon';
import { palette } from '@/src/globals';
import { usePostComments } from '@/src/hooks/usePostComments';
import { usePostDetail } from '@/src/hooks/usePostDetail';
import { useCreatePostComment, useTogglePostLike } from '@/src/hooks/usePostMutations';
import { usePostRealtime } from '@/src/hooks/usePostRealtime';
import { useAppTheme } from '@/src/theme/useAppTheme';

const INPUT_BAR_HEIGHT = 56;

export function PostDetailScreen() {
  const theme = useAppTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const queryClient = useQueryClient();
  const insets = useSafeAreaInsets();
  const [commentText, setCommentText] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  usePostRealtime(id, queryClient);

  const comments = useMemo(
    () => commentsData?.pages.flatMap((page) => page.comments) ?? [],
    [commentsData],
  );

  const commentCountLabel = useMemo(() => {
    const count = post?.commentsCount ?? comments.length;
    return `${count} комментария`;
  }, [comments.length, post?.commentsCount]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
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

  const likeColor = post.isLiked ? palette['rose-500'] : theme.colors.textSecondary;
  const sendDisabled = commentText.trim().length === 0 || createCommentMutation.isPending;
  const onSubmitComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed || createCommentMutation.isPending) return;
    createCommentMutation.mutate(trimmed, {
      onSuccess: () => setCommentText(''),
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
          data={comments}
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
            <View style={styles.commentRow}>
              <Image
                source={{ uri: item.author.avatarUrl }}
                style={[
                  styles.commentAvatar,
                  { backgroundColor: theme.colors.borderSubtle, borderRadius: theme.radii.pill },
                ]}
              />
              <View style={styles.commentBody}>
                <Text style={[styles.commentAuthor, { color: theme.colors.textPrimary }]}>
                  {item.author.displayName || item.author.username}
                </Text>
                <Text style={[styles.commentText, { color: theme.colors.textSecondary }]}>
                  {item.text}
                </Text>
              </View>
            </View>
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
                <Image source={{ uri: post.coverUrl }} style={styles.cover} resizeMode="cover" />
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
                  style={styles.metaPill}
                  accessibilityRole="button"
                  accessibilityLabel="Лайк">
                  <HeartLikeFilledIcon color={likeColor} size={18} />
                  <Text style={[styles.metaCount, { color: likeColor }]}>{post.likesCount}</Text>
                </Pressable>
                <View style={styles.metaPill}>
                  <CommentBubbleFilledIcon color={theme.colors.textSecondary} size={18} />
                  <Text style={[styles.metaCount, { color: theme.colors.textSecondary }]}>
                    {post.commentsCount}
                  </Text>
                </View>
              </View>

              <View style={styles.commentsHeader}>
                <Text style={[styles.commentsTitle, { color: theme.colors.textSubtle, fontFamily: 'manrope', fontWeight: '600'}]}>
                  {commentCountLabel}
                </Text>
                <Text style={[styles.commentsSort, { color: theme.colors.accentViolet, fontFamily: 'manrope', fontWeight: '600' }]}>
                  Сначала новые
                </Text>
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
                borderColor: theme.colors.borderSubtle,
                backgroundColor: theme.colors.background,
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
                backgroundColor: theme.colors.accent,
                opacity: sendDisabled ? 0.5 : pressed ? 0.85 : 1,
              },
            ]}>
            <Text style={styles.sendButtonText}>Отправить</Text>
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
    width: 36,
    height: 36,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
  },
  cover: {
    width: '100%',
    height: 240,
    borderRadius: 12,
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
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'transparent',
  },
  metaCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  commentsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  commentsSort: {
    fontSize: 13,
    fontWeight: '600',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
  },
  commentAvatar: {
    width: 32,
    height: 32,
  },
  commentBody: {
    flex: 1,
    gap: 4,
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '700',
  },
  commentText: {
    fontSize: 13,
    lineHeight: 18,
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
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
