/**
 * Authentication API calls
 */

import { apiClient } from '../apiClient';
import { SignInRequest, AuthResponse } from './types';

export const signIn = async (
  credentials: SignInRequest
): Promise<AuthResponse | Error> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      '/admin/auth/signin',
      credentials
    );
    return response.data;
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
  accessToken: string
): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>(
    '/admin/auth/signout',
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

export const refreshToken = async (
  refreshToken: string
): Promise<AuthResponse | Error> => {
  try {
    const response = await apiClient.post<AuthResponse>('/admin/auth/refresh', {
      refreshToken,
    });
    return response.data;
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
