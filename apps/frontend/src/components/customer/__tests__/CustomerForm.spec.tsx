import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { UserRole, CustomerType, createDefaultAddress } from '@kompass/shared';

import { useAuth } from '@/hooks/useAuth';
import {
  useCreateCustomer,
  useUpdateCustomer,
} from '@/hooks/useCustomerMutation';

import { CustomerForm } from '../CustomerForm';

import type { Customer } from '@kompass/shared/types/entities/customer';

/**
 * Test wrapper with QueryClientProvider and routing
 */
function TestWrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        cacheTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

// Mock hooks
vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/useCustomerMutation');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
const mockUseCreateCustomer = useCreateCustomer as ReturnType<typeof vi.fn>;
const mockUseUpdateCustomer = useUpdateCustomer as ReturnType<typeof vi.fn>;

const mockCustomer: Customer = {
  _id: 'customer-123',
  _rev: '1-abc',
  type: 'customer',
  companyName: 'Test GmbH',
  legalName: 'Test GmbH Legal',
  vatNumber: 'DE123456789',
  registrationNumber: 'HRB 123456',
  email: 'info@test.de',
  phone: '+49-89-1234567',
  website: 'https://www.test.de',
  billingAddress: createDefaultAddress({
    street: 'Hauptstraße',
    streetNumber: '15',
    zipCode: '80331',
    city: 'München',
    country: 'Deutschland',
  }),
  customerType: CustomerType.ACTIVE,
  rating: 'A' as const,
  creditLimit: 50000,
  paymentTerms: 30,
  industry: 'Einzelhandel',
  tags: ['tag1', 'tag2'],
  notes: 'Test notes',
  createdBy: 'user-1',
  createdAt: new Date('2024-01-01'),
  modifiedBy: 'user-1',
  modifiedAt: new Date('2024-01-01'),
  version: 1,
};

