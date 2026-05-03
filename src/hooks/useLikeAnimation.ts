import { useEffect, useRef } from 'react';
import { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

type LikeAnimationStyles = {
  iconStyle: { transform: { scale: number }[] };
  countStyle: { transform: { scale: number }[] };
};

type LikeAnimationConfig = {
  iconScale?: number;
  countScale?: number;
  upDurationMs?: number;
  downDurationMs?: number;
};

const DEFAULT_CONFIG: Required<LikeAnimationConfig> = {
  iconScale: 1.15,
  countScale: 1.2,
  upDurationMs: 140,
  downDurationMs: 180,
};

export function useLikeAnimation(likesCount: number, config: LikeAnimationConfig = {}) {
  const settings = { ...DEFAULT_CONFIG, ...config };
  const likeScale = useSharedValue(1);
  const likeCountScale = useSharedValue(1);
  const prevLikesRef = useRef<number | null>(null);

  useEffect(() => {
    if (prevLikesRef.current == null) {
      prevLikesRef.current = likesCount;
      return;
    }

    if (prevLikesRef.current !== likesCount) {
      likeScale.value = withSequence(
        withTiming(settings.iconScale, { duration: settings.upDurationMs }),
        withTiming(1, { duration: settings.downDurationMs }),
      );
      likeCountScale.value = withSequence(
        withTiming(settings.countScale, { duration: settings.upDurationMs }),
        withTiming(1, { duration: settings.downDurationMs }),
      );
      prevLikesRef.current = likesCount;
    }
  }, [
    likeCountScale,
    likeScale,
    likesCount,
    settings.countScale,
    settings.downDurationMs,
    settings.iconScale,
    settings.upDurationMs,
  ]);

  const iconStyle = useAnimatedStyle<LikeAnimationStyles['iconStyle']>(() => ({
    transform: [{ scale: likeScale.value }],
  }));

  const countStyle = useAnimatedStyle<LikeAnimationStyles['countStyle']>(() => ({
    transform: [{ scale: likeCountScale.value }],
  }));

  return { iconStyle, countStyle };
}
