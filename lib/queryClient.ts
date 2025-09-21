'use client';

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default
      gcTime: 1000 * 60 * 10, // 10 minutes default
      retry: 2,
      refetchOnWindowFocus: false, // Disable refetch on window focus globally
      refetchOnMount: false, // Don't refetch on mount if data exists
      refetchOnReconnect: true, // Only refetch on reconnect
    },
  },
});