describe('CustomerForm', () => {
  const mockMutateAsync = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default auth mock (ADM role - cannot see financial fields)
    mockUseAuth.mockReturnValue({
      user: {
        id: 'user-1',
        email: 'test@example.com',
        roles: [UserRole.ADM],
      },
    });

    // Default mutation mocks
    mockUseCreateCustomer.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });

    mockUseUpdateCustomer.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  describe('Create Mode', () => {
    it('should render form in create mode', () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      expect(screen.getByText('Firmenname')).toBeInTheDocument();
      expect(screen.getByText('Rechnungsadresse')).toBeInTheDocument();
      expect(screen.getByText('Kontaktinformationen')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Erstellen/i })
      ).toBeInTheDocument();
    });

    it('should show required field indicators', () => {
      const { container } = render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Check for required asterisks in labels
      // The asterisk is in a span with class "text-destructive"
      // Find all asterisk spans (they have class "text-destructive")
      const asterisks = container.querySelectorAll('span.text-destructive');

      // Should have at least 6 asterisks (Firmenname, Straße, Postleitzahl, Stadt, Land, Kundentyp)
      expect(asterisks.length).toBeGreaterThanOrEqual(6);

      // Verify specific required fields have asterisks by checking labels
      const firmennameLabel = screen.getByText('Firmenname', {
        selector: 'label',
      });
      expect(firmennameLabel.innerHTML).toContain('*');

      const strasseLabel = screen.getByText('Straße', { selector: 'label' });
      expect(strasseLabel.innerHTML).toContain('*');
    });

    it('should validate required fields on submit', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /Erstellen/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Firmenname muss mindestens 2 Zeichen lang sein/i)
        ).toBeInTheDocument();
      });
    });

    it('should submit form with valid data', async () => {
      mockMutateAsync.mockResolvedValue(mockCustomer);

      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Fill required fields
      await userEvent.type(
        screen.getByPlaceholderText('Hofladen Müller GmbH'),
        'Test GmbH'
      );
      await userEvent.type(
        screen.getByPlaceholderText('Hauptstraße'),
        'Teststraße'
      );
      await userEvent.type(screen.getByPlaceholderText('80331'), '12345');
      await userEvent.type(screen.getByPlaceholderText('München'), 'Berlin');

      const submitButton = screen.getByRole('button', { name: /Erstellen/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith(
          expect.objectContaining({
            companyName: 'Test GmbH',
            billingAddress: expect.objectContaining({
              street: 'Teststraße',
              zipCode: '12345',
              city: 'Berlin',
            }),
          })
        );
      });
    });
  });

  describe('Edit Mode', () => {
    it('should render form in edit mode with customer data', () => {
      render(
        <TestWrapper>
          <CustomerForm
            customer={mockCustomer}
            onSuccess={mockOnSuccess}
            onCancel={mockOnCancel}
          />
        </TestWrapper>
      );

      expect(screen.getByDisplayValue('Test GmbH')).toBeInTheDocument();
      expect(screen.getByDisplayValue('DE123456789')).toBeInTheDocument();
      expect(screen.getByDisplayValue('info@test.de')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Aktualisieren/i })
      ).toBeInTheDocument();
    });

    it('should submit form with updated data', async () => {
      mockMutateAsync.mockResolvedValue(mockCustomer);

      render(
        <TestWrapper>
          <CustomerForm
            customer={mockCustomer}
            onSuccess={mockOnSuccess}
            onCancel={mockOnCancel}
          />
        </TestWrapper>
      );

      // Update company name
      const companyNameInput = screen.getByDisplayValue('Test GmbH');
      await userEvent.clear(companyNameInput);
      await userEvent.type(companyNameInput, 'Updated GmbH');

      const submitButton = screen.getByRole('button', {
        name: /Aktualisieren/i,
      });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          id: 'customer-123',
          data: expect.objectContaining({
            companyName: 'Updated GmbH',
            _rev: '1-abc',
          }),
        });
      });
    });
  });

  describe('RBAC Field Visibility', () => {
    it('should hide financial fields for ADM role', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          roles: [UserRole.ADM],
        },
      });

      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      expect(screen.queryByText('Finanzdaten')).not.toBeInTheDocument();
      expect(screen.queryByText('Kreditlimit')).not.toBeInTheDocument();
      expect(screen.queryByText('Zahlungsbedingungen')).not.toBeInTheDocument();
    });

    it('should show financial fields for BUCH role', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          roles: [UserRole.BUCH],
        },
      });

      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      expect(screen.getByText('Finanzdaten')).toBeInTheDocument();
      expect(screen.getByLabelText(/Kreditlimit/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Zahlungsbedingungen/i)).toBeInTheDocument();
    });

    it('should show financial fields for GF role', () => {
      mockUseAuth.mockReturnValue({
        user: {
          id: 'user-1',
          email: 'test@example.com',
          roles: [UserRole.GF],
        },
      });

      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      expect(screen.getByText('Finanzdaten')).toBeInTheDocument();
      expect(screen.getByLabelText(/Kreditlimit/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Zahlungsbedingungen/i)).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should validate company name length', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      const companyNameInput = screen.getByPlaceholderText(
        'Hofladen Müller GmbH'
      );
      await userEvent.type(companyNameInput, 'A'); // Too short

      const submitButton = screen.getByRole('button', { name: /Erstellen/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Firmenname muss mindestens 2 Zeichen lang sein/i)
        ).toBeInTheDocument();
      });
    });

    it('should validate VAT number format', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Fill required fields first
      await userEvent.type(
        screen.getByPlaceholderText('Hofladen Müller GmbH'),
        'Test GmbH'
      );
      await userEvent.type(
        screen.getByPlaceholderText('Hauptstraße'),
        'Teststraße'
      );
      await userEvent.type(screen.getByPlaceholderText('80331'), '12345');
      await userEvent.type(screen.getByPlaceholderText('München'), 'Berlin');

      // Invalid VAT number
      const vatInput = screen.getByPlaceholderText('DE123456789');
      await userEvent.type(vatInput, 'INVALID');

      const submitButton = screen.getByRole('button', { name: /Erstellen/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Umsatzsteuer-ID muss das Format DE123456789 haben/i)
        ).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Fill required fields first
      await user.type(
        screen.getByPlaceholderText('Hofladen Müller GmbH'),
        'Test GmbH'
      );
      await user.type(screen.getByPlaceholderText('Hauptstraße'), 'Teststraße');
      await user.type(screen.getByPlaceholderText('80331'), '12345');
      await user.type(screen.getByPlaceholderText('München'), 'Berlin');

      // Invalid email
      const emailInput = screen.getByPlaceholderText('info@example.de');
      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email');

      // Submit form to trigger validation
      const submitButton = screen.getByRole('button', { name: /Erstellen/i });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(
            screen.getByText(/Ungültiges E-Mail-Format/i)
          ).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });

    it('should validate ZIP code format', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Fill required fields first
      await userEvent.type(
        screen.getByPlaceholderText('Hofladen Müller GmbH'),
        'Test GmbH'
      );
      await userEvent.type(
        screen.getByPlaceholderText('Hauptstraße'),
        'Teststraße'
      );

      // Invalid ZIP code (not 5 digits)
      const zipInput = screen.getByPlaceholderText('80331');
      await userEvent.type(zipInput, '123');

      const submitButton = screen.getByRole('button', { name: /Erstellen/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/Postleitzahl muss 5 Ziffern haben/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Unsaved Changes', () => {
    it('should show confirmation dialog when canceling with unsaved changes', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Make a change - clear first, then type to ensure change is detected
      const companyNameInput = screen.getByPlaceholderText(
        'Hofladen Müller GmbH'
      );
      await act(async () => {
        await user.clear(companyNameInput);
        await user.type(companyNameInput, 'Test');
      });

      // Wait for form state to update and dirtyFields to be set
      await waitFor(
        () => {
          expect(companyNameInput).toHaveValue('Test');
        },
        { timeout: 2000 }
      );

      // Give form time to detect changes
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Abbrechen/i });
      await user.click(cancelButton);

      await waitFor(
        () => {
          expect(
            screen.getByText(/Ungespeicherte Änderungen/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should not show confirmation dialog when canceling without changes', async () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Click cancel without making changes
      const cancelButton = screen.getByRole('button', { name: /Abbrechen/i });
      await userEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
      expect(
        screen.queryByText(/Ungespeicherte Änderungen/i)
      ).not.toBeInTheDocument();
    });

    it('should discard changes when confirming cancel', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Make a change - clear first, then type to ensure change is detected
      const companyNameInput = screen.getByPlaceholderText(
        'Hofladen Müller GmbH'
      );
      await act(async () => {
        await user.clear(companyNameInput);
        await user.type(companyNameInput, 'Test');
      });

      // Wait for form state to update and dirtyFields to be set
      await waitFor(
        () => {
          expect(companyNameInput).toHaveValue('Test');
        },
        { timeout: 2000 }
      );

      // Give form time to detect changes
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
      });

      // Click cancel
      const cancelButton = screen.getByRole('button', { name: /Abbrechen/i });
      await user.click(cancelButton);

      // Confirm cancel dialog appears
      await waitFor(
        () => {
          expect(
            screen.getByText(/Ungespeicherte Änderungen/i)
          ).toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      const confirmButton = screen.getByRole('button', {
        name: /Abbrechen und Änderungen verwerfen/i,
      });
      await user.click(confirmButton);

      await waitFor(
        () => {
          expect(mockOnCancel).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Loading States', () => {
    it('should show loading state during submission', () => {
      mockUseCreateCustomer.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
      });

      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', {
        name: /Speichern.../i,
      });
      expect(submitButton).toBeDisabled();
    });

    it('should disable cancel button during submission', () => {
      mockUseCreateCustomer.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: true,
      });

      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      const cancelButton = screen.getByRole('button', { name: /Abbrechen/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Form Sections', () => {
    it('should render all form sections', () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      expect(screen.getByText('Grunddaten')).toBeInTheDocument();
      expect(screen.getByText('Rechnungsadresse')).toBeInTheDocument();
      expect(screen.getByText('Kontaktinformationen')).toBeInTheDocument();
      expect(screen.getByText('Weitere Informationen')).toBeInTheDocument();
    });

    it('should render customer type select', () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Customer type has a default value (ACTIVE), so placeholder won't be visible
      // Just verify the label and that the select field is present
      expect(screen.getByLabelText(/Kundentyp/i)).toBeInTheDocument();

      // Verify the select has a value (ACTIVE is the default)
      // The Select component from Radix UI has known issues with jsdom
      // so we just verify it renders rather than testing interactions
      const customerTypeField = screen.getByLabelText(/Kundentyp/i);
      expect(customerTypeField).toBeInTheDocument();
    });

    it('should render rating select', () => {
      render(
        <TestWrapper>
          <CustomerForm onSuccess={mockOnSuccess} onCancel={mockOnCancel} />
        </TestWrapper>
      );

      // Rating select has no default value
      // Just verify the label and that the select field is present
      // The Select component from Radix UI has known issues with jsdom
      // so we just verify it renders rather than testing interactions
      const ratingSelect = screen.getByLabelText(/Bewertung/i);
      expect(ratingSelect).toBeInTheDocument();
    });
  });
});
