import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { signOut } from '@/requests/backend/auth';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('admin_access_token')?.value;

    // Call backend logout if we have a token
    if (accessToken) {
      const result = await signOut(accessToken);
      if (result instanceof Error) {
        console.error('Backend logout error:', result.message);
        // Continue with cookie cleanup even if backend fails
      }
    }

    // Create response and clear all auth cookies
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful',
    });

    response.cookies.delete('admin_access_token');
    response.cookies.delete('admin_refresh_token');

    return response;
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
