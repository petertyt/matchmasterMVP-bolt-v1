import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme, ThemeColors } from '@/constants/DesignSystem';

export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors: ThemeColors = isDark ? DarkTheme : LightTheme;

  return {
    colors,
    isDark,
    theme: isDark ? 'dark' : 'light',
  };
}