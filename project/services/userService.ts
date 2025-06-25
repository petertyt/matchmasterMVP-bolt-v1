import { supabase } from '@/lib/supabaseClient';
import type { 
  User, 
  UserInput, 
  UserUpdate, 
  ServiceResponse, 
  Clan,
  DatabaseError
} from '@/types/database';

/**
 * User service for managing user profiles and related operations
 * Handles CRUD operations with proper error handling and type safety
 */
export class UserService {
  private static instance: UserService;

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Fetch user profile by ID with comprehensive error handling
   * @param userId - The user's unique identifier
   * @returns Promise with user data or error
   */
  async getUserProfile(userId: string): Promise<ServiceResponse<User>> {
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
        .select('*')
        .eq('id', userId)
        .maybeSingle();

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
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        };
      }

      return {
        success: true,
        data: data as User
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user profile',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get user by ID
   * @param userId - The user's unique identifier
   * @returns Promise with user data or error
   */
  async getUserById(userId: string): Promise<ServiceResponse<User>> {
    return this.getUserProfile(userId);
  }

  /**
   * Update user profile fields with type safety and validation
   * @param userId - The user's unique identifier
   * @param data - Partial user data to update
   * @returns Promise with updated user data or error
   */
  async updateUser(userId: string, data: UserUpdate): Promise<ServiceResponse<User>> {
    try {
      if (!userId?.trim()) {
        return {
          success: false,
          error: 'User ID is required',
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

      // Validate display_name if provided
      if (data.display_name !== undefined) {
        if (!data.display_name?.trim()) {
          return {
            success: false,
            error: 'Display name cannot be empty',
            code: 'INVALID_DISPLAY_NAME'
          };
        }
        if (data.display_name.length > 50) {
          return {
            success: false,
            error: 'Display name must be 50 characters or less',
            code: 'DISPLAY_NAME_TOO_LONG'
          };
        }
      }

      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      const { data: updatedUser, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data: updatedUser as User
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user profile',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get user's clan information with join query
   * @param userId - The user's unique identifier
   * @returns Promise with clan data or null if user has no clan
   */
  async getUserClan(userId: string): Promise<ServiceResponse<Clan | null>> {
    try {
      if (!userId?.trim()) {
        return {
          success: false,
          error: 'User ID is required',
          code: 'INVALID_INPUT'
        };
      }

      // First get the user to check their clan_id
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('clan_id')
        .eq('id', userId)
        .maybeSingle();

      if (userError) {
        return {
          success: false,
          error: userError.message,
          code: userError.code
        };
      }

      if (!userData?.clan_id) {
        return {
          success: true,
          data: null
        };
      }

      // Get the clan data
      const { data: clanData, error: clanError } = await supabase
        .from('clans')
        .select('*')
        .eq('id', userData.clan_id)
        .maybeSingle();

      if (clanError) {
        return {
          success: false,
          error: clanError.message,
          code: clanError.code
        };
      }

      return {
        success: true,
        data: clanData as Clan
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user clan',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Create a new user profile
   * @param userData - User data for creation
   * @returns Promise with created user data or error
   */
  async createUser(userData: UserInput): Promise<ServiceResponse<User>> {
    try {
      // Validate required fields
      if (!userData.display_name?.trim()) {
        return {
          success: false,
          error: 'Display name is required',
          code: 'MISSING_DISPLAY_NAME'
        };
      }

      if (!userData.email?.trim()) {
        return {
          success: false,
          error: 'Email is required',
          code: 'MISSING_EMAIL'
        };
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          error: 'Invalid email format',
          code: 'INVALID_EMAIL'
        };
      }

      const newUser = {
        ...userData,
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
          mvp_count: 0
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .select()
        .maybeSingle();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data: data as User
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create user',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Update user XP and level
   * @param userId - The user's unique identifier
   * @param xpGained - Amount of XP to add
   * @returns Promise with updated user data
   */
  async addUserXP(userId: string, xpGained: number): Promise<ServiceResponse<User>> {
    try {
      if (!userId?.trim()) {
        return {
          success: false,
          error: 'User ID is required',
          code: 'INVALID_INPUT'
        };
      }

      if (xpGained < 0) {
        return {
          success: false,
          error: 'XP gained must be positive',
          code: 'INVALID_XP'
        };
      }

      // Get current user data
      const userResult = await this.getUserProfile(userId);
      if (!userResult.success || !userResult.data) {
        return userResult;
      }

      const user = userResult.data;
      const newXP = user.xp + xpGained;
      
      // Calculate new level (simple formula: level = floor(xp / 1000) + 1)
      const newLevel = Math.floor(newXP / 1000) + 1;

      const { data, error } = await supabase
        .from('users')
        .update({
          xp: newXP,
          level: newLevel,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .maybeSingle();

      if (error) {
        return {
          success: false,
          error: error.message,
          code: error.code
        };
      }

      return {
        success: true,
        data: data as User
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user XP',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Delete user profile (soft delete by updating status)
   * @param userId - The user's unique identifier
   * @returns Promise with success status or error
   */
  async deleteUser(userId: string): Promise<ServiceResponse<void>> {
    try {
      if (!userId?.trim()) {
        return {
          success: false,
          error: 'User ID is required',
          code: 'INVALID_INPUT'
        };
      }

      // Update user record to mark as deleted
      const { error } = await supabase
        .from('users')
        .update({ 
          email: `deleted_${userId}@deleted.com`,
          display_name: 'Deleted User',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
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
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete user',
        code: 'UNKNOWN_ERROR'
      };
    }
  }
}

// Export singleton instance
export const userService = UserService.getInstance();