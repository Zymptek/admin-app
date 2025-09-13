'use client';

import React from 'react';
import { useAdminLoginPageData } from '@/hooks';
import { LoginForm } from './components/LoginForm';
import LoadingPage from '@/app/loading';
import GlobalError from '@/app/error';

/**
 * Admin Login Page
 * Dynamically renders login form based on Strapi configuration
 */
export default function LoginPage() {
  const {
    data: loginData,
    isLoading,
    error,
    refetch,
  } = useAdminLoginPageData();

  // Show loading state
  if (isLoading) {
    return <LoadingPage />;
  }

  // Show error state
  if (error) {
    return (
      <GlobalError
        error={error as Error & { digest?: string }}
        reset={() => refetch()}
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
