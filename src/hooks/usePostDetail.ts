import { useQuery } from '@tanstack/react-query';

import { fetchPostDetail } from '@/src/api/posts';
import type { Post } from '@/src/api/types';
import { sessionStore } from '@/src/stores/sessionStore';

export function usePostDetail(postId: string | undefined) {
  const userId = sessionStore.userId;

  return useQuery<Post>({
    queryKey: ['posts', 'detail', postId, userId],
    enabled: Boolean(postId && userId),
    queryFn: async () => {
      if (!postId) throw new Error('Post ID required');
      const data = await fetchPostDetail(postId);
      return data.post;
    },
  });
}
