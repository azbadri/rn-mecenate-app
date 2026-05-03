import * as React from 'react';
import renderer, { act } from 'react-test-renderer';

import { useLikeHaptics } from '@/src/hooks/useLikeHaptics';

jest.mock('expo-haptics', () => {
  const mockImpactAsync = jest.fn(() => Promise.resolve());
  return {
    impactAsync: mockImpactAsync,
    ImpactFeedbackStyle: {
      Light: 'light',
      Medium: 'medium',
    },
  };
});

describe('useLikeHaptics', () => {
  const { impactAsync } = jest.requireMock('expo-haptics') as { impactAsync: jest.Mock };

  beforeEach(() => {
    impactAsync.mockClear();
  });

  it('triggers light impact', async () => {
    let trigger: (() => void) | null = null;

    function Test() {
      const haptic = useLikeHaptics('light');
      React.useEffect(() => {
        trigger = haptic;
      }, [haptic]);
      return null;
    }

    await act(async () => {
      renderer.create(<Test />);
    });

    await act(async () => {
      trigger?.();
    });

    expect(impactAsync).toHaveBeenCalledWith('light');
  });
});
