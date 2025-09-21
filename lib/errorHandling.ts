/**
 * Centralized error handling utilities
 */

/**
 * Extract error message from various error types
 */
export function extractErrorMessage(
  error: unknown,
  fallback: string = 'An error occurred'
): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }

  return fallback;
}

/**
 * Extract error message from Axios error responses
 */
export function extractAxiosErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as {
      response?: { data?: { message?: string } };
    };
    return axiosError.response?.data?.message || fallback;
  }

  return extractErrorMessage(error, fallback);
}

/**
 * Handle API errors with consistent error extraction
 */
export function handleApiError(error: unknown, operation: string): never {
  const errorMessage = extractAxiosErrorMessage(
    error,
    `Failed to ${operation}`
  );
  throw new Error(errorMessage);
}

/**
 * Create a consistent error handler for API functions
 */
export function createApiErrorHandler(operation: string) {
  return (error: unknown): never => {
    handleApiError(error, operation);
  };
}

/**
 * Handle form validation errors with user-friendly messages
 */
export function handleFormError(error: unknown): string {
  const message = extractErrorMessage(
    error,
    'An error occurred. Please try again.'
  );

  // Common error patterns
  if (message.includes('User type must be')) {
    return 'User type must be buyer, seller, or admin.';
  } else if (message.includes('email')) {
    return 'Please provide a valid email address.';
  } else if (message.includes('password')) {
    return 'Please provide a valid password.';
  }

  return message;
}
