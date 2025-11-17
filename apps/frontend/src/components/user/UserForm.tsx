import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { UserRole } from '@kompass/shared/constants/rbac.constants';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useCreateUser, useUpdateUser, useAssignRoles } from '@/hooks/useUsers';

import type { User } from '@kompass/shared/types/entities/user';

/**
 * Role display labels (German)
 */
const ROLE_LABELS: Record<UserRole, string> = {
  ADM: 'Außendienst',
  INNEN: 'Innendienst',
  PLAN: 'Planung',
  KALK: 'Kalkulation',
  BUCH: 'Buchhaltung',
  GF: 'Geschäftsführer',
  ADMIN: 'Administrator',
};

/**
 * All available roles
 */
const ALL_ROLES: UserRole[] = Object.values(UserRole);

/**
 * User form validation schema
 * Password fields are optional for edit mode
 */
const userFormSchema = z
  .object({
    email: z
      .string()
      .min(1, 'E-Mail-Adresse ist erforderlich')
      .email('Ungültige E-Mail-Adresse'),
    displayName: z
      .string()
      .min(2, 'Name muss mindestens 2 Zeichen lang sein')
      .max(100, 'Name darf maximal 100 Zeichen lang sein'),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    phoneNumber: z.string().optional(),
    roles: z
      .array(z.nativeEnum(UserRole))
      .min(1, 'Mindestens eine Rolle muss ausgewählt werden'),
    primaryRole: z.nativeEnum(UserRole),
    active: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // Password validation only required for create mode (when password is provided)
      if (data.password) {
        return (
          data.password.length >= 12 &&
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/.test(
            data.password
          )
        );
      }
      return true;
    },
    {
      message:
        'Passwort muss mindestens 12 Zeichen lang sein und Groß- und Kleinbuchstaben, eine Zahl und ein Sonderzeichen enthalten',
      path: ['password'],
    }
  )
  .refine(
    (data) => {
      // Password confirmation only required if password is provided
      if (data.password) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Passwörter stimmen nicht überein',
      path: ['confirmPassword'],
    }
  )
  .refine((data) => data.roles.includes(data.primaryRole), {
    message: 'Hauptrolle muss in den ausgewählten Rollen enthalten sein',
    path: ['primaryRole'],
  });

type UserFormValues = z.infer<typeof userFormSchema>;

/**
 * User Form Props
 */
interface UserFormProps {
  /** Existing user (for edit mode) */
  user?: User;
  /** Success callback */
  onSuccess?: () => void;
}

/**
 * User Form Component
 *
 * Form for creating or editing users with section separators,
 * 2-column desktop layout, field grouping, and help text.
 * Supports role assignment and primary role selection.
 */
