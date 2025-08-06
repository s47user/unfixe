/*
  # Create documents table

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `name` (text, required)
      - `path` (text, required)
      - `year` (text, required)
      - `format` (text, required)
      - `size` (bigint, required)
      - `mimetype` (text, required)
      - `category` (text, optional)
      - `description` (text, optional)
      - `file_path` (text, required)
      - `url` (text, required)
      - `public_url` (text, optional)
      - `original_filename` (text, optional)
      - `uploaded_by` (text, optional)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `documents` table
    - Add policy for authenticated users to read documents
    - Add policy for authenticated users to insert their own documents
    - Add policy for authenticated users to update their own documents
    - Add policy for authenticated users to delete their own documents
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  name text NOT NULL,
  path text NOT NULL,
  year text NOT NULL,
  format text NOT NULL,
  size bigint NOT NULL,
  mimetype text NOT NULL,
  category text,
  description text,
  file_path text NOT NULL,
  url text NOT NULL,
  public_url text,
  original_filename text,
  uploaded_by text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents table
CREATE POLICY "Anyone can read documents"
  ON documents
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert documents"
  ON documents
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = uploaded_by);

CREATE POLICY "Users can update their own documents"
  ON documents
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = uploaded_by)
  WITH CHECK (auth.uid()::text = uploaded_by);

CREATE POLICY "Users can delete their own documents"
  ON documents
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = uploaded_by);

-- Create an index on created_at for better performance when ordering
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);

-- Create an index on uploaded_by for better performance when filtering by user
CREATE INDEX IF NOT EXISTS documents_uploaded_by_idx ON documents(uploaded_by);

-- Create an index on category for better performance when filtering by category
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category);