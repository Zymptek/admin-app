import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only handle API routes - let client-side handle page authentication
  const isProtectedApi =
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth');

  // Skip middleware for non-API routes
  if (!isProtectedApi) {
    return NextResponse.next();
  }

  // For API routes, we'll need to extract token from Authorization header
  // since we're now using localStorage instead of cookies
  const authHeader = request.headers.get('Authorization');
  const accessToken = authHeader?.replace('Bearer ', '');

  // Handle API routes
  if (isProtectedApi) {
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Token is already in the Authorization header, so just pass it through
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/((?!auth).)*'],
};
