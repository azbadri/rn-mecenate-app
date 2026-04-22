import { StyleSheet } from 'react-native';

export const emptyStateStyles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  rootCentered: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
  button: {
    marginTop: 28,
    alignSelf: 'stretch',
    maxWidth: 400,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  authorName: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    flex: 1,
  },
});
