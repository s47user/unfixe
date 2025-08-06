import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  ExternalLink,
  FileText,
  Scale,
  Gavel,
  Users,
  Calendar,
  Download,
  Eye,
  Star,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { DataService } from '../services/dataService';
import { DocumentService } from '../services/documentService';
import type { LegalResource, Document } from '../config/supabase';

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

const ResourcesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [allResources, setAllResources] = useState<CombinedResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<CombinedResource[]>([]);
  const [displayedResources, setDisplayedResources] = useState<CombinedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [itemsPerPage] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    loadAllResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [allResources, searchQuery, selectedType, selectedCategory, selectedYear]);

  useEffect(() => {
    updateDisplayedResources();
  }, [filteredResources, currentPage]);

  const loadAllResources = async () => {
    setLoading(true);
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

      // Extract unique years and categories for filters
      const years = [...new Set(combinedResources.map(r => r.year.toString()))].sort((a, b) => b.localeCompare(a));
      const categories = [...new Set(combinedResources.map(r => r.category).filter(Boolean))].sort();
      
      setAvailableYears(years);
      setAvailableCategories(categories);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = allResources;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query) ||
        resource.category?.toLowerCase().includes(query) ||
        resource.tags?.some(tag => tag.toLowerCase().includes(query)) ||
        resource.course_codes?.some(code => code.toLowerCase().includes(query)) ||
        resource.relevant_courses?.some(course => course.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (selectedType) {
      if (selectedType === 'document') {
        filtered = filtered.filter(resource => resource.type === 'document');
      } else if (selectedType === 'legal-resource') {
        filtered = filtered.filter(resource => resource.type === 'legal-resource');
      } else {
        // Filter by specific legal resource type
        filtered = filtered.filter(resource => 
          resource.type === 'legal-resource' && resource.resourceType === selectedType
        );
      }
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    // Year filter
    if (selectedYear) {
      filtered = filtered.filter(resource => resource.year.toString() === selectedYear);
    }

    setFilteredResources(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const updateDisplayedResources = () => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    setDisplayedResources(filteredResources.slice(startIndex, endIndex));
  };

  const loadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setLoadingMore(false);
    }, 500); // Small delay for better UX
  };

  const hasMoreItems = displayedResources.length < filteredResources.length;

  const resourceTypes = [
    { value: 'document', label: 'Documents', icon: FileText },
    { value: 'legal-resource', label: 'Legal Resources', icon: Scale },
    { value: 'case', label: 'Cases', icon: Gavel },
    { value: 'statute', label: 'Statutes', icon: Scale },
    { value: 'regulation', label: 'Regulations', icon: FileText },
    { value: 'journal', label: 'Journals', icon: BookOpen },
    { value: 'article', label: 'Articles', icon: FileText },
    { value: 'textbook', label: 'Textbooks', icon: BookOpen }
  ];

  const handleResourceAction = (resource: CombinedResource) => {
    if (resource.type === 'document') {
      const doc = resource.original as Document;
      DocumentService.viewDocument(doc);
    } else if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  const handleResourceDownload = (resource: CombinedResource) => {
    if (resource.type === 'document') {
      const doc = resource.original as Document;
      DocumentService.downloadDocument(doc);
    } else if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            All Resources
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Central hub for all documents, legal resources, and study materials
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search resources by title, description, course, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value || null)}
                className="form-input w-auto"
              >
                <option value="">All Types</option>
                {resourceTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>

              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="form-input w-auto"
              >
                <option value="">All Categories</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(e.target.value || null)}
                className="form-input w-auto"
              >
                <option value="">All Years</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              Showing {displayedResources.length} of {filteredResources.length} resources
            </span>
            {(searchQuery || selectedType || selectedCategory || selectedYear) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType(null);
                  setSelectedCategory(null);
                  setSelectedYear(null);
                }}
                className="text-primary-600 hover:text-primary-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <Card className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
            <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
          </Card>
        ) : displayedResources.length > 0 ? (
          <div className="space-y-6">
            {displayedResources.map((resource) => (
              <Card key={`${resource.type}-${resource.id}`} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {resource.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        resource.type === 'document'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          : resource.resourceType === 'case' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : resource.resourceType === 'statute'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                          : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                      }`}>
                        {resource.type === 'document' ? resource.format?.toUpperCase() : resource.resourceType}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {resource.category && <span>{resource.category}</span>}
                      <span>{resource.year}</span>
                      {resource.jurisdiction && <span>{resource.jurisdiction}</span>}
                      {resource.type === 'document' && resource.size && (
                        <span>{DocumentService.formatFileSize(resource.size)}</span>
                      )}
                    </div>
                    
                    {resource.citation && (
                      <p className="text-sm font-mono text-gray-500 dark:text-gray-400 mb-3">
                        {resource.citation}
                      </p>
                    )}
                  </div>
                </div>
                
                {resource.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {resource.description}
                  </p>
                )}
                
                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Course associations */}
                {((resource.course_codes && resource.course_codes.length > 0) || 
                  (resource.relevant_courses && resource.relevant_courses.length > 0)) && (
                  <div className="mb-4">
                    <span className="text-sm text-gray-500 mr-2">Related courses:</span>
                    <div className="inline-flex flex-wrap gap-1">
                      {(resource.course_codes || resource.relevant_courses || []).map((course, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Added {new Date(resource.created_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleResourceAction(resource)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    {resource.type === 'document' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResourceDownload(resource)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    )}
                    {resource.type === 'legal-resource' && resource.url && (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {/* Load More Button */}
            {hasMoreItems && (
              <div className="text-center py-8">
                <Button
                  onClick={loadMore}
                  loading={loadingMore}
                  disabled={loadingMore}
                  size="lg"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || selectedType || selectedCategory || selectedYear
                ? 'Try adjusting your search criteria or filters'
                : 'No resources are currently available in the system'
              }
            </p>
            {(searchQuery || selectedType || selectedCategory || selectedYear) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType(null);
                  setSelectedCategory(null);
                  setSelectedYear(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card>
        )}

        {/* Quick Actions Sidebar */}
        <div className="mt-12">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Browse Courses</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Explore resources organized by course
                </p>
                <Link to="/courses">
                  <Button size="sm" variant="outline">
                    View Courses
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Timeline View</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Browse resources chronologically
                </p>
                <Link to="/timeline">
                  <Button size="sm" variant="outline">
                    View Timeline
                  </Button>
                </Link>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Academic Calendar</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  View important academic dates
                </p>
                <a
                  href="https://pentvars.edu.gh/academic-calender/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Calendar
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;