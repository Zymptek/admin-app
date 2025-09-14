import axios from 'axios';

/**
 * Centralized Axios client for all API requests
 * Provides consistent configuration, interceptors, and error handling
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
if (!API_BASE_URL) {
  throw new Error(
    'Missing NEXT_PUBLIC_BACKEND_API_URL environment variable. Please set it in your environment configuration.'
  );
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor to add auth header from cookies
apiClient.interceptors.request.use(
  (config) => {
    // For client-side requests, the Authorization header will be set by the middleware
    // For server-side requests, we need to get the token from cookies
    if (typeof window === 'undefined') {
      // Server-side: get token from request headers
      const authHeader = config.headers?.Authorization;
      if (authHeader) {
        config.headers.Authorization = authHeader;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
