/**
 * User Management API calls
 * Direct backend API calls with Axios
 */

import { AxiosRequestConfig } from 'axios';
import { apiClient } from '../apiClient';
import {
  UserListResponse,
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  SuspendUserRequest,
  UserListParams,
  DashboardResponse,
  ProfileResponse,
} from './types';
import { convertAdminUser } from './normalize';
import { handleApiError } from '../../lib/errorHandling';

/**
 * Get all users with pagination and filtering
 */
export const getUsers = async (
  params: UserListParams = {},
  config?: AxiosRequestConfig
): Promise<UserListResponse> => {
  try {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.userType) queryParams.append('userType', params.userType);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);

    const response = await apiClient.get<UserListResponse>(
      `/users?${queryParams.toString()}`,
      config
    );

    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch users';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    // Throw error instead of returning it for consistent error handling
    throw new Error(errorMessage);
  }
};

/**
 * Get a single user by ID
 */
export const getUserById = async (
  id: string,
  config?: AxiosRequestConfig
): Promise<UserResponse> => {
  try {
    const response = await apiClient.get<UserResponse>(`/users/${id}`, config);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch user';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    // Throw error instead of returning it for consistent error handling
    throw new Error(errorMessage);
  }
};

/**
 * Create a new user
 */
export const createUser = async (
  userData: CreateUserRequest,
  config?: AxiosRequestConfig
): Promise<UserResponse> => {
  try {
    const response = await apiClient.post<UserResponse>(
      '/users',
      userData,
      config
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error, 'create user');
  }
};

/**
 * Update a user
 */
export const updateUser = async (
  id: string,
  userData: UpdateUserRequest,
  config?: AxiosRequestConfig
): Promise<UserResponse> => {
  try {
    const response = await apiClient.put<UserResponse>(
      `/users/${id}`,
      userData,
      config
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to update user';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    // Throw error instead of returning it for consistent error handling
    throw new Error(errorMessage);
  }
};

/**
 * Suspend a user
 */
export const suspendUser = async (
  id: string,
  suspendData: SuspendUserRequest = {},
  config?: AxiosRequestConfig
): Promise<UserResponse> => {
  try {
    const response = await apiClient.patch<UserResponse>(
      `/users/${id}/suspend`,
      suspendData,
      config
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to suspend user';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    // Throw error instead of returning it for consistent error handling
    throw new Error(errorMessage);
  }
};

/**
 * Unsuspend a user
 */
export const unsuspendUser = async (
  id: string,
  config?: AxiosRequestConfig
): Promise<UserResponse> => {
  try {
    const response = await apiClient.patch<UserResponse>(
      `/users/${id}/unsuspend`,
      {},
      config
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to unsuspend user';

    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      errorMessage = axiosError.response?.data?.message || errorMessage;
    }

    // Throw error instead of returning it for consistent error handling
    throw new Error(errorMessage);
  }
};

/**
 * Get admin profile
 */
export const getProfile = async (
  config?: AxiosRequestConfig
): Promise<ProfileResponse> => {
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

    // Throw error instead of returning it for consistent error handling
    throw new Error(errorMessage);
  }
};

/**
 * Get dashboard data
 */
export const getDashboard = async (
  config?: AxiosRequestConfig
): Promise<DashboardResponse> => {
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

    // Throw error instead of returning it for consistent error handling
    throw new Error(errorMessage);
  }
};
