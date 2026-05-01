import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPostComments } from '@/src/api/posts';
import type { CommentsData } from '@/src/api/types';
import { sessionStore } from '@/src/stores/sessionStore';

const COMMENTS_PAGE_SIZE = 20;

export function usePostComments(postId: string | undefined) {
  const userId = sessionStore.userId;

  return useInfiniteQuery<CommentsData>({
    queryKey: ['posts', 'comments', postId, userId],
    enabled: Boolean(postId && userId),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam }) => {
      if (!postId) throw new Error('Post ID required');
      return fetchPostComments(postId, { limit: COMMENTS_PAGE_SIZE, cursor: pageParam });
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
  });
}
