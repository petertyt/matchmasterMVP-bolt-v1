declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Supabase Configuration
      EXPO_PUBLIC_SUPABASE_URL: string;
      EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
      
      // Optional: Additional environment variables for Matchmaster
      EXPO_PUBLIC_APP_NAME?: string;
      EXPO_PUBLIC_APP_VERSION?: string;
      EXPO_PUBLIC_API_URL?: string;
      
      // Development/Production flags
      NODE_ENV: 'development' | 'production' | 'test';
      EXPO_PUBLIC_ENV?: 'development' | 'staging' | 'production';
    }
  }
}

// Ensure this file is treated as a module
export {};