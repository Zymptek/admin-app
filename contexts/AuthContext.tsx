'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { SignInRequest, AdminUser } from '../requests/backend/types';
import { signIn, signOut, refreshToken, getMe } from '../requests/backend/auth';

// Cookie management functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;secure;samesite=strict`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Auth state
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminUser | null;
  error: string | null;
}

// Auth context type
interface AuthContextType extends AuthState {
  signIn: (
    credentials: SignInRequest
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

// Action types
type AuthAction =
  | { type: 'AUTH_LOADING'; payload: boolean }
  | {
      type: 'AUTH_SUCCESS';
      payload: {
        admin: AdminUser;
      };
    }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  admin: null,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, isLoading: action.payload, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        admin: action.payload?.admin ?? null,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        admin: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        admin: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state on mount
  useEffect(() => {
    const loadAuthState = async () => {
      dispatch({ type: 'AUTH_LOADING', payload: true });

      try {
        const accessToken = getCookie('admin_access_token');
        if (!accessToken) {
          dispatch({ type: 'AUTH_LOADING', payload: false });
          return;
        }

        const result = await getMe({
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (result instanceof Error) {
          // Token is invalid, clear cookies
          deleteCookie('admin_access_token');
          deleteCookie('admin_refresh_token');
          dispatch({ type: 'AUTH_LOADING', payload: false });
        } else {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              admin: result.data,
            },
          });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        dispatch({ type: 'AUTH_LOADING', payload: false });
      }
    };

    loadAuthState();
  }, []);

  // Sign in
  const signInHandler = async (
    credentials: SignInRequest
  ): Promise<{ success: boolean; error?: string }> => {
    dispatch({ type: 'AUTH_LOADING', payload: true });
    dispatch({ type: 'CLEAR_ERROR' });

    try {
      const result = await signIn(credentials);

      if (result instanceof Error) {
        dispatch({ type: 'AUTH_FAILURE', payload: result.message });
        return { success: false, error: result.message };
      } else {
        // Store tokens in cookies
        setCookie('admin_access_token', result.accessToken, 1); // 1 day
        setCookie('admin_refresh_token', result.refreshToken, 7); // 7 days

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            admin: result.admin,
          },
        });
        return { success: true };
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Sign in failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  // Sign out
  const signOutHandler = async (): Promise<void> => {
    try {
      const accessToken = getCookie('admin_access_token');
      if (accessToken) {
        await signOut(accessToken);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      // Clear cookies
      deleteCookie('admin_access_token');
      deleteCookie('admin_refresh_token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Refresh auth
  const refreshAuth = async (): Promise<void> => {
    try {
      const refreshTokenValue = getCookie('admin_refresh_token');
      if (!refreshTokenValue) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      const result = await refreshToken(refreshTokenValue);

      if (result instanceof Error) {
        // Refresh failed, clear cookies and logout
        deleteCookie('admin_access_token');
        deleteCookie('admin_refresh_token');
        dispatch({ type: 'AUTH_LOGOUT' });
      } else {
        // Update tokens in cookies
        setCookie('admin_access_token', result.accessToken, 1); // 1 day
        setCookie('admin_refresh_token', result.refreshToken, 7); // 7 days

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            admin: result.admin,
          },
        });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      deleteCookie('admin_access_token');
      deleteCookie('admin_refresh_token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    signIn: signInHandler,
    signOut: signOutHandler,
    refreshAuth,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
