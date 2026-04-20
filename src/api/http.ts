import { getApiBaseUrl } from '@/src/api/env';
import { sessionStore } from '@/src/stores/sessionStore';

function joinUrl(base: string, path: string): string {
  const b = base.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${b}${p}`;
}

/**
 * Fetch к test-app с базой из env и Bearer UUID из sessionStore.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = path.startsWith('http') ? path : joinUrl(getApiBaseUrl(), path);
  const headers = new Headers(init.headers);
  const auth = sessionStore.authorizationHeader;
  if (auth != null) {
    headers.set('Authorization', auth);
  }
  if (
    init.body != null &&
    typeof init.body === 'string' &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(url, { ...init, headers });
}
