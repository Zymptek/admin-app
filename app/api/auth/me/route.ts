import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('admin_access_token')?.value;
    const adminUser = cookieStore.get('admin_user')?.value;

    if (!accessToken || !adminUser) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      const admin = JSON.parse(adminUser);
      return NextResponse.json({
        success: true,
        admin,
      });
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid session data' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Get user API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
