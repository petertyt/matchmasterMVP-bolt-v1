import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Expo environment variables use EXPO_PUBLIC_ prefix
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || supabaseUrl.trim() === '') {
  throw new Error('Missing or empty EXPO_PUBLIC_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
  throw new Error('Missing or empty EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings for mobile
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disable for mobile
    storage: AsyncStorage, // Use AsyncStorage for session persistence
  },
});

// Export types for TypeScript
export type { User, Session, AuthError } from '@supabase/supabase-js';