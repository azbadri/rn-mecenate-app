import { useEffect, useRef } from 'react';
import type { QueryClient } from '@tanstack/react-query';

import { getApiBaseUrl } from '@/src/api/env';
import type { Comment } from '@/src/api/types';
import { sessionStore } from '@/src/stores/sessionStore';

import { prependCommentToCache, updatePostInCaches } from './postCache';

type WsEvent =
  | { type: 'ping' }
  | { type: 'like_updated'; postId: string; likesCount: number }
  | { type: 'comment_added'; postId: string; comment: Comment };

function buildWsUrl(token: string) {
  const base = getApiBaseUrl().replace(/^http/, 'ws');
  return `${base}/ws?token=${token}`;
}

export function usePostRealtime(postId: string | undefined, queryClient: QueryClient) {
  const userId = sessionStore.userId;
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!userId || !postId) return;

    let isActive = true;

    const connect = () => {
      const socket = new WebSocket(buildWsUrl(userId));
      socketRef.current = socket;

      socket.onmessage = (event) => {
        if (!event.data || typeof event.data !== 'string') return;
        let payload: WsEvent;
        try {
          payload = JSON.parse(event.data) as WsEvent;
        } catch {
          return;
        }

        if (payload.type === 'like_updated' && payload.postId === postId) {
          updatePostInCaches(queryClient, userId, postId, (post) => ({
            ...post,
            likesCount: payload.likesCount,
          }));
        }

        if (payload.type === 'comment_added' && payload.postId === postId) {
          const added = prependCommentToCache(queryClient, userId, postId, payload.comment);
          const hasCommentsCache =
            queryClient.getQueryData(['posts', 'comments', postId, userId]) != null;
          if (added || !hasCommentsCache) {
            updatePostInCaches(queryClient, userId, postId, (post) => ({
              ...post,
              commentsCount: post.commentsCount + 1,
            }));
          }
        }
      };

      socket.onclose = () => {
        if (!isActive) return;
        reconnectRef.current = setTimeout(connect, 1200);
      };
    };

    connect();

    return () => {
      isActive = false;
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
      socketRef.current?.close();
    };
  }, [postId, queryClient, userId]);
}
