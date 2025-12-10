import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TourRepository } from './tour.repository';
import {
  CreateTourDto,
  UpdateTourDto,
  OptimizeTourDto,
  OptimizeTourStopDto,
  OptimizedRouteResponse,
} from './dto/tour.dto';

@Injectable()
export class TourService {
  constructor(private readonly repository: TourRepository) { }

  async create(dto: CreateTourDto, userId: string) {
    const tour: any = {
      ...dto,
      status: 'planned',
    };
    return this.repository.create(tour, userId);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const tour = await this.repository.findById(id);
    if (!tour) {
      throw new NotFoundException(`Tour with ID ${id} not found`);
    }
    return tour;
  }

  async update(id: string, dto: UpdateTourDto, userId: string) {
    return this.repository.update(id, dto, userId);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id, 'system');
  }

  /**
   * Optimize route using nearest-neighbor algorithm (TSP heuristic)
   */
  optimizeRoute(dto: OptimizeTourDto): OptimizedRouteResponse {
    if (!dto.stops || dto.stops.length === 0) {
      throw new BadRequestException('At least one stop is required');
    }

    if (dto.stops.length === 1) {
      return {
        stops: dto.stops,
        totalDistanceKm: 0,
        estimatedDurationMinutes: 15, // Just the stop time
      };
    }

    // Use nearest-neighbor algorithm starting from first stop or startLocation
    const optimizedStops = this.nearestNeighborOptimize(
      dto.stops,
      dto.startLocation,
    );

    // Calculate total distance and duration
    const totalDistanceKm = this.calculateTotalDistance(optimizedStops);
    const estimatedDurationMinutes = this.calculateDuration(
      totalDistanceKm,
      optimizedStops.length,
    );

    return {
      stops: optimizedStops,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10, // Round to 1 decimal
      estimatedDurationMinutes: Math.round(estimatedDurationMinutes),
    };
  }

  /**
   * Nearest-neighbor TSP algorithm
   * Start from the first stop and always go to the nearest unvisited stop
   */
  private nearestNeighborOptimize(
    stops: OptimizeTourStopDto[],
    startLocation?: { lat: number; lng: number },
  ): OptimizeTourStopDto[] {
    const unvisited = [...stops];
    const route: OptimizeTourStopDto[] = [];

    // Determine starting point
    let currentLat = startLocation?.lat ?? stops[0].lat;
    let currentLng = startLocation?.lng ?? stops[0].lng;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      // Find nearest unvisited stop
      for (let i = 0; i < unvisited.length; i++) {
        const distance = this.haversineDistance(
          currentLat,
          currentLng,
          unvisited[i].lat,
          unvisited[i].lng,
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = i;
        }
      }

      // Move to nearest stop
      const nearest = unvisited.splice(nearestIndex, 1)[0];
      route.push(nearest);
      currentLat = nearest.lat;
      currentLng = nearest.lng;
    }

    return route;
  }

  /**
   * Calculate total route distance in kilometers
   */
  private calculateTotalDistance(stops: OptimizeTourStopDto[]): number {
    let total = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      total += this.haversineDistance(
        stops[i].lat,
        stops[i].lng,
        stops[i + 1].lat,
        stops[i + 1].lng,
      );
    }
    return total;
  }

  /**
   * Estimate duration based on distance and stops
   * Assumes 40 km/h average speed + 15 minutes per stop
   */
  private calculateDuration(distanceKm: number, stopCount: number): number {
    const travelTimeMinutes = (distanceKm / 40) * 60; // 40 km/h average
    const stopTimeMinutes = stopCount * 15; // 15 min per stop
    return travelTimeMinutes + stopTimeMinutes;
  }

  /**
   * Haversine formula for distance between two points on Earth
   * Returns distance in kilometers
   */
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
