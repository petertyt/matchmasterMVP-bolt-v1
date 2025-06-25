/**
 * Design System Constants for Matchmaster
 * Following Material Design 3 and modern mobile design principles
 */

// 8px Grid System
export const Grid = {
  unit: 8,
  xs: 4,   // 0.5 units
  sm: 8,   // 1 unit
  md: 12,  // 1.5 units
  lg: 16,  // 2 units
  xl: 24,  // 3 units
  xxl: 32, // 4 units
  xxxl: 48, // 6 units
  xxxxl: 64, // 8 units
} as const;

// Typography Scale
export const Typography = {
  // Display styles
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.25,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontFamily: 'Poppins-Bold',
    letterSpacing: 0,
  },
  
  // Headline styles
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 0,
  },
  
  // Title styles
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.15,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-SemiBold',
    letterSpacing: 0.1,
  },
  
  // Body styles
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.5,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.25,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter-Regular',
    letterSpacing: 0.4,
  },
  
  // Label styles
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.1,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.5,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'Inter-Medium',
    letterSpacing: 0.5,
  },
} as const;

// Color System
export const ColorTokens = {
  // Primary colors
  primary: {
    50: '#F3F0FF',
    100: '#E9E2FF',
    200: '#D6CCFF',
    300: '#B8A6FF',
    400: '#9575FF',
    500: '#7F5AF0', // Main brand color
    600: '#6B46C1',
    700: '#553C9A',
    800: '#44337A',
    900: '#362B5D',
  },
  
  // Secondary colors
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#2CB67D', // Accent color
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  // Error colors
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  
  // Warning colors
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  
  // Success colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },
} as const;

// Theme definitions
export const LightTheme = {
  background: ColorTokens.neutral[50],
  surface: '#FFFFFF',
  surfaceVariant: ColorTokens.neutral[100],
  primary: ColorTokens.primary[500],
  primaryContainer: ColorTokens.primary[100],
  secondary: ColorTokens.secondary[500],
  secondaryContainer: ColorTokens.secondary[100],
  accent: ColorTokens.secondary[500],
  error: ColorTokens.error[500],
  errorContainer: ColorTokens.error[100],
  warning: ColorTokens.warning[500],
  warningContainer: ColorTokens.warning[100],
  success: ColorTokens.success[500],
  successContainer: ColorTokens.success[100],
  text: ColorTokens.neutral[900],
  textSecondary: ColorTokens.neutral[600],
  textTertiary: ColorTokens.neutral[500],
  border: ColorTokens.neutral[200],
  borderVariant: ColorTokens.neutral[300],
  card: '#FFFFFF',
  tabIconDefault: ColorTokens.neutral[400],
  tabIconSelected: ColorTokens.primary[500],
} as const;

export const DarkTheme = {
  background: '#0F0E17',
  surface: '#1A1A1A',
  surfaceVariant: '#2A2A2A',
  primary: ColorTokens.primary[400],
  primaryContainer: ColorTokens.primary[800],
  secondary: ColorTokens.secondary[400],
  secondaryContainer: ColorTokens.secondary[800],
  accent: ColorTokens.secondary[400],
  error: ColorTokens.error[400],
  errorContainer: ColorTokens.error[800],
  warning: ColorTokens.warning[400],
  warningContainer: ColorTokens.warning[800],
  success: ColorTokens.success[400],
  successContainer: ColorTokens.success[800],
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  border: 'rgba(255, 255, 255, 0.1)',
  borderVariant: 'rgba(255, 255, 255, 0.2)',
  card: '#1F2937',
  tabIconDefault: ColorTokens.neutral[500],
  tabIconSelected: ColorTokens.primary[400],
} as const;

// Elevation system (shadows)
export const Elevation = {
  level0: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  level2: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  level3: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  level4: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 4,
  },
  level5: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 5,
  },
} as const;

// Animation system
export const Motion = {
  duration: {
    short1: 50,
    short2: 100,
    short3: 150,
    short4: 200,
    medium1: 250,
    medium2: 300,
    medium3: 350,
    medium4: 400,
    long1: 450,
    long2: 500,
    long3: 550,
    long4: 600,
  },
  easing: {
    linear: 'linear',
    standard: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  },
} as const;

// Component specifications
export const ComponentSpecs = {
  // Button specifications
  button: {
    height: {
      small: 32,
      medium: 40,
      large: 48,
    },
    padding: {
      horizontal: Grid.lg,
      vertical: Grid.sm,
    },
    borderRadius: Grid.sm,
  },
  
  // Card specifications
  card: {
    borderRadius: Grid.lg,
    padding: Grid.lg,
    margin: Grid.sm,
  },
  
  // Input specifications
  input: {
    height: 48,
    borderRadius: Grid.sm,
    padding: Grid.md,
  },
  
  // FAB specifications
  fab: {
    size: 56,
    iconSize: 24,
    borderRadius: 28,
    elevation: Elevation.level3,
  },
  
  // Header specifications
  header: {
    height: 64,
    paddingHorizontal: Grid.xl,
    paddingBottom: Grid.lg,
  },
  
  // Tab bar specifications
  tabBar: {
    height: 68,
    paddingHorizontal: Grid.lg,
    paddingTop: Grid.sm,
    paddingBottom: Grid.sm,
  },
} as const;

export type ThemeColors = typeof LightTheme;
export type TypographyStyle = keyof typeof Typography;
export type ElevationLevel = keyof typeof Elevation;
export type MotionDuration = keyof typeof Motion.duration;
export type MotionEasing = keyof typeof Motion.easing;