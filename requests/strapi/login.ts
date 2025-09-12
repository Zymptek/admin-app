/**
 * Strapi API calls for login page content
 */

import { strapiClient } from '@/lib/strapi';
import { LoginPageResponse } from './types';

/**
 * Get admin login page content from Strapi
 * @returns Promise<LoginPageResponse>
 */
export async function getAdminLoginPageContent(): Promise<LoginPageResponse> {
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

    return response;
  } catch (error) {
    console.error('Failed to fetch admin login page content:', error);
    throw error;
  }
}
