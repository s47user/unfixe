import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
  BookOpen,
  Clock,
  Scale,
  Gavel
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { DocumentService } from '../services/documentService';
import { DataService } from '../services/dataService';
import { testSupabaseConnection } from '../config/supabase';
import type { Document, LegalResource } from '../config/supabase';

// Combined resource type for unified timeline display
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

const LawTimelinePage: React.FC = () => {
  const [allResources, setAllResources] = useState<CombinedResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<CombinedResource[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<{
    connected: boolean;
    message: string;
  }>({ connected: false, message: 'Checking connection...' });
  
  const [stats, setStats] = useState({
    totalResources: 0,
    totalSize: 0,
    yearsCovered: 0
  });

  useEffect(() => {
    checkConnection();
    loadAllResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [allResources, searchQuery, selectedYear, selectedCategory, selectedCourse]);

  const checkConnection = async () => {
    const result = await testSupabaseConnection();
    setConnectionStatus({
      connected: result.success,
      message: result.message
    });
  };

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

      setAllResources(combinedResources);

      // Calculate stats
      const totalSize = combinedResources
        .filter(r => r.type === 'document')
        .reduce((sum, r) => sum + (r.size || 0), 0);
      const years = [...new Set(combinedResources.map(r => r.year.toString()))];
      
      setStats({
        totalResources: combinedResources.length,
        totalSize,
        yearsCovered: years.length
      });

      // Extract filter options
      const categories = [...new Set(combinedResources.map(r => r.category).filter(Boolean))].sort();
      const courses = [...new Set([
        ...combinedResources.flatMap(r => r.course_codes || []),
        ...combinedResources.flatMap(r => r.relevant_courses || [])
      ])].filter(Boolean).sort();
      
      setAvailableYears(years.sort((a, b) => b.localeCompare(a)));
      setAvailableCategories(categories);
      setAvailableCourses(courses);
    } catch (error) {
      console.error('Error loading resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = allResources;

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

    if (selectedYear) {
      filtered = filtered.filter(resource => resource.year.toString() === selectedYear);
    }

    if (selectedCategory) {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (selectedCourse) {
      filtered = filtered.filter(resource => 
        resource.course_codes?.includes(selectedCourse) ||
        resource.relevant_courses?.includes(selectedCourse)
      );
    }

    setFilteredResources(filtered);
  };

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

  const getResourcesByYear = () => {
    const grouped: Record<string, CombinedResource[]> = {};
    filteredResources.forEach(resource => {
      const year = resource.year.toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(resource);
    });
    
    // Sort years in descending order
    const sortedYears = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
    const result: Record<string, CombinedResource[]> = {};
    sortedYears.forEach(year => {
      result[year] = grouped[year].sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
    
    return result;
  };

  const resourcesByYear = getResourcesByYear();

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Resource Timeline
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Browse all resources organized chronologically by year
              </p>
            </div>
          </div>
        </div>

        {/* Connection Status */}
        <Card className="p-4 mb-6">
          <div className="flex items-center space-x-2">
            {connectionStatus.connected ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
            <span className={`text-sm ${
              connectionStatus.connected ? 'text-green-600' : 'text-red-600'
            }`}>
              {connectionStatus.message}
            </span>
          </div>
        </Card>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
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
            
            <div className="flex gap-2">
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
                value={selectedCourse || ''}
                onChange={(e) => setSelectedCourse(e.target.value || null)}
                className="form-input w-auto"
              >
                <option value="">All Courses</option>
                {availableCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Resources</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalResources}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-secondary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Years Covered</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.yearsCovered}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Filtered Results</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{filteredResources.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        {loading ? (
          <Card className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
            <p className="text-gray-600 dark:text-gray-400">Loading resources...</p>
          </Card>
        ) : Object.keys(resourcesByYear).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(resourcesByYear).map(([year, yearResources]) => (
              <div key={year}>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {year.slice(-2)}
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{year}</h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {yearResources.length} resource{yearResources.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 ml-16">
                  {yearResources.map((resource) => (
                    <Card key={`${resource.type}-${resource.id}`} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm line-clamp-2">
                            {resource.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                            {resource.type === 'document' ? resource.format?.toUpperCase() : resource.resourceType}
                          </p>
                          {resource.category && (
                            <span className="inline-block px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded">
                              {resource.category}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1 ml-2">
                          {resource.type === 'document' && resource.format && (
                            <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                              {resource.format}
                            </span>
                          )}
                          <span className="text-lg">
                            {resource.type === 'document' 
                              ? DocumentService.getFileTypeIcon(resource.format || 'pdf')
                              : resource.resourceType === 'case' ? '⚖️'
                              : resource.resourceType === 'statute' ? '📜'
                              : resource.resourceType === 'regulation' ? '📋'
                              : '📚'
                            }
                          </span>
                        </div>
                      </div>
                      
                      {resource.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {resource.description}
                        </p>
                      )}

                      {resource.citation && (
                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                          {resource.citation}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <span>
                          {resource.type === 'document' && resource.size 
                            ? DocumentService.formatFileSize(resource.size)
                            : resource.jurisdiction || 'Legal Resource'
                          }
                        </span>
                        <span>{new Date(resource.created_at).toLocaleDateString()}</span>
                      </div>

                      {/* Course associations */}
                      {((resource.course_codes && resource.course_codes.length > 0) || 
                        (resource.relevant_courses && resource.relevant_courses.length > 0)) && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {(resource.course_codes || resource.relevant_courses || []).slice(0, 2).map((course, index) => (
                              <span
                                key={index}
                                className="px-1 py-0.5 bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 text-xs rounded"
                              >
                                {course}
                              </span>
                            ))}
                            {(resource.course_codes || resource.relevant_courses || []).length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{(resource.course_codes || resource.relevant_courses || []).length - 2} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleResourceAction(resource)}
                          className="flex-1"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        {resource.type === 'document' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleResourceDownload(resource)}
                            className="flex-1"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        ) : resource.url && (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                          >
                            <Button size="sm" variant="outline" className="w-full">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Open
                            </Button>
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No resources found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery || selectedYear || selectedCategory || selectedCourse
                ? 'Try adjusting your search criteria or filters'
                : 'No resources are currently available in the system'
              }
            </p>
            {(searchQuery || selectedYear || selectedCategory || selectedCourse) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedYear(null);
                  setSelectedCategory(null);
                  setSelectedCourse(null);
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card>
        )}

        {/* Quick Actions */}
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
                <a href="/courses">
                  <Button size="sm" variant="outline">
                    View Courses
                  </Button>
                </a>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">All Resources</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Browse all resources in one place
                </p>
                <a href="/resources">
                  <Button size="sm" variant="outline">
                    View All Resources
                  </Button>
                </a>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Recent Updates</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  View recently added resources
                </p>
                <Button size="sm" variant="outline" onClick={() => setSelectedYear(new Date().getFullYear().toString())}>
                  View Recent
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LawTimelinePage;