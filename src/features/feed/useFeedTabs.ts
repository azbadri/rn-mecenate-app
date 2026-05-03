import { useMemo, useState } from 'react';

import type { Post } from '@/src/api/types';

export type FeedTab = 'all' | 'free' | 'paid';

interface FeedTabItem {
  key: FeedTab;
  label: string;
}

export const FEED_TABS: FeedTabItem[] = [
  { key: 'all', label: 'Все' },
  { key: 'free', label: 'Бесплатные' },
  { key: 'paid', label: 'Платные' },
];

export function useFeedTabs(posts: Post[]) {
  const [activeTab, setActiveTab] = useState<FeedTab>('all');

  const filteredPosts = useMemo(() => {
    if (activeTab === 'all') return posts;
    if (activeTab === 'free') {
      return posts.filter((post) => post.tier === 'free');
    }
    return posts.filter((post) => post.tier === 'paid');
  }, [activeTab, posts]);

  return { activeTab, setActiveTab, filteredPosts };
}
