import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Clan, ClanFilters, QueryOptions } from '@/types';

interface UseClansOptions {
  filters?: ClanFilters;
  queryOptions?: QueryOptions;
  autoFetch?: boolean;
}

export function useClans(options: UseClansOptions = {}) {
  const { filters = {}, queryOptions = {}, autoFetch = true } = options;
  
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 0,
    count: 0,
  });

  const fetchClans = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const { page: pageNum = 1, limit = 20, sort_by = 'created_at', sort_order = 'desc' } = queryOptions;
      const offset = (pageNum - 1) * limit;

      let query = supabase
        .from('clans')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.is_public !== undefined) {
        query = query.eq('is_public', filters.is_public);
      }

      if (filters.has_space) {
        // This is a complex filter that would need a function in PostgreSQL
        // For now, we'll fetch all and filter client-side
      }

      if (filters.member_id) {
        query = query.contains('member_ids', [filters.member_id]);
      }

      if (filters.leader_id) {
        query = query.eq('leader_id', filters.leader_id);
      }

      // Apply sorting and pagination
      query = query
        .order(sort_by, { ascending: sort_order === 'asc' })
        .range(offset, offset + limit - 1);

      const { data, error: fetchError, count } = await query;

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      // Apply client-side filters if needed
      let filteredData = data || [];
      
      if (filters.has_space) {
        filteredData = filteredData.filter(clan => 
          clan.member_ids.length < clan.max_members
        );
      }

      setClans(filteredData);
      setPagination({
        page: pageNum,
        totalPages: Math.ceil((count || 0) / limit),
        count: count || 0,
      });
    } catch (err) {
      console.error('Error fetching clans:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch clans');
    } finally {
      setLoading(false);
    }
  };

  const createClan = async (clanData: any) => {
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!clanData.name || !clanData.tag || !clanData.leader_id) {
        return { 
          success: false, 
          error: 'Name, tag, and leader ID are required' 
        };
      }

      // Prepare clan data
      const newClan = {
        ...clanData,
        member_ids: [clanData.leader_id],
        captain_ids: [clanData.leader_id],
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
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error: insertError } = await supabase
        .from('clans')
        .insert(newClan)
        .select();

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      // Update user's clan_id
      const { error: updateError } = await supabase
        .from('users')
        .update({ clan_id: data[0].id })
        .eq('id', clanData.leader_id);

      if (updateError) {
        // Rollback clan creation
        await supabase.from('clans').delete().eq('id', data[0].id);
        return { success: false, error: 'Failed to update user clan membership' };
      }

      // Refresh the clan list
      await fetchClans();

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error creating clan:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create clan'
      };
    } finally {
      setLoading(false);
    }
  };

  const joinClan = async (clanId: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get current clan data
      const { data: clan, error: fetchError } = await supabase
        .from('clans')
        .select('member_ids, max_members')
        .eq('id', clanId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Check if user is already a member
      if (clan.member_ids && clan.member_ids.includes(userId)) {
        return { success: false, error: 'You are already a member of this clan' };
      }

      // Check if clan is full
      if (clan.member_ids && clan.member_ids.length >= clan.max_members) {
        return { success: false, error: 'This clan is full' };
      }

      // Check if user is already in another clan
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('clan_id')
        .eq('id', userId)
        .single();

      if (userError) {
        return { success: false, error: userError.message };
      }

      if (user.clan_id) {
        return { success: false, error: 'You are already a member of another clan' };
      }

      // Add user to clan
      const updatedMembers = [...(clan.member_ids || []), userId];
      
      const { data, error: updateError } = await supabase
        .from('clans')
        .update({ 
          member_ids: updatedMembers,
          updated_at: new Date().toISOString()
        })
        .eq('id', clanId)
        .select();

      if (updateError) {
        return { success: false, error: updateError.message };
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
          .update({ member_ids: clan.member_ids })
          .eq('id', clanId);
          
        return { success: false, error: 'Failed to update user clan membership' };
      }

      // Update local state
      setClans(prev => 
        prev.map(c => c.id === clanId ? data[0] : c)
      );

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error joining clan:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to join clan'
      };
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (clanId: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get current clan data
      const { data: clan, error: fetchError } = await supabase
        .from('clans')
        .select('member_ids, captain_ids, leader_id')
        .eq('id', clanId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Check if user is a member
      if (!clan.member_ids || !clan.member_ids.includes(userId)) {
        return { success: false, error: 'User is not a member of this clan' };
      }

      // Check if user is the leader and the only member
      if (clan.leader_id === userId && clan.member_ids.length === 1) {
        return { success: false, error: 'Cannot remove the last member who is also the leader' };
      }

      // If removing the leader, transfer leadership to another captain or member
      let updatedLeaderId = clan.leader_id;
      if (clan.leader_id === userId) {
        const otherCaptains = clan.captain_ids.filter(id => id !== userId);
        const otherMembers = clan.member_ids.filter(id => id !== userId);
        
        updatedLeaderId = otherCaptains.length > 0 ? otherCaptains[0] : otherMembers[0];
      }

      // Remove user from members and captains
      const updatedMembers = clan.member_ids.filter(id => id !== userId);
      const updatedCaptains = clan.captain_ids.filter(id => id !== userId);

      // Update clan
      const { data, error: updateError } = await supabase
        .from('clans')
        .update({ 
          member_ids: updatedMembers,
          captain_ids: updatedCaptains,
          leader_id: updatedLeaderId,
          updated_at: new Date().toISOString()
        })
        .eq('id', clanId)
        .select();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Update user's clan_id to null
      const { error: userUpdateError } = await supabase
        .from('users')
        .update({ clan_id: null })
        .eq('id', userId);

      if (userUpdateError) {
        console.warn('Failed to update user clan_id after removal:', userUpdateError);
      }

      // Update local state
      setClans(prev => 
        prev.map(c => c.id === clanId ? data[0] : c)
      );

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error removing clan member:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to remove clan member'
      };
    } finally {
      setLoading(false);
    }
  };

  const assignCaptain = async (clanId: string, userId: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get current clan data
      const { data: clan, error: fetchError } = await supabase
        .from('clans')
        .select('member_ids, captain_ids')
        .eq('id', clanId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      // Check if user is a member
      if (!clan.member_ids || !clan.member_ids.includes(userId)) {
        return { success: false, error: 'User is not a member of this clan' };
      }

      // Check if already a captain
      if (clan.captain_ids && clan.captain_ids.includes(userId)) {
        return { success: false, error: 'User is already a captain' };
      }

      // Add user to captains
      const updatedCaptains = [...(clan.captain_ids || []), userId];

      // Update clan
      const { data, error: updateError } = await supabase
        .from('clans')
        .update({ 
          captain_ids: updatedCaptains,
          updated_at: new Date().toISOString()
        })
        .eq('id', clanId)
        .select();

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      // Update local state
      setClans(prev => 
        prev.map(c => c.id === clanId ? data[0] : c)
      );

      return { success: true, data: data[0] };
    } catch (err) {
      console.error('Error assigning captain:', err);
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to assign captain'
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchClans();
    }
  }, [JSON.stringify(filters), JSON.stringify(queryOptions), autoFetch]);

  return {
    clans,
    loading,
    error,
    pagination,
    fetchClans,
    createClan,
    joinClan,
    leaveClan: removeMember,
    assignCaptain,
    refetch: () => fetchClans(pagination.page),
  };
}