import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { customerService } from '@/services/customer.service';

import { CustomerListPage } from '../CustomerListPage';

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
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

// Mock the customer service
vi.mock('@/services/customer.service', () => ({
  customerService: {
    getAll: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockCustomers: Customer[] = [
  {
    _id: 'customer-1',
    _rev: '1-abc',
    type: 'customer',
    companyName: 'Test GmbH',
    vatNumber: 'DE123456789',
    email: 'info@test.de',
    phone: '+49-89-1234567',
    rating: 'A',
    billingAddress: {
      street: 'Teststraße 1',
      zipCode: '80331',
      city: 'München',
      country: 'Deutschland',
    },
    createdBy: 'user-1',
    createdAt: new Date(),
    modifiedBy: 'user-1',
    modifiedAt: new Date(),
    version: 1,
  },
  {
    _id: 'customer-2',
    _rev: '1-def',
    type: 'customer',
    companyName: 'Example AG',
    vatNumber: 'DE987654321',
    email: 'contact@example.de',
    phone: '+49-30-9876543',
    rating: 'B',
    billingAddress: {
      street: 'Beispielweg 2',
      zipCode: '10115',
      city: 'Berlin',
      country: 'Deutschland',
    },
    createdBy: 'user-1',
    createdAt: new Date(),
    modifiedBy: 'user-1',
    modifiedAt: new Date(),
    version: 1,
  },
  {
    _id: 'customer-3',
    _rev: '1-ghi',
    type: 'customer',
    companyName: 'Another Company',
    vatNumber: 'DE111222333',
    email: 'info@another.de',
    phone: '+49-40-1112223',
    rating: 'C',
    billingAddress: {
      street: 'Andere Straße 3',
      zipCode: '20095',
      city: 'Hamburg',
      country: 'Deutschland',
    },
    createdBy: 'user-1',
    createdAt: new Date(),
    modifiedBy: 'user-1',
    modifiedAt: new Date(),
    version: 1,
  },
];

describe('CustomerListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(customerService).getAll.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    expect(screen.getByText('Kunden')).toBeInTheDocument();
    // Check for skeleton elements
    const skeletons = document.querySelectorAll(
      '[class*="skeleton"], [class*="Skeleton"]'
    );
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render customer list when data is loaded', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue(mockCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test GmbH')).toBeInTheDocument();
      expect(screen.getByText('Example AG')).toBeInTheDocument();
    });

    expect(screen.getByText('DE123456789')).toBeInTheDocument();
    expect(screen.getByText('München')).toBeInTheDocument();
  });

  it('should render empty state when no customers', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue([]);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Noch keine Kunden vorhanden')
      ).toBeInTheDocument();
    });
  });

  it('should render error state when API call fails', async () => {
    const errorMessage = 'Failed to load customers';
    vi.mocked(customerService).getAll.mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Fehler')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should navigate to customer detail when row is clicked', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue(mockCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test GmbH')).toBeInTheDocument();
    });

    const row = screen.getByText('Test GmbH').closest('tr');
    if (row) {
      await userEvent.click(row);
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/customers/customer-1');
      });
    }
  });

  it('should display rating badges correctly', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue(mockCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
      expect(screen.getByText('C')).toBeInTheDocument();
    });
  });

  it('should display controls bar with search input', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue(mockCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Kunden durchsuchen/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('should filter customers by search term', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue(mockCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test GmbH')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Kunden durchsuchen/i);
    await userEvent.type(searchInput, 'Test');

    // Wait for debounce
    await waitFor(
      () => {
        expect(screen.getByText('Test GmbH')).toBeInTheDocument();
        expect(screen.queryByText('Example AG')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });

  it('should show filter button', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue(mockCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const filterButton = screen.getByText(/Filter/i);
      expect(filterButton).toBeInTheDocument();
    });
  });

  it('should show primary action button', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue(mockCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      const newCustomerButton = screen.getByText(/Neuer Kunde/i);
      expect(newCustomerButton).toBeInTheDocument();
    });
  });

  it('should display pagination when more than pageSize items', async () => {
    // Create 25 customers to trigger pagination
    const manyCustomers = Array.from({ length: 25 }, (_, i) => ({
      ...mockCustomers[0],
      _id: `customer-${i}`,
      companyName: `Company ${i}`,
    }));

    vi.mocked(customerService).getAll.mockResolvedValue(manyCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should show pagination info
      expect(screen.getByText(/Zeige/i)).toBeInTheDocument();
    });
  });

  it('should allow row selection with checkbox', async () => {
    vi.mocked(customerService).getAll.mockResolvedValue(mockCustomers);

    render(
      <TestWrapper>
        <CustomerListPage />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test GmbH')).toBeInTheDocument();
    });

    // Find checkboxes (header + rows)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThan(0);
  });
});
