/** Схемы из OpenAPI Mecenate Test API */

export type PostTier = 'free' | 'paid';

export type Author = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  subscribersCount?: number;
  isVerified?: boolean;
};

export type Post = {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
};

export type PostsFeedData = {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type PostsResponse = {
  ok: boolean;
  data?: PostsFeedData;
  error?: { code?: string; message?: string };
};
