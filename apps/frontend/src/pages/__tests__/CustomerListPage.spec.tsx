import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';

import { CustomerListPage } from '../CustomerListPage';
import { customerService } from '@/services/customer.service';

import type { Customer } from '@kompass/shared/types/entities/customer';

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
];

describe('CustomerListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.mocked(customerService.getAll).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(
      <BrowserRouter>
        <CustomerListPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Kunden')).toBeInTheDocument();
    // Check for skeleton elements by their className pattern
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('should render customer list when data is loaded', async () => {
    vi.mocked(customerService.getAll).mockResolvedValue(mockCustomers);

    render(
      <BrowserRouter>
        <CustomerListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test GmbH')).toBeInTheDocument();
      expect(screen.getByText('Example AG')).toBeInTheDocument();
    });

    expect(screen.getByText('DE123456789')).toBeInTheDocument();
    expect(screen.getByText('München')).toBeInTheDocument();
  });

  it('should render empty state when no customers', async () => {
    vi.mocked(customerService.getAll).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <CustomerListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Keine Kunden vorhanden.')
      ).toBeInTheDocument();
    });
  });

  it('should render error state when API call fails', async () => {
    const errorMessage = 'Failed to load customers';
    vi.mocked(customerService.getAll).mockRejectedValue(
      new Error(errorMessage)
    );

    render(
      <BrowserRouter>
        <CustomerListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Fehler')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('should navigate to customer detail when row is clicked', async () => {
    vi.mocked(customerService.getAll).mockResolvedValue(mockCustomers);

    render(
      <BrowserRouter>
        <CustomerListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test GmbH')).toBeInTheDocument();
    });

    const row = screen.getByText('Test GmbH').closest('tr');
    if (row) {
      row.click();
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/customers/customer-1');
      });
    }
  });

  it('should display rating badges correctly', async () => {
    vi.mocked(customerService.getAll).mockResolvedValue(mockCustomers);

    render(
      <BrowserRouter>
        <CustomerListPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('A')).toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();
    });
  });
});

