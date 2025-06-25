/**
 * Animation durations in milliseconds
 */
export const AnimationDuration = {
  fast: 150,
  normal: 300,
  slow: 500,
  entrance: 800,
} as const;

/**
 * Animation easing curves
 */
export const AnimationEasing = {
  easeInOut: 'ease-in-out',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  spring: 'spring',
} as const;

/**
 * Touch feedback opacity values
 */
export const TouchOpacity = {
  light: 0.8,
  medium: 0.6,
  heavy: 0.4,
} as const;

/**
 * Loading states
 */
export const LoadingStates = {
  idle: 'idle',
  loading: 'loading',
  success: 'success',
  error: 'error',
} as const;

/**
 * Interaction feedback types
 */
export const FeedbackType = {
  haptic: 'haptic',
  visual: 'visual',
  audio: 'audio',
} as const;

/**
 * Common interaction patterns
 */
export const InteractionPatterns = {
  // Button press patterns
  buttonPress: {
    activeOpacity: TouchOpacity.light,
    duration: AnimationDuration.fast,
  },
  
  // Card press patterns
  cardPress: {
    activeOpacity: TouchOpacity.medium,
    duration: AnimationDuration.normal,
    scale: 0.98,
  },
  
  // List item press patterns
  listItemPress: {
    activeOpacity: TouchOpacity.light,
    duration: AnimationDuration.fast,
  },
  
  // Tab press patterns
  tabPress: {
    activeOpacity: TouchOpacity.medium,
    duration: AnimationDuration.fast,
  },
} as const;

export type AnimationDurationType = typeof AnimationDuration[keyof typeof AnimationDuration];
export type TouchOpacityType = typeof TouchOpacity[keyof typeof TouchOpacity];
export type LoadingStateType = typeof LoadingStates[keyof typeof LoadingStates];
export type FeedbackTypeType = typeof FeedbackType[keyof typeof FeedbackType];