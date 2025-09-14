import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a protected route
  const isProtectedPage = pathname.startsWith('/dashboard');
  const isProtectedApi =
    pathname.startsWith('/api/') && !pathname.startsWith('/api/auth');

  // Skip middleware for public routes and auth routes
  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  // Check for access token only - user data will be validated server-side
  const accessToken = request.cookies.get('admin_access_token');

  // Handle API routes
  if (isProtectedApi) {
    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Add auth headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('Authorization', `Bearer ${accessToken.value}`);
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Handle protected pages
  if (isProtectedPage) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/((?!auth).)*'],
};
