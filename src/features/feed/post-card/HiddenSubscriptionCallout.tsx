import { View } from 'react-native';

import { PaywallMoneyIcon } from '@/src/components/icons/PaywallMoneyIcon';

import { hiddenCalloutStyles as styles } from './hiddenCalloutStyles';

export function HiddenSubscriptionCallout() {
  return (
    <View style={styles.donationIconWrap} accessibilityLabel="Контент по подписке">
      <PaywallMoneyIcon size={56} />
    </View>
  );
}
