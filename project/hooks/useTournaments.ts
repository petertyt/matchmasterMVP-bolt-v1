import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Tournament, TournamentFilters, QueryOptions } from '@/types';

interface UseTournamentsOptions {
  filters?: TournamentFilters;
  queryOptions?: QueryOptions;
  autoFetch?: boolean;
}

export function useTournaments(options: UseTournamentsOptions = {}) {
  const { filters = {}, queryOptions = {}, autoFetch = true } = options;
  
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    count: 0,
  });

  const fetchTournaments = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const { page: pageNum = 1, limit = 20, sort_by = 'created_at', sort_order = 'desc' } = queryOptions;
      const offset = (pageNum - 1) * limit;

      let query = supabase
        .from('tournaments')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }

      if (filters.participant_id) {
        query = query.contains('participants', [filters.participant_id]);
      }

      if (filters.creator_id) {
        query = query.eq('creator_id', filters.creator_id);
      }

      if (filters.game) {
        query = query.eq('game', filters.game);
      }

      // Apply sorting and pagination
      query = query
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setTournaments(data || []);
      setPagination({
        page: pageNum,
        totalPages: Math.ceil((count || 0) / limit),
        count: count || 0,
      });
    } catch (err) {
      console.error('Error fetching tournaments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tournaments');
    } finally {
      setLoading(false);
    }
  };

  const joinTournament = async (tournamentId: string, userId: string) => {
    try {
      // Get current tournament data
      const { data: tournament, error: fetchError } = await supabase
        .from('tournaments')
        .select('participants, max_participants, status')
        .eq('id', tournamentId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Check if tournament is open for registration
      if (tournament.status !== 'registration' && tournament.status !== 'upcoming') {
        return { success: false, error: 'Tournament is not open for registration' };
      }

      // Check if user is already participating
      if (tournament.participants && tournament.participants.includes(userId)) {
        return { success: false, error: 'You are already registered for this tournament' };
      }

      // Check if tournament is full
      if (tournament.participants && tournament.participants.length >= tournament.max_participants) {
        return { success: false, error: 'Tournament is full' };
      }

      // Add user to participants
      const updatedParticipants = [...(tournament.participants || []), userId];
      
      const { data, error: updateError } = await supabase
        .from('tournaments')
        .update({ 
          participants: updatedParticipants,
          updated_at: new Date().toISOString()
        })
        .eq('id', tournamentId)
        .select();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Update local state
      setTournaments(prev => 
        prev.map(t => t.id === tournamentId ? data[0] : t)
      );

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error joining tournament:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to join tournament'
      };
    }
  };

  const leaveTournament = async (tournamentId: string, userId: string) => {
    try {
      // Get current tournament data
      const { data: tournament, error: fetchError } = await supabase
        .from('tournaments')
        .select('participants, status')
        .eq('id', tournamentId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Check if tournament has started
      if (tournament.status === 'active' || tournament.status === 'completed') {
        return { success: false, error: 'Cannot leave an active or completed tournament' };
      }

      // Check if user is participating
      if (!tournament.participants || !tournament.participants.includes(userId)) {
        return { success: false, error: 'You are not registered for this tournament' };
      }

      // Remove user from participants
      const updatedParticipants = tournament.participants.filter(id => id !== userId);
      
      const { data, error: updateError } = await supabase
        .from('tournaments')
        .update({ 
          participants: updatedParticipants,
          updated_at: new Date().toISOString()
        })
        .eq('id', tournamentId)
        .select();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Update local state
      setTournaments(prev => 
        prev.map(t => t.id === tournamentId ? data[0] : t)
      );

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error leaving tournament:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to leave tournament'
      };
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTournaments(queryOptions.page || 1);
    }
  }, [JSON.stringify(filters), JSON.stringify(queryOptions), autoFetch]);

  return {
    tournaments,
    loading,
    error,
    pagination,
    fetchTournaments,
    joinTournament,
    leaveTournament,
    refetch: () => fetchTournaments(pagination.page),
  };
}