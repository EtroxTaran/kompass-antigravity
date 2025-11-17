import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  initKeycloak,
  login as keycloakLogin,
  logout as keycloakLogout,
  isAuthenticated,
  getUserInfo,
  getAccessToken,
  refreshToken,
  setupTokenRefresh,
} from '../lib/auth';

import type { User } from '@kompass/shared';

/**
 * Auth context state
 */
interface AuthContextType {
  /** Current authenticated user */
  user: User | null;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is being loaded */
  isLoading: boolean;
  /** Error message if authentication failed */
  error: string | null;
  /** Login function */
  login: (redirectUri?: string) => Promise<void>;
  /** Logout function */
  logout: (redirectUri?: string) => Promise<void>;
  /** Get access token */
  getToken: () => Promise<string | null>;
  /** Refresh user info */
  refreshUserInfo: () => Promise<void>;
}

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Auth provider props
 */
interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Auth Provider
 *
 * Provides authentication state and functions to the application.
 * Initializes Keycloak on mount and manages authentication state.
 */
export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load user information from Keycloak token
   */
  const loadUserInfo = useCallback(async (): Promise<void> => {
    try {
      const userInfo = await getUserInfo();
      setUser(userInfo);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load user information';
      setError(errorMessage);
      setUser(null);
    }
  }, []);

  /**
   * Initialize authentication
   */
  useEffect(() => {
    let mounted = true;

    async function initializeAuth(): Promise<void> {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize Keycloak
        await initKeycloak();

        if (!mounted) return;

        // Check if user is authenticated
        if (isAuthenticated()) {
          // Load user information
          await loadUserInfo();

          // Setup automatic token refresh
          setupTokenRefresh();
        } else {
          setUser(null);
        }
      } catch (err) {
        if (!mounted) return;
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to initialize authentication';
        setError(errorMessage);
        setUser(null);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, [loadUserInfo]);

  /**
   * Login function
   */
  const login = useCallback(async (redirectUri?: string): Promise<void> => {
    try {
      setError(null);
      await keycloakLogin(redirectUri);
      // After login, Keycloak will redirect back to the app
      // The useEffect will handle loading user info
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Logout function
   */
  const logout = useCallback(async (redirectUri?: string): Promise<void> => {
    try {
      setError(null);
      setUser(null);
      await keycloakLogout(redirectUri);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Logout failed';
      setError(errorMessage);
      throw err;
    }
  }, []);

  /**
   * Get access token
   */
  const getToken = useCallback(async (): Promise<string | null> => {
    try {
      return await getAccessToken();
    } catch (err) {
      console.error('Failed to get access token:', err);
      return null;
    }
  }, []);

  /**
   * Refresh user info
   */
  const refreshUserInfo = useCallback(async (): Promise<void> => {
    try {
      // Refresh token first
      const refreshed = await refreshToken();
      if (refreshed) {
        // Reload user info
        await loadUserInfo();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to refresh user info';
      setError(errorMessage);
    }
  }, [loadUserInfo]);

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    error,
    login,
    logout,
    getToken,
    refreshUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 *
 * @returns Auth context value
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
