/**
 * React Query hooks for backend API calls
 * Example usage of the backend API functions with React Query
 */

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { getDashboard, getProfile } from '@/requests/backend';

// Query keys - scoped per user to avoid cross-session leakage
export const queryKeys = {
  dashboard: (userId: string) => ['dashboard', userId] as const,
  profile: (userId: string) => ['profile', userId] as const,
} as const;

/**
 * Hook to get dashboard data
 */
export function useDashboardData() {
  const { isAuthenticated, admin } = useAuth();
  const userId = admin?.id;

  return useQuery({
    queryKey: userId ? queryKeys.dashboard(userId) : ['dashboard'],
    queryFn: async ({ signal }) => {
      const result = await getDashboard({ signal });
      if (result instanceof Error) {
        throw result;
      }
      return result;
    },
    enabled: isAuthenticated && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get admin profile
 */
export function useAdminProfile() {
  const { isAuthenticated, admin } = useAuth();
  const userId = admin?.id;

  return useQuery({
    queryKey: userId ? queryKeys.profile(userId) : ['profile'],
    queryFn: async ({ signal }) => {
      const result = await getProfile({ signal });
      if (result instanceof Error) {
        throw result;
      }
      return result;
    },
    enabled: isAuthenticated && !!userId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Note: Sign in/out is handled by AuthContext, not React Query
// Use useAuth() hook for authentication operations
