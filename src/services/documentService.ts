import { supabase } from '../config/supabase';
import type { Document } from '../config/supabase';

export class DocumentService {
  // Get all documents from storage bucket
  static async getDocuments(): Promise<{ success: boolean; data?: Document[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch documents' 
      };
    }
  }

  // Get documents by year
  static async getDocumentsByYear(year: string): Promise<{ success: boolean; data?: Document[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('year', year)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch documents' 
      };
    }
  }

  // Search documents
  static async searchDocuments(query: string): Promise<{ success: boolean; data?: Document[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .or(`title.ilike.%${query}%,name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to search documents' 
      };
    }
  }

  // Get documents by category
  static async getDocumentsByCategory(category: string): Promise<{ success: boolean; data?: Document[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch documents by category' 
      };
    }
  }

  // Get documents by course
  static async getDocumentsByCourse(courseCode: string): Promise<{ success: boolean; data?: Document[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .contains('course_codes', [courseCode])
        .order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch documents by course' 
      };
    }
  }

  // Get document by ID
  static async getDocumentById(id: string): Promise<{ success: boolean; data?: Document; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
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
        error: error instanceof Error ? error.message : 'Failed to fetch document' 
      };
    }
  }

  // Get recent documents
  static async getRecentDocuments(limit: number = 10): Promise<{ success: boolean; data?: Document[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch recent documents' 
      };
    }
  }

  // Get popular documents (most viewed/downloaded)
  static async getPopularDocuments(limit: number = 10): Promise<{ success: boolean; data?: Document[]; error?: string }> {
    try {
      // For now, we'll return recent documents as popular
      // In the future, you could add view/download tracking
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: data || [] };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch popular documents' 
      };
    }
  }

  // Upload a document file to Supabase Storage and add record to Supabase
  static async uploadDocument(file: File, documentData: Omit<Document, 'id' | 'created_at' | 'updated_at' | 'url' | 'public_url' | 'file_path'>, userId: string, courseCodes?: string[]): Promise<{ success: boolean; data?: Document; error?: string }> {
    try {
      const filePath = `documents/${documentData.year}/${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      const { data: publicUrlResponse } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);
      
      const publicUrl = publicUrlResponse.publicUrl;

      const newDocument: Omit<Document, 'id' | 'created_at' | 'updated_at'> = {
        ...documentData,
        name: file.name,
        path: filePath,
        size: file.size,
        mimetype: file.type,
        url: publicUrl, // Supabase Storage URL
        public_url: publicUrl, // Same as URL for Supabase
        file_path: filePath, // Path in storage
        uploaded_by: userId,
        course_codes: courseCodes || [],
      };

      const { data, error } = await supabase
        .from('documents')
        .insert(newDocument)
        .select('*')
        .single();

      if (error) {
        // If Supabase insert fails, try to delete the uploaded file from Supabase Storage
        await supabase.storage
          .from('documents')
          .remove([filePath]);
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to upload document' };
    }
  }

  // Add a document from URL (for admin panel)
  static async addDocumentFromUrl(
    documentData: {
      title: string;
      name: string;
      url: string;
      format: string;
      size: number;
      mimetype: string;
      year: string;
      category?: string;
      description?: string;
      course_codes?: string[];
    },
    userId: string
  ): Promise<{ success: boolean; data?: Document; error?: string }> {
    try {
      const newDocument: Omit<Document, 'id' | 'created_at' | 'updated_at'> = {
        title: documentData.title,
        name: documentData.name,
        path: documentData.url, // Use URL as path for external resources
        year: documentData.year,
        format: documentData.format,
        size: documentData.size,
        mimetype: documentData.mimetype,
        category: documentData.category || null,
        description: documentData.description || null,
        file_path: documentData.url, // Use URL as file_path for external resources
        url: documentData.url,
        public_url: documentData.url, // Same as URL for external resources
        original_filename: documentData.name,
        uploaded_by: userId,
        course_codes: documentData.course_codes || [],
      };

      const { data, error } = await supabase
        .from('documents')
        .insert(newDocument)
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to add document from URL' };
    }
  }

  // Update a document record in Supabase (does not handle file changes)
  static async updateDocument(id: string, documentData: Partial<Omit<Document, 'id' | 'created_at' | 'updated_at' | 'url' | 'public_url' | 'file_path'>>): Promise<{ success: boolean; data?: Document; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .update(documentData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to update document' };
    }
  }

  // Delete a document record from Supabase and its file from Supabase Storage
  static async deleteDocument(id: string, filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      // First, delete from Supabase
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (dbError) {
        return { success: false, error: dbError.message };
      }

      // Only attempt to delete from storage if it's a storage path (not a URL)
      if (filePath.startsWith('documents/')) {
        const { error: storageError } = await supabase.storage
          .from('documents')
          .remove([filePath]);
        
        if (storageError) {
          console.warn('Failed to delete file from storage:', storageError);
        }
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Failed to delete document' };
    }
  }

  // Format file size for display
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Extract year from filename (helper function)
  static extractYearFromFilename(filename: string): string {
    const yearMatch = filename.match(/(\d{4})/);
    return yearMatch ? yearMatch[1] : new Date().getFullYear().toString();
  }

  // Get document statistics
  static async getDocumentStats(): Promise<{
    success: boolean;
    data?: {
      total: number;
      byYear: Record<string, number>;
      byFormat: Record<string, number>;
      byCategory: Record<string, number>;
      totalSize: number;
    };
    error?: string;
  }> {
    try {
      const { data: documents, error } = await supabase
        .from('documents')
        .select('year, format, size, category');

      if (error) {
        return { success: false, error: error.message };
      }

      const stats = {
        total: documents?.length || 0,
        byYear: {} as Record<string, number>,
        byFormat: {} as Record<string, number>,
        byCategory: {} as Record<string, number>,
        totalSize: 0
      };

      documents?.forEach(doc => {
        // Count by year
        stats.byYear[doc.year] = (stats.byYear[doc.year] || 0) + 1;
        
        // Count by format
        stats.byFormat[doc.format] = (stats.byFormat[doc.format] || 0) + 1;
        
        // Count by category
        if (doc.category) {
          stats.byCategory[doc.category] = (stats.byCategory[doc.category] || 0) + 1;
        }
        
        // Total size
        stats.totalSize += doc.size || 0;
      });

      return { success: true, data: stats };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get statistics' 
      };
    }
  }

  // Get available years
  static async getAvailableYears(): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('year')
        .order('year', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      const years = [...new Set(data?.map(doc => doc.year) || [])];
      return { success: true, data: years };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get available years' 
      };
    }
  }

  // Get available categories
  static async getAvailableCategories(): Promise<{ success: boolean; data?: string[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('category')
        .not('category', 'is', null)
        .order('category', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      const categories = [...new Set(data?.map(doc => doc.category).filter(Boolean) || [])];
      return { success: true, data: categories };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get available categories' 
      };
    }
  }

  // Download document (track downloads if needed)
  static async downloadDocument(document: Document): Promise<void> {
    if (document.public_url) {
      // Open in new tab for download
      window.open(document.public_url, '_blank');
      
      // Here you could add download tracking logic
      // await this.trackDownload(document.id);
    }
  }

  // View document (track views if needed)
  static async viewDocument(document: Document): Promise<void> {
    if (document.public_url) {
      // Open in new tab for viewing
      window.open(document.public_url, '_blank');
      
      // Here you could add view tracking logic
      // await this.trackView(document.id);
    }
  }

  // Get file type icon
  static getFileTypeIcon(format: string): string {
    switch (format.toLowerCase()) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'txt':
        return '📃';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'ppt':
      case 'pptx':
        return '📽️';
      default:
        return '📄';
    }
  }

  // Check if file is viewable in browser
  static isViewableInBrowser(format: string): boolean {
    const viewableFormats = ['pdf', 'txt', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    return viewableFormats.includes(format.toLowerCase());
  }

  // Check if file needs Google Docs Viewer
  static needsGoogleDocsViewer(format: string): boolean {
    const googleDocsFormats = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
    return googleDocsFormats.includes(format.toLowerCase());
  }

  // Get viewer URL for document
  static getViewerUrl(document: Document): string {
    if (!document.public_url) return '';
    
    const format = document.format.toLowerCase();
    
    // Use Google Docs Viewer for Office documents
    if (this.needsGoogleDocsViewer(format)) {
      return `https://docs.google.com/viewer?url=${encodeURIComponent(document.public_url)}&embedded=true`;
    }
    
    // Use direct URL for PDFs and text files
    if (format === 'pdf') {
      return `${document.public_url}#toolbar=0&navpanes=0&scrollbar=1`;
    }
    
    // Default to direct URL
    return document.public_url;
  }

  // Validate if URL is reachable (basic validation)
  static async validateDocumentUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.warn('Document URL validation failed:', error);
      return false;
    }
  }
}