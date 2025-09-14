/**
 * Shared normalization utilities for backend API responses
 */

import { AdminUser } from './types';

/**
 * Helper function to convert numeric IDs to strings
 * Ensures consistent ID format across the application
 */
export const convertAdminUser = (
  user: Omit<AdminUser, 'id'> & { id: string | number }
): AdminUser => ({
  ...user,
  id: String(user.id), // Ensure ID is always a string
});
