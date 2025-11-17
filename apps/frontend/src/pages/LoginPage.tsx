import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/useAuth';

/**
 * Login Page
 *
 * Displays login interface and handles Keycloak authentication flow.
 * After successful login, redirects user to the originally requested page or dashboard.
 */
export function LoginPage(): React.ReactElement {
  const { isAuthenticated, isLoading, error, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      // Get the page user was trying to access, or default to dashboard
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ||
        '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  /**
   * Handle login button click
   */
  const handleLogin = async (): Promise<void> => {
    try {
      // Get the page user was trying to access
      const from = (location.state as { from?: { pathname: string } })?.from
        ?.pathname;
      const redirectUri = from ? `${window.location.origin}${from}` : undefined;

      await login(redirectUri);
      // After login, Keycloak will redirect back to the app
      // The useEffect will handle navigation
    } catch (err) {
      console.error('Login failed:', err);
      // Error is already set in auth context
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KOMPASS</h1>
          <p className="text-gray-600">CRM & Projektmanagement</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Bitte melden Sie sich an, um fortzufahren.
          </p>

          <Button
            onClick={handleLogin}
            className="w-full"
            size="lg"
            disabled={isLoading}
          >
            {isLoading ? 'Anmelden...' : 'Anmelden'}
          </Button>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Sie werden zu Keycloak weitergeleitet, um sich anzumelden.</p>
        </div>
      </div>
    </div>
  );
}
