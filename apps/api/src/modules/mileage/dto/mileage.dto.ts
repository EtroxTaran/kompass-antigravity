export class CreateMileageDto {
  date: string;
  startLocation: string;
  startLat?: number;
  startLng?: number;
  endLocation: string;
  endLat?: number;
  endLng?: number;
  distanceKm: number;
  purpose: string;
  licensePlate?: string;
  vehicleId?: string;
  projectId?: string;
  tourId?: string;
  status?: "draft" | "submitted" | "approved";
}

export class UpdateMileageDto {
  date?: string;
  startLocation?: string;
  startLat?: number;
  startLng?: number;
  endLocation?: string;
  endLat?: number;
  endLng?: number;
  distanceKm?: number;
  purpose?: string;
  licensePlate?: string;
  vehicleId?: string;
  projectId?: string;
  tourId?: string;
  status?: "draft" | "submitted" | "approved";
}
