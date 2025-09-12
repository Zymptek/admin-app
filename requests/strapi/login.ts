/**
 * Strapi API calls for login page content
 */

import { strapiClient } from '@/lib/strapi';
import { LoginPageResponse, LoginPageContent } from './types';

/**
 * Get admin login page content from Strapi
 * @returns Promise<LoginPageContent> - Flattened content without Strapi wrapper
 */
export async function getAdminLoginPageContent(): Promise<LoginPageContent> {
  try {
    const response = await strapiClient.get<LoginPageResponse>(
      '/api/admin-login-page',
      {
        populate: {
          logo: true,
          form: {
            populate: {
              fields: true,
            },
          },
        },
      }
    );

    // Normalize Strapi v4 response structure
    if (!response || !response.data) {
      throw new Error('Invalid response: missing data');
    }

    // Handle single object response - flatten attributes
    return response.data;
  } catch (error) {
    console.error('Failed to fetch admin login page content:', error);
    throw error;
  }
}
