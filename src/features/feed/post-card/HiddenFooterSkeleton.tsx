import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = {
  barColor: string;
};

const PULSE_MIN = 0.4;
const PULSE_DURATION = 900;

export function HiddenFooterSkeleton({ barColor }: Props) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(PULSE_MIN, { duration: PULSE_DURATION, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.skeletonBlock}>
      <Animated.View
        style={[
          styles.skeletonBar,
          { width: '40%', height: 26, borderRadius: 22, backgroundColor: barColor },
          animatedStyle,
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonBar,
          { width: '90%', height: 40, borderRadius: 22, backgroundColor: barColor },
          animatedStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
  },
  skeletonBar: {
    height: 14,
    borderRadius: 6,
  },
});
