import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  CustomerType,
  type CustomerRating,
  UserRole,
  createDefaultAddress,
  customerFormSchema,
  type CustomerFormValues,
} from '@kompass/shared';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import {
  useCreateCustomer,
  useUpdateCustomer,
} from '@/hooks/useCustomerMutation';

import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Customer Type Labels (German)
 */
const CUSTOMER_TYPE_LABELS: Record<CustomerType, string> = {
  [CustomerType.PROSPECT]: 'Interessent',
  [CustomerType.ACTIVE]: 'Aktiv',
  [CustomerType.INACTIVE]: 'Inaktiv',
  [CustomerType.ARCHIVED]: 'Archiviert',
};

/**
 * Customer Rating Labels (German)
 */
const RATING_LABELS: Record<CustomerRating, string> = {
  A: 'A - Strategisch',
  B: 'B - Standard',
  C: 'C - Klein',
};

/**
 * Customer Form Props
 */
interface CustomerFormProps {
  /** Existing customer (for edit mode) */
  customer?: Customer;
  /** Success callback */
  onSuccess?: () => void;
  /** Cancel callback */
  onCancel?: () => void;
}

/**
 * Customer Form Component
 *
 * Form for creating or editing customers with section separators,
 * 2-column desktop layout, field grouping, and help text.
 * Implements RBAC field visibility (financial fields for BUCH/GF only).
 * Includes unsaved changes confirmation on cancel.
 *
 * Features:
 * - All customer fields organized in sections
 * - Form validation with zod schema (matches backend DTOs)
 * - RBAC field filtering (financial fields for BUCH/GF only)
 * - Unsaved changes detection and confirmation
 * - Mobile-responsive layout
 * - Loading states during submit
 * - Field-level error display
 */
