'use client';

import React from 'react';
// import { useRouter } from 'next/navigation'; // Will be used for redirect after login
// import { toast } from 'sonner'; // Not used in this component
import { DynamicForm } from '@/components/forms';
import {
  FormComponent,
  FormData,
  FormSubmissionResult,
} from '@/requests/strapi/types';
import Image from 'next/image';

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
  // const router = useRouter(); // Will be used for redirect after login

  const handleLogin = async (data: FormData): Promise<FormSubmissionResult> => {
    try {
      // Simulate API call - replace with actual authentication logic
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      const email = data.email as string;
      const password = data.password as string;

      // Simple validation for demo purposes
      if (email === 'admin@zymptek.com' && password === 'admin123') {
        // Store auth token in localStorage (in real app, use secure storage)
        localStorage.setItem('authToken', 'mock-jwt-token');

        return {
          success: true,
          message: 'Login successful! Redirecting...',
        };
      } else {
        return {
          success: false,
          message: 'Invalid email or password. Please try again.',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login. Please try again.',
      };
    }
  };

  // const handleSuccessfulLogin = () => {
  //   // Redirect to dashboard after successful login
  //   router.push('/dashboard');
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title Section */}
        <div className="text-center space-y-4">
          {logoUrl && (
            <div className="flex justify-center">
              <Image
                src={process.env.NEXT_PUBLIC_STRAPI_URL + logoUrl}
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
