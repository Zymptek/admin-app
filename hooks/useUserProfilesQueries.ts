/**
 * React Query hooks for user profiles data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfilesPageContent } from '@/requests/strapi';
import {
  UserListParams,
  CreateUserRequest,
  UpdateUserRequest,
  SuspendUserRequest,
} from '@/requests/backend';
import {
  getUsers,
  createUser,
  updateUser,
  suspendUser,
  unsuspendUser,
} from '@/requests/backend/users';
import { FormData } from '@/requests/strapi';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  try {
    return localStorage.getItem('admin_access_token');
  } catch (error) {
    console.error('Failed to get auth token from localStorage:', error);
    return null;
  }
};

// Query keys
export const userProfilesQueryKeys = {
  pageContent: ['user-profiles', 'content'] as const,
  users: (params: UserListParams) => ['users', params] as const,
  user: (id: string) => ['user', id] as const,
} as const;

/**
 * Hook to get user profiles page content from Strapi
 */
export function useUserProfilesPageContent() {
  return useQuery({
    queryKey: userProfilesQueryKeys.pageContent,
    queryFn: async () => {
      const result = await getUserProfilesPageContent();
      if (result instanceof Error) {
        throw result;
      }
      return result;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - Strapi content rarely changes
    gcTime: 60 * 60 * 1000, // 1 hour - Keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
}

/**
 * Hook to get users list with pagination and filtering
 */
export function useUsers(params: UserListParams = {}) {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: userProfilesQueryKeys.users(params),
    queryFn: async () => {
      // Get auth token from cookies
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await getUsers(params, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result instanceof Error) {
        throw result;
      }

      return result;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes - Users data changes less frequently
    gcTime: 10 * 60 * 1000, // 10 minutes - Keep in cache longer
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: false, // Don't refetch on component mount if data exists
  });
}

/**
 * Hook to create a new user
 */
export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserRequest) => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await createUser(userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result instanceof Error) {
        throw result;
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate users list to refresh data
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
    },
  });
}

/**
 * Hook to update a user
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      userData,
    }: {
      id: string;
      userData: UpdateUserRequest;
    }) => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await updateUser(id, userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result instanceof Error) {
        throw result;
      }

      return result;
    },
    onSuccess: (_, { id }) => {
      // Invalidate users list and specific user
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      queryClient.invalidateQueries({
        queryKey: userProfilesQueryKeys.user(id),
      });
    },
  });
}

/**
 * Hook to suspend a user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      suspendData,
    }: {
      id: string;
      suspendData?: SuspendUserRequest;
    }) => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await suspendUser(id, suspendData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result instanceof Error) {
        throw result;
      }

      return result;
    },
    onSuccess: (_, { id }) => {
      // Invalidate users list and specific user
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      queryClient.invalidateQueries({
        queryKey: userProfilesQueryKeys.user(id),
      });
    },
  });
}

/**
 * Hook to unsuspend a user
 */
export function useUnsuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = getAuthToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      const result = await unsuspendUser(id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (result instanceof Error) {
        throw result;
      }

      return result;
    },
    onSuccess: (_, id) => {
      // Invalidate users list and specific user
      queryClient.invalidateQueries({
        queryKey: ['users'],
      });
      queryClient.invalidateQueries({
        queryKey: userProfilesQueryKeys.user(id),
      });
    },
  });
}

/**
 * Helper function to transform form data to backend format
 */
export function transformFormDataToBackend(
  formData: FormData,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formConfig: any
): CreateUserRequest | UpdateUserRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transformed: any = {};

  // Map form fields to backend fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formConfig.formFields.forEach((field: any) => {
    const value = formData[field.fieldKey];
    if (value !== undefined && value !== '') {
      switch (field.fieldKey) {
        case 'name':
          // Split name into firstName and lastName
          const nameParts = (value as string).split(' ');
          transformed.firstName = nameParts[0];
          if (nameParts.length > 1) {
            transformed.lastName = nameParts.slice(1).join(' ');
          }
          break;
        case 'email':
          transformed.email = value;
          break;
        case 'password':
          transformed.password = value;
          break;
        case 'userType':
          transformed.userType = value;
          break;
        case 'company':
          transformed.companyName = value;
          break;
        case 'country':
          transformed.country = value;
          break;
        default:
          transformed[field.fieldKey] = value;
      }
    }
  });

  return transformed;
}

/**
 * Helper function to transform backend user data to form format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformBackendDataToForm(user: any): FormData {
  return {
    name:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || '',
    email: user.email || '',
    userType: user.userType || '',
    company: user.companyName || '',
    country: user.country || '',
    // Add other fields as needed
  };
}
