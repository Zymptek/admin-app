import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshToken } from '@/requests/backend/auth';
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  addNoCacheHeader,
} from '@/lib/authCookies';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshTokenValue = cookieStore.get('admin_refresh_token')?.value;

    if (!refreshTokenValue) {
      // Clear stale auth cookies when no refresh token is found
      const response = NextResponse.json(
        { success: false, error: 'No refresh token found' },
        { status: 401 }
      );

      response.cookies.delete('admin_access_token');
      response.cookies.delete('admin_refresh_token');

      return response;
    }

    // Call the existing backend API
    const result = await refreshToken(refreshTokenValue);

    if (result instanceof Error) {
      // Clear cookies if refresh fails
      const response = NextResponse.json(
        { success: false, error: result.message },
        { status: 401 }
      );

      response.cookies.delete('admin_access_token');
      response.cookies.delete('admin_refresh_token');

      return response;
    }

    // Create response and update cookies with new tokens
    const response = NextResponse.json({
      success: true,
      message: 'Token refreshed successfully',
    });

    // Add Cache-Control header to prevent caching of auth responses
    addNoCacheHeader(response);

    response.cookies.set(
      'admin_access_token',
      result.accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS
    );
    response.cookies.set(
      'admin_refresh_token',
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    console.error('Refresh token API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
