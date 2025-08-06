import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Footer } from './components/Layout/Footer';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';

// Import pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CourseResourcesPage from './pages/CourseResourcesPage';
import ResourcesPage from './pages/ResourcesPage';
import LawTimelinePage from './pages/LawTimelinePage';
import DocumentViewerPage from './pages/DocumentViewerPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AccessibilityPage from './pages/AccessibilityPage';
import SupportPage from './pages/SupportPage';

// Import Admin Pages
import AdminDashboardPage from './pages/AdminDashboardPage';
import CourseManagement from './components/Admin/CourseManagement';
import AdminResourceManagement from './components/Admin/AdminResourceManagement';
import LegalResourceManagement from './components/Admin/LegalResourceManagement';

function App() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/support" element={<SupportPage />} />
          
          {/* Auth routes - redirect if already authenticated */}
          <Route 
            path="/login" 
            element={
              <ProtectedRoute requireAuth={false}>
                <LoginPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <ProtectedRoute requireAuth={false}>
                <SignUpPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <ProtectedRoute requireAuth={false}>
                <ForgotPasswordPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes - require authentication */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses" 
            element={
              <ProtectedRoute>
                <CourseResourcesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses/:courseId" 
            element={
              <ProtectedRoute>
                <CourseResourcesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resources" 
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/timeline" 
            element={
              <ProtectedRoute>
                <LawTimelinePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/document/:id" 
            element={
              <ProtectedRoute>
                <DocumentViewerPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin routes - require 'admin' role */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/courses" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <CourseManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/documents" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <AdminResourceManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/resources" 
            element={
              <ProtectedRoute requiredRoles={['admin']}>
                <LegalResourceManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-8">Page not found</p>
                  <a 
                    href="/" 
                    className="btn-primary"
                  >
                    Go Home
                  </a>
                </div>
              </div>
            } 
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;