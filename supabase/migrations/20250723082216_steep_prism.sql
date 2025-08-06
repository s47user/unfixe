/*
  # Fix infinite recursion in user_profiles RLS policies

  This migration addresses the "infinite recursion detected in policy for relation 'user_profiles'" error
  by creating a helper function and restructuring RLS policies to avoid circular dependencies.

  ## Changes Made
  1. Create `is_admin()` helper function to check if current user is admin
  2. Drop all existing problematic RLS policies on user_profiles
  3. Create new, non-recursive RLS policies
  4. Enable RLS on user_profiles table

  ## Security
  - Users can only view and edit their own profiles
  - Admins can view and edit all profiles (determined by helper function)
  - Only authenticated users can insert profiles (their own)
  - Proper role-based access control without recursion
*/

-- Drop all existing policies on user_profiles to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can create their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON user_profiles;

-- Create a helper function to check if the current user is an admin
-- This function will be used in RLS policies to avoid infinite recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the current user has admin role
  -- We use a direct query with SECURITY DEFINER to bypass RLS temporarily
  RETURN EXISTS (
    SELECT 1 
    FROM user_profiles 
    WHERE id = auth.uid()::text 
    AND role = 'admin'
  );
EXCEPTION
  WHEN OTHERS THEN
    -- If any error occurs (like user doesn't exist), return false
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure RLS is enabled on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own profile OR admins can view all profiles
CREATE POLICY "Users can view own profile or admins view all"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid()::text = id OR is_admin()
  );

-- Policy 2: Users can insert their own profile only
CREATE POLICY "Users can create their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id);

-- Policy 3: Users can update their own profile OR admins can update any profile
CREATE POLICY "Users can update own profile or admins update any"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid()::text = id OR is_admin()
  )
  WITH CHECK (
    auth.uid()::text = id OR is_admin()
  );

-- Policy 4: Users can delete their own profile OR admins can delete any profile
CREATE POLICY "Users can delete own profile or admins delete any"
  ON user_profiles
  FOR DELETE
  TO authenticated
  USING (
    auth.uid()::text = id OR is_admin()
  );

-- Grant execute permission on the helper function to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;