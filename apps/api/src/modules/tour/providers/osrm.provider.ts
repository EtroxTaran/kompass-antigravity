import { Injectable, Logger } from '@nestjs/common';
import { RoutingProvider, RouteResult } from './routing-provider.interface';
import axios from 'axios';

@Injectable()
export class OSRMProvider implements RoutingProvider {
  private readonly logger = new Logger(OSRMProvider.name);

  // Use 'trip' service for TSP optimization
  // https://project-osrm.org/docs/v5.24.0/api/#trip-service
  private readonly baseUrl = 'http://router.project-osrm.org/trip/v1/driving';

  async calculateRoute(
    stops: { lat: number; lng: number }[],
  ): Promise<RouteResult> {
    if (stops.length <= 1) {
      return {
        totalDistanceKm: 0,
        totalDurationMinutes: 0,
        optimizedStops: stops.map((_, i) => ({ ...stops[i], index: i })),
      };
    }

    // OSRM format: {lng},{lat};{lng},{lat}
    const coordinates = stops
      .map((stop) => `${stop.lng},${stop.lat}`)
      .join(';');

    // source=first: The route must start at the first coordinate
    // roundtrip=false: The route does not have to return to the start point (Open TSP)
    // Note: If you want a roundtrip (standard tour), set roundtrip=true. 
    // Given the UI allows "Add Stop", usually a user plans a day tour which often starts/ends at same place.
    // However, if the user list doesn't explicitly duplicate the start, OSRM does it for us with roundtrip=true.
    // But 'TourService' expects a list of stops to visit. 
    // Let's use roundtrip=false for now to allow open ended trips, as 'source=first' fixes the start.
    const tripUrl = `${this.baseUrl}/${coordinates}?source=first&roundtrip=false`;

    try {
      this.logger.debug(`Calling OSRM Trip API: ${tripUrl}`);
      const response = await axios.get(tripUrl);

      if (response.data.code !== 'Ok') {
        throw new Error(`OSRM API Error: ${response.data.code}`);
      }

      const trip = response.data.trips[0];
      const waypoints = response.data.waypoints;

      // 'waypoints' array in the response is sorted by the visit order.
      // Each waypoint object has 'waypoint_index' which corresponds to the input index.
      const optimizedStops = waypoints.map((wp: any) => ({
        lat: wp.location[1],
        lng: wp.location[0],
        index: wp.waypoint_index,
      }));

      return {
        totalDistanceKm: trip.distance / 1000, // meters to km
        totalDurationMinutes: trip.duration / 60, // seconds to minutes
        optimizedStops: optimizedStops,
      };
    } catch (error) {
      this.logger.error('OSRM Failed', error);
      throw error;
    }
  }
}
