/**
 * Shared cookie configuration for authentication routes
 * Ensures consistent cookie settings across login and refresh endpoints
 */

export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  priority: 'high' as const,
} as const;

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...AUTH_COOKIE_OPTIONS,
  maxAge: 15 * 60, // 15 minutes
} as const;

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...AUTH_COOKIE_OPTIONS,
  maxAge: 7 * 24 * 60 * 60, // 7 days
} as const;

/**
 * Adds comprehensive cache control headers to prevent caching of auth responses
 */
export const addNoCacheHeader = (response: Response) => {
  response.headers.set(
    'Cache-Control',
    'no-store, private, max-age=0, must-revalidate'
  );
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
};
