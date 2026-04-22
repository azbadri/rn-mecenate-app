import { StyleSheet } from 'react-native';

export const hiddenCalloutStyles = StyleSheet.create({
  donationIconWrap: {
    marginBottom: 16,
  },
  donationIconOuter: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donationIconInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donationDollar: {
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '800',
  },
});
