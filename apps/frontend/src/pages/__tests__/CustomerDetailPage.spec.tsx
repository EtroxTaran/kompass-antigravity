import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter, useParams, useNavigate } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  UserRole,
  EntityType,
  Permission,
  hasAnyRolePermission,
  CustomerType,
  CustomerBusinessType,
} from '@kompass/shared';

import { useAuth } from '@/hooks/useAuth';
import { useCustomer } from '@/hooks/useCustomer';
import { customerService } from '@/services/customer.service';

import { CustomerDetailPage } from '../CustomerDetailPage';

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
        cacheTime: 0, // Disable cache for tests
        staleTime: 0, // Always consider data stale
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

// Mock hooks and services
vi.mock('@/hooks/useCustomer');
vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));
vi.mock('@/services/customer.service', () => ({
  customerService: {
    getById: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  };
});

// Mock hasAnyRolePermission from shared
vi.mock('@kompass/shared', async () => {
  const actual = await vi.importActual('@kompass/shared');
  return {
    ...actual,
    hasAnyRolePermission: vi.fn(),
  };
});

const mockNavigate = vi.fn();
const mockUseParams = useParams as ReturnType<typeof vi.fn>;
const mockUseNavigate = useNavigate as ReturnType<typeof vi.fn>;
const mockUseCustomer = useCustomer as ReturnType<typeof vi.fn>;
const mockUseAuth = useAuth as ReturnType<typeof vi.fn>;
const mockHasAnyRolePermission = hasAnyRolePermission as ReturnType<
  typeof vi.fn
>;

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
  website: 'https://test.de',
  billingAddress: {
    street: 'Teststraße',
    streetNumber: '1',
    zipCode: '80331',
    city: 'München',
    country: 'Deutschland',
  },
  locations: ['location-1'],
  contactPersons: ['contact-1', 'contact-2'],
  customerType: CustomerType.ACTIVE,
  customerBusinessType: CustomerBusinessType.RETAIL,
  rating: 'A',
  owner: 'user-123',
  accountManager: 'user-456',
  customerSince: new Date('2023-01-01'),
  creditLimit: 50000,
  paymentTerms: 30,
  accountBalance: 1000,
  totalRevenue: 100000,
  profitMargin: 15.5,
  createdBy: 'user-123',
  createdAt: new Date('2023-01-01T10:00:00Z'),
  modifiedBy: 'user-123',
  modifiedAt: new Date('2023-12-31T15:30:00Z'),
  version: 1,
};

