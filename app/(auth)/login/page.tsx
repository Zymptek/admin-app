'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdminLoginPageData } from '@/hooks';
import { LoginForm } from './components/LoginForm';
import LoadingPage from '@/app/loading';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Admin Login Page
 * Dynamically renders login form based on Strapi configuration
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    data: loginData,
    isLoading: dataLoading,
    error,
    refetch,
  } = useAdminLoginPageData({
    enabled: !isAuthenticated, // Only load data if user is not authenticated
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Show toast for page data errors
  React.useEffect(() => {
    if (error) {
      toast.error('Failed to load login page. Please try again.');
    }
  }, [error]);

  // Show loading state while checking authentication or loading data
  if (authLoading || dataLoading) {
    return <LoadingPage />;
  }

  // Show error state with retry option
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-600">
            Error Loading Login Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load the login form. Please try again.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show form when data is loaded
  if (loginData) {
    return (
      <LoginForm
        formConfig={loginData.form}
        logoUrl={loginData.logo?.url}
        title={loginData.title}
        description={loginData.description}
      />
    );
  }

  // Fallback loading state
  return <LoadingPage />;
}
