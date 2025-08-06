import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, BookOpen, Settings, Home, Scale, Shield } from 'lucide-react'; // Import Shield icon
import { useAuthState } from '../../hooks/useAuthState';
import { supabase } from '../../config/supabase';
import { ThemeToggle } from '../UI/ThemeToggle';
import { Button } from '../UI/Button';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, userProfile, loading } = useAuthState(); // Get userProfile
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/courses', label: 'Courses', icon: BookOpen },
    { to: '/timeline', label: 'Timeline', icon: Scale },
    { to: '/resources', label: 'Resources', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-primary-600 leading-tight">Pentecost Law</span>
                <span className="text-xs text-gray-500 -mt-1">Digital Resource Hub</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
            {/* New: Admin Panel link */}
            {!loading && userProfile?.role === 'admin' && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {!loading && (
              <>
                {user ? (
                  <div className="relative">
                    <button
                      onClick={toggleProfile}
                      className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-800 dark:to-primary-900 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <span className="hidden md:block max-w-24 truncate">
                        {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                      </span>
                    </button>
                    
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-elevation-3 py-2 z-50 border border-gray-100 dark:border-gray-700">
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User className="w-4 h-4 mr-3" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                        {/* New: Admin Panel link in dropdown */}
                        {userProfile?.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Admin Panel
                          </Link>
                        )}
                        
                        <hr className="my-2 border-gray-100 dark:border-gray-700" />
                        
                        <button
                          onClick={handleSignOut}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/login')}
                      className="hidden sm:flex"
                    >
                      Sign In
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => navigate('/signup')}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-lg"
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-outline-variant animate-slide-down">
            <nav className="flex flex-col space-y-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
              {/* New: Admin Panel link in mobile menu */}
              {!loading && userProfile?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Shield className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
              
              {user && (
                <>
                  <hr className="border-outline-variant my-2" />
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
              
              {!user && (
                <>
                  <hr className="border-outline-variant my-2" />
                  <Link
                    to="/login"
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-lg transition-all duration-200 shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};