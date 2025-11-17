import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, it, expect, vi } from 'vitest';

import { RegisterForm } from '../RegisterForm';

describe('RegisterForm', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText('E-Mail-Adresse *')).toBeInTheDocument();
    expect(screen.getByLabelText('Anzeigename *')).toBeInTheDocument();
    expect(screen.getByLabelText('Passwort *')).toBeInTheDocument();
    expect(screen.getByLabelText('Passwort bestätigen *')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Registrieren' })
    ).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Registrieren' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('E-Mail-Adresse ist erforderlich')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Anzeigename muss mindestens 2 Zeichen lang sein')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Passwort muss mindestens 12 Zeichen lang sein')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Passwort-Bestätigung ist erforderlich')
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show error for invalid email format', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    // Fill other required fields so email validation runs
    const emailInput = screen.getByLabelText('E-Mail-Adresse *');
    const displayNameInput = screen.getByLabelText('Anzeigename *');
    const passwordInput = screen.getByLabelText('Passwort *');
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *');
    const submitButton = screen.getByRole('button', { name: 'Registrieren' });

    // Fill all fields with invalid email
    fireEvent.change(displayNameInput, { target: { value: 'Test User' } });
    fireEvent.change(passwordInput, {
      target: { value: 'SecurePassword123!' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'SecurePassword123!' },
    });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    // Submit form to trigger validation (react-hook-form validates on submit)
    fireEvent.submit(
      screen.getByRole('form', { name: 'Registrierungsformular' })
    );

    // Wait for validation error to appear
    await waitFor(
      () => {
        expect(
          screen.getByText('Ungültige E-Mail-Adresse')
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show error for display name too short', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    // Fill other required fields so display name validation runs
    await userEvent.type(
      screen.getByLabelText('E-Mail-Adresse *'),
      'test@example.com'
    );
    await userEvent.type(screen.getByLabelText('Anzeigename *'), 'A');
    await userEvent.type(
      screen.getByLabelText('Passwort *'),
      'SecurePassword123!'
    );
    await userEvent.type(
      screen.getByLabelText('Passwort bestätigen *'),
      'SecurePassword123!'
    );

    // Submit form to trigger validation
    await userEvent.click(screen.getByRole('button', { name: 'Registrieren' }));

    await waitFor(() => {
      expect(
        screen.getByText('Anzeigename muss mindestens 2 Zeichen lang sein')
      ).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should show error for password too short', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    // Fill required fields first so password validation runs
    const emailInput = screen.getByLabelText('E-Mail-Adresse *');
    const displayNameInput = screen.getByLabelText('Anzeigename *');
    const passwordInput = screen.getByLabelText('Passwort *');
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test User' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'short' } });

    // Submit form to trigger validation
    const submitButton = screen.getByRole('button', { name: 'Registrieren' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Passwort muss mindestens 12 Zeichen lang sein')
      ).toBeInTheDocument();
    });
  });

  it('should show error for password without required characters', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    // Fill required fields first so password validation runs
    const emailInput = screen.getByLabelText('E-Mail-Adresse *');
    const displayNameInput = screen.getByLabelText('Anzeigename *');
    const passwordInput = screen.getByLabelText('Passwort *');
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test User' } });
    // Use password that meets length requirement but fails regex (missing uppercase and special char)
    fireEvent.change(passwordInput, { target: { value: 'password123456' } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'password123456' },
    });

    // Submit form to trigger validation
    const submitButton = screen.getByRole('button', { name: 'Registrieren' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          'Passwort muss Groß- und Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten'
        )
      ).toBeInTheDocument();
    });
  });

  it('should show error when passwords do not match', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const passwordInput = screen.getByLabelText('Passwort *');
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *');

    fireEvent.change(passwordInput, {
      target: { value: 'SecurePassword123!' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'DifferentPassword123!' },
    });

    // Submit form to trigger validation
    const submitButton = screen.getByRole('button', { name: 'Registrieren' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Passwörter stimmen nicht überein')
      ).toBeInTheDocument();
    });
  });

  it('should call onSubmit with correct data when form is valid', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const emailInput = screen.getByLabelText('E-Mail-Adresse *');
    const displayNameInput = screen.getByLabelText('Anzeigename *');
    const passwordInput = screen.getByLabelText('Passwort *');
    const confirmPasswordInput = screen.getByLabelText('Passwort bestätigen *');
    const submitButton = screen.getByRole('button', { name: 'Registrieren' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(displayNameInput, { target: { value: 'Test User' } });
    fireEvent.change(passwordInput, {
      target: { value: 'SecurePassword123!' },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: 'SecurePassword123!' },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        displayName: 'Test User',
        password: 'SecurePassword123!',
      });
    });
  });

  it('should show loading state when isLoading is true', () => {
    render(<RegisterForm onSubmit={mockOnSubmit} isLoading={true} />);

    const submitButton = screen.getByRole('button', {
      name: 'Registrierung läuft...',
    });
    expect(submitButton).toBeDisabled();
    expect(screen.getByLabelText('E-Mail-Adresse *')).toBeDisabled();
  });

  it('should display error message when error prop is provided', () => {
    const errorMessage = 'Registration failed';
    render(<RegisterForm onSubmit={mockOnSubmit} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toHaveAttribute('role', 'alert');
  });

  it('should not call onSubmit when form is invalid', async () => {
    render(<RegisterForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Registrieren' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('E-Mail-Adresse ist erforderlich')
      ).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });
});
