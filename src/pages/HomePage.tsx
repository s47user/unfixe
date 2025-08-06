// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  Users,
  Search,
  Download,
  Clock,
  Shield,
  ArrowRight,
  CheckCircle,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  FileText,
  Gavel,
  GraduationCap,
  Award,
  Globe,
  Zap,
  Target,
  UserPlus,
  Library,
  FolderOpen
} from 'lucide-react';
import { Button } from '../components/UI/Button';
import { Card } from '../components/UI/Card';
import { DataService } from '../services/dataService';
import { DocumentService } from '../services/documentService'; // Import DocumentService
import type { Course, LegalResource } from '../config/supabase';

const HomePage: React.FC = () => {
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0); // New state for total documents
  const [totalCaseLaws, setTotalCaseLaws] = useState(0); // New state for total case laws

  useEffect(() => {
    loadHomepageStats(); // Renamed function
  }, []);

  const loadHomepageStats = async () => { // Renamed function
    try {
      const [courseStatsResult, documentStatsResult, legalResourceStatsResult] = await Promise.all([
        DataService.getCourseStats(),
        DocumentService.getDocumentStats(), // Fetch document stats
        DataService.getLegalResourceStats() // Fetch legal resource stats
      ]);

      if (courseStatsResult.success && courseStatsResult.data) {
        setTotalCourses(courseStatsResult.data.total);
      }
      if (documentStatsResult.success && documentStatsResult.data) {
        setTotalDocuments(documentStatsResult.data.total); // Set total documents
      }
      if (legalResourceStatsResult.success && legalResourceStatsResult.data) {
        // Extract case law count from legal resources
        setTotalCaseLaws(legalResourceStatsResult.data.byType.case || 0); // Set total case laws
      }

    } catch (error) {
      console.error('Error loading homepage stats:', error);
    }
  };

  const features = [
    {
      icon: Scale,
      title: 'Comprehensive Legal Library',
      description: 'Access thousands of legal documents, cases, statutes, and academic materials organized by course and topic.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Search,
      title: 'Advanced Search & Filter',
      description: 'Find exactly what you need with our powerful search engine and intelligent filtering system.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Clock,
      title: 'Timeline View',
      description: 'Browse legal documents chronologically to understand the evolution of law and legal precedents.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Course Integration',
      description: 'Resources organized by your specific law courses with direct links to relevant materials.',
      color: 'from-orange-500 to-orange-600'
    },
    {
      icon: Download,
      title: 'Document Management',
      description: 'Upload, download, and manage documents with built-in PDF viewer and annotation tools.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control and data protection.',
      color: 'from-teal-500 to-teal-600'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Create Account',
      description: 'Sign up with your university email to get started'
    },
    {
      number: 2,
      title: 'Browse Courses',
      description: 'Select your law courses to access relevant resources'
    },
    {
      number: 3,
      title: 'Access Materials',
      description: 'View, download, and annotate legal documents and cases'
    },
    {
      number: 4,
      title: 'Study & Learn',
      description: 'Use advanced tools to enhance your legal education'
    }
  ];

  const stats = [
    { number: `${totalCourses}+`, label: 'Law Courses', icon: BookOpen }, // Dynamic
    { number: `${totalDocuments}+`, label: 'Legal Documents', icon: FileText }, // Dynamic
    { number: `${totalCaseLaws}+`, label: 'Case Laws', icon: Gavel }, // Dynamic
    { number: '24/7', label: 'Access', icon: Clock }
  ];

  const benefits = [
    'Comprehensive collection of Ghanaian and international legal resources',
    'Advanced search and filtering capabilities for efficient research',
    'Course-specific organization aligned with your curriculum',
    'Built-in PDF viewer with annotation and highlighting tools',
    'Mobile-responsive design for study anywhere, anytime',
    'Secure, reliable access with university-grade infrastructure'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                <Scale className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              Pentecost University
              <span className="block text-secondary-300 bg-gradient-to-r from-secondary-300 to-secondary-400 bg-clip-text text-transparent">
                Digital Legal Resource Hub
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              Empowering the next generation of legal professionals with comprehensive
              digital resources, advanced search capabilities, and modern learning tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="text-lg px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-gray-900 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Revolutionizing Legal Education
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Our digital resource hub transforms how law students access, study, and
              interact with legal materials. Built specifically for Pentecost University's
              law faculty, we provide cutting-edge tools for modern legal education.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-900 dark:text-white">
                Why Choose Our Platform?
              </h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{totalCourses}+</div>
                    <div className="text-sm text-gray-600">Courses</div>
                  </Card>

                  <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">1000+</div>
                    <div className="text-sm text-gray-600">Students</div>
                  </Card>

                  <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Gavel className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">500+</div>
                    <div className="text-sm text-gray-600">Cases</div>
                  </Card>

                  <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600 mb-1">24/7</div>
                    <div className="text-sm text-gray-600">Access</div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Powerful Features for Legal Education
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover the comprehensive tools and features designed to enhance
              your legal research and study experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center h-full group">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in just a few simple steps and unlock the full potential
              of our digital legal resource platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative group">
                {/* Step Circle */}
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-lg group-hover:scale-110 transition-all duration-300">
                  {step.number}
                </div>

                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full pointer-events-none">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto -ml-3" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/signup">
              <Button size="lg" className="px-8 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions about our platform? Need support?
              We're here to help you succeed in your legal education journey.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white">
                Contact Information
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Campus Address</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      Pentecost University College<br />
                      P. O. Box KN 1739<br />
                      Kaneshie, Accra, Ghana
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Phone Numbers</div>
                    <div className="text-gray-600 dark:text-gray-400">
                      <a href="tel:+233246845054" className="hover:text-primary-600 transition-colors block">
                        +233 246 845 054
                      </a>
                      <a href="tel:+233264790221" className="hover:text-primary-600 transition-colors block">
                        +233 264 790 221
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Email</div>
                    <a
                      href="mailto:pentvarslawofficial@gmail.com"
                      className="text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors"
                    >
                      pentvarslawofficial@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-semibold mb-4 text-gray-900 dark:text-white">Quick Links</h4>
                <div className="space-y-2">
                  <a
                    href="https://pentvars.edu.gh/academic-calender/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700 transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                    Academic Calendar
                  </a>
                  <Link
                    to="/courses"
                    className="flex items-center text-primary-600 hover:text-primary-700 transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                    Course Resources
                  </Link>
                </div>
              </div>
            </div>

            <Card className="p-8 h-fit">
              <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                Send us a Message
              </h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-input" placeholder="Your first name" />
                  </div>
                  <div>
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-input" placeholder="Your last name" />
                  </div>
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" placeholder="your.email@example.com" />
                  </div>

                <div>
                  <label className="form-label">Subject</label>
                  <input type="text" className="form-input" placeholder="How can we help?" />
                </div>

                <div>
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-input resize-none"
                    rows={4}
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>

                <Button type="submit" fullWidth className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
