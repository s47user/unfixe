/*
  # Create user_profiles table with TEXT id for Firebase UIDs

  1. New Tables
    - `user_profiles`
      - `id` (text, primary key) - stores Firebase UID
      - `email` (text, unique, required)
      - `full_name` (text, optional)
      - `avatar_url` (text, optional)
      - `role` (text, required, default 'student', check constraint)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for users to manage their own profiles
    - Add policies for admins to view/update all profiles
*/

-- Create user_profiles table with TEXT id to store Firebase UIDs
CREATE TABLE IF NOT EXISTS user_profiles (
  id text PRIMARY KEY, -- Firebase UID as text, not UUID
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  role text NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'faculty', 'admin')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for user_profiles table
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

CREATE POLICY "Admins can view all user profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) = 'admin');

CREATE POLICY "Admins can update any user profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) = 'admin');

-- Create index on role for faster lookups
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role);

-- Update RLS Policies for documents table to use text comparison
-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;

-- Re-create policies with proper text-based checks
CREATE POLICY "Users can insert documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.uid()::text = uploaded_by AND (SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('student', 'faculty', 'admin')) OR
    ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'))
  );

CREATE POLICY "Users can update their own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (
    (auth.uid()::text = uploaded_by AND (SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('student', 'faculty', 'admin')) OR
    ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'))
  )
  WITH CHECK (
    (auth.uid()::text = uploaded_by AND (SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('student', 'faculty', 'admin')) OR
    ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'))
  );

CREATE POLICY "Users can delete their own documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (
    (auth.uid()::text = uploaded_by AND (SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('student', 'faculty', 'admin')) OR
    ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'))
  );

-- Update RLS Policies for courses table
DROP POLICY IF EXISTS "Authenticated users can insert courses" ON courses;
DROP POLICY IF EXISTS "Authenticated users can update courses" ON courses;
DROP POLICY IF EXISTS "Authenticated users can delete courses" ON courses;

CREATE POLICY "Admins and faculty can insert courses"
  ON courses
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'));

CREATE POLICY "Admins and faculty can update courses"
  ON courses
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'))
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'));

CREATE POLICY "Admins and faculty can delete courses"
  ON courses
  FOR DELETE
  TO authenticated
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'));

-- Update RLS Policies for legal_resources table
DROP POLICY IF EXISTS "Authenticated users can insert legal resources" ON legal_resources;
DROP POLICY IF EXISTS "Authenticated users can update legal resources" ON legal_resources;
DROP POLICY IF EXISTS "Authenticated users can delete legal resources" ON legal_resources;

CREATE POLICY "Admins and faculty can insert legal resources"
  ON legal_resources
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'));

CREATE POLICY "Admins and faculty can update legal resources"
  ON legal_resources
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'))
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'));

CREATE POLICY "Admins and faculty can delete legal resources"
  ON legal_resources
  FOR DELETE
  TO authenticated
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()::text) IN ('admin', 'faculty'));