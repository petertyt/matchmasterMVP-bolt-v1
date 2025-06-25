import { AuthError, Provider, User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

/**
 * Standard response format for all auth operations
 */
interface AuthResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * User profile data structure
 */
interface UserProfile {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Sign up data structure
 */
interface SignUpData {
  email: string;
  password: string;
  username?: string;
  metadata?: Record<string, any>;
}

/**
 * Authentication service for Matchmaster
 * Provides secure authentication methods with consistent error handling
 */
export const authService = {
  /**
   * Sign in with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns Promise with authentication result
   */
  async signInWithEmail(email: string, password: string): Promise<AuthResponse<{ user: User; session: Session }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to sign in',
      };
    }
  },

  /**
   * Sign up with email and password
   * @param signUpData - User registration data
   * @returns Promise with authentication result
   */
  async signUpWithEmail(signUpData: SignUpData): Promise<AuthResponse<{ user: User; session: Session | null }>> {
    try {
      const { email, password, username, metadata } = signUpData;
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            ...metadata,
          },
        },
      });

      if (error) throw error;

      return {
        success: true,
        data: {
          user: data.user!,
          session: data.session,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to sign up',
      };
    }
  },

  /**
   * Sign in with OAuth provider (Google, Apple, etc.)
   * @param provider - OAuth provider name
   * @returns Promise with authentication result
   */
  async signInWithProvider(provider: Provider): Promise<AuthResponse<{ url: string }>> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return {
        success: true,
        data: {
          url: data.url,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || `Failed to sign in with ${provider}`,
      };
    }
  },

  /**
   * Sign out current user
   * @returns Promise with sign out result
   */
  async signOut(): Promise<AuthResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to sign out',
      };
    }
  },

  /**
   * Get current authenticated user
   * @returns Promise with current user data
   */
  async getCurrentUser(): Promise<AuthResponse<User | null>> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to get current user',
      };
    }
  },

  /**
   * Get current session
   * @returns Promise with current session data
   */
  async getCurrentSession(): Promise<AuthResponse<Session | null>> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      return {
        success: true,
        data: session,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to get current session',
      };
    }
  },

  /**
   * Reset password via email
   * @param email - User's email address
   * @returns Promise with reset password result
   */
  async resetPassword(email: string): Promise<AuthResponse<void>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to send reset password email',
      };
    }
  },

  /**
   * Update user password
   * @param newPassword - New password
   * @returns Promise with update result
   */
  async updatePassword(newPassword: string): Promise<AuthResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      return {
        success: true,
        data: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to update password',
      };
    }
  },

  /**
   * Update user profile
   * @param updates - Profile updates
   * @returns Promise with update result
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<AuthResponse<User>> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      return {
        success: true,
        data: data.user,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to update profile',
      };
    }
  },

  /**
   * Listen to authentication state changes
   * @param callback - Callback function for auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    
    return () => {
      subscription.unsubscribe();
    };
  },

  /**
   * Check if user is authenticated
   * @returns Promise with authentication status
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    } catch {
      return false;
    }
  },

  /**
   * Refresh current session
   * @returns Promise with refreshed session
   */
  async refreshSession(): Promise<AuthResponse<Session>> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;

      return {
        success: true,
        data: data.session!,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as AuthError).message || 'Failed to refresh session',
      };
    }
  },
};

// Export types for use in components
export type { AuthResponse, UserProfile, SignUpData };