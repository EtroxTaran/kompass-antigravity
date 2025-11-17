import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

/**
 * Registration form validation schema
 */
const registerFormSchema = z
  .object({
    email: z
      .string()
      .min(1, 'E-Mail-Adresse ist erforderlich')
      .email('Ungültige E-Mail-Adresse'),
    displayName: z
      .string()
      .min(2, 'Anzeigename muss mindestens 2 Zeichen lang sein')
      .max(100, 'Anzeigename darf maximal 100 Zeichen lang sein'),
    password: z
      .string()
      .min(12, 'Passwort muss mindestens 12 Zeichen lang sein')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
        'Passwort muss Groß- und Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten'
      ),
    confirmPassword: z.string().min(1, 'Passwort-Bestätigung ist erforderlich'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  });

/**
 * Registration form values
 */
type RegisterFormValues = z.infer<typeof registerFormSchema>;

/**
 * Registration form props
 */
interface RegisterFormProps {
  /** Submit handler */
  onSubmit: (
    data: Omit<RegisterFormValues, 'confirmPassword'>
  ) => Promise<void>;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
}

/**
 * Register Form Component
 *
 * Registration form with email, display name, password, and password confirmation.
 * Uses shadcn/ui components for styling and accessibility.
 *
 * Features:
 * - Email, display name, and password validation
 * - Password confirmation matching
 * - Loading states
 * - Error handling
 * - WCAG 2.1 AA compliant
 *
 * @example
 * ```tsx
 * <RegisterForm
 *   onSubmit={handleRegister}
 *   isLoading={isRegistering}
 *   error={registerError}
 * />
 * ```
 */
export function RegisterForm({
  onSubmit,
  isLoading = false,
  error,
}: RegisterFormProps): React.ReactElement {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    mode: 'onSubmit', // Validate on submit, show errors after first submit attempt
    defaultValues: {
      email: '',
      displayName: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: RegisterFormValues): Promise<void> => {
    const { confirmPassword: _, ...registrationData } = data;
    await onSubmit(registrationData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit(handleFormSubmit)(e);
        }}
        noValidate // Disable HTML5 validation - react-hook-form handles validation
        className="space-y-4"
        aria-label="Registrierungsformular"
      >
        {/* Error message */}
        {error && (
          <div
            className="bg-destructive/15 text-destructive px-4 py-3 rounded-md text-sm"
            role="alert"
            aria-live="polite"
          >
            {error}
          </div>
        )}

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">E-Mail-Adresse *</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre.email@beispiel.de"
                  autoComplete="email"
                  aria-required="true"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Display Name Field */}
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="displayName">Anzeigename *</FormLabel>
              <FormControl>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Max Mustermann"
                  autoComplete="name"
                  aria-required="true"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="password">Passwort *</FormLabel>
              <FormControl>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-required="true"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <p className="text-xs text-muted-foreground">
                Mindestens 12 Zeichen, Groß- und Kleinbuchstaben, Zahl und
                Sonderzeichen
              </p>
            </FormItem>
          )}
        />

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="confirmPassword">
                Passwort bestätigen *
              </FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  aria-required="true"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
          aria-label={isLoading ? 'Registrierung läuft...' : 'Registrieren'}
        >
          {isLoading ? 'Registrierung läuft...' : 'Registrieren'}
        </Button>
      </form>
    </Form>
  );
}
