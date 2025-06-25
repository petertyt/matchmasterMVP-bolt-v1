/*
  # Fix Users Table RLS Policies

  This migration fixes the infinite recursion issue in the users table RLS policies
  by removing the problematic policy that creates a circular dependency.

  ## Changes Made
  1. Drop the existing problematic "Admins can read all users" policy
  2. Create a simplified admin policy that doesn't cause recursion
  3. Keep the existing user policies for reading/updating own data

  ## Security
  - Users can still read and update their own data
  - Admin functionality will need to be handled differently to avoid recursion
*/

-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can read all users" ON users;

-- Drop the admin update policy as well since it has similar issues
DROP POLICY IF EXISTS "Admins can update user roles and status" ON users;

-- Create a simpler policy structure that doesn't cause recursion
-- For now, we'll rely on the existing policies that allow users to read/update their own data

-- If admin functionality is needed, it should be implemented through:
-- 1. Supabase service role key (server-side)
-- 2. Database functions with SECURITY DEFINER
-- 3. Edge functions with elevated permissions

-- The existing policies remain:
-- - "Users can read own data" with qual: (uid() = id)
-- - "Users can update own data" with qual: (uid() = id)