import { BaseEntity } from "./base";

export interface Mileage extends BaseEntity {
  type: "mileage";

  userId: string;
  date: string; // ISO date

  // Vehicle
  vehicleId?: string;
  licensePlate?: string; // If personal car

  // Trip
  startLocation: string;
  startLat?: number;
  startLng?: number;

  endLocation: string;
  endLat?: number;
  endLng?: number;

  distanceKm: number;

  // Purpose
  purpose: string; // e.g. "Client visit Smith Corp"
  projectId?: string;
  tourId?: string;

  // Status
  status: "draft" | "submitted" | "approved";
}
