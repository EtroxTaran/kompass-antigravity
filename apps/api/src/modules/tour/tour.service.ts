import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { TourRepository } from './tour.repository';
import {
  CreateTourDto,
  UpdateTourDto,
  OptimizeTourDto,
  OptimizedRouteResponse,
} from './dto/tour.dto';
import type { RoutingProvider } from './providers/routing-provider.interface';

@Injectable()
export class TourService {
  constructor(
    private readonly repository: TourRepository,
    @Inject('ROUTING_PROVIDER')
    private readonly routingProvider: RoutingProvider,
  ) {}

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
   * Optimize route using the configured RoutingProvider
   */
  async optimizeRoute(dto: OptimizeTourDto): Promise<OptimizedRouteResponse> {
    if (!dto.stops || dto.stops.length === 0) {
      throw new BadRequestException('At least one stop is required');
    }

    // Combine startLocation (if present) and stops into a single array for processing
    const allPoints = [];
    if (dto.startLocation) {
      allPoints.push({ ...dto.startLocation, isStart: true });
    }

    // Map DTO stops to format
    const dtoStops = dto.stops.map((s, i) => ({
      lat: s.lat,
      lng: s.lng,
      originalDtoIndex: i,
    }));
    allPoints.push(...dtoStops);

    // If only one point total, no route
    if (allPoints.length <= 1) {
      return {
        stops: dto.stops,
        totalDistanceKm: 0,
        estimatedDurationMinutes: 15,
      };
    }

    // Call provider
    const result = await this.routingProvider.calculateRoute(allPoints);

    // Map back result to OptimizeTourStopDto[]
    // The result.optimizedStops contains indices relative to `allPoints`.
    // We need to return only the "stops" part of the DTO, reordered.
    // DOES the return value exclude startLocation?
    // The `OptimizedRouteResponse` expects `stops: OptimizeTourStopDto[]`.
    // Existing logic returned only the stops, or did it include start?
    // DTO definition: `stops: OptimizeTourStopDto[]`.
    // Existing logic: `nearestNeighborOptimize(stops, startLocation)`.
    // It returned `route` which was `stops` reordered. It did NOT include `startLocation` in the result `stops`.

    // So filter out the start location if it was added.
    const sortedStops = result.optimizedStops
      .filter((s: any) => {
        // If we added startLocation manually and it wasn't one of the stops, we filter it out.
        // In `allPoints`, index 0 was startLocation if provided.
        // If `dto.startLocation` was provided, index 0 corresponds to it.
        // But `optimizedStops` has `index` property which maps to `allPoints` index.
        if (dto.startLocation && s.index === 0) return false;
        return true;
      })
      .map((s) => {
        // Get the original DTO stop
        // If startLocation was present, indices shifted by 1.
        const originalIndex = dto.startLocation ? s.index - 1 : s.index;
        // Safety check
        if (originalIndex < 0 || originalIndex >= dto.stops.length) return null;
        return dto.stops[originalIndex];
      })
      .filter((s): s is any => s !== null);

    return {
      stops: sortedStops,
      totalDistanceKm: result.totalDistanceKm,
      estimatedDurationMinutes: result.totalDurationMinutes,
    };
  }
}
