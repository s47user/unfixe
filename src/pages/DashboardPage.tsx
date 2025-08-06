import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Users, 
  FileText, 
  TrendingUp,
  Calendar,
  Download,
  Eye,
  Plus,
  ChevronRight,
  Star,
  Award,
  Target
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { useAuthState } from '../hooks/useAuthState';
import { DataService } from '../services/dataService';
import { DocumentService } from '../services/documentService';
import type { Course } from '../config/supabase';

const DashboardPage: React.FC = () => {
  const { user } = useAuthState();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalDocuments: 0,
    recentUploads: 0,
    totalSize: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery]);

  const loadDashboardData = async () => {
    try {
      const [documentStats, courseStats] = await Promise.all([
        DocumentService.getDocumentStats(),
        DataService.getCourseStats()
      ]);
      
      if (documentStats.success && documentStats.data && courseStats.success && courseStats.data) {
        setStats({
          totalCourses: courseStats.data.total,
          totalDocuments: documentStats.data.total,
          recentUploads: Object.values(documentStats.data.byYear).reduce((sum, count) => sum + count, 0),
          totalSize: documentStats.data.totalSize
        });
      } else {
        setStats({
          totalCourses: 0,
          totalDocuments: 0,
          recentUploads: 0,
          totalSize: 0
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const result = await DataService.getCourses();
      if (result.success && result.data) {
        setCourses(result.data);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const filterCourses = async () => {
    if (searchQuery.trim()) {
      const result = await DataService.searchCourses(searchQuery);
      if (result.success && result.data) {
        setFilteredCourses(result.data);
      }
    } else {
      setFilteredCourses(courses);
    }
  };

  const quickActions = [
    {
      title: 'Browse Courses',
      description: 'Explore all available law courses',
      icon: BookOpen,
      link: '/courses',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Document Timeline',
      description: 'View documents by year',
      icon: Clock,
      link: '/timeline',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Study Materials',
      description: 'Access learning resources',
      icon: FileText,
      link: '/resources',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Academic Calendar',
      description: 'View university calendar',
      icon: Calendar,
      link: 'https://pentvars.edu.gh/academic-calender/',
      color: 'from-orange-500 to-orange-600',
      external: true
    }
  ];

  // Get featured courses for display
  const featuredCourses = courses.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0]}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Ready to continue your legal education journey? Here's what's available today.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Law Student</p>
                <p className="text-xs text-gray-500">Pentecost University</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Courses</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {loading ? '...' : stats.totalCourses}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Documents</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {loading ? '...' : stats.totalDocuments}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">This Year</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {loading ? '...' : new Date().getFullYear()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Storage Used</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {loading ? '...' : DocumentService.formatFileSize(stats.totalSize)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} hover className="p-6 text-center group">
                {action.external ? (
                  <a
                    href={action.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </a>
                ) : (
                  <Link to={action.link} className="block">
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {action.description}
                    </p>
                  </Link>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Course Search and Browse */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Search */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Browse Courses
              </h2>
              <Link to="/courses">
                <Button variant="outline" size="sm" className="group">
                  View All
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
            </div>

            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredCourses.slice(0, 6).map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`}>
                  <Card hover className="p-4 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-primary-600 transition-colors">
                            {course.title}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {course.code} • Level {course.level} • {course.credits} Credits
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                          {course.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          course.category === 'core' 
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                            : course.category === 'elective'
                            ? 'bg-secondary-100 text-secondary-700 dark:bg-secondary-900 dark:text-secondary-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {course.category}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" />
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Study Resources Sidebar */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Study Resources
            </h2>
            
            <div className="space-y-4">
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                    Academic Calendar
                  </h3>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                  Stay updated with important academic dates and deadlines.
                </p>
                <a
                  href="https://pentvars.edu.gh/academic-calender/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="sm" variant="outline" fullWidth className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/20">
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                  </Button>
                </a>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-green-900 dark:text-green-100">
                    Tutorial Materials
                  </h3>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                  Access supplementary learning materials and tutorials.
                </p>
                <Link to="/resources">
                  <Button size="sm" variant="outline" fullWidth className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-900/20">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Browse Materials
                  </Button>
                </Link>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                    Test Your Understanding
                  </h3>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                  Practice quizzes and self-assessment tools.
                </p>
                <Button size="sm" variant="outline" fullWidth disabled className="border-purple-300 text-purple-700 dark:border-purple-600 dark:text-purple-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                    Document Timeline
                  </h3>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300 mb-3">
                  Browse legal documents organized by year.
                </p>
                <Link to="/timeline">
                  <Button size="sm" variant="outline" fullWidth className="border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-900/20">
                    <Clock className="w-4 h-4 mr-2" />
                    View Timeline
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;