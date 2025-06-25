import { supabase } from '@/lib/supabaseClient';
import type { 
  ServiceResponse, 
  PaginatedResponse,
  QueryOptions,
  User,
  Tournament,
  Match
} from '@/types/database';
import type {
  AdminUser,
  AdminTournament,
  AdminLog,
  MatchResult,
  AdminFilters,
  AdminStats,
  UserRole,
  AdminAction,
  TargetType
} from '@/types/admin';

/**
 * Admin service for moderation and tournament oversight
 * Handles admin-only operations with proper authorization and logging
 */
export class AdminService {
  private static instance: AdminService;

  static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  /**
   * Check if user has admin privileges
   * @param userId - The user's unique identifier
   * @returns Promise with admin status
   */
  async checkAdminAccess(userId: string): Promise<ServiceResponse<boolean>> {
    try {
      if (!userId?.trim()) {
        return {
          success: false,
          error: 'User ID is required',
          code: 'INVALID_INPUT'
        };
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      const isAdmin = data?.role === 'admin' || data?.role === 'organizer';

      return {
        success: true,
        data: isAdmin
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to check admin access',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get all users with admin view (includes roles and status)
   * @param filters - Admin filters for users
   * @param options - Query options for pagination
   * @returns Promise with paginated admin user results
   */
  async getAllUsers(
    filters: AdminFilters = {}, 
    options: QueryOptions = {}
  ): Promise<ServiceResponse<PaginatedResponse<AdminUser>>> {
    try {
      const { page = 1, limit = 20, sort_by = 'created_at', sort_order = 'desc' } = options;
      const offset = (page - 1) * limit;

      let queryBuilder = supabase
        .from('users')
        .select(`
          id,
          display_name,
          email,
          role,
          status,
          clan_id,
          last_active,
          created_at,
          clans!inner(name)
        `, { count: 'exact' });

      // Apply filters
      if (filters.role && filters.role.length > 0) {
        queryBuilder = queryBuilder.in('role', filters.role);
      }

      if (filters.status && filters.status.length > 0) {
        queryBuilder = queryBuilder.in('status', filters.status);
      }

      if (filters.search) {
        queryBuilder = queryBuilder.or(
          `display_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`
        );
      }

      if (filters.date_from) {
        queryBuilder = queryBuilder.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        queryBuilder = queryBuilder.lte('created_at', filters.date_to);
      }

      // Apply sorting and pagination
      queryBuilder = queryBuilder
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await queryBuilder;

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Transform data to AdminUser format
      const adminUsers: AdminUser[] = data.map(user => ({
        id: user.id,
        display_name: user.display_name,
        email: user.email,
        role: user.role || 'player',
        status: user.status || 'active',
        clan_id: user.clan_id,
        clan_name: user.clans?.name,
        last_active: user.last_active,
        created_at: user.created_at
      }));

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        data: {
          data: adminUsers,
          count: count || 0,
          page,
          limit,
          total_pages: totalPages
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get all tournaments with admin view
   * @param filters - Admin filters for tournaments
   * @param options - Query options for pagination
   * @returns Promise with paginated admin tournament results
   */
  async getAllTournaments(
    filters: AdminFilters = {},
    options: QueryOptions = {}
  ): Promise<ServiceResponse<PaginatedResponse<AdminTournament>>> {
    try {
      const { page = 1, limit = 20, sort_by = 'created_at', sort_order = 'desc' } = options;
      const offset = (page - 1) * limit;

      let queryBuilder = supabase
        .from('tournaments')
        .select(`
          id,
          name,
          creator_id,
          status,
          participants,
          max_participants,
          created_at,
          start_date,
          is_public,
          users!inner(display_name)
        `, { count: 'exact' });

      // Apply filters
      if (filters.tournament_status && filters.tournament_status.length > 0) {
        queryBuilder = queryBuilder.in('status', filters.tournament_status);
      }

      if (filters.search) {
        queryBuilder = queryBuilder.ilike('name', `%${filters.search}%`);
      }

      if (filters.date_from) {
        queryBuilder = queryBuilder.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        queryBuilder = queryBuilder.lte('created_at', filters.date_to);
      }

      // Apply sorting and pagination
      queryBuilder = queryBuilder
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await queryBuilder;

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Transform data to AdminTournament format
      const adminTournaments: AdminTournament[] = data.map(tournament => ({
        id: tournament.id,
        name: tournament.name,
        creator_id: tournament.creator_id,
        creator_name: tournament.users?.display_name || 'Unknown',
        status: tournament.status,
        participants_count: tournament.participants?.length || 0,
        max_participants: tournament.max_participants,
        created_at: tournament.created_at,
        start_date: tournament.start_date,
        is_public: tournament.is_public
      }));

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        data: {
          data: adminTournaments,
          count: count || 0,
          page,
          limit,
          total_pages: totalPages
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tournaments',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Ban a user (admin only)
   * @param adminId - The admin's unique identifier
   * @param userId - The user to ban
   * @param reason - Reason for the ban
   * @returns Promise with success status
   */
  async banUser(adminId: string, userId: string, reason?: string): Promise<ServiceResponse<void>> {
    try {
      if (!adminId?.trim() || !userId?.trim()) {
        return {
          success: false,
          error: 'Admin ID and user ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Check admin access
      const adminCheck = await this.checkAdminAccess(adminId);
      if (!adminCheck.success || !adminCheck.data) {
        return {
          success: false,
          error: 'Insufficient permissions',
          code: 'ACCESS_DENIED'
        };
      }

      // Get user info for logging
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('display_name, status')
        .eq('id', userId)
        .single();

      if (userError) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      if (userData.status === 'banned') {
        return {
          success: false,
          error: 'User is already banned',
          code: 'ALREADY_BANNED'
        };
      }

      // Update user status
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          status: 'banned',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message,
          code: updateError.code
        };
      }

      // Log the action
      await this.logAdminAction(
        adminId,
        'ban_user',
        'user',
        userId,
        userData.display_name,
        reason
      );

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to ban user',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Unban a user (admin only)
   * @param adminId - The admin's unique identifier
   * @param userId - The user to unban
   * @param reason - Reason for unbanning
   * @returns Promise with success status
   */
  async unbanUser(adminId: string, userId: string, reason?: string): Promise<ServiceResponse<void>> {
    try {
      if (!adminId?.trim() || !userId?.trim()) {
        return {
          success: false,
          error: 'Admin ID and user ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Check admin access
      const adminCheck = await this.checkAdminAccess(adminId);
      if (!adminCheck.success || !adminCheck.data) {
        return {
          success: false,
          error: 'Insufficient permissions',
          code: 'ACCESS_DENIED'
        };
      }

      // Get user info for logging
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('display_name, status')
        .eq('id', userId)
        .single();

      if (userError) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      if (userData.status !== 'banned') {
        return {
          success: false,
          error: 'User is not banned',
          code: 'NOT_BANNED'
        };
      }

      // Update user status
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message,
          code: updateError.code
        };
      }

      // Log the action
      await this.logAdminAction(
        adminId,
        'unban_user',
        'user',
        userId,
        userData.display_name,
        reason
      );

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to unban user',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Override match result (admin only)
   * @param adminId - The admin's unique identifier
   * @param matchId - The match to override
   * @param result - New match result
   * @param reason - Reason for override
   * @returns Promise with success status
   */
  async overrideMatch(
    adminId: string, 
    matchId: string, 
    result: MatchResult, 
    reason?: string
  ): Promise<ServiceResponse<void>> {
    try {
      if (!adminId?.trim() || !matchId?.trim()) {
        return {
          success: false,
          error: 'Admin ID and match ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Check admin access
      const adminCheck = await this.checkAdminAccess(adminId);
      if (!adminCheck.success || !adminCheck.data) {
        return {
          success: false,
          error: 'Insufficient permissions',
          code: 'ACCESS_DENIED'
        };
      }

      // Get match info for logging
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('tournament_id, participant_a_id, participant_b_id')
        .eq('id', matchId)
        .single();

      if (matchError) {
        return {
          success: false,
          error: 'Match not found',
          code: 'MATCH_NOT_FOUND'
        };
      }

      // Update match result
      const { error: updateError } = await supabase
        .from('matches')
        .update({
          score_a: result.score_a,
          score_b: result.score_b,
          winner_id: result.winner_id,
          status: 'completed',
          completed_at: new Date().toISOString(),
          match_data: result.match_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', matchId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message,
          code: updateError.code
        };
      }

      // Log the action
      await this.logAdminAction(
        adminId,
        'override_match',
        'match',
        matchId,
        `Match ${matchId}`,
        reason,
        { 
          old_result: 'overridden',
          new_result: result,
          tournament_id: matchData.tournament_id
        }
      );

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to override match',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Remove tournament (admin only)
   * @param adminId - The admin's unique identifier
   * @param tournamentId - The tournament to remove
   * @param reason - Reason for removal
   * @returns Promise with success status
   */
  async removeTournament(adminId: string, tournamentId: string, reason?: string): Promise<ServiceResponse<void>> {
    try {
      if (!adminId?.trim() || !tournamentId?.trim()) {
        return {
          success: false,
          error: 'Admin ID and tournament ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Check admin access
      const adminCheck = await this.checkAdminAccess(adminId);
      if (!adminCheck.success || !adminCheck.data) {
        return {
          success: false,
          error: 'Insufficient permissions',
          code: 'ACCESS_DENIED'
        };
      }

      // Get tournament info for logging
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('name, creator_id, status')
        .eq('id', tournamentId)
        .single();

      if (tournamentError) {
        return {
          success: false,
          error: 'Tournament not found',
          code: 'TOURNAMENT_NOT_FOUND'
        };
      }

      // Delete associated matches first (cascade delete)
      const { error: matchesError } = await supabase
        .from('matches')
        .delete()
        .eq('tournament_id', tournamentId);

      if (matchesError) {
        return {
          success: false,
          error: `Failed to delete tournament matches: ${matchesError.message}`,
          code: 'CASCADE_DELETE_FAILED'
        };
      }

      // Delete the tournament
      const { error: deleteError } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', tournamentId);

      if (deleteError) {
        return {
          success: false,
          error: deleteError.message,
          code: deleteError.code
        };
      }

      // Log the action
      await this.logAdminAction(
        adminId,
        'delete_tournament',
        'tournament',
        tournamentId,
        tournamentData.name,
        reason,
        {
          creator_id: tournamentData.creator_id,
          status: tournamentData.status
        }
      );

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove tournament',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Assign role to user (admin only)
   * @param adminId - The admin's unique identifier
   * @param userId - The user to assign role to
   * @param role - New role to assign
   * @param reason - Reason for role assignment
   * @returns Promise with success status
   */
  async assignRole(adminId: string, userId: string, role: UserRole, reason?: string): Promise<ServiceResponse<void>> {
    try {
      if (!adminId?.trim() || !userId?.trim() || !role) {
        return {
          success: false,
          error: 'Admin ID, user ID, and role are required',
          code: 'INVALID_INPUT'
        };
      }

      // Check admin access
      const adminCheck = await this.checkAdminAccess(adminId);
      if (!adminCheck.success || !adminCheck.data) {
        return {
          success: false,
          error: 'Insufficient permissions',
          code: 'ACCESS_DENIED'
        };
      }

      // Get user info for logging
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('display_name, role')
        .eq('id', userId)
        .single();

      if (userError) {
        return {
          success: false,
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      const oldRole = userData.role || 'player';

      // Update user role
      const { error: updateError } = await supabase
        .from('users')
        .update({ 
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) {
        return {
          success: false,
          error: updateError.message,
          code: updateError.code
        };
      }

      // Log the action
      await this.logAdminAction(
        adminId,
        'assign_role',
        'user',
        userId,
        userData.display_name,
        reason,
        {
          old_role: oldRole,
          new_role: role
        }
      );

      return {
        success: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to assign role',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get admin logs with filtering and pagination
   * @param filters - Admin filters for logs
   * @param options - Query options for pagination
   * @returns Promise with paginated admin log results
   */
  async getAdminLogs(
    filters: AdminFilters = {},
    options: QueryOptions = {}
  ): Promise<ServiceResponse<PaginatedResponse<AdminLog>>> {
    try {
      const { page = 1, limit = 50, sort_by = 'timestamp', sort_order = 'desc' } = options;
      const offset = (page - 1) * limit;

      let queryBuilder = supabase
        .from('admin_logs')
        .select(`
          id,
          action,
          target_type,
          target_id,
          target_name,
          admin_id,
          admin_name,
          reason,
          details,
          timestamp
        `, { count: 'exact' });

      // Apply filters
      if (filters.date_from) {
        queryBuilder = queryBuilder.gte('timestamp', filters.date_from);
      }

      if (filters.date_to) {
        queryBuilder = queryBuilder.lte('timestamp', filters.date_to);
      }

      if (filters.search) {
        queryBuilder = queryBuilder.or(
          `target_name.ilike.%${filters.search}%,admin_name.ilike.%${filters.search}%,reason.ilike.%${filters.search}%`
        );
      }

      // Apply sorting and pagination
      queryBuilder = queryBuilder
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await queryBuilder;

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      const totalPages = Math.ceil((count || 0) / limit);

      return {
        success: true,
        data: {
          data: data as AdminLog[],
          count: count || 0,
          page,
          limit,
          total_pages: totalPages
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch admin logs',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get admin dashboard statistics
   * @returns Promise with admin statistics
   */
  async getAdminStats(): Promise<ServiceResponse<AdminStats>> {
    try {
      // Get user statistics
      const { data: userStats, error: userError } = await supabase
        .from('users')
        .select('status')
        .not('status', 'is', null);

      if (userError) {
        return {
          success: false,
          error: userError.message,
          code: userError.code
        };
      }

      // Get tournament statistics
      const { data: tournamentStats, error: tournamentError } = await supabase
        .from('tournaments')
        .select('status');

      if (tournamentError) {
        return {
          success: false,
          error: tournamentError.message,
          code: tournamentError.code
        };
      }

      // Get clan count
      const { count: clanCount, error: clanError } = await supabase
        .from('clans')
        .select('*', { count: 'exact', head: true });

      if (clanError) {
        return {
          success: false,
          error: clanError.message,
          code: clanError.code
        };
      }

      // Get recent admin actions count (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { count: recentActions, error: actionsError } = await supabase
        .from('admin_logs')
        .select('*', { count: 'exact', head: true })
        .gte('timestamp', yesterday.toISOString());

      if (actionsError) {
        return {
          success: false,
          error: actionsError.message,
          code: actionsError.code
        };
      }

      // Calculate statistics
      const totalUsers = userStats.length;
      const activeUsers = userStats.filter(u => u.status === 'active').length;
      const bannedUsers = userStats.filter(u => u.status === 'banned').length;
      const totalTournaments = tournamentStats.length;
      const activeTournaments = tournamentStats.filter(t => t.status === 'active').length;

      const stats: AdminStats = {
        total_users: totalUsers,
        active_users: activeUsers,
        banned_users: bannedUsers,
        total_tournaments: totalTournaments,
        active_tournaments: activeTournaments,
        total_clans: clanCount || 0,
        recent_actions: recentActions || 0
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch admin statistics',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Log admin action for audit trail
   * @param adminId - The admin's unique identifier
   * @param action - The action performed
   * @param targetType - Type of target
   * @param targetId - Target identifier
   * @param targetName - Target name for display
   * @param reason - Reason for action
   * @param details - Additional details
   * @returns Promise with success status
   */
  private async logAdminAction(
    adminId: string,
    action: AdminAction,
    targetType: TargetType,
    targetId: string,
    targetName?: string,
    reason?: string,
    details?: Record<string, any>
  ): Promise<ServiceResponse<void>> {
    try {
      // Get admin name
      const { data: adminData } = await supabase
        .from('users')
        .select('display_name')
        .eq('id', adminId)
        .single();

      const logEntry = {
        action,
        target_type: targetType,
        target_id: targetId,
        target_name: targetName,
        admin_id: adminId,
        admin_name: adminData?.display_name || 'Unknown Admin',
        reason,
        details,
        timestamp: new Date().toISOString()
      };

      const { error } = await supabase
        .from('admin_logs')
        .insert(logEntry);

      if (error) {
        console.error('Failed to log admin action:', error);
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true
      };
    } catch (error) {
      console.error('Failed to log admin action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to log admin action',
        code: 'UNKNOWN_ERROR'
      };
    }
  }
}

// Export singleton instance
export const adminService = AdminService.getInstance();