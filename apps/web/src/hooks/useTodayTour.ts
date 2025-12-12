import { useState, useEffect, useCallback } from "react";
import { toursApi } from "@/services/apiClient";

export interface TourStop {
    id: string;
    name: string;
    address: string;
    status: 'pending' | 'visited' | 'skipped';
}

export interface Tour {
    _id: string;
    date: string;
    stops: TourStop[];
    status: string;
}

export function useTodayTour() {
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchTodayTour = useCallback(async () => {
        setLoading(true);
        try {
            const today = new Date().toISOString().split("T")[0];
            const response = await toursApi.list({ date: today });

            if (response && response.data && response.data.length > 0) {
                setTour(response.data[0] as unknown as Tour);
            } else {
                setTour(null);
            }
            setError(null);
        } catch (err) {
            console.error("Error fetching today's tour", err);
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTodayTour();
    }, [fetchTodayTour]);

    return { tour, loading, error, refetch: fetchTodayTour };
}
