'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdminLoginPageData } from '@/hooks';
import { LoginForm } from './components/LoginForm';
import LoadingPage from '@/app/loading';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import GlobalError from '@/app/error';

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
      <GlobalError
        error={new Error(error.message)}
        reset={() => window.location.reload()}
      />
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
