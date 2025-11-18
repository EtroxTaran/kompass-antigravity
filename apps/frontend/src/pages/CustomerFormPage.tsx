import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { CustomerForm } from '@/components/customer/CustomerForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomer } from '@/hooks/useCustomer';

/**
 * Customer Form Page Component
 *
 * Page for creating or editing customers.
 * Handles loading state, error state, and navigation.
 * Uses CustomerForm component for the actual form.
 *
 * Routes:
 * - /customers/new - Create new customer
 * - /customers/:id/edit - Edit existing customer
 */
export function CustomerFormPage(): React.ReactElement {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id && id !== 'new';

  // Fetch customer data if in edit mode
  const {
    data: customer,
    isLoading,
    error,
  } = useCustomer(isEditMode ? id || '' : '');

  // Handle form success
  const handleSuccess = (): void => {
    // Navigation is handled by the mutation hooks
    // This callback is optional and can be used for additional actions
  };

  // Handle form cancel
  const handleCancel = (): void => {
    if (isEditMode && customer) {
      navigate(`/customers/${customer._id}`);
    } else {
      navigate('/customers');
    }
  };

  // Loading state
  if (isEditMode && isLoading) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isEditMode && error) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 p-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/customers')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Fehler</h1>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              {error instanceof Error
                ? error.message
                : 'Fehler beim Laden des Kunden'}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/customers')}
              className="mt-4"
            >
              Zurück zur Liste
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          aria-label="Zurück"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Kunde bearbeiten' : 'Neuer Kunde'}
        </h1>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditMode
              ? `Kunde bearbeiten: ${customer?.companyName || ''}`
              : 'Neuen Kunden erstellen'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerForm
            customer={customer}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
}
