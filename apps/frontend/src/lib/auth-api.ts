import axios from 'axios';

/**
 * Keycloak configuration
 */
const keycloakConfig = {
  url: import.meta.env['VITE_KEYCLOAK_URL'] || 'http://localhost:8080',
  realm: import.meta.env['VITE_KEYCLOAK_REALM'] || 'kompass',
  clientId: import.meta.env['VITE_KEYCLOAK_CLIENT_ID'] || 'kompass-frontend',
};

/**
 * Token response from Keycloak
 */
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Login with username and password using Keycloak Direct Access Grants
 *
 * @param username - User email or username
 * @param password - User password
 * @returns Token response with access and refresh tokens
 * @throws Error if login fails
 */
export async function loginWithPassword(
  username: string,
  password: string
): Promise<TokenResponse> {
  const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;

  try {
    const response = await axios.post<TokenResponse>(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'password',
        client_id: keycloakConfig.clientId,
        username,
        password,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Ungültige Anmeldedaten');
      }
      if (error.response?.status === 400) {
        const errorDescription =
          error.response.data?.error_description || 'Anmeldung fehlgeschlagen';
        throw new Error(errorDescription);
      }
      throw new Error(
        error.response?.data?.error_description ||
          'Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.'
      );
    }
    throw new Error('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
  }
}

/**
 * Refresh access token using refresh token
 *
 * @param refreshToken - Refresh token
 * @returns New token response
 * @throws Error if refresh fails
 */
export async function refreshAccessToken(
  refreshToken: string
): Promise<TokenResponse> {
  const tokenUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`;

  try {
    const response = await axios.post<TokenResponse>(
      tokenUrl,
      new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: keycloakConfig.clientId,
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error_description ||
          'Token-Aktualisierung fehlgeschlagen'
      );
    }
    throw new Error('Token-Aktualisierung fehlgeschlagen');
  }
}

/**
 * Logout from Keycloak
 *
 * @param refreshToken - Refresh token to invalidate
 */
export async function logoutFromKeycloak(refreshToken: string): Promise<void> {
  const logoutUrl = `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`;

  try {
    await axios.post(
      logoutUrl,
      new URLSearchParams({
        client_id: keycloakConfig.clientId,
        refresh_token: refreshToken,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  } catch (error) {
    // Logout errors are not critical - token may already be invalid
    console.warn('Logout request failed:', error);
  }
}
