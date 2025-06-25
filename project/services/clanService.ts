import { supabase } from '@/lib/supabaseClient';
import type { 
  Clan, 
  ClanInput, 
  ClanUpdate, 
  ServiceResponse, 
  QueryOptions,
  PaginatedResponse,
  User,
  DatabaseError
} from '@/types/database';

/**
 * Clan service for managing clans and member operations
 * Handles CRUD operations with proper member management and referential integrity
 */
export class ClanService {
  private static instance: ClanService;

  static getInstance(): ClanService {
    if (!ClanService.instance) {
      ClanService.instance = new ClanService();
    }
    return ClanService.instance;
  }

  /**
   * Create a new clan with validation and initial setup
   * @param data - Clan data for creation
   * @returns Promise with created clan data or error
   * 
   * @example
   * const result = await clanService.createClan({
   *   name: 'Elite Warriors',
   *   tag: 'ELIT',
   *   leader_id: 'user-123',
   *   description: 'Competitive gaming clan',
   *   max_members: 20
   * });
   */
  async createClan(data: ClanInput): Promise<ServiceResponse<Clan>> {
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        return {
          success: false,
          error: 'Clan name is required',
          code: 'MISSING_NAME'
        };
      }

      if (!data.tag?.trim()) {
        return {
          success: false,
          error: 'Clan tag is required',
          code: 'MISSING_TAG'
        };
      }

      if (!data.leader_id?.trim()) {
        return {
          success: false,
          error: 'Leader ID is required',
          code: 'MISSING_LEADER'
        };
      }

      // Validate tag format (2-6 uppercase letters/numbers)
      const tagRegex = /^[A-Z0-9]{2,6}$/;
      if (!tagRegex.test(data.tag)) {
        return {
          success: false,
          error: 'Clan tag must be 2-6 uppercase letters or numbers',
          code: 'INVALID_TAG_FORMAT'
        };
      }

      // Validate max_members
      if (!data.max_members || data.max_members < 2 || data.max_members > 100) {
        return {
          success: false,
          error: 'Max members must be between 2 and 100',
          code: 'INVALID_MAX_MEMBERS'
        };
      }

      // Check if tag is already taken
      const { data: existingClan, error: tagCheckError } = await supabase
        .from('clans')
        .select('id')
        .eq('tag', data.tag)
        .single();

      if (tagCheckError && tagCheckError.code !== 'PGRST116') { // PGRST116 = no rows returned
        return {
          success: false,
          error: tagCheckError.message,
          code: tagCheckError.code
        };
      }

      if (existingClan) {
        return {
          success: false,
          error: 'Clan tag is already taken',
          code: 'TAG_TAKEN'
        };
      }

      // Check if user is already in a clan
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('clan_id')
        .eq('id', data.leader_id)
        .single();

      if (userError) {
        return {
          success: false,
          error: 'Invalid leader ID',
          code: 'INVALID_LEADER'
        };
      }

      if (userData?.clan_id) {
        return {
          success: false,
          error: 'User is already in a clan',
          code: 'USER_ALREADY_IN_CLAN'
        };
      }

