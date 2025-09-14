import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { refreshToken } from '@/requests/backend/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshTokenValue = cookieStore.get('admin_refresh_token')?.value;

    if (!refreshTokenValue) {
      return NextResponse.json(
        { success: false, error: 'No refresh token found' },
        { status: 401 }
      );
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

    response.cookies.set('admin_access_token', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
      path: '/',
    });

    response.cookies.set('admin_refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Refresh token API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
