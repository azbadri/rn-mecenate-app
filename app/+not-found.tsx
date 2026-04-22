import { Stack, useRouter } from 'expo-router';

import { QueryNotFoundView } from '@/src/components/empty-states/QueryNotFoundView';
import { useAppTheme } from '@/src/theme/useAppTheme';

export default function NotFoundScreen() {
  const theme = useAppTheme();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <QueryNotFoundView
        theme={theme}
        onGoHome={() => {
          router.replace('/');
        }}
      />
    </>
  );
}
