import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AxiosError } from 'axios';
import { apiClient } from '@/requests/apiClient';
import { convertAdminUser } from '@/requests/backend/normalize';

/**
 * Safely logs errors without exposing sensitive information like Authorization headers
 */
const safeLogError = (message: string, error: unknown) => {
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const statusText = axiosError.response?.statusText;
    const errorMessage = axiosError.message;

    if (status) {
      console.error(
        `${message}: ${errorMessage} (status: ${status}${statusText ? ` ${statusText}` : ''})`
      );
    } else {
      console.error(`${message}: ${errorMessage}`);
    }
  } else if (error instanceof Error) {
    console.error(`${message}: ${error.message}`);
  } else {
    console.error(`${message}: Unknown error occurred`);
  }
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('admin_access_token')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      // Validate token and get user data from backend
      const response = await apiClient.get('/admin/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return NextResponse.json({
        success: true,
        admin: convertAdminUser(response.data),
      });
    } catch (error: unknown) {
      safeLogError('Token validation error', error);

      // If token is invalid, clear the access token cookie
      const response = NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );

      response.cookies.delete('admin_access_token');
      response.cookies.delete('admin_refresh_token');

      return response;
    }
  } catch (error) {
    safeLogError('Get user API error', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
