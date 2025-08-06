import React, { useState, useRef } from 'react';
import { supabase } from '../config/supabase';
import { Button } from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import { Card } from '../components/UI/Card';
import { useAuthState } from '../hooks/useAuthState';
import { 
  User, 
  Mail, 
  Lock, 
  Camera, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, refreshUserProfile } = useAuthState();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    displayName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    photoURL: user?.user_metadata?.avatar_url || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    photo: false
  });
  
  const [messages, setMessages] = useState({
    profile: '',
    password: '',
    photo: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setMessages(prev => ({ ...prev, photo: 'File size must be less than 5MB' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setMessages(prev => ({ ...prev, photo: 'Please select an image file' }));
      return;
    }

    setLoading(prev => ({ ...prev, photo: true }));
    setMessages(prev => ({ ...prev, photo: '' }));

    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);
      
      const photoURL = data.publicUrl;

      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: photoURL }
      });
      
      if (updateError) throw updateError;
      
      setProfileData(prev => ({ ...prev, photoURL }));
      setMessages(prev => ({ ...prev, photo: 'Profile photo updated successfully!' }));
      
      // Refresh the user profile to update the header and other components
      await refreshUserProfile();
    } catch (error) {
      setMessages(prev => ({ 
        ...prev, 
        photo: 'Failed to upload photo. Please try again.' 
      }));
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 seconds
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newErrors: Record<string, string> = {};
    
    if (!profileData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(prev => ({ ...prev, profile: true }));
    setMessages(prev => ({ ...prev, profile: '' }));

    try {
      // Update display name and email
      const updates: any = {};
      
      if (profileData.displayName !== user?.user_metadata?.full_name) {
        updates.data = { full_name: profileData.displayName };
      }

      if (profileData.email !== user.email) {
        updates.email = profileData.email;
      }
      
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
      }

      setMessages(prev => ({ ...prev, profile: 'Profile updated successfully!' }));
      
      // Refresh the user profile to update the header and other components
      await refreshUserProfile();
    } catch (error: any) {
      let errorMessage = 'Failed to update profile. Please try again.';
      
      switch (error.message) {
        case 'User already registered':
          errorMessage = 'This email is already in use by another account.';
          break;
        case 'Invalid email':
          errorMessage = 'Please enter a valid email address.';
          break;
        default:
          if (error.message.includes('recent login')) {
            errorMessage = 'Please sign out and sign in again to update your email.';
          }
      }
      
      setMessages(prev => ({ ...prev, profile: errorMessage }));
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 seconds
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newErrors: Record<string, string> = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(prev => ({ ...prev, password: true }));
    setMessages(prev => ({ ...prev, password: '' }));

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });
      
      if (error) throw error;
      
      // Also update the user_profiles table for consistency
      if (profileData.displayName !== user?.user_metadata?.full_name) {
        const { error: profileUpdateError } = await supabase
          .from('user_profiles')
          .update({ full_name: profileData.displayName })
          .eq('id', user.id);
        
        if (profileUpdateError) throw profileUpdateError;
      }
      
      if (profileData.email !== user.email) {
        const { error: profileEmailUpdateError } = await supabase
          .from('user_profiles')
          .update({ email: profileData.email })
          .eq('id', user.id);
        
        if (profileEmailUpdateError) throw profileEmailUpdateError;
      }
      
      setMessages(prev => ({ ...prev, password: 'Password updated successfully!' }));
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      let errorMessage = 'Failed to update password. Please try again.';
      
      switch (error.message) {
        case 'Password should be at least 6 characters':
          errorMessage = 'Password is too weak. Please choose a stronger password.';
          break;
        default:
          if (error.message.includes('recent login')) {
            errorMessage = 'Please sign out and sign in again to change your password.';
          }
      }
      
      setMessages(prev => ({ ...prev, password: errorMessage }));
    } finally {
      setTimeout(() => {
        window.location.reload();
      }, 3000); // 3 seconds
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="min-h-screen bg-surface py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Photo */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mx-auto">
                  {profileData.photoURL ? (
                    <img
                      src={profileData.photoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading.photo}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                {user?.user_metadata?.full_name || 'User'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {user?.email}
              </p>
              
              {messages.photo && (
                <div className={`text-sm p-2 rounded ${
                  messages.photo.includes('successfully') 
                    ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {messages.photo}
                </div>
              )}
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <User className="w-5 h-5 text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Basic Information
                </h2>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <Input
                  label="Display Name"
                  name="displayName"
                  value={profileData.displayName}
                  onChange={handleProfileChange}
                  error={errors.displayName}
                  placeholder="Your full name"
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  error={errors.email}
                  placeholder="your.email@pentvars.edu.gh"
                  required
                />

                {messages.profile && (
                  <div className={`flex items-center space-x-2 text-sm p-3 rounded ${
                    messages.profile.includes('successfully')
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {messages.profile.includes('successfully') ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{messages.profile}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  loading={loading.profile}
                  disabled={loading.profile}
                  className="w-full sm:w-auto"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </form>
            </Card>

            {/* Change Password */}
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <Lock className="w-5 h-5 text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Change Password
                </h2>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="relative">
                  <Input
                    label="Current Password"
                    type={showPasswords.current ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={errors.currentPassword}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="New Password"
                    type={showPasswords.new ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={errors.newPassword}
                    placeholder="Enter new password"
                    helper="Password must be at least 6 characters"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirm New Password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={errors.confirmPassword}
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {messages.password && (
                  <div className={`flex items-center space-x-2 text-sm p-3 rounded ${
                    messages.password.includes('successfully')
                      ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}>
                    {messages.password.includes('successfully') ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span>{messages.password}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  loading={loading.password}
                  disabled={loading.password}
                  className="w-full sm:w-auto"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
