import { StyleSheet, View } from 'react-native';

type Props = {
  barColor: string;
};

export function HiddenFooterSkeleton({ barColor }: Props) {
  return (
    <View style={styles.skeletonBlock}>
      <View
        style={[
          styles.skeletonBar,
          { width: '40%', height: 26, borderRadius: 22, backgroundColor: barColor },
        ]}
      />
      <View
        style={[
          styles.skeletonBar,
          { width: '90%', height: 40, borderRadius: 22, backgroundColor: barColor },
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
