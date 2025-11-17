import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

/**
 * Login Page
 *
 * Displays embedded login form and handles Keycloak authentication flow.
 * After successful login, redirects user to the originally requested page or dashboard.
 */
export function LoginPage(): React.ReactElement {
  const { isAuthenticated, isLoading, error, login, refreshUserInfo } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Get the page user was trying to access, or default to dashboard
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  /**
   * Handle login form submission
   */
  const handleLogin = async (data: {
    email: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<void> => {
    try {
      setIsLoggingIn(true);
      await login(data.email, data.password);

      // Refresh user info after successful login
      await refreshUserInfo();

      // Get the page user was trying to access, or default to dashboard
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failed:', err);
      // Error is already set in auth context
      throw err; // Re-throw to let LoginForm handle it
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Show loading state during initial auth check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Laden...</p>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">KOMPASS</h1>
          <p className="text-muted-foreground">CRM & Projektmanagement</p>
        </div>

        <div className="bg-card rounded-lg shadow-md p-8 border">
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoggingIn}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
