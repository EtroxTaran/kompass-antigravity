import Keycloak from 'keycloak-js';

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
 * Keycloak instance
 */
let keycloakInstance: Keycloak | null = null;

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
 * Login to Keycloak
 *
 * Redirects user to Keycloak login page.
 * After successful login, user is redirected back to the application.
 *
 * @param redirectUri - Optional redirect URI after login (defaults to current location)
 */
export async function login(redirectUri?: string): Promise<void> {
  const keycloak = await initKeycloak();

  if (keycloak.authenticated) {
    return; // Already authenticated
  }

  const options: Keycloak.KeycloakLoginOptions = {
    redirectUri: redirectUri || window.location.href,
  };

  await keycloak.login(options);
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
  const keycloak = getKeycloak();

  if (!keycloak) {
    // If Keycloak not initialized, just clear local storage
    localStorage.removeItem('keycloak-token');
    localStorage.removeItem('keycloak-refresh-token');
    window.location.href = redirectUri || '/login';
    return;
  }

  const options: Keycloak.KeycloakLogoutOptions = {
    redirectUri: redirectUri || `${window.location.origin}/login`,
  };

  await keycloak.logout(options);
}

/**
 * Get current access token
 *
 * @returns Access token or null if not authenticated
 */
export async function getAccessToken(): Promise<string | null> {
  const keycloak = getKeycloak();

  if (!keycloak || !keycloak.authenticated) {
    return null;
  }

  try {
    // Refresh token if needed (Keycloak handles this automatically)
    await keycloak.updateToken(30); // Refresh if token expires within 30 seconds
    return keycloak.token || null;
  } catch (error) {
    console.error('Failed to get access token:', error);
    // Token refresh failed, user needs to login again
    await logout();
    return null;
  }
}

/**
 * Check if user is authenticated
 *
 * @returns true if user is authenticated, false otherwise
 */
export function isAuthenticated(): boolean {
  const keycloak = getKeycloak();
  return keycloak?.authenticated ?? false;
}

/**
 * Get user information from Keycloak token
 *
 * Extracts user information from the Keycloak token and maps it to KOMPASS User type.
 *
 * @returns User object or null if not authenticated
 */
export async function getUserInfo(): Promise<User | null> {
  const keycloak = getKeycloak();

  if (!keycloak || !keycloak.authenticated || !keycloak.tokenParsed) {
    return null;
  }

  const token = keycloak.tokenParsed;
  if (!token) {
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
    roles = resourceAccess[clientId].roles;
  } else if (realmAccess?.roles) {
    roles = realmAccess.roles;
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
  const keycloak = getKeycloak();

  if (!keycloak || !keycloak.authenticated) {
    return false;
  }

  try {
    const refreshed = await keycloak.updateToken(30);
    return refreshed;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // Refresh failed, logout user
    await logout();
    return false;
  }
}

/**
 * Setup token refresh interval
 *
 * Automatically refreshes token before it expires.
 * Should be called after successful login.
 */
export function setupTokenRefresh(): void {
  const keycloak = getKeycloak();

  if (!keycloak || !keycloak.authenticated) {
    return;
  }

  // Refresh token every 5 minutes (or when it's about to expire)
  setInterval(
    async () => {
      try {
        await keycloak.updateToken(30);
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, logout user
        await logout();
      }
    },
    5 * 60 * 1000
  ); // 5 minutes
}
