import axios from 'axios';

import { getAccessToken, logout } from './auth';

import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

/**
 * API base URL from environment variable
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - Add JWT token to requests
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Get access token from Keycloak
    const token = await getAccessToken();

    if (token && config.headers) {
      // Add Bearer token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle 401 errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const token = await getAccessToken();

        if (token && originalRequest.headers) {
          // Update Authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Retry the original request
          return apiClient(originalRequest);
        } else {
          // Token refresh failed, logout user
          await logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Token refresh failed, logout user
        await logout();
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just reject
    return Promise.reject(error);
  }
);

/**
 * Export the configured axios instance
 */
export default apiClient;

/**
 * Helper function to handle API errors
 *
 * @param error - Axios error
 * @returns Error message
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{
      message?: string;
      detail?: string;
    }>;

    // Try to extract error message from response
    if (axiosError.response?.data) {
      const data = axiosError.response.data;

      if (typeof data === 'string') {
        return data;
      }

      if (data.message) {
        return data.message;
      }

      if (data.detail) {
        return data.detail;
      }

      // Try to get error from RFC 7807 Problem Details format
      if ('title' in data && typeof data.title === 'string') {
        return data.title;
      }
    }

    // Fallback to HTTP status text
    if (axiosError.response?.statusText) {
      return axiosError.response.statusText;
    }

    // Network error
    if (axiosError.message) {
      return axiosError.message;
    }
  }

  // Unknown error
  if (error instanceof Error) {
    return error.message;
  }

  return 'An unknown error occurred';
}
