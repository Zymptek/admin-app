import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiClient } from '@/requests/apiClient';

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
        admin: response.data,
      });
    } catch (error: unknown) {
      console.error('Token validation error:', error);

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
    console.error('Get user API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
