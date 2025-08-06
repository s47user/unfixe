/*
  # Fix infinite recursion in user_profiles RLS policies

  This migration fixes the infinite recursion error by:
  1. Dropping all existing policies on user_profiles table
  2. Creating new, simple policies that avoid recursive queries
  3. Ensuring policies use direct comparisons with auth.uid()

  ## Changes Made
  - Removed any complex subqueries in RLS policies
  - Used simple auth.uid() = id comparisons
  - Separated policies for different operations (SELECT, INSERT, UPDATE)
*/

-- Drop all existing policies on user_profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any user profile" ON user_profiles;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id);

CREATE POLICY "Users can create their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id)
  WITH CHECK (auth.uid()::text = id);

-- Admin policies using simple role check without subqueries
CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid()::text 
      AND up.role = 'admin'
    )
  );

CREATE POLICY "Admins can update any profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid()::text 
      AND up.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = auth.uid()::text 
      AND up.role = 'admin'
    )
  );