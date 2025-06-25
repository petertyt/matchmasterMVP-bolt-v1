import { supabase } from '@/lib/supabaseClient';
import type { 
  Tournament, 
  TournamentInput, 
  TournamentUpdate, 
  ServiceResponse, 
  QueryOptions,
  PaginatedResponse,
  Match,
  TournamentStatus,
  DatabaseError
} from '@/types/database';

/**
 * Tournament service for managing tournaments and related operations
 * Handles CRUD operations with proper error handling and cascade deletes
 */
export class TournamentService {
  private static instance: TournamentService;

  static getInstance(): TournamentService {
    if (!TournamentService.instance) {
      TournamentService.instance = new TournamentService();
    }
    return TournamentService.instance;
  }

  /**
   * Create a new tournament with validation and config serialization
   * @param data - Tournament data for creation
   * @returns Promise with created tournament data or error
   * 
   * @example
   * const result = await tournamentService.createTournament({
   *   name: 'Championship 2025',
   *   format: 'single_elimination',
   *   creator_id: 'user-123',
   *   max_participants: 16,
   *   config: { bracket_settings: {...}, match_settings: {...} }
   * });
   */
  async createTournament(data: TournamentInput): Promise<ServiceResponse<Tournament>> {
    try {
      // Validate required fields
      if (!data.name?.trim()) {
        return {
          success: false,
          error: 'Tournament name is required',
          code: 'MISSING_NAME'
        };
      }

      if (!data.creator_id?.trim()) {
        return {
          success: false,
          error: 'Creator ID is required',
          code: 'MISSING_CREATOR'
        };
      }

      if (!data.max_participants || data.max_participants < 2) {
        return {
          success: false,
          error: 'Maximum participants must be at least 2',
          code: 'INVALID_MAX_PARTICIPANTS'
        };
      }

      // Validate start date
      if (data.start_date) {
        const startDate = new Date(data.start_date);
        if (startDate <= new Date()) {
          return {
            success: false,
            error: 'Start date must be in the future',
            code: 'INVALID_START_DATE'
          };
        }
      }

      const newTournament = {
        ...data,
        participants: [],
        status: 'draft' as TournamentStatus,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: tournament, error } = await supabase
        .from('tournaments')
        .insert(newTournament)
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
        data: tournament as Tournament
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create tournament',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get tournament by ID with comprehensive error handling
   * @param id - The tournament's unique identifier
   * @returns Promise with tournament data or error
   * 
   * @example
   * const result = await tournamentService.getTournamentById('tournament-123');
   */
  async getTournamentById(id: string): Promise<ServiceResponse<Tournament>> {
    try {
      if (!id?.trim()) {
        return {
          success: false,
          error: 'Tournament ID is required',
          code: 'INVALID_INPUT'
        };
      }

      const { data, error } = await supabase
        .from('tournaments')
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
          error: 'Tournament not found',
          code: 'TOURNAMENT_NOT_FOUND'
        };
      }

      return {
        success: true,
        data: data as Tournament
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch tournament',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get tournaments created by or joined by a specific user
   * @param userId - The user's unique identifier
   * @returns Promise with user's tournaments or error
   * 
   * @example
   * const result = await tournamentService.getUserTournaments('user-123');
   */
  async getUserTournaments(userId: string): Promise<ServiceResponse<Tournament[]>> {
    try {
      if (!userId?.trim()) {
        return {
          success: false,
          error: 'User ID is required',
          code: 'INVALID_INPUT'
        };
      }

      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .or(`creator_id.eq.${userId},participants.cs.{${userId}}`)
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
        data: data as Tournament[]
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user tournaments',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Get all public tournaments that users can join
   * @param options - Query options for pagination and sorting
   * @returns Promise with public tournaments or error
   * 
   * @example
   * const result = await tournamentService.getAllPublicTournaments({ page: 1, limit: 10 });
   */
  async getAllPublicTournaments(options: QueryOptions = {}): Promise<ServiceResponse<PaginatedResponse<Tournament>>> {
    try {
      const { page = 1, limit = 20, sort_by = 'created_at', sort_order = 'desc' } = options;
      const offset = (page - 1) * limit;

      let query = supabase
        .from('tournaments')
        .select('*', { count: 'exact' })
        .eq('is_public', true)
        .in('status', ['registration', 'upcoming'])
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

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
          data: data as Tournament[],
          count: count || 0,
          page,
          limit,
          total_pages: totalPages
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch public tournaments',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Update tournament with validation and config handling
   * @param id - The tournament's unique identifier
   * @param data - Partial tournament data to update
   * @returns Promise with updated tournament data or error
   * 
   * @example
   * const result = await tournamentService.updateTournament('tournament-123', {
   *   name: 'Updated Championship',
   *   prize_pool: '$1000'
   * });
   */
  async updateTournament(id: string, data: TournamentUpdate): Promise<ServiceResponse<Tournament>> {
    try {
      if (!id?.trim()) {
        return {
          success: false,
          error: 'Tournament ID is required',
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
          error: 'Tournament name cannot be empty',
          code: 'INVALID_NAME'
        };
      }

      // Validate dates if provided
      if (data.start_date) {
        const startDate = new Date(data.start_date);
        if (startDate <= new Date()) {
          return {
            success: false,
            error: 'Start date must be in the future',
            code: 'INVALID_START_DATE'
          };
        }
      }

      if (data.end_date && data.start_date) {
        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        if (endDate <= startDate) {
          return {
            success: false,
            error: 'End date must be after start date',
            code: 'INVALID_END_DATE'
          };
        }
      }

      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };

      const { data: tournament, error } = await supabase
        .from('tournaments')
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
        data: tournament as Tournament
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update tournament',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Delete tournament with cascade delete for matches
   * @param id - The tournament's unique identifier
   * @returns Promise with success status or error
   * 
   * @example
   * const result = await tournamentService.deleteTournament('tournament-123');
   */
  async deleteTournament(id: string): Promise<ServiceResponse<void>> {
    try {
      if (!id?.trim()) {
        return {
          success: false,
          error: 'Tournament ID is required',
          code: 'INVALID_INPUT'
        };
      }

      // Check if tournament exists and get its status
      const tournamentResult = await this.getTournamentById(id);
      if (!tournamentResult.success) {
        return tournamentResult;
      }

      const tournament = tournamentResult.data;
      if (!tournament) {
        return {
          success: false,
          error: 'Tournament not found',
          code: 'TOURNAMENT_NOT_FOUND'
        };
      }

      // Prevent deletion of active tournaments
      if (tournament.status === 'active') {
        return {
          success: false,
          error: 'Cannot delete active tournament',
          code: 'TOURNAMENT_ACTIVE'
        };
      }

      // Delete associated matches first (cascade delete)
      const { error: matchesError } = await supabase
        .from('matches')
        .delete()
        .eq('tournament_id', id);

      if (matchesError) {
        return {
          success: false,
          error: `Failed to delete tournament matches: ${matchesError.message}`,
          code: 'CASCADE_DELETE_FAILED'
        };
      }

      // Delete the tournament
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', id);

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
        error: error instanceof Error ? error.message : 'Failed to delete tournament',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Add participant to tournament with validation
   * @param tournamentId - The tournament's unique identifier
   * @param userId - The user's unique identifier
   * @returns Promise with updated tournament data or error
   * 
   * @example
   * const result = await tournamentService.addParticipant('tournament-123', 'user-456');
   */
  async addParticipant(tournamentId: string, userId: string): Promise<ServiceResponse<Tournament>> {
    try {
      if (!tournamentId?.trim() || !userId?.trim()) {
        return {
          success: false,
          error: 'Tournament ID and user ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Get current tournament
      const tournamentResult = await this.getTournamentById(tournamentId);
      if (!tournamentResult.success || !tournamentResult.data) {
        return tournamentResult;
      }

      const tournament = tournamentResult.data;

      // Validate tournament status
      if (tournament.status !== 'registration') {
        return {
          success: false,
          error: 'Tournament is not open for registration',
          code: 'REGISTRATION_CLOSED'
        };
      }

      // Check if already participating
      if (tournament.participants.includes(userId)) {
        return {
          success: false,
          error: 'User is already participating in this tournament',
          code: 'ALREADY_PARTICIPATING'
        };
      }

      // Check capacity
      if (tournament.participants.length >= tournament.max_participants) {
        return {
          success: false,
          error: 'Tournament is full',
          code: 'TOURNAMENT_FULL'
        };
      }

      // Check registration deadline
      if (tournament.registration_deadline) {
        const deadline = new Date(tournament.registration_deadline);
        if (new Date() > deadline) {
          return {
            success: false,
            error: 'Registration deadline has passed',
            code: 'REGISTRATION_DEADLINE_PASSED'
          };
        }
      }

      const updatedParticipants = [...tournament.participants, userId];

      const { data, error } = await supabase
        .from('tournaments')
        .update({
          participants: updatedParticipants,
          updated_at: new Date().toISOString()
        })
        .eq('id', tournamentId)
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
        data: data as Tournament
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add participant',
        code: 'UNKNOWN_ERROR'
      };
    }
  }

  /**
   * Remove participant from tournament
   * @param tournamentId - The tournament's unique identifier
   * @param userId - The user's unique identifier
   * @returns Promise with updated tournament data or error
   * 
   * @example
   * const result = await tournamentService.removeParticipant('tournament-123', 'user-456');
   */
  async removeParticipant(tournamentId: string, userId: string): Promise<ServiceResponse<Tournament>> {
    try {
      if (!tournamentId?.trim() || !userId?.trim()) {
        return {
          success: false,
          error: 'Tournament ID and user ID are required',
          code: 'INVALID_INPUT'
        };
      }

      // Get current tournament
      const tournamentResult = await this.getTournamentById(tournamentId);
      if (!tournamentResult.success || !tournamentResult.data) {
        return tournamentResult;
      }

      const tournament = tournamentResult.data;

      // Check if participating
      if (!tournament.participants.includes(userId)) {
        return {
          success: false,
          error: 'User is not participating in this tournament',
          code: 'NOT_PARTICIPATING'
        };
      }

      // Validate tournament status
      if (tournament.status === 'active' || tournament.status === 'completed') {
        return {
          success: false,
          error: 'Cannot remove participant from active or completed tournament',
          code: 'TOURNAMENT_STARTED'
        };
      }

      const updatedParticipants = tournament.participants.filter(id => id !== userId);

      const { data, error } = await supabase
        .from('tournaments')
        .update({
          participants: updatedParticipants,
          updated_at: new Date().toISOString()
        })
        .eq('id', tournamentId)
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
        data: data as Tournament
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to remove participant',
        code: 'UNKNOWN_ERROR'
      };
    }
  }
}

// Export singleton instance
export const tournamentService = TournamentService.getInstance();