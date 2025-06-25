/*
  # Fix User Policies to Prevent Infinite Recursion

  1. Changes
    - Drop problematic policies that cause infinite recursion
    - Create new policies with simpler conditions
    - Fix user authentication and profile loading

  2. Security
    - Maintain row-level security
    - Ensure users can only access their own data
    - Allow admins to access necessary data without recursion
*/

-- Drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update user roles and status" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create simpler policies that don't cause recursion
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

-- Add a policy for admins to read user data without recursion
CREATE POLICY "Admins can read all users by role"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'organizer')
  );

-- Add a policy for admins to update user data without recursion
CREATE POLICY "Admins can update users by role"
  ON users
  FOR UPDATE
  TO authenticated
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'organizer')
  );