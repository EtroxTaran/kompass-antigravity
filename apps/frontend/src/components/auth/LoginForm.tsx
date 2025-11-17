import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
 * Login form validation schema
 */
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'E-Mail-Adresse ist erforderlich')
    .email('Ungültige E-Mail-Adresse'),
  password: z.string().min(1, 'Passwort ist erforderlich'),
  rememberMe: z.boolean().optional(),
});

/**
 * Login form values
 */
type LoginFormValues = z.infer<typeof loginFormSchema>;

/**
 * Login form props
 */
interface LoginFormProps {
  /** Submit handler */
  onSubmit: (data: LoginFormValues) => Promise<void>;
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string | null;
}

/**
 * Login Form Component
 *
 * Embedded login form with email and password fields.
 * Uses shadcn/ui components for styling and accessibility.
 *
 * Features:
 * - Email and password validation
 * - Remember me checkbox
 * - Loading states
 * - Error handling
 * - WCAG 2.1 AA compliant
 *
 * @example
 * ```tsx
 * <LoginForm
 *   onSubmit={handleLogin}
 *   isLoading={isLoggingIn}
 *   error={loginError}
 * />
 * ```
 */
export function LoginForm({
  onSubmit,
  isLoading = false,
  error,
}: LoginFormProps): React.ReactElement {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleFormSubmit = async (data: LoginFormValues): Promise<void> => {
    await onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => {
          void form.handleSubmit(handleFormSubmit)(e);
        }}
        className="space-y-4"
        aria-label="Anmeldeformular"
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
                  autoComplete="current-password"
                  aria-required="true"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Remember Me Checkbox */}
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  Angemeldet bleiben
                </FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading}
          aria-label={isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
        >
          {isLoading ? 'Anmeldung läuft...' : 'Anmelden'}
        </Button>

        {/* Forgot Password Link (Future) */}
        <div className="text-center text-sm">
          <button
            type="button"
            className="text-primary hover:underline"
            disabled={isLoading}
            aria-label="Passwort vergessen"
          >
            Passwort vergessen?
          </button>
        </div>
      </form>
    </Form>
  );
}
