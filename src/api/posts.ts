import { ApiClientError } from '@/src/api/errors';
import { apiFetch } from '@/src/api/http';
import type {
  CommentCreatedData,
  CommentsData,
  LikeData,
  PostDetailData,
  PostsFeedData,
  PostsResponse
} from '@/src/api/types';

export type FetchPostsParams = {
  limit?: number;
  cursor?: string;
  tier?: 'free' | 'paid';
  /** Для теста UI ошибок (query simulate_error=true) */
  simulateError?: boolean;
};

const MAX_LIMIT = 20;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPostsResponse(value: unknown): value is PostsResponse {
  if (!isRecord(value) || typeof value.ok !== 'boolean') return false;
  if (!value.ok) return true;
  const data = value.data;
  if (!isRecord(data)) return false;
  if (!Array.isArray(data.posts)) return false;
  if (!('hasMore' in data) || typeof data.hasMore !== 'boolean') return false;
  if (!('nextCursor' in data)) return false;
  const nc = data.nextCursor;
  if (nc != null && typeof nc !== 'string') return false;
  return true;
}

function isPostDetailResponse(value: unknown) {
  if (!isRecord(value) || typeof value.ok !== 'boolean') return false;
  if (!value.ok) return true;

  if (!isRecord(value.data)) return false;
  if (!('post' in value.data)) return false;
  return true;
}

function isLikeResponse(value: unknown) {
  if (!isRecord(value) || typeof value.ok !== 'boolean') return false;
  if (!value.ok) return true;

  if (!isRecord(value.data)) return false;
  if (typeof value.data.isLiked !== 'boolean') return false;
  if (typeof value.data.likesCount !== 'number') return false;
  return true;
}

function isCommentsResponse(value: unknown) {
  if (!isRecord(value) || typeof value.ok !== 'boolean') return false;
  if (!value.ok) return true;

  if (!isRecord(value.data)) return false;
  if (!Array.isArray(value.data.comments)) return false;

  if (!('hasMore' in value.data) || typeof value.data.hasMore !== 'boolean') return false;
  if (!('nextCursor' in value.data)) return false;

  const nextCursor = value.data.nextCursor;
  if (nextCursor != null && typeof nextCursor !== 'string') return false;
  return true;
}

function isCommentCreatedResponse(value: unknown) {
  if (!isRecord(value) || typeof value.ok !== 'boolean') return false;
  if (!value.ok) return true;

  if (!isRecord(value.data)) return false;
  if (!('comment' in value.data)) return false;
  return true;
}

function errorMessageFromBody(json: unknown): string | undefined {
  if (!isRecord(json)) return undefined;
  const err = json.error;
  if (!isRecord(err)) return undefined;
  const msg = err.message;
  return typeof msg === 'string' ? msg : undefined;
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (text.length === 0) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiClientError('Некорректный ответ сервера', res.status);
  }
}

function assertOkResponse<T extends { ok: boolean; data?: unknown }>(
  res: Response,
  json: unknown,
  isResponse: (value: unknown) => value is T,
): T['data'] {
  if (!res.ok) {
    throw new ApiClientError(
      errorMessageFromBody(json) ?? `Ошибка ${res.status}`,
      res.status,
      json,
    );
  }
  if (!isResponse(json)) {
    throw new ApiClientError('Некорректный формат ответа', res.status, json);
  }
  if (!json.ok) {
    throw new ApiClientError(
      errorMessageFromBody(json) ?? 'Запрос не выполнен',
      res.status,
      json,
    );
  }
  if (json.data == null) {
    throw new ApiClientError('Данные отсутствуют в ответе', res.status, json);
  }
  return json.data;
}

/** Одна страница ленты GET /posts (курсорная пагинация)*/
export async function fetchPostsPage(
  params: FetchPostsParams = {},
): Promise<PostsFeedData> {
  const {
    limit = 10,
    cursor,
    tier,
    simulateError = false,
  } = params;

  const search = new URLSearchParams();
  const safeLimit = Math.min(Math.max(1, limit), MAX_LIMIT);
  search.set('limit', String(safeLimit));
  if (cursor != null && cursor !== '') {
    search.set('cursor', cursor);
  }
  if (tier != null) {
    search.set('tier', tier);
  }
  if (simulateError) {
    search.set('simulate_error', 'true');
  }

  const qs = search.toString();
  const path = `/posts?${qs}`;

  const res = await apiFetch(path);
  const json = await parseJson(res);
  return assertOkResponse(res, json, isPostsResponse) as PostsFeedData;
}

/** Детальный пост GET /posts/:id */
export async function fetchPostDetail(id: string): Promise<PostDetailData> {
  const res = await apiFetch(`/posts/${id}`);
  const json = await parseJson(res);
  return assertOkResponse(res, json, isPostDetailResponse) as PostDetailData;
}

/** Toggle like POST /posts/:id/like */
export async function togglePostLike(id: string): Promise<LikeData> {
  const res = await apiFetch(`/posts/${id}/like`, { method: 'POST' });
  const json = await parseJson(res);
  return assertOkResponse(res, json, isLikeResponse) as LikeData;
}

/** Комментарии GET /posts/:id/comments */
export async function fetchPostComments(
  id: string,
  params: { limit?: number; cursor?: string } = {},
): Promise<CommentsData> {
  const { limit = 20, cursor } = params;
  const search = new URLSearchParams();

  search.set('limit', String(limit));
  if (cursor != null && cursor !== '') {
    search.set('cursor', cursor);
  }

  const path = `/posts/${id}/comments?${search.toString()}`;
  const res = await apiFetch(path);
  const json = await parseJson(res);
  return assertOkResponse(res, json, isCommentsResponse) as CommentsData;
}

/** Добавить комментарий POST /posts/:id/comments */
export async function createPostComment(id: string, text: string): Promise<CommentCreatedData> {
  const res = await apiFetch(`/posts/${id}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  const json = await parseJson(res);
  return assertOkResponse(res, json, isCommentCreatedResponse) as CommentCreatedData;
}
