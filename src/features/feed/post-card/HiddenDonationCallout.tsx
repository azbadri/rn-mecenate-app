import { Text, View } from 'react-native';

import { hiddenCalloutStyles as styles } from './hiddenCalloutStyles';

type Props = {
  accent: string;
};

export function HiddenDonationCallout({ accent }: Props) {
  return (
    <View style={styles.donationIconWrap} accessibilityLabel="Контент за донат">
      <View style={[styles.donationIconOuter, { backgroundColor: accent }]}>
        <View style={styles.donationIconInner}>
          <Text style={[styles.donationDollar, { color: accent }]}>$</Text>
        </View>
      </View>
    </View>
  );
}
