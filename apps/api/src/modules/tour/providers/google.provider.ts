import { Injectable, Logger } from '@nestjs/common';
import { RoutingProvider, RouteResult } from './routing-provider.interface';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GoogleProvider implements RoutingProvider {
  private readonly logger = new Logger(GoogleProvider.name);

  constructor(private configService: ConfigService) {}

  async calculateRoute(
    stops: { lat: number; lng: number }[],
  ): Promise<RouteResult> {
    const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
    if (!apiKey) {
      throw new Error('GOOGLE_MAPS_API_KEY not configured');
    }

    if (stops.length <= 1) {
      return {
        totalDistanceKm: 0,
        totalDurationMinutes: 0,
        optimizedStops: stops.map((_, i) => ({ ...stops[i], index: i })),
      };
    }

    const origin = stops[0];
    const destination = stops[stops.length - 1]; // In TSP we might return to start, but here we treat list as A->...->Z?
    // Actually, "Optimize Route" usually means A -> [Permute Others] -> Z?
    // Or A -> [Permute All Remaining].
    // Our interface takes "stops". Usually stops[0] is start.
    // If not roundtrip, we usually specify end?
    // TourService logic was "stops" + "startLocation".
    // I am collapsing them into "stops" (with start as 0) for the interface.
    // To allow Full Optimization, we should set intermediates.

    // For Google API:
    // origin: stops[0]
    // destination: stops[0] (if roundtrip) or stops[last]?
    // Let's assume for now we want valid TSP behavior: Start at A, Visit B, C, D... End at last?
    // Or End at Start?
    // TourService logic: "while unvisited > 0". Typically implies Open TSP or Closed TSP.
    // Let's assume Open TSP (End anywhere) is NOT what is usually wanted for delivery.
    // Usually it's Roundtrip or End at Depot.
    // The current Tour code has `startLocation` and `endLocation` properties on the Tour entity.
    // The `OptimizeTourDto` has `startLocation` and `stops`.
    // It doesn't explicitly specify `endLocation`.
    // Let's assume we treat the route as Start -> [Others] -> End?
    // If `endLocation` is not in `stops`, it's open ended?

    // Let's stick to simple assumption:
    // Input `stops` includes Start (index 0).
    // Intermediates: 1..N.
    // Destination: same as Start?
    // For now, let's treat it as: Start at 0, End at Last (if different) or same?

    // Google API `optimizeWaypointOrder: true` reorders `intermediates`.
    // It does NOT reorder `origin` or `destination`.

    const intermediates = stops.slice(1).map((s) => ({
      location: { latLng: { latitude: s.lat, longitude: s.lng } },
    }));

    // If we only have 2 points (Start, End), nothing to optimize.

    const url = 'https://routes.googleapis.com/directions/v2:computeRoutes';

    try {
      const response = await axios.post(
        url,
        {
          origin: {
            location: {
              latLng: { latitude: origin.lat, longitude: origin.lng },
            },
          },
          destination: {
            location: {
              latLng: { latitude: origin.lat, longitude: origin.lng },
            },
          }, // Roundtrip by default?
          intermediates: intermediates,
          travelMode: 'DRIVE',
          optimizeWaypointOrder: true,
          routingPreference: 'TRAFFIC_AWARE',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask':
              'routes.duration,routes.distanceMeters,routes.optimizedIntermediateWaypointIndex',
          },
        },
      );

      const route = response.data.routes[0];

      // Google returns `optimizedIntermediateWaypointIndex` which is the new order of INTERMEDIATES.
      // E.g. [2, 0, 1] meaning: Old Index 2 is now first, Old Index 0 is second...
      // Wait. "The list contains the zero-based index of the intermediate waypoint in the request"
      // So validation:
      // Result: Stop 0 (Origin), Stop X, Stop Y, Stop Z, Stop 0 (Dest).
      // optimizedIntermediateWaypointIndex = [index_of_X_in_intermediates, ...]

      const optimizedStops = [
        { ...origin, index: 0 },
        ...(route.optimizedIntermediateWaypointIndex || []).map(
          (newIndex: number) => {
            const originalIndex = newIndex + 1; // +1 because we sliced 0
            return { ...stops[originalIndex], index: originalIndex };
          },
        ),
        { ...origin, index: 0 }, // Add destination? Use last?
      ];

      // Note: This logic assumes Roundtrip to Origin.
      // We should arguably be smarter about "Destination".
      // But given the scope, this is a placeholder implementation.

      return {
        totalDistanceKm: (route.distanceMeters || 0) / 1000,
        totalDurationMinutes: parseInt(route.duration || '0') / 60,
        optimizedStops: optimizedStops,
      };
    } catch (error) {
      this.logger.error('Google Routes API Failed', error);
      throw error;
    }
  }
}
