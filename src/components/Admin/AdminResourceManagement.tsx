import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { DocumentService } from '../../services/documentService';
import { DataService } from '../../services/dataService';
import { Document, LegalResource, Course } from '../../config/supabase';
import { Plus, Edit, Trash2, Loader2, XCircle, CheckCircle, FileText, Search, Download, Eye, Upload, Link as LinkIcon } from 'lucide-react';
import { useAuthState } from '../../hooks/useAuthState';

// Combined resource type for unified display
interface CombinedResource {
  id: string;
  title: string;
  description?: string;
  year: string | number;
  type: 'document' | 'legal-resource';
  category?: string;
  url?: string;
  format?: string;
  size?: number;
  resourceType?: LegalResource['type'];
  jurisdiction?: string;
  citation?: string;
  tags?: string[];
  course_codes?: string[];
  relevant_courses?: string[];
  created_at: string;
  original: Document | LegalResource;
}

const AdminResourceManagement: React.FC = () => {
  const { user } = useAuthState();
  const [allResources, setAllResources] = useState<CombinedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState<CombinedResource[]>([]);
  
  // Form state
  const [resourceType, setResourceType] = useState<'file-upload' | 'external-legal'>('file-upload');
  const [formData, setFormData] = useState<any>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [courseCodesInput, setCourseCodesInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  
  // Dropdown options
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  
  // Static options
  const documentFormats = [
    { value: 'pdf', label: 'PDF' },
    { value: 'doc', label: 'DOC' },
    { value: 'docx', label: 'DOCX' },
    { value: 'txt', label: 'TXT' },
    { value: 'xls', label: 'XLS' },
    { value: 'xlsx', label: 'XLSX' },
    { value: 'ppt', label: 'PPT' },
    { value: 'pptx', label: 'PPTX' }
  ];
  
  const mimeTypes = [
    { value: 'application/pdf', label: 'application/pdf (PDF)' },
    { value: 'application/msword', label: 'application/msword (DOC)' },
    { value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', label: 'DOCX' },
    { value: 'text/plain', label: 'text/plain (TXT)' },
    { value: 'application/vnd.ms-excel', label: 'application/vnd.ms-excel (XLS)' },
    { value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', label: 'XLSX' },
    { value: 'application/vnd.ms-powerpoint', label: 'application/vnd.ms-powerpoint (PPT)' },
    { value: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', label: 'PPTX' }
  ];

  const legalResourceTypes: LegalResource['type'][] = ['case', 'statute', 'regulation', 'journal', 'textbook', 'article'];
  const jurisdictions = ['Ghana', 'International', 'Other'];
  const categories = [
    'Constitutional Law', 'Criminal Law', 'Contract Law', 'Company Law',
    'Environmental Law', 'Family Law', 'Human Rights', 'Intellectual Property',
    'IT Law', 'Labour Law', 'Land Law', 'Media Law', 'Medical Law',
    'Natural Resources Law', 'Tax Law', 'General Law'
  ];

  useEffect(() => {
    loadAllResources();
    loadDropdownOptions();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = allResources.filter(resource =>
      resource.title.toLowerCase().includes(lowercasedQuery) ||
      resource.description?.toLowerCase().includes(lowercasedQuery) ||
      resource.category?.toLowerCase().includes(lowercasedQuery) ||
      resource.year.toString().includes(lowercasedQuery)
    );
    setFilteredResources(filtered);
  }, [searchQuery, allResources]);

  const generateYears = (): string[] => {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];
    for (let year = currentYear; year >= 1960; year--) {
      years.push(year.toString());
    }
    return years;
  };

  const loadAllResources = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [documentsResult, legalResourcesResult] = await Promise.all([
        DocumentService.getDocuments(),
        DataService.getLegalResources()
      ]);

      const combinedResources: CombinedResource[] = [];

      // Add documents
      if (documentsResult.success && documentsResult.data) {
        documentsResult.data.forEach(doc => {
          combinedResources.push({
            id: doc.id,
            title: doc.title,
            description: doc.description,
            year: doc.year,
            type: 'document',
            category: doc.category,
            url: doc.public_url,
            format: doc.format,
            size: doc.size,
            course_codes: doc.course_codes,
            created_at: doc.created_at,
            original: doc
          });
        });
      }

      // Add legal resources
      if (legalResourcesResult.success && legalResourcesResult.data) {
        legalResourcesResult.data.forEach(resource => {
          combinedResources.push({
            id: resource.id,
            title: resource.title,
            description: resource.summary,
            year: resource.year,
            type: 'legal-resource',
            category: resource.category,
            url: resource.url,
            resourceType: resource.type,
            jurisdiction: resource.jurisdiction,
            citation: resource.citation,
            tags: resource.tags,
            relevant_courses: resource.relevant_courses,
            created_at: resource.created_at,
            original: resource
          });
        });
      }

      // Sort by created_at descending
      combinedResources.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setAllResources(combinedResources);
    } catch (error) {
      setError('Failed to load resources.');
    } finally {
      setLoading(false);
    }
  };

  const loadDropdownOptions = async () => {
    try {
      const coursesResult = await DataService.getCourses();
      if (coursesResult.success && coursesResult.data) {
        setAvailableCourses(coursesResult.data);
      }
      setAvailableYears(generateYears());
    } catch (error) {
      console.error('Error loading dropdown options:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: name === 'year' || name === 'size' ? (value ? parseInt(value) : 0) : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Auto-populate some fields from file
      setFormData((prev: any) => ({
        ...prev,
        name: file.name,
        format: file.name.split('.').pop()?.toLowerCase() || '',
        mimetype: file.type,
        size: file.size
      }));
    }
  };

  const handleCourseCodesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCourseCodesInput(e.target.value);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!user?.id) {
      setError('User not authenticated. Please log in.');
      setLoading(false);
      return;
    }

    if (!formData.title || !formData.year) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      let result;
      const courseCodesArray = courseCodesInput.split(',').map(c => c.trim()).filter(c => c);
      const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t);

      if (isEditing) {
        // Handle editing
        const resource = allResources.find(r => r.id === formData.id);
        if (!resource) {
          setError('Resource not found.');
          setLoading(false);
          return;
        }

        if (resource.type === 'document') {
          result = await DocumentService.updateDocument(resource.id, {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            course_codes: courseCodesArray
          });
        } else {
          result = await DataService.updateLegalResource(resource.id, {
            title: formData.title,
            summary: formData.description,
            category: formData.category,
            citation: formData.citation,
            url: formData.url,
            tags: tagsArray,
            relevant_courses: courseCodesArray
          });
        }
      } else {
        // Handle adding new resource
        if (resourceType === 'file-upload') {
          if (!selectedFile) {
            setError('Please select a file to upload.');
            setLoading(false);
            return;
          }

          result = await DocumentService.uploadDocument(
            selectedFile,
            {
              title: formData.title,
              year: formData.year.toString(),
              format: formData.format || selectedFile.name.split('.').pop()?.toLowerCase() || '',
              description: formData.description,
              category: formData.category
            },
            user.id,
            courseCodesArray
          );
        } else {
          // External legal resource
          if (!formData.url || !formData.resourceType || !formData.jurisdiction) {
            setError('Please fill in all required fields for legal resource.');
            setLoading(false);
            return;
          }

          result = await DataService.addLegalResource({
            title: formData.title,
            type: formData.resourceType,
            category: formData.category || 'General Law',
            jurisdiction: formData.jurisdiction,
            year: formData.year,
            citation: formData.citation,
            summary: formData.description || '',
            url: formData.url,
            tags: tagsArray,
            relevant_courses: courseCodesArray
          });
        }
      }

      if (result.success) {
        setSuccessMessage(isEditing ? 'Resource updated successfully!' : 'Resource added successfully!');
        resetForm();
        loadAllResources();
      } else {
        setError(result.error || 'Failed to save resource.');
      }
    } catch (error) {
      setError('An error occurred while saving the resource.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (resource: CombinedResource) => {
    setIsEditing(true);
    setResourceType(resource.type === 'document' ? 'file-upload' : 'external-legal');
    
    if (resource.type === 'document') {
      setFormData({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        category: resource.category,
        year: resource.year,
        format: resource.format,
        size: resource.size
      });
      setCourseCodesInput(resource.course_codes?.join(', ') || '');
    } else {
      setFormData({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        category: resource.category,
        year: resource.year,
        resourceType: resource.resourceType,
        jurisdiction: resource.jurisdiction,
        citation: resource.citation,
        url: resource.url
      });
      setCourseCodesInput(resource.relevant_courses?.join(', ') || '');
      setTagsInput(resource.tags?.join(', ') || '');
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (resource: CombinedResource) => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      let result;
      if (resource.type === 'document') {
        const doc = resource.original as Document;
        result = await DocumentService.deleteDocument(doc.id, doc.file_path);
      } else {
        result = await DataService.deleteLegalResource(resource.id);
      }
      
      if (result.success) {
        setSuccessMessage('Resource deleted successfully!');
        loadAllResources();
      } else {
        setError(result.error || 'Failed to delete resource.');
      }
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({});
    setSelectedFile(null);
    setCourseCodesInput('');
    setTagsInput('');
    setIsEditing(false);
    setResourceType('file-upload');
  };

  const handleCancelEdit = () => {
    resetForm();
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <FileText className="inline-block w-8 h-8 mr-2 text-primary-600" />
            Resource Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload documents and manage legal resources for all courses.
          </p>
        </div>

        {error && (
          <Card className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 flex items-center space-x-2">
            <XCircle className="w-5 h-5" />
            <span>{error}</span>
          </Card>
        )}
        {successMessage && (
          <Card className="p-4 mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{successMessage}</span>
          </Card>
        )}

        {/* Resource Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {isEditing ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          
          {!isEditing && (
            <div className="mb-6">
              <label className="form-label">Resource Type</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file-upload"
                    checked={resourceType === 'file-upload'}
                    onChange={(e) => setResourceType(e.target.value as 'file-upload' | 'external-legal')}
                    className="mr-2"
                  />
                  <Upload className="w-4 h-4 mr-1" />
                  File Upload
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="external-legal"
                    checked={resourceType === 'external-legal'}
                    onChange={(e) => setResourceType(e.target.value as 'file-upload' | 'external-legal')}
                    className="mr-2"
                  />
                  <LinkIcon className="w-4 h-4 mr-1" />
                  External Legal Resource
                </label>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={formData.title || ''}
              onChange={handleInputChange}
              placeholder="e.g., Constitutional Law Case Brief"
              required
            />

            <Input
              label="Description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Brief summary or notes about the resource"
              textarea
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Year</label>
                <select
                  name="year"
                  value={formData.year || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Year</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category || ''}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Course Association */}
            <div>
              <label className="form-label">Associated Courses (comma-separated codes)</label>
              <Input
                name="course_codes"
                value={courseCodesInput}
                onChange={handleCourseCodesChange}
                placeholder="e.g., LAW 101, LAW 203"
                helper="Enter course codes separated by commas"
              />
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Available courses: {availableCourses.map(c => c.code).join(', ')}
              </div>
            </div>

            {/* Conditional Fields Based on Resource Type */}
            {resourceType === 'file-upload' && !isEditing && (
              <div>
                <label className="form-label">File Upload</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-input"
                  accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
                  required
                />
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Selected: {selectedFile.name} ({DocumentService.formatFileSize(selectedFile.size)})
                  </div>
                )}
              </div>
            )}

            {resourceType === 'external-legal' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Resource Type</label>
                    <select
                      name="resourceType"
                      value={formData.resourceType || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Type</option>
                      {legalResourceTypes.map(type => (
                        <option key={type} value={type} className="capitalize">{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Jurisdiction</label>
                    <select
                      name="jurisdiction"
                      value={formData.jurisdiction || ''}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Jurisdiction</option>
                      {jurisdictions.map(jurisdiction => (
                        <option key={jurisdiction} value={jurisdiction}>{jurisdiction}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Input
                  label="URL"
                  name="url"
                  value={formData.url || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/resource"
                  required
                />

                <Input
                  label="Citation (Optional)"
                  name="citation"
                  value={formData.citation || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., [2012] 2 SCGLR 676"
                />

                <Input
                  label="Tags (comma-separated)"
                  name="tags"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="e.g., constitutional law, elections"
                />
              </>
            )}

            <div className="flex space-x-2">
              <Button type="submit" loading={loading}>
                {isEditing ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" /> Update Resource
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Add Resource
                  </>
                )}
              </Button>
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>

        {/* Resource List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Resources
            </h2>
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading && !allResources.length ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
              <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No resources found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredResources.map((resource) => (
                    <tr key={`${resource.type}-${resource.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {resource.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                        {resource.type === 'document' ? resource.format : resource.resourceType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {resource.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {resource.category || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {resource.url && (
                          <Button variant="ghost" size="sm" onClick={() => window.open(resource.url, '_blank')} className="mr-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        {resource.type === 'document' && (
                          <Button variant="ghost" size="sm" onClick={() => DocumentService.downloadDocument(resource.original as Document)} className="mr-2">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(resource)} className="mr-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(resource)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminResourceManagement;