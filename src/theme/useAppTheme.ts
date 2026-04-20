import { useColorScheme } from '@/components/useColorScheme';

import { darkTheme, lightTheme, type Theme } from './tokens';

export function useAppTheme(): Theme {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}
