import { ApiClientError } from '@/src/api/errors';
import { apiFetch } from '@/src/api/http';
import type { PostsFeedData, PostsResponse } from '@/src/api/types';

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

function errorMessageFromBody(json: unknown): string | undefined {
  if (!isRecord(json)) return undefined;
  const err = json.error;
  if (!isRecord(err)) return undefined;
  const msg = err.message;
  return typeof msg === 'string' ? msg : undefined;
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
  const text = await res.text();

  let json: unknown;
  try {
    json = text.length > 0 ? JSON.parse(text) : null;
  } catch {
    throw new ApiClientError('Некорректный ответ сервера', res.status);
  }

  if (!res.ok) {
    throw new ApiClientError(
      errorMessageFromBody(json) ?? `Ошибка ${res.status}`,
      res.status,
      json,
    );
  }

  if (!isPostsResponse(json)) {
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
