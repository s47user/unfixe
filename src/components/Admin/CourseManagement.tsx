import React, { useState, useEffect } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { DataService } from '../../services/dataService';
import { Course } from '../../config/supabase';
import { Plus, Edit, Trash2, Loader2, XCircle, CheckCircle, BookOpen, Search } from 'lucide-react';

const CourseManagement: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  
  // Raw string state for comma-separated input
  const [prerequisitesInput, setPrerequisitesInput] = useState('');

  const courseCategories: Course['category'][] = ['core', 'elective', 'practical'];
  const courseLevels = [100, 200, 300, 400];
  const courseSemesters = [1, 2];

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(lowercasedQuery) ||
      course.code.toLowerCase().includes(lowercasedQuery) ||
      course.description?.toLowerCase().includes(lowercasedQuery) ||
      course.category.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    const result = await DataService.getCourses();
    if (result.success && result.data) {
      setCourses(result.data);
    } else {
      setError(result.error || 'Failed to load courses.');
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCourse(prev => ({
      ...prev,
      [name]: name === 'level' || name === 'semester' || name === 'credits' ? parseInt(value) : value
    }));
  };

  const handlePrerequisitesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrerequisitesInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!currentCourse?.code || !currentCourse?.title || !currentCourse?.level || !currentCourse?.semester || !currentCourse?.credits || !currentCourse?.category) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    let result;
    if (isEditing && currentCourse?.id) {
      const prerequisitesArray = prerequisitesInput.split(',').map(p => p.trim()).filter(p => p);
      const courseToUpdate = {
        ...currentCourse,
        prerequisites: prerequisitesArray
      };
      result = await DataService.updateCourse(currentCourse.id, courseToUpdate);
      if (result.success) {
        setSuccessMessage('Course updated successfully!');
      } else {
        setError(result.error || 'Failed to update course.');
      }
    } else {
      const prerequisitesArray = prerequisitesInput.split(',').map(p => p.trim()).filter(p => p);
      const courseToAdd = {
        ...currentCourse,
        prerequisites: prerequisitesArray
      } as Omit<Course, 'id' | 'created_at' | 'updated_at'>;
      result = await DataService.addCourse(courseToAdd);
      if (result.success) {
        setSuccessMessage('Course added successfully!');
      } else {
        setError(result.error || 'Failed to add course.');
      }
    }

    setLoading(false);
    if (result.success) {
      setCurrentCourse(null);
      setPrerequisitesInput('');
      setIsEditing(false);
      loadCourses();
    }
  };

  const handleEdit = (course: Course) => {
    setCurrentCourse({ ...course });
    setPrerequisitesInput(course.prerequisites?.join(', ') || '');
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to form
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      const result = await DataService.deleteCourse(id);
      if (result.success) {
        setSuccessMessage('Course deleted successfully!');
        loadCourses();
      } else {
        setError(result.error || 'Failed to delete course.');
      }
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setCurrentCourse(null);
    setPrerequisitesInput('');
    setIsEditing(false);
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <BookOpen className="inline-block w-8 h-8 mr-2 text-primary-600" />
            Course Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Add, edit, and delete law courses available on the platform.
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

        {/* Course Form */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Course Code"
                name="code"
                value={currentCourse?.code || ''}
                onChange={handleInputChange}
                placeholder="e.g., LAW 101"
                required
              />
              <Input
                label="Course Title"
                name="title"
                value={currentCourse?.title || ''}
                onChange={handleInputChange}
                placeholder="e.g., Administrative Law"
                required
              />
            </div>
            <Input
              label="Description"
              name="description"
              value={currentCourse?.description || ''}
              onChange={handleInputChange}
              placeholder="Brief description of the course"
              textarea
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Level</label>
                <select
                  name="level"
                  value={currentCourse?.level || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Level</option>
                  {courseLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Semester</label>
                <select
                  name="semester"
                  value={currentCourse?.semester || ''}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                >
                  <option value="">Select Semester</option>
                  {courseSemesters.map(semester => (
                    <option key={semester} value={semester}>{semester}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Credits</label>
                <Input
                  type="number"
                  name="credits"
                  value={currentCourse?.credits || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                  required
                />
              </div>
            </div>
            <div>
              <label className="form-label">Category</label>
              <select
                name="category"
                value={currentCourse?.category || ''}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select Category</option>
                {courseCategories.map(category => (
                  <option key={category} value={category} className="capitalize">{category}</option>
                ))}
              </select>
            </div>
            <Input
              label="Prerequisites (comma-separated codes)"
              name="prerequisites"
              value={prerequisitesInput}
              onChange={handlePrerequisitesChange}
              placeholder="e.g., LAW 101, LAW 102"
            />
            <div className="flex space-x-2">
              <Button type="submit" loading={loading}>
                {isEditing ? (
                  <>
                    <Edit className="w-4 h-4 mr-2" /> Update Course
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Add Course
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

        {/* Course List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              All Courses
            </h2>
            <div className="relative w-1/3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading && !courses.length ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
              <p className="text-gray-600 dark:text-gray-400">Loading courses...</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              No courses found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Level
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
                  {filteredCourses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {course.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {course.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {course.level}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 capitalize">
                        {course.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button variant="ghost" size="sm" onClick={() => handleEdit(course)} className="mr-2">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(course.id)}>
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

export default CourseManagement;