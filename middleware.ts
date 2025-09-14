import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the request is for a protected route
  const isProtectedRoute =
    pathname.startsWith('/dashboard') || pathname.startsWith('/api/protected');
  const isAuthRoute =
    pathname.startsWith('/login') || pathname.startsWith('/api/auth');

  // Skip middleware for public routes and auth routes
  if (!isProtectedRoute || isAuthRoute) {
    return NextResponse.next();
  }

  // Check for authentication cookies
  const accessToken = request.cookies.get('admin_access_token');
  const adminUser = request.cookies.get('admin_user');

  // If no auth cookies, redirect to login
  if (!accessToken || !adminUser) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add auth headers for API routes
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('Authorization', `Bearer ${accessToken.value}`);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
