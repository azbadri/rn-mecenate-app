/**
 * Дизайн-токены Mecenate (лента и общий UI).
 * Числа можно подогнать под Figma Test Assignment при вёрстке экрана.
 */

export const palette = {
  white: '#FFFFFF',
  black: '#0A0A0A',
  gray50: '#F7F7F8',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray900: '#111827',
  blue500: '#2563EB',
  blue100: '#DBEAFE',
  red500: '#DC2626',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 9999,
} as const;

/** Готовые стили текста для StyleSheet (fontWeight совместим с RN). */
export const typography = {
  /** Заголовок экрана / крупный заголовок карточки */
  title: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700' as const,
  },
  /** Имя автора */
  authorName: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  /** Основной текст превью поста */
  body: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  /** Подпись, мета (лайки, комментарии) */
  meta: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  /** Заглушка paid, вторичные подсказки */
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
} as const;

const lightColors = {
  background: palette.gray50,
  surface: palette.white,
  textPrimary: palette.gray900,
  textSecondary: palette.gray500,
  textTertiary: palette.gray400,
  border: palette.gray200,
  borderSubtle: palette.gray100,
  accent: palette.blue500,
  accentMuted: palette.blue100,
  error: palette.red500,
  /** Оверлей на обложке / dim */
  scrim: 'rgba(0, 0, 0, 0.45)',
  /** Фон блока закрытого поста */
  paidSurface: palette.gray100,
  paidText: palette.gray600,
  /** Иконки вторичного уровня */
  iconMuted: palette.gray400,
  tabBar: palette.white,
  tabIconDefault: '#CCCCCC',
} as const;

const darkColors = {
  background: '#000000',
  surface: '#141414',
  textPrimary: palette.white,
  textSecondary: '#A1A1AA',
  textTertiary: '#71717A',
  border: '#27272A',
  borderSubtle: '#1F1F23',
  accent: '#60A5FA',
  accentMuted: '#1E3A5F',
  error: '#F87171',
  scrim: 'rgba(0, 0, 0, 0.55)',
  paidSurface: '#1F1F23',
  paidText: '#A1A1AA',
  iconMuted: '#71717A',
  tabBar: '#141414',
  tabIconDefault: '#52525B',
} as const;

export const lightTheme = {
  colors: lightColors,
  spacing,
  radii,
  typography,
} as const;

export const darkTheme = {
  colors: darkColors,
  spacing,
  radii,
  typography,
} as const;

export type Theme = typeof lightTheme | typeof darkTheme;
export type ThemeColors = Theme['colors'];