      const newClan = {
        ...data,
        member_ids: [data.leader_id],
        captain_ids: [data.leader_id],
        level: 1,
        xp: 0,
        stats: {
          total_matches: 0,
          wins: 0,
          losses: 0,
          win_rate: 0,
          tournaments_won: 0,
          current_streak: 0,
          best_streak: 0,
          rank: 0
        },
        settings: {
          join_approval_required: false,
          allow_member_invites: true,
          visibility: 'public' as const,
          auto_kick_inactive_days: undefined
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: clan, error } = await supabase
        .from('clans')
        .insert(newClan)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Update user's clan_id
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ clan_id: clan.id })
        .eq('id', data.leader_id);

      if (userUpdateError) {
        // Rollback clan creation
        await supabase.from('clans').delete().eq('id', clan.id);
        return {
          success: false,
          error: 'Failed to update user clan membership',
          code: 'USER_UPDATE_FAILED'
        };
      }

      return {
        success: true,
        data: clan as Clan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create clan',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get clan by ID with comprehensive error handling
   * @param id - The clan's unique identifier
   * @returns Promise with clan data or error
   * 
   * @example
   * const result = await clanService.getClanById('clan-123');
   */
  async getClanById(id: string): Promise<ServiceResponse<Clan>> {
    try {
      if (!id?.trim()) {
        return {
          success: false,
          error: 'Clan ID is required',
          code: 'INVALID_INPUT'
        };
      }

      const { data, error } = await supabase
        .from('clans')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      if (!data) {
        return {
          success: false,
          error: 'Clan not found',
          code: 'CLAN_NOT_FOUND'
        };
      }

      return {
        success: true,
        data: data as Clan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch clan',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get clans where user is member or leader
   * @param userId - The user's unique identifier
   * @returns Promise with user's clans or error
   * 
   * @example
   * const result = await clanService.getClansForUser('user-123');
   */
  async getClansForUser(userId: string): Promise<ServiceResponse<Clan[]>> {
    try {
      if (!userId?.trim()) {
        return {
          success: false,
          error: 'User ID is required',
          code: 'INVALID_INPUT'
        };
      }

      const { data, error } = await supabase
        .from('clans')
        .select('*')
        .contains('member_ids', [userId])
        .order('created_at', { ascending: false });

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data: data as Clan[]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user clans',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Update clan with validation and referential integrity
   * @param id - The clan's unique identifier
   * @param data - Partial clan data to update
   * @returns Promise with updated clan data or error
   * 
   * @example
   * const result = await clanService.updateClan('clan-123', {
   *   description: 'Updated description',
   *   max_members: 25
   * });
   */
  async updateClan(id: string, data: ClanUpdate): Promise<ServiceResponse<Clan>> {
    try {
      if (!id?.trim()) {
        return {
          success: false,
          error: 'Clan ID is required',
          code: 'INVALID_INPUT'
        };
      }

      if (!data || Object.keys(data).length === 0) {
        return {
          success: false,
          error: 'Update data is required',
          code: 'INVALID_INPUT'
        };
      }

      // Validate name if provided
      if (data.name !== undefined && !data.name?.trim()) {
        return {
          success: false,
          error: 'Clan name cannot be empty',
          code: 'INVALID_NAME'
        };
      }

      // Validate tag if provided
      if (data.tag !== undefined) {
        const tagRegex = /^[A-Z0-9]{2,6}$/;
        if (!tagRegex.test(data.tag)) {
          return {
            success: false,
            error: 'Clan tag must be 2-6 uppercase letters or numbers',
            code: 'INVALID_TAG_FORMAT'
          };
        }

        // Check if tag is already taken by another clan
        const { data: existingClan, error: tagCheckError } = await supabase
          .from('clans')
          .select('id')
          .eq('tag', data.tag)
          .neq('id', id)
          .single();

        if (tagCheckError && tagCheckError.code !== 'PGRST116') {
          return {
            success: false,
            error: tagCheckError.message,
            code: tagCheckError.code
          };
        }

        if (existingClan) {
          return {
            success: false,
            error: 'Clan tag is already taken',
            code: 'TAG_TAKEN'
          };
        }
      }

      // Validate max_members if provided
      if (data.max_members !== undefined) {
        if (data.max_members < 2 || data.max_members > 100) {
          return {
            success: false,
            error: 'Max members must be between 2 and 100',
            code: 'INVALID_MAX_MEMBERS'
          };
        }

        // Check if new max is less than current member count
        const clanResult = await this.getClanById(id);
        if (!clanResult.success || !clanResult.data) {
          return clanResult;
        }

        if (data.max_members < clanResult.data.member_ids.length) {
          return {
            success: false,
            error: 'Max members cannot be less than current member count',
            code: 'MAX_MEMBERS_TOO_LOW'
          };
        }
      }

      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      const { data: clan, error } = await supabase
        .from('clans')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data: clan as Clan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update clan',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Add member to clan with validation and role management
   * @param clanId - The clan's unique identifier
   * @param userId - The user's unique identifier
   * @returns Promise with updated clan data or error
   * 
   * @example
   * const result = await clanService.addClanMember('clan-123', 'user-456');
   */
  async addClanMember(clanId: string, userId: string): Promise<ServiceResponse<Clan>> {
    try {
      if (!clanId?.trim() || !userId?.trim()) {
        return {
          success: false,
          error: 'Clan ID and user ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Get current clan data
      const clanResult = await this.getClanById(clanId);
      if (!clanResult.success || !clanResult.data) {
        return clanResult;
      }

      const clan = clanResult.data;

      // Check if user is already a member
      if (clan.member_ids.includes(userId)) {
        return {
          success: false,
          error: 'User is already a member of this clan',
          code: 'ALREADY_MEMBER'
        };
      }

      // Check clan capacity
      if (clan.member_ids.length >= clan.max_members) {
        return {
          success: false,
          error: 'Clan is full',
          code: 'CLAN_FULL'
        };
      }

      // Check if user is already in another clan
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('clan_id')
        .eq('id', userId)
        .single();

      if (userError) {
        return {
          success: false,
          error: 'Invalid user ID',
          code: 'INVALID_USER'
        };
      }

      if (userData?.clan_id) {
        return {
          success: false,
          error: 'User is already in a clan',
          code: 'USER_ALREADY_IN_CLAN'
        };
      }

      const updatedMemberIds = [...clan.member_ids, userId];

      // Update clan
      const { data, error } = await supabase
        .from('clans')
        .update({
          member_ids: updatedMemberIds,
          updated_at: new Date().toISOString()
        })
        .eq('id', clanId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Update user's clan_id
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ clan_id: clanId })
        .eq('id', userId);

      if (userUpdateError) {
        // Rollback clan update
        await supabase
          .from('clans')
          .update({
            member_ids: clan.member_ids,
            updated_at: new Date().toISOString()
          })
          .eq('id', clanId);

        return {
          success: false,
          error: 'Failed to update user clan membership',
          code: 'USER_UPDATE_FAILED'
        };
      }

      return {
        success: true,
        data: data as Clan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add clan member',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Remove member from clan with role management
   * @param clanId - The clan's unique identifier
   * @param userId - The user's unique identifier
   * @returns Promise with updated clan data or error
   * 
   * @example
   * const result = await clanService.removeClanMember('clan-123', 'user-456');
   */
  async removeClanMember(clanId: string, userId: string): Promise<ServiceResponse<Clan>> {
    try {
      if (!clanId?.trim() || !userId?.trim()) {
        return {
          success: false,
          error: 'Clan ID and user ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Get current clan data
      const clanResult = await this.getClanById(clanId);
      if (!clanResult.success || !clanResult.data) {
        return clanResult;
      }

      const clan = clanResult.data;

      // Check if user is a member
      if (!clan.member_ids.includes(userId)) {
        return {
          success: false,
          error: 'User is not a member of this clan',
          code: 'NOT_MEMBER'
        };
      }

      // Prevent removing the leader if they're the only member
      if (clan.leader_id === userId && clan.member_ids.length === 1) {
        return {
          success: false,
          error: 'Cannot remove the last member who is also the leader',
          code: 'CANNOT_REMOVE_LAST_LEADER'
        };
      }

      // If removing the leader, transfer leadership to another captain or member
      let newLeaderId = clan.leader_id;
      if (clan.leader_id === userId) {
        const otherCaptains = clan.captain_ids.filter(id => id !== userId);
        const otherMembers = clan.member_ids.filter(id => id !== userId);
        
        newLeaderId = otherCaptains.length > 0 ? otherCaptains[0] : otherMembers[0];
      }

      const updatedMemberIds = clan.member_ids.filter(id => id !== userId);
      const updatedCaptainIds = clan.captain_ids.filter(id => id !== userId);

      // Update clan
      const { data, error } = await supabase
        .from('clans')
        .update({
          member_ids: updatedMemberIds,
          captain_ids: updatedCaptainIds,
          leader_id: newLeaderId,
          updated_at: new Date().toISOString()
        })
        .eq('id', clanId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      // Update user's clan_id to null
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ clan_id: null })
        .eq('id', userId);

      if (userUpdateError) {
        console.warn('Failed to update user clan_id after removal:', userUpdateError);
      }

      return {
        success: true,
        data: data as Clan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove clan member',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Assign captain role to a member
   * @param clanId - The clan's unique identifier
   * @param userId - The user's unique identifier
   * @returns Promise with updated clan data or error
   * 
   * @example
   * const result = await clanService.assignCaptain('clan-123', 'user-456');
   */
  async assignCaptain(clanId: string, userId: string): Promise<ServiceResponse<Clan>> {
    try {
      if (!clanId?.trim() || !userId?.trim()) {
        return {
          success: false,
          error: 'Clan ID and user ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Get current clan data
      const clanResult = await this.getClanById(clanId);
      if (!clanResult.success || !clanResult.data) {
        return clanResult;
      }

      const clan = clanResult.data;

      // Check if user is a member
      if (!clan.member_ids.includes(userId)) {
        return {
          success: false,
          error: 'User is not a member of this clan',
          code: 'NOT_MEMBER'
        };
      }

      // Check if already a captain
      if (clan.captain_ids.includes(userId)) {
        return {
          success: false,
          error: 'User is already a captain',
          code: 'ALREADY_CAPTAIN'
        };
      }

      const updatedCaptainIds = [...clan.captain_ids, userId];

      const { data, error } = await supabase
        .from('clans')
        .update({
          captain_ids: updatedCaptainIds,
          updated_at: new Date().toISOString()
        })
        .eq('id', clanId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data: data as Clan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to assign captain',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Revoke captain role from a member
   * @param clanId - The clan's unique identifier
   * @param userId - The user's unique identifier
   * @returns Promise with updated clan data or error
   * 
   * @example
   * const result = await clanService.revokeCaptain('clan-123', 'user-456');
   */
  async revokeCaptain(clanId: string, userId: string): Promise<ServiceResponse<Clan>> {
    try {
      if (!clanId?.trim() || !userId?.trim()) {
        return {
          success: false,
          error: 'Clan ID and user ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Get current clan data
      const clanResult = await this.getClanById(clanId);
      if (!clanResult.success || !clanResult.data) {
        return clanResult;
      }

      const clan = clanResult.data;

      // Check if user is a captain
      if (!clan.captain_ids.includes(userId)) {
        return {
          success: false,
          error: 'User is not a captain',
          code: 'NOT_CAPTAIN'
        };
      }

      // Prevent revoking leader's captain status
      if (clan.leader_id === userId) {
        return {
          success: false,
          error: 'Cannot revoke captain status from clan leader',
          code: 'CANNOT_REVOKE_LEADER'
        };
      }

      const updatedCaptainIds = clan.captain_ids.filter(id => id !== userId);

      const { data, error } = await supabase
        .from('clans')
        .update({
          captain_ids: updatedCaptainIds,
          updated_at: new Date().toISOString()
        })
        .eq('id', clanId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data: data as Clan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to revoke captain',
        code: 'UNKNOWN_ERROR'
      };
    }
  }
}

// Export singleton instance
export const clanService = ClanService.getInstance();