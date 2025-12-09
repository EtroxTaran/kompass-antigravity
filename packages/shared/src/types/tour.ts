import { BaseEntity } from "./base";

export interface TourStop {
  locationId?: string; // Link to Location entity
  address?: string; // Manual address if no location linked
  name: string; // Name of stop (Customer name or "Warehouse")
  arrivalTime?: string;
  departureTime?: string;
  activityType?: "delivery" | "pickup" | "service" | "visit";
  notes?: string;
  completed: boolean;
}

export interface Tour extends BaseEntity {
  type: "tour";

  name: string; // e.g. "Tour North - 2023-12-10"
  date: string; // ISO date

  // Resources
  driverId: string;
  vehicleId?: string;

  // Route
  startLocation: string;
  endLocation: string;
  stops: TourStop[];

  // Metrics
  totalDistanceKm?: number;
  totalDurationMinutes?: number;

  // Status
  status: "planned" | "in_progress" | "completed" | "cancelled";
}
