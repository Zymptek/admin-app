'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { DynamicForm } from '@/components/forms';
import {
  FormComponent,
  FormData,
  FormSubmissionResult,
} from '@/requests/strapi/types';
import { useAuth } from '@/contexts/AuthContext';
import { SignInRequest } from '@/requests/backend/types';
import Image from 'next/image';
import LoadingPage from '@/app/loading';

interface LoginFormProps {
  formConfig: FormComponent;
  logoUrl?: string;
  title: string;
  description?: string;
}

/**
 * Login form component that handles authentication
 * Uses the dynamic form system with Strapi configuration
 */
export function LoginForm({ formConfig, logoUrl }: LoginFormProps) {
  const router = useRouter();
  const { signIn, isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (data: FormData): Promise<FormSubmissionResult> => {
    const credentials: SignInRequest = {
      email: data.email as string,
      password: data.password as string,
    };

    const result = await signIn(credentials);

    if (!result.success) {
      return {
        success: false,
        message: result.error || 'Login failed',
      };
    }

    // Login was successful - useEffect will handle redirect when isAuthenticated updates
    return {
      success: true,
      message: 'Login successful! Redirecting...',
    };
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title Section */}
        <div className="text-center space-y-4">
          {logoUrl && (
            <div className="flex justify-center">
              <Image
                src={
                  logoUrl
                    ? (() => {
                        const base = process.env.NEXT_PUBLIC_STRAPI_URL || '';
                        try {
                          return new URL(logoUrl, base).toString();
                        } catch {
                          return logoUrl;
                        }
                      })()
                    : ''
                }
                alt="Company Logo"
                className="h-16 w-auto object-contain"
                width={100}
                height={100}
              />
            </div>
          )}
        </div>

        {/* Dynamic Form */}
        <DynamicForm
          formConfig={formConfig}
          onSubmit={handleLogin}
          className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
        />
      </div>
    </div>
  );
}
