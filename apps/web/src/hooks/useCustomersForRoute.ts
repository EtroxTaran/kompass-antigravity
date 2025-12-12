import { useState, useEffect, useMemo } from "react";
import { customersApi } from "@/services/apiClient";
import { RouteStop } from "./useRoutePlanner";

interface CustomerAddress {
    street: string;
    streetNumber?: string;
    zipCode: string;
    city: string;
    latitude?: number;
    longitude?: number;
}

interface Customer {
    _id: string;
    companyName: string;
    billingAddress: CustomerAddress;
    lastVisit?: string;
    visitFrequencyDays?: number;
}

export type VisitStatusFilter = "all" | "pending" | "overdue";

/**
 * Determines the visit status based on lastVisit and visitFrequencyDays
 */
function calculateVisitStatus(
    lastVisit?: string,
    visitFrequencyDays?: number,
): "pending" | "overdue" {
    if (!lastVisit || !visitFrequencyDays) {
        return "pending";
    }

    const lastVisitDate = new Date(lastVisit);
    const nextVisitDue = new Date(lastVisitDate);
    nextVisitDue.setDate(nextVisitDue.getDate() + visitFrequencyDays);

    return new Date() > nextVisitDue ? "overdue" : "pending";
}

/**
 * Formats customer address for display
 */
function formatAddress(address: CustomerAddress): string {
    const parts = [
        address.street,
        address.streetNumber,
        address.zipCode,
        address.city,
    ].filter(Boolean);
    return parts.join(" ");
}

/**
 * Hook to fetch customers for route planning
 * - Fetches all customers from API
 * - Transforms them into RouteStop format
 * - Filters by visit status
 * - Only includes customers with valid coordinates
 */
export function useCustomersForRoute(statusFilter: VisitStatusFilter = "all") {
    const [customers, setCustomers] = useState<RouteStop[]>([]);
    const [allCustomers, setAllCustomers] = useState<RouteStop[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch customers on mount
    useEffect(() => {
        async function fetchCustomers() {
            setIsLoading(true);
            setError(null);

            try {
                const response = await customersApi.list();
                const customerData = response.data as Customer[];

                // Transform to RouteStop format, only include those with coordinates
                const routeStops: RouteStop[] = customerData
                    .filter(
                        (c) =>
                            c.billingAddress?.latitude != null &&
                            c.billingAddress?.longitude != null,
                    )
                    .map((customer) => ({
                        id: customer._id,
                        name: customer.companyName,
                        address: formatAddress(customer.billingAddress),
                        lat: customer.billingAddress.latitude!,
                        lng: customer.billingAddress.longitude!,
                        status: calculateVisitStatus(
                            customer.lastVisit,
                            customer.visitFrequencyDays,
                        ),
                    }));

                setAllCustomers(routeStops);
            } catch (err) {
                console.error("Failed to fetch customers:", err);
                setError("Kunden konnten nicht geladen werden");
            } finally {
                setIsLoading(false);
            }
        }

        fetchCustomers();
    }, []);

    // Filter customers by status
    const filteredCustomers = useMemo(() => {
        if (statusFilter === "all") {
            return allCustomers;
        }
        return allCustomers.filter((c) => c.status === statusFilter);
    }, [allCustomers, statusFilter]);

    // Update customers when filter changes
    useEffect(() => {
        setCustomers(filteredCustomers);
    }, [filteredCustomers]);

    return {
        customers,
        isLoading,
        error,
        totalCount: allCustomers.length,
        overdueCount: allCustomers.filter((c) => c.status === "overdue").length,
    };
}

export default useCustomersForRoute;
