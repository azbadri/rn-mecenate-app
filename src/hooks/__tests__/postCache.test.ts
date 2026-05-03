import { QueryClient } from '@tanstack/react-query';

import type { Comment, Post, PostsFeedData } from '@/src/api/types';
import { prependCommentToCache, updatePostInCaches } from '@/src/hooks/postCache';

describe('postCache helpers', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          gcTime: Infinity,
        },
      },
    });
  });

  afterEach(() => {
    queryClient.clear();
  });

  const userId = 'user-1';
  const postId = 'post-1';

  const basePost: Post = {
    id: postId,
    author: {
      id: 'author-1',
      username: 'author',
      displayName: 'Author',
      avatarUrl: 'https://example.com/avatar.png',
    },
    title: 'Post title',
    body: 'Body',
    preview: 'Preview',
    coverUrl: 'https://example.com/cover.png',
    likesCount: 1,
    commentsCount: 2,
    isLiked: false,
    tier: 'free',
    createdAt: '2024-01-01T00:00:00Z',
  };

  const feedData: PostsFeedData = {
    posts: [basePost],
    nextCursor: null,
    hasMore: false,
  };

  it('updates post across detail and feed caches', () => {
    queryClient.setQueryData(['posts', 'detail', postId, userId], basePost);
    queryClient.setQueryData(['posts', 'feed', userId], {
      pages: [feedData],
      pageParams: [null],
    });

    updatePostInCaches(queryClient, userId, postId, (post) => ({
      ...post,
      likesCount: post.likesCount + 1,
      isLiked: true,
    }));

    const detail = queryClient.getQueryData<Post>(['posts', 'detail', postId, userId]);
    const feed = queryClient.getQueryData<{ pages: PostsFeedData[] }>(['posts', 'feed', userId]);

    expect(detail?.likesCount).toBe(2);
    expect(detail?.isLiked).toBe(true);
    expect(feed?.pages[0].posts[0].likesCount).toBe(2);
  });

  it('skips update when userId is missing', () => {
    queryClient.setQueryData(['posts', 'detail', postId, userId], basePost);
    const updated = updatePostInCaches(queryClient, null, postId, (post) => ({
      ...post,
      likesCount: post.likesCount + 1,
    }));

    const detail = queryClient.getQueryData<Post>(['posts', 'detail', postId, userId]);
    expect(updated).toBe(false);
    expect(detail?.likesCount).toBe(basePost.likesCount);
  });

  it('prepends comments when not already present', () => {
    const comment: Comment = {
      id: 'comment-1',
      postId,
      author: basePost.author,
      text: 'Hello',
      createdAt: '2024-01-01T00:00:00Z',
    };

    queryClient.setQueryData(['posts', 'comments', postId, userId], {
      pages: [
        {
          comments: [],
          nextCursor: null,
          hasMore: false,
        },
      ],
      pageParams: [null],
    });

    const added = prependCommentToCache(queryClient, userId, postId, comment);
    const comments = queryClient.getQueryData<{ pages: { comments: Comment[] }[] }>([
      'posts',
      'comments',
      postId,
      userId,
    ]);

    expect(added).toBe(true);
    expect(comments?.pages[0].comments[0]?.id).toBe(comment.id);
  });

  it('does not prepend duplicate comment', () => {
    const comment: Comment = {
      id: 'comment-1',
      postId,
      author: basePost.author,
      text: 'Hello',
      createdAt: '2024-01-01T00:00:00Z',
    };

    queryClient.setQueryData(['posts', 'comments', postId, userId], {
      pages: [
        {
          comments: [comment],
          nextCursor: null,
          hasMore: false,
        },
      ],
      pageParams: [null],
    });

    const added = prependCommentToCache(queryClient, userId, postId, comment);
    const comments = queryClient.getQueryData<{ pages: { comments: Comment[] }[] }>([
      'posts',
      'comments',
      postId,
      userId,
    ]);

    expect(added).toBe(false);
    expect(comments?.pages[0].comments).toHaveLength(1);
  });
});
