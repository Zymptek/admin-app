/**
 * React Query hooks for backend API calls
 * Example usage of the backend API functions with React Query
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getDashboard, getProfile } from '@/requests/backend';

// Query keys
export const queryKeys = {
  dashboard: ['dashboard'] as const,
  profile: ['profile'] as const,
} as const;

/**
 * Hook to get dashboard data
 */
export function useDashboardData() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: async () => {
      const result = await getDashboard();
      if (result instanceof Error) {
        throw result;
      }
      return result;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get admin profile
 */
export function useAdminProfile() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const result = await getProfile();
      if (result instanceof Error) {
        throw result;
      }
      return result;
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Note: Sign in/out is handled by AuthContext, not React Query
// Use useAuth() hook for authentication operations
