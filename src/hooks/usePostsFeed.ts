import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPostsPage } from '@/src/api/posts';
import { sessionStore } from '@/src/stores/sessionStore';

export const POSTS_FEED_PAGE_SIZE = 10;

export function usePostsFeed() {
  const userId = sessionStore.userId;

  return useInfiniteQuery({
    queryKey: ['posts', 'feed', userId] as const,
    initialPageParam: undefined as string | undefined,
    enabled: userId != null && userId !== '',
    queryFn: ({ pageParam }) =>
      fetchPostsPage({
        limit: POSTS_FEED_PAGE_SIZE,
        cursor: pageParam,
      }),
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;
      return lastPage.nextCursor ?? undefined;
    },
  });
}
