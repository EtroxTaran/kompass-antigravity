import {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  ReactNode,
} from "react";
import {
  setAuthToken,
  clearAuthToken,
  authApi,
  ApiError,
} from "@/services/apiClient";

// Keycloak Configuration
const KEYCLOAK_URL =
  import.meta.env.VITE_KEYCLOAK_URL || "http://localhost:8080";
const KEYCLOAK_REALM = import.meta.env.VITE_KEYCLOAK_REALM || "kompass";
const KEYCLOAK_CLIENT_ID =
  import.meta.env.VITE_KEYCLOAK_CLIENT_ID || "kompass-web";

interface User {
  _id: string;
  email: string;
  displayName: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  primaryRole: string;
  active: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Generate PKCE code verifier
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Generate PKCE code challenge from verifier
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const base64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Build Keycloak authorization URL
 */
async function buildAuthUrl(): Promise<string> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  sessionStorage.setItem("pkce_code_verifier", codeVerifier);

  const redirectUri = `${window.location.origin}/auth/callback`;

  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    response_type: "code",
    scope: "openid profile email",
    redirect_uri: redirectUri,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    state: crypto.randomUUID(),
  });

  return `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?${params}`;
}

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
}> {
  const codeVerifier = sessionStorage.getItem("pkce_code_verifier");
  sessionStorage.removeItem("pkce_code_verifier");

  if (!codeVerifier) {
    throw new Error("PKCE code verifier not found");
  }

  const redirectUri = `${window.location.origin}/auth/callback`;

  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: KEYCLOAK_CLIENT_ID,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.error_description || "Failed to exchange code for tokens",
    );
  }

  return response.json();
}

/**
 * Build Keycloak logout URL
 */
function buildLogoutUrl(): string {
  const redirectUri = `${window.location.origin}/`;

  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    post_logout_redirect_uri: redirectUri,
  });

  return `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout?${params}`;
}

interface AuthProviderProps {
  children: ReactNode;
  useMockAuth?: boolean;
}

/**
 * Auth Provider Component
 */
export function AuthProvider({
  children,
  useMockAuth = false,
}: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
  });

  const fetchUser = useCallback(async () => {
    try {
      const user = await authApi.getMe();
      setState({
        isAuthenticated: true,
        isLoading: false,
        user,
        error: null,
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthToken();
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
      } else {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to fetch user profile",
        }));
      }
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code && window.location.pathname === "/auth/callback") {
        try {
          const tokens = await exchangeCodeForTokens(code);
          setAuthToken(tokens.access_token);

          if (tokens.refresh_token) {
            localStorage.setItem("refresh_token", tokens.refresh_token);
          }

          window.history.replaceState({}, "", "/");
          await fetchUser();
        } catch (err) {
          setState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: "Authentication failed",
          });
        }
        return;
      }

      const existingToken = localStorage.getItem("auth_token");
      if (existingToken) {
        setAuthToken(existingToken);
        await fetchUser();
      } else if (useMockAuth) {
        setAuthToken("mock-token");
        setState({
          isAuthenticated: true,
          isLoading: false,
          user: {
            _id: "user-mock",
            email: "admin@kompass.local",
            displayName: "Mock Admin",
            firstName: "Mock",
            lastName: "Admin",
            roles: ["ADMIN", "GF"],
            primaryRole: "ADMIN",
            active: true,
          },
          error: null,
        });
      } else {
        setState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
        });
      }
    };

    init();
  }, [fetchUser, useMockAuth]);

  const login = useCallback(async () => {
    if (useMockAuth) {
      setAuthToken("mock-token");
      setState({
        isAuthenticated: true,
        isLoading: false,
        user: {
          _id: "user-mock",
          email: "admin@kompass.local",
          displayName: "Mock Admin",
          firstName: "Mock",
          lastName: "Admin",
          roles: ["ADMIN", "GF"],
          primaryRole: "ADMIN",
          active: true,
        },
        error: null,
      });
      return;
    }

    const authUrl = await buildAuthUrl();
    window.location.href = authUrl;
  }, [useMockAuth]);

  const logout = useCallback(() => {
    clearAuthToken();
    localStorage.removeItem("refresh_token");

    setState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null,
    });

    if (!useMockAuth) {
      window.location.href = buildLogoutUrl();
    }
  }, [useMockAuth]);

  const hasRole = useCallback(
    (role: string) => {
      return state.user?.roles.includes(role) ?? false;
    },
    [state.user],
  );

  const hasAnyRole = useCallback(
    (roles: string[]) => {
      return roles.some((role) => state.user?.roles.includes(role)) ?? false;
    },
    [state.user],
  );

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, hasRole, hasAnyRole, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
