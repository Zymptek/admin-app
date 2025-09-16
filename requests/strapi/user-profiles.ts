/**
 * User Profiles Page Content API
 */

import { strapiClient } from '@/lib/strapi';
import { UserProfilesPageContent, UserProfilesPageResponse } from './types';

/**
 * Fetch user profiles page content from Strapi
 */
export const getUserProfilesPageContent = async (): Promise<
  UserProfilesPageContent | Error
> => {
  try {
    const response = await strapiClient.get<UserProfilesPageResponse>(
      '/api/user-profiles',
      {
        populate: {
          createUserForm: {
            populate: {
              formFields: true,
            },
          },
          editUserForm: {
            populate: {
              formFields: true,
            },
          },
          tableColumns: true,
          statisticsCards: true,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch user profiles page content';

    if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as Error).message;
    }

    return new Error(errorMessage);
  }
};
