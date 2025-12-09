import { render, screen, fireEvent } from '@testing-library/react';
import { SupplierInvoiceList } from './SupplierInvoiceList';
import { useSupplierInvoice } from '@/hooks/useSupplierInvoice';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

// Mock hook
vi.mock('@/hooks/useSupplierInvoice');

describe('SupplierInvoiceList', () => {
    const mockUseInvoices = vi.fn();
    const mockApproveInvoice = { mutateAsync: vi.fn() };

    beforeEach(() => {
        (useSupplierInvoice as unknown as Mock).mockReturnValue({
            useInvoices: mockUseInvoices,
            approveInvoice: mockApproveInvoice,
        });
    });

    it('renders loading state', () => {
        mockUseInvoices.mockReturnValue({ isLoading: true });
        render(<MemoryRouter><SupplierInvoiceList /></MemoryRouter>);
        expect(screen.getByText('Loading invoices...')).toBeDefined();
    });

    it('renders invoice list', () => {
        const invoices = [
            {
                _id: '1',
                invoiceNumber: 'INV-001',
                invoiceDate: '2023-01-01',
                grossAmount: 1000,
                paymentStatus: 'Pending',
                matchValidation: { poMatch: true, deliveryMatch: true },
            }
        ];
        mockUseInvoices.mockReturnValue({ isLoading: false, data: invoices });

        render(<MemoryRouter><SupplierInvoiceList /></MemoryRouter>);
        expect(screen.getByText('INV-001')).toBeDefined();
        expect(screen.getByText('1000.00 €')).toBeDefined();
        expect(screen.getByText('Pending')).toBeDefined();
    });

    it('calls approve when button clicked', async () => {
        const invoices = [
            {
                _id: '1',
                invoiceNumber: 'INV-001',
                invoiceDate: '2023-01-01',
                grossAmount: 1000,
                paymentStatus: 'Pending',
                matchValidation: { poMatch: true, deliveryMatch: true },
            }
        ];
        mockUseInvoices.mockReturnValue({ isLoading: false, data: invoices });

        render(<MemoryRouter><SupplierInvoiceList /></MemoryRouter>);

        const approveBtns = screen.getAllByText('Approve');
        fireEvent.click(approveBtns[0]);

        expect(mockApproveInvoice.mutateAsync).toHaveBeenCalledWith('1');
    });
});
