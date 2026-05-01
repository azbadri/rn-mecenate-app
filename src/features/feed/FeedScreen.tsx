import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { Post } from '@/src/api/types';
import { usePostsFeed } from '@/src/hooks/usePostsFeed';
import { useAppTheme } from '@/src/theme/useAppTheme';

import { FeedError } from './FeedError';
import { FeedTopTabs } from './FeedTopTabs';
import { PostCard } from './PostCard';
import { useFeedTabs } from './useFeedTabs';

const LIST_CONTENT_PADDING_BOTTOM = 24;

export const FeedScreen = observer(function FeedScreen() {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();
  const {
    data,
    isError,
    isPending,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = usePostsFeed();

  const posts = useMemo(
    () => data?.pages.flatMap((p) => p.posts) ?? [],
    [data],
  );

  const { activeTab, setActiveTab, filteredPosts } = useFeedTabs(posts);

  const onRefresh = useCallback(() => refetch(), [refetch]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem: ListRenderItem<Post> = useCallback(
    ({ item }) => <PostCard post={item} theme={theme} />,
    [theme],
  );

  const listFooter = useMemo(() => {
    if (!isFetchingNextPage) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator color={theme.colors.accent} />
      </View>
    );
  }, [isFetchingNextPage, theme.colors.accent]);

  const screenBg = theme.colors.background;

  if (isPending && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: screenBg }]} edges={['top']}>
        <FeedTopTabs value={activeTab} onChange={setActiveTab} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.accent} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError && posts.length === 0) {
    return (
      <SafeAreaView style={[styles.flex, { backgroundColor: screenBg }]} edges={['top']}>
        <FeedTopTabs value={activeTab} onChange={setActiveTab} />
        <FeedError theme={theme} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: screenBg }]} edges={['top']}>
      <FeedTopTabs value={activeTab} onChange={setActiveTab} />
      <FlatList
        style={styles.flex}
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: LIST_CONTENT_PADDING_BOTTOM + insets.bottom },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching && !isFetchingNextPage}
            onRefresh={onRefresh}
            tintColor={theme.colors.accent}
            colors={[theme.colors.accent]}
          />
        }
        onEndReached={onEndReached}
        onEndReachedThreshold={0.35}
        ListFooterComponent={listFooter}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: 8,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
