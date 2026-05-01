import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { Comment, CommentsData, Post, PostsFeedData } from '@/src/api/types';

export function updatePostInCaches(
  queryClient: QueryClient,
  userId: string | null,
  postId: string,
  updater: (post: Post) => Post,
) {
  if (!userId) return false;

  queryClient.setQueryData<Post>(['posts', 'detail', postId, userId], (data) =>
    data ? updater(data) : data,
  );

  queryClient.setQueryData<InfiniteData<PostsFeedData>>(
    ['posts', 'feed', userId],
    (data) => {
      if (!data) return data;
      return {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          posts: page.posts.map((post) => (post.id === postId ? updater(post) : post)),
        })),
      };
    },
  );
}

export function prependCommentToCache(
  queryClient: QueryClient,
  userId: string | null,
  postId: string,
  comment: Comment,
): boolean {
  if (!userId) return;

  let added = false;
  queryClient.setQueryData<InfiniteData<CommentsData>>(
    ['posts', 'comments', postId, userId],
    (data) => {
      if (!data || data.pages.length === 0) return data;
      const firstPage = data.pages[0];
      const exists = firstPage.comments.some((item) => item.id === comment.id);
      if (exists) return data;
      added = true;
      return {
        ...data,
        pages: [
          { ...firstPage, comments: [comment, ...firstPage.comments] },
          ...data.pages.slice(1),
        ],
      };
    },
  );
  return added;
}
