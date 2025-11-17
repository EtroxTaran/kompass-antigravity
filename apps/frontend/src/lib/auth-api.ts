import axios from 'axios';

/**
 * API base URL
 */
const API_BASE_URL: string =
  typeof import.meta.env['VITE_API_URL'] === 'string'
    ? import.meta.env['VITE_API_URL']
    : 'http://localhost:3000';

/**
 * Keycloak configuration
 */
const keycloakConfig = {
  url:
    typeof import.meta.env['VITE_KEYCLOAK_URL'] === 'string'
      ? import.meta.env['VITE_KEYCLOAK_URL']
      : 'http://localhost:8080',
  realm:
    typeof import.meta.env['VITE_KEYCLOAK_REALM'] === 'string'
      ? import.meta.env['VITE_KEYCLOAK_REALM']
      : 'kompass',
  clientId:
    typeof import.meta.env['VITE_KEYCLOAK_CLIENT_ID'] === 'string'
      ? import.meta.env['VITE_KEYCLOAK_CLIENT_ID']
      : 'kompass-frontend',
};

/**
 * User registration response
 */
interface RegisterResponse {
  _id: string;
  type: string;
  email: string;
  displayName: string;
  roles: string[];
  primaryRole: string;
  active: boolean;
  createdAt: string;
  modifiedAt: string;
}

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
        const errorData = error.response.data as
          | { error_description?: string }
          | undefined;
        const errorDescription =
          errorData?.error_description || 'Anmeldung fehlgeschlagen';
        throw new Error(errorDescription);
      }
      const errorData = error.response?.data as
        | { error_description?: string }
        | undefined;
      throw new Error(
        errorData?.error_description ||
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
      const errorData = error.response?.data as
        | { error_description?: string }
        | undefined;
      throw new Error(
        errorData?.error_description || 'Token-Aktualisierung fehlgeschlagen'
      );
    }
    throw new Error('Token-Aktualisierung fehlgeschlagen');
  }
}

/**
 * Register a new user
 *
 * @param email - User email address
 * @param displayName - User display name
 * @param password - User password
 * @returns Registration response with user information
 * @throws Error if registration fails
 */
export async function register(
  email: string,
  displayName: string,
  password: string
): Promise<RegisterResponse> {
  try {
    const response = await axios.post<RegisterResponse>(
      `${API_BASE_URL}/api/v1/auth/register`,
      {
        email,
        displayName,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Enhanced error logging for debugging
      console.error('Registration API error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      });

      if (error.response?.status === 409) {
        throw new Error(
          'Ein Benutzer mit dieser E-Mail-Adresse existiert bereits'
        );
      }
      if (error.response?.status === 400) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.detail ||
          'Registrierung fehlgeschlagen';
        throw new Error(errorMessage);
      }
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.detail ||
          'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
      );
    }
    throw new Error(
      'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
    );
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
