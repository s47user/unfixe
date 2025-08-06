/*
  # Update RLS policies for documents table

  1. Security Changes
    - Update RLS policies to allow demo uploads
    - Maintain security while allowing development testing
    - Add policy for demo user uploads

  2. Changes
    - Modify insert policy to allow demo user
    - Update other policies to handle demo scenarios
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can insert documents" ON documents;
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;

-- Create new policies that handle both authenticated and demo users
CREATE POLICY "Users can insert documents"
  ON documents
  FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid()::text = uploaded_by) OR
    (uploaded_by = 'demo-user-id')
  );

CREATE POLICY "Users can update their own documents"
  ON documents
  FOR UPDATE
  TO authenticated, anon
  USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = uploaded_by) OR
    (uploaded_by = 'demo-user-id')
  )
  WITH CHECK (
    (auth.uid() IS NOT NULL AND auth.uid()::text = uploaded_by) OR
    (uploaded_by = 'demo-user-id')
  );

CREATE POLICY "Users can delete their own documents"
  ON documents
  FOR DELETE
  TO authenticated, anon
  USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = uploaded_by) OR
    (uploaded_by = 'demo-user-id')
  );