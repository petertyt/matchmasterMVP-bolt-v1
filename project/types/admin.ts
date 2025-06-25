/**
 * Admin-specific type definitions for Matchmaster platform
 */

export type UserRole = 'admin' | 'organizer' | 'leader' | 'player';
export type AdminAction = 'ban_user' | 'unban_user' | 'override_match' | 'delete_tournament' | 'edit_tournament' | 'assign_role' | 'revoke_role';
export type TargetType = 'user' | 'tournament' | 'match' | 'clan';

export interface AdminUser {
  id: string;
  display_name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'banned' | 'suspended';
  clan_id?: string;
  clan_name?: string;
  last_active?: string;
  created_at: string;
}

export interface AdminTournament {
  id: string;
  name: string;
  creator_id: string;
  creator_name: string;
  status: string;
  participants_count: number;
  max_participants: number;
  created_at: string;
  start_date: string;
  is_public: boolean;
}

export interface AdminLog {
  id: string;
  action: AdminAction;
  target_type: TargetType;
  target_id: string;
  target_name?: string;
  admin_id: string;
  admin_name: string;
  reason?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface MatchResult {
  score_a: number;
  score_b: number;
  winner_id: string;
  match_data?: {
    game_results: Array<{
      game_number: number;
      score_a: number;
      score_b: number;
      winner_id: string;
      duration?: number;
      map?: string;
    }>;
    mvp_id?: string;
    notes?: string;
  };
}

export interface AdminFilters {
  role?: UserRole[];
  status?: string[];
  tournament_status?: string[];
  search?: string;
  date_from?: string;
  date_to?: string;
}

export interface AdminStats {
  total_users: number;
  active_users: number;
  banned_users: number;
  total_tournaments: number;
  active_tournaments: number;
  total_clans: number;
  recent_actions: number;
}