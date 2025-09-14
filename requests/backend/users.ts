/**
 * User/Admin API calls
 */

import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../apiClient';
import { DashboardResponse, ProfileResponse } from './types';
import { convertAdminUser } from './normalize';

export const getProfile = async (
  config?: AxiosRequestConfig
): Promise<ProfileResponse | Error> => {
  try {
    const response = await apiClient.get<ProfileResponse>(
      '/admin/profile',
      config
    );

    // Convert the response to ensure ID is string
    const convertedResponse: ProfileResponse = {
      ...response.data,
      data: convertAdminUser(response.data.data),
    };

    return convertedResponse;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch profile';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    return new Error(errorMessage);
  }
};

export const getDashboard = async (
  config?: AxiosRequestConfig
): Promise<DashboardResponse | Error> => {
  try {
    const response = await apiClient.get<DashboardResponse>(
      '/admin/dashboard',
      config
    );

    // Convert the response to ensure admin ID is string
    const convertedResponse: DashboardResponse = {
      ...response.data,
      data: {
        ...response.data.data,
        admin: {
          ...response.data.data.admin,
          id: String(response.data.data.admin.id), // Ensure admin ID is string
        },
      },
    };

    return convertedResponse;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch dashboard data';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    return new Error(errorMessage);
  }
};
