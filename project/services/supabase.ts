import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          username: string;
          avatar_url?: string;
          preferences?: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          username: string;
          avatar_url?: string;
          preferences?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          avatar_url?: string;
          preferences?: any;
          updated_at?: string;
        };
      };
      clans: {
        Row: {
          id: string;
          name: string;
          logo_url?: string;
          leader_id: string;
          members: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string;
          leader_id: string;
          members?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string;
          leader_id?: string;
          members?: string[];
          updated_at?: string;
        };
      };
      tournaments: {
        Row: {
          id: string;
          title: string;
          format: 'single_elimination' | 'double_elimination' | 'round_robin';
          status: 'upcoming' | 'active' | 'completed';
          participants: string[];
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          format: 'single_elimination' | 'double_elimination' | 'round_robin';
          status?: 'upcoming' | 'active' | 'completed';
          participants?: string[];
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          format?: 'single_elimination' | 'double_elimination' | 'round_robin';
          status?: 'upcoming' | 'active' | 'completed';
          participants?: string[];
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string;
          teams: string[];
          scores: number[];
          status: 'pending' | 'active' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          teams: string[];
          scores?: number[];
          status?: 'pending' | 'active' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tournament_id?: string;
          teams?: string[];
          scores?: number[];
          status?: 'pending' | 'active' | 'completed';
          updated_at?: string;
        };
      };
    };
  };
};