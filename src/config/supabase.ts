import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication and storage handled entirely by Supabase
export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
};

// Database types
export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string;
  level: number;
  semester: number;
  credits: number;
  category: 'core' | 'elective' | 'practical';
  prerequisites?: string[];
  created_at: string;
  updated_at: string;
}

export interface LegalResource {
  id: string;
  title: string;
  type: 'case' | 'statute' | 'regulation' | 'journal' | 'textbook' | 'article';
  category: string;
  jurisdiction: string;
  year: number;
  citation?: string;
  summary: string;
  url?: string;
  tags: string[];
  relevant_courses: string[];
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  name: string;
  path: string;
  year: string;
  format: string;
  size: number;
  mimetype: string;
  category?: string;
  description?: string;
  file_path: string;
  url: string;
  public_url?: string;
  original_filename?: string;
  uploaded_by?: string;
  created_at: string;
  updated_at: string;
  course_codes?: string[];
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  role?: 'student' | 'faculty' | 'admin';
  created_at: string;
  updated_at: string;
}

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { count, error } = await supabase
      .from('documents')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return { 
      success: true, 
      message: 'Successfully connected to Supabase',
      data: { count } 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection failed',
      data: null 
    };
  }
};