import { useState, useCallback } from "react";

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
    // Mock route calculation (in production, use Google Directions API)
    if (stops.length < 2) {
      setRouteInfo(null);
      return;
    }

    // Estimate: 10km and 15 min per stop
    const info: RouteInfo = {
      totalDistance: (stops.length - 1) * 10,
      totalDuration: (stops.length - 1) * 15,
      stops,
    };
    setRouteInfo(info);
  }, [stops]);

  const clearRoute = useCallback(() => {
    setStops([]);
    setRouteInfo(null);
  }, []);

  const openExternalNavigation = useCallback((stop: RouteStop) => {
    // Open in Google Maps or Apple Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=${stop.lat},${stop.lng}`;
    window.open(url, "_blank");
  }, []);

  return {
    stops,
    routeInfo,
    addStop,
    removeStop,
    reorderStops,
    updateStopStatus,
    calculateRoute,
    clearRoute,
    openExternalNavigation,
  };
}

export default useRoutePlanner;
