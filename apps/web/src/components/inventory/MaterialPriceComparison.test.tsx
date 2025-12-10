/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { MaterialPriceComparison } from "./MaterialPriceComparison";
import { SupplierPrice } from "@kompass/shared";
import { describe, it, expect, vi } from "vitest";

describe("MaterialPriceComparison", () => {
    const mockSupplierPrices: SupplierPrice[] = [
        {
            supplierId: "1",
            supplierName: "Supplier A",
            unitPrice: 10.5,
            currency: "EUR",
            minimumOrderQuantity: 100,
            leadTimeDays: 5,
            isPreferred: true,
            rating: 4.8,
        },
        {
            supplierId: "2",
            supplierName: "Supplier B",
            unitPrice: 8.0,
            currency: "EUR",
            minimumOrderQuantity: 50,
            leadTimeDays: 7,
            isPreferred: false,
            rating: 3.5,
        },
        {
            supplierId: "3",
            supplierName: "Supplier C",
            unitPrice: 12.0,
            currency: "EUR",
            minimumOrderQuantity: 25,
            leadTimeDays: 3,
            isPreferred: false,
            // No rating - tests undefined handling
        },
    ];

    it("renders supplier list with rating column", () => {
        render(<MaterialPriceComparison supplierPrices={mockSupplierPrices} />);

        // Check supplier names render
        expect(screen.getByText("Supplier A")).toBeDefined();
        expect(screen.getByText("Supplier B")).toBeDefined();
        expect(screen.getByText("Supplier C")).toBeDefined();

        // Check rating values are displayed (new feature)
        expect(screen.getByText("4.8")).toBeDefined();
        expect(screen.getByText("3.5")).toBeDefined();
        // Supplier C has no rating, should show dash
        expect(screen.getByText("—")).toBeDefined();
    });

    it("highlights lowest price supplier with badge", () => {
        render(<MaterialPriceComparison supplierPrices={mockSupplierPrices} />);
        expect(screen.getByText("Günstigster")).toBeDefined();
    });

    it("displays preferred supplier with star", () => {
        render(<MaterialPriceComparison supplierPrices={mockSupplierPrices} />);
        expect(screen.getByText("Supplier A")).toBeDefined();
    });

    it("calls onSelectSupplier when button clicked", () => {
        const mockOnSelect = vi.fn();
        render(
            <MaterialPriceComparison
                supplierPrices={mockSupplierPrices}
                onSelectSupplier={mockOnSelect}
            />
        );

        const selectButtons = screen.getAllByText("Wählen");
        expect(selectButtons.length).toBe(3);

        fireEvent.click(selectButtons[0]);
        expect(mockOnSelect).toHaveBeenCalledWith("2", "Supplier B", 8.0);
    });

    it("renders empty state when no suppliers", () => {
        render(<MaterialPriceComparison supplierPrices={[]} />);
        expect(
            screen.getByText("Keine Lieferantenpreise hinterlegt.")
        ).toBeDefined();
    });
});
