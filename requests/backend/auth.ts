/**
 * Authentication API calls
 */

import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../apiClient';
import { SignInRequest, AuthResponse, AdminUser } from './types';

// Helper function to convert numeric IDs to strings
const convertAdminUser = (
  user: Omit<AdminUser, 'id'> & { id: string | number }
): AdminUser => ({
  ...user,
  id: String(user.id), // Ensure ID is always a string
});

export const signIn = async (
  credentials: SignInRequest,
  config?: AxiosRequestConfig
): Promise<AuthResponse | Error> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/admin/auth/signin',
      credentials,
      config
    );

    // Convert the response to ensure ID is string
    const convertedResponse: AuthResponse = {
      ...response.data,
      admin: convertAdminUser(response.data.admin),
    };

    return convertedResponse;
  } catch (error: unknown) {
    let errorMessage = 'Sign in failed. Please try again.';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    return new Error(errorMessage);
  }
};

export const signOut = async (
  accessToken: string,
  config?: AxiosRequestConfig
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    '/admin/auth/signout',
    {},
    {
      ...config,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...config?.headers,
      },
    }
  );
  return response.data;
};

export const refreshToken = async (
  refreshToken: string,
  config?: AxiosRequestConfig
): Promise<AuthResponse | Error> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/admin/auth/refresh',
      {
        refreshToken,
      },
      config
    );

    // Convert the response to ensure ID is string
    const convertedResponse: AuthResponse = {
      ...response.data,
      admin: convertAdminUser(response.data.admin),
    };

    return convertedResponse;
  } catch (error: unknown) {
    let errorMessage = 'Token refresh failed. Please sign in again.';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    return new Error(errorMessage);
  }
};
