import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getAdminLoginPageContent } from '@/requests/strapi';
import { LoginPageContent } from '@/requests/strapi/types';

/**
 * React Query hook for fetching admin login page content with caching
 * Optimizes API calls by caching the response for 5 minutes
 */
export function useAdminLoginPageData(
  options?: Omit<
    UseQueryOptions<LoginPageContent, Error>,
    'queryKey' | 'queryFn'
  >
) {
  return useQuery({
    queryKey: ['admin-login-page'],
    queryFn: getAdminLoginPageContent,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    ...options,
  });
}
