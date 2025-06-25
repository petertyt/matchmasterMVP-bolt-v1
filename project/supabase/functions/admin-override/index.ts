import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

interface AdminOverrideRequest {
  match_id: string;
  result: {
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
  };
  reason?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Verify the user token and get user info
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Check if user has admin privileges
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    if (userError || !userData || (userData.role !== 'admin' && userData.role !== 'organizer')) {
      return new Response(
        JSON.stringify({ error: 'Insufficient permissions' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse request body
    const { match_id, result, reason }: AdminOverrideRequest = await req.json()

    if (!match_id || !result) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: match_id and result' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate result data
    if (typeof result.score_a !== 'number' || typeof result.score_b !== 'number' || !result.winner_id) {
      return new Response(
        JSON.stringify({ error: 'Invalid result data' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get match info for validation and logging
    const { data: matchData, error: matchError } = await supabaseClient
      .from('matches')
      .select('id, tournament_id, participant_a_id, participant_b_id, status')
      .eq('id', match_id)
      .single()

    if (matchError || !matchData) {
      return new Response(
        JSON.stringify({ error: 'Match not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Validate winner_id is one of the participants
    if (result.winner_id !== matchData.participant_a_id && result.winner_id !== matchData.participant_b_id) {
      return new Response(
        JSON.stringify({ error: 'Winner must be one of the match participants' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Update match result
    const { error: updateError } = await supabaseClient
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
      .eq('id', match_id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update match result', details: updateError.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get admin name for logging
    const { data: adminData } = await supabaseClient
      .from('users')
      .select('display_name')
      .eq('id', user.id)
      .single()

    // Log the admin action
    const { error: logError } = await supabaseClient
      .from('admin_logs')
      .insert({
        action: 'override_match',
        target_type: 'match',
        target_id: match_id,
        target_name: `Match ${match_id}`,
        admin_id: user.id,
        admin_name: adminData?.display_name || 'Unknown Admin',
        reason: reason || 'No reason provided',
        details: {
          old_status: matchData.status,
          new_result: result,
          tournament_id: matchData.tournament_id
        },
        timestamp: new Date().toISOString()
      })

    if (logError) {
      console.error('Failed to log admin action:', logError)
      // Don't fail the request if logging fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Match result updated successfully',
        match_id: match_id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Admin override error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})