export const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F8F9FA',
    primary: '#7F5AF0',
    accent: '#2CB67D',
    text: '#1A1A1A',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    card: '#FFFFFF',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#7F5AF0',
  },
  dark: {
    background: '#0F0E17',
    surface: '#1A1A1A',
    primary: '#7F5AF0',
    accent: '#2CB67D',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: '#374151',
    card: '#1F2937',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#7F5AF0',
  },
};

export type ColorScheme = keyof typeof Colors;