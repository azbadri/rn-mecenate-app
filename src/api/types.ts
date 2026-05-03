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
  isContentHidden?: boolean;
};

export type Comment = {
  id: string;
  postId: string;
  author: Author;
  text: string;
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

export type PostDetailData = {
  post: Post;
};

export type PostDetailResponse = {
  ok: boolean;
  data?: PostDetailData;
  error?: { code?: string; message?: string };
};

export type LikeData = {
  isLiked: boolean;
  likesCount: number;
};

export type LikeResponse = {
  ok: boolean;
  data?: LikeData;
  error?: { code?: string; message?: string };
};

export type CommentsData = {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type CommentsResponse = {
  ok: boolean;
  data?: CommentsData;
  error?: { code?: string; message?: string };
};

export type CommentCreatedData = {
  comment: Comment;
};

export type CommentCreatedResponse = {
  ok: boolean;
  data?: CommentCreatedData;
  error?: { code?: string; message?: string };
};
