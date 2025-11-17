import { jwtDecode } from 'jwt-decode';
import Keycloak from 'keycloak-js';

import {
  loginWithPassword,
  refreshAccessToken,
  logoutFromKeycloak,
} from './auth-api';

import type { User } from '@kompass/shared';

/**
 * Keycloak configuration
 */
const keycloakConfig = {
  url: import.meta.env['VITE_KEYCLOAK_URL'] || 'http://localhost:8080',
  realm: import.meta.env['VITE_KEYCLOAK_REALM'] || 'kompass',
  clientId: import.meta.env['VITE_KEYCLOAK_CLIENT_ID'] || 'kompass-frontend',
};

/**
 * Keycloak instance (for backward compatibility, but not used for embedded login)
 */
let keycloakInstance: Keycloak | null = null;

/**
 * Token storage in memory (not localStorage for security)
 */
interface TokenStorage {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

let tokenStorage: TokenStorage = {
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
};

/**
 * Token refresh interval ID (for cleanup on logout)
 */
let tokenRefreshIntervalId: NodeJS.Timeout | null = null;

/**
 * Initialize Keycloak client
 *
 * @returns Promise that resolves when Keycloak is initialized
 */
export async function initKeycloak(): Promise<Keycloak> {
  if (keycloakInstance) {
    return keycloakInstance;
  }

  keycloakInstance = new Keycloak(keycloakConfig);

  try {
    await keycloakInstance.init({
      onLoad: 'check-sso', // Check SSO status silently
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
      pkceMethod: 'S256', // Use PKCE for security
      checkLoginIframe: false, // Disable iframe check for better performance
    });

    return keycloakInstance;
  } catch (error) {
    console.error('Failed to initialize Keycloak:', error);
    throw error;
  }
}

/**
 * Get Keycloak instance
 *
 * @returns Keycloak instance or null if not initialized
 */
export function getKeycloak(): Keycloak | null {
  return keycloakInstance;
}

/**
 * Login to Keycloak using Direct Access Grants (embedded form)
 *
 * Uses username/password to get tokens directly without redirect.
 *
 * @param username - User email or username
 * @param password - User password
 * @returns Promise that resolves when login is successful
 */
export async function login(username: string, password: string): Promise<void> {
  try {
    const tokenResponse = await loginWithPassword(username, password);

    // Store tokens in memory
    const expiresIn = tokenResponse.expires_in || 300; // Default 5 minutes
    tokenStorage = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    // Also initialize Keycloak instance for backward compatibility
    // This allows existing code that uses keycloakInstance to continue working
    if (!keycloakInstance) {
      keycloakInstance = new Keycloak(keycloakConfig);
      await keycloakInstance.init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
      });
    }

    // Manually set authenticated state on Keycloak instance
    // This is a workaround since we're using direct grants
    if (keycloakInstance) {
      // Update token in Keycloak instance
      (keycloakInstance as any).token = tokenResponse.access_token;
      (keycloakInstance as any).refreshToken = tokenResponse.refresh_token;
      (keycloakInstance as any).authenticated = true;
      (keycloakInstance as any).tokenParsed = jwtDecode(
        tokenResponse.access_token
      );
    }
  } catch (error) {
    // Clear tokens on error
    tokenStorage = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    };
    throw error;
  }
}

/**
 * Logout from Keycloak
 *
 * Invalidates the session in Keycloak and clears local tokens.
 * Redirects user to login page or specified redirect URI.
 *
 * @param redirectUri - Optional redirect URI after logout (defaults to login page)
 */
export async function logout(redirectUri?: string): Promise<void> {
  // Cancel token refresh interval to prevent memory leaks
  cancelTokenRefresh();

  // Invalidate refresh token in Keycloak
  if (tokenStorage.refreshToken) {
    try {
      await logoutFromKeycloak(tokenStorage.refreshToken);
    } catch (error) {
      // Logout errors are not critical
      console.warn('Failed to invalidate refresh token:', error);
    }
  }

  // Clear tokens
  tokenStorage = {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  };

  // Clear Keycloak instance
  if (keycloakInstance) {
    keycloakInstance.logout({
      redirectUri: redirectUri || `${window.location.origin}/login`,
    });
    keycloakInstance = null;
  } else {
    // If Keycloak not initialized, just redirect
    window.location.href = redirectUri || '/login';
  }
}

/**
 * Get current access token
 *
 * Automatically refreshes token if it's about to expire.
 *
 * @returns Access token or null if not authenticated
 */
export async function getAccessToken(): Promise<string | null> {
  if (!tokenStorage.accessToken) {
    return null;
  }

  // Check if token is about to expire (within 30 seconds)
  const now = Date.now();
  const expiresAt = tokenStorage.expiresAt || 0;
  const timeUntilExpiry = expiresAt - now;

  if (timeUntilExpiry < 30000 && tokenStorage.refreshToken) {
    // Token expires within 30 seconds, refresh it
    try {
      const tokenResponse = await refreshAccessToken(tokenStorage.refreshToken);
      const expiresIn = tokenResponse.expires_in || 300;
      tokenStorage = {
        accessToken: tokenResponse.access_token,
        refreshToken: tokenResponse.refresh_token,
        expiresAt: Date.now() + expiresIn * 1000,
      };

      // Update Keycloak instance if it exists
      if (keycloakInstance) {
        (keycloakInstance as any).token = tokenResponse.access_token;
        (keycloakInstance as any).refreshToken = tokenResponse.refresh_token;
        (keycloakInstance as any).tokenParsed = jwtDecode(
          tokenResponse.access_token
        );
      }

      return tokenStorage.accessToken;
    } catch (error) {
      console.error('Failed to refresh access token:', error);
      // Token refresh failed, clear tokens
      tokenStorage = {
        accessToken: null,
        refreshToken: null,
        expiresAt: null,
      };
      return null;
    }
  }

  return tokenStorage.accessToken;
}