export function UserForm({
  user,
  onSuccess,
}: UserFormProps): React.ReactElement {
  const isEditMode = !!user;

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const assignRolesMutation = useAssignRoles();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
      ? {
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber || '',
          roles: user.roles,
          primaryRole: user.primaryRole,
          active: user.active,
        }
      : {
          email: '',
          displayName: '',
          password: undefined,
          confirmPassword: undefined,
          phoneNumber: '',
          roles: [],
          primaryRole: UserRole.ADM,
          active: true,
        },
  });

  const onSubmit = async (data: UserFormValues): Promise<void> => {
    try {
      if (isEditMode && user) {
        // Update user
        const updateData = {
          email: data.email,
          displayName: data.displayName,
          phoneNumber: data.phoneNumber || undefined,
          active: data.active,
        };

        await updateUserMutation.mutateAsync({
          id: user._id,
          data: updateData,
        });

        // Update roles if changed
        if (
          JSON.stringify(data.roles.sort()) !==
            JSON.stringify(user.roles.sort()) ||
          data.primaryRole !== user.primaryRole
        ) {
          await assignRolesMutation.mutateAsync({
            id: user._id,
            data: {
              roles: data.roles,
              primaryRole: data.primaryRole,
            },
          });
        }
      } else {
        // Create user - password is required
        if (!data.password) {
          form.setError('password', {
            message: 'Passwort ist erforderlich',
          });
          return;
        }

        const createData = {
          email: data.email,
          displayName: data.displayName,
          password: data.password,
          phoneNumber: data.phoneNumber || undefined,
          roles: data.roles,
          primaryRole: data.primaryRole,
          active: data.active,
        };

        await createUserMutation.mutateAsync(createData);
      }

      onSuccess?.();
    } catch (error) {
      // Error handling is done in mutation hooks
      console.error('Form submission error:', error);
    }
  };

  const selectedRoles = form.watch('roles') as UserRole[];
  const primaryRole = form.watch('primaryRole') as UserRole;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Grunddaten */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Grunddaten</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail-Adresse</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="benutzer@example.com"
                      disabled={isEditMode} // Email cannot be changed after creation
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Die E-Mail-Adresse wird als Benutzername verwendet und kann
                    nach der Erstellung nicht mehr geändert werden.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Display Name */}
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Max Mustermann" {...field} />
                  </FormControl>
                  <FormDescription>
                    Der vollständige Name des Benutzers, wie er in der Anwendung
                    angezeigt wird.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefonnummer (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="+49-89-1234567" {...field} />
                  </FormControl>
                  <FormDescription>
                    Kontakttelefonnummer des Benutzers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Section 2: Passwort (only for create) */}
        {!isEditMode && (
          <>
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Passwort
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Mindestens 12 Zeichen, Groß- und Kleinbuchstaben, eine
                        Zahl und ein Sonderzeichen (@$!%*?&).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Passwort bestätigen</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormDescription>
                        Bitte geben Sie das Passwort erneut ein, um es zu
                        bestätigen.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Section 3: Rollen & Berechtigungen */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            Rollen & Berechtigungen
          </h2>
          <div className="space-y-4">
            {/* Roles Selection */}
            <FormField
              control={form.control}
              name="roles"
              render={() => (
                <FormItem>
                  <FormLabel>Rollen</FormLabel>
                  <div className="grid gap-2 md:grid-cols-2">
                    {ALL_ROLES.map((role) => (
                      <FormField
                        key={role}
                        control={form.control}
                        name="roles"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={role}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(role)}
                                  onCheckedChange={(checked) => {
                                    const currentRoles = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentRoles, role]);
                                      // Auto-set primary role if no roles selected yet
                                      if (currentRoles.length === 0) {
                                        form.setValue('primaryRole', role);
                                      }
                                    } else {
                                      field.onChange(
                                        currentRoles.filter((r) => r !== role)
                                      );
                                      // If removing primary role, set new primary
                                      if (primaryRole === role) {
                                        const remaining = currentRoles.filter(
                                          (r) => r !== role
                                        );
                                        if (remaining.length > 0) {
                                          form.setValue(
                                            'primaryRole',
                                            remaining[0] ?? UserRole.ADM
                                          );
                                        }
                                      }
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal cursor-pointer">
                                {ROLE_LABELS[role]}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormDescription>
                    Wählen Sie eine oder mehrere Rollen für den Benutzer aus.
                    Die Hauptrolle bestimmt die primären Berechtigungen.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Primary Role */}
            <FormField
              control={form.control}
              name="primaryRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hauptrolle</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(value as UserRole)}
                    value={field.value}
                    disabled={selectedRoles.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Hauptrolle auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Die Hauptrolle bestimmt die primären Berechtigungen und die
                    Standardansicht des Benutzers. Muss eine der ausgewählten
                    Rollen sein.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Separator />

        {/* Section 4: Status */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Status</h2>
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">
                    Benutzer ist aktiv
                  </FormLabel>
                  <FormDescription>
                    Inaktive Benutzer können sich nicht anmelden, behalten aber
                    ihre Daten und Berechtigungen.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="submit"
            disabled={
              createUserMutation.isPending ||
              updateUserMutation.isPending ||
              assignRolesMutation.isPending
            }
          >
            {isEditMode ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
