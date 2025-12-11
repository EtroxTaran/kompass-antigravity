import { useState, useCallback } from "react";
import { toursApi } from "@/services/apiClient";

export interface RouteStop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  status: "pending" | "visited" | "overdue";
  scheduledTime?: string;
}

export interface RouteInfo {
  totalDistance: number; // km
  totalDuration: number; // minutes
  stops: RouteStop[];
}

export function useRoutePlanner(initialStops: RouteStop[] = []) {
  const [stops, setStops] = useState<RouteStop[]>(initialStops);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addStop = useCallback((stop: RouteStop) => {
    setStops((prev) => [...prev, stop]);
  }, []);

  const removeStop = useCallback((stopId: string) => {
    setStops((prev) => prev.filter((s) => s.id !== stopId));
  }, []);

  const reorderStops = useCallback((fromIndex: number, toIndex: number) => {
    setStops((prev) => {
      const newStops = [...prev];
      const [removed] = newStops.splice(fromIndex, 1);
      newStops.splice(toIndex, 0, removed);
      return newStops;
    });
  }, []);

  const updateStopStatus = useCallback(
    (stopId: string, status: RouteStop["status"]) => {
      setStops((prev) =>
        prev.map((s) => (s.id === stopId ? { ...s, status } : s)),
      );
    },
    [],
  );

  const calculateRoute = useCallback(() => {
    // Simple route info without optimization (just show current stops)
    if (stops.length < 2) {
      setRouteInfo(null);
      return;
    }

    // Estimate: 10km and 15 min per stop (fallback when not optimizing)
    const info: RouteInfo = {
      totalDistance: (stops.length - 1) * 10,
      totalDuration: (stops.length - 1) * 15,
      stops,
    };
    setRouteInfo(info);
  }, [stops]);

  const optimizeRoute = useCallback(async () => {
    if (stops.length < 2) {
      setError("At least 2 stops required for optimization");
      return;
    }

    setIsOptimizing(true);
    setError(null);

    try {
      // Prepare stops for API (without status field)
      const stopsForApi = stops.map(({ id, name, address, lat, lng }) => ({
        id,
        name,
        address,
        lat,
        lng,
      }));

      const response = await toursApi.optimize(stopsForApi);

      // Map optimized stops back with their status preserved
      const optimizedStops = response.stops.map((optimizedStop) => {
        const originalStop = stops.find((s) => s.id === optimizedStop.id);
        return {
          ...optimizedStop,
          status: originalStop?.status || "pending",
          scheduledTime: originalStop?.scheduledTime,
        } as RouteStop;
      });

      setStops(optimizedStops);
      setRouteInfo({
        totalDistance: response.totalDistanceKm,
        totalDuration: response.estimatedDurationMinutes,
        stops: optimizedStops,
      });
    } catch (err) {
      console.error("Route optimization failed:", err);
      setError("Optimization failed. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  }, [stops]);

  const clearRoute = useCallback(() => {
    setStops([]);
    setRouteInfo(null);
    setError(null);
  }, []);

  const openExternalNavigation = useCallback((stop: RouteStop) => {
    // Open in Google Maps or Apple Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`;
    window.open(url, "_blank");
  }, []);

  return {
    stops,
    routeInfo,
    isOptimizing,
    error,
    addStop,
    removeStop,
    reorderStops,
    updateStopStatus,
    calculateRoute,
    optimizeRoute,
    clearRoute,
    openExternalNavigation,
  };
}

export default useRoutePlanner;
