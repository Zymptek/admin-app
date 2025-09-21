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

// Token storage management functions
const setToken = (name: string, value: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  }
};

const getToken = (name: string): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  }
  return null;
};

const removeToken = (name: string): void => {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }
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
        const accessToken = getToken('admin_access_token');
        if (!accessToken) {
          dispatch({ type: 'AUTH_LOGOUT' });
          return;
        }

        const result = await getMe({
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (result instanceof Error) {
          // Token is invalid, try to refresh token first
          const refreshTokenValue = getToken('admin_refresh_token');

          if (refreshTokenValue) {
            const refreshResult = await refreshToken(refreshTokenValue);

            if (refreshResult instanceof Error) {
              // Refresh failed, clear tokens and logout
              removeToken('admin_access_token');
              removeToken('admin_refresh_token');
              dispatch({ type: 'AUTH_LOGOUT' });
            } else {
              // Refresh successful, update tokens and set auth state
              setToken('admin_access_token', refreshResult.accessToken);
              setToken('admin_refresh_token', refreshResult.refreshToken);
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                  admin: refreshResult.admin,
                },
              });
            }
          } else {
            // No refresh token, clear tokens and logout
            removeToken('admin_access_token');
            removeToken('admin_refresh_token');
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } else {
          // Access token is valid, set auth state
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              admin: result.data,
            },
          });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        // Clear tokens and logout on any unexpected error
        removeToken('admin_access_token');
        removeToken('admin_refresh_token');
        dispatch({ type: 'AUTH_LOGOUT' });
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
        // Store tokens in localStorage
        setToken('admin_access_token', result.accessToken);
        setToken('admin_refresh_token', result.refreshToken);

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
      const accessToken = getToken('admin_access_token');
      if (accessToken) {
        await signOut(accessToken);
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      // Clear tokens
      removeToken('admin_access_token');
      removeToken('admin_refresh_token');
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Refresh auth
  const refreshAuth = async (): Promise<void> => {
    try {
      const refreshTokenValue = getToken('admin_refresh_token');
      if (!refreshTokenValue) {
        dispatch({ type: 'AUTH_LOGOUT' });
        return;
      }

      const result = await refreshToken(refreshTokenValue);

      if (result instanceof Error) {
        // Refresh failed, clear tokens and logout
        removeToken('admin_access_token');
        removeToken('admin_refresh_token');
        dispatch({ type: 'AUTH_LOGOUT' });
      } else {
        // Update tokens in localStorage
        setToken('admin_access_token', result.accessToken);
        setToken('admin_refresh_token', result.refreshToken);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            admin: result.admin,
          },
        });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      removeToken('admin_access_token');
      removeToken('admin_refresh_token');
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
