import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import { router } from 'expo-router';
import LoadingState from './LoadingState';

/**
 * Authentication response interface
 */
export interface AuthResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * Authentication context interface
 */
interface AuthContextType {
  // State
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  userProfile: any | null;
  
  // Actions
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string, username?: string) => Promise<AuthResponse>;
  signOut: () => Promise<AuthResponse>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  updateProfile: (updates: any) => Promise<AuthResponse>;
  refresh: () => Promise<AuthResponse>;
}

/**
 * Authentication context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Authentication provider component
 * Wraps the app to provide authentication state and methods
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<any | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          // Clear any stale state
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          setUserProfile(null);
        } else if (sessionData.session) {
          setSession(sessionData.session);
          setUser(sessionData.session.user);
          setIsAuthenticated(true);
          
          // Load user profile
          await loadUserProfile(sessionData.session.user.id);
        } else {
          // No session found
          setSession(null);
          setUser(null);
          setIsAuthenticated(false);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        // Clear state on error
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.id);
      
      if (event === 'SIGNED_OUT' || !newSession) {
        // Clear all state immediately
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        setUserProfile(null);
        setLoading(false);
        
        // Force navigation to auth screen
        try {
          router.replace('/auth');
        } catch (error) {
          console.error('Navigation error after sign out:', error);
          // Fallback: reload the page on web
          if (typeof window !== 'undefined') {
            window.location.href = '/auth';
          }
        }
      } else if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession);
        setUser(newSession.user);
        setIsAuthenticated(true);
        setLoading(false);
        
        // Load user profile
        await loadUserProfile(newSession.user.id);
        
        // Navigate to main app
        try {
          router.replace('/(tabs)');
        } catch (error) {
          console.error('Navigation error after sign in:', error);
        }
      } else if (event === 'TOKEN_REFRESHED' && newSession) {
        setSession(newSession);
        setUser(newSession.user);
        setIsAuthenticated(true);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  /**
   * Load user profile from database
   */
  const loadUserProfile = async (userId: string) => {
    try {
      // First check if the user exists in the database
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId);
      
      if (checkError) {
        console.error('Error checking user profile:', checkError);
        return;
      }
      
      // If user doesn't exist or multiple rows returned, we need to create the profile
      if (!existingUser || existingUser.length === 0) {
        // Get user data from auth
        const { data: userData } = await supabase.auth.getUser(session?.access_token);
        
        if (userData?.user) {
          // Create new user profile
          const newUser = {
            id: userId,
            email: userData.user.email,
            display_name: userData.user.user_metadata?.username || userData.user.email?.split('@')[0] || 'User',
            role: 'player',
            status: 'active',
            level: 1,
            xp: 0,
            preferences: {
              theme: 'system',
              notifications: {
                clan_challenges: true,
                match_updates: true,
                game_invites: true,
                achievements: true,
                system: false,
                push_enabled: false
              },
              privacy: {
                profile_visibility: 'public',
                show_online_status: true,
                allow_friend_requests: true
              },
              game_preferences: []
            },
            stats: {
              total_matches: 0,
              wins: 0,
              losses: 0,
              win_rate: 0,
              tournaments_won: 0,
              current_streak: 0,
              best_streak: 0,
              mvp_count: 0
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const { data: createdUser, error: createError } = await supabase
            .from('users')
            .insert(newUser)
            .select()
            .single();
            
          if (createError) {
            console.error('Error creating user profile:', createError);
            return;
          }
          
          setUserProfile(createdUser);
        }
      } else {
        // User exists, use the first record
        setUserProfile(existingUser[0]);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  /**
   * Sign in with email and password
   */
  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      return {
        success: true,
        data: data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sign in'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign up with email and password
   */
  const signUp = async (email: string, password: string, username?: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            display_name: username || email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      // If email confirmation is required, user will need to verify email
      if (!data.session) {
        return {
          success: true,
          data: { message: 'Please check your email for verification link' }
        };
      }

      return {
        success: true,
        data: data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to sign up'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out current user
   */
  const signOut = async (): Promise<AuthResponse> => {
    setLoading(true);
    try {
      // Clear local state immediately
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setUserProfile(null);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
        // Even if Supabase signOut fails, we still want to clear local state
      }

      return { success: true };
    } catch (error: any) {
      console.error('Sign out error:', error);
      
      // Even on error, clear local state and navigate
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setUserProfile(null);

      return {
        success: false,
        error: error.message || 'Failed to sign out'
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password
   */
  const resetPassword = async (email: string): Promise<AuthResponse> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`,
        }
      );

      if (error) throw error;

      return { 
        success: true,
        data: { message: 'Password reset email sent' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to send reset password email'
      };
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (updates: any): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) throw error;

      return {
        success: true,
        data: data.user
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update profile'
      };
    }
  };

  /**
   * Refresh session
   */
  const refresh = async (): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) throw error;

      return {
        success: true,
        data: data.session
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to refresh session'
      };
    }
  };

  const value = {
    // State
    user,
    session,
    loading,
    isAuthenticated,
    userProfile,
    
    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refresh,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <LoadingState message="Loading..." /> : children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 * Must be used within AuthProvider
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * Higher-order component for protected routes
 * Redirects to auth screen if user is not authenticated
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, loading } = useAuthContext();
    
    if (loading) {
      return <LoadingState message="Checking authentication..." />;
    }
    
    if (!isAuthenticated) {
      // Redirect to auth screen
      router.replace('/auth');
      return <LoadingState message="Please sign in to continue..." />;
    }
    
    return <Component {...props} />;
  };
}