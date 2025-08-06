import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { Scale, Eye, EyeOff, CheckCircle, ArrowLeft, Users, BookOpen, Shield, Zap, ChevronRight, Mail, AlertCircle, Phone } from 'lucide-react';
import { DataService } from '../services/dataService';
import type { Course } from '../config/supabase';

const SignUpPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [emailSentForConfirmation, setEmailSentForConfirmation] = useState(false);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [totalCourses, setTotalCourses] = useState(30);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const result = await DataService.getCourses();
      if (result.success && result.data) {
        setFeaturedCourses(result.data.slice(0, 6));
        setTotalCourses(result.data.length);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
          }
        }
      });
      
      if (error) throw error;
      
      // Set the email confirmation state instead of navigating
      setEmailSentForConfirmation(true);
    } catch (error: any) {
      let errorMessage = 'Failed to create account. Please try again.';
      
      switch (error.message) {
        case 'User already registered':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'Invalid email':
          errorMessage = 'Please enter a valid email address.';
          break;
        case 'Password should be at least 6 characters':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          if (error.message.includes('Password')) {
            errorMessage = 'Password is too weak. Please choose a stronger password.';
          }
      }
      
      setErrors({ form: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const passwordRequirements = [
    { met: formData.password.length >= 6, text: 'At least 6 characters' },
    { met: /[A-Z]/.test(formData.password), text: 'One uppercase letter' },
    { met: /[a-z]/.test(formData.password), text: 'One lowercase letter' },
    { met: /\d/.test(formData.password), text: 'One number' }
  ];

  const benefits = [
    {
      icon: BookOpen,
      title: `Access ${totalCourses}+ Law Courses`,
      description: 'Comprehensive curriculum coverage'
    },
    {
      icon: Users,
      title: 'Join 1000+ Students',
      description: 'Active learning community'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'University-grade security'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Start learning immediately'
    }
  ];

  // If email confirmation is sent, show the confirmation message
  if (emailSentForConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23006971' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                We've sent a confirmation link to
              </p>
              <p className="font-medium text-primary-600 dark:text-primary-400 mb-4">
                {formData.email}
              </p>
            </div>

            {/* Confirmation Card */}
            <Card className="p-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <div className="text-center space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">Email Confirmation Required</span>
                  </div>
                  
                  <div className="space-y-3 text-gray-600 dark:text-gray-300">
                    <p>
                      Before you can sign in to your Pentecost Law Hub account, you need to confirm your email address.
                    </p>
                    <p>
                      <strong>Please check your email inbox</strong> and click the confirmation link we just sent you.
                    </p>
                  </div>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium mb-1">Important:</p>
                        <ul className="space-y-1 text-left">
                          <li>• Check your spam/junk folder if you don't see the email</li>
                          <li>• The confirmation link will expire in 24 hours</li>
                          <li>• You must confirm your email before you can sign in</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    After confirming your email, you can sign in to access all course materials and resources.
                  </p>
                  
                  <div className="flex flex-col space-y-3">
                    <Link to="/login">
                      <Button fullWidth className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go to Sign In Page
                      </Button>
                    </Link>
                    
                    <button
                      onClick={() => {
                        setEmailSentForConfirmation(false);
                        setFormData({
                          firstName: '',
                          lastName: '',
                          email: '',
                          password: '',
                          confirmPassword: '',
                          acceptTerms: false
                        });
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
                    >
                      Use a different email address
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Additional Help */}
            <Card className="p-4 bg-gray-50 dark:bg-gray-800/50 border-0">
              <div className="text-center">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 text-sm">
                  Need Help?
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  If you're having trouble with email confirmation, contact our support team.
                </p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <a 
                    href="mailto:support@pentvars.edu.gh" 
                    className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>support@pentvars.edu.gh</span>
                  </a>
                  <span>•</span>
                  <a 
                    href="tel:+233246845054" 
                    className="flex items-center space-x-1 hover:text-primary-600 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>+233 246 845 054</span>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23006971' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative flex min-h-screen">
        {/* Left Side - Benefits & Course Preview */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 text-white p-12 flex-col justify-center relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-secondary-300 rounded-full"></div>
            <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/20 rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Scale className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Pentecost Law</h2>
                <p className="text-primary-200 text-sm">Digital Resource Hub</p>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Join the Future of
              <span className="block text-secondary-300">Legal Education</span>
            </h1>

            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Access comprehensive legal resources, connect with peers, and excel in your legal studies with our cutting-edge platform.
            </p>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                    <p className="text-primary-200 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Featured Courses Preview */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Featured Courses
              </h3>
              <div className="space-y-3">
                {featuredCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{course.title}</h4>
                      <p className="text-primary-200 text-xs">
                        {course.code} • Level {course.level} • {course.credits} Credits
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.category === 'core' 
                          ? 'bg-secondary-400/20 text-secondary-200'
                          : course.category === 'elective'
                          ? 'bg-green-400/20 text-green-200'
                          : 'bg-purple-400/20 text-purple-200'
                      }`}>
                        {course.category}
                      </span>
                      <ChevronRight className="w-4 h-4 text-primary-300 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-primary-200 text-sm">
                  + {totalCourses - featuredCourses.length} more courses available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Back Button */}
            <Link
              to="/"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>

            {/* Header */}
            <div className="text-center">
              <div className="lg:hidden flex justify-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Scale className="w-8 h-8 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Join thousands of law students already using our platform
              </p>
            </div>

            {/* Mobile Course Preview */}
            <div className="lg:hidden">
              <Card className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border-0">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm">
                  Access 30+ Law Courses Including:
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {featuredCourses.slice(0, 3).map((course) => (
                    <div key={course.id} className="text-sm">
                      <span className="font-medium text-primary-700 dark:text-primary-300">
                        {course.title}
                      </span>
                      <span className="text-gray-500 ml-2">({course.code})</span>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-1">
                    + {totalCourses - 3} more courses
                  </p>
                </div>
              </Card>
            </div>

            {/* Form */}
            <Card className="p-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {errors.form && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.form}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    placeholder="John"
                    required
                  />
                  
                  <Input
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    placeholder="Doe"
                    required
                  />
                </div>

                <Input
                  label="University Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="john.doe@pentvars.edu.gh"
                  helper="Use your official university email address"
                  required
                />

                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password}
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.password && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Password Requirements:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle 
                            className={`w-4 h-4 ${
                              req.met ? 'text-green-500' : 'text-gray-300'
                            }`} 
                          />
                          <span className={`text-xs ${
                            req.met ? 'text-green-600 dark:text-green-400' : 'text-gray-500'
                          }`}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="acceptTerms" className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-medium">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                    {errors.acceptTerms && (
                      <p className="text-sm text-red-500 mt-1">{errors.acceptTerms}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  loading={loading}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
                  >
                    Sign in to your account
                  </Link>
                </div>
              </div>
            </Card>

            {/* Trust Indicators */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="w-4 h-4" />
                  <span>Secure</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>1000+ Students</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;