/**
 * Check if user is authenticated
 *
 * @returns true if user is authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  if (tokenStorage.accessToken) {
    // Check if token is still valid
    const now = Date.now();
    const expiresAt = tokenStorage.expiresAt || 0;
    if (expiresAt > now) {
      return true;
    }
    // Token expired
    tokenStorage = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    };
  }
  return false;
}

/**
 * Get user information from Keycloak token
 *
 * Extracts user information from the Keycloak token and maps it to KOMPASS User type.
 *
 * @returns User object or null if not authenticated
 */
export async function getUserInfo(): Promise<User | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return null;
  }

  let token: Record<string, unknown>;
  try {
    token = jwtDecode(accessToken);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }

  const userId = token['sub'] as string | undefined;
  const email =
    (token['email'] as string | undefined) ||
    (token['preferred_username'] as string | undefined);

  if (!userId || !email) {
    return null;
  }

  // Extract roles from token
  // Priority: resource_access.{client-id}.roles > realm_access.roles
  const clientId = keycloakConfig.clientId;
  let roles: string[] = [];

  const resourceAccess = token['resource_access'] as
    | Record<string, { roles?: string[] }>
    | undefined;
  const realmAccess = token['realm_access'] as { roles?: string[] } | undefined;

  if (resourceAccess?.[clientId]?.roles) {
    roles = resourceAccess[clientId].roles || [];
  } else if (realmAccess?.roles) {
    roles = realmAccess.roles || [];
  }

  // Map Keycloak roles to KOMPASS UserRole enum
  // This should match the backend mapping
  const kompassRoles = roles
    .map((role) => role.toUpperCase())
    .filter((role) =>
      ['ADM', 'INNEN', 'PLAN', 'KALK', 'BUCH', 'GF', 'ADMIN'].includes(role)
    ) as User['roles'];

  if (kompassRoles.length === 0) {
    return null; // User has no valid roles
  }

  // Return user object
  // Note: This is a partial User object - full user data should be fetched from backend if needed
  return {
    _id: `user-${userId}`,
    _rev: '',
    type: 'user',
    email,
    displayName: (token['preferred_username'] as string | undefined) || email,
    roles: kompassRoles,
    primaryRole: kompassRoles[0]!, // Use first role as primary (non-null assertion since we check length > 0)
    active: true,
    createdBy: 'system',
    createdAt: new Date(),
    modifiedBy: 'system',
    modifiedAt: new Date(),
    version: 1,
  };
}

/**
 * Refresh access token
 *
 * Attempts to refresh the access token using the refresh token.
 * If refresh fails, user will need to login again.
 *
 * @returns true if token was refreshed, false otherwise
 */
export async function refreshToken(): Promise<boolean> {
  if (!tokenStorage.refreshToken) {
    return false;
  }

  try {
    const tokenResponse = await refreshAccessToken(tokenStorage.refreshToken);
    const expiresIn = tokenResponse.expires_in || 300;
    tokenStorage = {
      accessToken: tokenResponse.access_token,
      refreshToken: tokenResponse.refresh_token,
      expiresAt: Date.now() + expiresIn * 1000,
    };

    // Update Keycloak instance if it exists
    if (keycloakInstance) {
      (keycloakInstance as any).token = tokenResponse.access_token;
      (keycloakInstance as any).refreshToken = tokenResponse.refresh_token;
      (keycloakInstance as any).tokenParsed = jwtDecode(
        tokenResponse.access_token
      );
    }

    return true;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Clear tokens on refresh failure
    tokenStorage = {
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
    };
    return false;
  }
}

/**
 * Setup token refresh interval
 *
 * Automatically refreshes token before it expires.
 * Should be called after successful login.
 *
 * @returns Interval ID that can be used to cancel the refresh
 */
export function setupTokenRefresh(): NodeJS.Timeout | null {
  // Clear any existing interval
  if (tokenRefreshIntervalId) {
    clearInterval(tokenRefreshIntervalId);
    tokenRefreshIntervalId = null;
  }

  // Check if user is authenticated
  if (!isAuthenticated()) {
    return null;
  }

  // Refresh token every 5 minutes (or when it's about to expire)
  tokenRefreshIntervalId = setInterval(
    async () => {
      // Check if still authenticated before attempting refresh
      if (!isAuthenticated()) {
        // User logged out, clear interval
        if (tokenRefreshIntervalId) {
          clearInterval(tokenRefreshIntervalId);
          tokenRefreshIntervalId = null;
        }
        return;
      }

      try {
        // Use the refreshToken function from auth.ts instead of keycloak.updateToken()
        const success = await refreshToken();
        if (!success) {
          // Token refresh failed, logout user
          await logout();
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, logout user
        await logout();
      }
    },
    5 * 60 * 1000
  ); // 5 minutes

  return tokenRefreshIntervalId;
}

/**
 * Cancel token refresh interval
 *
 * Should be called on logout to prevent memory leaks.
 */
export function cancelTokenRefresh(): void {
  if (tokenRefreshIntervalId) {
    clearInterval(tokenRefreshIntervalId);
    tokenRefreshIntervalId = null;
  }
}
