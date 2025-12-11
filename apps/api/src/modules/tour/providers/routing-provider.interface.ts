export interface RoutingProvider {
  calculateRoute(stops: { lat: number; lng: number }[]): Promise<RouteResult>;
}

export interface RouteResult {
  totalDistanceKm: number;
  totalDurationMinutes: number;
  optimizedStops: { lat: number; lng: number; index: number }[]; // Index in original array
}
