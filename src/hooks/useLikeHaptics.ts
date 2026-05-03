import { useCallback } from 'react';
import * as Haptics from 'expo-haptics';

type LikeHapticStyle = 'light' | 'medium';

const HAPTIC_STYLES: Record<LikeHapticStyle, Haptics.ImpactFeedbackStyle> = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
};

export function useLikeHaptics(style: LikeHapticStyle = 'medium') {
  return useCallback(() => {
    Haptics.impactAsync(HAPTIC_STYLES[style]).catch(() => {});
  }, [style]);
}
