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
import { User } from "@kompass/shared";
import {
  buildAuthUrl,
  exchangeCodeForTokens,
  buildLogoutUrl,
} from "@/lib/auth-helpers";

// Keycloak Configuration
// These are used in helpers now, but maybe useAuth still needs them? 
// Actually useAuth doesn't use KEYCLOAK consts anymore if logic is moved.
// Checking useAuth body... 
// It uses buildAuthUrl, exchangeCodeForTokens, buildLogoutUrl.
// It DOES NOT use KEYCLOAK consts directly.

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
