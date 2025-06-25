/*
  # Add INSERT policy for users table

  1. Security
    - Add policy to allow authenticated users to insert their own user profile
    - Ensures users can only create profiles with their own auth.uid()
    
  This fixes the RLS violation error that prevents new user registration.
*/

-- Allow authenticated users to insert their own user profile
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);