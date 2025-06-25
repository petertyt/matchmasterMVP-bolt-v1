import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

/**
 * Hook for managing interactive states and feedback
 */
export function useInteractions() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Trigger haptic feedback (mobile only)
   */
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (Platform.OS !== 'web') {
      // For native platforms, you would import and use expo-haptics here
      // import * as Haptics from 'expo-haptics';
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle[type]);
    } else {
      // Web alternative - could implement visual feedback
      console.log(`Haptic feedback: ${type}`);
    }
  }, []);

  /**
   * Set loading state for a specific action
   */
  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: loading,
    }));
  }, []);

  /**
   * Set error state for a specific action
   */
  const setError = useCallback((key: string, error: string | null) => {
    setErrors(prev => {
      if (error === null) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return {
        ...prev,
        [key]: error,
      };
    });
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Get loading state for a specific key
   */
  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  /**
   * Get error for a specific key
   */
  const getError = useCallback((key: string) => {
    return errors[key] || null;
  }, [errors]);

  /**
   * Handle async action with loading and error states
   */
  const handleAsyncAction = useCallback(async <T>(
    key: string,
    action: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
      hapticFeedback?: boolean;
    }
  ): Promise<T | null> => {
    try {
      setLoading(key, true);
      setError(key, null);
      
      const result = await action();
      
      if (options?.hapticFeedback) {
        triggerHaptic('light');
      }
      
      options?.onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(key, errorMessage);
      options?.onError?.(error as Error);
      
      if (options?.hapticFeedback) {
        triggerHaptic('heavy');
      }
      
      return null;
    } finally {
      setLoading(key, false);
    }
  }, [setLoading, setError, triggerHaptic]);

  return {
    // State
    loadingStates,
    errors,
    
    // Actions
    setLoading,
    setError,
    clearErrors,
    triggerHaptic,
    handleAsyncAction,
    
    // Getters
    isLoading,
    getError,
  };
}