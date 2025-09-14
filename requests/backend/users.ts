/**
 * User/Admin API calls
 */

import { apiClient } from '../apiClient';
import { DashboardResponse, ProfileResponse } from './types';

export const getProfile = async (): Promise<ProfileResponse | Error> => {
  try {
    const response = await apiClient.get<ProfileResponse>('/admin/profile');
    return response.data;
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

export const getDashboard = async (): Promise<DashboardResponse | Error> => {
  try {
    const response = await apiClient.get<DashboardResponse>('/admin/dashboard');
    return response.data;
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