export function CustomerForm({
  customer,
  onSuccess,
  onCancel,
}: CustomerFormProps): React.ReactElement {
  const isEditMode = !!customer;
  const { user } = useAuth();

  const createCustomerMutation = useCreateCustomer();
  const updateCustomerMutation = useUpdateCustomer();

  // Unsaved changes tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Check if user can see financial fields (BUCH/GF only)
  const canSeeFinancialFields = useMemo(() => {
    if (!user) return false;
    return (
      user.roles.includes(UserRole.BUCH) || user.roles.includes(UserRole.GF)
    );
  }, [user]);

  // Initialize form with default values
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customer
      ? {
          companyName: customer.companyName || '',
          legalName: customer.legalName || '',
          displayName: customer.displayName || '',
          vatNumber: customer.vatNumber || '',
          registrationNumber: customer.registrationNumber || '',
          billingAddress: customer.billingAddress || createDefaultAddress(),
          phone: customer.phone || '',
          email: customer.email || '',
          website: customer.website || '',
          creditLimit: customer.creditLimit ?? null,
          paymentTerms: customer.paymentTerms ?? null,
          customerType: customer.customerType || CustomerType.ACTIVE,
          rating: customer.rating || null,
          industry: customer.industry || '',
          customerBusinessType: customer.customerBusinessType || '',
          tags: customer.tags || [],
          notes: customer.notes || '',
        }
      : {
          companyName: '',
          legalName: '',
          displayName: '',
          vatNumber: '',
          registrationNumber: '',
          billingAddress: createDefaultAddress(),
          phone: '',
          email: '',
          website: '',
          creditLimit: null,
          paymentTerms: null,
          customerType: CustomerType.ACTIVE,
          rating: null,
          industry: '',
          customerBusinessType: '',
          tags: [],
          notes: '',
        },
  });

  // Track form changes for unsaved changes detection
  // Use formState.isDirty which is more reliable than dirtyFields
  // Also subscribe to form changes to ensure we catch all updates
  const isDirty = form.formState.isDirty;
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Also watch for form changes to ensure dirty state is updated
  useEffect(() => {
    const subscription = form.watch(() => {
      // Trigger re-evaluation of isDirty
      // This ensures the effect above runs when form state changes
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle form submission
  const onSubmit = async (data: CustomerFormValues): Promise<void> => {
    try {
      // Prepare request data (remove empty strings, convert null to undefined)
      const requestData = {
        companyName: data.companyName,
        legalName: data.legalName || undefined,
        displayName: data.displayName || undefined,
        vatNumber: data.vatNumber || undefined,
        registrationNumber: data.registrationNumber || undefined,
        billingAddress: {
          street: data.billingAddress.street,
          streetNumber: data.billingAddress.streetNumber || undefined,
          addressLine2: data.billingAddress.addressLine2 || undefined,
          zipCode: data.billingAddress.zipCode,
          city: data.billingAddress.city,
          state: data.billingAddress.state || undefined,
          country: data.billingAddress.country || 'Deutschland',
        },
        phone: data.phone || undefined,
        email: data.email || undefined,
        website: data.website || undefined,
        creditLimit: data.creditLimit ?? undefined,
        paymentTerms: data.paymentTerms ?? undefined,
        customerType: data.customerType,
        rating: data.rating || undefined,
        industry: data.industry || undefined,
        customerBusinessType: data.customerBusinessType || undefined,
        tags: data.tags && data.tags.length > 0 ? data.tags : undefined,
        notes: data.notes || undefined,
      };

      if (isEditMode && customer) {
        // Update existing customer
        await updateCustomerMutation.mutateAsync({
          id: customer._id,
          data: {
            ...requestData,
            _rev: customer._rev, // Include revision for optimistic locking
          },
        });
      } else {
        // Create new customer
        await createCustomerMutation.mutateAsync(requestData);
      }

      setHasUnsavedChanges(false);
      onSuccess?.();
    } catch (error) {
      // Error handling is done in mutation hooks (toast notifications)
      // Field-level errors will be set by react-hook-form if API returns validation errors
      console.error('Form submission error:', error);
    }
  };

  // Handle cancel with unsaved changes confirmation
  const handleCancel = (): void => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true);
    } else {
      onCancel?.();
    }
  };

  const handleCancelConfirm = (): void => {
    setShowCancelDialog(false);
    setHasUnsavedChanges(false);
    form.reset();
    onCancel?.();
  };

  const isLoading =
    createCustomerMutation.isPending || updateCustomerMutation.isPending;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-8"
        >
          {/* Section 1: Grunddaten */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Grunddaten
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Firmenname <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Hofladen Müller GmbH" {...field} />
                    </FormControl>
                    <FormDescription>
                      Der offizielle Firmenname (2-200 Zeichen)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Legal Name */}
              <FormField
                control={form.control}
                name="legalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rechtlicher Name (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Müller GmbH & Co. KG" {...field} />
                    </FormControl>
                    <FormDescription>
                      Rechtlicher Name, falls abweichend vom Firmennamen
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* VAT Number */}
              <FormField
                control={form.control}
                name="vatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Umsatzsteuer-ID (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="DE123456789"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Format: DE gefolgt von 9 Ziffern
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Registration Number */}
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Handelsregisternummer (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="HRB 12345" {...field} />
                    </FormControl>
                    <FormDescription>
                      Handelsregisternummer des Unternehmens
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Customer Type */}
              <FormField
                control={form.control}
                name="customerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Kundentyp <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as CustomerType)
                      }
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kundentyp auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CustomerType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {CUSTOMER_TYPE_LABELS[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Status des Kunden im System
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Rating */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bewertung (optional)</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as CustomerRating)
                      }
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bewertung auswählen" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(['A', 'B', 'C'] as const).map((rating) => (
                          <SelectItem key={rating} value={rating}>
                            {RATING_LABELS[rating]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Kundenkategorie (A=Strategisch, B=Standard, C=Klein)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Section 2: Rechnungsadresse */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Rechnungsadresse
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Street */}
              <FormField
                control={form.control}
                name="billingAddress.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Straße <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Hauptstraße" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Street Number */}
              <FormField
                control={form.control}
                name="billingAddress.streetNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hausnummer (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ZIP Code */}
              <FormField
                control={form.control}
                name="billingAddress.zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Postleitzahl <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="80331" {...field} />
                    </FormControl>
                    <FormDescription>5-stellige Postleitzahl</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="billingAddress.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Stadt <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="München" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* State */}
              <FormField
                control={form.control}
                name="billingAddress.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bundesland (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Bayern" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country */}
              <FormField
                control={form.control}
                name="billingAddress.country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Land <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Deutschland"
                        {...field}
                        value={field.value || 'Deutschland'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Section 3: Kontaktinformationen */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Kontaktinformationen
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefonnummer (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+49-89-1234567"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Internationales Format (7-20 Zeichen)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-Mail-Adresse (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="info@example.de"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>Firmen-E-Mail-Adresse</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://www.example.de"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>Firmenwebsite</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Section 4: Finanzdaten (RBAC: BUCH/GF only) */}
          {canSeeFinancialFields && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  Finanzdaten
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Credit Limit */}
                  <FormField
                    control={form.control}
                    name="creditLimit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kreditlimit (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="50000"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? null : Number(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Kreditlimit in EUR (max. €1.000.000)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Payment Terms */}
                  <FormField
                    control={form.control}
                    name="paymentTerms"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zahlungsbedingungen (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="30"
                            {...field}
                            value={field.value ?? ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value === '' ? null : Number(value)
                              );
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Zahlungsziel in Tagen (max. 90 Tage)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Section 5: Weitere Informationen */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Weitere Informationen
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Industry */}
              <FormField
                control={form.control}
                name="industry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branche (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Einzelhandel" {...field} />
                    </FormControl>
                    <FormDescription>
                      Branche oder Sektor des Unternehmens
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notizen (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Allgemeine Notizen zum Kunden..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Allgemeine Notizen zum Kunden (Markdown unterstützt)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="mr-2">Speichern...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                </>
              ) : isEditMode ? (
                'Aktualisieren'
              ) : (
                'Erstellen'
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Unsaved Changes Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ungespeicherte Änderungen</AlertDialogTitle>
            <AlertDialogDescription>
              Sie haben ungespeicherte Änderungen. Möchten Sie wirklich
              abbrechen? Alle Änderungen gehen verloren.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelDialog(false)}>
              Zurück zum Formular
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Abbrechen und Änderungen verwerfen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
