import React from 'react';

import type { Customer } from '@kompass/shared/types/entities/customer';

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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import type { DuplicateMatch } from '@/types/duplicate-detection.types';

/**
 * DuplicateDetectionDialog Props
 */
export interface DuplicateDetectionDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog open state changes */
  onOpenChange: (open: boolean) => void;
  /** Duplicate match (with similarity) or customer (for VAT exact match) */
  duplicate: DuplicateMatch | Customer;
  /** Callback when user clicks Cancel (should clear field) */
  onCancel: () => void;
  /** Callback when user clicks Continue Anyway (should dismiss warning) */
  onContinue: () => void;
}

/**
 * DuplicateDetectionDialog Component
 *
 * Displays a warning dialog when a potential duplicate customer is detected.
 * Shows existing customer preview with company name, VAT number, address, rating,
 * and similarity percentage (for fuzzy matches).
 *
 * User can:
 * - Cancel: Clear the field that triggered duplicate, close dialog
 * - Continue Anyway: Dismiss warning, allow form submission
 *
 * @example
 * ```tsx
 * <DuplicateDetectionDialog
 *   open={duplicateDialogOpen}
 *   onOpenChange={setDuplicateDialogOpen}
 *   duplicate={detectedDuplicate}
 *   onCancel={() => {
 *     form.setValue('companyName', '');
 *     setDuplicateDialogOpen(false);
 *   }}
 *   onContinue={() => {
 *     setDuplicateDialogOpen(false);
 *     // Allow form submission
 *   }}
 * />
 * ```
 */
export function DuplicateDetectionDialog({
  open,
  onOpenChange,
  duplicate,
  onCancel,
  onContinue,
}: DuplicateDetectionDialogProps): React.ReactElement {
  // Extract customer and similarity from duplicate
  const customer = 'customer' in duplicate ? duplicate.customer : duplicate;
  const similarity = 'similarity' in duplicate ? duplicate.similarity : 1.0;
  const matchType = 'matchType' in duplicate ? duplicate.matchType : 'vat';

  // Format similarity as percentage
  const similarityPercent = Math.round(similarity * 100);

  // Format address for display
  const addressDisplay = customer.billingAddress
    ? `${customer.billingAddress.zipCode} ${customer.billingAddress.city}`
    : 'Keine Adresse';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Potentieller Duplikat-Kunde erkannt
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ein Kunde mit ähnlichen Informationen existiert bereits. Bitte
            überprüfen Sie die Details, bevor Sie fortfahren.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="py-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {customer.companyName}
                </CardTitle>
                {matchType === 'companyName' && (
                  <Badge variant="secondary" className="ml-2">
                    {similarityPercent}% ähnlich
                  </Badge>
                )}
                {matchType === 'vat' && (
                  <Badge variant="destructive" className="ml-2">
                    Exakte Übereinstimmung
                  </Badge>
                )}
              </div>
              {customer.legalName &&
                customer.legalName !== customer.companyName && (
                  <CardDescription>{customer.legalName}</CardDescription>
                )}
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.vatNumber && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    USt-IdNr.:
                  </span>{' '}
                  <span className="text-sm">{customer.vatNumber}</span>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Adresse:
                </span>{' '}
                <span className="text-sm">{addressDisplay}</span>
              </div>

              {customer.rating && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Bewertung:
                  </span>{' '}
                  <Badge variant="outline" className="ml-1">
                    {customer.rating}
                  </Badge>
                </div>
              )}

              {customer.email && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    E-Mail:
                  </span>{' '}
                  <span className="text-sm">{customer.email}</span>
                </div>
              )}

              {customer.phone && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Telefon:
                  </span>{' '}
                  <span className="text-sm">{customer.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Separator />

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onCancel}>
              Abbrechen
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant="default" onClick={onContinue}>
              Trotzdem fortfahren
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
