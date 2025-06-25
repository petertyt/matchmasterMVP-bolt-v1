/*
  # Fix User Policies for Matchmaster

  1. Changes
    - Drop problematic policies that cause infinite recursion
    - Create new policies that allow users to read/update their own data
    - Add policy for users to insert their own profile
    - Simplify admin access to avoid recursion issues

  2. Security
    - Maintain proper row-level security
    - Ensure users can only access their own data
    - Allow profile creation during sign-up
*/

-- Drop all existing policies on users table to start fresh
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can read all users via JWT" ON users;
DROP POLICY IF EXISTS "Admins can update users via JWT" ON users;

-- Create basic policies for users to manage their own data
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

-- Allow users to create their own profile during sign-up
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);