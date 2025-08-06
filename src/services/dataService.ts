import { supabase } from '../config/supabase';
import type { Course, LegalResource } from '../config/supabase';

export class DataService {
  // Course-related methods
  static async getCourses(): Promise<{ success: boolean; data?: Course[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('level', { ascending: true })
        .order('semester', { ascending: true })
        .order('code', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch courses' 
      };
    }
  }

  static async getCourseById(id: string): Promise<{ success: boolean; data?: Course; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch course' 
      };
    }
  }

  static async getCourseByCode(code: string): Promise<{ success: boolean; data?: Course; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('code', code)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch course' 
      };
    }
  }

  static async getCoursesByLevel(level: number): Promise<{ success: boolean; data?: Course[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('level', level)
        .order('semester', { ascending: true })
        .order('code', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch courses by level' 
      };
    }
  }

  static async getCoursesByCategory(category: Course['category']): Promise<{ success: boolean; data?: Course[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('category', category)
        .order('level', { ascending: true })
        .order('code', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch courses by category' 
      };
    }
  }

  static async searchCourses(query: string): Promise<{ success: boolean; data?: Course[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(`title.ilike.%${query}%,code.ilike.%${query}%,description.ilike.%${query}%`)
        .order('level', { ascending: true })
        .order('code', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to search courses' 
      };
    }
  }

  // New: Add a course
  static async addCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: Course; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(courseData)
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add course' };
    }
  }

  // New: Update a course
  static async updateCourse(id: string, courseData: Partial<Omit<Course, 'id' | 'created_at' | 'updated_at'>>): Promise<{ success: boolean; data?: Course; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update course' };
    }
  }

  // New: Delete a course
  static async deleteCourse(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete course' };
    }
  }

  // Legal Resource methods
  static async getLegalResources(): Promise<{ success: boolean; data?: LegalResource[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('legal_resources')
        .select('*')
        .order('year', { ascending: false })
        .order('title', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch legal resources' 
      };
    }
  }

  static async getLegalResourceById(id: string): Promise<{ success: boolean; data?: LegalResource; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('legal_resources')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch legal resource' 
      };
    }
  }

  static async getLegalResourcesByType(type: LegalResource['type']): Promise<{ success: boolean; data?: LegalResource[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('legal_resources')
        .select('*')
        .eq('type', type)
        .order('year', { ascending: false })
        .order('title', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch legal resources by type' 
      };
    }
  }

  static async getLegalResourcesByCategory(category: string): Promise<{ success: boolean; data?: LegalResource[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('legal_resources')
        .select('*')
        .eq('category', category)
        .order('year', { ascending: false })
        .order('title', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch legal resources by category' 
      };
    }
  }

  static async getLegalResourcesByCourse(courseCode: string): Promise<{ success: boolean; data?: LegalResource[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('legal_resources')
        .select('*')
        .contains('relevant_courses', [courseCode])
        .order('year', { ascending: false })
        .order('title', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch legal resources by course' 
      };
    }
  }

  static async searchLegalResources(query: string): Promise<{ success: boolean; data?: LegalResource[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('legal_resources')
        .select('*')
        .or(`title.ilike.%${query}%,category.ilike.%${query}%,summary.ilike.%${query}%`)
        .order('year', { ascending: false })
        .order('title', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to search legal resources' 
      };
    }
  }

  // New: Add a legal resource
  static async addLegalResource(resourceData: Omit<LegalResource, 'id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data?: LegalResource; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('legal_resources')
        .insert(resourceData)
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add legal resource' };
    }
  }

  // New: Update a legal resource
  static async updateLegalResource(id: string, resourceData: Partial<Omit<LegalResource, 'id' | 'created_at' | 'updated_at'>>): Promise<{ success: boolean; data?: LegalResource; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('legal_resources')
        .update(resourceData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update legal resource' };
    }
  }

  // New: Delete a legal resource
  static async deleteLegalResource(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('legal_resources')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete legal resource' };
    }
  }

  // Statistics and utility methods
  static async getCourseStats(): Promise<{
    success: boolean;
    data?: {
      total: number;
      byLevel: Record<number, number>;
      byCategory: Record<string, number>;
    };
    error?: string;
  }> {
    try {
      const { data: courses, error } = await supabase
        .from('courses')
        .select('level, category');

      if (error) {
        return { success: false, error: error.message };
      }

      const stats = {
        total: courses?.length || 0,
        byLevel: {} as Record<number, number>,
        byCategory: {} as Record<string, number>
      };

      courses?.forEach(course => {
        stats.byLevel[course.level] = (stats.byLevel[course.level] || 0) + 1;
        stats.byCategory[course.category] = (stats.byCategory[course.category] || 0) + 1;
      });

      return { success: true, data: stats };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get course statistics' 
      };
    }
  }

  static async getLegalResourceStats(): Promise<{
    success: boolean;
    data?: {
      total: number;
      byType: Record<string, number>;
      byCategory: Record<string, number>;
      byYear: Record<number, number>;
    };
    error?: string;
  }> {
    try {
      const { data: resources, error } = await supabase
        .from('legal_resources')
        .select('type, category, year');

      if (error) {
        return { success: false, error: error.message };
      }

      const stats = {
        total: resources?.length || 0,
        byType: {} as Record<string, number>,
        byCategory: {} as Record<string, number>,
        byYear: {} as Record<number, number>
      };

      resources?.forEach(resource => {
        stats.byType[resource.type] = (stats.byType[resource.type] || 0) + 1;
        stats.byCategory[resource.category] = (stats.byCategory[resource.category] || 0) + 1;
        stats.byYear[resource.year] = (stats.byYear[resource.year] || 0) + 1;
      });

      return { success: true, data: stats };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get legal resource statistics' 
      };
    }
  }
}