'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { SignInRequest, AdminUser } from '../requests/backend/types';

// Auth state
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  admin: AdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
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
      payload: { admin: AdminUser; accessToken: string; refreshToken: string };
    }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  admin: null,
  accessToken: null,
  refreshToken: null,
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
        admin: action.payload.admin,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        admin: null,
        accessToken: null,
        refreshToken: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        admin: null,
        accessToken: null,
        refreshToken: null,
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
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                admin: data.admin,
                accessToken: data.accessToken,
                refreshToken: '', // Not needed for client-side
              },
            });
          } else {
            dispatch({ type: 'AUTH_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'AUTH_LOADING', payload: false });
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
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            admin: data.admin,
            accessToken: 'stored-in-cookie', // Token is stored in HttpOnly cookie
            refreshToken: 'stored-in-cookie',
          },
        });
        return { success: true };
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: data.error });
        return { success: false, error: data.error };
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
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error during sign out:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Refresh auth
  const refreshAuth = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              admin: data.admin,
              accessToken: 'stored-in-cookie',
              refreshToken: 'stored-in-cookie',
            },
          });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
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
