import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

/**
 * Authentication state interface
 */
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  userProfile: any | null;
}

/**
 * Custom hook for managing authentication state
 * Provides reactive authentication state and helper methods
 */
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
    userProfile: null,
  });

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const sessionResult = await authService.getCurrentSession();
        const userResult = await authService.getCurrentUser();

        let userProfile = null;
        if (userResult.data) {
          const profileResult = await userService.getUserById(userResult.data.id);
          if (profileResult.success) {
            userProfile = profileResult.data;
          }
        }

        setAuthState({
          user: userResult.data || null,
          session: sessionResult.data || null,
          loading: false,
          isAuthenticated: !!(sessionResult.data && userResult.data),
          userProfile,
        });
      } catch (error) {
        console.error('Error getting initial session:', error);
        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAuthenticated: false,
          userProfile: null,
        });
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const unsubscribe = authService.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      if (session) {
        const userResult = await authService.getCurrentUser();
        let userProfile = null;
        
        if (userResult.data) {
          const profileResult = await userService.getUserById(userResult.data.id);
          if (profileResult.success) {
            userProfile = profileResult.data;
          }
        }

        setAuthState({
          user: userResult.data || null,
          session,
          loading: false,
          isAuthenticated: !!userResult.data,
          userProfile,
        });
      } else {
        setAuthState({
          user: null,
          session: null,
          loading: false,
          isAuthenticated: false,
          userProfile: null,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await authService.signInWithEmail(email, password);
    
    if (!result.success) {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
    
    return result;
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, username?: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await authService.signUpWithEmail({
      email,
      password,
      username,
    });
    
    if (!result.success) {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
    
    return result;
  };

  /**
   * Sign out current user
   */
  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    const result = await authService.signOut();
    
    if (result.success) {
      setAuthState({
        user: null,
        session: null,
        loading: false,
        isAuthenticated: false,
        userProfile: null,
      });
    } else {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
    
    return result;
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: any) => {
    if (!authState.user) {
      return { success: false, error: 'No user logged in' };
    }

    const result = await userService.updateUser(authState.user.id, updates);
    
    if (result.success && result.data) {
      setAuthState(prev => ({
        ...prev,
        userProfile: result.data,
      }));
    }
    
    return result;
  };

  return {
    // State
    ...authState,
    
    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    
    // Utilities
    refresh: async () => {
      const result = await authService.refreshSession();
      return result;
    },
  };
}