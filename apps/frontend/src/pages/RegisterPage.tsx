import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { RegisterForm } from '../components/auth/RegisterForm';
import { register as registerUser } from '../lib/auth-api';

/**
 * Register Page
 *
 * Displays registration form and handles user registration.
 * After successful registration, redirects user to login page.
 */
export function RegisterPage(): React.ReactElement {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle registration form submission
   */
  const handleRegister = async (data: {
    email: string;
    displayName: string;
    password: string;
  }): Promise<void> => {
    try {
      setIsRegistering(true);
      setError(null);

      await registerUser(data.email, data.displayName, data.password);

      // Redirect to login page with success message
      navigate('/login', {
        state: {
          message: 'Registrierung erfolgreich! Bitte melden Sie sich an.',
        },
        replace: true,
      });
    } catch (err) {
      console.error('Registration failed:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.';
      setError(errorMessage);
      // Don't re-throw - let the form display the error via the error prop
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">KOMPASS</h1>
          <p className="text-muted-foreground">CRM & Projektmanagement</p>
        </div>

        <div className="bg-card rounded-lg shadow-md p-8 border">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">Registrierung</h2>
            <p className="text-sm text-muted-foreground">
              Erstellen Sie ein neues Konto, um KOMPASS zu nutzen.
            </p>
          </div>

          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isRegistering}
            error={error}
          />

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Bereits ein Konto?{' '}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Anmelden
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
