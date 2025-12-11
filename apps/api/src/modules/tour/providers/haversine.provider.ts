import { Injectable } from '@nestjs/common';
import { RoutingProvider, RouteResult } from './routing-provider.interface';

@Injectable()
export class HaversineProvider implements RoutingProvider {
  async calculateRoute(
    stops: { lat: number; lng: number }[],
  ): Promise<RouteResult> {
    if (stops.length <= 1) {
      return {
        totalDistanceKm: 0,
        totalDurationMinutes: 0,
        optimizedStops: stops.map((_, index) => ({ ...stops[index], index })),
      };
    }

    const { route, totalDistance } = this.nearestNeighborOptimize(stops);
    const duration = this.calculateDuration(totalDistance, stops.length);

    return {
      totalDistanceKm: Math.round(totalDistance * 10) / 10,
      totalDurationMinutes: Math.round(duration),
      optimizedStops: route.map((stop) => ({
        lat: stop.lat,
        lng: stop.lng,
        index: stop.originalIndex,
      })),
    };
  }

  private nearestNeighborOptimize(stops: { lat: number; lng: number }[]): {
    route: { lat: number; lng: number; originalIndex: number }[];
    totalDistance: number;
  } {
    const indexedStops = stops.map((s, i) => ({ ...s, originalIndex: i }));

    const unvisited = [...indexedStops];
    const route: typeof indexedStops = [];
    let totalDistance = 0;

    // Start with the first stop (assumed specific start location passed as first element)
    let current = unvisited.shift()!;
    route.push(current);

    while (unvisited.length > 0) {
      let nearestIndex = -1;
      let nearestDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const dist = this.haversineDistance(
          current.lat,
          current.lng,
          unvisited[i].lat,
          unvisited[i].lng,
        );
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestIndex = i;
        }
      }

      if (nearestIndex !== -1) {
        totalDistance += nearestDistance;
        current = unvisited.splice(nearestIndex, 1)[0];
        route.push(current);
      }
    }

    return { route, totalDistance };
  }

  // Reworking calculateRoute to handle the indexing better
  // overriding the method above with a cleaner version in the actual file write

  private calculateDuration(distanceKm: number, stopCount: number): number {
    const travelTimeMinutes = (distanceKm / 40) * 60; // 40 km/h average
    const stopTimeMinutes = stopCount * 15; // 15 min per stop
    return travelTimeMinutes + stopTimeMinutes;
  }

  private haversineDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}
