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
});

// Request interceptor to add auth header from localStorage
apiClient.interceptors.request.use(
  (config) => {
    // For client-side requests, get token from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const accessToken = localStorage.getItem('admin_access_token');
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.error('Failed to get token from localStorage:', error);
      }
    } else if (typeof window === 'undefined') {
      // Server-side: get token from request headers (if provided)
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

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If we get a 401, the token might be expired
    if (error.response?.status === 401) {
      console.warn('Authentication failed - token may be expired');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
