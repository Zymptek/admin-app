import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/requests/backend/auth';
import {
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
  addNoCacheHeader,
} from '@/lib/authCookies';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Call the existing backend API
    const result = await signIn({ email, password });

    if (result instanceof Error) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 401 }
      );
    }

    // Set secure HttpOnly cookies
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    // Add Cache-Control header to prevent caching of auth responses
    addNoCacheHeader(response);

    // Access token cookie (short-lived)
    response.cookies.set(
      'admin_access_token',
      result.accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS
    );

    // Refresh token cookie (longer-lived)
    response.cookies.set(
      'admin_refresh_token',
      result.refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
