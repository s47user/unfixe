import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requiredRoles?: ('student' | 'faculty' | 'admin')[]; // New prop for required roles
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requiredRoles // Destructure new prop
}) => {
  const { user, userProfile, loading } = useAuthState(); // Get userProfile
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-500" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    // Redirect to login page if authentication is required but user is not logged in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!requireAuth && user) {
    // Redirect authenticated users away from auth pages (login, signup)
    return <Navigate to="/dashboard" replace />;
  }

  // If roles are required, check if the user's role matches
  if (requiredRoles && userProfile && !requiredRoles.includes(userProfile.role || 'student')) {
    // Redirect to dashboard or an unauthorized page if role doesn't match
    return <Navigate to="/dashboard" replace />; // Or a specific /unauthorized page
  }

  return <>{children}</>;
};