import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { DataService } from '../../services/dataService';
import { LegalResource } from '../../config/supabase';
import { Plus, Edit, Trash2, Loader2, XCircle, CheckCircle, Gavel, Search, ExternalLink } from 'lucide-react';

const LegalResourceManagement: React.FC = () => {
  const [resources, setResources] = useState<LegalResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentResource, setCurrentResource] = useState<Partial<LegalResource> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredResources, setFilteredResources] = useState<LegalResource[]>([]);
  
  // Raw string states for comma-separated inputs
  const [tagsInput, setTagsInput] = useState('');
  const [relevantCoursesInput, setRelevantCoursesInput] = useState('');

  const resourceTypes: LegalResource['type'][] = ['case', 'statute', 'regulation', 'journal', 'textbook', 'article'];
  const jurisdictions = ['Ghana', 'International', 'Other']; // Example jurisdictions
  const categories = [ // Example categories, expand as needed
    'Constitutional Law', 'Criminal Law', 'Contract Law', 'Company Law',
    'Environmental Law', 'Family Law', 'Human Rights', 'Intellectual Property',
    'IT Law', 'Labour Law', 'Land Law', 'Media Law', 'Medical Law',
    'Natural Resources Law', 'Tax Law', 'General Law'
  ];

  useEffect(() => {
    loadResources();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = resources.filter(resource =>
      resource.title.toLowerCase().includes(lowercasedQuery) ||
      resource.summary.toLowerCase().includes(lowercasedQuery) ||
      resource.category.toLowerCase().includes(lowercasedQuery) ||
      resource.type.toLowerCase().includes(lowercasedQuery) ||
      resource.jurisdiction.toLowerCase().includes(lowercasedQuery) ||
      resource.year.toString().includes(lowercasedQuery)
    );
    setFilteredResources(filtered);
  }, [searchQuery, resources]);

  const loadResources = async () => {
    setLoading(true);
    setError(null);
    const result = await DataService.getLegalResources();
    if (result.success && result.data) {
      setResources(result.data);
    } else {
      setError(result.error || 'Failed to load legal resources.');
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentResource(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
  };

  const handleRelevantCoursesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRelevantCoursesInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!currentResource?.title || !currentResource?.type || !currentResource?.category || !currentResource?.jurisdiction || !currentResource?.year || !currentResource?.summary) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    let result;
    if (isEditing && currentResource?.id) {
      const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t);
      const relevantCoursesArray = relevantCoursesInput.split(',').map(c => c.trim()).filter(c => c);
      const resourceToUpdate = {
        ...currentResource,
        tags: tagsArray,
        relevant_courses: relevantCoursesArray
      };
      result = await DataService.updateLegalResource(currentResource.id, resourceToUpdate);
      if (result.success) {
        setSuccessMessage('Legal resource updated successfully!');
      } else {
        setError(result.error || 'Failed to update legal resource.');
      }
    } else {
      const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t);
      const relevantCoursesArray = relevantCoursesInput.split(',').map(c => c.trim()).filter(c => c);
      const resourceToAdd = {
        ...currentResource,
        tags: tagsArray,
        relevant_courses: relevantCoursesArray
      } as Omit<LegalResource, 'id' | 'created_at' | 'updated_at'>;
      result = await DataService.addLegalResource(resourceToAdd);
      if (result.success) {
        setSuccessMessage('Legal resource added successfully!');
      } else {
        setError(result.error || 'Failed to add legal resource.');
      }
    }

    setLoading(false);
    if (result.success) {
      setCurrentResource(null);
      setTagsInput('');
      setRelevantCoursesInput('');
      setIsEditing(false);
      loadResources();
    }
  };

  const handleEdit = (resource: LegalResource) => {
    setCurrentResource({ ...resource });
    setTagsInput(resource.tags?.join(', ') || '');
    setRelevantCoursesInput(resource.relevant_courses?.join(', ') || '');
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this legal resource?')) {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      const result = await DataService.deleteLegalResource(id);
      if (result.success) {
        setSuccessMessage('Legal resource deleted successfully!');
        loadResources();
      } else {
        setError(result.error || 'Failed to delete legal resource.');
      }
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentResource(null);
    setTagsInput('');
    setRelevantCoursesInput('');
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <Gavel className="inline-block w-8 h-8 mr-2 text-primary-600" />
            Legal Resource Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage legal cases, statutes, regulations, journals, textbooks, and articles.
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
            {isEditing ? 'Edit Legal Resource' : 'Add New Legal Resource'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Title"
              name="title"
              value={currentResource?.title || ''}
              onChange={handleInputChange}
              placeholder="e.g., New Patriotic Party v. Attorney-General"
              required
            />
            <div>
              <label className="form-label">Type</label>
              <select
                name="type"
                value={currentResource?.type || ''}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select Type</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type} className="capitalize">{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={currentResource?.category || ''}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Jurisdiction</label>
                <select
                  name="jurisdiction"
                  value={currentResource?.jurisdiction || ''}
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
              <Input
                label="Year"
                name="year"
                type="number"
                value={currentResource?.year || ''}
                onChange={handleInputChange}
                placeholder="e.g., 2023"
                required
              />
            </div>
            <Input
              label="Citation (Optional)"
              name="citation"
              value={currentResource?.citation || ''}
              onChange={handleInputChange}
              placeholder="e.g., [2012] 2 SCGLR 676"
            />
            <Input
              label="Summary"
              name="summary"
              value={currentResource?.summary || ''}
              onChange={handleInputChange}
              placeholder="Brief summary of the resource"
              textarea
              required
            />
            <Input
              label="URL (Optional)"
              name="url"
              value={currentResource?.url || ''}
              onChange={handleInputChange}
              placeholder="Link to external resource"
            />
            <Input
              label="Tags (comma-separated)"
              name="tags"
              value={tagsInput}
              onChange={handleTagsChange}
              placeholder="e.g., constitutional law, elections"
            />
            <Input
              label="Relevant Courses (comma-separated codes)"
              name="relevant_courses"
              value={relevantCoursesInput}
              onChange={handleRelevantCoursesChange}
              placeholder="e.g., LAW 301, LAW 403"
            />
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
              All Legal Resources
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

          {loading && !resources.length ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
              <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No legal resources found.
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
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Year
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredResources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {resource.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                        {resource.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {resource.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {resource.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {resource.url && (
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="inline-block mr-2">
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(resource)} className="mr-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(resource.id)}>
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

export default LegalResourceManagement;