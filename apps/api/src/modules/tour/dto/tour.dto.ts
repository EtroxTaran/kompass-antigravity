export class CreateTourDto {
  name: string;
  date: string;
  driverId: string;
  vehicleId?: string;
  startLocation: string;
  endLocation: string;
  stops: TourStopDto[];
}

export class TourStopDto {
  locationId?: string;
  address?: string;
  name: string;
  arrivalTime?: string;
  departureTime?: string;
  activityType?: 'delivery' | 'pickup' | 'service' | 'visit';
  notes?: string;
  completed: boolean;
}

export class UpdateTourDto {
  name?: string;
  date?: string;
  driverId?: string;
  vehicleId?: string;
  startLocation?: string;
  endLocation?: string;
  stops?: TourStopDto[];
  totalDistanceKm?: number;
  totalDurationMinutes?: number;
  status?: 'planned' | 'in_progress' | 'completed' | 'cancelled';
}

// Route optimization DTOs
export class OptimizeTourStopDto {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export class OptimizeTourDto {
  stops: OptimizeTourStopDto[];
  startLocation?: { lat: number; lng: number };
}

export class OptimizedRouteResponse {
  stops: OptimizeTourStopDto[];
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
}
