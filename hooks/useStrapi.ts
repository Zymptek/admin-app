/**
 * Simple Strapi hooks for dynamic content
 * Basic hooks for fetching content from Strapi
 */

import { useQuery } from '@tanstack/react-query';
import { strapiClient } from '@/lib/strapi';

/**
 * Generic hook for fetching any content from Strapi
 */
export function useStrapiContent<T>(
  contentType: string,
  params?: {
    populate?: string | string[];
    filters?: Record<string, unknown>;
    sort?: string | string[];
    pagination?: {
      page?: number;
      pageSize?: number;
    };
    locale?: string;
  }
) {
  return useQuery({
    queryKey: ['strapi', contentType, params],
    queryFn: () => strapiClient.getContent<T>(contentType, params),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook for fetching single content item by ID
 */
export function useStrapiContentById<T>(
  contentType: string,
  id: string | number
) {
  return useQuery({
    queryKey: ['strapi', contentType, id],
    queryFn: () => strapiClient.getContentById<T>(contentType, id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook for fetching content with fallback
 */
export function useStrapiContentWithFallback<T>(
  contentType: string,
  fallback: T,
  params?: {
    populate?: string | string[];
    filters?: Record<string, unknown>;
    sort?: string | string[];
    pagination?: {
      page?: number;
      pageSize?: number;
    };
    locale?: string;
  }
) {
  const { data, isLoading, isError, error } = useStrapiContent<T>(contentType, params);

  return {
    data: data || fallback,
    isLoading,
    isError,
    error,
    hasData: !!data,
  };
}
