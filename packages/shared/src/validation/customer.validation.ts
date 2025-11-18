/**
 * Customer Validation Schema
 *
 * Zod schema for customer form validation matching backend DTOs.
 * Used in frontend forms with react-hook-form and zodResolver.
 *
 * Validation rules match CreateCustomerDto and UpdateCustomerDto from backend.
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { z } from 'zod';

import { CustomerType } from '../types/enums';

/**
 * Address validation schema
 */
export const addressSchema = z.object({
  street: z
    .string()
    .min(2, 'Straße muss mindestens 2 Zeichen lang sein')
    .max(100, 'Straße darf maximal 100 Zeichen lang sein'),
  streetNumber: z.string().optional(),
  addressLine2: z.string().optional(),
  zipCode: z.string().regex(/^\d{5}$/, 'Postleitzahl muss 5 Ziffern haben'),
  city: z
    .string()
    .min(2, 'Stadt muss mindestens 2 Zeichen lang sein')
    .max(100, 'Stadt darf maximal 100 Zeichen lang sein'),
  state: z.string().optional(),
  country: z.string().default('Deutschland'),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

/**
 * Customer form validation schema
 *
 * Matches CreateCustomerDto validation rules from backend.
 */
export const customerFormSchema = z.object({
  // Basic Information
  companyName: z
    .string()
    .min(2, 'Firmenname muss mindestens 2 Zeichen lang sein')
    .max(200, 'Firmenname darf maximal 200 Zeichen lang sein')
    .regex(
      /^[a-zA-ZäöüÄÖÜß0-9\s.\-&()]+$/,
      'Firmenname darf nur Buchstaben, Zahlen und grundlegende Satzzeichen enthalten'
    ),
  legalName: z.string().optional(),
  displayName: z.string().optional(),
  vatNumber: z
    .string()
    .regex(/^DE\d{9}$/, 'Umsatzsteuer-ID muss das Format DE123456789 haben')
    .optional()
    .or(z.literal('')),
  registrationNumber: z.string().optional(),

  // Billing Address (REQUIRED)
  billingAddress: addressSchema,

  // Contact Information
  phone: z
    .string()
    .min(7, 'Telefonnummer muss mindestens 7 Zeichen lang sein')
    .max(20, 'Telefonnummer darf maximal 20 Zeichen lang sein')
    .regex(/^[+]?[0-9\s\-()]+$/, 'Ungültiges Telefonnummernformat')
    .optional()
    .or(z.literal('')),
  email: z
    .string()
    .email('Ungültiges E-Mail-Format')
    .optional()
    .or(z.literal('')),
  website: z.string().url('Ungültige URL').optional().or(z.literal('')),

  // Financial Data (RBAC Restricted - optional in form)
  creditLimit: z
    .number()
    .min(0, 'Kreditlimit muss mindestens €0 sein')
    .max(1000000, 'Kreditlimit darf maximal €1.000.000 sein')
    .optional()
    .nullable(),
  paymentTerms: z
    .number()
    .min(0, 'Zahlungsbedingungen müssen mindestens 0 Tage sein')
    .max(90, 'Zahlungsbedingungen dürfen maximal 90 Tage sein')
    .optional()
    .nullable(),

  // Relationship Management
  customerType: z.nativeEnum(CustomerType, {
    errorMap: () => ({ message: 'Ungültiger Kundentyp' }),
  }),
  rating: z
    .enum(['A', 'B', 'C'], {
      errorMap: () => ({ message: 'Ungültige Bewertung' }),
    })
    .optional()
    .nullable(),

  // Business Intelligence
  industry: z.string().optional(),
  customerBusinessType: z.string().optional(),

  // Tags & Notes
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

/**
 * Type inferred from customer form schema
 */
export type CustomerFormValues = z.infer<typeof customerFormSchema>;
