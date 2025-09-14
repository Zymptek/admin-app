import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from 'axios';
import { apiClient } from '@/requests/apiClient';
import { convertAdminUser } from '@/requests/backend/normalize';

// Shared header constant for consistent cache disabling
const NO_STORE = { 'cache-control': 'no-store' };

/**
 * Safely logs errors without exposing sensitive information like Authorization headers
 */
const safeLogError = (message: string, error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const errorMessage = error.message;

    if (status) {
      console.error(
        `${message}: ${errorMessage} (status: ${status}${statusText ? ` ${statusText}` : ''})`
      );
    } else {
      console.error(`${message}: ${errorMessage}`);
    }
  } else if (error instanceof Error) {
    console.error(`${message}: ${error.message}`);
  } else {
    console.error(`${message}: Unknown error occurred`);
  }
};

export async function GET(request: Request) {
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
        signal: request.signal,
      });

      return NextResponse.json({
        success: true,
        admin: convertAdminUser(response.data),
      });
    } catch (error: unknown) {
      // Handle client abort and Axios cancellation
      if (error instanceof Error && error.name === 'AbortError') {
        return new Response(null, { status: 499 }); // Client Closed Request
      }

      // Handle Axios errors
      if (axios.isAxiosError(error)) {
        // Handle Axios cancellation errors
        if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
          return new Response(null, { status: 499 }); // Client Closed Request
        }

        // Handle timeout/connection aborted errors
        if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
          return NextResponse.json(
            { success: false, error: 'Request timeout' },
            { status: 504, headers: NO_STORE }
          );
        }

        // Handle network errors (no response)
        if (!error.response) {
          return NextResponse.json(
            { success: false, error: 'Backend service unavailable' },
            { status: 502, headers: NO_STORE }
          );
        }

        // Handle upstream response errors
        const status = error.response.status;

        // Only clear cookies for 401/403 (authentication/authorization failures)
        if (status === 401 || status === 403) {
          const response = NextResponse.json(
            { success: false, error: 'Invalid or expired token' },
            { status, headers: NO_STORE }
          );

          response.cookies.delete('admin_access_token');
          response.cookies.delete('admin_refresh_token');

          return response;
        }

        // For other upstream errors, return the status without clearing cookies
        return NextResponse.json(
          { success: false, error: 'Backend error' },
          { status, headers: NO_STORE }
        );
      }

      // Handle non-Axios errors (fallback to original behavior for safety)
      safeLogError('Token validation error', error);

      const response = NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401, headers: NO_STORE }
      );

      response.cookies.delete('admin_access_token');
      response.cookies.delete('admin_refresh_token');

      return response;
    }
  } catch (error) {
    // Handle client abort and Axios cancellation
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(null, { status: 499 }); // Client Closed Request
    }

    // Handle Axios errors
    if (axios.isAxiosError(error)) {
      // Handle Axios cancellation errors
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return new Response(null, { status: 499 }); // Client Closed Request
      }

      // Handle timeout/connection aborted errors
      if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
        return NextResponse.json(
          { success: false, error: 'Request timeout' },
          { status: 504, headers: NO_STORE }
        );
      }

      // Handle network errors (no response)
      if (!error.response) {
        return NextResponse.json(
          { success: false, error: 'Backend service unavailable' },
          { status: 502, headers: NO_STORE }
        );
      }

      // Handle upstream response errors
      const status = error.response.status;

      // Only clear cookies for 401/403 (authentication/authorization failures)
      if (status === 401 || status === 403) {
        const response = NextResponse.json(
          { success: false, error: 'Invalid or expired token' },
          { status, headers: NO_STORE }
        );

        response.cookies.delete('admin_access_token');
        response.cookies.delete('admin_refresh_token');

        return response;
      }

      // For other upstream errors, return the status without clearing cookies
      return NextResponse.json(
        { success: false, error: 'Backend error' },
        { status, headers: NO_STORE }
      );
    }

    // Handle non-Axios errors
    safeLogError('Get user API error', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500, headers: NO_STORE }
    );
  }
}
