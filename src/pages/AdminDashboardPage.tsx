import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/UI/Card';
import { BookOpen, FileText, Gavel, Users, LayoutDashboard } from 'lucide-react';

const AdminDashboardPage: React.FC = () => {
  const adminSections = [
    {
      title: 'Manage Courses',
      description: 'Add, edit, or delete law courses.',
      icon: BookOpen,
      link: '/admin/courses',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Manage Resources',
      description: 'Upload documents and manage legal resources.',
      icon: FileText,
      link: '/admin/documents',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Manage Legal Resources',
      description: 'Curate and modify legal cases, statutes, and articles.',
      icon: Gavel,
      link: '/admin/resources',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Manage Users (Coming Soon)',
      description: 'View and manage user profiles and roles.',
      icon: Users,
      link: '#',
      color: 'from-orange-500 to-orange-600',
      disabled: true
    },
  ];

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            <LayoutDashboard className="inline-block w-8 h-8 mr-2 text-primary-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to the administrative control panel. Manage your application's content and users here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminSections.map((section, index) => (
            <Card key={index} hover={!section.disabled} className="p-6 text-center group">
              <Link to={section.link} className={`block ${section.disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
                <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <section.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {section.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {section.description}
                </p>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;