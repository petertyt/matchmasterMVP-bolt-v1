/*
  # Sample Data Migration for Matchmaster

  1. New Data
    - Sample users with different roles (admin, organizer, leader, player)
    - Sample clans with members and statistics
    - Sample tournaments in various states
    - Sample matches with results
    - Sample admin logs for audit trail

  2. Implementation
    - Uses conditional inserts to avoid duplicate key errors
    - Properly casts UUID arrays for member_ids and participants
    - Maintains referential integrity between tables
*/

-- Insert sample users only if they don't exist
DO $$
DECLARE
  user_count integer;
BEGIN
  SELECT COUNT(*) INTO user_count FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440001';
  
  IF user_count = 0 THEN
    INSERT INTO users (id, email, display_name, role, status, level, xp, preferences, stats, created_at) VALUES
      ('550e8400-e29b-41d4-a716-446655440001', 'admin@matchmaster.com', 'Admin User', 'admin', 'active', 50, 25000, 
       '{"theme": "dark", "notifications": {"clan_challenges": true, "match_updates": true, "game_invites": true, "achievements": true, "system": true, "push_enabled": true}}',
       '{"total_matches": 200, "wins": 150, "losses": 50, "win_rate": 75, "tournaments_won": 15, "current_streak": 8, "best_streak": 20, "mvp_count": 45}',
       '2024-01-01T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO user_count FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440002';
  IF user_count = 0 THEN
    INSERT INTO users (id, email, display_name, role, status, level, xp, preferences, stats, created_at) VALUES
      ('550e8400-e29b-41d4-a716-446655440002', 'organizer@matchmaster.com', 'Tournament Organizer', 'organizer', 'active', 45, 20000,
       '{"theme": "light", "notifications": {"clan_challenges": true, "match_updates": true, "game_invites": true, "achievements": true, "system": true, "push_enabled": true}}',
       '{"total_matches": 180, "wins": 120, "losses": 60, "win_rate": 66.7, "tournaments_won": 12, "current_streak": 3, "best_streak": 15, "mvp_count": 30}',
       '2024-01-05T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO user_count FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440003';
  IF user_count = 0 THEN
    INSERT INTO users (id, email, display_name, role, status, level, xp, preferences, stats, created_at) VALUES
      ('550e8400-e29b-41d4-a716-446655440003', 'stormking@matchmaster.com', 'StormKing', 'leader', 'active', 42, 18500,
       '{"theme": "dark", "notifications": {"clan_challenges": true, "match_updates": true, "game_invites": true, "achievements": true, "system": false, "push_enabled": true}}',
       '{"total_matches": 156, "wins": 98, "losses": 58, "win_rate": 62.8, "tournaments_won": 8, "current_streak": 5, "best_streak": 12, "mvp_count": 23}',
       '2024-01-10T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO user_count FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440004';
  IF user_count = 0 THEN
    INSERT INTO users (id, email, display_name, role, status, level, xp, preferences, stats, created_at) VALUES
      ('550e8400-e29b-41d4-a716-446655440004', 'firebird@matchmaster.com', 'FireBird', 'leader', 'active', 40, 16000,
       '{"theme": "light", "notifications": {"clan_challenges": true, "match_updates": true, "game_invites": true, "achievements": true, "system": false, "push_enabled": false}}',
       '{"total_matches": 134, "wins": 89, "losses": 45, "win_rate": 66.4, "tournaments_won": 6, "current_streak": 7, "best_streak": 14, "mvp_count": 19}',
       '2024-01-12T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO user_count FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440005';
  IF user_count = 0 THEN
    INSERT INTO users (id, email, display_name, role, status, level, xp, preferences, stats, created_at) VALUES
      ('550e8400-e29b-41d4-a716-446655440005', 'lightning@matchmaster.com', 'LightningStrike', 'player', 'active', 35, 12000,
       '{"theme": "dark", "notifications": {"clan_challenges": true, "match_updates": true, "game_invites": false, "achievements": true, "system": false, "push_enabled": true}}',
       '{"total_matches": 98, "wins": 65, "losses": 33, "win_rate": 66.3, "tournaments_won": 4, "current_streak": 2, "best_streak": 9, "mvp_count": 12}',
       '2024-01-15T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO user_count FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440006';
  IF user_count = 0 THEN
    INSERT INTO users (id, email, display_name, role, status, level, xp, preferences, stats, created_at) VALUES
      ('550e8400-e29b-41d4-a716-446655440006', 'thunderbolt@matchmaster.com', 'ThunderBolt', 'player', 'active', 32, 10500,
       '{"theme": "system", "notifications": {"clan_challenges": true, "match_updates": true, "game_invites": true, "achievements": true, "system": false, "push_enabled": false}}',
       '{"total_matches": 87, "wins": 52, "losses": 35, "win_rate": 59.8, "tournaments_won": 3, "current_streak": 1, "best_streak": 7, "mvp_count": 8}',
       '2024-01-18T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO user_count FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440007';
  IF user_count = 0 THEN
    INSERT INTO users (id, email, display_name, role, status, level, xp, preferences, stats, created_at) VALUES
      ('550e8400-e29b-41d4-a716-446655440007', 'dragonmaster@matchmaster.com', 'DragonMaster', 'leader', 'active', 48, 23000,
       '{"theme": "dark", "notifications": {"clan_challenges": true, "match_updates": true, "game_invites": true, "achievements": true, "system": false, "push_enabled": true}}',
       '{"total_matches": 210, "wins": 168, "losses": 42, "win_rate": 80, "tournaments_won": 18, "current_streak": 12, "best_streak": 25, "mvp_count": 52}',
       '2024-01-08T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO user_count FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440008';
  IF user_count = 0 THEN
    INSERT INTO users (id, email, display_name, role, status, level, xp, preferences, stats, created_at) VALUES
      ('550e8400-e29b-41d4-a716-446655440008', 'frostlord@matchmaster.com', 'FrostLord', 'player', 'active', 38, 14500,
       '{"theme": "light", "notifications": {"clan_challenges": true, "match_updates": false, "game_invites": true, "achievements": true, "system": false, "push_enabled": false}}',
       '{"total_matches": 112, "wins": 78, "losses": 34, "win_rate": 69.6, "tournaments_won": 5, "current_streak": 4, "best_streak": 11, "mvp_count": 16}',
       '2024-01-20T00:00:00Z');
  END IF;
END $$;

-- Insert sample clans with proper UUIDs only if they don't exist
DO $$
DECLARE
  clan_count integer;
BEGIN
  SELECT COUNT(*) INTO clan_count FROM clans WHERE id = '650e8400-e29b-41d4-a716-446655440001';
  
  IF clan_count = 0 THEN
    INSERT INTO clans (id, name, tag, description, member_ids, captain_ids, leader_id, level, xp, max_members, is_public, stats, settings, created_at) VALUES
      ('650e8400-e29b-41d4-a716-446655440001', 'Thunder Bolts', 'THDR', 'Elite competitive gaming clan focused on tournament victories', 
       ARRAY['550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid], 
       ARRAY['550e8400-e29b-41d4-a716-446655440003'::uuid], '550e8400-e29b-41d4-a716-446655440003', 38, 15000, 20, true,
       '{"total_matches": 98, "wins": 78, "losses": 20, "win_rate": 79.6, "tournaments_won": 12, "current_streak": 5, "best_streak": 15, "rank": 3}',
       '{"join_approval_required": false, "allow_member_invites": true, "visibility": "public"}',
       '2024-01-15T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO clan_count FROM clans WHERE id = '650e8400-e29b-41d4-a716-446655440002';
  IF clan_count = 0 THEN
    INSERT INTO clans (id, name, tag, description, member_ids, captain_ids, leader_id, level, xp, max_members, is_public, stats, settings, created_at) VALUES
      ('650e8400-e29b-41d4-a716-446655440002', 'Elite Warriors', 'ELIT', 'Top competitive gaming clan', 
       ARRAY['550e8400-e29b-41d4-a716-446655440007'::uuid], 
       ARRAY['550e8400-e29b-41d4-a716-446655440007'::uuid], '550e8400-e29b-41d4-a716-446655440007', 45, 22500, 20, true,
       '{"total_matches": 127, "wins": 108, "losses": 19, "win_rate": 85.0, "tournaments_won": 18, "current_streak": 8, "best_streak": 20, "rank": 1}',
       '{"join_approval_required": true, "allow_member_invites": false, "visibility": "public"}',
       '2024-01-08T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO clan_count FROM clans WHERE id = '650e8400-e29b-41d4-a716-446655440003';
  IF clan_count = 0 THEN
    INSERT INTO clans (id, name, tag, description, member_ids, captain_ids, leader_id, level, xp, max_members, is_public, stats, settings, created_at) VALUES
      ('650e8400-e29b-41d4-a716-446655440003', 'Phoenix Rising', 'PHNX', 'Rising from the ashes stronger than ever', 
       ARRAY['550e8400-e29b-41d4-a716-446655440004'::uuid], 
       ARRAY['550e8400-e29b-41d4-a716-446655440004'::uuid], '550e8400-e29b-41d4-a716-446655440004', 42, 18000, 15, true,
       '{"total_matches": 89, "wins": 76, "losses": 13, "win_rate": 85.4, "tournaments_won": 10, "current_streak": 7, "best_streak": 18, "rank": 2}',
       '{"join_approval_required": false, "allow_member_invites": true, "visibility": "public"}',
       '2024-01-12T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO clan_count FROM clans WHERE id = '650e8400-e29b-41d4-a716-446655440004';
  IF clan_count = 0 THEN
    INSERT INTO clans (id, name, tag, description, member_ids, captain_ids, leader_id, level, xp, max_members, is_public, stats, settings, created_at) VALUES
      ('650e8400-e29b-41d4-a716-446655440004', 'Ice Guardians', 'ICE', 'Cool under pressure, deadly in competition', 
       ARRAY['550e8400-e29b-41d4-a716-446655440008'::uuid], 
       ARRAY['550e8400-e29b-41d4-a716-446655440008'::uuid], '550e8400-e29b-41d4-a716-446655440008', 35, 12000, 25, false,
       '{"total_matches": 67, "wins": 52, "losses": 15, "win_rate": 77.6, "tournaments_won": 6, "current_streak": 3, "best_streak": 12, "rank": 5}',
       '{"join_approval_required": true, "allow_member_invites": false, "visibility": "private"}',
       '2024-01-20T00:00:00Z');
  END IF;
END $$;

-- Update users with clan_id only if not already set
DO $$
BEGIN
  -- Update Thunder Bolts members
  UPDATE users 
  SET clan_id = '650e8400-e29b-41d4-a716-446655440001' 
  WHERE id IN ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440006')
  AND (clan_id IS NULL OR clan_id != '650e8400-e29b-41d4-a716-446655440001');
  
  -- Update Elite Warriors members
  UPDATE users 
  SET clan_id = '650e8400-e29b-41d4-a716-446655440002' 
  WHERE id = '550e8400-e29b-41d4-a716-446655440007'
  AND (clan_id IS NULL OR clan_id != '650e8400-e29b-41d4-a716-446655440002');
  
  -- Update Phoenix Rising members
  UPDATE users 
  SET clan_id = '650e8400-e29b-41d4-a716-446655440003' 
  WHERE id = '550e8400-e29b-41d4-a716-446655440004'
  AND (clan_id IS NULL OR clan_id != '650e8400-e29b-41d4-a716-446655440003');
  
  -- Update Ice Guardians members
  UPDATE users 
  SET clan_id = '650e8400-e29b-41d4-a716-446655440004' 
  WHERE id = '550e8400-e29b-41d4-a716-446655440008'
  AND (clan_id IS NULL OR clan_id != '650e8400-e29b-41d4-a716-446655440004');
END $$;

-- Insert sample tournaments with proper UUIDs only if they don't exist
DO $$
DECLARE
  tournament_count integer;
BEGIN
  SELECT COUNT(*) INTO tournament_count FROM tournaments WHERE id = '750e8400-e29b-41d4-a716-446655440001';
  
  IF tournament_count = 0 THEN
    INSERT INTO tournaments (id, name, description, format, status, creator_id, participants, max_participants, start_date, end_date, prize_pool, game, rules, image_url, is_public, registration_deadline, config, created_at) VALUES
      ('750e8400-e29b-41d4-a716-446655440001', 'Championship League 2025', 'The ultimate championship tournament featuring the best clans and players', 'single_elimination', 'active', 
       '550e8400-e29b-41d4-a716-446655440002', 
       ARRAY['550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid, '550e8400-e29b-41d4-a716-446655440006'::uuid, '550e8400-e29b-41d4-a716-446655440007'::uuid, '550e8400-e29b-41d4-a716-446655440008'::uuid], 
       16, '2025-01-20T14:00:00Z', '2025-01-22T20:00:00Z', '$500', 'Valorant', 'Best of 3 matches, standard competitive rules apply.', 
       'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg', true, '2025-01-19T23:59:59Z',
       '{"bracket_settings": {"seeding_method": "ranking", "third_place_match": true, "consolation_bracket": false}, "match_settings": {"best_of": 3, "time_limit": 90, "overtime_rules": "MR3", "map_selection": ["Bind", "Haven", "Split", "Ascent", "Dust2", "Inferno", "Mirage"]}, "scoring_system": {"win_points": 3, "loss_points": 0, "draw_points": 1}}',
       '2025-01-01T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO tournament_count FROM tournaments WHERE id = '750e8400-e29b-41d4-a716-446655440002';
  IF tournament_count = 0 THEN
    INSERT INTO tournaments (id, name, description, format, status, creator_id, participants, max_participants, start_date, end_date, prize_pool, game, rules, image_url, is_public, registration_deadline, config, created_at) VALUES
      ('750e8400-e29b-41d4-a716-446655440002', 'Winter Cup 2025', 'Seasonal tournament with exciting prizes', 'double_elimination', 'registration', 
       '550e8400-e29b-41d4-a716-446655440002', 
       ARRAY['550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440005'::uuid], 
       8, '2025-01-25T16:00:00Z', '2025-01-26T22:00:00Z', '$200', 'CS:GO', 'Double elimination bracket, best of 3 finals.', 
       'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg', true, '2025-01-24T23:59:59Z',
       '{"bracket_settings": {"seeding_method": "random", "third_place_match": false, "consolation_bracket": true}, "match_settings": {"best_of": 3, "time_limit": 120, "overtime_rules": "MR3"}, "scoring_system": {"win_points": 3, "loss_points": 0}}',
       '2025-01-05T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO tournament_count FROM tournaments WHERE id = '750e8400-e29b-41d4-a716-446655440003';
  IF tournament_count = 0 THEN
    INSERT INTO tournaments (id, name, description, format, status, creator_id, participants, max_participants, start_date, end_date, prize_pool, game, rules, image_url, is_public, registration_deadline, config, created_at) VALUES
      ('750e8400-e29b-41d4-a716-446655440003', 'Elite Championship', 'Premium tournament for top-tier players', 'round_robin', 'registration', 
       '550e8400-e29b-41d4-a716-446655440007', 
       ARRAY[]::uuid[], 
       12, '2025-02-01T18:00:00Z', '2025-02-03T20:00:00Z', '$1000', 'Valorant', 'Round robin format with top 4 advancing to playoffs.', 
       'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg', true, '2025-01-31T23:59:59Z',
       '{"bracket_settings": {"seeding_method": "ranking", "third_place_match": true, "consolation_bracket": false}, "match_settings": {"best_of": 3, "time_limit": 90}, "scoring_system": {"win_points": 3, "loss_points": 0, "draw_points": 1}}',
       '2025-01-10T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO tournament_count FROM tournaments WHERE id = '750e8400-e29b-41d4-a716-446655440004';
  IF tournament_count = 0 THEN
    INSERT INTO tournaments (id, name, description, format, status, creator_id, participants, max_participants, start_date, end_date, prize_pool, game, rules, image_url, is_public, registration_deadline, config, created_at) VALUES
      ('750e8400-e29b-41d4-a716-446655440004', 'Spring Showdown', 'Seasonal competitive tournament', 'single_elimination', 'upcoming', 
       '550e8400-e29b-41d4-a716-446655440002', 
       ARRAY['550e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440007'::uuid], 
       32, '2025-02-15T20:00:00Z', '2025-02-17T22:00:00Z', '$750', 'CS:GO', 'Large scale single elimination tournament.', 
       'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg', true, '2025-02-14T23:59:59Z',
       '{"bracket_settings": {"seeding_method": "random", "third_place_match": false, "consolation_bracket": false}, "match_settings": {"best_of": 3, "time_limit": 90}, "scoring_system": {"win_points": 3, "loss_points": 0}}',
       '2025-01-12T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO tournament_count FROM tournaments WHERE id = '750e8400-e29b-41d4-a716-446655440005';
  IF tournament_count = 0 THEN
    INSERT INTO tournaments (id, name, description, format, status, creator_id, participants, max_participants, start_date, end_date, prize_pool, game, rules, image_url, is_public, registration_deadline, config, created_at) VALUES
      ('750e8400-e29b-41d4-a716-446655440005', 'Autumn Classic', 'Completed tournament for reference', 'single_elimination', 'completed', 
       '550e8400-e29b-41d4-a716-446655440002', 
       ARRAY['550e8400-e29b-41d4-a716-446655440003'::uuid, '550e8400-e29b-41d4-a716-446655440004'::uuid, '550e8400-e29b-41d4-a716-446655440007'::uuid, '550e8400-e29b-41d4-a716-446655440008'::uuid], 
       8, '2024-12-01T14:00:00Z', '2024-12-03T20:00:00Z', '$300', 'Valorant', 'Completed tournament with great matches.', 
       'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg', true, '2024-11-30T23:59:59Z',
       '{"bracket_settings": {"seeding_method": "ranking", "third_place_match": true, "consolation_bracket": false}, "match_settings": {"best_of": 3, "time_limit": 90}, "scoring_system": {"win_points": 3, "loss_points": 0}}',
       '2024-11-15T00:00:00Z');
  END IF;
END $$;

-- Insert sample matches with proper UUIDs only if they don't exist
DO $$
DECLARE
  match_count integer;
BEGIN
  SELECT COUNT(*) INTO match_count FROM matches WHERE id = '850e8400-e29b-41d4-a716-446655440001';
  
  IF match_count = 0 THEN
    INSERT INTO matches (id, tournament_id, round, participant_a_id, participant_b_id, score_a, score_b, status, scheduled_time, started_at, completed_at, winner_id, match_data, created_at) VALUES
      ('850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 1, 
       '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 2, 1, 'completed', 
       '2025-01-20T14:00:00Z', '2025-01-20T14:05:00Z', '2025-01-20T15:30:00Z', '550e8400-e29b-41d4-a716-446655440003',
       '{"game_results": [{"game_number": 1, "score_a": 13, "score_b": 11, "duration": 28, "map": "Bind", "winner_id": "550e8400-e29b-41d4-a716-446655440003"}, {"game_number": 2, "score_a": 9, "score_b": 13, "duration": 25, "map": "Haven", "winner_id": "550e8400-e29b-41d4-a716-446655440004"}, {"game_number": 3, "score_a": 13, "score_b": 8, "duration": 22, "map": "Split", "winner_id": "550e8400-e29b-41d4-a716-446655440003"}], "mvp_id":  "550e8400-e29b-41d4-a716-446655440003"}',
       '2025-01-19T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO match_count FROM matches WHERE id = '850e8400-e29b-41d4-a716-446655440002';
  IF match_count = 0 THEN
    INSERT INTO matches (id, tournament_id, round, participant_a_id, participant_b_id, score_a, score_b, status, scheduled_time, started_at, completed_at, winner_id, match_data, created_at) VALUES
      ('850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440001', 1, 
       '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', 2, 0, 'completed', 
       '2025-01-20T16:00:00Z', '2025-01-20T16:05:00Z', '2025-01-20T17:15:00Z', '550e8400-e29b-41d4-a716-446655440007',
       '{"game_results": [{"game_number": 1, "score_a": 13, "score_b": 7, "duration": 22, "map": "Ascent", "winner_id": "550e8400-e29b-41d4-a716-446655440007"}, {"game_number": 2, "score_a": 13, "score_b": 10, "duration": 26, "map": "Bind", "winner_id": "550e8400-e29b-41d4-a716-446655440007"}], "mvp_id": "550e8400-e29b-41d4-a716-446655440007"}',
       '2025-01-19T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO match_count FROM matches WHERE id = '850e8400-e29b-41d4-a716-446655440003';
  IF match_count = 0 THEN
    INSERT INTO matches (id, tournament_id, round, participant_a_id, participant_b_id, status, scheduled_time, created_at) VALUES
      ('850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440001', 2, 
       '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'scheduled', 
       '2025-01-21T15:00:00Z', '2025-01-20T18:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO match_count FROM matches WHERE id = '850e8400-e29b-41d4-a716-446655440004';
  IF match_count = 0 THEN
    INSERT INTO matches (id, tournament_id, round, participant_a_id, participant_b_id, status, scheduled_time, created_at) VALUES
      ('850e8400-e29b-41d4-a716-446655440004', '750e8400-e29b-41d4-a716-446655440002', 1, 
       '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440005', 'scheduled', 
       '2025-01-25T16:00:00Z', '2025-01-24T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO match_count FROM matches WHERE id = '850e8400-e29b-41d4-a716-446655440005';
  IF match_count = 0 THEN
    INSERT INTO matches (id, tournament_id, round, participant_a_id, participant_b_id, score_a, score_b, status, scheduled_time, started_at, completed_at, winner_id, match_data, created_at) VALUES
      ('850e8400-e29b-41d4-a716-446655440005', '750e8400-e29b-41d4-a716-446655440005', 1, 
       '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 2, 1, 'completed', 
       '2024-12-01T14:00:00Z', '2024-12-01T14:05:00Z', '2024-12-01T15:30:00Z', '550e8400-e29b-41d4-a716-446655440003',
       '{"game_results": [{"game_number": 1, "score_a": 13, "score_b": 9, "duration": 24, "map": "Bind", "winner_id": "550e8400-e29b-41d4-a716-446655440003"}, {"game_number": 2, "score_a": 10, "score_b": 13, "duration": 27, "map": "Haven", "winner_id": "550e8400-e29b-41d4-a716-446655440004"}, {"game_number": 3, "score_a": 13, "score_b": 11, "duration": 29, "map": "Split", "winner_id": "550e8400-e29b-41d4-a716-446655440003"}], "mvp_id": "550e8400-e29b-41d4-a716-446655440003"}',
       '2024-11-30T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO match_count FROM matches WHERE id = '850e8400-e29b-41d4-a716-446655440006';
  IF match_count = 0 THEN
    INSERT INTO matches (id, tournament_id, round, participant_a_id, participant_b_id, score_a, score_b, status, scheduled_time, started_at, completed_at, winner_id, match_data, created_at) VALUES
      ('850e8400-e29b-41d4-a716-446655440006', '750e8400-e29b-41d4-a716-446655440005', 1, 
       '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', 2, 0, 'completed', 
       '2024-12-01T16:00:00Z', '2024-12-01T16:05:00Z', '2024-12-01T17:15:00Z', '550e8400-e29b-41d4-a716-446655440007',
       '{"game_results": [{"game_number": 1, "score_a": 13, "score_b": 8, "duration": 23, "map": "Ascent", "winner_id": "550e8400-e29b-41d4-a716-446655440007"}, {"game_number": 2, "score_a": 13, "score_b": 9, "duration": 25, "map": "Bind", "winner_id": "550e8400-e29b-41d4-a716-446655440007"}], "mvp_id": "550e8400-e29b-41d4-a716-446655440007"}',
       '2024-11-30T00:00:00Z');
  END IF;
  
  SELECT COUNT(*) INTO match_count FROM matches WHERE id = '850e8400-e29b-41d4-a716-446655440007';
  IF match_count = 0 THEN
    INSERT INTO matches (id, tournament_id, round, participant_a_id, participant_b_id, score_a, score_b, status, scheduled_time, started_at, completed_at, winner_id, match_data, created_at) VALUES
      ('850e8400-e29b-41d4-a716-446655440007', '750e8400-e29b-41d4-a716-446655440005', 2, 
       '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 2, 1, 'completed', 
       '2024-12-02T15:00:00Z', '2024-12-02T15:05:00Z', '2024-12-02T16:45:00Z', '550e8400-e29b-41d4-a716-446655440003',
       '{"game_results": [{"game_number": 1, "score_a": 13, "score_b": 10, "duration": 26, "map": "Split", "winner_id": "550e8400-e29b-41d4-a716-446655440003"}, {"game_number": 2, "score_a": 9, "score_b": 13, "duration": 28, "map": "Haven", "winner_id": "550e8400-e29b-41d4-a716-446655440007"}, {"game_number": 3, "score_a": 13, "score_b": 11, "duration": 30, "map": "Bind", "winner_id": "550e8400-e29b-41d4-a716-446655440003"}], "mvp_id": "550e8400-e29b-41d4-a716-446655440003"}',
       '2024-12-01T18:00:00Z');
  END IF;
END $$;

-- Insert sample admin logs with proper UUIDs only if they don't exist
DO $$
DECLARE
  log_count integer;
BEGIN
  SELECT COUNT(*) INTO log_count FROM admin_logs WHERE id = '950e8400-e29b-41d4-a716-446655440001';
  
  IF log_count = 0 THEN
    INSERT INTO admin_logs (id, admin_id, action, target_type, target_id, details, timestamp) VALUES
      ('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'override_match', 'match', '850e8400-e29b-41d4-a716-446655440005', 
       '{"old_status": "active", "new_result": {"score_a": 2, "score_b": 1, "winner_id": "550e8400-e29b-41d4-a716-446655440003"}, "reason": "Score correction requested by both team captains"}',
       '2024-12-01T17:30:00Z');
  END IF;
  
  SELECT COUNT(*) INTO log_count FROM admin_logs WHERE id = '950e8400-e29b-41d4-a716-446655440002';
  IF log_count = 0 THEN
    INSERT INTO admin_logs (id, admin_id, action, target_type, target_id, details, timestamp) VALUES
      ('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'assign_role', 'user', '550e8400-e29b-41d4-a716-446655440002', 
       '{"old_role": "player", "new_role": "organizer", "reason": "Promoted to help manage tournaments"}',
       '2024-01-05T10:00:00Z');
  END IF;
END $$;