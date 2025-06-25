/*
  # Fix RLS Policies for Users Table

  This migration fixes the infinite recursion issue in the users table RLS policies.
  
  ## Changes Made
  1. Drop the problematic "Admins can read all users by role" policy that causes recursion
  2. Drop the problematic "Admins can update users by role" policy that causes recursion
  3. Create new policies that avoid recursion by using auth.jwt() claims instead of subqueries
  4. Keep the existing user self-access policies intact

  ## Security
  - Users can still read and update their own data
  - Admins and organizers can still manage users, but through JWT claims instead of database queries
*/

-- Drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Admins can read all users by role" ON users;
DROP POLICY IF EXISTS "Admins can update users by role" ON users;

-- Create new admin policies that use JWT claims instead of subqueries to avoid recursion
-- Note: This assumes admin/organizer roles are stored in JWT claims
-- If not available in JWT, you'll need to handle admin access differently

-- Allow admins to read all users (using JWT claims)
CREATE POLICY "Admins can read all users via JWT"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin', 'organizer'])
  );

-- Allow admins to update users (using JWT claims)
CREATE POLICY "Admins can update users via JWT"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'role')::text = ANY (ARRAY['admin', 'organizer'])
  );

-- Alternative approach: If JWT claims are not available, create a simpler policy
-- that allows specific user IDs (you would need to manually manage admin user IDs)
-- Uncomment and modify these if the JWT approach doesn't work:

/*
-- Allow specific admin user IDs to read all users
CREATE POLICY "Specific admins can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      -- Replace these UUIDs with actual admin user IDs
      '00000000-0000-0000-0000-000000000000'::uuid
    )
  );

-- Allow specific admin user IDs to update users
CREATE POLICY "Specific admins can update users"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() IN (
      -- Replace these UUIDs with actual admin user IDs
      '00000000-0000-0000-0000-000000000000'::uuid
    )
  );
*/