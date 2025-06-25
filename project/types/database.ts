/**
 * Database type definitions for Matchmaster gaming platform
 * These types correspond to the Supabase database schema
 */

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// User types
export interface User extends BaseEntity {
  email: string;
  display_name: string;
  avatar_url?: string;
  role: 'admin' | 'organizer' | 'leader' | 'player';
  status: 'active' | 'banned' | 'suspended';
  clan_id?: string;
  level: number;
  xp: number;
  preferences: UserPreferences;
  stats: UserStats;
  last_active?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    clan_challenges: boolean;
    match_updates: boolean;
    game_invites: boolean;
    achievements: boolean;
    system: boolean;
    push_enabled: boolean;
  };
  privacy: {
    profile_visibility: 'public' | 'friends' | 'private';
    show_online_status: boolean;
    allow_friend_requests: boolean;
  };
  game_preferences: string[];
}

export interface UserStats {
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  tournaments_won: number;
  current_streak: number;
  best_streak: number;
  mvp_count: number;
}

// Tournament types
export interface Tournament extends BaseEntity {
  name: string;
  description?: string;
  format: TournamentFormat;
  status: TournamentStatus;
  creator_id: string;
  participants: string[];
  max_participants: number;
  start_date: string;
  end_date?: string;
  registration_deadline?: string;
  prize_pool?: string;
  game: string;
  rules?: string;
  image_url?: string;
  is_public: boolean;
  config?: TournamentConfig;
}

export type TournamentFormat = 'single_elimination' | 'double_elimination' | 'round_robin' | 'swiss';
export type TournamentStatus = 'draft' | 'registration' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface TournamentConfig {
  bracket_settings?: {
    seeding_method?: 'random' | 'manual' | 'ranking';
    third_place_match?: boolean;
    consolation_bracket?: boolean;
  };
  match_settings?: {
    best_of?: number;
    time_limit?: number;
    overtime_rules?: string;
    map_selection?: string[];
  };
  scoring_system?: {
    win_points: number;
    loss_points: number;
    draw_points?: number;
    bonus_points?: Record<string, number>;
  };
}

// Clan types
export interface Clan extends BaseEntity {
  name: string;
  tag: string;
  description?: string;
  logo_url?: string;
  member_ids: string[];
  captain_ids: string[];
  leader_id: string;
  level: number;
  xp: number;
  stats: ClanStats;
  settings: ClanSettings;
  is_public: boolean;
  max_members: number;
}

export interface ClanStats {
  total_matches: number;
  wins: number;
  losses: number;
  win_rate: number;
  tournaments_won: number;
  current_streak: number;
  best_streak: number;
  rank: number;
}

export interface ClanSettings {
  join_approval_required: boolean;
  allow_member_invites: boolean;
  visibility: 'public' | 'private';
  auto_kick_inactive_days?: number;
}

// Match types
export interface Match extends BaseEntity {
  tournament_id: string;
  round: number;
  participant_a_id: string;
  participant_b_id: string;
  score_a?: number;
  score_b?: number;
  status: MatchStatus;
  scheduled_time?: string;
  started_at?: string;
  completed_at?: string;
  winner_id?: string;
  match_data?: MatchData;
}

export type MatchStatus = 'scheduled' | 'ready' | 'active' | 'completed' | 'cancelled' | 'disputed';

export interface MatchData {
  game_results?: GameResult[];
  mvp_id?: string;
  notes?: string;
  replay_urls?: string[];
}

export interface GameResult {
  game_number: number;
  score_a: number;
  score_b: number;
  duration?: number;
  map?: string;
  winner_id: string;
}

// Input types for creating entities
export type UserInput = Omit<User, keyof BaseEntity | 'level' | 'xp' | 'stats' | 'clan_id' | 'last_active'>;
export type TournamentInput = Omit<Tournament, keyof BaseEntity | 'participants' | 'status'>;
export type ClanInput = Omit<Clan, keyof BaseEntity | 'member_ids' | 'captain_ids' | 'level' | 'xp' | 'stats'>;

// Update types for partial updates
export type UserUpdate = Partial<Pick<User, 'display_name' | 'avatar_url' | 'preferences' | 'last_active'>>;
export type TournamentUpdate = Partial<Pick<Tournament, 'name' | 'description' | 'config' | 'start_date' | 'end_date' | 'registration_deadline' | 'prize_pool' | 'rules' | 'image_url' | 'is_public'>>;
export type ClanUpdate = Partial<Pick<Clan, 'name' | 'tag' | 'description' | 'logo_url' | 'settings' | 'is_public' | 'max_members'>>;

// Service response types
export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Query options
export interface QueryOptions {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Filter types
export interface TournamentFilters {
  is_public?: boolean;
  status?: TournamentStatus[];
  participant_id?: string;
  creator_id?: string;
  game?: string;
}

export interface ClanFilters {
  is_public?: boolean;
  has_space?: boolean;
  member_id?: string;
  leader_id?: string;
}

// Database error type
export interface DatabaseError {
  message: string;
  code?: string;
  details?: any;
}