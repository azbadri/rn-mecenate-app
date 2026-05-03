import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createPostComment, togglePostLike } from '@/src/api/posts';
import type { Post } from '@/src/api/types';
import { sessionStore } from '@/src/stores/sessionStore';

import { prependCommentToCache, updatePostInCaches } from './postCache';

export function useTogglePostLike(postId?: string) {
  const queryClient = useQueryClient();
  const userId = sessionStore.userId;

  return useMutation({
    mutationFn: async () => {
      if (!postId) throw new Error('Post ID required');
      return togglePostLike(postId);
    },
    onMutate: async () => {
      if (!postId) return;
      updatePostInCaches(queryClient, userId, postId, (post) => {
        const nextLiked = !post.isLiked;
        return {
          ...post,
          isLiked: nextLiked,
          likesCount: Math.max(0, post.likesCount + (nextLiked ? 1 : -1)),
        };
      });
    },
    onSuccess: (data) => {
      if (!postId) return;
      updatePostInCaches(queryClient, userId, postId, (post) => ({
        ...post,
        isLiked: data.isLiked,
        likesCount: data.likesCount,
      }));
    },
  });
}

export function useCreatePostComment(postId?: string) {
  const queryClient = useQueryClient();
  const userId = sessionStore.userId;

  return useMutation({
    mutationFn: async (text: string) => {
      if (!postId) throw new Error('Post ID required');
      return createPostComment(postId, text);
    },
    onSuccess: (data) => {
      if (!postId) return;
      const comment = data.comment;
      prependCommentToCache(queryClient, userId, postId, comment);
      updatePostInCaches(queryClient, userId, postId, (post: Post) => ({
        ...post,
        commentsCount: post.commentsCount + 1,
      }));
    },
  });
}
