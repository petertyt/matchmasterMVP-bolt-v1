/*
  # Complete Database Schema for Matchmaster Admin Tools

  1. New Tables
    - `users` - User profiles with roles and status management
    - `tournaments` - Tournament management with formats and configurations  
    - `clans` - Team/clan management with member hierarchies
    - `matches` - Match results and tournament brackets
    - `admin_logs` - Audit trail for admin actions

  2. Security
    - Enable RLS on all tables
    - Role-based access control (admin, organizer, leader, player)
    - Comprehensive policies for data access and modification
    - Audit logging for admin interventions

  3. Performance
    - Strategic indexes on frequently queried columns
    - Foreign key constraints with proper cascade behavior
    - Check constraints for data validation
*/

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  role text DEFAULT 'player' NOT NULL,
  status text DEFAULT 'active' NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  xp integer DEFAULT 0 NOT NULL,
  clan_id uuid,
  preferences jsonb DEFAULT '{}',
  stats jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tournaments table if it doesn't exist
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  format text NOT NULL,
  status text DEFAULT 'draft' NOT NULL,
  creator_id uuid NOT NULL,
  participants uuid[] DEFAULT '{}',
  max_participants integer NOT NULL,
  start_date timestamptz,
  end_date timestamptz,
  prize_pool text,
  game text,
  rules text,
  image_url text,
  is_public boolean DEFAULT true,
  registration_deadline timestamptz,
  config jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clans table if it doesn't exist
CREATE TABLE IF NOT EXISTS clans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tag text UNIQUE NOT NULL,
  description text,
  logo_url text,
  member_ids uuid[] DEFAULT '{}',
  captain_ids uuid[] DEFAULT '{}',
  leader_id uuid NOT NULL,
  level integer DEFAULT 1 NOT NULL,
  xp integer DEFAULT 0 NOT NULL,
  max_members integer DEFAULT 20 NOT NULL,
  is_public boolean DEFAULT true,
  stats jsonb DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create matches table if it doesn't exist
CREATE TABLE IF NOT EXISTS matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid NOT NULL,
  round integer NOT NULL,
  participant_a_id uuid NOT NULL,
  participant_b_id uuid NOT NULL,
  score_a integer,
  score_b integer,
  status text DEFAULT 'scheduled' NOT NULL,
  scheduled_time timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  winner_id uuid,
  match_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  details jsonb DEFAULT '{}',
  timestamp timestamptz DEFAULT now()
);

-- Add constraints for valid values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_user_role' AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT check_user_role 
      CHECK (role IN ('admin', 'organizer', 'leader', 'player'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_user_status' AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT check_user_status 
      CHECK (status IN ('active', 'banned', 'suspended'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_tournament_format' AND table_name = 'tournaments'
  ) THEN
    ALTER TABLE tournaments ADD CONSTRAINT check_tournament_format 
      CHECK (format IN ('single_elimination', 'double_elimination', 'round_robin', 'swiss'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_tournament_status' AND table_name = 'tournaments'
  ) THEN
    ALTER TABLE tournaments ADD CONSTRAINT check_tournament_status 
      CHECK (status IN ('draft', 'registration', 'upcoming', 'active', 'completed', 'cancelled'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'check_match_status' AND table_name = 'matches'
  ) THEN
    ALTER TABLE matches ADD CONSTRAINT check_match_status 
      CHECK (status IN ('scheduled', 'ready', 'active', 'completed', 'cancelled', 'disputed'));
  END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_clan_id ON users(clan_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_creator_id ON tournaments(creator_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_clans_leader_id ON clans(leader_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament_id ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_timestamp ON admin_logs(timestamp);

-- Add foreign key constraints
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_users_clan_id' AND table_name = 'users'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT fk_users_clan_id 
      FOREIGN KEY (clan_id) REFERENCES clans(id) ON DELETE SET NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_tournaments_creator_id' AND table_name = 'tournaments'
  ) THEN
    ALTER TABLE tournaments ADD CONSTRAINT fk_tournaments_creator_id 
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_clans_leader_id' AND table_name = 'clans'
  ) THEN
    ALTER TABLE clans ADD CONSTRAINT fk_clans_leader_id 
      FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_matches_tournament_id' AND table_name = 'matches'
  ) THEN
    ALTER TABLE matches ADD CONSTRAINT fk_matches_tournament_id 
      FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_admin_logs_admin_id' AND table_name = 'admin_logs'
  ) THEN
    ALTER TABLE admin_logs ADD CONSTRAINT fk_admin_logs_admin_id 
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clans ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update user roles and status" ON users;
DROP POLICY IF EXISTS "Users can read public tournaments" ON tournaments;
DROP POLICY IF EXISTS "Users can create tournaments" ON tournaments;
DROP POLICY IF EXISTS "Organizers can update own tournaments" ON tournaments;
DROP POLICY IF EXISTS "Users can read public clans" ON clans;
DROP POLICY IF EXISTS "Users can create clans" ON clans;
DROP POLICY IF EXISTS "Leaders can update own clan" ON clans;
DROP POLICY IF EXISTS "Users can read tournament matches" ON matches;
DROP POLICY IF EXISTS "Organizers can manage matches" ON matches;
DROP POLICY IF EXISTS "Admins can read all logs" ON admin_logs;
DROP POLICY IF EXISTS "Admins can create logs" ON admin_logs;

-- Users table policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role IN ('admin', 'organizer')
    )
  );

CREATE POLICY "Admins can update user roles and status"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users admin_user
      WHERE admin_user.id = auth.uid() 
      AND admin_user.role = 'admin'
    )
  );

-- Tournaments table policies
CREATE POLICY "Users can read public tournaments"
  ON tournaments
  FOR SELECT
  TO authenticated
  USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create tournaments"
  ON tournaments
  FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Organizers can update own tournaments"
  ON tournaments
  FOR UPDATE
  TO authenticated
  USING (
    creator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'organizer')
    )
  );

-- Clans table policies
CREATE POLICY "Users can read public clans"
  ON clans
  FOR SELECT
  TO authenticated
  USING (is_public = true OR auth.uid() = ANY(member_ids));

CREATE POLICY "Users can create clans"
  ON clans
  FOR INSERT
  TO authenticated
  WITH CHECK (leader_id = auth.uid());

CREATE POLICY "Leaders can update own clan"
  ON clans
  FOR UPDATE
  TO authenticated
  USING (
    leader_id = auth.uid() OR
    auth.uid() = ANY(captain_ids) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'organizer')
    )
  );

-- Matches table policies
CREATE POLICY "Users can read tournament matches"
  ON matches
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tournaments 
      WHERE tournaments.id = tournament_id 
      AND (tournaments.is_public = true OR tournaments.creator_id = auth.uid())
    )
  );

CREATE POLICY "Organizers can manage matches"
  ON matches
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tournaments 
      WHERE tournaments.id = tournament_id 
      AND tournaments.creator_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'organizer')
    )
  );

-- Admin logs table policies
CREATE POLICY "Admins can read all logs"
  ON admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'organizer')
    )
  );

CREATE POLICY "Admins can create logs"
  ON admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'organizer')
    )
  );