describe('CustomerDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ id: 'customer-123' });
    mockUseNavigate.mockReturnValue(mockNavigate);
  });

  it('should render loading state initially', async () => {
    mockUseCustomer.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    const { container } = render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    // Check for skeleton elements
    await waitFor(() => {
      const skeletons = container.querySelectorAll('[class*="animate-pulse"]');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  it('should render customer data when loaded', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    // Mock permissions: ADM can read and update own customer, cannot delete
    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return roles.includes(UserRole.ADM);
      }
      if (entity === EntityType.Customer && permission === Permission.UPDATE) {
        return roles.includes(UserRole.ADM);
      }
      if (entity === EntityType.Customer && permission === Permission.DELETE) {
        return roles.includes(UserRole.GF);
      }
      return false;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
      expect(screen.getByText('DE123456789')).toBeInTheDocument();
      expect(screen.getByText('info@test.de')).toBeInTheDocument();
      expect(screen.getByText('+49-89-1234567')).toBeInTheDocument();
    });

    // Check that edit button is visible (ADM can update own customer)
    const editButton = screen.getByRole('button', { name: /Bearbeiten/i });
    expect(editButton).toBeInTheDocument();
    expect(editButton).not.toBeDisabled();

    // Delete button should not be visible (ADM cannot delete)
    expect(
      screen.queryByRole('button', { name: /Löschen/i })
    ).not.toBeInTheDocument();
  });

  it('should show delete button for GF role', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-999',
        roles: [UserRole.GF],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    // Mock permissions: GF can read, update and delete
    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return roles.includes(UserRole.GF);
      }
      if (entity === EntityType.Customer && permission === Permission.UPDATE) {
        return roles.includes(UserRole.GF);
      }
      if (entity === EntityType.Customer && permission === Permission.DELETE) {
        return roles.includes(UserRole.GF);
      }
      return true;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    // Delete button should be visible for GF
    const deleteButton = screen.getByRole('button', { name: /Löschen/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it('should disable edit button if user cannot update', async () => {
    // Use GF role (can view all customers) but without UPDATE permission
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-999',
        roles: [UserRole.GF],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    // Mock permissions: GF can read but cannot update (UPDATE permission denied)
    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return roles.includes(UserRole.GF);
      }
      if (entity === EntityType.Customer && permission === Permission.UPDATE) {
        return false; // UPDATE denied
      }
      return false;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    // Edit button should be disabled (no UPDATE permission)
    const editButton = screen.getByRole('button', { name: /Bearbeiten/i });
    expect(editButton).toBeDisabled();
  });

  it('should hide financial fields for ADM role', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      // Allow READ permission to view the page
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return true;
      }
      return false;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    // Financial section should not be visible for ADM
    expect(screen.queryByText('Geschäftsdaten')).not.toBeInTheDocument();
  });

  it('should show financial fields for GF role', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-999',
        roles: [UserRole.GF],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    mockHasAnyRolePermission.mockImplementation(() => true);

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
      expect(screen.getByText('Geschäftsdaten')).toBeInTheDocument();
    });

    // Check financial fields are visible
    expect(screen.getByText(/Kreditlimit/i)).toBeInTheDocument();
    expect(screen.getByText(/Kontostand/i)).toBeInTheDocument();
  });

  it('should navigate to edit page when edit button is clicked', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    // Mock permissions: ADM can read and update own customer
    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return roles.includes(UserRole.ADM);
      }
      if (entity === EntityType.Customer && permission === Permission.UPDATE) {
        return roles.includes(UserRole.ADM);
      }
      return false;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: /Bearbeiten/i });
    await userEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/customers/customer-123/edit');
  });

  it('should show delete confirmation dialog when delete button is clicked', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-999',
        roles: [UserRole.GF],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    mockHasAnyRolePermission.mockImplementation(() => true);

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: /Löschen/i });
    await userEvent.click(deleteButton);

    // Dialog should appear
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Kunde löschen' })
      ).toBeInTheDocument();
      // Text is split by <strong> tag, so use a flexible matcher
      expect(
        screen.getByText((content, element) => {
          const hasText =
            content?.includes('Möchten Sie') &&
            content?.includes('wirklich löschen');
          const includesCompanyName =
            element?.textContent?.includes('Test GmbH');
          return Boolean(hasText && includesCompanyName);
        })
      ).toBeInTheDocument();
    });
  });

  it('should call delete service and navigate when confirmed', async () => {
    vi.mocked(customerService.delete).mockResolvedValue(undefined);

    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-999',
        roles: [UserRole.GF],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    mockHasAnyRolePermission.mockImplementation(() => true);

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /Löschen/i });
    await userEvent.click(deleteButton);

    // Wait for dialog
    await waitFor(() => {
      expect(screen.getByText('Kunde löschen')).toBeInTheDocument();
    });

    // Click confirm
    const confirmButton = screen.getByRole('button', { name: /Löschen$/i });
    await userEvent.click(confirmButton);

    // Should call delete service
    await waitFor(() => {
      expect(vi.mocked(customerService.delete)).toHaveBeenCalledWith(
        'customer-123'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/customers');
    });
  });

  it('should navigate back to list when back button is clicked', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      // Allow READ permission to view the page
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return true;
      }
      return false;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', {
      name: /Zurück zur Liste/i,
    });
    await userEvent.click(backButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/customers');
    });
  });

  it('should render 404 error when customer not found', async () => {
    const mockError = {
      response: {
        status: 404,
      },
    };

    mockUseCustomer.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Kunde nicht gefunden')).toBeInTheDocument();
      expect(
        screen.getByText(/Der angeforderte Kunde konnte nicht gefunden werden/i)
      ).toBeInTheDocument();
    });
  });

  it('should render 403 error when access denied', async () => {
    const mockError = {
      response: {
        status: 403,
      },
    };

    mockUseCustomer.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: mockError,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    // User cannot view this customer
    mockHasAnyRolePermission.mockReturnValue(false);

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Zugriff verweigert')).toBeInTheDocument();
      expect(
        screen.getByText(
          /Sie haben keine Berechtigung, diesen Kunden anzusehen/i
        )
      ).toBeInTheDocument();
    });
  });

  it('should render general error state', async () => {
    // Create a plain Error (not an Axios error) to avoid 404/403 checks
    // Provide customer data so canView passes, but have an error to trigger general error handler
    const mockError = new Error('Network error');

    mockUseCustomer.mockReturnValue({
      data: mockCustomer, // Provide customer so canView is true
      isLoading: false,
      error: mockError, // But also have an error
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    // Mock permissions: allow READ so canView is true
    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return roles.includes(UserRole.ADM);
      }
      return false;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for error title (CardTitle renders as text)
      expect(screen.getByText('Fehler')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Erneut versuchen/i })
      ).toBeInTheDocument();
    });
  });

  it('should display all customer fields correctly', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-999',
        roles: [UserRole.GF],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    mockHasAnyRolePermission.mockImplementation(() => true);

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element) - more specific
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    // Basic information
    expect(screen.getByText('Stammdaten')).toBeInTheDocument();
    expect(screen.getByText('Test GmbH Legal')).toBeInTheDocument();
    expect(screen.getByText('HRB 123456')).toBeInTheDocument();

    // Contact information
    expect(screen.getByText('Kontaktdaten')).toBeInTheDocument();
    expect(screen.getByText('info@test.de')).toBeInTheDocument();
    expect(screen.getByText('+49-89-1234567')).toBeInTheDocument();

    // Billing address
    expect(screen.getByText('Rechnungsadresse')).toBeInTheDocument();

    // Locations and contacts are now in tabs - check tab headers
    const locationsTab = screen.getByRole('tab', { name: /Standorte/i });
    expect(locationsTab).toBeInTheDocument();
    expect(locationsTab).toHaveTextContent(/Standorte.*\(2\)/i);

    const contactsTab = screen.getByRole('tab', { name: /Kontakte/i });
    expect(contactsTab).toBeInTheDocument();
    expect(contactsTab).toHaveTextContent(/Kontakte.*\(2\)/i);

    // Financial (GF only)
    expect(screen.getByText('Geschäftsdaten')).toBeInTheDocument();
    expect(screen.getByText(/50\.000/i)).toBeInTheDocument(); // Credit limit formatted as currency

    // Metadata
    expect(screen.getByText('Metadaten')).toBeInTheDocument();
  });

  it('should display rating badge correctly', async () => {
    mockUseCustomer.mockReturnValue({
      data: mockCustomer,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      // Allow READ permission to view the page
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return true;
      }
      return false;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element)
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    // Rating badge should be displayed in header (check for badge element)
    const ratingBadges = screen.getAllByText('A');
    // At least one badge with "A" rating (there might be multiple)
    expect(ratingBadges.length).toBeGreaterThan(0);
  });

  it('should handle empty optional fields gracefully', async () => {
    const customerWithoutOptionalFields: Customer = {
      ...mockCustomer,
      email: undefined,
      phone: undefined,
      website: undefined,
      rating: undefined,
      locations: [],
      contactPersons: [],
      customerType: CustomerType.ACTIVE,
    };

    mockUseCustomer.mockReturnValue({
      data: customerWithoutOptionalFields,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseAuth.mockReturnValue({
      user: {
        _id: 'user-123',
        roles: [UserRole.ADM],
      },
      isAuthenticated: true,
      isLoading: false,
      error: null,
      login: vi.fn(),
      logout: vi.fn(),
      getToken: vi.fn(),
      refreshUserInfo: vi.fn(),
    });

    mockHasAnyRolePermission.mockImplementation((roles, entity, permission) => {
      // Allow READ permission to view the page
      if (entity === EntityType.Customer && permission === Permission.READ) {
        return true;
      }
      return false;
    });

    render(
      <TestWrapper>
        <CustomerDetailPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for customer name in header (h1 element)
      const header = screen.getByRole('heading', {
        level: 1,
        name: 'Test GmbH',
      });
      expect(header).toBeInTheDocument();
    });

    // Component should render without crashing
    expect(screen.getByText('Stammdaten')).toBeInTheDocument();
  });
});
