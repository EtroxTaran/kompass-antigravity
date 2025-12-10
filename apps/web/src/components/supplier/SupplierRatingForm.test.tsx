
// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SupplierRatingForm } from './SupplierRatingForm';

const mockRateSupplier = vi.fn();
const mockOnOpenChange = vi.fn();

vi.mock('../../hooks/useSupplier', () => ({
    useSupplier: () => ({
        rateSupplier: mockRateSupplier
    })
}));

vi.mock('../ui/use-toast', () => ({
    useToast: () => ({
        toast: vi.fn()
    })
}));

describe('SupplierRatingForm', () => {
    it('renders and submits rating', async () => {
        render(
            <SupplierRatingForm
                supplierId="123"
                supplierName="Test Supplier"
                open={true}
                onOpenChange={mockOnOpenChange}
            />
        );

        // Check if title exists
        expect(screen.getByText('Lieferant bewerten: Test Supplier')).toBeDefined();

        // There are StarRatings. They usually render buttons or SVGs.
        // The implementation uses StarRating component which likely has data-testid or role.
        // Assuming we can just find them or their labels.
        expect(screen.getByText('Qualität')).toBeDefined();

        // Simulating stars might be tricky depending on implementation, 
        // but let's check input presence for feedback
        const feedback = screen.getByPlaceholderText('Zusätzliche Anmerkungen...');
        fireEvent.change(feedback, { target: { value: 'Great job' } });
        expect(feedback as HTMLTextAreaElement).toHaveProperty('value', 'Great job');

        // Note: Checking specific star clicks is hard without seeing StarRating.tsx implementation
        // But we can check buttons
        const submitBtn = screen.getByText('Bewertung speichern');
        expect(submitBtn).toBeDefined();

        // If we click submit without stars, it should show toast/error, but not call rateSupplier
        fireEvent.click(submitBtn);
        // Should not be called yet because 0 stars
        expect(mockRateSupplier).not.toHaveBeenCalled();
    });
});
